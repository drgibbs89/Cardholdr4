// @ts-nocheck
import React from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Avatar } from '../ui';
import { safeUrl } from '../../lib/safety';
import { Card3D } from '../cards/Card3D';

function PublicProfilePage({card,onGetApp,publicContacts,isLoggedIn,onSelectContact}){
  let c1=(card.color&&card.color[0])||'#8b5cf6';
  let c2=(card.color&&card.color[1])||'#6366f1';
  let vcard='BEGIN:VCARD\nVERSION:3.0\nFN:'+(card.name||'')+'\nORG:'+(card.company||'')+'\nTITLE:'+(card.title||'')+'\nEMAIL:'+(card.email||'')+'\nTEL:'+(card.phone||'')+'\nEND:VCARD';
  let vh='data:text/vcard;charset=utf-8,'+encodeURIComponent(vcard);
  let [stackTab,setStackTab]=React.useState(function(){return publicContacts&&publicContacts.length?'contacts':'card';});
  let [publicContactsView,setPublicContactsView]=React.useState('carousel');
  let [publicContactIndex,setPublicContactIndex]=React.useState(0);
  let publicSwipeRef=React.useRef(null);
  let publicSafeIdx=Math.min(publicContactIndex,Math.max(0,(publicContacts||[]).length-1));
  let publicContact=publicContacts&&publicContacts[publicSafeIdx];
  function getPublicVisible(){if(!publicContacts||!publicContacts.length)return[];return[-2,-1,0,1,2].map((i)=>{return{card:publicContacts[(publicSafeIdx+i+publicContacts.length)%publicContacts.length],offset:i};});}
  function setPublicContactIndexWithClick(updater,count){if(navigator.vibrate&&count)navigator.vibrate(Array(Math.min(3,count)).fill(8));setPublicContactIndex(updater);}
  function startPublicSwipe(e){if(!publicContacts||publicContacts.length<2)return;let target=e.target;if(target&&target.closest&&target.closest('[data-center-card="true"]'))return;let p=e.touches&&e.touches[0]?e.touches[0]:e;publicSwipeRef.current={x:p.clientX,y:p.clientY,t:performance.now(),active:true};}
  function movePublicSwipe(e){let s=publicSwipeRef.current;if(!s||!s.active)return;let p=e.touches&&e.touches[0]?e.touches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.3&&e.cancelable)e.preventDefault();}
  function endPublicSwipe(e){let s=publicSwipeRef.current;if(!s||!s.active)return;let p=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;publicSwipeRef.current=null;if(Math.abs(dx)<64||Math.abs(dx)<Math.abs(dy)*1.35)return;let elapsed=Math.max(1,performance.now()-(s.t||performance.now()));let speed=Math.abs(dx)/elapsed;let distanceSteps=Math.floor(Math.abs(dx)/150);let velocitySteps=Math.floor(speed/0.55);let steps=Math.max(1,distanceSteps,velocitySteps);steps=Math.min(steps,publicContacts.length-1);setPublicContactIndexWithClick(function(i){let dir=dx<0?1:-1;return(i+(dir*steps)+publicContacts.length*steps)%publicContacts.length;},steps);}
  function openPublicContact(contact){if(isLoggedIn&&onSelectContact)onSelectContact(contact);}
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(13,11,30,0.8)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10}}>
        {isLoggedIn?<button onClick={onGetApp} style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',color:'white',borderRadius:'10px',padding:'8px 11px',cursor:'pointer',fontSize:'13px',fontWeight:700}}><ChevronLeft size={16}/> Back</button>:<span style={{fontWeight:900,fontSize:'16px',background:'linear-gradient(to right,#a78bfa,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>CardHoldr</span>}
        {!isLoggedIn&&<button onClick={onGetApp} style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 16px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Get the App</button>}
      </div>
      <div style={{maxWidth:'480px',margin:'0 auto',padding:'32px 20px 48px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'24px'}}>
          <div style={{width:'88px',height:'88px',borderRadius:'50%',background:'linear-gradient(135deg,'+c1+','+c2+')',border:'3px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'14px',fontSize:'36px',fontWeight:900,color:'white',overflow:'hidden'}}>{card.avatarUrl?<img src={card.avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(card.name||'?').charAt(0)}</div>
          <h1 style={{fontSize:'26px',fontWeight:900,margin:'0 0 4px',textAlign:'center'}}>{card.name}</h1>
          {card.username&&<p style={{fontSize:'14px',color:'#a78bfa',margin:'0 0 4px',textAlign:'center',fontWeight:700}}>@{card.username}</p>}
          {card.title&&<p style={{fontSize:'14px',color:'rgba(255,255,255,0.55)',margin:'0 0 2px',textAlign:'center'}}>{card.title}</p>}
          {card.company&&<p style={{fontSize:'14px',fontWeight:650,color:'rgba(255,255,255,0.62)',margin:'2px 0 0',textAlign:'center'}}>{card.company}</p>}
        </div>

        <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:'12px',padding:'3px',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'20px'}}>
          {[['card','Card'],['contacts','Contacts'+(publicContacts&&publicContacts.length?' ('+publicContacts.length+')':'')]].map((pair)=>{let isActive=stackTab===pair[0];return(<button key={pair[0]} onClick={function(){setStackTab(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,background:isActive?'linear-gradient(135deg,'+c1+','+c2+')':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
        </div>

        {stackTab==='card'&&(
          <>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}><div style={{width:'100%',maxWidth:'300px',height:'172px'}}><Card3D card={card} isCenter={true} style={{width:'100%',height:'100%'}} photo={card.avatarUrl} autoFlip={true}/></div></div>
            <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',marginBottom:'24px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
            <a href={vh} download={(card.name||'contact').replace(/\s+/g,'-')+'.vcf'} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',width:'100%',padding:'15px',borderRadius:'14px',background:'linear-gradient(135deg,'+c1+','+c2+')',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:800,marginBottom:'12px',boxSizing:'border-box'}}><Download size={18}/> Save to Contacts</a>
            {[card.phone&&['Phone',card.phone,'tel:'+card.phone],card.email&&['Email',card.email,'mailto:'+card.email],card.website&&['Website',card.website,safeUrl(card.website)]].filter(Boolean).length>0&&(
              <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'16px'}}>
                {[card.phone&&['Phone',card.phone,'tel:'+card.phone],card.email&&['Email',card.email,'mailto:'+card.email],card.website&&['Website',card.website,safeUrl(card.website)]].filter(Boolean).map((row,i,arr)=>{return(<a key={row[0]} href={row[2]} target={row[0]==='Website'?'_blank':undefined} rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 18px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none',textDecoration:'none'}}><div style={{flex:1}}><div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',fontWeight:600,marginBottom:'1px'}}>{row[0]}</div><div style={{fontSize:'14px',color:'white'}}>{row[1]}</div></div><ChevronRight size={14} color="rgba(255,255,255,0.3)"/></a>);})}
              </div>
            )}
          </>
        )}

        {stackTab==='contacts'&&(
          <>
            {!publicContacts||publicContacts.length===0?(
              <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
                <div style={{fontSize:'36px',marginBottom:'12px'}}>Private</div>
                <div style={{fontSize:'15px',fontWeight:600,marginBottom:'6px'}}>Network is private</div>
                <div style={{fontSize:'13px',lineHeight:1.5}}>{card.name} hasn't made their network public yet.</div>
              </div>
            ):(
              <div>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'14px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['carousel','Carousel'],['stack','Stack']].map((pair)=>{let active=publicContactsView===pair[0];return(<button key={pair[0]} onClick={function(){setPublicContactsView(pair[0]);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:active?800:600,background:active?'linear-gradient(135deg,'+c1+','+c2+')':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}</div></div>
                {publicContactsView==='carousel'?(
                  <>
                    <div data-carousel-swipe="true" onMouseDown={startPublicSwipe} onMouseMove={movePublicSwipe} onMouseUp={endPublicSwipe} onMouseLeave={function(){publicSwipeRef.current=null;}} onTouchStart={startPublicSwipe} onTouchMove={movePublicSwipe} onTouchEnd={endPublicSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                      <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                        {getPublicVisible().map((item)=>{let pcard=Object.assign({email:'',phone:'',cardType:'professional'},item.card);let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);return(
                          <Card3D key={'public-contact-'+pcard.id+'-'+offset} card={pcard} isCenter={isCenter} autoFlip={false}
                            onNameClick={isCenter?function(){openPublicContact(pcard);}:undefined}
                            onClick={!isCenter?function(e){e.stopPropagation();setPublicContactIndexWithClick(function(i){return(i+offset+publicContacts.length)%publicContacts.length;},Math.abs(offset));}:undefined}
                            style={{position:'absolute',width:'88%',maxWidth:'310px',height:'177px',transform:'translateX('+(offset*72)+'%) scale('+(isCenter?1:0.74)+')',transformOrigin:'center center',zIndex:isCenter?30:20-absOff,opacity:isCenter?1:Math.max(0.15,0.45-absOff*0.15),transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1),opacity 0.45s',cursor:'pointer',touchAction:isCenter?'none':'pan-y'}}
                            data-carousel-card="true" data-center-card={isCenter?'true':undefined}/>
                        );})}
                      </div>
                    </div>
                    <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',margin:'0 0 10px',fontWeight:600}}>&lt;-- Swipe side cards to scroll --&gt;</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                      <button onClick={function(){setPublicContactIndexWithClick(function(i){return(i-1+publicContacts.length)%publicContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}><ChevronLeft size={15}/> Prev</button>
                      <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:700}}>{(publicSafeIdx+1)+' / '+publicContacts.length}</div>
                      <button onClick={function(){setPublicContactIndexWithClick(function(i){return(i+1)%publicContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}>Next <ChevronRight size={15}/></button>
                    </div>
                  </>
                ):(
                  <>
                    {publicContacts.map((contact,i)=>{return(
                      <div key={'public-stack-'+String(contact.id||i)+'-'+(contact.username||contact.name||i)} onClick={function(){openPublicContact(contact);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderRadius:'12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'8px',cursor:isLoggedIn?'pointer':'default'}}>
                        <Avatar contact={contact} size={42}/>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:'14px',fontWeight:700,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.name}</div><div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.title}{contact.title&&contact.company?' · ':''}{contact.company}</div></div>
                        {isLoggedIn?<button onClick={function(e){e.stopPropagation();openPublicContact(contact);}} style={{background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:'8px',padding:'5px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700,flexShrink:0}}>View</button>:<a href={'https://cardholdr.co/'+(contact.name||'user').toLowerCase().replace(/[^a-z0-9]+/g,'-')} target="_blank" rel="noopener noreferrer" style={{background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:'8px',padding:'5px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700,textDecoration:'none',flexShrink:0}}>View</a>}
                      </div>
                    );})}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!isLoggedIn&&<div style={{background:'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.08))',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'16px',padding:'20px',textAlign:'center',marginTop:'8px'}}>
          <div style={{fontSize:'13px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'8px'}}>CARDHOLDR</div>
          <div style={{fontSize:'15px',fontWeight:800,color:'white',marginBottom:'6px'}}>Connect on CardHoldr</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'14px',lineHeight:1.5}}>Exchange cards, message, and stay connected.</div>
          <button onClick={onGetApp} style={{width:'100%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',border:'none',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:700,fontSize:'14px'}}>Get CardHoldr Free</button>
        </div>}
      </div>
    </div>
  );
}

export { PublicProfilePage };
