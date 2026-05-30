// @ts-nocheck
import React from 'react';
import { LEAD_STATUS_COLORS } from '../../constants/cardData';
import { LeadBadge, SocialLinks, ProBadges } from '../ui';

function Card3D({card,isCenter,style,photo,autoFlip,autoFlipKey,onNameClick,...restProps}){
  style=style||{};
  let ref=React.useRef(null);
  let animRef=React.useRef(null);
  let flipRef=React.useRef(0);
  let dragging=React.useRef(false);
  let dragStartX=React.useRef(0);
  let dragStartFlip=React.useRef(0);
  let autoFlipDone=React.useRef(false);
  let [flip,setFlip]=React.useState(0);
  let [tiltX,setTiltX]=React.useState(0);
  let [tiltY,setTiltY]=React.useState(0);
  let [shimX,setShimX]=React.useState(50);
  let [shimY,setShimY]=React.useState(50);
  let [hovered,setHovered]=React.useState(false);
  let isLead=card.cardType==='lead';
  let c1=isLead?(LEAD_STATUS_COLORS[card.leadStatus]||'#10b981'):(card.color&&card.color[0]?card.color[0]:'#8b5cf6');
  let c2=isLead?'#0ea5e9':(card.color&&card.color[1]?card.color[1]:'#6366f1');
  let rgb=c1.replace('#','').match(/.{2}/g).map((h)=>{return parseInt(h,16);}).join(',');
  let cs=card.cardStyle||'light';

  React.useEffect(function(){
    autoFlipDone.current=false;
    flipRef.current=0;
    setFlip(0);
  },[autoFlipKey]);
  React.useEffect(function(){
    if(isCenter)return;
    if(animRef.current)cancelAnimationFrame(animRef.current);
    dragging.current=false;
    flipRef.current=0;
    setFlip(0);
    setTiltX(0);
    setTiltY(0);
  },[isCenter]);

  function snapTo(target){
    if(animRef.current)cancelAnimationFrame(animRef.current);
    let start=performance.now();let from=flipRef.current;
    function tick(now){let t=Math.min((now-start)/450,1);let v=from+(target-from)*(1-Math.pow(1-t,3));flipRef.current=v;setFlip(v);if(t<1)animRef.current=requestAnimationFrame(tick);}
    animRef.current=requestAnimationFrame(tick);
  }
  React.useEffect(function(){
    if(!isCenter||!autoFlip||autoFlipDone.current)return;
    autoFlipDone.current=true;
    let t1=setTimeout(function(){snapTo(180);},900);
    let t2=setTimeout(function(){snapTo(0);},2700);
    return function(){clearTimeout(t1);clearTimeout(t2);};
  },[isCenter,autoFlip,autoFlipKey]);

  function onMove(e){
    if(!ref.current||!isCenter)return;
    let r=ref.current.getBoundingClientRect();
    let cx=e.clientX!==undefined?e.clientX:(e.touches&&e.touches[0]?e.touches[0].clientX:0);
    let cy=e.clientY!==undefined?e.clientY:(e.touches&&e.touches[0]?e.touches[0].clientY:0);
    if(dragging.current){let v=Math.max(0,Math.min(180,dragStartFlip.current+(cx-dragStartX.current)*0.6));flipRef.current=v;setFlip(v);}
    else{setTiltY(((cx-r.left-r.width/2)/(r.width/2))*12);setTiltX((-(cy-r.top-r.height/2)/(r.height/2))*12);}
    setShimX(((cx-r.left)/r.width)*100);setShimY(((cy-r.top)/r.height)*100);
  }
  function onStart(e){
    if(!isCenter)return;
    let cx=e.clientX!==undefined?e.clientX:(e.touches&&e.touches[0]?e.touches[0].clientX:0);
    dragging.current=true;dragStartX.current=cx;dragStartFlip.current=flipRef.current;
  }
  function onEnd(){if(!isCenter)return;dragging.current=false;snapTo(flipRef.current>90?180:0);}

  let effectiveFlip=isCenter?flip:0;
  let showBack=effectiveFlip>90;
  let cosFlip=Math.cos(effectiveFlip*Math.PI/180);
  let scaleX=showBack?-cosFlip:Math.abs(cosFlip);
  let shimOpacity=hovered?Math.min((Math.abs(tiltX)+Math.abs(tiltY))/24*0.6+0.1,0.5):0;
  let nt=onNameClick?function(e){e.stopPropagation();onNameClick();}:null;
  function cardDisplayUsername(){
    if(card.username)return card.username;
    if(card.isSeed&&card.instagram)return String(card.instagram).replace(/^@+/,'');
    return '';
  }
  function renderUsernameLine(dark){
    let handle=cardDisplayUsername();
    if(!handle)return null;
    return <div style={{fontSize:'7.5px',fontWeight:500,color:dark?'rgba(255,255,255,0.38)':'rgba(26,26,46,0.48)',margin:'0 0 1px',lineHeight:1.15,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>@{' '+handle}</div>;
  }
  function ellipsizeLine(style,children){
    if(!children)return null;
    return <div style={Object.assign({overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.2},style)}>{children}</div>;
  }
  function renderContactFront(dark){
    let shell=dark?{bg:'linear-gradient(145deg,#12102a,#1a1640)',border:undefined}:{bg:'linear-gradient(135deg,#fff,#f8f4ff,#eef2ff)',border:'2px solid rgba('+rgb+',0.35)'};
    let titleCol=dark?c1:'#1a1a2e';
    let companyStyle=dark?{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:0}:{fontSize:'11px',fontWeight:650,background:'linear-gradient(to right,'+c1+','+c2+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:0};
    return(
      <div style={{position:'absolute',inset:0,borderRadius:'14px',overflow:'hidden',background:shell.bg,border:shell.border}}>
        {dark&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:'3px',background:'linear-gradient(to right,'+c1+','+c2+')'}}/>}
        {dark&&<div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at '+shimX+'% '+shimY+'%,rgba('+rgb+',0.18),transparent 60%)',opacity:shimOpacity}}/>}
        {!dark&&<div style={{position:'absolute',inset:0,pointerEvents:'none',mixBlendMode:'overlay',background:'radial-gradient(circle at '+shimX+'% '+shimY+'%,rgba(255,255,255,0.8),rgba(139,92,246,0.3) 25%,transparent 70%)',opacity:shimOpacity}}/>}
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:dark?'3px':'2px',padding:dark?'11px 13px 4px':'10px 12px 4px',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'flex-start',zIndex:1}}>
          <div style={{flexShrink:0,minWidth:0,marginBottom:'3px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,'+c1+','+c2+')',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'12px',flexShrink:0}}>{(card.company||'?').charAt(0)}</div>
              {card.cardType==='professional'&&<div style={{fontSize:'7px',fontWeight:700,letterSpacing:'0.06em',padding:'2px 6px',borderRadius:'20px',background:dark?'linear-gradient(135deg,'+c1+','+c2+')':c1+'22',color:dark?'white':c1,border:dark?'none':'1px solid '+c1+'44',textTransform:'uppercase',flexShrink:0}}>Pro</div>}
            </div>
            <div onClick={nt} style={{fontSize:'14px',fontWeight:700,color:dark?'white':titleCol,margin:'0 0 1px',lineHeight:1.15,cursor:nt?'pointer':'default',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{card.name}</div>
            {renderUsernameLine(dark)}
            {ellipsizeLine({fontSize:'10.5px',fontWeight:600,color:c1,marginBottom:'1px'},card.title)}
            {ellipsizeLine(companyStyle,card.company)}
          </div>
          <div style={{flexShrink:0,borderTop:'1px solid '+(dark?'rgba('+rgb+',0.2)':c1+'22'),paddingTop:'6px',paddingBottom:'3px',minWidth:0}}>
            {card.email&&<div style={{fontSize:'8.5px',color:dark?'rgba(255,255,255,0.45)':'#555',marginBottom:'1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{card.email}</div>}
            {card.phone&&<div style={{fontSize:'8.5px',color:dark?'rgba(255,255,255,0.45)':'#555',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{card.phone}</div>}
            <SocialLinks card={card} dark={dark}/>
            <ProBadges card={card} dark={dark}/>
          </div>
        </div>
        {dark&&<div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(to right,transparent,'+c1+','+c2+',transparent)',opacity:0.7}}/>}
      </div>
    );
  }

  function renderFront(){
    if(showBack)return null;
    if(isLead){
      return(
        <div style={{position:'absolute',inset:0,borderRadius:'14px',overflow:'hidden',background:'linear-gradient(145deg,#0a1628,#0d1f3c)'}}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'3px',background:'linear-gradient(to right,'+c1+','+c2+')'}}/>
          <div style={{padding:'11px 13px',height:'100%',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',zIndex:1}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <div style={{fontSize:'8px',fontWeight:600,letterSpacing:'0.08em',color:'rgba(255,255,255,0.36)',textTransform:'uppercase'}}>CLIENT / LEAD</div>
                <LeadBadge status={card.leadStatus} small={true}/>
              </div>
              <div onClick={nt} style={{fontSize:'15px',fontWeight:700,color:'white',margin:'0 0 1px',lineHeight:1.2,cursor:nt?'pointer':'default'}}>{card.name}</div>
              {renderUsernameLine(true)}
              {card.title&&<div style={{fontSize:'10.5px',fontWeight:600,color:c1,margin:'0 0 1px',lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{card.title}</div>}
              {card.company&&<div style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.4)',lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:0}}>{card.company}</div>}
              {card.leadInterest&&<div style={{fontSize:'8.5px',color:'rgba(255,255,255,0.35)',marginTop:'4px',fontStyle:'italic'}}>{card.leadInterest}</div>}
            </div>
            <div style={{borderTop:'1px solid rgba('+rgb+',0.2)',paddingTop:'6px'}}>
              {card.email&&<div style={{fontSize:'8.5px',color:'rgba(255,255,255,0.45)',marginBottom:'1px'}}>{card.email}</div>}
              {card.phone&&<div style={{fontSize:'8.5px',color:'rgba(255,255,255,0.45)'}}>{card.phone}</div>}
              {card.leadBudget&&<div style={{fontSize:'8px',color:c1,marginTop:'3px',fontWeight:700}}>{'Budget: '+card.leadBudget}</div>}
            </div>
          </div>
        </div>
      );
    }
    return renderContactFront(cs==='dark');
  }

  function renderBack(){
    if(!showBack)return null;
    return(
      <div style={{position:'absolute',inset:0,borderRadius:'14px',overflow:'hidden',background:'#0d0b1e'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,'+c1+'30 1px,transparent 1px)',backgroundSize:'14px 14px'}}/>
        <div style={{position:'relative',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',padding:'11px 10px 9px',boxSizing:'border-box',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <div style={{width:'13px',height:'13px',borderRadius:'3px',background:'linear-gradient(135deg,'+c1+','+c2+')',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'6px',fontWeight:700,color:'white',lineHeight:1}}>CH</span></div>
            <span style={{fontSize:'8.5px',fontWeight:650,letterSpacing:'0.12em',color:'rgba(255,255,255,0.55)',textTransform:'uppercase'}}>CardHoldr</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'7px'}}>
            <div style={{width:'50px',height:'50px',borderRadius:'50%',background:'linear-gradient(135deg,'+c1+'33,'+c2+'33)',border:'1.5px solid '+c1+'66',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {photo?<img src={photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:'18px',fontWeight:700,color:'white'}}>{(card.name||'CH').split(' ').map((w)=>{return w[0];}).join('').slice(0,2).toUpperCase()}</span>}
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'9px',fontWeight:650,color:'rgba(255,255,255,0.9)'}}>{card.name}</div>
              {isLead&&<LeadBadge status={card.leadStatus} small={true}/>}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
            <div style={{width:'38px',height:'38px',background:'white',borderRadius:'5px',padding:'3px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="32" height="32" viewBox="0 0 44 44">
                <rect x="0" y="0" width="14" height="14" rx="2" fill={c1}/><rect x="2" y="2" width="10" height="10" rx="1" fill="white"/><rect x="4" y="4" width="6" height="6" fill={c1}/>
                <rect x="30" y="0" width="14" height="14" rx="2" fill={c1}/><rect x="32" y="2" width="10" height="10" rx="1" fill="white"/><rect x="34" y="4" width="6" height="6" fill={c1}/>
                <rect x="0" y="30" width="14" height="14" rx="2" fill={c1}/><rect x="2" y="32" width="10" height="10" rx="1" fill="white"/><rect x="4" y="34" width="6" height="6" fill={c1}/>
                {[[18,2],[20,2],[18,6],[22,6],[20,10],[18,14],[22,14],[16,18],[20,18],[18,22],[22,22],[16,26],[20,26],[18,30],[16,34],[22,34],[20,38],[18,42]].map((pt,i)=>{return <rect key={i} x={pt[0]} y={pt[1]} width="2" height="2" fill={c1}/>;}) }
              </svg>
            </div>
            <span style={{fontSize:'6px',letterSpacing:'0.1em',color:c1+'99',textTransform:'uppercase'}}>Scan to connect</span>
          </div>
        </div>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(to right,transparent,'+c1+','+c2+',transparent)'}}/>
      </div>
    );
  }

  return(
    <div ref={ref} {...restProps} onMouseMove={onMove} onMouseDown={onStart} onMouseUp={onEnd}
      onMouseLeave={function(){if(!isCenter)return;setHovered(false);dragging.current=false;setTiltX(0);setTiltY(0);}}
      onMouseEnter={function(){if(isCenter)setHovered(true);}}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      style={Object.assign({},style,{cursor:isCenter?'grab':'default',userSelect:'none',WebkitUserSelect:'none'})}>
      <div style={{width:'100%',height:'100%',position:'relative',overflow:'hidden',borderRadius:'14px',transform:'rotateX('+tiltX+'deg) rotateY('+(tiltY*0.1)+'deg) scaleX('+scaleX+')',transition:dragging.current?'none':'transform 0.05s linear',filter:isCenter?'drop-shadow(0 20px 40px rgba(0,0,0,0.55))':'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'}}>
        {renderFront()}
        {renderBack()}
      </div>
    </div>
  );
}

export { Card3D };
