// @ts-nocheck
import React from 'react';
import { Heart } from 'lucide-react';

function TeamPostCard({post,onLike}){
  return(
    <div style={{borderRadius:'16px',marginBottom:'14px',overflow:'hidden',border:'1px solid rgba(139,92,246,0.3)',background:'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.05))'}}>
      <div style={{height:'3px',background:'linear-gradient(to right,#8b5cf6,#6366f1)'}}/>
      <div style={{padding:'14px 14px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'10px',fontWeight:900,color:'white'}}>{post.emoji}</span></div>
          <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:'6px'}}><span style={{color:'white',fontWeight:800,fontSize:'13px'}}>CardHoldr</span><span style={{fontSize:'10px',fontWeight:800,color:'#a78bfa',background:'rgba(139,92,246,0.2)',borderRadius:'4px',padding:'1px 5px'}}>OFFICIAL</span></div><div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>{post.time}</div></div>
        </div>
        <div style={{fontWeight:800,fontSize:'15px',color:'white',marginBottom:'6px'}}>{post.title}</div>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px',lineHeight:1.65,margin:'0 0 12px'}}>{post.text}</p>
      </div>
      <div style={{padding:'8px 14px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex'}}><button onClick={function(){onLike(post.id);}} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',padding:'6px 10px',borderRadius:'8px',color:post.liked?'#ef4444':'rgba(255,255,255,0.45)',fontSize:'13px',fontWeight:600}}><Heart size={16} fill={post.liked?'#ef4444':'none'}/>{post.likes>0&&post.likes}</button></div>
    </div>
  );
}

export { TeamPostCard };
