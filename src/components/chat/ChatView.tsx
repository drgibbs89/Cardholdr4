// @ts-nocheck
import React from 'react';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { Avatar } from '../ui';
import { REACTIONS } from '../../constants/cardData';

function ChatView({contact,msgs,draft,setDraft,sendMsg,isTyping,reactions,setReactions,reactionTarget,setReactionTarget,onBack,exportContact}){
  let endRef=React.useRef(null);
  React.useEffect(function(){endRef.current&&endRef.current.scrollIntoView({behavior:'smooth'});},[msgs,isTyping]);
  let grouped=msgs.reduce((acc,msg)=>{let last=acc[acc.length-1];if(last&&last.date===msg.date)last.messages.push(msg);else acc.push({date:msg.date,messages:[msg]});return acc;},[]);
  let c1=(contact.color&&contact.color[0])||'#8b5cf6';
  let c2=(contact.color&&contact.color[1])||'#6366f1';
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'13px 16px',background:'rgba(0,0,0,0.25)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'11px',flexShrink:0}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'white',cursor:'pointer',padding:'4px',display:'flex'}}><ArrowLeft size={20}/></button>
        <Avatar contact={contact} size={38}/>
        <div style={{flex:1}}><div style={{color:'white',fontWeight:700,fontSize:'14px'}}>{contact.name}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>{contact.title}{contact.company?' · '+contact.company:''}</div></div>
        <button onClick={function(){exportContact(contact);}} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'white',cursor:'pointer',padding:'7px',borderRadius:'8px',display:'flex'}}><Download size={15}/></button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:'4px'}} onClick={function(){setReactionTarget(null);}}>
        {grouped.map((group)=>{return(
          <div key={group.date}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'10px 0 8px'}}>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.08)'}}/>
              <span style={{color:'rgba(255,255,255,0.3)',fontSize:'10px',fontWeight:600}}>{group.date}</span>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.08)'}}/>
            </div>
            {group.messages.map((msg,mi)=>{
              let isMe=msg.from==='me';
              let rk=contact.id+'-'+msg.id;
              let mr=reactions[rk];
              let showAv=!isMe&&(mi===0||(group.messages[mi-1]&&group.messages[mi-1].from==='me'));
              return(
                <div key={'msg-'+rk+'-'+mi} style={{display:'flex',flexDirection:isMe?'row-reverse':'row',alignItems:'flex-end',gap:'7px',marginBottom:'2px'}}>
                  {!isMe&&<div style={{width:26,flexShrink:0}}>{showAv&&<Avatar contact={contact} size={26}/>}</div>}
                  <div style={{maxWidth:'70%',position:'relative'}}>
                    {mr&&<div style={{position:'absolute',bottom:'-10px',[isMe?'left':'right']:'8px',background:'rgba(30,27,75,0.95)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',padding:'1px 5px',fontSize:'13px',zIndex:2}}>{mr}</div>}
                    <div onDoubleClick={function(){setReactionTarget(reactionTarget===msg.id?null:msg.id);}} style={{padding:'9px 13px',borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px',background:isMe?'linear-gradient(135deg,'+c1+','+c2+')':'rgba(255,255,255,0.1)',color:'white',fontSize:'13px',lineHeight:1.45,wordBreak:'break-word'}}>{msg.text}</div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',textAlign:isMe?'right':'left',marginTop:'2px',paddingBottom:mr?'10px':0}}>{msg.time}</div>
                    {reactionTarget===msg.id&&(
                      <div style={{position:'absolute',[isMe?'right':'left']:0,bottom:'100%',marginBottom:'6px',background:'rgba(20,18,60,0.97)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'24px',padding:'6px 10px',display:'flex',gap:'6px',zIndex:10}} onClick={function(e){e.stopPropagation();}}>
                        {REACTIONS.map((em)=>{return(<button key={em} onClick={function(){setReactions(function(p){let n=Object.assign({},p);n[rk]=em;return n;});setReactionTarget(null);}} style={{background:'none',border:'none',cursor:'pointer',fontSize:'19px',padding:'2px'}}>{em}</button>);})}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );})}
        {isTyping&&<div style={{display:'flex',alignItems:'flex-end',gap:'7px'}}><Avatar contact={contact} size={26}/><div style={{background:'rgba(255,255,255,0.1)',borderRadius:'16px 16px 16px 4px',padding:'10px 13px',display:'flex',gap:'4px',alignItems:'center'}}>{[0,1,2].map((i)=>{return(<div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:'rgba(255,255,255,0.6)',animation:'typingDot 1.2s ease-in-out infinite',animationDelay:(i*0.2)+'s'}}/>);})}</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:'10px 13px',background:'rgba(0,0,0,0.2)',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'flex-end',gap:'8px',flexShrink:0}}>
        <div style={{flex:1}}>
          <textarea value={draft} onChange={function(e){setDraft(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}} placeholder="Message..." rows={1} style={{width:'100%',padding:'9px 13px',borderRadius:'18px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',color:'white',fontSize:'16px',outline:'none',resize:'none',boxSizing:'border-box',lineHeight:1.4,maxHeight:'110px',overflow:'auto',fontFamily:'inherit'}}/>
        </div>
        <button onClick={sendMsg} disabled={!draft.trim()} style={{width:'38px',height:'38px',borderRadius:'50%',background:draft.trim()?'linear-gradient(135deg,'+c1+','+c2+')':'rgba(255,255,255,0.1)',border:'none',cursor:draft.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Send size={15} color="white"/></button>
      </div>
    </div>
  );
}

export { ChatView };
