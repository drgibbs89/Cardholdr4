// @ts-nocheck
import React from 'react';
import { Plus, Search, Heart } from 'lucide-react';
import { BackButton, Avatar, PrivacyBadge, StackVisibilityToggle, LeadBadge } from '../ui';
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from '../../constants/cardData';
import { getDefaultPrivacy } from '../../lib/safety';
import { normalizeUsername } from '../../services/dataMappers';

function cardMatchesSearch(c,q){
  q=(q||'').toLowerCase().replace(/^@+/,'');
  if(!q)return true;
  return(c.name||'').toLowerCase().includes(q)||(c.company||'').toLowerCase().includes(q)||(c.title||'').toLowerCase().includes(q)||(c.leadInterest||'').toLowerCase().includes(q)||(c.username||'').toLowerCase().includes(q)||(c.instagram||'').toLowerCase().includes(q)||(c.twitter||'').toLowerCase().includes(q)||(c.linkedin||'').toLowerCase().includes(q);
}

function CardSearchDropdown({query,results,onSelect,visible}){
  let q=(query||'').trim();
  if(!visible||!q)return null;
  let list=results||[];
  return(
    <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,zIndex:60,background:'rgba(20,18,50,0.98)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',maxHeight:'min(280px,50vh)',overflowY:'auto'}}>
      {list.length===0?(
        <div style={{padding:'12px 14px',fontSize:'13px',color:'rgba(255,255,255,0.35)'}}>No cards match &ldquo;{q}&rdquo;</div>
      ):(
        list.map(function(c,i){
          let sub=c.cardType==='lead'?(c.leadStatus||'Lead'):((c.title||'')+(c.title&&c.company?' · ':'')+(c.company||''));
          let un=normalizeUsername(c.username);
          return(
            <button key={'stack-search-'+(c.cardType||'card')+'-'+String(c.id)+'-'+(normalizeUsername(c.username)||i)} type="button" onClick={function(){onSelect(c);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'none',border:'none',borderBottom:i<list.length-1?'1px solid rgba(255,255,255,0.06)':'none',color:'white',cursor:'pointer',textAlign:'left',fontFamily:'inherit'}}>
              <Avatar contact={c} size={36}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name||'Unnamed'}</div>
                {sub&&<div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sub}</div>}
                {un&&<div style={{fontSize:'10px',color:'rgba(167,139,250,0.9)',marginTop:'1px'}}>@{un}</div>}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}

function CardStackScreen({contacts,onSelectContact,cardTypeFilter,setCardTypeFilter,isPro,onAddLead,onEditLead,onToggleHidden,stackPublic,onToggleStackPublic,showSeedData,onRemoveSamples,onBack}){
  let [stackSearch,setStackSearch]=React.useState('');
  let [stackSearchFocused,setStackSearchFocused]=React.useState(false);
  let [stackView,setStackView]=React.useState('contacts');
  let [leadStatusFilter,setLeadStatusFilter]=React.useState('All');
  let [starredIds,setStarredIds]=React.useState(function(){return new Set(contacts.filter((c)=>{return c.favorite;}).map((c)=>{return c.id;}));});
  let [exportedIds,setExportedIds]=React.useState(new Set());
  React.useEffect(function(){if(!isPro&&stackView==='leads')setStackView('contacts');},[isPro,stackView]);
  function toggleStar(e,id){e.stopPropagation();setStarredIds(function(prev){let n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});}
  let leads=contacts.filter((c)=>{return c.cardType==='lead';});
  let regular=contacts.filter((c)=>{return c.cardType!=='lead';}).filter((c)=>{if(cardTypeFilter==='pro')return c.cardType==='professional';if(cardTypeFilter==='personal')return c.cardType!=='professional';return true;}).filter((c)=>{if(!stackSearch)return true;return cardMatchesSearch(c,stackSearch);});
  let filteredLeads=leads.filter((c)=>{if(leadStatusFilter!=='All'&&c.leadStatus!==leadStatusFilter)return false;if(!stackSearch)return true;return cardMatchesSearch(c,stackSearch);});
  let stackSearchResults=stackView==='leads'?filteredLeads:regular;
  return(
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'18px 10px 100px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',padding:'0 6px',gap:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
          {onBack&&<BackButton onClick={onBack} label="Back to home"/>}
          <div><h2 style={{fontSize:'26px',fontWeight:800,color:'white',marginBottom:'2px'}}>Card Stack</h2><p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>{isPro?regular.length+' contacts · '+leads.length+' leads':regular.length+' contacts'}</p></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <button onClick={onRemoveSamples} style={{background:showSeedData?'rgba(255,255,255,0.07)':'rgba(139,92,246,0.15)',border:'1px solid '+(showSeedData?'rgba(255,255,255,0.15)':'rgba(139,92,246,0.4)'),color:showSeedData?'rgba(255,255,255,0.5)':'#a78bfa',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',fontSize:'12px',fontWeight:700,whiteSpace:'nowrap'}}>{showSeedData?'Hide Sample Cards':'Show Sample Cards'}</button>
          {isPro&&stackView==='leads'&&<button onClick={onAddLead} style={{background:'linear-gradient(to right,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'10px',padding:'8px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:700}}><Plus size={15}/> Add Lead</button>}
        </div>
      </div>
      <div style={{position:'relative',marginBottom:'12px',padding:'0 6px',zIndex:40}}>
        <input value={stackSearch} onChange={function(e){setStackSearch(e.target.value);}} onFocus={function(){setStackSearchFocused(true);}} onBlur={function(){setTimeout(function(){setStackSearchFocused(false);},150);}} placeholder="Search name, company, @name, social..." style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
        <Search size={14} style={{position:'absolute',left:'20px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)',pointerEvents:'none'}}/>
        <CardSearchDropdown query={stackSearch} results={stackSearchResults} visible={stackSearchFocused&&!!stackSearch.trim()} onSelect={function(c){setStackSearch('');setStackSearchFocused(false);onSelectContact(c);}}/>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'12px',padding:'0 6px'}}>
        {(isPro?[['contacts','Contacts'],['leads','Leads']]:[['contacts','Contacts']]).map((pair)=>{return(<button key={pair[0]} onClick={function(){setStackView(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'11px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,background:stackView===pair[0]?'linear-gradient(to right,#8b5cf6,#6366f1)':'rgba(255,255,255,0.07)',color:stackView===pair[0]?'white':'rgba(255,255,255,0.5)'}}>{pair[1]}</button>);})}
      </div>
      {stackView==='contacts'&&(
        <div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
            <div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>
              {[['all','All'],['pro','Pro'],['personal','Personal']].map((pair)=>{let isActive=(cardTypeFilter||'all')===pair[0];return(<button key={pair[0]} onClick={function(){setCardTypeFilter(pair[0]);}} style={{padding:'6px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:isActive?700:500,background:isActive?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
            </div>
          </div>
          <div onClick={onToggleStackPublic} style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',padding:'11px 14px',borderRadius:'12px',background:stackPublic?'rgba(16,185,129,0.07)':'rgba(107,114,128,0.07)',border:'1px solid '+(stackPublic?'rgba(16,185,129,0.2)':'rgba(107,114,128,0.2)'),marginBottom:'14px'}}>
            <div style={{width:'36px',height:'20px',borderRadius:'10px',background:stackPublic?'#10b981':'rgba(255,255,255,0.15)',position:'relative',transition:'background 0.2s',flexShrink:0}}><div style={{position:'absolute',top:'2px',left:stackPublic?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/></div>
            <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'1px'}}>{stackPublic?'Stack is public':'Stack is private'}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.4}}>{stackPublic?'Your public connections are visible to others':'All your connections are hidden from everyone'}</div></div>
            {stackPublic?<PrivacyBadge privacy="public" small={true}/>:<PrivacyBadge hidden={true} small={true}/>}
          </div>
          {regular.length===0?(
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:'14px',fontWeight:800,letterSpacing:'0.08em',marginBottom:'12px'}}>NO CONTACTS</div>
              <div style={{fontSize:'15px',fontWeight:600}}>No contacts found</div>
            </div>
          ):(
            <div>
              {regular.map((c,i)=>{return(
                <div key={'stack-contact-'+(c.cardType||'contact')+'-'+String(c.id)+'-'+(normalizeUsername(c.username)||c.name||i)} style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div onClick={function(){onSelectContact(c);}} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px',cursor:'pointer'}}>
                    <Avatar contact={c} size={44}/>
                    <div style={{flex:1,minWidth:0,paddingTop:'1px'}}>
                      <div style={{fontSize:'14px',fontWeight:700,color:'white',marginBottom:'2px',display:'flex',alignItems:'center',gap:'6px'}}>
                        <span onClick={function(e){e.stopPropagation();onSelectContact(c);}} style={{cursor:'pointer',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</span>
                        {c.isSeed&&<span style={{fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'4px',background:'rgba(139,92,246,0.2)',color:'rgba(139,92,246,0.8)',border:'1px solid rgba(139,92,246,0.3)',flexShrink:0}}>SAMPLE</span>}
                      </div>
                      <div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}{c.title&&c.company?' · ':''}{c.company}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
                        <PrivacyBadge privacy={c.privacy||getDefaultPrivacy(c.cardType)} small={true}/>
                        {(c.tags||[]).map((tag)=>{return(<span key={tag} style={{fontSize:'10px',background:'rgba(109,72,255,0.25)',color:'#a78bfa',borderRadius:'5px',padding:'2px 7px',fontWeight:500}}>{tag}</span>);})}
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px',flexShrink:0}}>
                      <button onClick={function(e){toggleStar(e,c.id);}} style={{background:'none',border:'none',cursor:'pointer',padding:'0',fontSize:'18px',color:starredIds.has(c.id)?'#f59e0b':'rgba(255,255,255,0.2)',lineHeight:1}}><Heart size={18} fill={starredIds.has(c.id)?'#f59e0b':'none'}/></button>
                      {c.date&&<span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap'}}>{c.date}</span>}
                    </div>
                  </div>
                  <StackVisibilityToggle c={c} stackPublic={stackPublic} onToggleHidden={onToggleHidden}/>
                </div>
              );})}
            </div>
          )}
        </div>
      )}
      {stackView==='leads'&&isPro&&(
        <div>
          <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'12px',padding:'0 6px 2px'}}>
            {['All'].concat(LEAD_STATUSES).map((s)=>{let col=s==='All'?null:LEAD_STATUS_COLORS[s];return(<button key={s} onClick={function(){setLeadStatusFilter(s);}} style={{flexShrink:0,padding:'6px 14px',borderRadius:'20px',border:'1px solid '+(leadStatusFilter===s&&col?col:'rgba(255,255,255,0.1)'),background:leadStatusFilter===s?col?col+'22':'rgba(255,255,255,0.1)':'transparent',color:leadStatusFilter===s&&col?col:'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{s}{s!=='All'?' ('+leads.filter((l)=>{return l.leadStatus===s;}).length+')':''}</button>);})}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'14px',padding:'0 6px'}}>
            {LEAD_STATUSES.slice(0,3).map((s)=>{let col=LEAD_STATUS_COLORS[s];let count=leads.filter((l)=>{return l.leadStatus===s;}).length;return(<div key={s} style={{background:col+'11',border:'1px solid '+col+'33',borderRadius:'10px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:900,color:col}}>{count}</div><div style={{fontSize:'9px',color:col+'99',fontWeight:700,marginTop:'1px'}}>{s}</div></div>);})}
          </div>
          {filteredLeads.length===0?(
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:'14px',fontWeight:800,letterSpacing:'0.08em',marginBottom:'12px'}}>NO LEADS</div>
              <div style={{fontSize:'15px',fontWeight:600}}>No leads yet</div>
              <button onClick={onAddLead} style={{marginTop:'8px',background:'linear-gradient(to right,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'10px',padding:'10px 20px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>+ Add First Lead</button>
            </div>
          ):(
            <div>
              {filteredLeads.map((lead,i)=>{
                let col=LEAD_STATUS_COLORS[lead.leadStatus]||'#10b981';
                return(
                  <div key={'stack-lead-'+String(lead.id)+'-'+(normalizeUsername(lead.username)||lead.name||i)} onClick={function(){onSelectContact(lead);}} style={{cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px'}}>
                      <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,'+col+',#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',fontWeight:700,color:'white',flexShrink:0}}>{(lead.name||'?').charAt(0)}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'2px',flexWrap:'wrap'}}><span style={{fontSize:'14px',fontWeight:700,color:'white'}}>{lead.name}</span><LeadBadge status={lead.leadStatus} small={true}/></div>
                        {lead.leadInterest&&<div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.leadInterest}</div>}
                        {lead.leadBudget&&<div style={{fontSize:'11px',color:col,fontWeight:700}}>{lead.leadBudget}</div>}
                      </div>
                      <button onClick={function(e){e.stopPropagation();onEditLead(lead);}} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.5)',borderRadius:'6px',padding:'3px 8px',cursor:'pointer',fontSize:'11px',fontWeight:600,flexShrink:0}}>Edit</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { CardStackScreen };
