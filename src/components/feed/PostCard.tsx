// @ts-nocheck
import React from 'react';
import { Heart, MessageSquare, X, Send } from 'lucide-react';
import { Avatar } from '../ui';
import { CARD_COLORS } from '../../constants/cardData';

function PostCard({post,contacts,myCard,onLike,onComment,onDelete,onSelectContact,onViewOwnProfile}){
  let contact=contacts.find((c)=>{return c.id===post.contactId;});
  let dc=post.isOwn?{name:myCard.name||'You',title:myCard.title||'',company:myCard.company||'',color:myCard.color||CARD_COLORS[0]}:contact;
  let [showInput,setShowInput]=React.useState(false);
  let [commentDraft,setCommentDraft]=React.useState('');
  if(!dc)return null;
  return(
    <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',marginBottom:'12px',border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden'}}>
      <div style={{padding:'14px 14px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <Avatar contact={dc} size={38}/>
          <div style={{flex:1}}>
            <div style={{color:'white',fontWeight:700,fontSize:'13px'}}>
              <span onClick={function(){if(post.isOwn)onViewOwnProfile();else if(contact)onSelectContact(contact);}} style={{cursor:'pointer'}}>{dc.name}</span>
              {post.isOwn&&<span style={{color:'#a78bfa',fontSize:'11px',marginLeft:'6px'}}>You</span>}
            </div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>{post.time}</div>
          </div>
          {post.isOwn&&<button onClick={function(){onDelete(post.id);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',padding:'4px',display:'flex',borderRadius:'6px'}}><X size={15}/></button>}
        </div>
        <p style={{color:'#e2e8f0',fontSize:'14px',lineHeight:1.6,margin:'0 0 12px'}}>{post.text}</p>
      </div>
      <div style={{padding:'8px 14px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:'4px'}}>
        <button onClick={function(){onLike(post.id);}} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',padding:'6px 10px',borderRadius:'8px',color:post.liked?'#ef4444':'rgba(255,255,255,0.45)',fontSize:'13px',fontWeight:600}}><Heart size={16} fill={post.liked?'#ef4444':'none'}/>{post.likes>0&&post.likes}</button>
        <button onClick={function(){setShowInput(function(v){return !v;});}} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',padding:'6px 10px',borderRadius:'8px',color:'rgba(255,255,255,0.45)',fontSize:'13px',fontWeight:600}}><MessageSquare size={16}/>{(post.comments||[]).length>0&&post.comments.length}</button>
      </div>
      {(post.comments||[]).length>0&&(
        <div style={{padding:'4px 14px 10px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
          {(post.comments||[]).map(function(c,i){
            let cAuthor=c.isOwn
              ?{name:myCard.name||'You',color:myCard.color||CARD_COLORS[0]}
              :{name:c.authorName||dc.name||'Member',color:dc.color||CARD_COLORS[0]};
            return(
              <div key={'comment-'+String(post.id)+'-'+String(c.id||i)+'-'+(c.time||i)} style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'10px'}}>
                <Avatar contact={cAuthor} size={24}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'2px'}}>
                    <span style={{color:'white',fontWeight:700,fontSize:'12px'}}>{cAuthor.name}</span>
                    <span style={{color:'rgba(255,255,255,0.35)',fontSize:'10px'}}>{c.time}</span>
                  </div>
                  <p style={{color:'#e2e8f0',fontSize:'13px',lineHeight:1.5,margin:0,wordBreak:'break-word'}}>{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showInput&&(
        <div style={{padding:'8px 14px 12px',display:'flex',gap:'8px',alignItems:'center',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
          <Avatar contact={{name:myCard.name||'Y',color:myCard.color||CARD_COLORS[0]}} size={26}/>
          <div style={{flex:1,position:'relative'}}>
            <input value={commentDraft} onChange={function(e){setCommentDraft(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'&&commentDraft.trim()){onComment(post.id,commentDraft.trim());setCommentDraft('');}}} placeholder="Write a comment..." style={{width:'100%',padding:'8px 36px 8px 12px',borderRadius:'20px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'16px',outline:'none',boxSizing:'border-box'}}/>
            {commentDraft.trim()&&<button onClick={function(){onComment(post.id,commentDraft.trim());setCommentDraft('');}} style={{position:'absolute',right:'6px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8b5cf6',display:'flex'}}><Send size={15}/></button>}
          </div>
        </div>
      )}
    </div>
  );
}

export { PostCard };
