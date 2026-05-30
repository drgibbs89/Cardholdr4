// @ts-nocheck
import React from 'react';
import { LEAD_STATUS_COLORS } from '../../constants/cardData';

function LeadBadge({status,small}){
  let col=LEAD_STATUS_COLORS[status]||'#10b981';
  return <span style={{fontSize:small?'8px':'10px',fontWeight:700,padding:small?'1px 5px':'2px 7px',borderRadius:'20px',background:col+'22',color:col,border:'1px solid '+col+'44',whiteSpace:'nowrap'}}>{status}</span>;
}

export { LeadBadge };
