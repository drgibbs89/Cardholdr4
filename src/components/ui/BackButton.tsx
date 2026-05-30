// @ts-nocheck
import React from 'react';
import { ArrowLeft } from 'lucide-react';

function BackButton({onClick,label}){
  return(
    <button onClick={onClick} aria-label={label||'Back'} title={label||'Back'} style={{width:'34px',height:'34px',borderRadius:'10px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0,flexShrink:0}}>
      <ArrowLeft size={17}/>
    </button>
  );
}

export { BackButton };
