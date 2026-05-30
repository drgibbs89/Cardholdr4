// @ts-nocheck
import React from 'react';
import { LEAD_STATUS_COLORS } from '../../constants/cardData';

function Avatar({contact,size}){
  size=size||40;
  let isLead=contact.cardType==='lead';
  let bg=isLead?'linear-gradient(135deg,'+(LEAD_STATUS_COLORS[contact.leadStatus]||'#10b981')+',#0ea5e9)':'linear-gradient(135deg,'+(contact.color&&contact.color[0]?contact.color[0]:'#8b5cf6')+','+(contact.color&&contact.color[1]?contact.color[1]:'#6366f1')+')';
  return <div style={{width:size,height:size,borderRadius:'50%',flexShrink:0,background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:size*0.36}}>{(contact.name||'?').charAt(0)}</div>;
}

export { Avatar };
