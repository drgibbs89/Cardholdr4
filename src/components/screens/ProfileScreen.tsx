// @ts-nocheck
import React from 'react';
import { ArrowLeft, Edit3, Share2, BarChart2, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShareCardModal } from '../modals';
import { Avatar, PrivacyBadge, StackVisibilityToggle } from '../ui';
import { CARD_COLORS, PRO_BADGE_DEFS } from '../../constants/cardData';
import { formatPhone, cleanObj, getDefaultPrivacy, sanitizeUsernameInput } from '../../lib/safety';
import { Card3D } from '../cards/Card3D';

function ProfileScreen({myCard,contacts,onSave,onClose,onShowAnalytics,photo,username,onSaveUsername,onAvatarUpload,onOpenUserProfile,searchProfiles,profileLink,onStyleChange,onColorChange,onLogout,onToggleHidden,onSelectContact,shareUsername}){
  let [editing,setEditing]=React.useState(false);
  let [form,setForm]=React.useState(Object.assign({},myCard));
  let [usernameForm,setUsernameForm]=React.useState(username||'');
  let [userSearch,setUserSearch]=React.useState('');
  let [userResults,setUserResults]=React.useState([]);
  let [userSearchBusy,setUserSearchBusy]=React.useState(false);
  let avatarInputRef=React.useRef(null);
  React.useEffect(function(){setUsernameForm(username||'');},[username]);
  React.useEffect(function(){
    if(!searchProfiles||userSearch.trim().length<2){setUserResults([]);return;}
    let cancelled=false;
    setUserSearchBusy(true);
    let t=setTimeout(function(){
      searchProfiles(userSearch,8).then(function(rows){
        if(!cancelled){setUserResults(rows||[]);setUserSearchBusy(false);}
      }).catch(function(){
        if(!cancelled){setUserResults([]);setUserSearchBusy(false);}
      });
    },280);
    return function(){cancelled=true;clearTimeout(t);};
  },[userSearch,searchProfiles]);
  let [viewCi,setViewCi]=React.useState(Math.max(0,CARD_COLORS.findIndex(function(c){return c[0]===(myCard.color&&myCard.color[0]);})));
  let [showShare,setShowShare]=React.useState(false);
  let [profileTab,setProfileTab]=React.useState('card');
  let [contactsView,setContactsView]=React.useState('carousel');
  let [profileContactIndex,setProfileContactIndex]=React.useState(0);
  let profileSwipeRef=React.useRef(null);
  let profileContacts=(contacts||[]).filter((c)=>{return c.cardType!=='lead';});
  let profileSafeIdx=Math.min(profileContactIndex,Math.max(0,profileContacts.length-1));
  let profileContact=profileContacts[profileSafeIdx];
  let profileShareCard=(profileTab==='contacts'&&contactsView==='carousel'&&profileContact)?profileContact:myCard;
  function getProfileVisible(){if(!profileContacts.length)return[];return[-2,-1,0,1,2].map((i)=>{return{card:profileContacts[(profileSafeIdx+i+profileContacts.length)%profileContacts.length],offset:i};});}
  function setProfileContactIndexWithClick(updater,count){if(navigator.vibrate&&count)navigator.vibrate(Array(Math.min(3,count)).fill(8));setProfileContactIndex(updater);}
  function startProfileSwipe(e){if(profileContacts.length<2)return;let target=e.target;if(target&&target.closest&&target.closest('[data-center-card="true"]'))return;let p=e.touches&&e.touches[0]?e.touches[0]:e;profileSwipeRef.current={x:p.clientX,y:p.clientY,t:performance.now(),active:true};}
  function moveProfileSwipe(e){let s=profileSwipeRef.current;if(!s||!s.active)return;let p=e.touches&&e.touches[0]?e.touches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.3&&e.cancelable)e.preventDefault();}
  function endProfileSwipe(e){let s=profileSwipeRef.current;if(!s||!s.active)return;let p=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;profileSwipeRef.current=null;if(Math.abs(dx)<64||Math.abs(dx)<Math.abs(dy)*1.35)return;let elapsed=Math.max(1,performance.now()-(s.t||performance.now()));let speed=Math.abs(dx)/elapsed;let distanceSteps=Math.floor(Math.abs(dx)/150);let velocitySteps=Math.floor(speed/0.55);let steps=Math.max(1,distanceSteps,velocitySteps);steps=Math.min(steps,profileContacts.length-1);setProfileContactIndexWithClick(function(i){let dir=dx<0?1:-1;return(i+(dir*steps)+profileContacts.length*steps)%profileContacts.length;},steps);}
  function upd(k,v){setForm(function(f){let n=Object.assign({},f);n[k]=v;return n;});}
  if(showShare)return <ShareCardModal card={profileShareCard} username={shareUsername} onClose={function(){setShowShare(false);}}/>;
  if(editing)return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'14px 18px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'12px',position:'sticky',top:0,backdropFilter:'blur(20px)',zIndex:10}}>
        <button onClick={function(){setEditing(false);}} style={{background:'none',border:'none',color:'white',cursor:'pointer',padding:'4px',display:'flex'}}><ArrowLeft size={20}/></button>
        <h2 style={{fontSize:'17px',fontWeight:800,margin:0,flex:1}}>Edit My Card</h2>
        <button onClick={async function(){
          if(onSaveUsername&&usernameForm){let ok=await onSaveUsername(usernameForm);if(!ok)return;}
          onSave(cleanObj(form));
          setEditing(false);
        }} style={{background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',border:'none',borderRadius:'9px',padding:'8px 16px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>Save</button>
      </div>
      <div style={{padding:'16px 20px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Account</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)',padding:'14px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'12px'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {photo?<img src={photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:'24px',fontWeight:900,color:'white'}}>{(myCard.name||'Y').charAt(0)}</span>}
            </div>
            <div style={{flex:1}}>
              <button type="button" onClick={function(){avatarInputRef.current&&avatarInputRef.current.click();}} style={{background:'rgba(139,92,246,0.2)',border:'1px solid rgba(139,92,246,0.4)',color:'#c4b5fd',borderRadius:'9px',padding:'8px 12px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>Change photo</button>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={function(e){let f=e.target.files&&e.target.files[0];if(f&&onAvatarUpload)onAvatarUpload(f);e.target.value='';}}/>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',padding:'10px 12px',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.06)'}}>
            <span style={{color:'rgba(255,255,255,0.45)',fontSize:'16px',fontWeight:700,marginRight:'4px'}}>@</span>
            <input value={usernameForm} onChange={function(ev){setUsernameForm(sanitizeUsernameInput(ev.target.value));}} placeholder="yourname" style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/>
          </div>
          {profileLink&&username&&<p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',margin:'8px 0 0',wordBreak:'break-all'}}>{profileLink}</p>}
        </div>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Basic Info</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {[['name','Full Name'],['title','Job Title'],['company','Company'],['email','Email'],['phone','Phone'],['website','Website']].map((row,i,arr)=>{return(<div key={row[0]} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><input value={form[row[0]]||''} onChange={function(ev){upd(row[0],row[0]==='phone'?formatPhone(ev.target.value):ev.target.value);}} placeholder={row[1]} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Social</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {[['instagram','Instagram username'],['twitter','Twitter/X username'],['linkedin','LinkedIn username']].map((row,i,arr)=>{return(<div key={row[0]} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><input value={form[row[0]]||''} onChange={function(ev){upd(row[0],ev.target.value);}} placeholder={row[1]} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}><Crown size={11} color="#fbbf24"/> Pro Badges</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {PRO_BADGE_DEFS.map((b,i)=>{return(<div key={b.key} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 14px',borderBottom:i<PRO_BADGE_DEFS.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><div style={{width:'36px',height:'20px',borderRadius:'4px',background:b.color+'22',border:'1px solid '+b.color+'44',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'7px',fontWeight:900,color:b.color}}>{b.short}</span></div><input value={form[b.key]||''} onChange={function(ev){upd(b.key,ev.target.value);}} placeholder={b.key==='github'?'username':'https://...'} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px'}}>
        <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600,padding:0}}><ArrowLeft size={18}/> Back</button>
        <button onClick={function(){setEditing(true);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'9px',padding:'7px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600}}><Edit3 size={14}/> Edit</button>
      </div>
      <div style={{padding:'0 20px 32px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'16px'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'3px solid rgba(255,255,255,0.15)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}>
            {photo?<img src={photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:'28px',fontWeight:900,color:'white'}}>{(myCard.name||'Y').charAt(0)}</span>}
          </div>
          <h1 style={{fontSize:'20px',fontWeight:900,margin:'0 0 2px'}}>{myCard.name||'Your Name'}</h1>
          {username&&<p style={{fontSize:'13px',color:'#a78bfa',margin:'0 0 2px',fontWeight:700}}>@{username}</p>}
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.55)',margin:0}}>{myCard.title||''}</p>
        </div>
        <div style={{display:'flex',gap:'6px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'4px',marginBottom:'12px'}}>
          {[['card','My Card'],['contacts','Contacts']].map((pair)=>{let active=profileTab===pair[0];return(<button key={pair[0]} onClick={function(){setProfileTab(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'9px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:800,background:active?'linear-gradient(135deg,#8b5cf6,#6366f1)':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
        </div>
        {profileTab==='card'?(
          <>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}><div style={{width:'100%',maxWidth:'300px',height:'172px'}}><Card3D card={myCard.name?myCard:Object.assign({},myCard,{name:'Your Name',company:'Your Company'})} isCenter={true} style={{width:'100%',height:'100%'}} photo={photo} autoFlip={true}/></div></div>
            <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',margin:'0 0 16px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
          </>
        ):(
          <div style={{marginBottom:'16px'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['carousel','Carousel'],['stack','Stack']].map((pair)=>{let active=contactsView===pair[0];return(<button key={pair[0]} onClick={function(){setContactsView(pair[0]);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:active?800:600,background:active?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}</div></div>
            {profileContacts.length===0?(
              <div style={{textAlign:'center',padding:'32px 20px',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>No contacts yet</div>
            ):contactsView==='carousel'?(
              <>
                <div data-carousel-swipe="true" onMouseDown={startProfileSwipe} onMouseMove={moveProfileSwipe} onMouseUp={endProfileSwipe} onMouseLeave={function(){profileSwipeRef.current=null;}} onTouchStart={startProfileSwipe} onTouchMove={moveProfileSwipe} onTouchEnd={endProfileSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                  <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                    {getProfileVisible().map((item)=>{let card=item.card;let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);return(
                      <Card3D key={'profile-carousel-'+card.id} card={card} isCenter={isCenter} autoFlip={false}
                        onNameClick={isCenter?function(){if(onSelectContact)onSelectContact(card);}:undefined}
                        onClick={!isCenter?function(e){e.stopPropagation();setProfileContactIndexWithClick(function(i){return(i+offset+profileContacts.length)%profileContacts.length;},Math.abs(offset));}:undefined}
                        style={{position:'absolute',width:'88%',maxWidth:'310px',height:'177px',transform:'translateX('+(offset*72)+'%) scale('+(isCenter?1:0.74)+')',transformOrigin:'center center',zIndex:isCenter?30:20-absOff,opacity:isCenter?1:Math.max(0.15,0.45-absOff*0.15),transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1),opacity 0.45s',cursor:'pointer',touchAction:isCenter?'none':'pan-y'}}
                        data-carousel-card="true" data-center-card={isCenter?'true':undefined}/>
                    );})}
                  </div>
                </div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.28)',textAlign:'center',margin:'0 0 2px',fontWeight:500}}>&lt;- Drag to flip -&gt;</p>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.24)',textAlign:'center',margin:'0 0 6px',fontWeight:500,letterSpacing:0}}>&lt;-- Swipe side cards to scroll --&gt;</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <button onClick={function(){setProfileContactIndexWithClick(function(i){return(i-1+profileContacts.length)%profileContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}><ChevronLeft size={15}/> Prev</button>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:700}}>{(profileSafeIdx+1)+' / '+profileContacts.length}</div>
                  <button onClick={function(){setProfileContactIndexWithClick(function(i){return(i+1)%profileContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}>Next <ChevronRight size={15}/></button>
                </div>
              </>
            ):(
              <div style={{border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',overflow:'hidden',background:'rgba(255,255,255,0.04)'}}>
                {profileContacts.map((c,i)=>{return(<div key={'profile-contact-'+(c.cardType||'contact')+'-'+String(c.id||i)+'-'+(c.username||c.name||i)} style={{borderBottom:i<profileContacts.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><div onClick={function(){if(onSelectContact)onSelectContact(c);}} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 13px',cursor:'pointer'}}><Avatar contact={c} size={38}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:'13px',fontWeight:800,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}{c.company?' · '+c.company:''}</div></div><PrivacyBadge privacy={c.privacy||getDefaultPrivacy(c.cardType)} small={true}/></div><StackVisibilityToggle c={c} stackPublic={myCard.stackPublic} onToggleHidden={onToggleHidden}/></div>);})}
              </div>
            )}
          </div>
        )}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'14px 16px',marginBottom:'16px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>Card Visibility</div>
          {myCard.cardType!=='professional'?(<div style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{fontSize:'18px',color:'#f87171'}}>Private</span><div><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'2px'}}>Always Private</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>Personal cards are only visible to people you share with.</div></div></div>):(
            <><div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>{[['public','Public'],['private','Private']].map((pair)=>{let val=pair[0];let isActive=(myCard.privacy||'public')===val;return(<button key={val} onClick={function(){onSave(Object.assign({},myCard,{privacy:val}));}} style={{flex:1,padding:'9px',borderRadius:'10px',border:'1px solid '+(isActive?(val==='public'?'rgba(16,185,129,0.5)':'rgba(239,68,68,0.4)'):'rgba(255,255,255,0.1)'),background:isActive?(val==='public'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.12)'):'transparent',color:isActive?(val==='public'?'#10b981':'#f87171'):'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{pair[1]}</button>);})}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>{(myCard.privacy||'public')==='public'?'Your card is public.':'Your card is private.'}</div></>
          )}
        </div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['light','White'],['dark','Dark']].map((pair)=>{let val=pair[0];let isActive=(myCard.cardStyle||'light')===val;return(<button key={val} onClick={function(){if(onStyleChange)onStyleChange(val);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:isActive?700:500,background:isActive?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{val==='light'?'White':'Dark'}</button>);})}</div></div>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'16px'}}>{CARD_COLORS.map((c,i)=>{return(<button key={i} onClick={function(){setViewCi(i);if(onColorChange)onColorChange(c);}} style={{width:'26px',height:'26px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:viewCi===i?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0}}/>);})}</div>
        <button onClick={function(){setShowShare(true);}} style={{width:'100%',background:'linear-gradient(135deg,'+(profileShareCard.color&&profileShareCard.color[0]?profileShareCard.color[0]:'#8b5cf6')+','+(profileShareCard.color&&profileShareCard.color[1]?profileShareCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:700,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'8px'}}><Share2 size={16}/> Share Card</button>
        <button onClick={function(){setEditing(true);}} style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:600,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'14px'}}><Edit3 size={16}/> Edit Card</button>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
          <button onClick={onShowAnalytics} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}><BarChart2 size={15}/> Analytics</button>
          <button onClick={function(){alert('Pro features coming soon!');}} style={{background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}><Crown size={15}/> Pro</button>
        </div>
        {searchProfiles&&onOpenUserProfile&&(
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'14px 16px',marginBottom:'14px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>Find people</div>
            <input value={userSearch} onChange={function(ev){setUserSearch(ev.target.value);}} placeholder="@name, Instagram, X, LinkedIn..." style={{width:'100%',padding:'10px 12px',borderRadius:'10px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'15px',outline:'none',boxSizing:'border-box',marginBottom:'8px'}}/>
            {userSearchBusy&&<p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',margin:'0 0 6px'}}>Searching...</p>}
            {userResults.map(function(u){
              return(
                <div key={u.id} onClick={function(){onOpenUserProfile(u.username);}} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 4px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',overflow:'hidden',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {u.avatar_url?<img src={u.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{color:'white',fontWeight:800,fontSize:'14px'}}>{(u.full_name||u.username||'?').charAt(0)}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'13px',fontWeight:800,color:'white'}}>@{u.username}</div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.full_name||''}</div>
                  </div>
                </div>
              );
            })}
            {userSearch.trim().length>=2&&!userSearchBusy&&!userResults.length&&<p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',margin:0}}>No profiles found</p>}
          </div>
        )}
        <button onClick={onLogout} style={{width:'100%',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#f87171',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>Sign Out</button>
      </div>
    </div>
  );
}

export { ProfileScreen };
