// @ts-nocheck
import React from 'react';
import { PRO_BADGE_DEFS } from '../../constants/cardData';

function ProBadges({card,dark}){
  let active=PRO_BADGE_DEFS.filter((b)=>{return card[b.key];});
  if(!active.length)return null;
  return(
    <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'5px',lineHeight:1.2}}>
      {active.map((b)=>{return(
        <a key={b.key} href={b.getUrl(card[b.key])} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{display:'inline-flex',alignItems:'center',borderRadius:'4px',padding:'3px 6px',textDecoration:'none',background:dark?b.color+'33':b.color+'18',border:'1px solid '+b.color+(dark?'55':'33'),boxSizing:'border-box'}}>
          <span style={{fontSize:'7px',fontWeight:700,color:dark?'rgba(255,255,255,0.85)':b.color,letterSpacing:'.04em'}}>{b.short}</span>
        </a>
      );})}
    </div>
  );
}

export { ProBadges };
