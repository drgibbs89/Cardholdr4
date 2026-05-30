// @ts-nocheck
import React from 'react';
import { profilePublicUrl } from '../../lib/safety';

// --- ShareCardModal ---
function ShareCardModal({card,username,onClose}){
  let [copied,setCopied]=React.useState(false);
  let url=username?profilePublicUrl(username):profilePublicUrl((card.name||'contact').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  let vcard='BEGIN:VCARD\nVERSION:3.0\nFN:'+(card.name||'')+'\nORG:'+(card.company||'')+'\nTITLE:'+(card.title||'')+'\nEMAIL:'+(card.email||'')+'\nTEL:'+(card.phone||'')+'\nEND:VCARD';
  let vh='data:text/vcard;charset=utf-8,'+encodeURIComponent(vcard);
  function copy(){navigator.clipboard&&navigator.clipboard.writeText(url).then(function(){setCopied(true);setTimeout(function(){setCopied(false);},2000);});}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'24px 24px 0 0',padding:'8px 0 32px',maxWidth:'480px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',borderBottom:'none',maxHeight:'90vh',overflowY:'auto'}} onClick={function(e){e.stopPropagation();}}>
        <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)',margin:'12px auto 20px'}}/>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{background:'linear-gradient(135deg,'+(card.color&&card.color[0]?card.color[0]:'#8b5cf6')+','+(card.color&&card.color[1]?card.color[1]:'#6366f1')+')',borderRadius:'16px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:900,color:'white',flexShrink:0,overflow:'hidden'}}>{card.avatarUrl?<img src={card.avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(card.name||'?').charAt(0)}</div>
            <div><div style={{color:'white',fontWeight:800,fontSize:'15px'}}>{card.name}</div><div style={{color:'rgba(255,255,255,0.75)',fontSize:'12px'}}>{card.title}{card.company?' · '+card.company:''}</div>{username&&<div style={{color:'rgba(255,255,255,0.55)',fontSize:'11px',marginTop:'2px'}}>@{username}</div>}</div>
          </div>
        </div>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'center',background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'10px 14px',border:'1px solid rgba(255,255,255,0.1)'}}>
            <span style={{flex:1,fontSize:'12px',color:'#a78bfa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{url}</span>
            <button onClick={copy} style={{background:copied?'rgba(16,185,129,0.2)':'rgba(139,92,246,0.25)',border:'1px solid '+(copied?'rgba(16,185,129,0.4)':'rgba(139,92,246,0.4)'),color:copied?'#34d399':'#a78bfa',borderRadius:'8px',padding:'5px 12px',cursor:'pointer',fontSize:'12px',fontWeight:700,flexShrink:0}}>{copied?'Copied!':'Copy'}</button>
          </div>
        </div>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[['Text','sms:?body='+encodeURIComponent("Here's my card: "+url)],['Email','mailto:?subject=My+Card&body='+encodeURIComponent(url)],['WhatsApp','https://wa.me/?text='+encodeURIComponent("Here's my card: "+url)]].map((item)=>{return(<a key={item[0]} href={item[1]} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'white',textDecoration:'none',fontSize:'13px',fontWeight:600}}>{item[0]}</a>);})}
            <a href={vh} download={(card.name||'contact').replace(/[^a-z0-9]/gi,'-')+'.vcf'} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'white',textDecoration:'none',fontSize:'13px',fontWeight:600}}>vCard</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ShareCardModal };
