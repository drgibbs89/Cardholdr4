// @ts-nocheck
import React from 'react';
import { CARD_COLORS, LEAD_STATUSES, LEAD_STATUS_COLORS } from '../../constants/cardData';
import { formatPhone, cleanObj } from '../../lib/safety';

function AddLeadModal({onSave,onClose,existing}){
  let [form,setForm]=React.useState(existing||{name:'',title:'',company:'',email:'',phone:'',notes:'',leadStatus:'Lead',leadBudget:'',leadInterest:'',color:CARD_COLORS[2]});
  function upd(k,v){setForm(function(f){let n=Object.assign({},f);n[k]=v;return n;});}
  function save(){if(!form.name){alert('Name is required');return;}onSave(Object.assign({},cleanObj(form),{id:existing?existing.id:Date.now(),cardType:'lead',source:'manual',date:'Just now',tags:[],favorite:false,privacy:'private',stackHidden:true}));}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'24px 24px 0 0',padding:'8px 0 32px',maxWidth:'480px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',borderBottom:'none',maxHeight:'92vh',overflowY:'auto'}} onClick={function(e){e.stopPropagation();}}>
        <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)',margin:'12px auto 0'}}/>
        <div style={{padding:'14px 20px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h2 style={{color:'white',fontSize:'18px',fontWeight:900,margin:0}}>{existing?'Edit Lead':'Add Client / Lead'}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
        </div>
        <div style={{padding:'0 20px 12px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Status</div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {LEAD_STATUSES.map((s)=>{let col=LEAD_STATUS_COLORS[s];return(<button key={s} onClick={function(){upd('leadStatus',s);}} style={{padding:'6px 12px',borderRadius:'20px',border:'1px solid '+(form.leadStatus===s?col:'rgba(255,255,255,0.12)'),background:form.leadStatus===s?col+'22':'transparent',color:form.leadStatus===s?col:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{s}</button>);})}
          </div>
        </div>
        <div style={{padding:'0 20px 12px'}}>
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)'}}>
            {[['name','Full Name *'],['title','Role'],['company','Company'],['email','Email'],['phone','Phone'],['leadBudget','Budget'],['leadInterest','Interest / Notes'],['notes','Private Notes']].map((row,i,arr)=>{let k=row[0];let p=row[1];return(
              <div key={k} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                <input value={form[k]||''} onChange={function(ev){upd(k,k==='phone'?formatPhone(ev.target.value):ev.target.value);}} placeholder={p} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'14px',outline:'none',fontFamily:'inherit'}}/>
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:'0 20px 16px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Card Color</div>
          <div style={{display:'flex',gap:'8px'}}>
            {CARD_COLORS.map((c,i)=>{let isActive=form.color&&form.color[0]===c[0];return(<button key={i} onClick={function(){upd('color',c);}} style={{width:'26px',height:'26px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:isActive?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0}}/>);})}
          </div>
        </div>
        <div style={{padding:'0 20px'}}>
          <button onClick={save} style={{width:'100%',background:'linear-gradient(to right,#10b981,#0ea5e9)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'15px'}}>{existing?'Save Changes':'Add Lead'}</button>
        </div>
      </div>
    </div>
  );
}

export { AddLeadModal };
