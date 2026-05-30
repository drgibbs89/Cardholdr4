import { CARD_COLORS, CONTACTS, SAMPLE_LEADS, THREADS, FEED_DEMO_POSTS, NOTIFS } from '../constants/cardData';
import { getDefaultPrivacy } from '../lib/safety';
import { lsGet } from './localStorage';

export function normalizeUsername(raw){
  if(raw==null)return '';
  let u=String(raw).trim().replace(/^@+/,'').toLowerCase().replace(/[^a-z0-9_.-]/g,'');
  return u.slice(0,32);
}

export function contactRowToApp(row){
  let data=row.contact_data;
  if(!data||typeof data!=='object')data={};
  return Object.assign({},data,{id:data.id!=null?data.id:row.id});
}

export function contactAppToRow(ownerId,contact){
  let id=contact.id!=null?contact.id:Date.now();
  let payload=Object.assign({},contact,{id:id});
  return{owner_id:ownerId,id:id,contact_data:payload,updated_at:new Date().toISOString()};
}

function getSeedContactById(id){
  for(let i=0;i<CONTACTS.length;i++){if(CONTACTS[i].id===id)return CONTACTS[i];}
  for(let j=0;j<SAMPLE_LEADS.length;j++){if(SAMPLE_LEADS[j].id===id)return SAMPLE_LEADS[j];}
  return null;
}

export function enrichContactWithSeedFields(c){
  if(!c||c.id==null)return c;
  let seed=getSeedContactById(c.id);
  if(!seed)return c;
  return Object.assign({},seed,c,{isSeed:c.isSeed!==undefined?c.isSeed:true,username:c.username||seed.username});
}

export function mergeContactsWithSeed(loaded){
  loaded=loaded||[];
  let out=[];
  let have=new Set();
  loaded.forEach(function(c){
    if(!c||c.id==null||have.has(c.id))return;
    have.add(c.id);
    out.push(enrichContactWithSeedFields(c));
  });
  let saved=lsGet('contacts',null);
  if(Array.isArray(saved)){
    saved.forEach(function(c){
      if(!c||c.isSeed||c.id==null||have.has(c.id))return;
      have.add(c.id);
      out.push(enrichContactWithSeedFields(c));
    });
  }
  if(!lsGet('showSeedData',true))return out;
  CONTACTS.concat(SAMPLE_LEADS).forEach(function(d){
    if(!have.has(d.id))out.push(Object.assign({},d,{isSeed:true}));
  });
  return out;
}

export function messageRowToApp(row,userId){
  let data=row.message_data;
  if(!data||typeof data!=='object')data={};
  let from=data.from;
  if(!from)from=row.sender_id&&row.sender_id===userId?'me':'them';
  let createdAt=row.created_at?new Date(row.created_at).getTime():0;
  return Object.assign({},data,{id:data.id!=null?data.id:row.id,from:from,createdAt:createdAt});
}

export function messageAppToRow(conversationId,userId,msg){
  let id=msg.id!=null?msg.id:Date.now();
  let fromMe=msg.from==='me';
  let payload=Object.assign({},msg,{id:id});
  return{conversation_id:conversationId,id:id,sender_id:fromMe?userId:null,message_data:payload,created_at:new Date().toISOString()};
}

function mergeThreadMaps(remote,local){
  remote=remote||{};
  local=local||{};
  let out=Object.assign({},remote);
  Object.keys(local).forEach(function(key){
    let remoteList=(out[key]||[]).slice();
    let localList=local[key];
    if(!Array.isArray(localList)||!localList.length)return;
    if(!remoteList.length){
      out[key]=localList.map(function(m){return Object.assign({},m);});
      return;
    }
    let seen=new Set();
    remoteList.forEach(function(m){if(m&&m.id!=null)seen.add(m.id);});
    localList.forEach(function(m){
      if(m&&m.id!=null&&!seen.has(m.id)){remoteList.push(Object.assign({},m));seen.add(m.id);}
    });
    remoteList.sort(function(a,b){return(a.createdAt||0)-(b.createdAt||0);});
    out[key]=remoteList;
  });
  return out;
}

export function mergeThreadsWithSeed(loaded){
  let local=lsGet('threads',null);
  let out=mergeThreadMaps(loaded||{},local&&typeof local==='object'?local:{});
  if(!lsGet('showSeedData',true))return out;
  Object.keys(THREADS).forEach(function(k){
    let id=Number(k);
    if(!out[id]||!out[id].length)out[id]=THREADS[k].map(function(m){return Object.assign({},m);});
  });
  return out;
}

export function formatFeedTime(iso){
  if(!iso)return 'Just now';
  let d=new Date(iso);
  if(isNaN(d.getTime()))return 'Just now';
  let diff=Date.now()-d.getTime();
  if(diff<60000)return 'Just now';
  if(diff<3600000)return Math.floor(diff/60000)+'m ago';
  if(diff<86400000)return Math.floor(diff/3600000)+'h ago';
  if(diff<604800000)return Math.floor(diff/86400000)+'d ago';
  return d.toLocaleDateString();
}

function feedPostKey(id){
  if(id==null)return '';
  return String(id);
}

function commentRowToApp(row,userId,profileByUserId){
  if(!row)return null;
  let isOwn=row.user_id===userId;
  let prof=profileByUserId&&row.user_id?profileByUserId[row.user_id]:null;
  let authorName=isOwn?'You':((prof&&prof.full_name)||'Member');
  return{id:row.id,isOwn:isOwn,text:row.body||'',time:formatFeedTime(row.created_at),authorName:authorName};
}

function resolvePostContactId(row,userId,contacts){
  if(!row||row.user_id===userId)return null;
  if(row.contact_id!=null){
    let cid=row.contact_id;
    let match=(contacts||[]).find(function(c){return c.id===cid||c.id===Number(cid);});
    if(match)return match.id;
  }
  let byUser=(contacts||[]).find(function(c){return c.contactUserId===row.user_id||c.contact_user_id===row.user_id;});
  if(byUser)return byUser.id;
  return 'author-'+row.user_id;
}

export function mapSupabasePostToUiPost(row,userId,likeMeta,commentsByPost,contacts){
  if(!row)return null;
  let pk=feedPostKey(row.id);
  let meta=likeMeta&&likeMeta[pk]?likeMeta[pk]:{count:0,liked:false};
  let comments=(commentsByPost&&commentsByPost[pk])||[];
  let isOwn=row.user_id===userId;
  return{
    id:row.id,
    contactId:resolvePostContactId(row,userId,contacts),
    authorUserId:row.user_id,
    isOwn:isOwn,
    text:row.body||'',
    time:formatFeedTime(row.created_at),
    likes:meta.count,
    liked:meta.liked,
    comments:comments,
  };
}

function buildLikeMeta(likeRows,userId){
  let meta={};
  (likeRows||[]).forEach(function(row){
    if(!row||row.post_id==null)return;
    let pk=feedPostKey(row.post_id);
    if(!meta[pk])meta[pk]={count:0,liked:false};
    meta[pk].count+=1;
    if(row.user_id===userId)meta[pk].liked=true;
  });
  return meta;
}

function buildCommentsByPost(commentRows,userId,profileByUserId){
  let byPost={};
  (commentRows||[]).forEach(function(row){
    let c=commentRowToApp(row,userId,profileByUserId);
    if(!c||row.post_id==null)return;
    let pk=feedPostKey(row.post_id);
    if(!byPost[pk])byPost[pk]=[];
    byPost[pk].push(c);
  });
  return byPost;
}

export function mapSupabasePostsToUiPosts(postRows,likeRows,commentRows,userId,contacts,profileByUserId){
  let likeMeta=buildLikeMeta(likeRows,userId);
  let commentsByPost=buildCommentsByPost(commentRows,userId,profileByUserId);
  return(postRows||[]).map(function(row){return mapSupabasePostToUiPost(row,userId,likeMeta,commentsByPost,contacts||[]);}).filter(Boolean);
}

export function mergePostsWithDemo(loaded,contacts){
  loaded=loaded||[];
  let out=[];
  let seen=new Set();
  loaded.forEach(function(p){
    if(!p||p.id==null||seen.has(p.id))return;
    seen.add(p.id);
    out.push(p);
  });
  let local=lsGet('posts',null);
  if(Array.isArray(local)){
    local.forEach(function(p){
      if(!p||p.id==null||seen.has(p.id))return;
      if(p.id===1||p.id===2)return;
      seen.add(p.id);
      out.push(p);
    });
  }
  if(!out.length){
    let demo=FEED_DEMO_POSTS.map(function(p){return Object.assign({},p);});
    if(contacts&&contacts.length){
      return demo.filter(function(p){
        if(p.contactId==null)return true;
        return contacts.some(function(c){return c.id===p.contactId;});
      });
    }
    return demo;
  }
  return out;
}

export function buildFeedDisplayContacts(contacts,posts,profileByUserId){
  let out=(contacts||[]).slice();
  let have=new Set(out.map(function(c){return c.id;}));
  (posts||[]).forEach(function(post){
    if(post.isOwn||post.contactId==null||have.has(post.contactId))return;
    let uid=post.authorUserId;
    let prof=uid&&profileByUserId?profileByUserId[uid]:null;
    let un=prof&&prof.username?normalizeUsername(prof.username):'';
    out.push({
      id:post.contactId,
      name:(prof&&prof.full_name)||'CardHoldr User',
      title:'',
      company:un?'@'+un:'',
      color:CARD_COLORS[0],
      avatarUrl:prof&&prof.avatar_url?prof.avatar_url:null,
    });
    have.add(post.contactId);
  });
  return out;
}

export function mapSupabaseNotificationToUiNotification(row){
  if(!row)return null;
  return{
    id:row.id,
    type:row.notification_type||row.type||'system',
    contactId:row.contact_id!=null?row.contact_id:null,
    text:row.body||'',
    time:formatFeedTime(row.created_at),
    read:!!row.read,
  };
}

export function mergeNotificationsWithDemo(loaded){
  loaded=loaded||[];
  let out=[];
  let seen=new Set();
  loaded.forEach(function(n){
    if(!n||n.id==null||seen.has(n.id))return;
    seen.add(n.id);
    out.push(n);
  });
  let local=lsGet('notifs',null);
  if(Array.isArray(local)){
    local.forEach(function(n){
      if(!n||n.id==null||seen.has(n.id))return;
      if(n.id===1||n.id===2||n.id===3)return;
      seen.add(n.id);
      out.push(n);
    });
  }
  if(!out.length)return NOTIFS.map(function(n){return Object.assign({},n);});
  return out;
}

export function snapshotPublicCard(c){
  return{id:c.id,name:c.name,title:c.title,company:c.company,email:c.email,phone:c.phone,website:c.website,username:c.username,instagram:c.instagram,twitter:c.twitter,linkedin:c.linkedin,github:c.github,portfolio:c.portfolio,resume:c.resume,hiring:c.hiring,color:c.color,cardType:c.cardType||'professional',cardStyle:c.cardStyle,privacy:c.privacy||getDefaultPrivacy(c.cardType),stackHidden:false};
}
