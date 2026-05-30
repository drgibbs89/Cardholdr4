// @ts-nocheck
import React from 'react';

function PrivacyBadge({privacy,small,hidden}){
  if(hidden)return <span style={{display:'inline-flex',fontSize:small?'9px':'11px',fontWeight:700,padding:small?'1px 6px':'3px 8px',borderRadius:'20px',background:'rgba(107,114,128,0.15)',color:'#9ca3af',border:'1px solid rgba(107,114,128,0.25)'}}>Hidden</span>;
  let isPublic=privacy==='public';
  return <span style={{display:'inline-flex',fontSize:small?'9px':'11px',fontWeight:700,padding:small?'1px 6px':'3px 8px',borderRadius:'20px',background:isPublic?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.12)',color:isPublic?'#10b981':'#f87171',border:'1px solid '+(isPublic?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.25)')}}>{isPublic?'Public':'Private'}</span>;
}

export { PrivacyBadge };
