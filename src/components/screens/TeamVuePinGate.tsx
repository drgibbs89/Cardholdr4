// @ts-nocheck
import React from 'react';

function TeamVuePinGate({onSuccess,onCancel}){
  let [pin,setPin]=React.useState('');
  let [shake,setShake]=React.useState(false);
  let [attempts,setAttempts]=React.useState(0);
  let CORRECT='1234';
  function digit(d){if(pin.length>=4)return;let next=pin+d;setPin(next);if(next.length===4){setTimeout(function(){if(next===CORRECT){onSuccess();}else{setShake(true);setAttempts(function(a){return a+1;});setTimeout(function(){setPin('');setShake(false);},600);}},120);}}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.97)',backdropFilter:'blur(20px)',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <style>{'@keyframes tvShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}'}</style>
      <div style={{marginBottom:'32px',textAlign:'center'}}>
        <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:'15px',fontWeight:900,color:'white'}}>TV</div>
        <div style={{fontSize:'19px',fontWeight:800,color:'white',marginBottom:'4px'}}>TeamVue</div>
        <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>INTERNAL ACCESS ONLY</div>
      </div>
      <div style={{display:'flex',gap:'16px',marginBottom:'32px',animation:shake?'tvShake 0.4s ease':'none'}}>
        {[0,1,2,3].map((i)=>{return(<div key={i} style={{width:'14px',height:'14px',borderRadius:'50%',background:pin.length>i?'#8b5cf6':'transparent',border:'2px solid '+(pin.length>i?'#8b5cf6':'rgba(255,255,255,0.2)'),transition:'all 0.15s'}}/>);})}
      </div>
      {attempts>0&&<div style={{marginBottom:'16px',fontSize:'11px',color:'#ef4444',background:'rgba(239,68,68,0.1)',padding:'6px 14px',borderRadius:'20px',border:'1px solid rgba(239,68,68,0.3)'}}>{'Incorrect PIN ('+attempts+' attempt'+(attempts>1?'s':'')+')'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
        {[1,2,3,4,5,6,7,8,9,'',0,'?'].map((d,i)=>{return(<button key={i} onClick={function(){if(d==='')return;if(d==='?')setPin(function(p){return p.slice(0,-1);});else digit(String(d));}} disabled={d===''} style={{width:'68px',height:'68px',borderRadius:'50%',background:d===''?'transparent':'rgba(255,255,255,0.06)',border:d===''?'none':'1px solid rgba(255,255,255,0.08)',color:'white',fontSize:'22px',fontWeight:600,cursor:d===''?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{d}</button>);})}
      </div>
      <button onClick={onCancel} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',fontSize:'13px',cursor:'pointer',padding:'8px 16px'}}>Cancel</button>
    </div>
  );
}

export { TeamVuePinGate };
