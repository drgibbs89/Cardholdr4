// @ts-nocheck
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '../ui';

function NotificationsScreen({notifs,contacts,onMarkRead,onClose,onSelectContact}){
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white'}}>
      <div style={{padding:'24px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',display:'flex'}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:'22px',fontWeight:800,margin:0}}>Notifications</h2>
          <button onClick={onMarkRead} style={{marginLeft:'auto',background:'none',border:'none',color:'#a78bfa',fontSize:'12px',cursor:'pointer',fontWeight:600}}>Mark all read</button>
        </div>
        {notifs.map((n,i)=>{
          let c=contacts.find((x)=>{return x.id===n.contactId;})||contacts[0];
          return(
            <div key={'notification-'+String(n.id||i)+'-'+String(n.contactId||'none')} style={{display:'flex',gap:'12px',padding:'14px 16px',borderRadius:'14px',background:n.read?'rgba(255,255,255,0.04)':'rgba(139,92,246,0.1)',border:'1px solid '+(n.read?'rgba(255,255,255,0.06)':'rgba(139,92,246,0.2)'),marginBottom:'10px',alignItems:'center'}}>
              <Avatar contact={c} size={42}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px'}}>
                  <span onClick={function(){onSelectContact(c);}} style={{fontWeight:700,cursor:'pointer'}}>{c.name}</span>
                  <span style={{color:'rgba(255,255,255,0.6)'}}>{' '+n.text}</span>
                </div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginTop:'3px'}}>{n.time}</div>
              </div>
              {!n.read&&<div style={{width:8,height:8,borderRadius:'50%',background:'#8b5cf6',flexShrink:0}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { NotificationsScreen };
