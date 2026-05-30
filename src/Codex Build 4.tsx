// === IMPORTS & CORE CONFIGURATIONS ===
import React from 'react';
import { Camera, Home, MessageCircle, Users, ChevronLeft, ChevronRight, Zap, X, Send, ArrowLeft, Download, BarChart2, Edit3, Bell, Share2, Crown, User, Search, Heart, MessageSquare, Layers, Plus, Mail } from 'lucide-react';

const SUPABASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_URL) || 'your-fallback-url';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_ANON_KEY) || 'your-fallback-key';

// === GLOBAL CONSTANTS & SEED DATA ===
const CARD_COLORS=[['#8b5cf6','#6366f1'],['#0ea5e9','#6366f1'],['#ec4899','#8b5cf6'],['#10b981','#0ea5e9'],['#f59e0b','#ef4444'],['#6366f1','#06b6d4']];
const REACTIONS=['Like','Love','Nice','Wow','Thanks','Great'];

const LEAD_STATUSES=['Lead','Prospect','Active Client','Closed','Follow-up'];
const LEAD_STATUS_COLORS={'Lead':'#f59e0b','Prospect':'#0ea5e9','Active Client':'#10b981','Closed':'#6366f1','Follow-up':'#ec4899'};
const PRO_BADGE_DEFS=[
  {key:'github',label:'GitHub',short:'GitHub',color:'#888',getUrl:function(v){return safeUrl('https://github.com/'+safeName(v));}},
  {key:'portfolio',label:'Portfolio',short:'Portfolio',color:'#8b5cf6',getUrl:function(v){return safeUrl(v);}},
  {key:'resume',label:'Resume',short:'Resume',color:'#0ea5e9',getUrl:function(v){return safeUrl(v);}},
  {key:'website',label:'Website',short:'Website',color:'#10b981',getUrl:function(v){return safeUrl(v);}},
  {key:'hiring',label:'Hiring',short:'Hiring',color:'#f59e0b',getUrl:function(v){return safeUrl(v);}},
];
const CONTACTS=[
  {id:1,name:'Sarah Johnson',title:'CEO',company:'TechCorp',email:'sarah@techcorp.com',phone:'+1 (555) 123-4567',website:'techcorp.com',color:['#8b5cf6','#6366f1'],instagram:'sarahjohnson',twitter:'sarahjohnson',linkedin:'sarahjohnson',tags:['investor'],notes:'Met at SaaS Summit.',source:'scanned',date:'2 days ago',favorite:true,cardType:'professional',github:'sarahjohnson',hiring:'https://techcorp.com/jobs',privacy:'public',isSeed:true},
  {id:2,name:'Michael Williams',title:'CTO',company:'InnovateLabs',email:'michael@innovatelabs.com',phone:'+1 (555) 234-5678',color:['#0ea5e9','#6366f1'],instagram:'mwilliams',twitter:'mwilliams_cto',linkedin:'mwilliams',tags:['engineering'],notes:'Great talk.',source:'scanned',date:'3 days ago',favorite:false,cardType:'professional',github:'mwilliams',portfolio:'https://mwilliams.dev',privacy:'public',isSeed:true},
  {id:3,name:'Jessica Brown',title:'Marketing Director',company:'Digital Solutions',email:'jessica@digitalsolutions.com',phone:'+1 (555) 345-6789',color:['#ec4899','#8b5cf6'],instagram:'jessicabrown',twitter:'jessicabrown',linkedin:'jessicabrown',tags:['marketing'],notes:'Content collab.',source:'scanned',date:'5 days ago',favorite:false,cardType:'social',privacy:'private',isSeed:true},
  {id:4,name:'David Jones',title:'VP of Sales',company:'CloudSync',email:'david@cloudsync.com',phone:'+1 (555) 456-7890',color:['#10b981','#0ea5e9'],twitter:'davidjones',linkedin:'davidjones',tags:['sales'],notes:'Demo Thursday.',source:'scanned',date:'1 week ago',favorite:true,cardType:'professional',privacy:'public',isSeed:true},
  {id:5,name:'Emily Garcia',title:'Product Manager',company:'DataStream',email:'emily@datastream.com',phone:'+1 (555) 567-8901',color:['#f59e0b','#ef4444'],instagram:'emilygarcia',twitter:'emilygarcia',linkedin:'emilygarcia',tags:['product'],notes:'Potential partner.',source:'manual',date:'1 week ago',favorite:false,cardType:'social',privacy:'private',isSeed:true},
];
const SAMPLE_LEADS=[
  {id:101,name:'Robert Kim',title:'Homebuyer',company:'',email:'rkim@email.com',phone:'(212) 555-0101',color:['#10b981','#0ea5e9'],tags:[],notes:'3BR Brooklyn. Budget $1.2M.',source:'manual',date:'1 day ago',favorite:false,cardType:'lead',leadStatus:'Active Client',leadBudget:'$1.2M',leadInterest:'3BR Brooklyn',isSeed:true,privacy:'private',stackHidden:true},
  {id:102,name:'Tina Patel',title:'Seller',company:'',email:'tina@email.com',phone:'(646) 555-0202',color:['#ec4899','#8b5cf6'],tags:[],notes:'Listing at 45 Park Ave.',source:'manual',date:'3 days ago',favorite:false,cardType:'lead',leadStatus:'Lead',leadBudget:'',leadInterest:'45 Park Ave listing',isSeed:true,privacy:'private',stackHidden:true},
  {id:103,name:'Marcus Lee',title:'Investor',company:'Lee Properties LLC',email:'marcus@leeprops.com',phone:'(917) 555-0303',color:['#f59e0b','#ef4444'],tags:[],notes:'Multi-family, cash buyer.',source:'manual',date:'1 week ago',favorite:true,cardType:'lead',leadStatus:'Prospect',leadBudget:'$3M+',leadInterest:'Multi-family',isSeed:true,privacy:'private',stackHidden:true},
];
const THREADS={
  1:[{id:1,from:'them',text:'Hey! Great meeting you at the conference!',time:'9:14 AM',date:'Yesterday'},{id:2,from:'me',text:'Likewise! Your talk was brilliant.',time:'9:22 AM',date:'Yesterday'},{id:3,from:'them',text:'I shared your CardHoldr profile with my team',time:'2:30 PM',date:'Today'}],
  2:[{id:1,from:'them',text:'Do you have the API docs?',time:'11:00 AM',date:'Yesterday'},{id:2,from:'me',text:'Sending them over now!',time:'11:05 AM',date:'Yesterday'}],
  3:[{id:1,from:'them',text:"We're doing a series on product-led growth.",time:'9:00 AM',date:'Today'}],
  4:[{id:1,from:'them',text:'How about next week for the demo?',time:'5:00 PM',date:'Today'}],
  5:[{id:1,from:'them',text:'Thanks for connecting!',time:'1:00 PM',date:'Today'}],
};
const NOTIFS=[{id:1,type:'view',contactId:1,text:'viewed your card',time:'2h ago',read:false},{id:2,type:'exchange',contactId:3,text:'exchanged cards with you',time:'5h ago',read:false},{id:3,type:'message',contactId:2,text:'sent you a message',time:'1d ago',read:true}];
const TEAM_POSTS=[
  {id:'t1',isTeam:true,emoji:'NEW',title:'Physical Card Scanning is here!',text:'You can now scan any physical business card with AI. Head to Home and tap Scan Card to try it.',time:'Just now',likes:142,liked:false,comments:[]},
  {id:'t2',isTeam:true,emoji:'TIP',title:'Pro tip: use tags to organize your network',text:'Add tags like investor or conference to any contact. Filter by tag to find exactly who you need.',time:'2d ago',likes:87,liked:false,comments:[]},
];

// === DATABASE & NETWORK UTILITIES ===
const rand=arr=>arr[Math.floor(Math.random()*arr.length)];
const timeStr=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
const formatPhone=raw=>{const d=raw.replace(/\D/g,'').slice(0,10);if(!d.length)return '';if(d.length<=3)return '('+d;if(d.length<=6)return '('+d.slice(0,3)+') '+d.slice(3);return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6);};
function safeUrl(url){if(!url)return '#';try{let u=url.trim();let p=new URL(u.startsWith('http')?u:'https://'+u);if(p.protocol!=='https:'&&p.protocol!=='http:')return '#';return p.href;}catch(e){return '#';}}
function safeName(u){return(u||'').replace(/[^a-zA-Z0-9_.]/g,'').slice(0,64);}
function cleanObj(obj){if(!obj||typeof obj!=='object')return{};return Object.assign(Object.create(null),obj);}
function getDefaultPrivacy(t){return t==='professional'?'public':'private';}
async function supaFetch(path,opts){opts=opts||{};let token=lsGet('sb_access_token',null);let headers=Object.assign({'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+(token||SUPABASE_ANON_KEY)},opts.headers||{});let res=await fetch(SUPABASE_URL+path,Object.assign({},opts,{headers}));if(!res.ok)return null;let ct=res.headers.get('content-type')||'';if(ct.includes('json'))return res.json();return null;}
async function supaSignOut(){let token=lsGet('sb_access_token',null);if(token)await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+token}});lsDel('sb_access_token');lsDel('sb_user');}
async function supaOAuthUrl(provider){let redirect=window.location.origin+window.location.pathname;return SUPABASE_URL+'/auth/v1/authorize?provider='+provider+'&redirect_to='+encodeURIComponent(redirect);}
async function upsertProfile(userId,data){return supaFetch('/rest/v1/profiles',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(Object.assign({id:userId},data))});}
async function upsertCard(userId,slug,cardData,isPublic){return supaFetch('/rest/v1/cards',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:userId,slug,card_data:cardData,is_public:isPublic!==false})});}
async function loadCard(userId){let rows=await supaFetch('/rest/v1/cards?user_id=eq.'+userId+'&select=*&order=created_at.desc&limit=1');return rows&&rows[0]?rows[0]:null;}

let _mem={};
function lsGet(key,fallback){try{let r=window.localStorage.getItem('ch_'+key);if(r===null||r===undefined)return fallback;return JSON.parse(r);}catch(e){try{let v=_mem['ch_'+key];if(v===undefined)return fallback;return JSON.parse(v);}catch(e2){return fallback;}}}
function lsSet(key,value){try{let s=JSON.stringify(value);window.localStorage.setItem('ch_'+key,s);_mem['ch_'+key]=s;}catch(e){try{_mem['ch_'+key]=JSON.stringify(value);}catch(e2){}}}
function lsDel(key){try{window.localStorage.removeItem('ch_'+key);}catch(e){}delete _mem['ch_'+key];}

// === UI SUB-COMPONENTS & MODALS ===
function ProBadges({card,dark}){
  let active=PRO_BADGE_DEFS.filter((b)=>{return card[b.key];});
  if(!active.length)return null;
  return(
    <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'5px'}}>
      {active.map((b)=>{return(
        <a key={b.key} href={b.getUrl(card[b.key])} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{display:'inline-flex',alignItems:'center',borderRadius:'4px',padding:'2px 6px',textDecoration:'none',background:dark?b.color+'33':b.color+'18',border:'1px solid '+b.color+(dark?'55':'33')}}>
          <span style={{fontSize:'7px',fontWeight:700,color:dark?'rgba(255,255,255,0.85)':b.color,letterSpacing:'.04em'}}>{b.short}</span>
        </a>
      );})}
    </div>
  );
}

function SocialLinks({card,dark}){
  let links=[
    card.instagram&&{label:'@'+safeName(card.instagram),url:safeUrl('https://instagram.com/'+safeName(card.instagram))},
    card.twitter&&{label:'@'+safeName(card.twitter),url:safeUrl('https://twitter.com/'+safeName(card.twitter))},
    card.linkedin&&{label:'@'+safeName(card.linkedin),url:safeUrl('https://linkedin.com/in/'+safeName(card.linkedin))},
  ].filter(Boolean);
  if(!links.length)return null;
  return(
    <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'4px'}}>
      {links.map((item,i)=>{return(
        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{display:'inline-flex',fontSize:'8px',color:dark?'rgba(255,255,255,0.5)':'#555',background:dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)',borderRadius:'5px',padding:'2px 5px',textDecoration:'none',fontWeight:600}}>
          {item.label}
        </a>
      );})}
    </div>
  );
}

function LeadBadge({status,small}){
  let col=LEAD_STATUS_COLORS[status]||'#10b981';
  return <span style={{fontSize:small?'8px':'10px',fontWeight:700,padding:small?'1px 5px':'2px 7px',borderRadius:'20px',background:col+'22',color:col,border:'1px solid '+col+'44',whiteSpace:'nowrap'}}>{status}</span>;
}

function Avatar({contact,size}){
  size=size||40;
  let isLead=contact.cardType==='lead';
  let bg=isLead?'linear-gradient(135deg,'+(LEAD_STATUS_COLORS[contact.leadStatus]||'#10b981')+',#0ea5e9)':'linear-gradient(135deg,'+(contact.color&&contact.color[0]?contact.color[0]:'#8b5cf6')+','+(contact.color&&contact.color[1]?contact.color[1]:'#6366f1')+')';
  return <div style={{width:size,height:size,borderRadius:'50%',flexShrink:0,background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:size*0.36}}>{(contact.name||'?').charAt(0)}</div>;
}

function PrivacyBadge({privacy,small,hidden}){
  if(hidden)return <span style={{display:'inline-flex',fontSize:small?'9px':'11px',fontWeight:700,padding:small?'1px 6px':'3px 8px',borderRadius:'20px',background:'rgba(107,114,128,0.15)',color:'#9ca3af',border:'1px solid rgba(107,114,128,0.25)'}}>Hidden</span>;
  let isPublic=privacy==='public';
  return <span style={{display:'inline-flex',fontSize:small?'9px':'11px',fontWeight:700,padding:small?'1px 6px':'3px 8px',borderRadius:'20px',background:isPublic?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.12)',color:isPublic?'#10b981':'#f87171',border:'1px solid '+(isPublic?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.25)')}}>{isPublic?'Public':'Private'}</span>;
}

function BackButton({onClick,label}){
  return(
    <button onClick={onClick} aria-label={label||'Back'} title={label||'Back'} style={{width:'34px',height:'34px',borderRadius:'10px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0,flexShrink:0}}>
      <ArrowLeft size={17}/>
    </button>
  );
}
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

// â”€â”€â”€ ShareCardModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ShareCardModal({card,onClose}){
  let [copied,setCopied]=React.useState(false);
  let slug=(card.name||'contact').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  let url='https://cardholdr.co/'+slug;
  let vcard='BEGIN:VCARD\nVERSION:3.0\nFN:'+(card.name||'')+'\nORG:'+(card.company||'')+'\nTITLE:'+(card.title||'')+'\nEMAIL:'+(card.email||'')+'\nTEL:'+(card.phone||'')+'\nEND:VCARD';
  let vh='data:text/vcard;charset=utf-8,'+encodeURIComponent(vcard);
  function copy(){navigator.clipboard&&navigator.clipboard.writeText(url).then(function(){setCopied(true);setTimeout(function(){setCopied(false);},2000);});}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'24px 24px 0 0',padding:'8px 0 32px',maxWidth:'480px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',borderBottom:'none',maxHeight:'90vh',overflowY:'auto'}} onClick={function(e){e.stopPropagation();}}>
        <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)',margin:'12px auto 20px'}}/>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{background:'linear-gradient(135deg,'+(card.color&&card.color[0]?card.color[0]:'#8b5cf6')+','+(card.color&&card.color[1]?card.color[1]:'#6366f1')+')',borderRadius:'16px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:900,color:'white',flexShrink:0}}>{(card.name||'?').charAt(0)}</div>
            <div><div style={{color:'white',fontWeight:800,fontSize:'15px'}}>{card.name}</div><div style={{color:'rgba(255,255,255,0.75)',fontSize:'12px'}}>{card.title}{card.company?' · '+card.company:''}</div></div>
          </div>
        </div>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'center',background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'10px 14px',border:'1px solid rgba(255,255,255,0.1)'}}>
            <span style={{flex:1,fontSize:'12px',color:'#a78bfa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{url}</span>
            <button onClick={copy} style={{background:copied?'rgba(16,185,129,0.2)':'rgba(139,92,246,0.25)',border:'1px solid '+(copied?'rgba(16,185,129,0.4)':'rgba(139,92,246,0.4)'),color:copied?'#34d399':'#a78bfa',borderRadius:'8px',padding:'5px 12px',cursor:'pointer',fontSize:'12px',fontWeight:700,flexShrink:0}}>{copied?'Copied!':'Copy'}</button>
          </div>
        </div>
        <div style={{padding:'0 20px',marginBottom:'16px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[['Text','sms:?body='+encodeURIComponent("Here's my card: "+url)],['Email','mailto:?subject=My+Card&body='+encodeURIComponent(url)],['WhatsApp','https://wa.me/?text='+encodeURIComponent("Here's my card: "+url)]].map((item)=>{return(<a key={item[0]} href={item[1]} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'white',textDecoration:'none',fontSize:'13px',fontWeight:600}}>{item[0]}</a>);})}
            <a href={vh} download={(card.name||'contact').replace(/[^a-z0-9]/gi,'-')+'.vcf'} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',color:'white',textDecoration:'none',fontSize:'13px',fontWeight:600}}>vCard</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ ProfileScreen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProfileScreen({myCard,contacts,onSave,onClose,onShowAnalytics,photo,onStyleChange,onColorChange,onLogout,onToggleHidden}){
  let [editing,setEditing]=React.useState(false);
  let [form,setForm]=React.useState(Object.assign({},myCard));
  let [viewCi,setViewCi]=React.useState(Math.max(0,CARD_COLORS.findIndex(function(c){return c[0]===(myCard.color&&myCard.color[0]);})));
  let [showShare,setShowShare]=React.useState(false);
  let [profileTab,setProfileTab]=React.useState('card');
  let [contactsView,setContactsView]=React.useState('carousel');
  let [profileContactIndex,setProfileContactIndex]=React.useState(0);
  let profileSwipeRef=React.useRef(null);
  let profileContacts=(contacts||[]).filter((c)=>{return c.cardType!=='lead';});
  let profileSafeIdx=Math.min(profileContactIndex,Math.max(0,profileContacts.length-1));
  let profileContact=profileContacts[profileSafeIdx];
  function getProfileVisible(){if(!profileContacts.length)return[];return[-2,-1,0,1,2].map((i)=>{return{card:profileContacts[(profileSafeIdx+i+profileContacts.length)%profileContacts.length],offset:i};});}
  function setProfileContactIndexWithClick(updater,count){if(navigator.vibrate&&count)navigator.vibrate(Array(Math.min(3,count)).fill(8));setProfileContactIndex(updater);}
  function startProfileSwipe(e){if(profileContacts.length<2)return;let target=e.target;if(target&&target.closest&&target.closest('[data-center-card="true"]'))return;let p=e.touches&&e.touches[0]?e.touches[0]:e;profileSwipeRef.current={x:p.clientX,y:p.clientY,t:performance.now(),active:true};}
  function moveProfileSwipe(e){let s=profileSwipeRef.current;if(!s||!s.active)return;let p=e.touches&&e.touches[0]?e.touches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.3&&e.cancelable)e.preventDefault();}
  function endProfileSwipe(e){let s=profileSwipeRef.current;if(!s||!s.active)return;let p=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;profileSwipeRef.current=null;if(Math.abs(dx)<64||Math.abs(dx)<Math.abs(dy)*1.35)return;let elapsed=Math.max(1,performance.now()-(s.t||performance.now()));let speed=Math.abs(dx)/elapsed;let distanceSteps=Math.floor(Math.abs(dx)/150);let velocitySteps=Math.floor(speed/0.55);let steps=Math.max(1,distanceSteps,velocitySteps);steps=Math.min(steps,profileContacts.length-1);setProfileContactIndexWithClick(function(i){let dir=dx<0?1:-1;return(i+(dir*steps)+profileContacts.length*steps)%profileContacts.length;},steps);}
  function upd(k,v){setForm(function(f){let n=Object.assign({},f);n[k]=v;return n;});}
  if(showShare)return <ShareCardModal card={myCard} onClose={function(){setShowShare(false);}}/>;
  if(editing)return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'14px 18px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'12px',position:'sticky',top:0,backdropFilter:'blur(20px)',zIndex:10}}>
        <button onClick={function(){setEditing(false);}} style={{background:'none',border:'none',color:'white',cursor:'pointer',padding:'4px',display:'flex'}}><ArrowLeft size={20}/></button>
        <h2 style={{fontSize:'17px',fontWeight:800,margin:0,flex:1}}>Edit My Card</h2>
        <button onClick={function(){onSave(cleanObj(form));setEditing(false);}} style={{background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',border:'none',borderRadius:'9px',padding:'8px 16px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>Save</button>
      </div>
      <div style={{padding:'16px 20px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Basic Info</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {[['name','Full Name'],['title','Job Title'],['company','Company'],['email','Email'],['phone','Phone'],['website','Website']].map((row,i,arr)=>{return(<div key={row[0]} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><input value={form[row[0]]||''} onChange={function(ev){upd(row[0],row[0]==='phone'?formatPhone(ev.target.value):ev.target.value);}} placeholder={row[1]} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Social</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {[['instagram','Instagram username'],['twitter','Twitter/X username'],['linkedin','LinkedIn username']].map((row,i,arr)=>{return(<div key={row[0]} style={{display:'flex',alignItems:'center',padding:'11px 14px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><input value={form[row[0]]||''} onChange={function(ev){upd(row[0],ev.target.value);}} placeholder={row[1]} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'16px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
        <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}><Crown size={11} color="#fbbf24"/> Pro Badges</div>
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'14px',overflow:'hidden',marginBottom:'14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          {PRO_BADGE_DEFS.map((b,i)=>{return(<div key={b.key} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 14px',borderBottom:i<PRO_BADGE_DEFS.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><div style={{width:'36px',height:'20px',borderRadius:'4px',background:b.color+'22',border:'1px solid '+b.color+'44',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'7px',fontWeight:900,color:b.color}}>{b.short}</span></div><input value={form[b.key]||''} onChange={function(ev){upd(b.key,ev.target.value);}} placeholder={b.key==='github'?'username':'https://...'} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/></div>);})}
        </div>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px'}}>
        <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600,padding:0}}><ArrowLeft size={18}/> Back</button>
        <button onClick={function(){setEditing(true);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'9px',padding:'7px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600}}><Edit3 size={14}/> Edit</button>
      </div>
      <div style={{padding:'0 20px 32px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'16px'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'3px solid rgba(255,255,255,0.15)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}>
            {photo?<img src={photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:'28px',fontWeight:900,color:'white'}}>{(myCard.name||'Y').charAt(0)}</span>}
          </div>
          <h1 style={{fontSize:'20px',fontWeight:900,margin:'0 0 2px'}}>{myCard.name||'Your Name'}</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.55)',margin:0}}>{myCard.title||''}</p>
        </div>
        <div style={{display:'flex',gap:'6px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'4px',marginBottom:'12px'}}>
          {[['card','My Card'],['contacts','Contacts']].map((pair)=>{let active=profileTab===pair[0];return(<button key={pair[0]} onClick={function(){setProfileTab(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'9px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:800,background:active?'linear-gradient(135deg,#8b5cf6,#6366f1)':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
        </div>
        {profileTab==='card'?(
          <>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}><div style={{width:'100%',maxWidth:'300px',height:'172px'}}><Card3D card={myCard.name?myCard:Object.assign({},myCard,{name:'Your Name',company:'Your Company'})} isCenter={true} style={{width:'100%',height:'100%'}} photo={photo} autoFlip={true}/></div></div>
            <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',margin:'0 0 16px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
          </>
        ):(
          <div style={{marginBottom:'16px'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['carousel','Carousel'],['stack','Stack']].map((pair)=>{let active=contactsView===pair[0];return(<button key={pair[0]} onClick={function(){setContactsView(pair[0]);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:active?800:600,background:active?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}</div></div>
            {profileContacts.length===0?(
              <div style={{textAlign:'center',padding:'32px 20px',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>No contacts yet</div>
            ):contactsView==='carousel'?(
              <>
                <div data-carousel-swipe="true" onMouseDown={startProfileSwipe} onMouseMove={moveProfileSwipe} onMouseUp={endProfileSwipe} onMouseLeave={function(){profileSwipeRef.current=null;}} onTouchStart={startProfileSwipe} onTouchMove={moveProfileSwipe} onTouchEnd={endProfileSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                  <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                    {getProfileVisible().map((item)=>{let card=item.card;let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);return(
                      <Card3D key={'profile-carousel-'+card.id} card={card} isCenter={isCenter} autoFlip={false}
                        onClick={!isCenter?function(e){e.stopPropagation();setProfileContactIndexWithClick(function(i){return(i+offset+profileContacts.length)%profileContacts.length;},Math.abs(offset));}:undefined}
                        style={{position:'absolute',width:'88%',maxWidth:'310px',height:'177px',transform:'translateX('+(offset*72)+'%) scale('+(isCenter?1:0.74)+')',transformOrigin:'center center',zIndex:isCenter?30:20-absOff,opacity:isCenter?1:Math.max(0.15,0.45-absOff*0.15),transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1),opacity 0.45s',cursor:'pointer',touchAction:isCenter?'none':'pan-y'}}
                        data-carousel-card="true" data-center-card={isCenter?'true':undefined}/>
                    );})}
                  </div>
                </div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.28)',textAlign:'center',margin:'0 0 2px',fontWeight:500}}>&lt;- Drag to flip -&gt;</p>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.24)',textAlign:'center',margin:'0 0 6px',fontWeight:500,letterSpacing:0}}>&lt;-- Swipe side cards to scroll --&gt;</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <button onClick={function(){setProfileContactIndexWithClick(function(i){return(i-1+profileContacts.length)%profileContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}><ChevronLeft size={15}/> Prev</button>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:700}}>{(profileSafeIdx+1)+' / '+profileContacts.length}</div>
                  <button onClick={function(){setProfileContactIndexWithClick(function(i){return(i+1)%profileContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}>Next <ChevronRight size={15}/></button>
                </div>
              </>
            ):(
              <div style={{border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',overflow:'hidden',background:'rgba(255,255,255,0.04)'}}>
                {profileContacts.map((c,i)=>{return(<div key={c.id||i} style={{borderBottom:i<profileContacts.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}><div style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 13px'}}><Avatar contact={c} size={38}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:'13px',fontWeight:800,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}{c.company?' · '+c.company:''}</div></div><PrivacyBadge privacy={c.privacy||getDefaultPrivacy(c.cardType)} small={true}/></div><StackVisibilityToggle c={c} stackPublic={myCard.stackPublic} onToggleHidden={onToggleHidden}/></div>);})}
              </div>
            )}
          </div>
        )}
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'14px 16px',marginBottom:'16px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>Card Visibility</div>
          {myCard.cardType!=='professional'?(<div style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{fontSize:'18px',color:'#f87171'}}>Private</span><div><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'2px'}}>Always Private</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>Personal cards are only visible to people you share with.</div></div></div>):(
            <><div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>{[['public','Public'],['private','Private']].map((pair)=>{let val=pair[0];let isActive=(myCard.privacy||'public')===val;return(<button key={val} onClick={function(){onSave(Object.assign({},myCard,{privacy:val}));}} style={{flex:1,padding:'9px',borderRadius:'10px',border:'1px solid '+(isActive?(val==='public'?'rgba(16,185,129,0.5)':'rgba(239,68,68,0.4)'):'rgba(255,255,255,0.1)'),background:isActive?(val==='public'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.12)'):'transparent',color:isActive?(val==='public'?'#10b981':'#f87171'):'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{pair[1]}</button>);})}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>{(myCard.privacy||'public')==='public'?'Your card is public.':'Your card is private.'}</div></>
          )}
        </div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['light','White'],['dark','Dark']].map((pair)=>{let val=pair[0];let isActive=(myCard.cardStyle||'light')===val;return(<button key={val} onClick={function(){if(onStyleChange)onStyleChange(val);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:isActive?700:500,background:isActive?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{val==='light'?'White':'Dark'}</button>);})}</div></div>
        <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'16px'}}>{CARD_COLORS.map((c,i)=>{return(<button key={i} onClick={function(){setViewCi(i);if(onColorChange)onColorChange(c);}} style={{width:'26px',height:'26px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:viewCi===i?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0}}/>);})}</div>
        <button onClick={function(){setShowShare(true);}} style={{width:'100%',background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:700,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'8px'}}><Share2 size={16}/> Share Card</button>
        <button onClick={function(){setEditing(true);}} style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:600,fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'14px'}}><Edit3 size={16}/> Edit Card</button>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
          <button onClick={onShowAnalytics} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}><BarChart2 size={15}/> Analytics</button>
          <button onClick={function(){alert('Pro features coming soon!');}} style={{background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}><Crown size={15}/> Pro</button>
        </div>
        <button onClick={onLogout} style={{width:'100%',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#f87171',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>Sign Out</button>
      </div>
    </div>
  );
}

// â”€â”€â”€ AnalyticsScreen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AnalyticsScreen({onClose,analyticsData}){
  let [showSample,setShowSample]=React.useState(true);
  let views=showSample?47:(analyticsData?analyticsData.views:0);
  let exchanges=showSample?8:(analyticsData?analyticsData.exchanges:0);
  let contactsCount=showSample?5:(analyticsData?analyticsData.contacts:0);
  let chart=showSample?[4,7,5,9,8,6,8]:(analyticsData?analyticsData.chart:[0,0,0,0,0,0,0]);
  let mv=Math.max.apply(null,chart)||1;
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'16px 20px',maxWidth:'600px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',display:'flex',alignItems:'center',flexShrink:0}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:'20px',fontWeight:800,margin:0}}>Analytics</h2>
        </div>
        <button onClick={function(){setShowSample(function(v){return !v;});}} style={{width:'100%',marginBottom:'14px',padding:'12px',borderRadius:'12px',border:'1px solid '+(showSample?'rgba(255,255,255,0.12)':'rgba(139,92,246,0.4)'),background:showSample?'rgba(255,255,255,0.06)':'rgba(139,92,246,0.15)',color:showSample?'rgba(255,255,255,0.55)':'#a78bfa',cursor:'pointer',fontSize:'13px',fontWeight:700}}>
          {showSample?'Hide Sample Data':'Show Sample Data'}
        </button>
        {showSample&&(
          <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)',borderRadius:'12px',padding:'10px 14px',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'11px',fontWeight:800,color:'#f59e0b'}}>SAMPLE</span>
            <span style={{fontSize:'12px',color:'rgba(255,255,255,0.6)'}}>Showing sample data. Hide it to see only your real analytics.</span>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'20px'}}>
          {[{l:'Views',v:views,col:'#8b5cf6'},{l:'Exchanges',v:exchanges,col:'#0ea5e9'},{l:'Contacts',v:contactsCount,col:'#10b981'}].map((s,i)=>{return(<div key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 12px',textAlign:'center'}}><div style={{fontSize:'26px',fontWeight:900,color:s.col,lineHeight:1}}>{s.v}</div><div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{s.l}</div></div>);})}
        </div>
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'18px'}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:'14px'}}>Views this week{showSample&&<span style={{fontSize:'10px',color:'rgba(245,158,11,0.6)',marginLeft:'6px'}}>(sample)</span>}</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'6px',height:'70px'}}>
            {chart.map((v,i)=>{return(<div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}><div style={{width:'100%',background:'linear-gradient(to top,#8b5cf6,#6366f1)',borderRadius:'3px 3px 0 0',height:((v/mv)*60)+'px',minHeight:v>0?'3px':'0'}}/><span style={{fontSize:'8px',color:'rgba(255,255,255,0.35)'}}>{['M','T','W','T','F','S','S'][i]}</span></div>);})}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ NotificationsScreen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function NotificationsScreen({notifs,contacts,onMarkRead,onClose,onSelectContact}){
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white'}}>
      <div style={{padding:'24px',maxWidth:'500px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',display:'flex'}}><ArrowLeft size={18}/></button>
          <h2 style={{fontSize:'22px',fontWeight:800,margin:0}}>Notifications</h2>
          <button onClick={onMarkRead} style={{marginLeft:'auto',background:'none',border:'none',color:'#a78bfa',fontSize:'12px',cursor:'pointer',fontWeight:600}}>Mark all read</button>
        </div>
        {notifs.map((n)=>{
          let c=contacts.find((x)=>{return x.id===n.contactId;})||contacts[0];
          return(
            <div key={n.id} style={{display:'flex',gap:'12px',padding:'14px 16px',borderRadius:'14px',background:n.read?'rgba(255,255,255,0.04)':'rgba(139,92,246,0.1)',border:'1px solid '+(n.read?'rgba(255,255,255,0.06)':'rgba(139,92,246,0.2)'),marginBottom:'10px',alignItems:'center'}}>
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

// â”€â”€â”€ AIScanReview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ ChatView â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ChatView({contact,msgs,draft,setDraft,sendMsg,isTyping,reactions,setReactions,reactionTarget,setReactionTarget,onBack,exportContact}){
  let endRef=React.useRef(null);
  React.useEffect(function(){endRef.current&&endRef.current.scrollIntoView({behavior:'smooth'});},[msgs,isTyping]);
  let grouped=msgs.reduce((acc,msg)=>{let last=acc[acc.length-1];if(last&&last.date===msg.date)last.messages.push(msg);else acc.push({date:msg.date,messages:[msg]});return acc;},[]);
  let c1=(contact.color&&contact.color[0])||'#8b5cf6';
  let c2=(contact.color&&contact.color[1])||'#6366f1';
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'13px 16px',background:'rgba(0,0,0,0.25)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'11px',flexShrink:0}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'white',cursor:'pointer',padding:'4px',display:'flex'}}><ArrowLeft size={20}/></button>
        <Avatar contact={contact} size={38}/>
        <div style={{flex:1}}><div style={{color:'white',fontWeight:700,fontSize:'14px'}}>{contact.name}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>{contact.title}{contact.company?' · '+contact.company:''}</div></div>
        <button onClick={function(){exportContact(contact);}} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'white',cursor:'pointer',padding:'7px',borderRadius:'8px',display:'flex'}}><Download size={15}/></button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:'4px'}} onClick={function(){setReactionTarget(null);}}>
        {grouped.map((group)=>{return(
          <div key={group.date}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'10px 0 8px'}}>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.08)'}}/>
              <span style={{color:'rgba(255,255,255,0.3)',fontSize:'10px',fontWeight:600}}>{group.date}</span>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.08)'}}/>
            </div>
            {group.messages.map((msg,mi)=>{
              let isMe=msg.from==='me';
              let rk=contact.id+'-'+msg.id;
              let mr=reactions[rk];
              let showAv=!isMe&&(mi===0||(group.messages[mi-1]&&group.messages[mi-1].from==='me'));
              return(
                <div key={msg.id} style={{display:'flex',flexDirection:isMe?'row-reverse':'row',alignItems:'flex-end',gap:'7px',marginBottom:'2px'}}>
                  {!isMe&&<div style={{width:26,flexShrink:0}}>{showAv&&<Avatar contact={contact} size={26}/>}</div>}
                  <div style={{maxWidth:'70%',position:'relative'}}>
                    {mr&&<div style={{position:'absolute',bottom:'-10px',[isMe?'left':'right']:'8px',background:'rgba(30,27,75,0.95)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',padding:'1px 5px',fontSize:'13px',zIndex:2}}>{mr}</div>}
                    <div onDoubleClick={function(){setReactionTarget(reactionTarget===msg.id?null:msg.id);}} style={{padding:'9px 13px',borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px',background:isMe?'linear-gradient(135deg,'+c1+','+c2+')':'rgba(255,255,255,0.1)',color:'white',fontSize:'13px',lineHeight:1.45,wordBreak:'break-word'}}>{msg.text}</div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',textAlign:isMe?'right':'left',marginTop:'2px',paddingBottom:mr?'10px':0}}>{msg.time}</div>
                    {reactionTarget===msg.id&&(
                      <div style={{position:'absolute',[isMe?'right':'left']:0,bottom:'100%',marginBottom:'6px',background:'rgba(20,18,60,0.97)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'24px',padding:'6px 10px',display:'flex',gap:'6px',zIndex:10}} onClick={function(e){e.stopPropagation();}}>
                        {REACTIONS.map((em)=>{return(<button key={em} onClick={function(){setReactions(function(p){let n=Object.assign({},p);n[rk]=em;return n;});setReactionTarget(null);}} style={{background:'none',border:'none',cursor:'pointer',fontSize:'19px',padding:'2px'}}>{em}</button>);})}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );})}
        {isTyping&&<div style={{display:'flex',alignItems:'flex-end',gap:'7px'}}><Avatar contact={contact} size={26}/><div style={{background:'rgba(255,255,255,0.1)',borderRadius:'16px 16px 16px 4px',padding:'10px 13px',display:'flex',gap:'4px',alignItems:'center'}}>{[0,1,2].map((i)=>{return(<div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:'rgba(255,255,255,0.6)',animation:'typingDot 1.2s ease-in-out infinite',animationDelay:(i*0.2)+'s'}}/>);})}</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:'10px 13px',background:'rgba(0,0,0,0.2)',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'flex-end',gap:'8px',flexShrink:0}}>
        <div style={{flex:1}}>
          <textarea value={draft} onChange={function(e){setDraft(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}} placeholder="Message..." rows={1} style={{width:'100%',padding:'9px 13px',borderRadius:'18px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',color:'white',fontSize:'16px',outline:'none',resize:'none',boxSizing:'border-box',lineHeight:1.4,maxHeight:'110px',overflow:'auto',fontFamily:'inherit'}}/>
        </div>
        <button onClick={sendMsg} disabled={!draft.trim()} style={{width:'38px',height:'38px',borderRadius:'50%',background:draft.trim()?'linear-gradient(135deg,'+c1+','+c2+')':'rgba(255,255,255,0.1)',border:'none',cursor:draft.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Send size={15} color="white"/></button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Feed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

function CardStackScreen({contacts,onSelectContact,cardTypeFilter,setCardTypeFilter,isPro,onAddLead,onEditLead,onToggleHidden,stackPublic,onToggleStackPublic,showSeedData,onRemoveSamples,onBack}){
  let [stackSearch,setStackSearch]=React.useState('');
  let [stackView,setStackView]=React.useState('contacts');
  let [leadStatusFilter,setLeadStatusFilter]=React.useState('All');
  let [starredIds,setStarredIds]=React.useState(function(){return new Set(contacts.filter((c)=>{return c.favorite;}).map((c)=>{return c.id;}));});
  let [exportedIds,setExportedIds]=React.useState(new Set());
  React.useEffect(function(){if(!isPro&&stackView==='leads')setStackView('contacts');},[isPro,stackView]);
  function toggleStar(e,id){e.stopPropagation();setStarredIds(function(prev){let n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});}
  let leads=contacts.filter((c)=>{return c.cardType==='lead';});
  let regular=contacts.filter((c)=>{return c.cardType!=='lead';}).filter((c)=>{if(cardTypeFilter==='pro')return c.cardType==='professional';if(cardTypeFilter==='personal')return c.cardType!=='professional';return true;}).filter((c)=>{if(!stackSearch)return true;let q=stackSearch.toLowerCase();return(c.name||'').toLowerCase().includes(q)||(c.company||'').toLowerCase().includes(q)||(c.title||'').toLowerCase().includes(q);});
  let filteredLeads=leads.filter((c)=>{if(leadStatusFilter!=='All'&&c.leadStatus!==leadStatusFilter)return false;if(!stackSearch)return true;let q=stackSearch.toLowerCase();return(c.name||'').toLowerCase().includes(q)||(c.leadInterest||'').toLowerCase().includes(q);});
  return(
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'18px 10px 100px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',padding:'0 6px',gap:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
          {onBack&&<BackButton onClick={onBack} label="Back to home"/>}
          <div><h2 style={{fontSize:'26px',fontWeight:800,color:'white',marginBottom:'2px'}}>Card Stack</h2><p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>{isPro?regular.length+' contacts · '+leads.length+' leads':regular.length+' contacts'}</p></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <button onClick={onRemoveSamples} style={{background:showSeedData?'rgba(255,255,255,0.07)':'rgba(139,92,246,0.15)',border:'1px solid '+(showSeedData?'rgba(255,255,255,0.15)':'rgba(139,92,246,0.4)'),color:showSeedData?'rgba(255,255,255,0.5)':'#a78bfa',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',fontSize:'12px',fontWeight:700,whiteSpace:'nowrap'}}>{showSeedData?'Hide Sample Cards':'Show Sample Cards'}</button>
          {isPro&&stackView==='leads'&&<button onClick={onAddLead} style={{background:'linear-gradient(to right,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'10px',padding:'8px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:700}}><Plus size={15}/> Add Lead</button>}
        </div>
      </div>
      <div style={{position:'relative',marginBottom:'12px',padding:'0 6px'}}>
        <input value={stackSearch} onChange={function(e){setStackSearch(e.target.value);}} placeholder="Search..." style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'12px 14px 12px 38px',color:'white',fontSize:'14px',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
        <Search size={14} style={{position:'absolute',left:'20px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)'}}/>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'12px',padding:'0 6px'}}>
        {(isPro?[['contacts','Contacts'],['leads','Leads']]:[['contacts','Contacts']]).map((pair)=>{return(<button key={pair[0]} onClick={function(){setStackView(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'11px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,background:stackView===pair[0]?'linear-gradient(to right,#8b5cf6,#6366f1)':'rgba(255,255,255,0.07)',color:stackView===pair[0]?'white':'rgba(255,255,255,0.5)'}}>{pair[1]}</button>);})}
      </div>
      {stackView==='contacts'&&(
        <div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
            <div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>
              {[['all','All'],['pro','Pro'],['personal','Personal']].map((pair)=>{let isActive=(cardTypeFilter||'all')===pair[0];return(<button key={pair[0]} onClick={function(){setCardTypeFilter(pair[0]);}} style={{padding:'6px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:isActive?700:500,background:isActive?'linear-gradient(to right,#8b5cf6,#6366f1)':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
            </div>
          </div>
          <div onClick={onToggleStackPublic} style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',padding:'11px 14px',borderRadius:'12px',background:stackPublic?'rgba(16,185,129,0.07)':'rgba(107,114,128,0.07)',border:'1px solid '+(stackPublic?'rgba(16,185,129,0.2)':'rgba(107,114,128,0.2)'),marginBottom:'14px'}}>
            <div style={{width:'36px',height:'20px',borderRadius:'10px',background:stackPublic?'#10b981':'rgba(255,255,255,0.15)',position:'relative',transition:'background 0.2s',flexShrink:0}}><div style={{position:'absolute',top:'2px',left:stackPublic?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/></div>
            <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'1px'}}>{stackPublic?'Stack is public':'Stack is private'}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',lineHeight:1.4}}>{stackPublic?'Your public connections are visible to others':'All your connections are hidden from everyone'}</div></div>
            {stackPublic?<PrivacyBadge privacy="public" small={true}/>:<PrivacyBadge hidden={true} small={true}/>}
          </div>
          {regular.length===0?(
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:'14px',fontWeight:800,letterSpacing:'0.08em',marginBottom:'12px'}}>NO CONTACTS</div>
              <div style={{fontSize:'15px',fontWeight:600}}>No contacts found</div>
            </div>
          ):(
            <div>
              {regular.map((c,i)=>{return(
                <div key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div onClick={function(){onSelectContact(c);}} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px',cursor:'pointer'}}>
                    <Avatar contact={c} size={44}/>
                    <div style={{flex:1,minWidth:0,paddingTop:'1px'}}>
                      <div style={{fontSize:'14px',fontWeight:700,color:'white',marginBottom:'2px',display:'flex',alignItems:'center',gap:'6px'}}>
                        <span onClick={function(e){e.stopPropagation();onSelectContact(c);}} style={{cursor:'pointer',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</span>
                        {c.isSeed&&<span style={{fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'4px',background:'rgba(139,92,246,0.2)',color:'rgba(139,92,246,0.8)',border:'1px solid rgba(139,92,246,0.3)',flexShrink:0}}>SAMPLE</span>}
                      </div>
                      <div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}{c.title&&c.company?' · ':''}{c.company}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
                        <PrivacyBadge privacy={c.privacy||getDefaultPrivacy(c.cardType)} small={true}/>
                        {(c.tags||[]).map((tag)=>{return(<span key={tag} style={{fontSize:'10px',background:'rgba(109,72,255,0.25)',color:'#a78bfa',borderRadius:'5px',padding:'2px 7px',fontWeight:500}}>{tag}</span>);})}
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px',flexShrink:0}}>
                      <button onClick={function(e){toggleStar(e,c.id);}} style={{background:'none',border:'none',cursor:'pointer',padding:'0',fontSize:'18px',color:starredIds.has(c.id)?'#f59e0b':'rgba(255,255,255,0.2)',lineHeight:1}}><Heart size={18} fill={starredIds.has(c.id)?'#f59e0b':'none'}/></button>
                      {c.date&&<span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap'}}>{c.date}</span>}
                    </div>
                  </div>
                  <StackVisibilityToggle c={c} stackPublic={stackPublic} onToggleHidden={onToggleHidden}/>
                </div>
              );})}
            </div>
          )}
        </div>
      )}
      {stackView==='leads'&&isPro&&(
        <div>
          <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'12px',padding:'0 6px 2px'}}>
            {['All'].concat(LEAD_STATUSES).map((s)=>{let col=s==='All'?null:LEAD_STATUS_COLORS[s];return(<button key={s} onClick={function(){setLeadStatusFilter(s);}} style={{flexShrink:0,padding:'6px 14px',borderRadius:'20px',border:'1px solid '+(leadStatusFilter===s&&col?col:'rgba(255,255,255,0.1)'),background:leadStatusFilter===s?col?col+'22':'rgba(255,255,255,0.1)':'transparent',color:leadStatusFilter===s&&col?col:'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{s}{s!=='All'?' ('+leads.filter((l)=>{return l.leadStatus===s;}).length+')':''}</button>);})}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginBottom:'14px',padding:'0 6px'}}>
            {LEAD_STATUSES.slice(0,3).map((s)=>{let col=LEAD_STATUS_COLORS[s];let count=leads.filter((l)=>{return l.leadStatus===s;}).length;return(<div key={s} style={{background:col+'11',border:'1px solid '+col+'33',borderRadius:'10px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'20px',fontWeight:900,color:col}}>{count}</div><div style={{fontSize:'9px',color:col+'99',fontWeight:700,marginTop:'1px'}}>{s}</div></div>);})}
          </div>
          {filteredLeads.length===0?(
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:'14px',fontWeight:800,letterSpacing:'0.08em',marginBottom:'12px'}}>NO LEADS</div>
              <div style={{fontSize:'15px',fontWeight:600}}>No leads yet</div>
              <button onClick={onAddLead} style={{marginTop:'8px',background:'linear-gradient(to right,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'10px',padding:'10px 20px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>+ Add First Lead</button>
            </div>
          ):(
            <div>
              {filteredLeads.map((lead)=>{
                let col=LEAD_STATUS_COLORS[lead.leadStatus]||'#10b981';
                return(
                  <div key={lead.id} onClick={function(){onSelectContact(lead);}} style={{cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px'}}>
                      <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,'+col+',#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',fontWeight:700,color:'white',flexShrink:0}}>{(lead.name||'?').charAt(0)}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'2px',flexWrap:'wrap'}}><span style={{fontSize:'14px',fontWeight:700,color:'white'}}>{lead.name}</span><LeadBadge status={lead.leadStatus} small={true}/></div>
                        {lead.leadInterest&&<div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.leadInterest}</div>}
                        {lead.leadBudget&&<div style={{fontSize:'11px',color:col,fontWeight:700}}>{lead.leadBudget}</div>}
                      </div>
                      <button onClick={function(e){e.stopPropagation();onEditLead(lead);}} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.5)',borderRadius:'6px',padding:'3px 8px',cursor:'pointer',fontSize:'11px',fontWeight:600,flexShrink:0}}>Edit</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ TeamVue PIN Gate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TeamVuePinGate({onSuccess,onCancel}){
  let [pin,setPin]=React.useState('');
  let [shake,setShake]=React.useState(false);
  let [attempts,setAttempts]=React.useState(0);
  let CORRECT='1234';
  function digit(d){if(pin.length>=4)return;let next=pin+d;setPin(next);if(next.length===4){setTimeout(function(){if(next===CORRECT){onSuccess();}else{setShake(true);setAttempts(function(a){return a+1;});setTimeout(function(){setPin('');setShake(false);},600);}},120);}}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.97)',backdropFilter:'blur(20px)',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <style>{'@keyframes tvShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}'}</style>
      <div style={{marginBottom:'32px',textAlign:'center'}}>
        <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:'15px',fontWeight:900,color:'white'}}>TV</div>
        <div style={{fontSize:'19px',fontWeight:800,color:'white',marginBottom:'4px'}}>TeamVue</div>
        <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>INTERNAL ACCESS ONLY</div>
      </div>
      <div style={{display:'flex',gap:'16px',marginBottom:'32px',animation:shake?'tvShake 0.4s ease':'none'}}>
        {[0,1,2,3].map((i)=>{return(<div key={i} style={{width:'14px',height:'14px',borderRadius:'50%',background:pin.length>i?'#8b5cf6':'transparent',border:'2px solid '+(pin.length>i?'#8b5cf6':'rgba(255,255,255,0.2)'),transition:'all 0.15s'}}/>);})}
      </div>
      {attempts>0&&<div style={{marginBottom:'16px',fontSize:'11px',color:'#ef4444',background:'rgba(239,68,68,0.1)',padding:'6px 14px',borderRadius:'20px',border:'1px solid rgba(239,68,68,0.3)'}}>{'Incorrect PIN ('+attempts+' attempt'+(attempts>1?'s':'')+')'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
        {[1,2,3,4,5,6,7,8,9,'',0,'?'].map((d,i)=>{return(<button key={i} onClick={function(){if(d==='')return;if(d==='?')setPin(function(p){return p.slice(0,-1);});else digit(String(d));}} disabled={d===''} style={{width:'68px',height:'68px',borderRadius:'50%',background:d===''?'transparent':'rgba(255,255,255,0.06)',border:d===''?'none':'1px solid rgba(255,255,255,0.08)',color:'white',fontSize:'22px',fontWeight:600,cursor:d===''?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{d}</button>);})}
      </div>
      <button onClick={onCancel} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',fontSize:'13px',cursor:'pointer',padding:'8px 16px'}}>Cancel</button>
    </div>
  );
}

// â”€â”€â”€ TeamVue Dashboard (simplified) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TeamVueDashboard({onClose,showSeedData,onToggleSeedData}){
  let [tab,setTab]=React.useState('overview');
  let navItems=['overview','users','moderation','support','features','audit'];
  let mockUsers=showSeedData?[{id:1,name:'Sarah Johnson',email:'sarah@techcorp.com',status:'active',exchanges:47},{id:2,name:'Michael Williams',email:'michael@innovatelabs.com',status:'active',exchanges:89},{id:3,name:'Jessica Brown',email:'jessica@digitalsolutions.com',status:'active',exchanges:12},{id:4,name:'David Jones',email:'david@cloudsync.com',status:'suspended',exchanges:5}]:[];
  let overviewStats=showSeedData?[{l:'Total Users',v:'1,284',col:'#8b5cf6'},{l:'Exchanges Today',v:'347',col:'#3b82f6'},{l:'Pro Subscribers',v:'89',col:'#f59e0b'},{l:'AI Scans Today',v:'124',col:'#10b981'}]:[{l:'Total Users',v:'0',col:'#8b5cf6'},{l:'Exchanges Today',v:'0',col:'#3b82f6'},{l:'Pro Subscribers',v:'0',col:'#f59e0b'},{l:'AI Scans Today',v:'0',col:'#10b981'}];
  return(
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'#080c14',color:'white',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#8b5cf6,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:900,color:'white'}}>TV</div>
          <div><div style={{fontSize:'15px',fontWeight:800}}>TeamVue</div><div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>CARDHOLDR INTERNAL OPS</div></div>
        </div>
        <button onClick={onClose} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',fontSize:'12px',fontWeight:700,padding:'7px 14px',borderRadius:'8px',cursor:'pointer'}}>Exit</button>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:'140px',borderRight:'1px solid rgba(255,255,255,0.07)',padding:'12px 8px',flexShrink:0}}>
          {navItems.map((item)=>{return(<button key={item} onClick={function(){setTab(item);}} style={{display:'block',width:'100%',padding:'9px 12px',borderRadius:'8px',border:'none',background:tab===item?'rgba(139,92,246,0.15)':'transparent',color:tab===item?'white':'rgba(255,255,255,0.5)',fontSize:'13px',fontWeight:tab===item?700:500,cursor:'pointer',marginBottom:'2px',textAlign:'left',textTransform:'capitalize'}}>{item}</button>);})}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'24px'}}>
          {tab==='overview'&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
                <h1 style={{fontSize:'22px',fontWeight:900,margin:0}}>Overview</h1>
                <button onClick={onToggleSeedData} style={{background:showSeedData?'rgba(139,92,246,0.15)':'rgba(255,255,255,0.06)',border:'1px solid '+(showSeedData?'rgba(139,92,246,0.4)':'rgba(255,255,255,0.12)'),color:showSeedData?'#a78bfa':'rgba(255,255,255,0.5)',borderRadius:'8px',padding:'6px 14px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>{showSeedData?'Sample Data: ON':'Sample Data: OFF'}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'20px'}}>
                {overviewStats.map((s)=>{return(<div key={s.l} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'16px'}}><div style={{fontSize:'26px',fontWeight:900,color:s.col,marginBottom:'4px'}}>{s.v}</div><div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{s.l}</div></div>);})}
              </div>
            </div>
          )}
          {tab==='users'&&(
            <div>
              <h1 style={{fontSize:'22px',fontWeight:900,margin:'0 0 20px'}}>Users</h1>
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',overflow:'hidden'}}>
                {mockUsers.length?mockUsers.map((u,i)=>{return(<div key={u.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:i<mockUsers.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}><div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:800,color:'white',flexShrink:0}}>{u.name[0]}</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:600}}>{u.name}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{u.email}</div></div><span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:u.status==='active'?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)',color:u.status==='active'?'#10b981':'#ef4444'}}>{u.status}</span></div>);})
                :<div style={{padding:'28px 16px',textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>Sample data is off. No real users are connected in this demo.</div>}
              </div>
            </div>
          )}
          {tab!=='overview'&&tab!=='users'&&<div style={{color:'rgba(255,255,255,0.4)',fontSize:'14px',paddingTop:'40px',textAlign:'center'}}>Coming soon</div>}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ PublicProfilePage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PublicProfilePage({card,onGetApp,publicContacts,isLoggedIn}){
  let c1=(card.color&&card.color[0])||'#8b5cf6';
  let c2=(card.color&&card.color[1])||'#6366f1';
  let vcard='BEGIN:VCARD\nVERSION:3.0\nFN:'+(card.name||'')+'\nORG:'+(card.company||'')+'\nTITLE:'+(card.title||'')+'\nEMAIL:'+(card.email||'')+'\nTEL:'+(card.phone||'')+'\nEND:VCARD';
  let vh='data:text/vcard;charset=utf-8,'+encodeURIComponent(vcard);
  let [stackTab,setStackTab]=React.useState(function(){return publicContacts&&publicContacts.length?'contacts':'card';});
  let [publicContactsView,setPublicContactsView]=React.useState('carousel');
  let [publicContactIndex,setPublicContactIndex]=React.useState(0);
  let publicSwipeRef=React.useRef(null);
  let publicSafeIdx=Math.min(publicContactIndex,Math.max(0,(publicContacts||[]).length-1));
  let publicContact=publicContacts&&publicContacts[publicSafeIdx];
  function getPublicVisible(){if(!publicContacts||!publicContacts.length)return[];return[-2,-1,0,1,2].map((i)=>{return{card:publicContacts[(publicSafeIdx+i+publicContacts.length)%publicContacts.length],offset:i};});}
  function setPublicContactIndexWithClick(updater,count){if(navigator.vibrate&&count)navigator.vibrate(Array(Math.min(3,count)).fill(8));setPublicContactIndex(updater);}
  function startPublicSwipe(e){if(!publicContacts||publicContacts.length<2)return;let target=e.target;if(target&&target.closest&&target.closest('[data-center-card="true"]'))return;let p=e.touches&&e.touches[0]?e.touches[0]:e;publicSwipeRef.current={x:p.clientX,y:p.clientY,t:performance.now(),active:true};}
  function movePublicSwipe(e){let s=publicSwipeRef.current;if(!s||!s.active)return;let p=e.touches&&e.touches[0]?e.touches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.3&&e.cancelable)e.preventDefault();}
  function endPublicSwipe(e){let s=publicSwipeRef.current;if(!s||!s.active)return;let p=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:e;let dx=p.clientX-s.x;let dy=p.clientY-s.y;publicSwipeRef.current=null;if(Math.abs(dx)<64||Math.abs(dx)<Math.abs(dy)*1.35)return;let elapsed=Math.max(1,performance.now()-(s.t||performance.now()));let speed=Math.abs(dx)/elapsed;let distanceSteps=Math.floor(Math.abs(dx)/150);let velocitySteps=Math.floor(speed/0.55);let steps=Math.max(1,distanceSteps,velocitySteps);steps=Math.min(steps,publicContacts.length-1);setPublicContactIndexWithClick(function(i){let dir=dx<0?1:-1;return(i+(dir*steps)+publicContacts.length*steps)%publicContacts.length;},steps);}
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0d0b1e,#1a1440)',color:'white',overflowY:'auto'}}>
      <div style={{padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(13,11,30,0.8)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10}}>
        {isLoggedIn?<button onClick={onGetApp} style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',color:'white',borderRadius:'10px',padding:'8px 11px',cursor:'pointer',fontSize:'13px',fontWeight:700}}><ChevronLeft size={16}/> Back</button>:<span style={{fontWeight:900,fontSize:'16px',background:'linear-gradient(to right,#a78bfa,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>CardHoldr</span>}
        {!isLoggedIn&&<button onClick={onGetApp} style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)',border:'none',color:'white',borderRadius:'10px',padding:'8px 16px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Get the App</button>}
      </div>
      <div style={{maxWidth:'480px',margin:'0 auto',padding:'32px 20px 48px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'24px'}}>
          <div style={{width:'88px',height:'88px',borderRadius:'50%',background:'linear-gradient(135deg,'+c1+','+c2+')',border:'3px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'14px',fontSize:'36px',fontWeight:900,color:'white'}}>{(card.name||'?').charAt(0)}</div>
          <h1 style={{fontSize:'26px',fontWeight:900,margin:'0 0 4px',textAlign:'center'}}>{card.name}</h1>
          {card.title&&<p style={{fontSize:'14px',color:'rgba(255,255,255,0.55)',margin:'0 0 2px',textAlign:'center'}}>{card.title}</p>}
          {card.company&&<p style={{fontSize:'14px',fontWeight:700,background:'linear-gradient(to right,'+c1+','+c2+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'2px 0 0',textAlign:'center'}}>{card.company}</p>}
        </div>

        <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:'12px',padding:'3px',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'20px'}}>
          {[['card','Card'],['contacts','Contacts'+(publicContacts&&publicContacts.length?' ('+publicContacts.length+')':'')]].map((pair)=>{let isActive=stackTab===pair[0];return(<button key={pair[0]} onClick={function(){setStackTab(pair[0]);}} style={{flex:1,padding:'9px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,background:isActive?'linear-gradient(135deg,'+c1+','+c2+')':'transparent',color:isActive?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}
        </div>

        {stackTab==='card'&&(
          <>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}><div style={{width:'100%',maxWidth:'300px',height:'172px'}}><Card3D card={card} isCenter={true} style={{width:'100%',height:'100%'}} autoFlip={true}/></div></div>
            <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',marginBottom:'24px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
            <a href={vh} download={(card.name||'contact').replace(/\s+/g,'-')+'.vcf'} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',width:'100%',padding:'15px',borderRadius:'14px',background:'linear-gradient(135deg,'+c1+','+c2+')',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:800,marginBottom:'12px',boxSizing:'border-box'}}><Download size={18}/> Save to Contacts</a>
            {[card.phone&&['Phone',card.phone,'tel:'+card.phone],card.email&&['Email',card.email,'mailto:'+card.email],card.website&&['Website',card.website,safeUrl(card.website)]].filter(Boolean).length>0&&(
              <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'16px'}}>
                {[card.phone&&['Phone',card.phone,'tel:'+card.phone],card.email&&['Email',card.email,'mailto:'+card.email],card.website&&['Website',card.website,safeUrl(card.website)]].filter(Boolean).map((row,i,arr)=>{return(<a key={row[0]} href={row[2]} target={row[0]==='Website'?'_blank':undefined} rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 18px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none',textDecoration:'none'}}><div style={{flex:1}}><div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',fontWeight:600,marginBottom:'1px'}}>{row[0]}</div><div style={{fontSize:'14px',color:'white'}}>{row[1]}</div></div><ChevronRight size={14} color="rgba(255,255,255,0.3)"/></a>);})}
              </div>
            )}
          </>
        )}

        {stackTab==='contacts'&&(
          <>
            {!publicContacts||publicContacts.length===0?(
              <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
                <div style={{fontSize:'36px',marginBottom:'12px'}}>Private</div>
                <div style={{fontSize:'15px',fontWeight:600,marginBottom:'6px'}}>Network is private</div>
                <div style={{fontSize:'13px',lineHeight:1.5}}>{card.name} hasn't made their network public yet.</div>
              </div>
            ):(
              <div>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'14px'}}><div style={{display:'inline-flex',background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'2px',border:'1px solid rgba(255,255,255,0.1)'}}>{[['carousel','Carousel'],['stack','Stack']].map((pair)=>{let active=publicContactsView===pair[0];return(<button key={pair[0]} onClick={function(){setPublicContactsView(pair[0]);}} style={{padding:'7px 18px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:active?800:600,background:active?'linear-gradient(135deg,'+c1+','+c2+')':'transparent',color:active?'white':'rgba(255,255,255,0.45)'}}>{pair[1]}</button>);})}</div></div>
                {publicContactsView==='carousel'?(
                  <>
                    <div data-carousel-swipe="true" onMouseDown={startPublicSwipe} onMouseMove={movePublicSwipe} onMouseUp={endPublicSwipe} onMouseLeave={function(){publicSwipeRef.current=null;}} onTouchStart={startPublicSwipe} onTouchMove={movePublicSwipe} onTouchEnd={endPublicSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                      <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                        {getPublicVisible().map((item)=>{let pcard=Object.assign({email:'',phone:'',cardType:'professional'},item.card);let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);return(
                          <Card3D key={'public-contact-'+pcard.id+'-'+offset} card={pcard} isCenter={isCenter} autoFlip={false}
                            onClick={!isCenter?function(e){e.stopPropagation();setPublicContactIndexWithClick(function(i){return(i+offset+publicContacts.length)%publicContacts.length;},Math.abs(offset));}:undefined}
                            style={{position:'absolute',width:'88%',maxWidth:'310px',height:'177px',transform:'translateX('+(offset*72)+'%) scale('+(isCenter?1:0.74)+')',transformOrigin:'center center',zIndex:isCenter?30:20-absOff,opacity:isCenter?1:Math.max(0.15,0.45-absOff*0.15),transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1),opacity 0.45s',cursor:'pointer',touchAction:isCenter?'none':'pan-y'}}
                            data-carousel-card="true" data-center-card={isCenter?'true':undefined}/>
                        );})}
                      </div>
                    </div>
                    <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',margin:'0 0 10px',fontWeight:600}}>&lt;-- Swipe side cards to scroll --&gt;</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                      <button onClick={function(){setPublicContactIndexWithClick(function(i){return(i-1+publicContacts.length)%publicContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}><ChevronLeft size={15}/> Prev</button>
                      <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:700}}>{(publicSafeIdx+1)+' / '+publicContacts.length}</div>
                      <button onClick={function(){setPublicContactIndexWithClick(function(i){return(i+1)%publicContacts.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:600}}>Next <ChevronRight size={15}/></button>
                    </div>
                  </>
                ):(
                  <>
                    {publicContacts.map((contact,i)=>{return(
                      <div key={contact.id||i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderRadius:'12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'8px'}}>
                        <Avatar contact={contact} size={42}/>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:'14px',fontWeight:700,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.name}</div><div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.title}{contact.title&&contact.company?' · ':''}{contact.company}</div></div>
                        <a href={'https://cardholdr.co/'+(contact.name||'user').toLowerCase().replace(/[^a-z0-9]+/g,'-')} target="_blank" rel="noopener noreferrer" style={{background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:'8px',padding:'5px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700,textDecoration:'none',flexShrink:0}}>View</a>
                      </div>
                    );})}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!isLoggedIn&&<div style={{background:'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.08))',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'16px',padding:'20px',textAlign:'center',marginTop:'8px'}}>
          <div style={{fontSize:'13px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'8px'}}>CARDHOLDR</div>
          <div style={{fontSize:'15px',fontWeight:800,color:'white',marginBottom:'6px'}}>Connect on CardHoldr</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'14px',lineHeight:1.5}}>Exchange cards, message, and stay connected.</div>
          <button onClick={onGetApp} style={{width:'100%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',border:'none',color:'white',borderRadius:'12px',padding:'13px',cursor:'pointer',fontWeight:700,fontSize:'14px'}}>Get CardHoldr Free</button>
        </div>}
      </div>
    </div>
  );
}

// â”€â”€â”€ WaitlistPage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function WaitlistPage({onEnterApp,onLogoTap}){
  let [email,setEmail]=React.useState('');
  let [submitted,setSubmitted]=React.useState(false);
  let demoCard={name:'Alex Rivera',title:'Product Designer',company:'Studio Nine',email:'alex@studionine.co',phone:'(415) 555-0192',color:CARD_COLORS[2],portfolio:'studionine.co',github:'alexrivera'};
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0d0b1e,#1a1440,#0f0c29)',color:'white',overflowY:'auto'}}>
      <style>{'@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'}</style>
      <div style={{padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10,background:'rgba(13,11,30,0.8)'}}>
        <span onClick={onLogoTap} style={{fontWeight:900,fontSize:'17px',cursor:'default',userSelect:'none',WebkitUserSelect:'none'}}>CardHoldr</span>
        <button onClick={onEnterApp} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'white',borderRadius:'10px',padding:'8px 16px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Try the app</button>
      </div>
      <div style={{padding:'60px 24px 48px',maxWidth:'560px',margin:'0 auto',textAlign:'center'}}>
        <h1 style={{fontSize:'42px',fontWeight:900,lineHeight:1.1,margin:'0 0 18px',letterSpacing:'-1.5px'}}>The business card<br/><span style={{background:'linear-gradient(to right,#a78bfa,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>built for how you work</span></h1>
        <p style={{fontSize:'17px',color:'rgba(255,255,255,0.6)',lineHeight:1.65,margin:'0 0 36px'}}>Share your contact in one tap. Scan cards. Keep your network organized.</p>
        {!submitted?(
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'24px',maxWidth:'400px',margin:'0 auto'}}>
            <input value={email} onChange={function(e){setEmail(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'&&email.includes('@'))setSubmitted(true);}} placeholder="your@email.com" type="email" style={{width:'100%',padding:'13px 16px',borderRadius:'11px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:'15px',outline:'none',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'10px'}}/>
            <button onClick={function(){if(email.includes('@'))setSubmitted(true);}} style={{width:'100%',background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'14px',borderRadius:'12px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'15px'}}>Join the waitlist</button>
          </div>
        ):(
          <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'18px',padding:'28px 24px',maxWidth:'400px',margin:'0 auto'}}>
            <div style={{fontSize:'36px',marginBottom:'12px'}}>Done</div>
            <div style={{fontWeight:800,fontSize:'18px',marginBottom:'16px'}}>You're on the list!</div>
            <button onClick={onEnterApp} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'11px',padding:'11px 22px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Try the demo</button>
          </div>
        )}
      </div>
      <div style={{display:'flex',justifyContent:'center',padding:'0 24px 8px',animation:'float 4s ease-in-out infinite'}}>
        <div style={{width:'min(88%,300px)',height:'172px'}}><Card3D card={demoCard} isCenter={true} style={{width:'100%',height:'100%'}} autoFlip={true}/></div>
      </div>
      <p style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',textAlign:'center',marginBottom:'40px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
    </div>
  );
}

// â”€â”€â”€ Main App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// === MAIN CORE COMPONENTS ===
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
              {card.title&&<div style={{fontSize:'9.5px',fontWeight:600,color:c1,margin:'0 0 1px'}}>{card.title}</div>}
              {card.company&&<div style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,0.4)'}}>{card.company}</div>}
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
    if(cs==='dark'){
      return(
        <div style={{position:'absolute',inset:0,borderRadius:'14px',overflow:'hidden',background:'linear-gradient(145deg,#12102a,#1a1640)'}}>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'3px',background:'linear-gradient(to right,'+c1+','+c2+')'}}/>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at '+shimX+'% '+shimY+'%,rgba('+rgb+',0.18),transparent 60%)',opacity:shimOpacity}}/>
          <div style={{padding:'11px 13px',height:'100%',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',zIndex:1}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'7px',background:'linear-gradient(135deg,'+c1+','+c2+')',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'13px'}}>{(card.company||'?').charAt(0)}</div>
                {card.cardType==='professional'&&<div style={{fontSize:'7px',fontWeight:700,letterSpacing:'0.06em',padding:'2px 7px',borderRadius:'20px',background:'linear-gradient(135deg,'+c1+','+c2+')',color:'white',textTransform:'uppercase'}}>Pro</div>}
              </div>
              <div onClick={nt} style={{fontSize:'15px',fontWeight:700,color:'white',margin:'0 0 1px',lineHeight:1.2,cursor:nt?'pointer':'default'}}>{card.name}</div>
              <div style={{fontSize:'9.5px',fontWeight:600,color:c1,marginBottom:'1px'}}>{card.title}</div>
              <div style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,0.5)'}}>{card.company}</div>
            </div>
            <div style={{borderTop:'1px solid rgba('+rgb+',0.2)',paddingTop:'6px'}}>
              {card.email&&<div style={{fontSize:'8.5px',color:'rgba(255,255,255,0.45)',marginBottom:'1px'}}>{card.email}</div>}
              {card.phone&&<div style={{fontSize:'8.5px',color:'rgba(255,255,255,0.45)'}}>{card.phone}</div>}
              <SocialLinks card={card} dark={true}/>
              <ProBadges card={card} dark={true}/>
            </div>
          </div>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(to right,transparent,'+c1+','+c2+',transparent)',opacity:0.7}}/>
        </div>
      );
    }
    return(
      <div style={{position:'absolute',inset:0,borderRadius:'14px',overflow:'hidden',background:'linear-gradient(135deg,#fff,#f8f4ff,#eef2ff)',border:'2px solid rgba('+rgb+',0.35)'}}>
        <div style={{position:'absolute',inset:0,pointerEvents:'none',mixBlendMode:'overlay',background:'radial-gradient(circle at '+shimX+'% '+shimY+'%,rgba(255,255,255,0.8),rgba(139,92,246,0.3) 25%,transparent 70%)',opacity:shimOpacity}}/>
        <div style={{padding:'11px 13px',height:'100%',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'7px',background:'linear-gradient(135deg,'+c1+','+c2+')',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'13px'}}>{(card.company||'?').charAt(0)}</div>
              {card.cardType==='professional'&&<div style={{fontSize:'7px',fontWeight:700,letterSpacing:'0.06em',padding:'2px 7px',borderRadius:'20px',background:c1+'22',color:c1,border:'1px solid '+c1+'44',textTransform:'uppercase'}}>Pro</div>}
            </div>
            <div onClick={nt} style={{fontSize:'15px',fontWeight:700,color:'#1a1a2e',margin:'0 0 1px',lineHeight:1.2,cursor:nt?'pointer':'default'}}>{card.name}</div>
            <div style={{fontSize:'9.5px',fontWeight:600,color:c1,marginBottom:'1px'}}>{card.title}</div>
            <div style={{fontSize:'10px',fontWeight:650,background:'linear-gradient(to right,'+c1+','+c2+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{card.company}</div>
          </div>
          <div style={{borderTop:'1px solid '+c1+'22',paddingTop:'6px'}}>
            {card.email&&<div style={{fontSize:'8.5px',color:'#555',marginBottom:'1px'}}>{card.email}</div>}
            {card.phone&&<div style={{fontSize:'8.5px',color:'#555'}}>{card.phone}</div>}
            <SocialLinks card={card} dark={false}/>
            <ProBadges card={card} dark={false}/>
          </div>
        </div>
      </div>
    );
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
export default function CardHoldr(){

  // â”€â”€â”€ 1. ALL useState â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let [showTvPin,setShowTvPin]=React.useState(false);
  let [showTeamVue,setShowTeamVue]=React.useState(false);
  let [screen,setScreen]=React.useState(function(){let s=lsGet('myCard',null);return(s&&s.name)?'home':'waitlist';});
  let [publicProfileCard,setPublicProfileCard]=React.useState(null);
  let [profileType,setProfileType]=React.useState('professional');
  let [myPhoto]=React.useState(function(){return lsGet('myPhoto',null);});
  let [tab,setTab]=React.useState('home');
  let [cardTypeFilter,setCardTypeFilter]=React.useState('all');
  let [showAddContact,setShowAddContact]=React.useState(false);
  let [showAddLead,setShowAddLead]=React.useState(false);
  let [showReport,setShowReport]=React.useState(false);
  let [editingLead,setEditingLead]=React.useState(null);
  let [showSeedData,setShowSeedData]=React.useState(function(){return lsGet('showSeedData',true);});
  let [showTeamVueSampleData,setShowTeamVueSampleData]=React.useState(function(){return lsGet('showTeamVueSampleData',true);});
  let [myCard,setMyCard]=React.useState(function(){
    let saved=lsGet('myCard',null);
    let defaults={name:'',title:'',company:'',email:'',phone:'',website:'',instagram:'',twitter:'',linkedin:'',color:CARD_COLORS[0],isAgent:false,cardStyle:'light',privacy:'public',stackPublic:true};
    if(!saved)return defaults;
    saved.stackPublic=saved.stackPublic===false?false:true;
    return Object.assign({},defaults,saved);
  });
  let [showProfile,setShowProfile]=React.useState(false);
  let [showProfileMenu,setShowProfileMenu]=React.useState(false);
  let [showLogoutConfirm,setShowLogoutConfirm]=React.useState(false);
  let [showAnalytics,setShowAnalytics]=React.useState(false);
  let [showNotifs,setShowNotifs]=React.useState(false);
  let [shareCard,setShareCard]=React.useState(null);
  let [showExchange,setShowExchange]=React.useState(false);
  let [exchangeStep,setExchangeStep]=React.useState('idle');
  let [holdProgress,setHoldProgress]=React.useState(0);
  let [exchangedCard,setExchangedCard]=React.useState(null);
  let [holdActive,setHoldActive]=React.useState(false);
  let [exchangePrivate,setExchangePrivate]=React.useState(false);
  let [contacts,setContacts]=React.useState(function(){
    let saved=lsGet('contacts',null);
    let defaults=CONTACTS.concat(SAMPLE_LEADS);
    if(!saved)return defaults;
    let seedIds=new Set(defaults.map((c)=>{return c.id;}));
    return saved.map((c)=>{if(seedIds.has(c.id))return Object.assign({},c,{isSeed:true});return c;});
  });
  let [notifs,setNotifs]=React.useState(NOTIFS);
  let [posts,setPosts]=React.useState(function(){return lsGet('posts',[{id:1,contactId:1,text:"Just closed our Series B!",time:'2h ago',likes:24,liked:false,comments:[]},{id:2,contactId:3,text:'New post on Product-Led Growth!',time:'4h ago',likes:11,liked:false,comments:[]}]);});
  let [teamPosts,setTeamPosts]=React.useState(TEAM_POSTS);
  let [postDraft,setPostDraft]=React.useState('');
  let [searchQuery,setSearchQuery]=React.useState('');
  let [carouselMode,setCarouselMode]=React.useState('contacts');
  let [cardIndex,setCardIndex]=React.useState(0);
  let [activeCard,setActiveCard]=React.useState(null);
  let [scanMode,setScanMode]=React.useState(null);
  let [capturedPhoto,setCapturedPhoto]=React.useState(null);
  let [cameraError,setCameraError]=React.useState(null);
  let [activeThread,setActiveThread]=React.useState(null);
  let [threads,setThreads]=React.useState(function(){return lsGet('threads',THREADS);});
  let [draft,setDraft]=React.useState('');
  let [msgSearch,setMsgSearch]=React.useState('');
  let [showNewMsg,setShowNewMsg]=React.useState(false);
  let [newMsgSearch,setNewMsgSearch]=React.useState('');
  let [reactionTarget,setReactionTarget]=React.useState(null);
  let [reactions,setReactions]=React.useState({});
  let [isTyping,setIsTyping]=React.useState(false);
  let [tvTaps,setTvTaps]=React.useState(0);

  // â”€â”€â”€ 2. ALL useRef â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let tvTimerRef=React.useRef(null);
  let videoRef=React.useRef(null);
  let canvasRef=React.useRef(null);
  let streamRef=React.useRef(null);
  let fileInputRef=React.useRef(null);
  let carouselAutoFlipped=React.useRef(false);
  let [homeAutoFlipCardId,setHomeAutoFlipCardId]=React.useState(null);
  let carouselSwipeRef=React.useRef(null);
  let animRef=React.useRef(null);
  let holdStartRef=React.useRef(null);
  let syncTimeout=React.useRef(null);
  let HOLD_DURATION=2000;

  // â”€â”€â”€ 3. ALL useEffect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  React.useEffect(function(){
    let m=document.querySelector('meta[name="theme-color"]');
    if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}
    m.content='#0d0b1e';
  },[]);

  React.useEffect(function(){
    let hash=window.location.hash;
    if(hash&&hash.includes('access_token')){
      let params=new URLSearchParams(hash.replace('#',''));
      let token=params.get('access_token');
      if(token){
        lsSet('sb_access_token',token);
        fetch(SUPABASE_URL+'/auth/v1/user',{headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+token}}).then(function(r){return r.json();}).then(function(user){
          if(user&&user.id){
            lsSet('sb_user',user);
            loadCard(user.id).then(function(row){
              if(row&&row.card_data&&row.card_data.name){setMyCard(row.card_data);lsSet('myCard',row.card_data);setScreen('home');}
              else{let meta=user.user_metadata||{};setMyCard(function(c){return Object.assign({},c,{name:meta.full_name||meta.name||'',email:user.email||''});});setScreen('profile');}
            });
          }
        });
        window.history.replaceState(null,'',window.location.pathname);
      }
    } else {
      let savedUser=lsGet('sb_user',null);let savedToken=lsGet('sb_access_token',null);
      if(savedUser&&savedToken){loadCard(savedUser.id).then(function(row){if(row&&row.card_data&&row.card_data.name){setMyCard(row.card_data);lsSet('myCard',row.card_data);}});}
    }
  },[]);

  React.useEffect(function(){lsSet('myCard',myCard);},[myCard]);
  React.useEffect(function(){
    if(!myCard.name)return;
    let user=lsGet('sb_user',null);if(!user)return;
    if(syncTimeout.current)clearTimeout(syncTimeout.current);
    syncTimeout.current=setTimeout(function(){
      let slug=(myCard.name||'user').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+user.id.slice(0,6);
      let publicStack=contacts.filter((c)=>{return c.cardType!=='lead'&&!c.stackHidden&&(c.privacy||getDefaultPrivacy(c.cardType))==='public';}).map((c)=>{return{id:c.id,name:c.name,title:c.title,company:c.company,email:c.email,phone:c.phone,website:c.website,instagram:c.instagram,twitter:c.twitter,linkedin:c.linkedin,github:c.github,portfolio:c.portfolio,resume:c.resume,hiring:c.hiring,color:c.color,cardType:c.cardType||'professional',cardStyle:c.cardStyle,privacy:c.privacy||getDefaultPrivacy(c.cardType),stackHidden:false};});
      let cardToSave=Object.assign({},myCard,{publicStack:myCard.stackPublic?publicStack:[]});
      upsertCard(user.id,slug,cardToSave,myCard.privacy==='public');
      upsertProfile(user.id,{full_name:myCard.name,username:slug,updated_at:new Date().toISOString()});
    },2000);
  },[myCard,contacts]);
  React.useEffect(function(){lsSet('contacts',contacts);},[contacts]);
  React.useEffect(function(){lsSet('posts',posts);},[posts]);
  React.useEffect(function(){lsSet('threads',threads);},[threads]);
  React.useEffect(function(){
    if(tab!=='home'){carouselAutoFlipped.current=false;setHomeAutoFlipCardId(null);}
  },[tab]);
  React.useEffect(function(){
    carouselAutoFlipped.current=false;
    setHomeAutoFlipCardId(null);
  },[carouselMode]);
  React.useEffect(function(){
    if(myCard.isAgent!==true&&carouselMode==='leads')setCarouselMode('contacts');
  },[myCard.isAgent,carouselMode]);
  React.useEffect(function(){
    let path=window.location.pathname||'';
    if(!path.startsWith('/app/contact/'))return;
    let slug=decodeURIComponent(path.split('/app/contact/')[1]||'');
    if(!slug)return;
    let found=contacts.find((c)=>{let cs=(c.name||'contact').toLowerCase().replace(/[^a-z0-9]+/g,'-');return cs===slug;});
    if(found){setActiveCard(found);setScreen('contact');}
  },[contacts]);

  // â”€â”€â”€ 4. Derived values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let visibleContacts=contacts.filter((c)=>{return showSeedData?true:!c.isSeed;});
  let canUseLeads=myCard.isAgent===true;
  let leads=visibleContacts.filter((c)=>{return c.cardType==='lead';});
  let regularContacts=visibleContacts.filter((c)=>{return c.cardType!=='lead';});
  let allContacts=visibleContacts;
  let carouselPool=React.useMemo(function(){
    let base=carouselMode==='leads'&&canUseLeads?leads:regularContacts.filter((c)=>{if(cardTypeFilter==='pro')return c.cardType==='professional';if(cardTypeFilter==='personal')return c.cardType!=='professional';return true;});
    if(!searchQuery)return base;
    let q=searchQuery.toLowerCase();
    return base.filter((c)=>{return(c.name||'').toLowerCase().includes(q)||(c.company||'').toLowerCase().includes(q)||(c.title||'').toLowerCase().includes(q)||(c.leadInterest||'').toLowerCase().includes(q);});
  },[contacts,carouselMode,cardTypeFilter,searchQuery,showSeedData,canUseLeads]);
  let safeIdx=Math.min(cardIndex,Math.max(0,carouselPool.length-1));
  let carouselCard=carouselPool[safeIdx];
  let unreadNotifs=notifs.filter((n)=>{return !n.read;}).length;
  let totalUnread=contacts.filter((c)=>{return c.cardType!=='lead';}).reduce((a,c)=>{return a+((threads[c.id]&&threads[c.id].slice(-1)[0]&&threads[c.id].slice(-1)[0].from==='them')?1:0);},0);
  let analyticsData={views:0,exchanges:0,contacts:contacts.filter((c)=>{return !c.isSeed&&c.cardType!=='lead';}).length,chart:[0,0,0,0,0,0,0]};
  React.useEffect(function(){
    if(tab!=='home'||!carouselCard||carouselAutoFlipped.current)return;
    carouselAutoFlipped.current=true;
    setHomeAutoFlipCardId(carouselCard.id);
  },[tab,carouselCard&&carouselCard.id,carouselMode]);

  // â”€â”€â”€ 5. Helper functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function handleLogoTap(){let next=tvTaps+1;setTvTaps(next);if(tvTimerRef.current)clearTimeout(tvTimerRef.current);if(next>=5){setTvTaps(0);setShowTvPin(true);}else{tvTimerRef.current=setTimeout(function(){setTvTaps(0);},1500);}}
  function handleGoogleLogin(){supaOAuthUrl('google').then(function(url){window.location.href=url;});}
  function handleFacebookLogin(){supaOAuthUrl('facebook').then(function(url){window.location.href=url;});}
  function toggleSeedData(){setShowSeedData(function(prev){let next=!prev;lsSet('showSeedData',next);return next;});setCardIndex(0);}
  function toggleTeamVueSampleData(){setShowTeamVueSampleData(function(prev){let next=!prev;lsSet('showTeamVueSampleData',next);return next;});}
  function getVisible(){if(!carouselPool.length)return[];return[-2,-1,0,1,2].map((i)=>{return{card:carouselPool[(safeIdx+i+carouselPool.length)%carouselPool.length],offset:i};});}
  function microClick(count){
    if(!navigator.vibrate)return;
    try{
      let clicks=Math.max(1,Math.min(count||1,8));
      let pattern=[];
      for(let i=0;i<clicks;i++){if(i)pattern.push(18);pattern.push(5);}
      navigator.vibrate(pattern);
    }catch(e){}
  }
  function setCarouselIndexWithClick(updater,count){
    microClick(count);
    setHomeAutoFlipCardId(null);
    setCardIndex(updater);
  }
  function startCarouselSwipe(e){
    if(carouselPool.length<2)return;
    let target=e.target;
    if(target&&target.closest&&target.closest('[data-center-card="true"]'))return;
    let p=e.touches&&e.touches[0]?e.touches[0]:e;
    carouselSwipeRef.current={x:p.clientX,y:p.clientY,t:performance.now(),active:true};
  }
  function moveCarouselSwipe(e){
    let s=carouselSwipeRef.current;
    if(!s||!s.active)return;
    let p=e.touches&&e.touches[0]?e.touches[0]:e;
    let dx=p.clientX-s.x;
    let dy=p.clientY-s.y;
    if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.3&&e.cancelable)e.preventDefault();
  }
  function endCarouselSwipe(e){
    let s=carouselSwipeRef.current;
    if(!s||!s.active)return;
    let p=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:e;
    let dx=p.clientX-s.x;
    let dy=p.clientY-s.y;
    carouselSwipeRef.current=null;
    if(Math.abs(dx)<64||Math.abs(dx)<Math.abs(dy)*1.35)return;
    let elapsed=Math.max(1,performance.now()-(s.t||performance.now()));
    let speed=Math.abs(dx)/elapsed;
    let distanceSteps=Math.floor(Math.abs(dx)/150);
    let velocitySteps=Math.floor(speed/0.55);
    let steps=Math.max(1,distanceSteps,velocitySteps);
    steps=Math.min(steps,carouselPool.length-1);
    setCarouselIndexWithClick(function(i){let dir=dx<0?1:-1;return(i+(dir*steps)+carouselPool.length*steps)%carouselPool.length;},steps);
  }
  function exportContact(card){let vc='BEGIN:VCARD\nVERSION:3.0\nFN:'+(card.name||'')+'\nORG:'+(card.company||'')+'\nTITLE:'+(card.title||'')+'\nEMAIL:'+(card.email||'')+'\nTEL:'+(card.phone||'')+'\nEND:VCARD';let blob=new Blob([vc],{type:'text/vcard'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download=(card.name||'contact').replace(/\s/g,'-')+'.vcf';a.click();URL.revokeObjectURL(url);}
  function sendMsg(){if(!draft.trim()||!activeThread)return;let msg={id:Date.now(),from:'me',text:draft.trim(),time:timeStr(),date:'Today'};setThreads(function(p){let n=Object.assign({},p);n[activeThread]=(n[activeThread]||[]).concat([msg]);return n;});setDraft('');setIsTyping(true);setTimeout(function(){setThreads(function(p){let n=Object.assign({},p);n[activeThread]=(n[activeThread]||[]).concat([{id:Date.now()+1,from:'them',text:rand(["That's great!","Absolutely!","Sounds perfect!"]),time:timeStr(),date:'Today'}]);return n;});setIsTyping(false);},1400+Math.random()*600);}
  function handleFileUpload(e){let file=e.target.files&&e.target.files[0];if(!file)return;let reader=new FileReader();reader.onload=function(ev){setCapturedPhoto(ev.target.result);setScanMode('review');};reader.readAsDataURL(file);e.target.value='';}
  function startCamera(){setCameraError(null);navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){streamRef.current=s;setTimeout(function(){if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play().catch(function(){});}},100);}).catch(function(){setCameraError('Camera access denied.');});}
  function stopStream(){if(streamRef.current){streamRef.current.getTracks().forEach((t)=>{t.stop();});streamRef.current=null;}}
  function capturePhoto(){let v=videoRef.current;let c=canvasRef.current;if(!v||!c)return;c.width=v.videoWidth||640;c.height=v.videoHeight||400;c.getContext('2d').drawImage(v,0,0);setCapturedPhoto(c.toDataURL('image/jpeg'));stopStream();setScanMode('review');}
  function startHold(){if(animRef.current)cancelAnimationFrame(animRef.current);setHoldActive(true);holdStartRef.current=Date.now();function tick(){let p=Math.min((Date.now()-holdStartRef.current)/HOLD_DURATION,1);setHoldProgress(p);if(p<1){animRef.current=requestAnimationFrame(tick);}else{animRef.current=null;setHoldActive(false);setHoldProgress(1);setExchangeStep('searching');setTimeout(function(){setExchangeStep('found');},2200);setTimeout(function(){setExchangeStep('success');},4000);}}animRef.current=requestAnimationFrame(tick);}
  function cancelHold(){if(animRef.current){cancelAnimationFrame(animRef.current);animRef.current=null;}setHoldActive(false);setHoldProgress(0);}
  function saveLead(lead){setContacts(function(p){let exists=p.find((c)=>{return c.id===lead.id;});return exists?p.map((c)=>{return c.id===lead.id?lead:c;}):[lead].concat(p);});setShowAddLead(false);setEditingLead(null);}
  function saveContactCard(card){setContacts(function(p){return[card].concat(p);});setShowAddContact(false);setCarouselMode('contacts');setCardIndex(0);}
  function doLogout(){supaSignOut();['myCard','myPhoto','contacts','posts','threads','isPro'].forEach((k)=>{lsDel(k);});setShowLogoutConfirm(false);setShowProfileMenu(false);setShowProfile(false);setScreen('waitlist');}
  function goHomeTab(){setActiveThread(null);setTab('home');}

  // â”€â”€â”€ Browser back button support â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Push a history entry whenever screen or tab changes
  React.useEffect(function(){
    if(screen==='home'){
      window.history.pushState({screen:'home',tab:tab},'','/app');
    } else if(screen==='contact'&&activeCard){
      let slug=(activeCard.name||'contact').toLowerCase().replace(/[^a-z0-9]+/g,'-');
      window.history.pushState({screen:'contact',cardId:activeCard.id},'','/app/contact/'+slug);
    } else if(screen==='reveal'){
      window.history.pushState({screen:'reveal'},'','/app/reveal');
    } else if(screen==='profile'){
      window.history.pushState({screen:'profile'},'','/app/profile');
    } else if(screen==='login'){
      window.history.pushState({screen:'login'},'','/login');
    } else if(screen==='waitlist'){
      window.history.pushState({screen:'waitlist'},'','/');
    }
  },[screen,tab]);

  // Listen for popstate (back/forward button)
  React.useEffect(function(){
    function onPop(e){
      let state=e.state;
      if(!state){setScreen('waitlist');return;}
      // Close overlays first
      if(state.overlay==='profile'){setShowProfile(true);return;}
      if(state.overlay==='analytics'){setShowAnalytics(true);return;}
      if(state.overlay==='notifs'){setShowNotifs(true);return;}
      // Close any open overlays when going back past them
      setShowProfile(false);setShowAnalytics(false);setShowNotifs(false);
      if(state.screen==='home'){setScreen('home');if(state.tab)setTab(state.tab);}
      else if(state.screen==='contact'){
        let found=contacts.find((c)=>{return c.id===state.cardId;});
        if(found){setActiveCard(found);setScreen('contact');}
        else{setScreen('home');}
      }
      else if(state.screen==='reveal'){setScreen('reveal');}
      else if(state.screen==='profile'){setScreen('profile');}
      else if(state.screen==='login'){setScreen('login');}
      else{setScreen('waitlist');}
    }
    window.addEventListener('popstate',onPop);
    return function(){window.removeEventListener('popstate',onPop);};
  },[contacts]);
  React.useEffect(function(){if(scanMode==='camera')startCamera();return function(){if(scanMode!=='camera')stopStream();};},[scanMode]);

  // â”€â”€â”€ 7. Early returns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(showTvPin)return <TeamVuePinGate onSuccess={function(){setShowTvPin(false);setShowTeamVue(true);}} onCancel={function(){setShowTvPin(false);}}/>;
  if(showTeamVue)return <TeamVueDashboard onClose={function(){setShowTeamVue(false);}} showSeedData={showTeamVueSampleData} onToggleSeedData={toggleTeamVueSampleData}/>;
  if(capturedPhoto&&scanMode==='review')return <AIScanReview photo={capturedPhoto} onSave={function(card){setContacts(function(p){return[card].concat(p);});setCapturedPhoto(null);setScanMode(null);setScreen('home');}} onRetake={function(){setCapturedPhoto(null);setScanMode(null);}} onClose={function(){setCapturedPhoto(null);setScanMode(null);}}/>;
  if(scanMode==='camera')return(
    <div style={{minHeight:'100vh',background:'#000',position:'relative',overflow:'hidden'}}>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      <video ref={videoRef} autoPlay playsInline muted style={{width:'100%',height:'100vh',objectFit:'cover',position:'absolute',top:0,left:0}}/>
      <canvas ref={canvasRef} style={{display:'none'}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'18px',background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:10}}>
        <button onClick={function(){stopStream();setScanMode(null);}} style={{fontSize:'26px',color:'white',background:'none',border:'none',cursor:'pointer',lineHeight:1}}>×</button>
        <h3 style={{color:'white',margin:0,fontSize:'15px'}}>Scan Business Card</h3>
        <div style={{width:'26px'}}/>
      </div>
      {cameraError&&<div style={{position:'absolute',top:'68px',left:'16px',right:'16px',background:'rgba(239,68,68,0.9)',color:'white',padding:'13px',borderRadius:'10px',textAlign:'center',zIndex:20,fontSize:'13px'}}>{cameraError}<br/><button onClick={function(){fileInputRef.current&&fileInputRef.current.click();}} style={{marginTop:'8px',background:'white',color:'#ef4444',border:'none',borderRadius:'6px',padding:'6px 12px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>Upload Instead</button></div>}
      <div style={{position:'absolute',bottom:'32px',left:0,right:0,display:'flex',justifyContent:'center',alignItems:'center',gap:'24px',zIndex:10}}>
        <button onClick={function(){fileInputRef.current&&fileInputRef.current.click();}} style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'white',borderRadius:'12px',padding:'10px 18px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Upload</button>
        <button onClick={capturePhoto} style={{width:'72px',height:'72px',borderRadius:'50%',background:'white',border:'4px solid #10b981',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Camera size={30} color="#000"/></button>
        <div style={{width:'80px'}}/>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileUpload}/>
    </div>
  );
  if(showAnalytics)return <AnalyticsScreen onClose={function(){setShowAnalytics(false);}} analyticsData={analyticsData}/>;
  if(showNotifs)return <NotificationsScreen notifs={notifs} contacts={contacts} onMarkRead={function(){setNotifs(function(p){return p.map((n)=>{return Object.assign({},n,{read:true});});});}} onClose={function(){setShowNotifs(false);}} onSelectContact={function(c){setShowNotifs(false);setActiveCard(c);setScreen('contact');}}/>;
  if(showProfile)return <ProfileScreen myCard={myCard} contacts={allContacts} onSave={function(card){setMyCard(card);}} onClose={function(){setShowProfile(false);}} onShowAnalytics={function(){setShowProfile(false);setShowAnalytics(true);}} photo={myPhoto} onStyleChange={function(val){setMyCard(function(c){return Object.assign({},c,{cardStyle:val});});}} onColorChange={function(col){setMyCard(function(c){return Object.assign({},c,{color:col});});}} onLogout={function(){setShowProfile(false);setShowLogoutConfirm(true);}} onToggleHidden={function(id){setContacts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{stackHidden:!x.stackHidden}):x;});});}}/>;
  if(screen==='public_profile'){
    if(!publicProfileCard)return(<div style={{minHeight:'100vh',background:'#0d0b1e',display:'flex',alignItems:'center',justifyContent:'center'}}><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style><div style={{width:'24px',height:'24px',borderRadius:'50%',border:'2px solid rgba(139,92,246,0.3)',borderTop:'2px solid #8b5cf6',animation:'spin 0.8s linear infinite'}}/></div>);
    // Build public contacts from the card's stored data - filter to public, non-hidden, non-lead
    let pubContacts=(publicProfileCard.publicStack||[]).filter((c)=>{return !c.stackHidden&&(c.privacy||getDefaultPrivacy(c.cardType))==='public'&&c.cardType!=='lead';});
    return <PublicProfilePage card={publicProfileCard} onGetApp={function(){setScreen('waitlist');window.history.pushState(null,'','/');}} publicContacts={pubContacts} isLoggedIn={false}/>;
  }
  if(showExchange)return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',color:'white'}}>
      <div style={{maxWidth:'320px',width:'100%',textAlign:'center'}}>
        {exchangeStep==='idle'&&(
          <>
            <div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'14px'}}>EXCHANGE</div>
            <h2 style={{fontSize:'22px',fontWeight:900,margin:'0 0 8px'}}>Card Exchange</h2>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'13px',margin:'0 0 20px',lineHeight:1.6}}>Tap the button to exchange cards with someone nearby.</p>
            <div onClick={function(){setExchangePrivate(function(v){return !v;});}} style={{display:'flex',alignItems:'center',gap:'10px',background:exchangePrivate?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.08)',border:'1px solid '+(exchangePrivate?'rgba(239,68,68,0.25)':'rgba(16,185,129,0.2)'),borderRadius:'12px',padding:'10px 14px',marginBottom:'24px',cursor:'pointer',textAlign:'left'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'5px',background:exchangePrivate?'rgba(239,68,68,0.3)':'rgba(16,185,129,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontSize:'12px',fontWeight:700}}>{exchangePrivate?'Private':'Public'}</span></div>
              <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'1px'}}>{exchangePrivate?'Private exchange':'Public exchange'}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{exchangePrivate?'No activity posted':'Appears in feed'}</div></div>
            </div>
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
              <svg width="140" height="140" style={{transform:'rotate(-90deg)'}}><circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7"/><circle cx="70" cy="70" r="60" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" strokeDasharray={2*Math.PI*60} strokeDashoffset={2*Math.PI*60*(1-holdProgress)}/></svg>
              <button onMouseDown={startHold} onMouseUp={function(){if(holdProgress<0.9)cancelHold();}} onMouseLeave={cancelHold} onTouchStart={function(e){e.preventDefault();startHold();}} onTouchEnd={function(e){e.preventDefault();if(holdProgress<0.9)cancelHold();}} style={{position:'absolute',width:'90px',height:'90px',borderRadius:'50%',background:holdActive?'linear-gradient(135deg,#8b5cf6,#3b82f6)':'rgba(139,92,246,0.15)',border:'2px solid rgba(139,92,246,0.6)',color:'white',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'5px',userSelect:'none',WebkitUserSelect:'none'}}>
                <Zap size={26} fill={holdActive?'white':'none'}/>
                <span style={{fontSize:'10px',fontWeight:800,letterSpacing:'1px'}}>HOLD</span>
              </button>
            </div>
            <button onClick={function(){setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setHoldActive(false);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.6)',borderRadius:'12px',padding:'11px 28px',cursor:'pointer',fontSize:'14px',fontWeight:600}}>Cancel</button>
          </>
        )}
        {exchangeStep==='searching'&&(<><style>{'@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.9)}}'}</style><div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'16px',display:'inline-block',animation:'pulse 1.2s ease-in-out infinite'}}>SEARCHING</div><h2 style={{fontSize:'20px',fontWeight:900,margin:'0 0 8px'}}>Looking nearby...</h2></>)}
        {exchangeStep==='found'&&(<><div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#10b981',marginBottom:'16px'}}>FOUND</div><h2 style={{fontSize:'20px',fontWeight:900,margin:'0 0 8px'}}>Contact found!</h2><p style={{color:'rgba(255,255,255,0.45)',fontSize:'13px'}}>Swapping cards...</p></>)}
        {exchangeStep==='success'&&(
          <>
            <div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#10b981',marginBottom:'8px'}}>DONE</div>
            <h2 style={{fontSize:'22px',fontWeight:900,margin:'0 0 4px'}}>Cards Exchanged!</h2>
            {exchangedCard&&(
              <div style={{width:'100%',marginBottom:'20px'}}>
                <div style={{width:'100%',maxWidth:'280px',height:'160px',margin:'12px auto'}}><Card3D card={exchangedCard} isCenter={true} style={{width:'100%',height:'100%'}} autoFlip={true} autoFlipKey={'exchange-'+(exchangedCard&&exchangedCard.id)}/></div>
                <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                  <button onClick={function(){setActiveCard(exchangedCard);setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangedCard(null);setScreen('contact');}} style={{flex:1,background:'rgba(139,92,246,0.2)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:'8px',padding:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>View Card</button>
                  <button onClick={function(){setActiveThread(exchangedCard.id);setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangedCard(null);setTab('messages');}} style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'8px',padding:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600}}>Message</button>
                </div>
              </div>
            )}
            <button onClick={function(){let pool=regularContacts.filter((c)=>{return c.cardType!=='lead';});setExchangedCard(pool[Math.floor(Math.random()*pool.length)]||CONTACTS[0]);setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangedCard(null);}} style={{width:'100%',background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'15px'}}>Done</button>
          </>
        )}
      </div>
    </div>
  );

  if(screen==='reveal')return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',color:'white'}}>
      <div style={{width:'100%',maxWidth:'420px',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}><div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'8px'}}>READY</div><h1 style={{fontSize:'24px',fontWeight:900,color:'white',margin:'0 0 6px'}}>Your card is ready</h1></div>
        <div style={{width:'100%',maxWidth:'320px',height:'183px',marginBottom:'8px'}}><Card3D card={myCard} isCenter={true} style={{width:'100%',height:'100%'}} photo={myPhoto} autoFlip={true} autoFlipKey={'reveal-'+(myCard.name||'new')}/></div>
        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',margin:'0 0 20px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
        <button onClick={function(){setShareCard(myCard);}} style={{width:'100%',background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'14px',padding:'16px',fontWeight:700,fontSize:'16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',marginBottom:'10px'}}><Share2 size={18}/> Share My Card</button>
        <button onClick={function(){setScreen('home');}} style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)',borderRadius:'14px',padding:'15px',fontWeight:600,fontSize:'15px',cursor:'pointer'}}>Explore the app</button>
      </div>
      {shareCard&&<ShareCardModal card={shareCard} onClose={function(){setShareCard(null);}}/>}
    </div>
  );
  if(screen==='waitlist')return <WaitlistPage onEnterApp={function(){setScreen('login');}} onLogoTap={handleLogoTap}/>;
  if(screen==='login')return(
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom right,#581c87,#3730a3,#1e3a8a)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{maxWidth:'380px',width:'100%'}}>
        <div style={{marginBottom:'20px'}}><button onClick={function(){setScreen('waitlist');}} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'10px',padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',fontSize:'13px',fontWeight:600}}><ArrowLeft size={16}/> Back</button></div>
        <div style={{textAlign:'center',marginBottom:'28px'}}><h1 style={{fontSize:'38px',fontWeight:900,color:'white',marginBottom:'8px'}}>CardHoldr</h1><p style={{color:'#e9d5ff',fontSize:'15px'}}>Now You Hold the Cards</p></div>
        <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(40px)',borderRadius:'22px',padding:'26px',border:'1px solid rgba(255,255,255,0.2)'}}>
          <button onClick={handleGoogleLogin} style={{width:'100%',background:'white',color:'#374151',padding:'14px',borderRadius:'13px',fontWeight:600,marginBottom:'10px',border:'none',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
          <button onClick={handleFacebookLogin} style={{width:'100%',background:'#1877F2',color:'white',padding:'14px',borderRadius:'13px',fontWeight:600,marginBottom:'10px',border:'none',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
          <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'14px 0'}}><div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.2)'}}></div><span style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:600}}>or</span><div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.2)'}}></div></div>
          <button onClick={function(){setScreen('profile');}} style={{width:'100%',background:'rgba(255,255,255,0.15)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:600,border:'1px solid rgba(255,255,255,0.25)',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}><Mail size={18}/> Continue with Email</button>
        </div>
      </div>
    </div>
  );

  if(screen==='profile'){
    let profileFields=profileType==='professional'
      ?[['name','Full Name'],['title','Job Title'],['company','Company'],['email','Email'],['phone','Phone'],['website','Website']].concat(myCard.isAgent?[['cribmeUrl','Listings URL']]:[])
      :[['name','Full Name'],['email','Email'],['phone','Phone']];
    return(
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0d0b1e,#1a1440,#0f0c29)',overflowY:'auto',padding:'24px 20px 48px'}}>
        <style>{'input{font-size:16px!important}'}</style>
        <div style={{maxWidth:'400px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',marginBottom:'32px'}}>
            <button onClick={function(){setScreen('login');}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'10px',padding:'8px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px',fontSize:'13px',fontWeight:600,flexShrink:0}}><ArrowLeft size={15}/> Back</button>
            <div style={{flex:1,textAlign:'center'}}><div style={{fontSize:'22px',fontWeight:900,color:'white'}}>Create Your Card</div><div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',marginTop:'2px'}}>Takes 30 seconds</div></div>
            <div style={{width:'72px'}}/>
          </div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:'14px',padding:'4px',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'14px'}}>
            {[['professional','Professional'],['personal','Personal']].map((pair)=>{let active=profileType===pair[0];return(<button key={pair[0]} onClick={function(){setProfileType(pair[0]);}} style={{flex:1,padding:'10px',borderRadius:'11px',fontWeight:700,border:'none',background:active?'linear-gradient(135deg,#8b5cf6,#6366f1)':'transparent',color:active?'white':'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'13px'}}>{pair[1]}</button>);})}
          </div>
          {profileType==='professional'&&(
            <div onClick={function(){setMyCard(function(c){return Object.assign({},c,{isAgent:!c.isAgent});});}} style={{display:'flex',alignItems:'center',gap:'12px',background:myCard.isAgent?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.04)',border:'1px solid '+(myCard.isAgent?'rgba(99,102,241,0.45)':'rgba(255,255,255,0.1)'),borderRadius:'13px',padding:'13px 15px',marginBottom:'14px',cursor:'pointer'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'7px',background:myCard.isAgent?'linear-gradient(135deg,#6366f1,#4f46e5)':'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{myCard.isAgent?<span style={{color:'white',fontSize:'9px',lineHeight:1,fontWeight:800}}>On</span>:<span style={{color:'rgba(255,255,255,0.45)',fontSize:'9px',lineHeight:1,fontWeight:800}}>Off</span>}</div>
              <div style={{flex:1}}><div style={{fontSize:'14px',fontWeight:700,color:'white'}}>I'm a Real Estate Agent</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'3px'}}>Unlocks leads pipeline and CRM tools</div></div>
              <span style={{fontSize:'10px',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',color:'white',padding:'3px 8px',borderRadius:'6px',fontWeight:800,flexShrink:0}}>PRO</span>
            </div>
          )}
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'16px'}}>
            {profileFields.map((row,i,arr)=>{let k=row[0];let placeholder=row[1]+(k==='name'||k==='email'||k==='company'?' *':'');return(
              <div key={k} style={{display:'flex',alignItems:'center',padding:'13px 16px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none',background:k==='cribmeUrl'?'rgba(99,102,241,0.08)':'transparent'}}>
                <input value={myCard[k]||''} onChange={function(e){let val=k==='phone'?formatPhone(e.target.value):e.target.value;setMyCard(function(c){let n=Object.assign({},c);n[k]=val;return n;});}} placeholder={placeholder} style={{flex:1,background:'none',border:'none',color:'white',fontSize:'15px',outline:'none',fontFamily:'inherit'}}/>
              </div>
            );})}
          </div>
          <div style={{marginBottom:'22px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,0.35)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'12px',textAlign:'center'}}>Pick a card color</div>
            <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
              {CARD_COLORS.map((c,i)=>{let isActive=myCard.color&&myCard.color[0]===c[0];return(<button key={i} onClick={function(){setMyCard(function(mc){return Object.assign({},mc,{color:c});});}} style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,'+c[0]+','+c[1]+')',border:isActive?'3px solid white':'3px solid transparent',cursor:'pointer',padding:0,transform:isActive?'scale(1.2)':'scale(1)',transition:'all 0.15s'}}/>);})}
            </div>
          </div>
          <button onClick={function(){
            if(!myCard.name||!myCard.email){alert('Name and email are required');return;}
            let updatedCard=Object.assign({},myCard,{cardType:profileType==='professional'?'professional':'personal'});
            setMyCard(updatedCard);lsSet('myCard',updatedCard);
            let user=lsGet('sb_user',null);
            if(user){let slug=(updatedCard.name||'user').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+user.id.slice(0,6);upsertCard(user.id,slug,updatedCard,updatedCard.privacy==='public');upsertProfile(user.id,{full_name:updatedCard.name,username:slug,updated_at:new Date().toISOString()});}
            setScreen('reveal');
          }} style={{width:'100%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',color:'white',padding:'16px',borderRadius:'14px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'16px'}}>Get Started ?</button>
          <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',marginTop:'12px'}}>You can edit everything later in your profile</p>
        </div>
      </div>
    );
  }

  if(screen==='contact'&&activeCard){
    let c=activeCard;
    let isLead=c.cardType==='lead';
    if(!isLead){
      let contactPublicStack=(c.publicStack&&c.publicStack.length?c.publicStack:contacts.filter((x)=>{return x.id!==c.id&&x.cardType!=='lead'&&!x.stackHidden&&(x.privacy||getDefaultPrivacy(x.cardType))==='public';})).map((x)=>{let full=contacts.find((m)=>{return m.id===x.id;})||{};let merged=Object.assign({},full,x);return{id:merged.id,name:merged.name,title:merged.title,company:merged.company,email:merged.email,phone:merged.phone,website:merged.website,instagram:merged.instagram,twitter:merged.twitter,linkedin:merged.linkedin,github:merged.github,portfolio:merged.portfolio,resume:merged.resume,hiring:merged.hiring,color:merged.color,cardType:merged.cardType||'professional',cardStyle:merged.cardStyle,privacy:merged.privacy||getDefaultPrivacy(merged.cardType),stackHidden:false};}).filter((x)=>{return !x.stackHidden&&(x.privacy||getDefaultPrivacy(x.cardType))==='public'&&x.cardType!=='lead';});
      return <PublicProfilePage card={c} onGetApp={function(){setScreen('home');window.history.pushState(null,'','/app');}} publicContacts={contactPublicStack} isLoggedIn={true}/>;
    }
    let c1=isLead?(LEAD_STATUS_COLORS[c.leadStatus]||'#10b981'):(c.color&&c.color[0])||'#8b5cf6';
    let c2=isLead?'#0ea5e9':(c.color&&c.color[1])||'#6366f1';
    let vcard='BEGIN:VCARD\nVERSION:3.0\nFN:'+(c.name||'')+'\nORG:'+(c.company||'')+'\nTITLE:'+(c.title||'')+'\nEMAIL:'+(c.email||'')+'\nTEL:'+(c.phone||'')+'\nEND:VCARD';
    let vh='data:text/vcard;charset=utf-8,'+encodeURIComponent(vcard);
    return(
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',color:'white',display:'flex',flexDirection:'column',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',flexShrink:0}}>
          <button onClick={function(){setScreen('home');}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600,padding:0}}><ArrowLeft size={18}/> Back</button>
          <div style={{display:'flex',gap:'8px'}}>
            {isLead&&<button onClick={function(){setEditingLead(c);setShowAddLead(true);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'9px',padding:'7px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600}}><Edit3 size={14}/> Edit</button>}
            {!isLead&&<button onClick={function(){setActiveThread(c.id);setTab('messages');setScreen('home');}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'9px',padding:'7px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600}}><MessageCircle size={14}/> Message</button>}
          </div>
        </div>
        <div style={{padding:'0 20px 40px',maxWidth:'500px',margin:'0 auto',width:'100%',boxSizing:'border-box'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'16px'}}>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,'+c1+','+c2+')',border:'3px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px'}}><span style={{fontSize:'32px',fontWeight:900,color:'white'}}>{(c.name||'?').charAt(0)}</span></div>
            <h1 style={{fontSize:'22px',fontWeight:900,margin:'0 0 4px',textAlign:'center'}}>{c.name}</h1>
            {isLead?<LeadBadge status={c.leadStatus}/>:<p style={{fontSize:'13px',color:'rgba(255,255,255,0.55)',margin:'0 0 2px'}}>{c.title||''}</p>}
            {c.company&&<p style={{fontSize:'13px',fontWeight:700,background:'linear-gradient(to right,'+c1+','+c2+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:'4px 0 0'}}>{c.company}</p>}
            {!isLead&&<div style={{marginTop:'6px'}}><PrivacyBadge privacy={c.privacy||getDefaultPrivacy(c.cardType)}/></div>}
          </div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'8px'}}>
            <div style={{width:'100%',maxWidth:'320px',height:'183px'}}>
              <Card3D key={'contact-card-'+c.id} card={c} isCenter={true} style={{width:'100%',height:'100%'}} autoFlip={true} autoFlipKey={'contact-'+c.id} onNameClick={function(){setActiveCard(c);setScreen('contact');}}/>
            </div>
          </div>
          <p style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',textAlign:'center',marginBottom:'16px',fontWeight:600}}>&lt;- Drag to flip -&gt;</p>
          {!isLead&&(<a href={vh} download={(c.name||'contact').replace(/\s+/g,'-')+'.vcf'} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',width:'100%',padding:'14px',borderRadius:'14px',background:'linear-gradient(135deg,'+c1+','+c2+')',color:'white',textDecoration:'none',fontSize:'15px',fontWeight:800,marginBottom:'12px',boxSizing:'border-box'}}><Download size={16}/> Save to Contacts</a>)}
          {[c.phone&&['Phone',c.phone,'tel:'+c.phone],c.email&&['Email',c.email,'mailto:'+c.email],c.website&&['Website',c.website,safeUrl(c.website)]].filter(Boolean).length>0&&(
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'14px'}}>
              {[c.phone&&['Phone',c.phone,'tel:'+c.phone],c.email&&['Email',c.email,'mailto:'+c.email],c.website&&['Website',c.website,safeUrl(c.website)]].filter(Boolean).map((row,i,arr)=>{return(<a key={row[0]} href={row[2]} target={row[0]==='Website'?'_blank':undefined} rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'14px',padding:'13px 18px',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none',textDecoration:'none'}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',fontWeight:600,marginBottom:'1px'}}>{row[0]}</div><div style={{fontSize:'13px',color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row[1]}</div></div><ChevronRight size={14} color="rgba(255,255,255,0.3)"/></a>);})}
            </div>
          )}
          {isLead&&(
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px'}}>
              {LEAD_STATUSES.map((s)=>{let col=LEAD_STATUS_COLORS[s];return(<button key={s} onClick={function(){setContacts(function(p){return p.map((x)=>{return x.id===c.id?Object.assign({},x,{leadStatus:s}):x;});});setActiveCard(function(a){return Object.assign({},a,{leadStatus:s});});}} style={{flex:1,padding:'7px 4px',borderRadius:'9px',border:'1px solid '+(c.leadStatus===s?col:'rgba(255,255,255,0.1)'),background:c.leadStatus===s?col+'22':'transparent',color:c.leadStatus===s?col:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'10px',fontWeight:700,textAlign:'center',minWidth:'60px'}}>{s}</button>);})}
            </div>
          )}
          {!isLead&&c.notes&&(<div style={{background:'rgba(255,255,255,0.04)',borderRadius:'12px',padding:'14px 16px',border:'1px solid rgba(255,255,255,0.07)',marginBottom:'14px'}}><div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>Notes</div><div style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',lineHeight:1.55}}>{c.notes}</div></div>)}
          {!isLead&&(<div style={{textAlign:'center',marginBottom:'8px'}}><button onClick={function(){setShowReport(true);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.2)',cursor:'pointer',fontSize:'12px',padding:'8px 16px',textDecoration:'underline',textUnderlineOffset:'3px'}}>Report this user</button></div>)}
        </div>
        {(showAddLead||editingLead)&&<AddLeadModal onSave={saveLead} onClose={function(){setShowAddLead(false);setEditingLead(null);}} existing={editingLead}/>}
      </div>
    );
  }

  // â”€â”€â”€ Main Shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440,#0d0b1e)',display:'flex',flexDirection:'column'}}>
      <style>{'@keyframes typingDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.35)}input,textarea{font-size:16px!important;touch-action:manipulation}'}</style>

      {shareCard&&<ShareCardModal card={shareCard} onClose={function(){setShareCard(null);}}/>}
      {showAddContact&&<AddContactModal onSave={saveContactCard} onClose={function(){setShowAddContact(false);}}/>}
      {(showAddLead||editingLead)&&<AddLeadModal onSave={saveLead} onClose={function(){setShowAddLead(false);setEditingLead(null);}} existing={editingLead}/>}
      {showReport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.78)',backdropFilter:'blur(10px)',zIndex:210,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}} onClick={function(){setShowReport(false);}}>
          <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'18px',padding:'22px',maxWidth:'320px',width:'100%',border:'1px solid rgba(255,255,255,0.1)'}} onClick={function(e){e.stopPropagation();}}>
            <h3 style={{color:'white',fontSize:'17px',fontWeight:750,margin:'0 0 8px'}}>Report this user?</h3>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',lineHeight:1.55,margin:'0 0 18px'}}>This will flag the card for review in this demo. No message is sent yet.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={function(){setShowReport(false);}} style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'10px',padding:'10px',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Cancel</button>
              <button onClick={function(){setShowReport(false);alert('Report submitted for review.');}} style={{flex:1,background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',borderRadius:'10px',padding:'10px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Report</button>
            </div>
          </div>
        </div>
      )}
      {showLogoutConfirm&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}} onClick={function(){setShowLogoutConfirm(false);}}>
          <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'20px',padding:'28px 24px',maxWidth:'300px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}} onClick={function(e){e.stopPropagation();}}>
            <div style={{fontSize:'14px',fontWeight:800,letterSpacing:'0.08em',color:'#f87171',marginBottom:'12px'}}>SIGN OUT</div>
            <h3 style={{color:'white',fontSize:'18px',fontWeight:900,margin:'0 0 8px'}}>Sign out?</h3>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'13px',margin:'0 0 24px',lineHeight:1.6}}>Your data will be cleared from this device.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={function(){setShowLogoutConfirm(false);}} style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:600,fontSize:'14px'}}>Cancel</button>
              <button onClick={doLogout} style={{flex:1,background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',borderRadius:'12px',padding:'12px',cursor:'pointer',fontWeight:700,fontSize:'14px'}}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',paddingBottom:'80px'}}>

        {tab==='messages'&&(
          <div style={{flex:1,display:'flex',flexDirection:'column',height:'calc(100vh - 80px)',overflow:'hidden'}}>
            {activeThread&&contacts.find((c)=>{return c.id===activeThread;})?(
              <ChatView contact={contacts.find((c)=>{return c.id===activeThread;})} msgs={threads[activeThread]||[]} draft={draft} setDraft={setDraft} sendMsg={sendMsg} isTyping={isTyping} reactions={reactions} setReactions={setReactions} reactionTarget={reactionTarget} setReactionTarget={setReactionTarget} onBack={function(){setActiveThread(null);}} exportContact={exportContact}/>
            ):(
              <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
                <div style={{padding:'18px 18px 12px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',gap:'10px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
                      <BackButton onClick={goHomeTab} label="Back to home"/>
                      <h2 style={{color:'white',fontSize:'20px',fontWeight:800,margin:0}}>Messages</h2>
                    </div>
                    <div style={{display:'flex',gap:'7px',alignItems:'center'}}>
                      <button onClick={toggleSeedData} style={{background:showSeedData?'rgba(255,255,255,0.07)':'rgba(139,92,246,0.15)',border:'1px solid '+(showSeedData?'rgba(255,255,255,0.15)':'rgba(139,92,246,0.4)'),color:showSeedData?'rgba(255,255,255,0.5)':'#a78bfa',borderRadius:'9px',padding:'6px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700,whiteSpace:'nowrap'}}>{showSeedData?'Hide Sample Cards':'Show Sample Cards'}</button>
                      <button onClick={function(){setNewMsgSearch('');setShowNewMsg(true);}} style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)',border:'none',color:'white',borderRadius:'9px',padding:'6px 10px',cursor:'pointer',fontSize:'11px',fontWeight:700,display:'flex',alignItems:'center',gap:'4px'}}><Plus size={13}/> New</button>
                    </div>
                  </div>
                  <div style={{position:'relative'}}>
                    <input value={msgSearch} onChange={function(e){setMsgSearch(e.target.value);}} placeholder="Search..." style={{width:'100%',padding:'9px 13px 9px 34px',borderRadius:'11px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'16px',outline:'none',boxSizing:'border-box'}}/>
                    <Search size={13} style={{position:'absolute',left:'11px',top:'50%',transform:'translateY(-50%)',opacity:0.4,color:'white'}}/>
                  </div>
                </div>
                <div style={{flex:1,overflowY:'auto'}}>
                  {contacts.filter((c)=>{return c.cardType!=='lead';}).filter((c)=>{return showSeedData?true:!c.isSeed;}).filter((c)=>{return c.name.toLowerCase().includes(msgSearch.toLowerCase());}).map((contact)=>{
                    let last=threads[contact.id]&&threads[contact.id].slice(-1)[0];
                    let unread=(last&&last.from==='them')?1:0;
                    return(
                      <div key={contact.id} onClick={function(){setActiveThread(contact.id);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'13px 18px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                        <Avatar contact={contact} size={46}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                            <span onClick={function(e){e.stopPropagation();setActiveCard(contact);setScreen('contact');}} style={{color:'white',fontWeight:unread?800:600,fontSize:'14px',cursor:'pointer'}}>{contact.name}</span>
                            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>{last&&last.time}</span>
                          </div>
                          <p style={{color:unread?'#c4b5fd':'rgba(255,255,255,0.35)',fontSize:'12px',margin:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:unread?600:400}}>{last?(last.from==='me'?'You: '+last.text:last.text):'No messages yet'}</p>
                        </div>
                        {unread>0&&<div style={{width:12,height:12,borderRadius:'50%',background:'#8b5cf6',flexShrink:0}}/>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {showNewMsg&&(
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',zIndex:100,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={function(){setShowNewMsg(false);}}>
                <div style={{background:'linear-gradient(135deg,#1a1440,#0d0b1e)',borderRadius:'24px 24px 0 0',padding:'8px 0 32px',maxWidth:'480px',width:'100%',border:'1px solid rgba(255,255,255,0.1)',borderBottom:'none',maxHeight:'80vh',display:'flex',flexDirection:'column'}} onClick={function(e){e.stopPropagation();}}>
                  <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(255,255,255,0.15)',margin:'12px auto 0',flexShrink:0}}/>
                  <div style={{padding:'14px 20px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
                    <h2 style={{color:'white',fontSize:'18px',fontWeight:900,margin:0}}>New Message</h2>
                    <button onClick={function(){setShowNewMsg(false);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
                  </div>
                  <div style={{padding:'0 20px 10px',flexShrink:0}}>
                    <div style={{position:'relative'}}>
                      <input value={newMsgSearch} onChange={function(e){setNewMsgSearch(e.target.value);}} placeholder="Search contacts..." autoFocus style={{width:'100%',padding:'10px 14px 10px 36px',borderRadius:'12px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'15px',outline:'none',boxSizing:'border-box'}}/>
                      <Search size={14} style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.35)'}}/>
                    </div>
                  </div>
                  <div style={{overflowY:'auto',flex:1,padding:'0 12px'}}>
                    {contacts.filter((c)=>{return c.cardType!=='lead';}).filter((c)=>{return showSeedData?true:!c.isSeed;}).filter((c)=>{if(!newMsgSearch)return true;let q=newMsgSearch.toLowerCase();return(c.name||'').toLowerCase().includes(q)||(c.company||'').toLowerCase().includes(q);}).map((contact)=>{return(
                      <div key={contact.id} onClick={function(){setActiveThread(contact.id);setShowNewMsg(false);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 8px',borderRadius:'12px',cursor:'pointer',marginBottom:'2px'}}>
                        <Avatar contact={contact} size={42}/>
                        <div style={{flex:1,minWidth:0}}><div style={{color:'white',fontWeight:700,fontSize:'14px',marginBottom:'1px'}}>{contact.name}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.title}{contact.company?' · '+contact.company:''}</div></div>
                        <MessageCircle size={16} color="rgba(139,92,246,0.6)"/>
                      </div>
                    );})}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==='home'&&(
          <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'18px 18px 0',maxWidth:'800px',margin:'0 auto',width:'100%',boxSizing:'border-box'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px'}}>
              <div>
                <h1 onClick={handleLogoTap} style={{fontSize:'24px',fontWeight:750,color:'white',margin:'0 0 2px',letterSpacing:0,cursor:'default',userSelect:'none',WebkitUserSelect:'none'}}>CardHoldr</h1>
                <p style={{color:'#c4b5fd',fontSize:'12px',margin:0}}>Hey <span onClick={function(){setShowProfile(true);}} style={{cursor:'pointer',fontWeight:650,textDecoration:'underline',textUnderlineOffset:'2px'}}>{(myCard.name||'there').split(' ')[0]}</span></p>
              </div>
              <div style={{display:'flex',gap:'7px',alignItems:'center'}}>
                <button onClick={toggleSeedData} style={{background:showSeedData?'rgba(255,255,255,0.07)':'rgba(139,92,246,0.15)',border:'1px solid '+(showSeedData?'rgba(255,255,255,0.15)':'rgba(139,92,246,0.4)'),color:showSeedData?'rgba(255,255,255,0.5)':'#a78bfa',borderRadius:'9px',padding:'7px 10px',cursor:'pointer',fontSize:'11px',fontWeight:600,whiteSpace:'nowrap'}}>{showSeedData?'Hide Sample Cards':'Show Sample Cards'}</button>
                <button onClick={function(){setShowNotifs(true);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',color:'white',borderRadius:'9px',padding:'7px',cursor:'pointer',display:'flex',position:'relative'}}>
                  <Bell size={17}/>
                  {unreadNotifs>0&&<div style={{position:'absolute',top:'-3px',right:'-3px',width:'14px',height:'14px',borderRadius:'50%',background:'#ef4444',fontSize:'9px',color:'white',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{unreadNotifs}</div>}
                </button>
                <div style={{position:'relative'}}>
                  <button onClick={function(){setShowProfileMenu(function(v){return !v;});}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',color:'white',borderRadius:'9px',padding:'7px',cursor:'pointer',display:'flex'}}><User size={17}/></button>
                  {showProfileMenu&&(
                    <>
                      <div style={{position:'fixed',inset:0,zIndex:98}} onClick={function(){setShowProfileMenu(false);}}/>
                      <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,background:'rgba(20,18,50,0.97)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',overflow:'hidden',zIndex:99,minWidth:'150px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
                        <button onClick={function(){setShowProfileMenu(false);setShowProfile(true);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',background:'none',border:'none',color:'white',cursor:'pointer',fontSize:'13px',fontWeight:600,textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.08)'}}><User size={14}/> Profile</button>
                        <button onClick={function(){setShowProfileMenu(false);setShowLogoutConfirm(true);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:'13px',fontWeight:600,textAlign:'left'}}>Sign Out</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
              {(canUseLeads?[['contacts','Contacts'],['leads','Leads']]:[['contacts','Contacts']]).map((pair)=>{return(<button key={pair[0]} onClick={function(){setCarouselMode(pair[0]);setCardIndex(0);}} style={{flex:1,padding:'8px',borderRadius:'11px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:carouselMode===pair[0]?650:500,background:carouselMode===pair[0]?(pair[0]==='leads'?'linear-gradient(to right,#10b981,#0ea5e9)':'linear-gradient(to right,#8b5cf6,#6366f1)'):'rgba(255,255,255,0.07)',color:carouselMode===pair[0]?'white':'rgba(255,255,255,0.5)'}}>{pair[1]}</button>);})}
            </div>
            <div style={{position:'relative',marginBottom:'10px'}}>
              <input value={searchQuery} onChange={function(e){setSearchQuery(e.target.value);setCardIndex(0);}} placeholder="Search cards..." style={{width:'100%',padding:'9px 11px 9px 32px',borderRadius:'11px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'16px',outline:'none',boxSizing:'border-box'}}/>
              <Search size={13} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',opacity:0.4,color:'white'}}/>
            </div>

            {carouselPool.length>0?(
              <>
                <div data-carousel-swipe="true" onMouseDown={startCarouselSwipe} onMouseMove={moveCarouselSwipe} onMouseUp={endCarouselSwipe} onMouseLeave={function(){carouselSwipeRef.current=null;}} onTouchStart={startCarouselSwipe} onTouchMove={moveCarouselSwipe} onTouchEnd={endCarouselSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                  <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                    {getVisible().map((item)=>{
                      let card=item.card;let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);
                      let shouldAutoFlip=isCenter&&homeAutoFlipCardId===card.id;
                      return(
                        <Card3D key={card.id} card={card} isCenter={isCenter} autoFlip={shouldAutoFlip} autoFlipKey={'home-'+card.id+'-'+tab+'-'+carouselMode+'-'+(shouldAutoFlip?'intro':'idle')}
                          onNameClick={isCenter?function(){setActiveCard(card);setScreen('contact');}:undefined}
                          onClick={!isCenter?function(e){e.stopPropagation();setCarouselIndexWithClick(function(i){return(i+offset+carouselPool.length)%carouselPool.length;},Math.abs(offset));}:undefined}
                          style={{position:'absolute',width:'88%',maxWidth:'310px',height:'177px',transform:'translateX('+(offset*72)+'%) scale('+(isCenter?1:0.74)+')',transformOrigin:'center center',zIndex:isCenter?30:20-absOff,opacity:isCenter?1:Math.max(0.15,0.45-absOff*0.15),transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1),opacity 0.45s',cursor:'pointer',touchAction:isCenter?'none':'pan-y'}}
                          data-carousel-card="true" data-center-card={isCenter?'true':undefined}/>
                      );
                    })}
                  </div>
                </div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.28)',textAlign:'center',margin:'0 0 2px',fontWeight:500}}>&lt;- Drag to flip -&gt;</p>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.24)',textAlign:'center',margin:'0 0 6px',fontWeight:500,letterSpacing:0}}>&lt;-- Swipe side cards to scroll --&gt;</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                  <button onClick={function(){setCarouselIndexWithClick(function(i){return(i-1+carouselPool.length)%carouselPool.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:500}}><ChevronLeft size={15}/> Prev</button>
                  <div style={{display:'flex',gap:'4px'}}>{carouselPool.map((cc,i)=>{let col=(cc.cardType==='lead'?(LEAD_STATUS_COLORS[cc.leadStatus]||'#10b981'):(cc.color&&cc.color[0])||'#8b5cf6');return(<button key={i} onClick={function(){setCarouselIndexWithClick(i,Math.abs(i-safeIdx));}} style={{width:i===safeIdx?'16px':'6px',height:'6px',borderRadius:'3px',background:i===safeIdx?col:'rgba(255,255,255,0.2)',border:'none',cursor:'pointer',transition:'all 0.3s',padding:0}}/>);})}</div>
                  <button onClick={function(){setCarouselIndexWithClick(function(i){return(i+1)%carouselPool.length;},1);}} style={{padding:'7px 11px',background:'rgba(255,255,255,0.07)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontWeight:500}}>Next <ChevronRight size={15}/></button>
                </div>
                {carouselCard&&(
                  <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'13px',padding:'11px 13px',marginBottom:'12px'}}>
                    <div onClick={function(){setActiveCard(carouselCard);setScreen('contact');}} style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',paddingBottom:carouselCard.cardType!=='lead'?'8px':0}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'8px',background:carouselCard.cardType==='lead'?'linear-gradient(135deg,'+(LEAD_STATUS_COLORS[carouselCard.leadStatus]||'#10b981')+',#0ea5e9)':'linear-gradient(135deg,'+(carouselCard.color&&carouselCard.color[0]?carouselCard.color[0]:'#8b5cf6')+','+(carouselCard.color&&carouselCard.color[1]?carouselCard.color[1]:'#6366f1')+')',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'13px',flexShrink:0}}>{(carouselCard.name||'?').charAt(0)}</div>
                      <div style={{flex:1,minWidth:0}}><div style={{color:'white',fontWeight:650,fontSize:'13px'}}>{carouselCard.name}</div><div style={{color:'rgba(255,255,255,0.43)',fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{carouselCard.cardType==='lead'?carouselCard.leadStatus:((carouselCard.title||'')+' '+(carouselCard.company?'· '+carouselCard.company:''))}</div></div>
                      <div style={{display:'flex',gap:'6px'}}>
                        {carouselCard.cardType==='lead'?(<button onClick={function(e){e.stopPropagation();setEditingLead(carouselCard);setShowAddLead(true);}} style={{background:'linear-gradient(135deg,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'8px',padding:'6px 10px',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>Edit</button>):(<button onClick={function(e){e.stopPropagation();setActiveThread(carouselCard.id);setTab('messages');}} style={{background:'linear-gradient(135deg,'+(carouselCard.color&&carouselCard.color[0]?carouselCard.color[0]:'#8b5cf6')+','+(carouselCard.color&&carouselCard.color[1]?carouselCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'8px',padding:'6px 10px',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>Msg</button>)}
                        <button onClick={function(e){e.stopPropagation();exportContact(carouselCard);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',color:'white',borderRadius:'8px',padding:'6px 7px',cursor:'pointer',display:'flex'}}><Download size={13}/></button>
                      </div>
                    </div>
                    {carouselCard.cardType!=='lead'&&(
                      <StackVisibilityToggle c={carouselCard} stackPublic={myCard.stackPublic} onToggleHidden={function(id){setContacts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{stackHidden:!x.stackHidden}):x;});});}}/>
                    )}
                  </div>
                )}
              </>
            ):(
              <div style={{textAlign:'center',padding:'36px 20px',color:'rgba(255,255,255,0.3)'}}>
                <div style={{fontSize:'36px',marginBottom:'10px'}}>{carouselMode==='leads'?'No leads':'No cards'}</div>
                <div style={{fontSize:'14px',fontWeight:600}}>{carouselMode==='leads'?'No leads yet':'No cards found'}</div>
                {carouselMode==='leads'&&canUseLeads&&<button onClick={function(){setShowAddLead(true);}} style={{marginTop:'12px',background:'linear-gradient(to right,#10b981,#0ea5e9)',border:'none',color:'white',borderRadius:'10px',padding:'10px 20px',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>Add First Lead</button>}
              </div>
            )}

            <div style={{display:'flex',flexDirection:'column',gap:'8px',paddingBottom:'18px'}}>
              <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:'8px'}}>
                <button onClick={function(){setScanMode('camera');}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Camera size={16}/> Scan Card</button>
                {canUseLeads?(
                  <div style={{flex:'1 1 0',width:'100%',display:'flex',gap:'6px',minWidth:0}}>
                    <button onClick={function(){setShowAddContact(true);}} style={{flex:'1 1 0',background:'rgba(139,92,246,0.18)',border:'1px solid rgba(139,92,246,0.35)',color:'white',padding:'13px 4px',borderRadius:'12px',fontWeight:650,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px',fontSize:'11px',minWidth:0,whiteSpace:'nowrap'}}><Plus size={13}/> Add Contact</button>
                    <button onClick={function(){setShowAddLead(true);}} style={{flex:'1 1 0',background:'linear-gradient(to right,#10b981,#0ea5e9)',color:'white',padding:'13px 4px',borderRadius:'12px',fontWeight:650,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px',fontSize:'11px',minWidth:0,whiteSpace:'nowrap'}}><Plus size={13}/> Add Lead</button>
                  </div>
                ):(
                  <button onClick={function(){setShowAddContact(true);}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Plus size={16}/> Add Contact</button>
                )}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:'8px'}}>
                <button onClick={function(){setShowExchange(true);setExchangeStep('idle');setHoldProgress(0);setHoldActive(false);}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'linear-gradient(to right,#4f46e5,#0ea5e9)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Zap size={17} fill="white"/> Exchange</button>
                <button onClick={function(){setShareCard(carouselCard||myCard);}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.11)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Share2 size={17}/> Share</button>
              </div>
            </div>
          </div>
        )}

        {tab==='stack'&&(
          <CardStackScreen contacts={allContacts} onSelectContact={function(c){setActiveCard(c);setScreen('contact');}} cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter} isPro={canUseLeads} onAddLead={function(){setShowAddLead(true);}} onEditLead={function(lead){setEditingLead(lead);setShowAddLead(true);}} onToggleHidden={function(id){setContacts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{stackHidden:!x.stackHidden}):x;});});}} stackPublic={myCard.stackPublic} onToggleStackPublic={function(){setMyCard(function(c){let next=c.stackPublic===true?false:true;let updated=Object.assign({},c,{stackPublic:next});lsSet('myCard',updated);return updated;});}} showSeedData={showSeedData} onRemoveSamples={toggleSeedData} onBack={goHomeTab}/>
        )}

        {tab==='feed'&&(
          <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'18px',maxWidth:'800px',margin:'0 auto',width:'100%',boxSizing:'border-box'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
              <BackButton onClick={goHomeTab} label="Back to home"/>
              <h2 style={{color:'white',fontSize:'20px',fontWeight:800,margin:0}}>Feed</h2>
            </div>
            <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'16px',padding:'14px',marginBottom:'16px',border:'1px solid rgba(255,255,255,0.1)'}}>
              <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                <Avatar contact={{name:myCard.name||'Y',color:myCard.color||CARD_COLORS[0]}} size={38}/>
                <div style={{flex:1}}>
                  <textarea value={postDraft} onChange={function(e){setPostDraft(e.target.value);}} placeholder="What's on your mind?" rows={2} style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',padding:'10px 14px',color:'white',fontSize:'16px',resize:'none',outline:'none',lineHeight:1.5,boxSizing:'border-box',fontFamily:'inherit'}}/>
                  {postDraft.trim()&&(
                    <div style={{display:'flex',justifyContent:'flex-end',marginTop:'10px'}}>
                      <button onClick={function(){if(!postDraft.trim())return;setPosts(function(p){return [{id:Date.now(),contactId:null,isOwn:true,text:postDraft.trim(),time:'Just now',likes:0,liked:false,comments:[]}].concat(p);});setPostDraft('');}} style={{background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'8px',padding:'7px 18px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Post</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {teamPosts.map((post)=>{return(<TeamPostCard key={post.id} post={post} onLike={function(id){setTeamPosts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}):x;});});}}/>);})}
            {posts.map((post)=>{return(<PostCard key={post.id} post={post} contacts={contacts} myCard={myCard} onLike={function(id){setPosts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}):x;});});}} onComment={function(pid,text){setPosts(function(p){return p.map((x)=>{return x.id===pid?Object.assign({},x,{comments:(x.comments||[]).concat([{id:Date.now(),isOwn:true,text:text,time:'Just now'}])}):x;});});}} onDelete={function(id){setPosts(function(p){return p.filter((x)=>{return x.id!==id;});});}} onSelectContact={function(c){setActiveCard(c);setScreen('contact');}} onViewOwnProfile={function(){setShowProfile(true);}}/>);})}
          </div>
        )}
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50}}>
        <div style={{maxWidth:'800px',margin:'0 auto',padding:'0 14px 14px'}}>
          <div style={{background:'rgba(10,8,30,0.92)',backdropFilter:'blur(40px)',borderRadius:'18px',padding:'6px',border:'1px solid rgba(255,255,255,0.1)',display:'flex',justifyContent:'space-around'}}>
            {[['home',Home,'Home',null],['stack',Layers,'Stack',null],['messages',MessageCircle,'Messages',totalUnread],['feed',Users,'Feed',null]].map((item)=>{let t=item[0];let Icon=item[1];let label=item[2];let badge=item[3];return(<button key={t} onClick={function(){setTab(t);if(t!=='messages')setActiveThread(null);}} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 20px',borderRadius:'12px',background:tab===t?'linear-gradient(135deg,#8b5cf6,#6366f1)':'transparent',color:tab===t?'white':'rgba(255,255,255,0.4)',border:'none',cursor:'pointer',position:'relative',minWidth:'64px'}}><Icon size={20}/><span style={{fontSize:'10px',fontWeight:600,marginTop:'2px'}}>{label}</span>{badge>0&&tab!==t&&<div style={{position:'absolute',top:'4px',right:'10px',width:'14px',height:'14px',borderRadius:'50%',background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:800}}>{badge}</div>}</button>);})}
          </div>
        </div>
      </div>
    </div>
  );
}
