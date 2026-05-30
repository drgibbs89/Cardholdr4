// @ts-nocheck
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CARD_COLORS } from '../../constants/cardData';
import { formatPhone, cleanObj } from '../../lib/safety';

function AIScanReview({photo,onSave,onRetake,onClose}){
  let [stage,setStage]=React.useState('scanning');
  let [form,setForm]=React.useState({name:'',title:'',company:'',email:'',phone:'',website:''});
  let [ci,setCi]=React.useState(Math.floor(Math.random()*CARD_COLORS.length));
  let [dots,setDots]=React.useState('');
  function upd(k,v){setForm(function(f){let n=Object.assign({},f);n[k]=v;return n;});}
  React.useEffect(function(){if(stage!=='scanning')return;let id=setInterval(function(){setDots(function(d){return d.length>=3?'':d+'.';});},500);return function(){clearInterval(id);};},[stage]);
  React.useEffect(function(){
    (async function(){
      try{
        let b64=photo.includes(',')?photo.split(',')[1]:photo;
        let res=await fetch('/api/scan-card',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:b64})});
        let data=await res.json();
        let txt=(data.content&&data.content[0]&&data.content[0].text)||'{}';
        let parsed=JSON.parse(txt.replace(/```json|```/g,'').trim());
        setForm(function(f){return Object.assign({},f,cleanObj(parsed));});
        setStage('review');
      }catch(e){setStage('manual');}
    })();
  },[]);
  function save(){if(!form.name&&!form.company){alert('Please enter a name or company');return;}onSave(Object.assign({},cleanObj(form),{color:CARD_COLORS[ci],id:Date.now(),source:'scanned',date:'Just now',tags:[],notes:'',favorite:false}));}
  if(stage==='scanning')return(
    <div style={{minHeight:'100vh',background:'#0d0b1e',display:'flex',flexDirection:'column',color:'white'}}>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      <div style={{padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'12px'}}>
        <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
        <h2 style={{fontSize:'17px',fontWeight:800,margin:0}}>Scanning...</h2>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',gap:'28px'}}>
        <img src={photo} alt="card" style={{width:'100%',maxWidth:'320px',borderRadius:'14px',maxHeight:'180px',objectFit:'cover',border:'1px solid rgba(255,255,255,0.1)',display:'block'}}/>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'18px',height:'18px',borderRadius:'50%',border:'2px solid rgba(139,92,246,0.3)',borderTop:'2px solid #8b5cf6',animation:'spin 0.8s linear infinite'}}/>
          <span style={{fontSize:'15px',fontWeight:700}}>{'Reading card'+dots}</span>
        </div>
        <button onClick={onRetake} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)',borderRadius:'12px',padding:'10px 22px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Cancel</button>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:'100vh',background:'#0d0b1e',color:'white',overflowY:'auto'}}>
      <div style={{padding:'14px 18px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'12px',position:'sticky',top:0,backdropFilter:'blur(20px)',zIndex:10}}>
        <button onClick={onRetake} style={{background:'none',border:'none',color:'white',cursor:'pointer',padding:'4px',display:'flex'}}><ArrowLeft size={20}/></button>
        <h2 style={{fontSize:'17px',fontWeight:800,margin:0,flex:1}}>{stage==='review'?'Card Scanned!':'Enter Details'}</h2>
        <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
      </div>
      <div style={{padding:'16px 18px',maxWidth:'480px',margin:'0 auto'}}>
        <img src={photo} alt="" style={{width:'100%',borderRadius:'12px',maxHeight:'130px',objectFit:'cover',border:'1px solid rgba(255,255,255,0.1)',marginBottom:'14px',display:'block'}}/>
        <div style={{display:'flex',gap:'6px',justifyContent:'center',marginBottom:'14px'}}>
          {CARD_COLORS.map((c,i)=>{return(<button key={i} onClick={function(){setCi(i);}} style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:ci===i?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0}}/>);})}
        </div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {[['name','Full Name'],['title','Job Title'],['company','Company'],['email','Email'],['phone','Phone'],['website','Website']].map((row,i,arr)=>{return(<div key={row[0]} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><input value={form[row[0]]||''} onChange={function(ev){upd(row[0],row[0]==='phone'?formatPhone(ev.target.value):ev.target.value);}} placeholder={row[1]} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={onRetake} style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',padding:'13px',borderRadius:'12px',cursor:'pointer',fontWeight:600}}>Retake</button>
          <button onClick={save} style={{flex:2,background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer'}}>Save Contact</button>
        </div>
      </div>
    </div>
  );
}

export { AIScanReview };
