// @ts-nocheck
import React from 'react';
import { PrivacyBadge } from './PrivacyBadge';
import { getDefaultPrivacy } from '../../lib/safety';

function StackVisibilityToggle({c,stackPublic,onToggleHidden}){
  let isPrivateContact=(c.privacy||getDefaultPrivacy(c.cardType))==='private';
  let disabled=!stackPublic||isPrivateContact;
  let hidden=c.stackHidden||disabled;
  let label=disabled
    ?(!stackPublic?'Stack is set to private':'Private user - always hidden')
    :c.stackHidden?'Hidden from your public stack':'Visible in your public stack';
  return(
    <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 12px 9px',borderTop:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.02)',opacity:disabled?0.45:1,cursor:disabled?'not-allowed':'pointer'}} onClick={function(e){e.stopPropagation();if(!disabled)onToggleHidden(c.id);}}>
      <div style={{width:'32px',height:'18px',borderRadius:'9px',background:hidden?'rgba(255,255,255,0.12)':'#10b981',position:'relative',transition:'background 0.2s',flexShrink:0}}>
        <div style={{position:'absolute',top:'2px',left:hidden?'2px':'16px',width:'14px',height:'14px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/>
      </div>
      <span style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.5)'}}>{label}</span>
      {!disabled&&<PrivacyBadge privacy={c.stackHidden?'private':'public'} small={true}/>}
    </div>
  );
}

export { StackVisibilityToggle };
