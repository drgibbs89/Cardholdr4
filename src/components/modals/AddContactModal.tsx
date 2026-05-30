// @ts-nocheck
import React from 'react';
import { CARD_COLORS } from '../../constants/cardData';
import { formatPhone, cleanObj } from '../../lib/safety';

function AddContactModal({onSave,onClose}){
  let [form,setForm]=React.useState({name:'',title:'',company:'',email:'',phone:'',website:'',notes:'',cardType:'professional',privacy:'public'});
  let [ci,setCi]=React.useState(0);
  function upd(k,v){setForm(function(f){let n=Object.assign({},f);n[k]=v;return n;});}
  function save(){let type=form.cardType||'professional';if(!form.name&&!form.company){alert('Please enter a name or company');return;}onSave(Object.assign({},cleanObj(form),{id:Date.now(),color:CARD_COLORS[ci],cardType:type,privacy:type==='professional'?(form.privacy||'public'):'private',source:'manual',date:'Just now',tags:[],favorite:false,stackHidden:false}));}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'24px 24px 0 0',padding:'8px 0 32px',maxWidth:'480px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',borderBottom:'none',maxHeight:'92vh',overflowY:'auto'}} onClick={function(e){e.stopPropagation();}}>
        <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)',margin:'12px auto 0'}}/>
        <div style={{padding:'14px 20px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h2 style={{color:'white',fontSize:'18px',fontWeight:750,margin:0}}>Add Contact Card</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
        </div>
        <div style={{padding:'0 20px 12px'}}>
          <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
            {[['professional','Professional'],['social','Personal']].map((pair)=>{let active=form.cardType===pair[0];return(<button key={pair[0]} onClick={function(){upd('cardType',pair[0]);upd('privacy',pair[0]==='professional'?'public':'private');}} style={{flex:1,padding:'8px',borderRadius:'10px',border:'1px solid '+(active?'rgba(139,92,246,0.45)':'rgba(255,255,255,0.1)'),background:active?'rgba(139,92,246,0.18)':'rgba(255,255,255,0.04)',color:active?'white':'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'12px',fontWeight:650}}>{pair[1]}</button>);})}
          </div>
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
            {[['name','Full Name *'],['title','Role / Title'],['company','Company'],['email','Email'],['phone','Phone'],['website','Website'],['notes','Notes']].map((row,i,arr)=>{let k=row[0];let p=row[1];return(
              <div key={k} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                <input value={form[k]||''} onChange={function(ev){upd(k,k==='phone'?formatPhone(ev.target.value):ev.target.value);}} placeholder={p} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'14px',outline:'none',fontFamily:'inherit'}}/>
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:'0 20px 14px'}}>
          <div style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.4)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'8px'}}>Card Color</div>
          <div style={{display:'flex',gap:'8px'}}>{CARD_COLORS.map((c,i)=>{return <button key={i} onClick={function(){setCi(i);}} style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:ci===i?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0}}/>;})}</div>
        </div>
        <div style={{padding:'0 20px'}}>
          <button onClick={save} style={{width:'100%',background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:700,border:'none',cursor:'pointer',fontSize:'15px'}}>Add Contact Card</button>
        </div>
      </div>
    </div>
  );
}

export { AddContactModal };
