// @ts-nocheck
import React from 'react';
import { ArrowLeft } from 'lucide-react';

function AnalyticsScreen({onClose,analyticsData}){
  let [showSample,setShowSample]=React.useState(true);
  let views=showSample?47:(analyticsData?analyticsData.views:0);
  let exchanges=showSample?8:(analyticsData?analyticsData.exchanges:0);
  let contactsCount=showSample?5:(analyticsData?analyticsData.contacts:0);
  let chart=showSample?[4,7,5,9,8,6,8]:(analyticsData?analyticsData.chart:[0,0,0,0,0,0,0]);
  let mv=Math.max.apply(null,chart)||1;
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'16px 20px',maxWidth:'600px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',display:'flex',alignItems:'center',flexShrink:0}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:'20px',fontWeight:800,margin:0}}>Analytics</h2>
        </div>
        <button onClick={function(){setShowSample(function(v){return !v;});}} style={{width:'100%',marginBottom:'14px',padding:'12px',borderRadius:'12px',border:'1px solid '+(showSample?'rgba(255,255,255,0.12)':'rgba(139,92,246,0.4)'),background:showSample?'rgba(255,255,255,0.06)':'rgba(139,92,246,0.15)',color:showSample?'rgba(255,255,255,0.55)':'#a78bfa',cursor:'pointer',fontSize:'13px',fontWeight:700}}>
          {showSample?'Hide Sample Data':'Show Sample Data'}
        </button>
        {showSample&&(
          <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)',borderRadius:'12px',padding:'10px 14px',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'11px',fontWeight:800,color:'#f59e0b'}}>SAMPLE</span>
            <span style={{fontSize:'12px',color:'rgba(255,255,255,0.6)'}}>Showing sample data. Hide it to see only your real analytics.</span>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'20px'}}>
          {[{l:'Views',v:views,col:'#8b5cf6'},{l:'Exchanges',v:exchanges,col:'#0ea5e9'},{l:'Contacts',v:contactsCount,col:'#10b981'}].map((s,i)=>{return(<div key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 12px',textAlign:'center'}}><div style={{fontSize:'26px',fontWeight:900,color:s.col,lineHeight:1}}>{s.v}</div><div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{s.l}</div></div>);})}
        </div>
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'18px'}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'14px'}}>Views this week{showSample&&<span style={{fontSize:'10px',color:'rgba(245,158,11,0.6)',marginLeft:'6px'}}>(sample)</span>}</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'6px',height:'70px'}}>
            {chart.map((v,i)=>{return(<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}><div style={{width:'100%',background:'linear-gradient(to top,#8b5cf6,#6366f1)',borderRadius:'3px 3px 0 0',height:((v/mv)*60)+'px',minHeight:v>0?'3px':'0'}}/><span style={{fontSize:'8px',color:'rgba(255,255,255,0.35)'}}>{['M','T','W','T','F','S','S'][i]}</span></div>);})}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnalyticsScreen };
