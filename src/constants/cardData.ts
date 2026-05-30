import { safeUrl, safeName } from '../lib/safety';

export const CARD_COLORS=[['#8b5cf6','#6366f1'],['#0ea5e9','#6366f1'],['#ec4899','#8b5cf6'],['#10b981','#0ea5e9'],['#f59e0b','#ef4444'],['#6366f1','#06b6d4']];
export const REACTIONS=['👍','❤️','🔥','👏','😂','🎉'];

export const LEAD_STATUSES=['Lead','Prospect','Active Client','Closed','Follow-up'];
export const LEAD_STATUS_COLORS={'Lead':'#f59e0b','Prospect':'#0ea5e9','Active Client':'#10b981','Closed':'#6366f1','Follow-up':'#ec4899'};
export const PRO_BADGE_DEFS=[
  {key:'github',label:'GitHub',short:'GitHub',color:'#888',getUrl:function(v){return safeUrl('https://github.com/'+safeName(v));}},
  {key:'portfolio',label:'Portfolio',short:'Portfolio',color:'#8b5cf6',getUrl:function(v){return safeUrl(v);}},
  {key:'resume',label:'Resume',short:'Resume',color:'#0ea5e9',getUrl:function(v){return safeUrl(v);}},
  {key:'website',label:'Website',short:'Website',color:'#10b981',getUrl:function(v){return safeUrl(v);}},
  {key:'hiring',label:'Hiring',short:'Hiring',color:'#f59e0b',getUrl:function(v){return safeUrl(v);}},
];

export const CONTACTS=[
  {id:1,name:'Sarah Johnson',title:'CEO',company:'TechCorp',email:'sarah@techcorp.com',phone:'+1 (555) 123-4567',website:'techcorp.com',username:'sarahjohnson',color:['#8b5cf6','#6366f1'],instagram:'sarahjohnson',twitter:'sarahjohnson',linkedin:'sarahjohnson',tags:['investor'],notes:'Met at SaaS Summit.',source:'scanned',date:'2 days ago',favorite:true,cardType:'professional',github:'sarahjohnson',hiring:'https://techcorp.com/jobs',privacy:'public',isSeed:true},
  {id:2,name:'Michael Williams',title:'CTO',company:'InnovateLabs',email:'michael@innovatelabs.com',phone:'+1 (555) 234-5678',username:'mwilliams',color:['#0ea5e9','#6366f1'],instagram:'mwilliams',twitter:'mwilliams_cto',linkedin:'mwilliams',tags:['engineering'],notes:'Great talk.',source:'scanned',date:'3 days ago',favorite:false,cardType:'professional',github:'mwilliams',portfolio:'https://mwilliams.dev',privacy:'public',isSeed:true},
  {id:3,name:'Jessica Brown',title:'Marketing Director',company:'Digital Solutions',email:'jessica@digitalsolutions.com',phone:'+1 (555) 345-6789',username:'jessicabrown',color:['#ec4899','#8b5cf6'],instagram:'jessicabrown',twitter:'jessicabrown',linkedin:'jessicabrown',tags:['marketing'],notes:'Content collab.',source:'scanned',date:'5 days ago',favorite:false,cardType:'social',privacy:'private',isSeed:true},
  {id:4,name:'David Jones',title:'VP of Sales',company:'CloudSync',email:'david@cloudsync.com',phone:'+1 (555) 456-7890',username:'davidjones',color:['#10b981','#0ea5e9'],twitter:'davidjones',linkedin:'davidjones',tags:['sales'],notes:'Demo Thursday.',source:'scanned',date:'1 week ago',favorite:true,cardType:'professional',privacy:'public',isSeed:true},
  {id:5,name:'Emily Garcia',title:'Product Manager',company:'DataStream',email:'emily@datastream.com',phone:'+1 (555) 567-8901',username:'emilygarcia',color:['#f59e0b','#ef4444'],instagram:'emilygarcia',twitter:'emilygarcia',linkedin:'emilygarcia',tags:['product'],notes:'Potential partner.',source:'manual',date:'1 week ago',favorite:false,cardType:'social',privacy:'private',isSeed:true},
];

export const SAMPLE_LEADS=[
  {id:101,name:'Robert Kim',title:'Homebuyer',company:'',email:'rkim@email.com',phone:'(212) 555-0101',color:['#10b981','#0ea5e9'],tags:[],notes:'3BR Brooklyn. Budget $1.2M.',source:'manual',date:'1 day ago',favorite:false,cardType:'lead',leadStatus:'Active Client',leadBudget:'$1.2M',leadInterest:'3BR Brooklyn',isSeed:true,privacy:'private',stackHidden:true},
  {id:102,name:'Tina Patel',title:'Seller',company:'',email:'tina@email.com',phone:'(646) 555-0202',color:['#ec4899','#8b5cf6'],tags:[],notes:'Listing at 45 Park Ave.',source:'manual',date:'3 days ago',favorite:false,cardType:'lead',leadStatus:'Lead',leadBudget:'',leadInterest:'45 Park Ave listing',isSeed:true,privacy:'private',stackHidden:true},
  {id:103,name:'Marcus Lee',title:'Investor',company:'Lee Properties LLC',email:'marcus@leeprops.com',phone:'(917) 555-0303',color:['#f59e0b','#ef4444'],tags:[],notes:'Multi-family, cash buyer.',source:'manual',date:'1 week ago',favorite:true,cardType:'lead',leadStatus:'Prospect',leadBudget:'$3M+',leadInterest:'Multi-family',isSeed:true,privacy:'private',stackHidden:true},
];

export const THREADS={
  1:[{id:1,from:'them',text:'Hey! Great meeting you at the conference!',time:'9:14 AM',date:'Yesterday'},{id:2,from:'me',text:'Likewise! Your talk was brilliant.',time:'9:22 AM',date:'Yesterday'},{id:3,from:'them',text:'I shared your CardHoldr profile with my team',time:'2:30 PM',date:'Today'}],
  2:[{id:1,from:'them',text:'Do you have the API docs?',time:'11:00 AM',date:'Yesterday'},{id:2,from:'me',text:'Sending them over now!',time:'11:05 AM',date:'Yesterday'}],
  3:[{id:1,from:'them',text:"We're doing a series on product-led growth.",time:'9:00 AM',date:'Today'}],
  4:[{id:1,from:'them',text:'How about next week for the demo?',time:'5:00 PM',date:'Today'}],
  5:[{id:1,from:'them',text:'Thanks for connecting!',time:'1:00 PM',date:'Today'}],
};

export const NOTIFS=[{id:1,type:'view',contactId:1,text:'viewed your card',time:'2h ago',read:false},{id:2,type:'exchange',contactId:3,text:'exchanged cards with you',time:'5h ago',read:false},{id:3,type:'message',contactId:2,text:'sent you a message',time:'1d ago',read:true}];
export const TEAM_POSTS=[
  {id:'t1',isTeam:true,emoji:'NEW',title:'Physical Card Scanning is here!',text:'You can now scan any physical business card with AI. Head to Home and tap Scan Card to try it.',time:'Just now',likes:142,liked:false,comments:[]},
  {id:'t2',isTeam:true,emoji:'TIP',title:'Pro tip: use tags to organize your network',text:'Add tags like investor or conference to any contact. Filter by tag to find exactly who you need.',time:'2d ago',likes:87,liked:false,comments:[]},
];
export const FEED_DEMO_POSTS=[
  {id:1,contactId:1,text:"Just closed our Series B!",time:'2h ago',likes:24,liked:false,comments:[]},
  {id:2,contactId:3,text:'New post on Product-Led Growth!',time:'4h ago',likes:11,liked:false,comments:[]},
];
