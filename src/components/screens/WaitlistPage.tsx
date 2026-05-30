// @ts-nocheck
import React from 'react';
import { CARD_COLORS } from '../../constants/cardData';
import { Card3D } from '../cards/Card3D';

function WaitlistPage({onEnterApp,onLogoTap}){
  let [email,setEmail]=React.useState('');
  let [submitted,setSubmitted]=React.useState(false);
  let demoCard={name:'Alex Rivera',title:'Product Designer',company:'Studio Nine',email:'alex@studionine.co',phone:'(415) 555-0192',color:CARD_COLORS[2],portfolio:'studionine.co',github:'alexrivera'};
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0d0b1e,#1a1440,#0f0c29)',color:'white',overflowY:'auto'}}>
      <style>{'@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'}</style>
      <div style={{padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10,background:'rgba(13,11,30,0.8)'}}>
        <span onClick={onLogoTap} style={{fontWeight:900,fontSize:'17px',cursor:'default',userSelect:'none',WebkitUserSelect:'none'}}>CardHoldr</span>
        <button onClick={onEnterApp} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'white',borderRadius:'10px',padding:'8px 16px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Try the app</button>
      </div>
      <div style={{padding:'60px 24px 48px',maxWidth:'560px',margin:'0 auto',textAlign:'center'}}>
        <h1 style={{fontSize:'42px',fontWeight:900,lineHeight:1.1,margin:'0 0 18px',letterSpacing:'-1.5px'}}>The business card<br/><span style={{background:'linear-gradient(to right,#a78bfa,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>built for how you work</span></h1>
        <p style={{fontSize:'17px',color:'rgba(255,255,255,0.6)',lineHeight:1.65,margin:'0 0 36px'}}>Share your contact in one tap. Scan cards. Keep your network organized.</p>
        {!submitted?(
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px',maxWidth:'400px',margin:'0 auto'}}>
            <input value={email} onChange={function(e){setEmail(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'&&email.includes('@'))setSubmitted(true);}} placeholder="your@email.com" type="email" style={{width:'100%',padding:'13px 16px',borderRadius:'11px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:'15px',outline:'none',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'10px'}}/>
            <button onClick={function(){if(email.includes('@'))setSubmitted(true);}} style={{width:'100%',background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'14px',borderRadius:'12px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'15px'}}>Join the waitlist</button>
          </div>
        ):(
          <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'18px',padding:'28px 24px',maxWidth:'400px',margin:'0 auto'}}>
            <div style={{fontSize:'36px',marginBottom:'12px'}}>Done</div>
            <div style={{fontWeight:800,fontSize:'18px',marginBottom:'16px'}}>You're on the list!</div>
            <button onClick={onEnterApp} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'11px',padding:'11px 22px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Try the demo</button>
          </div>
        )}
      </div>
      <div style={{display:'flex',justifyContent:'center',padding:'0 24px 8px',animation:'float 4s ease-in-out infinite'}}>
        <div style={{width:'min(88%,300px)',height:'172px'}}><Card3D card={demoCard} isCenter={true} style={{width:'100%',height:'100%'}} autoFlip={true}/></div>
      </div>
      <p style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',textAlign:'center',marginBottom:'40px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
    </div>
  );
}

export { WaitlistPage };
