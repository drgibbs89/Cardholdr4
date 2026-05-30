// @ts-nocheck
import React from 'react';

function TeamVueDashboard({onClose,showSeedData,onToggleSeedData}){
  let [tab,setTab]=React.useState('overview');
  let navItems=['overview','users','moderation','support','features','audit'];
  let mockUsers=showSeedData?[{id:1,name:'Sarah Johnson',email:'sarah@techcorp.com',status:'active',exchanges:47},{id:2,name:'Michael Williams',email:'michael@innovatelabs.com',status:'active',exchanges:89},{id:3,name:'Jessica Brown',email:'jessica@digitalsolutions.com',status:'active',exchanges:12},{id:4,name:'David Jones',email:'david@cloudsync.com',status:'suspended',exchanges:5}]:[];
  let overviewStats=showSeedData?[{l:'Total Users',v:'1,284',col:'#8b5cf6'},{l:'Exchanges Today',v:'347',col:'#3b82f6'},{l:'Pro Subscribers',v:'89',col:'#f59e0b'},{l:'AI Scans Today',v:'124',col:'#10b981'}]:[{l:'Total Users',v:'0',col:'#8b5cf6'},{l:'Exchanges Today',v:'0',col:'#3b82f6'},{l:'Pro Subscribers',v:'0',col:'#f59e0b'},{l:'AI Scans Today',v:'0',col:'#10b981'}];
  return(
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'#080c14',color:'white',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:900,color:'white'}}>TV</div>
          <div><div style={{fontSize:'15px',fontWeight:800}}>TeamVue</div><div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>CARDHOLDR INTERNAL OPS</div></div>
        </div>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',fontSize:'12px',fontWeight:700,padding:'7px 14px',borderRadius:'8px',cursor:'pointer'}}>Exit</button>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:'140px',borderRight:'1px solid rgba(255,255,255,0.07)',padding:'12px 8px',flexShrink:0}}>
          {navItems.map((item)=>{return(<button key={item} onClick={function(){setTab(item);}} style={{display:'block',width:'100%',padding:'9px 12px',borderRadius:'8px',border:'none',background:tab===item?'rgba(139,92,246,0.15)':'transparent',color:tab===item?'white':'rgba(255,255,255,0.5)',fontSize:'13px',fontWeight:tab===item?700:500,cursor:'pointer',marginBottom:'2px',textAlign:'left',textTransform:'capitalize'}}>{item}</button>);})}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'24px'}}>
          {tab==='overview'&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
                <h1 style={{fontSize:'22px',fontWeight:900,margin:0}}>Overview</h1>
                <button onClick={onToggleSeedData} style={{background:showSeedData?'rgba(139,92,246,0.15)':'rgba(255,255,255,0.06)',border:'1px solid '+(showSeedData?'rgba(139,92,246,0.4)':'rgba(255,255,255,0.12)'),color:showSeedData?'#a78bfa':'rgba(255,255,255,0.5)',borderRadius:'8px',padding:'6px 14px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{showSeedData?'Sample Data: ON':'Sample Data: OFF'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'20px'}}>
                {overviewStats.map((s)=>{return(<div key={s.l} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'16px'}}><div style={{fontSize:'26px',fontWeight:900,color:s.col,marginBottom:'4px'}}>{s.v}</div><div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{s.l}</div></div>);})}
              </div>
            </div>
          )}
          {tab==='users'&&(
            <div>
              <h1 style={{fontSize:'22px',fontWeight:900,margin:'0 0 20px'}}>Users</h1>
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',overflow:'hidden'}}>
                {mockUsers.length?mockUsers.map((u,i)=>{return(<div key={u.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:i<mockUsers.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}><div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:800,color:'white',flexShrink:0}}>{u.name[0]}</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:600}}>{u.name}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{u.email}</div></div><span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:u.status==='active'?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)',color:u.status==='active'?'#10b981':'#ef4444'}}>{u.status}</span></div>);})
                :<div style={{padding:'28px 16px',textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>Sample data is off. No real users are connected in this demo.</div>}
              </div>
            </div>
          )}
          {tab!=='overview'&&tab!=='users'&&<div style={{color:'rgba(255,255,255,0.4)',fontSize:'14px',paddingTop:'40px',textAlign:'center'}}>Coming soon</div>}
        </div>
      </div>
    </div>
  );
}

export { TeamVueDashboard };
