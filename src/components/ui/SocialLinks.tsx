// @ts-nocheck
import React from 'react';
import { safeUrl, safeName } from '../../lib/safety';

function SocialIcon({type}){
  let s=11;
  if(type==='instagram'){
    return(
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',flexShrink:0}}>
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#igGrad)" strokeWidth="2.2"/>
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#igGrad)" strokeWidth="2.2"/>
        <circle cx="17.4" cy="6.6" r="1.3" fill="url(#igGrad)"/>
      </svg>
    );
  }
  if(type==='twitter'){
    return(
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',flexShrink:0}}>
        <path fill="#0f1419" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  return(
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',flexShrink:0}}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#0A66C2"/>
      <path fill="#fff" d="M7.5 10.2v6.3H5V10.2h2.5zm-1.25-2.8a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm4 2.8h2.3l.1 1.1c.5-.8 1.3-1.2 2.2-1.2 1.8 0 2.9 1.2 2.9 3.4v4h-2.5v-3.7c0-1.1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1-.1.2-.1.5-.1.8v3.6H10.3V10.2z"/>
    </svg>
  );
}

function SocialLinks({card,dark}){
  let bg=dark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.07)';
  let textCol=dark?'rgba(255,255,255,0.62)':'rgba(0,0,0,0.55)';
  let platforms=[
    card.instagram&&{key:'ig',type:'instagram',handle:safeName(card.instagram),url:safeUrl('https://instagram.com/'+safeName(card.instagram))},
    card.twitter&&{key:'x',type:'twitter',handle:safeName(card.twitter),url:safeUrl('https://twitter.com/'+safeName(card.twitter))},
    card.linkedin&&{key:'in',type:'linkedin',handle:safeName(card.linkedin),url:safeUrl('https://linkedin.com/in/'+safeName(card.linkedin))},
  ].filter(Boolean);
  if(!platforms.length)return null;
  return(
    <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'4px'}}>
      {platforms.map(function(item){
        return(
          <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{display:'inline-flex',alignItems:'center',gap:'4px',background:bg,borderRadius:'6px',padding:'2px 6px 2px 4px',textDecoration:'none',lineHeight:1}}>
            <SocialIcon type={item.type}/>
            <span style={{fontSize:'8px',fontWeight:600,color:textCol,whiteSpace:'nowrap'}}>@{' '+item.handle}</span>
          </a>
        );
      })}
    </div>
  );
}

export { SocialLinks };
