// @ts-nocheck
// === IMPORTS & CORE CONFIGURATIONS ===
import React from 'react';
import { Camera, Home, MessageCircle, Users, ArrowLeft, ChevronLeft, ChevronRight, Zap, X, Send, Download, BarChart2, Edit3, Bell, Share2, Crown, User, Search, Heart, MessageSquare, Layers, Plus, Mail } from 'lucide-react';
import { BackButton, SocialLinks, ProBadges, LeadBadge, Avatar, PrivacyBadge, StackVisibilityToggle } from './components/ui';
import { AddLeadModal, AddContactModal, ShareCardModal } from './components/modals';
import { ProfileScreen, AnalyticsScreen, NotificationsScreen, AIScanReview, ChatView, TeamPostCard, PostCard, TeamVuePinGate, TeamVueDashboard, PublicProfilePage, WaitlistPage, CardStackScreen } from './components/screens';
import { Card3D } from './components/cards/Card3D';
import { safeUrl, safeName, safeText, safeEmail, safePhone, formatPhone, cleanObj, getDefaultPrivacy, sanitizeUsernameInput, profilePublicUrl } from './lib/safety';
import { CARD_COLORS, REACTIONS, LEAD_STATUSES, LEAD_STATUS_COLORS, PRO_BADGE_DEFS, CONTACTS, SAMPLE_LEADS, THREADS, NOTIFS, TEAM_POSTS, FEED_DEMO_POSTS } from './constants/cardData';
import { lsGet, lsSet, lsDel } from './services/localStorage';
import { normalizeUsername, snapshotPublicCard, contactRowToApp, contactAppToRow, messageRowToApp, messageAppToRow, enrichContactWithSeedFields, mergeContactsWithSeed, mergeThreadsWithSeed, formatFeedTime, mapSupabasePostsToUiPosts, mergePostsWithDemo, buildFeedDisplayContacts, mapSupabaseNotificationToUiNotification, mergeNotificationsWithDemo } from './services/dataMappers';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'your-fallback-url';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-fallback-key';
const SUPABASE_FALLBACK_URL = 'your-fallback-url';
const SUPABASE_FALLBACK_KEY = 'your-fallback-key';

// === GLOBAL CONSTANTS & SEED DATA ===

// === DATABASE & NETWORK UTILITIES ===
const rand=arr=>arr[Math.floor(Math.random()*arr.length)];
const timeStr=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
async function supaFetch(path,opts){
  opts=opts||{};
  let token=lsGet('sb_access_token',null);
  let headers=Object.assign({'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+(token||SUPABASE_ANON_KEY)},opts.headers||{});
  try{
    let res=await fetch(SUPABASE_URL+path,Object.assign({},opts,{headers}));
    if(!res.ok){
      let bodyText='';
      try{bodyText=await res.clone().text();}catch(e){}
      let snippet=bodyText?bodyText.replace(/\s+/g,' ').trim().slice(0,500):'';
      console.warn('[CardHoldr/supabase] request failed',path,'HTTP',res.status,snippet||'(empty body)');
      return null;
    }
    let ct=res.headers.get('content-type')||'';
    if(ct.includes('json'))return res.json();
    return null;
  }catch(err){
    console.warn('[CardHoldr/supabase] fetch error',path,String(err&&err.message?err.message:err));
    return null;
  }
}
async function supaSignOut(){let token=lsGet('sb_access_token',null);if(token)await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+token}});lsDel('sb_access_token');lsDel('sb_user');}
// OAuth: set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY, enable Google/Facebook in Supabase,
// and add oauthRedirectUrl() to Authentication → URL Configuration → Redirect URLs.
function isSupabaseConfigured(){
  if(!SUPABASE_URL||!SUPABASE_ANON_KEY)return false;
  if(SUPABASE_URL===SUPABASE_FALLBACK_URL||SUPABASE_ANON_KEY===SUPABASE_FALLBACK_KEY)return false;
  if(String(SUPABASE_URL).includes('fallback')||String(SUPABASE_ANON_KEY).includes('fallback'))return false;
  return SUPABASE_URL.indexOf('http://')===0||SUPABASE_URL.indexOf('https://')===0;
}
function oauthRedirectUrl(){return window.location.origin+'/';}
function oauthB64Url(bytes){let bin='';for(let i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function oauthPkceVerifier(){let a=new Uint8Array(32);crypto.getRandomValues(a);return oauthB64Url(a);}
async function oauthPkceChallenge(verifier){let data=new TextEncoder().encode(verifier);let hash=await crypto.subtle.digest('SHA-256',data);return oauthB64Url(new Uint8Array(hash));}
async function supaOAuthUrl(provider){
  let redirect=oauthRedirectUrl();
  let base=SUPABASE_URL+'/auth/v1/authorize?provider='+encodeURIComponent(provider)+'&redirect_to='+encodeURIComponent(redirect);
  if(window.crypto&&window.crypto.subtle){
    try{
      let verifier=oauthPkceVerifier();
      try{sessionStorage.setItem('ch_oauth_pkce_verifier',verifier);}catch(e){}
      let challenge=await oauthPkceChallenge(verifier);
      return base+'&code_challenge='+challenge+'&code_challenge_method=s256';
    }catch(e){}
  }
  return base;
}
function startOAuthLogin(provider,setOauthStarting){
  if(!isSupabaseConfigured())return;
  if(setOauthStarting)setOauthStarting(true);
  supaOAuthUrl(provider).then(function(url){
    if(!url){if(setOauthStarting)setOauthStarting(false);return;}
    window.location.assign(url);
  }).catch(function(){if(setOauthStarting)setOauthStarting(false);});
}
async function exchangePkceCode(code){
  let verifier=null;
  try{verifier=sessionStorage.getItem('ch_oauth_pkce_verifier');sessionStorage.removeItem('ch_oauth_pkce_verifier');}catch(e){}
  if(!verifier)return null;
  let res=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=pkce',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY},body:JSON.stringify({auth_code:code,code_verifier:verifier})});
  if(!res.ok)return null;
  return res.json();
}
function parseOAuthCallback(){
  let hash=window.location.hash?window.location.hash.replace(/^#/,''):'';
  let search=window.location.search?window.location.search.replace(/^\?/,''):'';
  return{hashParams:hash?new URLSearchParams(hash):null,searchParams:search?new URLSearchParams(search):null};
}
async function completeOAuthSession(token,onUser){
  if(!token)return false;
  lsSet('sb_access_token',token);
  let res=await fetch(SUPABASE_URL+'/auth/v1/user',{headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+token}});
  if(!res.ok)return false;
  let user=await res.json();
  if(!user||!user.id)return false;
  lsSet('sb_user',user);
  if(onUser)await onUser(user);
  return true;
}
async function processOAuthReturn(onUser){
  let{hashParams,searchParams}=parseOAuthCallback();
  let err=(hashParams&&hashParams.get('error'))||(searchParams&&searchParams.get('error'));
  if(err)return{ok:false,error:err};
  let code=searchParams&&searchParams.get('code');
  if(code){
    let session=await exchangePkceCode(code);
    if(session&&session.access_token)return{ok:await completeOAuthSession(session.access_token,onUser)};
    return{ok:false};
  }
  let token=hashParams&&hashParams.get('access_token');
  if(token)return{ok:await completeOAuthSession(token,onUser)};
  return null;
}
function clearOAuthUrl(){
  window.history.replaceState(window.history.state||{screen:'home'},'',window.location.pathname||'/');
}
async function upsertProfile(userId,data){
  if(!canPersistToSupabase()||getSbUser().id!==userId)return null;
  return supaFetch('/rest/v1/profiles',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(Object.assign({id:userId},data))});
}
async function upsertCard(userId,slug,cardData,isPublic){
  if(!canPersistToSupabase()||getSbUser().id!==userId)return null;
  return supaFetch('/rest/v1/cards',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:userId,slug,card_data:cardData,is_public:isPublic!==false})});
}
async function loadCard(userId){let rows=await supaFetch('/rest/v1/cards?user_id=eq.'+userId+'&select=*&order=created_at.desc&limit=1');return rows&&rows[0]?rows[0]:null;}
/** True only when Supabase env is valid and a full session exists (access token + user id). Use before writes; reads may use isSupabaseConfigured alone. */
function canPersistToSupabase(){return isSupabaseConfigured()&&isLoggedIn();}
function getPublicStackFromContacts(contactList,stackPublic){
  if(stackPublic===false)return [];
  return (contactList||[]).filter(function(c){return c.cardType!=='lead'&&!c.stackHidden&&(c.privacy||getDefaultPrivacy(c.cardType))==='public';}).map(snapshotPublicCard);
}
function buildMyCardPayload(card,opts){
  opts=opts||{};
  let payload=Object.assign({},card||{});
  let un=opts.username!=null?normalizeUsername(opts.username):normalizeUsername(payload.username||'');
  if(un)payload.username=un;
  else delete payload.username;
  let photo=opts.avatarUrl||opts.photo||null;
  if(photo)payload.avatarUrl=photo;
  if(opts.publicStack!==undefined)payload.publicStack=opts.publicStack;
  if(payload.stackPublic===undefined)payload.stackPublic=payload.stackPublic!==false;
  return payload;
}
function cardRowToApp(row,profile){
  let card=row&&row.card_data?Object.assign({},row.card_data):{};
  if(profile){
    if(profile.username)card=withCardUsername(card,profile.username);
    if(profile.avatar_url)card.avatarUrl=profile.avatar_url;
    if(profile.full_name&&!card.name)card.name=profile.full_name;
  }
  if(card.stackPublic===undefined)card.stackPublic=card.stackPublic!==false;
  return card;
}
function nextContactId(contactList){
  let max=0;
  (contactList||[]).forEach(function(c){
    let id=Number(c.id);
    if(!isNaN(id)&&id>max&&id<1e12)max=id;
  });
  return max>=1000?max+1:Date.now();
}
function cardMatchesSearch(c,q){
  q=(q||'').toLowerCase().replace(/^@+/,'');
  if(!q)return true;
  return(c.name||'').toLowerCase().includes(q)||(c.company||'').toLowerCase().includes(q)||(c.title||'').toLowerCase().includes(q)||(c.leadInterest||'').toLowerCase().includes(q)||(c.username||'').toLowerCase().includes(q)||(c.instagram||'').toLowerCase().includes(q)||(c.twitter||'').toLowerCase().includes(q)||(c.linkedin||'').toLowerCase().includes(q);
}
function ilikePattern(query){return encodeURIComponent('%'+query+'%');}
function profileHitFromCardRow(row){
  if(!row||!row.user_id)return null;
  let data=row.card_data||{};
  let username=normalizeUsername(data.username||row.slug||'');
  if(!username)return null;
  return{id:row.user_id,username:username,full_name:data.name||'',avatar_url:data.avatarUrl||data.avatar_url||''};
}
async function searchCardholdrProfiles(query,limit){
  limit=limit||10;
  query=normalizeUsername(String(query||'').replace(/^@+/,''));
  if(!query||query.length<2)return [];
  if(!isSupabaseConfigured())return [];
  let pat=ilikePattern(query);
  let exact=normalizeUsername(query);
  let out=[];
  let seen=new Set();
  function addProfile(p){
    if(!p||!p.id||seen.has(p.id))return;
    let u=normalizeUsername(p.username);
    if(!u)return;
    seen.add(p.id);
    out.push({id:p.id,username:u,full_name:p.full_name||'',avatar_url:p.avatar_url||''});
  }
  if(exact){
    let exactRow=await findProfileByUsername(exact);
    if(exactRow)addProfile(exactRow);
  }
  let profileRows=await supaFetch('/rest/v1/profiles?or=(username.ilike.'+pat+',full_name.ilike.'+pat+')&select=id,username,avatar_url,full_name&order=username.asc&limit='+limit);
  if(profileRows&&Array.isArray(profileRows))profileRows.forEach(addProfile);
  let cardOr='card_data->>username.ilike.'+pat+',card_data->>instagram.ilike.'+pat+',card_data->>twitter.ilike.'+pat+',card_data->>linkedin.ilike.'+pat;
  let cardRows=await supaFetch('/rest/v1/cards?or=('+cardOr+')&select=user_id,card_data,slug&order=updated_at.desc&limit='+limit);
  if(cardRows&&Array.isArray(cardRows))cardRows.forEach(function(row){addProfile(profileHitFromCardRow(row));});
  out.sort(function(a,b){
    let au=(a.username||'').toLowerCase();
    let bu=(b.username||'').toLowerCase();
    if(au===query&&bu!==query)return -1;
    if(bu===query&&au!==query)return 1;
    return au.localeCompare(bu);
  });
  return out.slice(0,limit);
}
function withCardUsername(card,username){username=normalizeUsername(username);if(!username||!card)return card;return Object.assign({},card,{username:username});}
async function loadProfile(userId){let rows=await supaFetch('/rest/v1/profiles?id=eq.'+encodeURIComponent(userId)+'&select=id,username,avatar_url,full_name&limit=1');return rows&&rows[0]?rows[0]:null;}
async function findProfileByUsername(username){username=normalizeUsername(username);if(!username)return null;let rows=await supaFetch('/rest/v1/profiles?username=eq.'+encodeURIComponent(username)+'&select=id,username,avatar_url,full_name&limit=1');return rows&&rows[0]?rows[0]:null;}
async function searchProfilesByUsername(query,limit){return searchCardholdrProfiles(query,limit);}
async function isUsernameTaken(username,excludeUserId){let row=await findProfileByUsername(username);return !!(row&&row.id!==excludeUserId);}
async function uploadAvatar(userId,file){
  if(!userId||!file||!canPersistToSupabase()||getSbUser().id!==userId)return null;
  let ext='jpg';
  if(file.name){let p=file.name.split('.').pop();if(p)ext=p.toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';}
  let path=userId+'/avatar-'+Date.now()+'.'+ext;
  let storagePath='/storage/v1/object/avatars/'+path;
  let token=lsGet('sb_access_token',null);
  try{
    let res=await fetch(SUPABASE_URL+storagePath,{method:'POST',headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+(token||SUPABASE_ANON_KEY),'Content-Type':file.type||'image/jpeg','x-upsert':'true'},body:file});
    if(!res.ok){
      let bodyText='';
      try{bodyText=await res.clone().text();}catch(e){}
      let snippet=bodyText?bodyText.replace(/\s+/g,' ').trim().slice(0,500):'';
      console.warn('[CardHoldr/supabase] storage upload failed',storagePath,'HTTP',res.status,snippet||'(empty body)');
      return null;
    }
    return SUPABASE_URL+'/storage/v1/object/public/avatars/'+path;
  }catch(err){
    console.warn('[CardHoldr/supabase] storage fetch error',storagePath,String(err&&err.message?err.message:err));
    return null;
  }
}
async function loadPublicCardForUser(userId,profile){let row=await loadCard(userId);let card=row&&row.card_data?Object.assign({},row.card_data):{name:(profile&&profile.full_name)||'CardHoldr User'};if(profile&&profile.avatar_url)card.avatarUrl=profile.avatar_url;if(profile&&profile.username)card.username=profile.username;return card;}
function getSbUser(){return lsGet('sb_user',null);}
function isLoggedIn(){return !!(lsGet('sb_access_token',null)&&getSbUser()&&getSbUser().id);}
async function loadContacts(userId){
  let rows=await supaFetch('/rest/v1/contacts?owner_id=eq.'+encodeURIComponent(userId)+'&select=*&order=updated_at.desc');
  if(!rows||!Array.isArray(rows))return null;
  return rows.map(contactRowToApp);
}
async function upsertContact(ownerId,contact){
  if(!ownerId||!contact||!canPersistToSupabase()||getSbUser().id!==ownerId)return null;
  return supaFetch('/rest/v1/contacts',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(contactAppToRow(ownerId,contact))});
}
async function deleteContact(ownerId,contactId){
  if(!ownerId||contactId==null||!canPersistToSupabase()||getSbUser().id!==ownerId)return null;
  return supaFetch('/rest/v1/contacts?owner_id=eq.'+encodeURIComponent(ownerId)+'&id=eq.'+encodeURIComponent(contactId),{method:'DELETE',headers:{'Prefer':'return=minimal'}});
}
function persistContact(contact){
  if(!contact||contact.isSeed)return;
  if(canPersistToSupabase())upsertContact(getSbUser().id,contact);
}
function removeContactPersisted(contactId){
  if(contactId==null||!canPersistToSupabase())return;
  deleteContact(getSbUser().id,contactId);
}
function contactCanUseSupabaseMessaging(contact){
  if(!canPersistToSupabase())return false;
  if(!contact||contact.id==null||contact.isSeed)return false;
  if(contact.contactUserId||contact.contact_user_id)return true;
  let source=contact.source||'';
  if(source==='scanned'||source==='manual'||source==='exchange')return true;
  return false;
}
async function loadConversations(userId){
  if(!userId||!isSupabaseConfigured())return null;
  let rows=await supaFetch('/rest/v1/conversation_members?user_id=eq.'+encodeURIComponent(userId)+'&select=conversation_id,contact_id,last_read_at');
  if(!rows||!Array.isArray(rows))return null;
  return rows;
}
async function loadMessages(conversationId,userId){
  if(!conversationId||!isSupabaseConfigured())return null;
  let rows=await supaFetch('/rest/v1/messages?conversation_id=eq.'+encodeURIComponent(conversationId)+'&select=*&order=created_at.asc');
  if(!rows||!Array.isArray(rows))return null;
  return rows.map(function(row){return messageRowToApp(row,userId);});
}
async function ensureConversation(userId,contactId){
  if(!userId||contactId==null||!canPersistToSupabase()||getSbUser().id!==userId)return null;
  let existing=await supaFetch('/rest/v1/conversation_members?user_id=eq.'+encodeURIComponent(userId)+'&contact_id=eq.'+encodeURIComponent(contactId)+'&select=conversation_id&limit=1');
  if(existing&&existing[0]&&existing[0].conversation_id)return existing[0].conversation_id;
  let created=await supaFetch('/rest/v1/conversations',{method:'POST',headers:{'Prefer':'return=representation'},body:JSON.stringify({updated_at:new Date().toISOString()})});
  let convId=created&&(created[0]?created[0].id:created.id);
  if(!convId)return null;
  await supaFetch('/rest/v1/conversation_members',{method:'POST',headers:{'Prefer':'return=minimal'},body:JSON.stringify({conversation_id:convId,user_id:userId,contact_id:contactId})});
  return convId;
}
async function findOrCreateConversationForContact(contact){
  let user=getSbUser();
  if(!user||!user.id||!contactCanUseSupabaseMessaging(contact))return null;
  return ensureConversation(user.id,contact.id);
}
async function insertMessage(conversationId,userId,msg){
  if(!conversationId||!msg||!canPersistToSupabase()||getSbUser().id!==userId)return null;
  return supaFetch('/rest/v1/messages',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(messageAppToRow(conversationId,userId,msg))});
}
async function sendSupabaseMessage(conversationId,text){
  let user=getSbUser();
  if(!user||!user.id||!conversationId||!text||!canPersistToSupabase())return null;
  let msg={id:Date.now(),from:'me',text:String(text).trim(),time:timeStr(),date:'Today',createdAt:Date.now()};
  return insertMessage(conversationId,user.id,msg);
}
async function markConversationRead(conversationId){
  let user=getSbUser();
  if(!user||!user.id||!conversationId||!canPersistToSupabase())return null;
  return supaFetch('/rest/v1/conversation_members?conversation_id=eq.'+encodeURIComponent(conversationId)+'&user_id=eq.'+encodeURIComponent(user.id),{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({last_read_at:new Date().toISOString()})});
}
async function loadThreadsForUser(userId){
  if(!userId||!isSupabaseConfigured())return null;
  let members=await loadConversations(userId);
  if(!members)return null;
  let convByContact={};
  let threadReadAt={};
  let threads={};
  await Promise.all(members.map(function(m){
    if(m.contact_id==null||!m.conversation_id)return Promise.resolve();
    convByContact[m.contact_id]=m.conversation_id;
    threadReadAt[m.contact_id]=m.last_read_at?new Date(m.last_read_at).getTime():0;
    return loadMessages(m.conversation_id,userId).then(function(msgs){
      if(msgs&&msgs.length)threads[m.contact_id]=msgs;
    });
  }));
  return{threads:threads,threadReadAt:threadReadAt,convByContact:convByContact};
}

async function loadProfilesByIds(userIds){
  let map={};
  if(!userIds||!userIds.length||!isSupabaseConfigured())return map;
  let ids=userIds.filter(Boolean);
  if(!ids.length)return map;
  let rows=await supaFetch('/rest/v1/profiles?id=in.('+ids.map(encodeURIComponent).join(',')+')&select=id,username,avatar_url,full_name');
  if(rows&&Array.isArray(rows))rows.forEach(function(p){if(p&&p.id)map[p.id]=p;});
  return map;
}
async function loadFeedPosts(userId,contacts){
  if(!userId||!isSupabaseConfigured())return null;
  let postRows=await supaFetch('/rest/v1/posts?select=*&order=created_at.desc&limit=100');
  if(!postRows||!Array.isArray(postRows))return null;
  if(!postRows.length)return{posts:[],profileByUserId:{}};
  let postIds=postRows.map(function(p){return p.id;}).filter(function(id){return id!=null;});
  let likesPromise=postIds.length?supaFetch('/rest/v1/post_likes?post_id=in.('+postIds.join(',')+')&select=post_id,user_id'):Promise.resolve([]);
  let commentsPromise=postIds.length?supaFetch('/rest/v1/post_comments?post_id=in.('+postIds.join(',')+')&select=*&order=created_at.asc'):Promise.resolve([]);
  let likeRows=await likesPromise;
  let commentRows=await commentsPromise;
  if(likeRows===null||commentRows===null)return null;
  let userIdSet=new Set();
  postRows.forEach(function(p){if(p.user_id)userIdSet.add(p.user_id);});
  (commentRows||[]).forEach(function(c){if(c.user_id)userIdSet.add(c.user_id);});
  let profileByUserId=await loadProfilesByIds(Array.from(userIdSet));
  let posts=mapSupabasePostsToUiPosts(postRows,likeRows,commentRows,userId,contacts||[],profileByUserId);
  return{posts:posts,profileByUserId:profileByUserId};
}
async function createFeedPost(text,postId){
  let user=getSbUser();
  if(!user||!user.id||!text||!canPersistToSupabase())return null;
  let id=postId!=null?postId:Date.now();
  return supaFetch('/rest/v1/posts',{method:'POST',headers:{'Prefer':'return=minimal'},body:JSON.stringify({id:id,user_id:user.id,body:String(text).trim()})});
}
async function deleteFeedPost(postId){
  let user=getSbUser();
  if(!user||!user.id||postId==null||!canPersistToSupabase())return null;
  return supaFetch('/rest/v1/posts?id=eq.'+encodeURIComponent(postId)+'&user_id=eq.'+encodeURIComponent(user.id),{method:'DELETE',headers:{'Prefer':'return=minimal'}});
}
async function togglePostLike(postId,currentlyLiked){
  let user=getSbUser();
  if(!user||!user.id||postId==null||!canPersistToSupabase())return null;
  if(currentlyLiked){
    return supaFetch('/rest/v1/post_likes?post_id=eq.'+encodeURIComponent(postId)+'&user_id=eq.'+encodeURIComponent(user.id),{method:'DELETE',headers:{'Prefer':'return=minimal'}});
  }
  return supaFetch('/rest/v1/post_likes',{method:'POST',headers:{'Prefer':'return=minimal'},body:JSON.stringify({post_id:postId,user_id:user.id})});
}
async function createPostComment(postId,text,commentId){
  let user=getSbUser();
  if(!user||!user.id||!postId||!text||!canPersistToSupabase())return null;
  let id=commentId!=null?commentId:Date.now();
  return supaFetch('/rest/v1/post_comments',{method:'POST',headers:{'Prefer':'return=minimal'},body:JSON.stringify({id:id,post_id:postId,user_id:user.id,body:String(text).trim()})});
}
async function loadNotifications(userId){
  if(!userId||!isSupabaseConfigured())return null;
  let rows=await supaFetch('/rest/v1/notifications?user_id=eq.'+encodeURIComponent(userId)+'&select=*&order=created_at.desc&limit=50');
  if(!rows||!Array.isArray(rows))return null;
  return rows.map(mapSupabaseNotificationToUiNotification).filter(Boolean);
}
async function createNotification(userId,type,payload,actorId){
  void actorId;
  if(!userId||!type||!payload||!canPersistToSupabase())return null;
  let body=payload.text||payload.body||'';
  if(!body)return null;
  let row={
    user_id:userId,
    notification_type:type,
    contact_id:payload.contactId!=null?payload.contactId:null,
    body:body,
    read:false,
  };
  return supaFetch('/rest/v1/notifications',{method:'POST',headers:{'Prefer':'return=representation'},body:JSON.stringify(row)});
}
async function markNotificationRead(notificationId){
  let user=getSbUser();
  if(!user||!user.id||notificationId==null||!canPersistToSupabase())return null;
  return supaFetch('/rest/v1/notifications?id=eq.'+encodeURIComponent(notificationId)+'&user_id=eq.'+encodeURIComponent(user.id),{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({read:true})});
}
async function markAllNotificationsRead(){
  let user=getSbUser();
  if(!user||!user.id||!canPersistToSupabase())return null;
  return supaFetch('/rest/v1/notifications?user_id=eq.'+encodeURIComponent(user.id)+'&read=eq.false',{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({read:true})});
}
async function fetchPostOwnerId(postId){
  if(postId==null||!canPersistToSupabase())return null;
  let rows=await supaFetch('/rest/v1/posts?id=eq.'+encodeURIComponent(postId)+'&select=user_id&limit=1');
  return rows&&rows[0]?rows[0].user_id:null;
}
function contactIdForActor(actorUserId,contactList){
  if(!actorUserId||!contactList)return null;
  let match=contactList.find(function(c){return c.contactUserId===actorUserId||c.contact_user_id===actorUserId;});
  return match?match.id:null;
}
// === UI SUB-COMPONENTS & MODALS ===

function CardSearchDropdown({query,results,onSelect,visible}){
  let q=(query||'').trim();
  if(!visible||!q)return null;
  let list=results||[];
  return(
    <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,zIndex:60,background:'rgba(20,18,50,0.98)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',maxHeight:'min(280px,50vh)',overflowY:'auto'}}>
      {list.length===0?(
        <div style={{padding:'12px 14px',fontSize:'13px',color:'rgba(255,255,255,0.35)'}}>No cards match &ldquo;{q}&rdquo;</div>
      ):(
        list.map(function(c,i){
          let sub=c.cardType==='lead'?(c.leadStatus||'Lead'):((c.title||'')+(c.title&&c.company?' · ':'')+(c.company||''));
          let un=normalizeUsername(c.username);
          return(
            <button key={'search-'+(c.cardType||'card')+'-'+String(c.id)+'-'+(normalizeUsername(c.username)||i)} type="button" onClick={function(){onSelect(c);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'none',border:'none',borderBottom:i<list.length-1?'1px solid rgba(255,255,255,0.06)':'none',color:'white',cursor:'pointer',textAlign:'left',fontFamily:'inherit'}}>
              <Avatar contact={c} size={36}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name||'Unnamed'}</div>
                {sub&&<div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sub}</div>}
                {un&&<div style={{fontSize:'10px',color:'rgba(167,139,250,0.9)',marginTop:'1px'}}>@{un}</div>}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}


// --- Main App ---

export default function CardHoldr(){

  // --- 1. ALL useState ---
  let [showTvPin,setShowTvPin]=React.useState(false);
  let [showTeamVue,setShowTeamVue]=React.useState(false);
  let [screen,setScreen]=React.useState(function(){
    let{hashParams,searchParams}=parseOAuthCallback();
    if((hashParams&&hashParams.get('access_token'))||(searchParams&&searchParams.get('code')))return 'login';
    let s=lsGet('myCard',null);
    if(lsGet('sb_access_token',null)&&lsGet('sb_user',null))return s&&s.name?'home':'profile';
    return(s&&s.name)?'home':'waitlist';
  });
  let [oauthBusy,setOauthBusy]=React.useState(false);
  let [oauthStarting,setOauthStarting]=React.useState(false);
  let [publicProfileCard,setPublicProfileCard]=React.useState(null);
  let [profileType,setProfileType]=React.useState('professional');
  let [myPhoto,setMyPhoto]=React.useState(function(){return lsGet('myPhoto',null);});
  let [myUsername,setMyUsername]=React.useState(function(){return lsGet('myUsername','')||'';});
  let [signupUsername,setSignupUsername]=React.useState(function(){return lsGet('myUsername','')||'';});
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
    let merged=Object.assign({},defaults,saved);
    let un=lsGet('myUsername','');
    if(un&&!merged.username)merged=withCardUsername(merged,un);
    return merged;
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
  let [exchangeStackHidden,setExchangeStackHidden]=React.useState(false);
  let [contacts,setContacts]=React.useState(function(){
    let saved=lsGet('contacts',null);
    let loggedIn=!!(lsGet('sb_access_token',null)&&lsGet('sb_user',null));
    if(loggedIn&&isSupabaseConfigured())return [];
    if(saved&&saved.length)return mergeContactsWithSeed(saved.filter(function(c){return c&&!c.isSeed;}));
    return mergeContactsWithSeed([]);
  });
  function patchContacts(updater){
    setContacts(function(prev){
      let next=typeof updater==='function'?updater(prev):updater;
      lsSet('contacts',next);
      return next;
    });
  }
  function toggleContactStackHidden(id){
    setContacts(function(prev){
      let next=prev.map(function(x){return x.id===id?Object.assign({},x,{stackHidden:!x.stackHidden}):x;});
      let updated=next.find(function(x){return x.id===id;});
      if(updated)persistContact(updated);
      lsSet('contacts',next);
      return next;
    });
  }
  function applyHydratedUserData(cardRow,contactRows,profileRow,threadData,feedData,notifData){
    if(contactRows!==null)setContacts(mergeContactsWithSeed(contactRows));
    if(notifData!==null){
      let mergedNotifs=mergeNotificationsWithDemo(notifData);
      setNotifs(mergedNotifs);
      lsSet('notifs',mergedNotifs);
    }
    if(feedData!==null){
      let merged=mergePostsWithDemo(feedData.posts,contactRows!==null?mergeContactsWithSeed(contactRows):contacts);
      setPosts(merged);
      lsSet('posts',merged);
      setFeedProfileMap(feedData.profileByUserId||{});
    }
    if(threadData!==null){
      let merged=mergeThreadsWithSeed(threadData.threads);
      setThreads(merged);
      lsSet('threads',merged);
      setThreadReadAt(Object.assign({},threadData.threadReadAt||{}));
      convByContactRef.current=threadData.convByContact||{};
    }else if(isSupabaseConfigured()){
      let merged=mergeThreadsWithSeed({});
      setThreads(merged);
      lsSet('threads',merged);
    }
    if(profileRow){
      if(profileRow.username){setMyUsername(profileRow.username);lsSet('myUsername',profileRow.username);}
      if(profileRow.avatar_url){setMyPhoto(profileRow.avatar_url);lsSet('myPhoto',profileRow.avatar_url);}
    }
    if(cardRow&&cardRow.card_data){
      let card=cardRowToApp(cardRow,profileRow);
      setMyCard(card);
      lsSet('myCard',card);
      return true;
    }
    return false;
  }
  function hydrateUserData(userId){
    return Promise.all([loadCard(userId),loadContacts(userId),loadProfile(userId),loadThreadsForUser(userId)]).then(function(results){
      let contactRows=results[1];
      let contactList=contactRows!==null?mergeContactsWithSeed(contactRows):[];
      return Promise.all([loadFeedPosts(userId,contactList),loadNotifications(userId)]).then(function(extra){
        return{cardRow:results[0],contactRows:contactRows,profileRow:results[2],threadData:results[3],feedData:extra[0],notifData:extra[1]};
      });
    });
  }
  function hydrateContactsForUser(userId){
    if(!isSupabaseConfigured())return Promise.resolve();
    return loadContacts(userId).then(function(rows){
      if(rows===null)return;
      setContacts(mergeContactsWithSeed(rows));
      lsSet('contacts',mergeContactsWithSeed(rows));
    });
  }
  function syncMyCardToSupabase(card,username,photo,contactList){
    let user=getSbUser();
    if(!user||!user.id||!canPersistToSupabase()||!card)return;
    let un=normalizeUsername(username||card.username||'');
    let slug=un||('user-'+user.id.slice(0,8));
    let publicStack=getPublicStackFromContacts(contactList,card.stackPublic!==false);
    let payload=buildMyCardPayload(card,{username:un||undefined,avatarUrl:photo||card.avatarUrl||null,publicStack:publicStack});
    upsertCard(user.id,slug,payload,card.privacy==='public');
    let profilePayload={full_name:card.name||'',updated_at:new Date().toISOString()};
    if(un)profilePayload.username=un;
    if(photo||card.avatarUrl)profilePayload.avatar_url=photo||card.avatarUrl;
    upsertProfile(user.id,profilePayload);
  }
  function patchThreads(updater){
    setThreads(function(prev){
      let next=typeof updater==='function'?updater(prev):updater;
      lsSet('threads',next);
      return next;
    });
  }
  function persistMessageForContact(contactId,msg){
    if(contactId==null||!msg)return;
    let contact=contacts.find(function(c){return c.id===contactId;});
    if(!contactCanUseSupabaseMessaging(contact))return;
    findOrCreateConversationForContact(contact).then(function(convId){
      if(!convId)return;
      convByContactRef.current[contactId]=convId;
      let user=getSbUser();
      if(!user||!user.id)return;
      insertMessage(convId,user.id,msg);
    });
  }
  function hydrateThreadsForUser(userId){
    if(!isSupabaseConfigured())return Promise.resolve();
    return loadThreadsForUser(userId).then(function(result){
      if(result===null)return;
      let merged=mergeThreadsWithSeed(result.threads);
      setThreads(merged);
      lsSet('threads',merged);
      setThreadReadAt(result.threadReadAt||{});
      convByContactRef.current=result.convByContact||{};
    });
  }
  function isThreadUnread(contactId){
    let msgs=threads[contactId];
    if(!msgs||!msgs.length)return false;
    let last=msgs[msgs.length-1];
    if(last.from!=='them')return false;
    if(!isLoggedIn())return true;
    let readAt=threadReadAt[contactId]||0;
    let lastTs=last.createdAt||0;
    if(!lastTs)return true;
    return lastTs>readAt;
  }
  function openMessageThread(contactId){
    setActiveThread(contactId);
    let now=Date.now();
    setThreadReadAt(function(p){return Object.assign({},p,{[contactId]:now});});
    let contact=contacts.find(function(c){return c.id===contactId;});
    if(!contactCanUseSupabaseMessaging(contact))return;
    let convId=convByContactRef.current[contactId];
    if(convId){markConversationRead(convId);return;}
    findOrCreateConversationForContact(contact).then(function(cid){
      if(!cid)return;
      convByContactRef.current[contactId]=cid;
      markConversationRead(cid);
    });
  }
  let [notifs,setNotifs]=React.useState(function(){
    let saved=lsGet('notifs',null);
    if(saved&&Array.isArray(saved)&&saved.length)return saved;
    return NOTIFS.map(function(n){return Object.assign({},n);});
  });
  let [posts,setPosts]=React.useState(function(){return lsGet('posts',FEED_DEMO_POSTS.map(function(p){return Object.assign({},p);}));});
  let [feedProfileMap,setFeedProfileMap]=React.useState({});
  let [teamPosts,setTeamPosts]=React.useState(TEAM_POSTS);
  let [postDraft,setPostDraft]=React.useState('');
  let [searchQuery,setSearchQuery]=React.useState('');
  let [directorySearchResults,setDirectorySearchResults]=React.useState([]);
  let [searchFocused,setSearchFocused]=React.useState(false);
  let [carouselMode,setCarouselMode]=React.useState('contacts');
  let [cardIndex,setCardIndex]=React.useState(0);
  let [activeCard,setActiveCard]=React.useState(null);
  let [scanMode,setScanMode]=React.useState(null);
  let [capturedPhoto,setCapturedPhoto]=React.useState(null);
  let [cameraError,setCameraError]=React.useState(null);
  let [activeThread,setActiveThread]=React.useState(null);
  let [threads,setThreads]=React.useState(function(){
    if(lsGet('sb_access_token',null)&&lsGet('sb_user',null))return {};
    return lsGet('threads',THREADS);
  });
  let [threadReadAt,setThreadReadAt]=React.useState({});
  let convByContactRef=React.useRef({});
  let [draft,setDraft]=React.useState('');
  let [msgSearch,setMsgSearch]=React.useState('');
  let [showNewMsg,setShowNewMsg]=React.useState(false);
  let [newMsgSearch,setNewMsgSearch]=React.useState('');
  let [reactionTarget,setReactionTarget]=React.useState(null);
  let [reactions,setReactions]=React.useState({});
  let [isTyping,setIsTyping]=React.useState(false);
  let [tvTaps,setTvTaps]=React.useState(0);

  // --- 2. ALL useRef ---
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

  // --- 3. ALL useEffect ---
  React.useEffect(function(){
    let m=document.querySelector('meta[name="theme-color"]');
    if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}
    m.content='#0d0b1e';
  },[]);

  React.useEffect(function(){
    if(!import.meta||!import.meta.env||!import.meta.env.DEV)return;
    let hasSavedSession=!!(lsGet('sb_access_token',null)&&lsGet('sb_user',null)&&lsGet('sb_user',null).id);
    console.log('[CardHoldr] supabase configured:',isSupabaseConfigured(),'saved session:',hasSavedSession);
  },[]);

  React.useEffect(function(){
    let{hashParams,searchParams}=parseOAuthCallback();
    let code=searchParams&&searchParams.get('code');
    let token=hashParams&&hashParams.get('access_token');
    if(!code&&!token){
      let savedUser=lsGet('sb_user',null);let savedToken=lsGet('sb_access_token',null);
      if(savedUser&&savedToken&&isSupabaseConfigured()){
        hydrateUserData(savedUser.id).then(function(data){
          let hasCard=applyHydratedUserData(data.cardRow,data.contactRows,data.profileRow,data.threadData,data.feedData,data.notifData);
          if(!hasCard){
            let meta=savedUser.user_metadata||{};
            setMyCard(function(c){return Object.assign({},c,{name:meta.full_name||meta.name||c.name||'',email:savedUser.email||c.email||''});});
          }
        });
      }
      return;
    }
    let cancelled=false;
    setOauthBusy(true);
    function routeAfterUser(user){
      if(!isSupabaseConfigured()){
        if(cancelled)return;
        setScreen(lsGet('myCard',null)&&lsGet('myCard',null).name?'home':'profile');
        return Promise.resolve();
      }
      return hydrateUserData(user.id).then(function(data){
        if(cancelled)return;
        let hasCard=applyHydratedUserData(data.cardRow,data.contactRows,data.profileRow,data.threadData,data.feedData,data.notifData);
        if(hasCard){
          setScreen('home');window.history.replaceState({screen:'home',tab:'home'},'','/app');
        }else{
          let meta=user.user_metadata||{};
          setMyCard(function(c){return Object.assign({},c,{name:meta.full_name||meta.name||'',email:user.email||''});});
          setScreen('profile');window.history.replaceState({screen:'profile'},'','/app/profile');
        }
      });
    }
    processOAuthReturn(routeAfterUser).then(function(result){
      if(cancelled)return;
      setOauthBusy(false);
      clearOAuthUrl();
      if(result===null)return;
      if(!result.ok){
        if(result.error)alert('Sign in failed: '+result.error);
        else alert('Sign in failed. In Supabase, add this redirect URL: '+oauthRedirectUrl());
        setScreen('login');
      }
    }).catch(function(){
      if(!cancelled){setOauthBusy(false);clearOAuthUrl();setScreen('login');alert('Sign in failed. Please try again.');}
    });
    return function(){cancelled=true;};
  },[]);

  React.useEffect(function(){lsSet('myCard',myCard);},[myCard]);
  React.useEffect(function(){
    if(!myCard.name||!canPersistToSupabase())return;
    if(syncTimeout.current)clearTimeout(syncTimeout.current);
    syncTimeout.current=setTimeout(function(){
      syncMyCardToSupabase(myCard,myUsername,myPhoto,contacts);
    },2000);
  },[myCard,contacts,myUsername,myPhoto]);
  React.useEffect(function(){
    lsSet('contacts',contacts);
  },[contacts]);
  React.useEffect(function(){lsSet('posts',posts);},[posts]);
  React.useEffect(function(){lsSet('notifs',notifs);},[notifs]);
  React.useEffect(function(){
    lsSet('threads',threads);
  },[threads]);
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
    let atMatch=path.match(/^\/@([A-Za-z0-9_.]+)\/?$/);
    if(atMatch){openUserProfileByUsername(atMatch[1]);return;}
    if(!path.startsWith('/app/contact/'))return;
    let slug=decodeURIComponent(path.split('/app/contact/')[1]||'');
    if(!slug)return;
    let found=contacts.find((c)=>{let cs=(c.name||'contact').toLowerCase().replace(/[^a-z0-9]+/g,'-');return cs===slug;});
    if(found){setActiveCard(found);setScreen('contact');}
  },[contacts]);
  React.useEffect(function(){
    let raw=(searchQuery||'').trim();
    let normalized=normalizeUsername(raw);
    if(!raw||normalized.length<2||!isSupabaseConfigured()){
      setDirectorySearchResults([]);
      return;
    }
    let cancelled=false;
    let timer=setTimeout(function(){
      searchProfilesByUsername(raw,8).then(function(rows){
        if(cancelled)return;
        let existingUsernames=new Set((contacts||[]).map(function(c){return normalizeUsername(c.username);}).filter(Boolean));
        let mine=normalizeUsername(myUsername);
        let mapped=(rows||[]).filter(function(row){
          let un=normalizeUsername(row&&row.username);
          if(!un)return false;
          if(mine&&un===mine)return false;
          if(existingUsernames.has(un))return false;
          return true;
        }).map(function(row){
          let un=normalizeUsername(row.username);
          return{
            id:'app-user-'+row.id,
            isAppProfileResult:true,
            username:un,
            name:row.full_name||('@'+un),
            title:'CardHoldr member',
            company:'',
            cardType:'professional',
            color:CARD_COLORS[0],
            avatarUrl:row.avatar_url||'',
          };
        });
        setDirectorySearchResults(mapped);
      }).catch(function(){
        if(!cancelled)setDirectorySearchResults([]);
      });
    },250);
    return function(){cancelled=true;clearTimeout(timer);};
  },[searchQuery,contacts,myUsername]);

  // --- 4. Derived values ---
  let visibleContacts=contacts.filter((c)=>{return showSeedData?true:!c.isSeed;}).map(enrichContactWithSeedFields);
  let canUseLeads=myCard.isAgent===true;
  let leads=visibleContacts.filter((c)=>{return c.cardType==='lead';});
  let regularContacts=visibleContacts.filter((c)=>{return c.cardType!=='lead';});
  let allContacts=visibleContacts;
  let carouselPool=React.useMemo(function(){
    let base=carouselMode==='leads'&&canUseLeads?leads:regularContacts.filter((c)=>{if(cardTypeFilter==='pro')return c.cardType==='professional';if(cardTypeFilter==='personal')return c.cardType!=='professional';return true;});
    if(!searchQuery)return base;
    let q=searchQuery.toLowerCase();
    return base.filter(function(c){return cardMatchesSearch(c,q);});
  },[contacts,carouselMode,cardTypeFilter,searchQuery,showSeedData,canUseLeads]);
  let searchDropdownResults=React.useMemo(function(){
    if(!searchQuery||carouselMode==='leads')return carouselPool;
    if(!directorySearchResults.length)return carouselPool;
    let seen=new Set(carouselPool.map(function(c){return normalizeUsername(c.username);}).filter(Boolean));
    let extras=directorySearchResults.filter(function(row){return !seen.has(normalizeUsername(row.username));});
    return carouselPool.concat(extras);
  },[searchQuery,carouselMode,carouselPool,directorySearchResults]);
  let safeIdx=Math.min(cardIndex,Math.max(0,carouselPool.length-1));
  let carouselCard=carouselPool[safeIdx];
  let unreadNotifs=notifs.filter((n)=>{return !n.read;}).length;
  let totalUnread=contacts.filter((c)=>{return c.cardType!=='lead';}).reduce(function(a,c){return a+(isThreadUnread(c.id)?1:0);},0);
  let analyticsData={views:0,exchanges:0,contacts:contacts.filter((c)=>{return !c.isSeed&&c.cardType!=='lead';}).length,chart:[0,0,0,0,0,0,0]};
  let feedContacts=React.useMemo(function(){return buildFeedDisplayContacts(contacts,posts,feedProfileMap);},[contacts,posts,feedProfileMap]);
  React.useEffect(function(){
    if(tab!=='home'||!carouselCard||carouselAutoFlipped.current)return;
    carouselAutoFlipped.current=true;
    setHomeAutoFlipCardId(carouselCard.id);
  },[tab,carouselCard&&carouselCard.id,carouselMode]);

  // --- 5. Helper functions ---
  function handleLogoTap(){let next=tvTaps+1;setTvTaps(next);if(tvTimerRef.current)clearTimeout(tvTimerRef.current);if(next>=5){setTvTaps(0);setShowTvPin(true);}else{tvTimerRef.current=setTimeout(function(){setTvTaps(0);},1500);}}
  function handleGoogleLogin(){startOAuthLogin('google',setOauthStarting);}
  function handleFacebookLogin(){startOAuthLogin('facebook',setOauthStarting);}
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
  function patchPosts(updater){
    setPosts(function(prev){
      let next=typeof updater==='function'?updater(prev):updater;
      lsSet('posts',next);
      return next;
    });
  }
  function patchNotifs(updater){
    setNotifs(function(prev){
      let next=typeof updater==='function'?updater(prev):updater;
      lsSet('notifs',next);
      return next;
    });
  }
  function prependNotification(notif,persistRemote){
    if(!notif||!notif.text)return;
    if(persistRemote&&canPersistToSupabase()){
      let user=getSbUser();
      if(user&&user.id){
        createNotification(user.id,notif.type,{contactId:notif.contactId,text:notif.text}).then(function(rows){
          let row=rows&&(Array.isArray(rows)?rows[0]:rows);
          if(row){
            let app=notificationRowToApp(row);
            if(app){patchNotifs(function(p){return[app].concat(p);});return;}
          }
          patchNotifs(function(p){return[notif].concat(p);});
        });
        return;
      }
    }
    patchNotifs(function(p){return[notif].concat(p);});
  }
  function deliverNotification(recipientUserId,type,payload,actorId){
    let me=getSbUser();
    if(!me||!me.id||!recipientUserId||!type||!payload)return;
    let text=payload.text||payload.body||'';
    if(!text)return;
    let contactId=payload.contactId!=null?payload.contactId:null;
    if(recipientUserId===me.id){
      prependNotification({id:Date.now(),type:type,contactId:contactId,text:text,time:'Just now',read:false},true);
      return;
    }
    if(canPersistToSupabase())createNotification(recipientUserId,type,{contactId:contactId,text:text},actorId||me.id);
  }
  function notifyPostOwner(post,actionText){
    let me=getSbUser();
    if(!me||!me.id||!post||post.isOwn||!actionText)return;
    function send(ownerId){
      if(!ownerId||ownerId===me.id)return;
      deliverNotification(ownerId,'system',{contactId:contactIdForActor(me.id,contacts),text:actionText},me.id);
    }
    if(post.authorUserId)send(post.authorUserId);
    else fetchPostOwnerId(post.id).then(send);
  }
  function handleMarkAllNotificationsRead(){
    patchNotifs(function(p){return p.map(function(n){return Object.assign({},n,{read:true});});});
    if(canPersistToSupabase())markAllNotificationsRead();
  }
  function handleCreateFeedPost(){
    let text=postDraft.trim();
    if(!text)return;
    let id=Date.now();
    let newPost={id:id,contactId:null,isOwn:true,text:text,time:'Just now',likes:0,liked:false,comments:[]};
    patchPosts(function(p){return[newPost].concat(p);});
    setPostDraft('');
    if(canPersistToSupabase())createFeedPost(text,id);
  }
  function handleFeedLike(postId){
    let target=posts.find(function(x){return x.id===postId;});
    if(!target)return;
    let wasLiked=!!target.liked;
    patchPosts(function(p){
      return p.map(function(x){
        if(x.id!==postId)return x;
        return Object.assign({},x,{liked:!wasLiked,likes:Math.max(0,(x.likes||0)+(wasLiked?-1:1))});
      });
    });
    if(canPersistToSupabase())togglePostLike(postId,wasLiked);
    if(!wasLiked&&target)notifyPostOwner(target,'liked your post');
  }
  function handleFeedComment(postId,commentText){
    if(!commentText||!commentText.trim())return;
    let commentId=Date.now();
    patchPosts(function(p){
      return p.map(function(x){
        if(x.id!==postId)return x;
        return Object.assign({},x,{comments:(x.comments||[]).concat([{id:commentId,isOwn:true,text:commentText.trim(),time:'Just now',authorName:'You'}])});
      });
    });
    if(canPersistToSupabase())createPostComment(postId,commentText,commentId);
    let target=posts.find(function(x){return x.id===postId;});
    if(target)notifyPostOwner(target,'commented on your post');
  }
  function handleFeedDelete(postId){
    let target=posts.find(function(x){return x.id===postId;});
    if(!target||!target.isOwn)return;
    patchPosts(function(p){return p.filter(function(x){return x.id!==postId;});});
    if(canPersistToSupabase())deleteFeedPost(postId);
  }
  function sendMsg(){
    if(!draft.trim()||!activeThread)return;
    let text=draft.trim();
    let msg={id:Date.now(),from:'me',text:text,time:timeStr(),date:'Today',createdAt:Date.now()};
    patchThreads(function(p){
      let n=Object.assign({},p);
      n[activeThread]=(n[activeThread]||[]).concat([msg]);
      return n;
    });
    setDraft('');
    let contact=contacts.find(function(c){return c.id===activeThread;});
    if(contactCanUseSupabaseMessaging(contact)){
      let convId=convByContactRef.current[activeThread];
      let persistPromise=convId?sendSupabaseMessage(convId,text):findOrCreateConversationForContact(contact).then(function(cid){
        if(!cid)return null;
        convByContactRef.current[activeThread]=cid;
        return sendSupabaseMessage(cid,text);
      });
      Promise.resolve(persistPromise).catch(function(){});
      return;
    }
    setIsTyping(true);
    setTimeout(function(){
      let reply={id:Date.now()+1,from:'them',text:rand(["That's great!","Absolutely!","Sounds perfect!"]),time:timeStr(),date:'Today',createdAt:Date.now()};
      patchThreads(function(p){
        let n=Object.assign({},p);
        n[activeThread]=(n[activeThread]||[]).concat([reply]);
        return n;
      });
      prependNotification({id:Date.now(),type:'message',contactId:activeThread,text:'sent you a message',time:'Just now',read:false},true);
      setIsTyping(false);
    },1400+Math.random()*600);
  }
  function handleFileUpload(e){let file=e.target.files&&e.target.files[0];if(!file)return;let reader=new FileReader();reader.onload=function(ev){setCapturedPhoto(ev.target.result);setScanMode('review');};reader.readAsDataURL(file);e.target.value='';}
  function startCamera(){setCameraError(null);navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){streamRef.current=s;setTimeout(function(){if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play().catch(function(){});}},100);}).catch(function(){setCameraError('Camera access denied.');});}
  function stopStream(){if(streamRef.current){streamRef.current.getTracks().forEach((t)=>{t.stop();});streamRef.current=null;}}
  function capturePhoto(){let v=videoRef.current;let c=canvasRef.current;if(!v||!c)return;c.width=v.videoWidth||640;c.height=v.videoHeight||400;c.getContext('2d').drawImage(v,0,0);setCapturedPhoto(c.toDataURL('image/jpeg'));stopStream();setScanMode('review');}
  function saveExchangedContact(base){let saved=Object.assign({},base,{privacy:exchangePrivate?'private':(base.privacy||getDefaultPrivacy(base.cardType)),stackHidden:exchangeStackHidden,source:'exchange',date:'Just now'});setExchangedCard(saved);patchContacts(function(p){let exists=p.find((c)=>{return c.id===saved.id;});return exists?p.map((c)=>{return c.id===saved.id?saved:c;}):[saved].concat(p);});persistContact(saved);prependNotification({id:Date.now(),type:'exchange',contactId:saved.id,text:'exchanged cards with you',time:'Just now',read:false},true);setCarouselMode('contacts');setCardIndex(0);return saved;}
  function updateExchangedContact(patch){setExchangedCard(function(card){if(!card)return card;let updated=Object.assign({},card,patch);patchContacts(function(p){return p.map((c)=>{return c.id===updated.id?updated:c;});});persistContact(updated);return updated;});}
  function startHold(){if(animRef.current)cancelAnimationFrame(animRef.current);setHoldActive(true);holdStartRef.current=Date.now();function tick(){let p=Math.min((Date.now()-holdStartRef.current)/HOLD_DURATION,1);setHoldProgress(p);if(p<1){animRef.current=requestAnimationFrame(tick);}else{animRef.current=null;setHoldActive(false);setHoldProgress(1);setExchangeStep('searching');let pool=regularContacts.filter((c)=>{return c.cardType!=='lead';});let found=pool[Math.floor(Math.random()*pool.length)]||CONTACTS[0];setTimeout(function(){setExchangeStep('found');},2200);setTimeout(function(){saveExchangedContact(found);setExchangeStep('success');},4000);}}animRef.current=requestAnimationFrame(tick);}
  function cancelHold(){if(animRef.current){cancelAnimationFrame(animRef.current);animRef.current=null;}setHoldActive(false);setHoldProgress(0);}
  function saveLead(lead){
    patchContacts(function(p){
      let exists=p.find((c)=>{return c.id===lead.id;});
      let withId=Object.assign({},lead,{id:lead.id!=null?lead.id:nextContactId(p)});
      persistContact(withId);
      return exists?p.map((c)=>{return c.id===withId.id?withId:c;}):[withId].concat(p);
    });
    setShowAddLead(false);setEditingLead(null);
  }
  function saveContactCard(card){
    patchContacts(function(p){
      let withId=Object.assign({},card,{id:card.id!=null?card.id:nextContactId(p)});
      persistContact(withId);
      return[withId].concat(p);
    });
    setShowAddContact(false);setCarouselMode('contacts');setCardIndex(0);
  }
  function doLogout(){supaSignOut();['myCard','myPhoto','myUsername','contacts','posts','threads','notifs','isPro'].forEach((k)=>{lsDel(k);});let defaults=CONTACTS.concat(SAMPLE_LEADS);setContacts(defaults);setThreads(THREADS);setThreadReadAt({});convByContactRef.current={};setNotifs(NOTIFS.map(function(n){return Object.assign({},n);}));setMyUsername('');setMyPhoto(null);setShowLogoutConfirm(false);setShowProfileMenu(false);setShowProfile(false);setScreen('waitlist');}
  function goHomeTab(){setActiveThread(null);setTab('home');}
  function hydrateProfileForUser(userId){
    if(!isSupabaseConfigured())return Promise.resolve();
    return loadProfile(userId).then(function(profile){
      if(!profile)return;
      if(profile.username){setMyUsername(profile.username);lsSet('myUsername',profile.username);setMyCard(function(c){return withCardUsername(c,profile.username);});}
      if(profile.avatar_url){setMyPhoto(profile.avatar_url);lsSet('myPhoto',profile.avatar_url);}
    });
  }
  async function saveUsername(next){
    let user=getSbUser();
    if(!user||!user.id)return false;
    next=normalizeUsername(next);
    if(!next){alert('Choose a @name using letters, numbers, underscores, dots, or hyphens.');return false;}
    if(isSupabaseConfigured()&&await isUsernameTaken(next,user.id)){alert('@'+next+' is already taken.');return false;}
    setMyUsername(next);
    lsSet('myUsername',next);
    setMyCard(function(c){
      let updated=withCardUsername(c,next);
      lsSet('myCard',updated);
      if(canPersistToSupabase())syncMyCardToSupabase(updated,next,myPhoto,contacts);
      return updated;
    });
    return true;
  }
  async function handleAvatarUpload(file){
    let user=getSbUser();
    if(!user||!user.id||!file)return;
    if(!isSupabaseConfigured()){alert('Photo upload requires Supabase configuration.');return;}
    let url=await uploadAvatar(user.id,file);
    if(!url){alert('Could not upload photo. Check that the avatars storage bucket exists.');return;}
    setMyPhoto(url);
    lsSet('myPhoto',url);
    setMyCard(function(c){
      let updated=Object.assign({},c,{avatarUrl:url});
      lsSet('myCard',updated);
      return updated;
    });
    if(canPersistToSupabase())await upsertProfile(user.id,{avatar_url:url,updated_at:new Date().toISOString()});
  }
  function openUserProfileByUsername(raw){
    let username=normalizeUsername(String(raw||'').replace(/^@+/,''));
    if(!username)return;
    setScreen('public_profile');
    setPublicProfileCard(null);
    findProfileByUsername(username).then(function(profile){
      if(profile)return loadPublicCardForUser(profile.id,profile).then(function(card){
        setPublicProfileCard(card);
        window.history.pushState({screen:'public_profile',username:username},'','/@'+username);
      });
      return searchCardholdrProfiles(username,1).then(function(rows){
        let hit=rows&&rows[0];
        if(!hit){alert('No profile found for @'+username);setScreen('home');return;}
        return loadPublicCardForUser(hit.id,hit).then(function(card){
          setPublicProfileCard(card);
          window.history.pushState({screen:'public_profile',username:hit.username||username},'','/@'+(hit.username||username));
        });
      });
    });
  }

  // --- Browser back button support ---
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

  // --- 7. Early returns ---
  if(showTvPin)return <TeamVuePinGate onSuccess={function(){setShowTvPin(false);setShowTeamVue(true);}} onCancel={function(){setShowTvPin(false);}}/>;
  if(showTeamVue)return <TeamVueDashboard onClose={function(){setShowTeamVue(false);}} showSeedData={showTeamVueSampleData} onToggleSeedData={toggleTeamVueSampleData}/>;
  if(capturedPhoto&&scanMode==='review')return <AIScanReview photo={capturedPhoto} onSave={function(card){patchContacts(function(p){let withId=Object.assign({},card,{id:card.id!=null?card.id:nextContactId(p)});persistContact(withId);return[withId].concat(p);});setCapturedPhoto(null);setScanMode(null);setScreen('home');}} onRetake={function(){setCapturedPhoto(null);setScanMode(null);}} onClose={function(){setCapturedPhoto(null);setScanMode(null);}}/>;
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
  if(showNotifs)return <NotificationsScreen notifs={notifs} contacts={contacts} onMarkRead={handleMarkAllNotificationsRead} onClose={function(){setShowNotifs(false);}} onSelectContact={function(c){setShowNotifs(false);setActiveCard(c);setScreen('contact');}}/>;
  if(showProfile)return <ProfileScreen myCard={myCard} contacts={allContacts} onSave={function(card){let un=normalizeUsername(myUsername||card.username);let updated=un?withCardUsername(card,un):card;setMyCard(updated);lsSet('myCard',updated);if(canPersistToSupabase())syncMyCardToSupabase(updated,myUsername,myPhoto,contacts);}} onClose={function(){setShowProfile(false);}} onShowAnalytics={function(){setShowProfile(false);setShowAnalytics(true);}} photo={myPhoto} username={myUsername} onSaveUsername={saveUsername} onAvatarUpload={handleAvatarUpload} onOpenUserProfile={openUserProfileByUsername} searchProfiles={searchProfilesByUsername} profileLink={profilePublicUrl(myUsername)} onStyleChange={function(val){setMyCard(function(c){return Object.assign({},c,{cardStyle:val});});}} onColorChange={function(col){setMyCard(function(c){return Object.assign({},c,{color:col});});}} onLogout={function(){setShowProfile(false);setShowLogoutConfirm(true);}} onToggleHidden={toggleContactStackHidden} onSelectContact={function(c){setShowProfile(false);setActiveCard(c);setScreen('contact');}} shareUsername={myUsername}/>;
  if(screen==='public_profile'){
    if(!publicProfileCard)return(<div style={{minHeight:'100vh',background:'#0d0b1e',display:'flex',alignItems:'center',justifyContent:'center'}}><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style><div style={{width:'24px',height:'24px',borderRadius:'50%',border:'2px solid rgba(139,92,246,0.3)',borderTop:'2px solid #8b5cf6',animation:'spin 0.8s linear infinite'}}/></div>);
    // Build public contacts from the card's stored data - filter to public, non-hidden, non-lead
    let pubContacts=(publicProfileCard.publicStack||[]).filter((c)=>{return !c.stackHidden&&(c.privacy||getDefaultPrivacy(c.cardType))==='public'&&c.cardType!=='lead';});
    return <PublicProfilePage card={publicProfileCard} onGetApp={function(){setScreen('waitlist');window.history.pushState(null,'','/');}} publicContacts={pubContacts} isLoggedIn={isLoggedIn()} onSelectContact={isLoggedIn()?function(c){setActiveCard(c);setScreen('contact');}:undefined}/>;
  }
  if(showExchange)return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',color:'white'}}>
      <div style={{maxWidth:'320px',width:'100%',textAlign:'center'}}>
        {exchangeStep==='idle'&&(
          <>
            <div style={{fontSize:'16px',fontWeight:800,letterSpacing:'0.08em',color:'#a78bfa',marginBottom:'14px'}}>EXCHANGE</div>
            <h2 style={{fontSize:'22px',fontWeight:900,margin:'0 0 8px'}}>Card Exchange</h2>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'13px',margin:'0 0 20px',lineHeight:1.6}}>Tap the button to exchange cards with someone nearby.</p>
            <div onClick={function(){setExchangePrivate(function(v){return !v;});}} style={{display:'flex',alignItems:'center',gap:'10px',background:exchangePrivate?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.08)',border:'1px solid '+(exchangePrivate?'rgba(239,68,68,0.25)':'rgba(16,185,129,0.2)'),borderRadius:'12px',padding:'10px 14px',marginBottom:'10px',cursor:'pointer',textAlign:'left'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'5px',background:exchangePrivate?'rgba(239,68,68,0.3)':'rgba(16,185,129,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontSize:'12px',fontWeight:700}}>{exchangePrivate?'Private':'Public'}</span></div>
              <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'1px'}}>{exchangePrivate?'Save as private':'Save as public'}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{exchangePrivate?'Only you can see this card':'Can appear in your public stack'}</div></div>
            </div>
            <div onClick={function(){setExchangeStackHidden(function(v){return !v;});}} style={{display:'flex',alignItems:'center',gap:'10px',background:exchangeStackHidden?'rgba(107,114,128,0.12)':'rgba(139,92,246,0.1)',border:'1px solid '+(exchangeStackHidden?'rgba(107,114,128,0.25)':'rgba(139,92,246,0.25)'),borderRadius:'12px',padding:'10px 14px',marginBottom:'24px',cursor:'pointer',textAlign:'left'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'5px',background:exchangeStackHidden?'rgba(107,114,128,0.35)':'rgba(139,92,246,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontSize:'12px',fontWeight:700}}>{exchangeStackHidden?'Off':'On'}</span></div>
              <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:'white',marginBottom:'1px'}}>{exchangeStackHidden?'Hide from stack':'Show in stack'}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{exchangeStackHidden?'Saved, but invisible in your stack':'Visible in your contacts stack'}</div></div>
            </div>
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
              <svg width="140" height="140" style={{transform:'rotate(-90deg)'}}><circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7"/><circle cx="70" cy="70" r="60" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" strokeDasharray={2*Math.PI*60} strokeDashoffset={2*Math.PI*60*(1-holdProgress)}/></svg>
              <button onMouseDown={startHold} onMouseUp={function(){if(holdProgress<0.9)cancelHold();}} onMouseLeave={cancelHold} onTouchStart={function(e){e.preventDefault();startHold();}} onTouchEnd={function(e){e.preventDefault();if(holdProgress<0.9)cancelHold();}} style={{position:'absolute',width:'90px',height:'90px',borderRadius:'50%',background:holdActive?'linear-gradient(135deg,#8b5cf6,#3b82f6)':'rgba(139,92,246,0.15)',border:'2px solid rgba(139,92,246,0.6)',color:'white',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'5px',userSelect:'none',WebkitUserSelect:'none'}}>
                <Zap size={26} fill={holdActive?'white':'none'}/>
                <span style={{fontSize:'10px',fontWeight:800,letterSpacing:'1px'}}>HOLD</span>
              </button>
            </div>
            <button onClick={function(){setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setHoldActive(false);setExchangeStackHidden(false);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.6)',borderRadius:'12px',padding:'11px 28px',cursor:'pointer',fontSize:'14px',fontWeight:600}}>Cancel</button>
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
                <div style={{display:'grid',gap:'8px',margin:'10px 0'}}>
                  <button onClick={function(){let next=(exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType))==='public'?'private':'public';setExchangePrivate(next==='private');updateExchangedContact({privacy:next});}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',background:(exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType))==='private'?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.08)',border:'1px solid '+((exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType))==='private'?'rgba(239,68,68,0.25)':'rgba(16,185,129,0.2)'),borderRadius:'11px',padding:'10px 12px',color:'white',cursor:'pointer',textAlign:'left'}}>
                    <span><span style={{display:'block',fontSize:'12px',fontWeight:800}}>{(exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType))==='private'?'Private card':'Public card'}</span><span style={{display:'block',fontSize:'10px',color:'rgba(255,255,255,0.42)',marginTop:'2px'}}>{(exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType))==='private'?'Only visible to you':'Can appear where public cards are shown'}</span></span>
                    <PrivacyBadge privacy={exchangedCard.privacy||getDefaultPrivacy(exchangedCard.cardType)} small={true}/>
                  </button>
                  <button onClick={function(){let next=!exchangedCard.stackHidden;setExchangeStackHidden(next);updateExchangedContact({stackHidden:next});}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',background:exchangedCard.stackHidden?'rgba(107,114,128,0.12)':'rgba(139,92,246,0.1)',border:'1px solid '+(exchangedCard.stackHidden?'rgba(107,114,128,0.25)':'rgba(139,92,246,0.25)'),borderRadius:'11px',padding:'10px 12px',color:'white',cursor:'pointer',textAlign:'left'}}>
                    <span><span style={{display:'block',fontSize:'12px',fontWeight:800}}>{exchangedCard.stackHidden?'Hidden from stack':'Visible in stack'}</span><span style={{display:'block',fontSize:'10px',color:'rgba(255,255,255,0.42)',marginTop:'2px'}}>{exchangedCard.stackHidden?'Saved but not shown in your stack':'Shown in your contacts stack'}</span></span>
                    <PrivacyBadge privacy={exchangedCard.stackHidden?'private':'public'} small={true} hidden={exchangedCard.stackHidden}/>
                  </button>
                </div>
                <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                  <button onClick={function(){setActiveCard(exchangedCard);setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangeStackHidden(false);setExchangedCard(null);setScreen('contact');}} style={{flex:1,background:'rgba(139,92,246,0.2)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',borderRadius:'8px',padding:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>View Card</button>
                  <button onClick={function(){setActiveThread(exchangedCard.id);setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangeStackHidden(false);setExchangedCard(null);setTab('messages');}} style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',borderRadius:'8px',padding:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600}}>Message</button>
                </div>
              </div>
            )}
            <button onClick={function(){setShowExchange(false);setExchangeStep('idle');setHoldProgress(0);setExchangeStackHidden(false);setExchangedCard(null);}} style={{width:'100%',background:'linear-gradient(to right,#8b5cf6,#3b82f6)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'15px'}}>Done</button>
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
      {shareCard&&<ShareCardModal card={shareCard} username={shareCard===myCard?myUsername:null} onClose={function(){setShareCard(null);}}/>}
    </div>
  );
  if(screen==='waitlist')return <WaitlistPage onEnterApp={function(){setScreen('login');}} onLogoTap={handleLogoTap}/>;
  if(screen==='login')return(
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom right,#581c87,#3730a3,#1e3a8a)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{maxWidth:'380px',width:'100%'}}>
        {oauthBusy?(
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.85)',padding:'48px 0'}}>
            <div style={{fontSize:'18px',fontWeight:800,marginBottom:'8px'}}>Signing you in...</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>Completing Google or Facebook login</div>
          </div>
        ):oauthStarting?(
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.85)',padding:'48px 0'}}>
            <div style={{fontSize:'18px',fontWeight:800,marginBottom:'8px'}}>Redirecting...</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>Opening sign-in</div>
          </div>
        ):(
        <>
        <div style={{marginBottom:'20px'}}><button onClick={function(){setScreen('waitlist');}} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'10px',padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',fontSize:'13px',fontWeight:600}}><ArrowLeft size={16}/> Back</button></div>
        <div style={{textAlign:'center',marginBottom:'28px'}}><h1 style={{fontSize:'38px',fontWeight:900,color:'white',marginBottom:'8px'}}>CardHoldr</h1><p style={{color:'#e9d5ff',fontSize:'15px'}}>Now You Hold the Cards</p></div>
        <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(40px)',borderRadius:'22px',padding:'26px',border:'1px solid rgba(255,255,255,0.2)'}}>
          <button type="button" onClick={handleGoogleLogin} style={{width:'100%',background:'white',color:'#374151',padding:'14px',borderRadius:'13px',fontWeight:600,marginBottom:'10px',border:'none',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
          <button type="button" onClick={handleFacebookLogin} style={{width:'100%',background:'#1877F2',color:'white',padding:'14px',borderRadius:'13px',fontWeight:600,marginBottom:'10px',border:'none',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
          <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'14px 0'}}><div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.2)'}}></div><span style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',fontWeight:600}}>or</span><div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.2)'}}></div></div>
          <button onClick={function(){setScreen('profile');}} style={{width:'100%',background:'rgba(255,255,255,0.15)',color:'white',padding:'14px',borderRadius:'13px',fontWeight:600,border:'1px solid rgba(255,255,255,0.25)',cursor:'pointer',fontSize:'15px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}><Mail size={18}/> Continue with Email</button>
        </div>
        </>
        )}
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
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'14px'}}>
            <div style={{display:'flex',alignItems:'center',padding:'13px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <span style={{color:'rgba(255,255,255,0.45)',fontSize:'15px',fontWeight:700,marginRight:'4px'}}>@</span>
              <input value={signupUsername} onChange={function(e){setSignupUsername(sanitizeUsernameInput(e.target.value));}} placeholder="yourname" style={{flex:1,background:'none',border:'none',color:'white',fontSize:'15px',outline:'none',fontFamily:'inherit'}}/>
            </div>
          </div>
          <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',margin:'-8px 0 14px',textAlign:'center'}}>Letters, numbers, underscores, and dots only</p>
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
          <button onClick={async function(){
            if(!myCard.name||!myCard.email){alert('Name and email are required');return;}
            let un=normalizeUsername(signupUsername);
            if(!un){alert('Choose a @name using letters, numbers, underscores, dots, or hyphens.');return;}
            let user=lsGet('sb_user',null);
            if(isSupabaseConfigured()&&user&&await isUsernameTaken(un,user.id)){alert('@'+un+' is already taken.');return;}
            let updatedCard=withCardUsername(Object.assign({},myCard,{cardType:profileType==='professional'?'professional':'personal'}),un);
            setMyCard(updatedCard);lsSet('myCard',updatedCard);
            setMyUsername(un);lsSet('myUsername',un);
            if(canPersistToSupabase())syncMyCardToSupabase(updatedCard,un,myPhoto,contacts);
            setScreen('reveal');
          }} style={{width:'100%',background:'linear-gradient(135deg,#8b5cf6,#6366f1)',color:'white',padding:'16px',borderRadius:'14px',fontWeight:800,border:'none',cursor:'pointer',fontSize:'16px'}}>Get Started</button>
          <p style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.25)',marginTop:'12px'}}>You can edit everything later in your profile</p>
        </div>
      </div>
    );
  }

  if(screen==='contact'&&activeCard){
    let c=activeCard;
    let isLead=c.cardType==='lead';
    if(!isLead){
      let contactPublicStack=(c.publicStack&&c.publicStack.length?c.publicStack:contacts.filter((x)=>{return x.id!==c.id&&x.cardType!=='lead'&&!x.stackHidden&&(x.privacy||getDefaultPrivacy(x.cardType))==='public';})).map((x)=>{let full=contacts.find((m)=>{return m.id===x.id;})||{};return snapshotPublicCard(Object.assign({},full,x));}).filter((x)=>{return !x.stackHidden&&(x.privacy||getDefaultPrivacy(x.cardType))==='public'&&x.cardType!=='lead';});
      return <PublicProfilePage card={c} onGetApp={function(){setScreen('home');window.history.pushState(null,'','/app');}} publicContacts={contactPublicStack} isLoggedIn={true} onSelectContact={function(contact){setActiveCard(contact);setScreen('contact');}}/>;
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
              {LEAD_STATUSES.map((s)=>{let col=LEAD_STATUS_COLORS[s];return(<button key={s} onClick={function(){let next=Object.assign({},c,{leadStatus:s});patchContacts(function(p){return p.map((x)=>{return x.id===c.id?next:x;});});persistContact(next);setActiveCard(next);}} style={{flex:1,padding:'7px 4px',borderRadius:'9px',border:'1px solid '+(c.leadStatus===s?col:'rgba(255,255,255,0.1)'),background:c.leadStatus===s?col+'22':'transparent',color:c.leadStatus===s?col:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'10px',fontWeight:700,textAlign:'center',minWidth:'60px'}}>{s}</button>);})}
            </div>
          )}
          {!isLead&&c.notes&&(<div style={{background:'rgba(255,255,255,0.04)',borderRadius:'12px',padding:'14px 16px',border:'1px solid rgba(255,255,255,0.07)',marginBottom:'14px'}}><div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>Notes</div><div style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',lineHeight:1.55}}>{c.notes}</div></div>)}
          {!isLead&&(<div style={{textAlign:'center',marginBottom:'8px'}}><button onClick={function(){setShowReport(true);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.2)',cursor:'pointer',fontSize:'12px',padding:'8px 16px',textDecoration:'underline',textUnderlineOffset:'3px'}}>Report this user</button></div>)}
        </div>
        {(showAddLead||editingLead)&&<AddLeadModal onSave={saveLead} onClose={function(){setShowAddLead(false);setEditingLead(null);}} existing={editingLead}/>}
      </div>
    );
  }

  // --- Main Shell ---
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0d0b1e,#1a1440,#0d0b1e)',display:'flex',flexDirection:'column'}}>
      <style>{'@keyframes typingDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.35)}input,textarea{font-size:16px!important;touch-action:manipulation}'}</style>

      {shareCard&&<ShareCardModal card={shareCard} username={shareCard===myCard?myUsername:null} onClose={function(){setShareCard(null);}}/>}
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
                    let unread=isThreadUnread(contact.id)?1:0;
                    return(
                      <div key={'thread-'+(contact.cardType||'contact')+'-'+String(contact.id)+'-'+(normalizeUsername(contact.username)||contact.name||'')} onClick={function(){openMessageThread(contact.id);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'13px 18px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
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
                      <div key={'new-thread-'+(contact.cardType||'contact')+'-'+String(contact.id)+'-'+(normalizeUsername(contact.username)||contact.name||'')} onClick={function(){openMessageThread(contact.id);setShowNewMsg(false);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 8px',borderRadius:'12px',cursor:'pointer',marginBottom:'2px'}}>
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
            <div style={{position:'relative',marginBottom:'10px',zIndex:40}}>
              <input value={searchQuery} onChange={function(e){setSearchQuery(e.target.value);setCardIndex(0);}} onFocus={function(){setSearchFocused(true);}} onBlur={function(){setTimeout(function(){setSearchFocused(false);},150);}} placeholder="Search name, company, @name, social..." style={{width:'100%',padding:'9px 11px 9px 32px',borderRadius:'11px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'16px',outline:'none',boxSizing:'border-box'}}/>
              <Search size={13} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',opacity:0.4,color:'white',pointerEvents:'none'}}/>
              <CardSearchDropdown query={searchQuery} results={searchDropdownResults} visible={searchFocused&&!!searchQuery.trim()} onSelect={function(card){
                setSearchQuery('');
                setSearchFocused(false);
                if(card&&card.isAppProfileResult){openUserProfileByUsername(card.username);return;}
                setActiveCard(card);
                setScreen('contact');
              }}/>
            </div>

            {carouselPool.length>0?(
              <>
                <div data-carousel-swipe="true" onMouseDown={startCarouselSwipe} onMouseMove={moveCarouselSwipe} onMouseUp={endCarouselSwipe} onMouseLeave={function(){carouselSwipeRef.current=null;}} onTouchStart={startCarouselSwipe} onTouchMove={moveCarouselSwipe} onTouchEnd={endCarouselSwipe} style={{overflow:'hidden',borderRadius:'10px',marginBottom:'8px',touchAction:'pan-y'}}>
                  <div style={{position:'relative',height:'214px',display:'flex',alignItems:'center',overflow:'hidden',perspective:'1000px',justifyContent:'center'}}>
                    {getVisible().map((item)=>{
                      let card=item.card;let offset=item.offset;let isCenter=offset===0;let absOff=Math.abs(offset);
                      let shouldAutoFlip=isCenter&&homeAutoFlipCardId===card.id;
                      return(
                        <Card3D key={'carousel-'+(card.cardType||'card')+'-'+String(card.id)+'-'+String(offset)} card={card} isCenter={isCenter} autoFlip={shouldAutoFlip} autoFlipKey={'home-'+card.id+'-'+tab+'-'+carouselMode+'-'+(shouldAutoFlip?'intro':'idle')}
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
                      <StackVisibilityToggle c={carouselCard} stackPublic={myCard.stackPublic} onToggleHidden={toggleContactStackHidden}/>
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
                <button onClick={function(){setShowExchange(true);setExchangeStep('idle');setHoldProgress(0);setHoldActive(false);setExchangedCard(null);setExchangePrivate(false);setExchangeStackHidden(false);}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'linear-gradient(to right,#4f46e5,#0ea5e9)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Zap size={17} fill="white"/> Exchange</button>
                <button onClick={function(){setShareCard(carouselCard||myCard);}} style={{flex:'1 1 0',width:'100%',minWidth:0,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.11)',color:'white',padding:'13px',borderRadius:'12px',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'13px'}}><Share2 size={17}/> Share</button>
              </div>
            </div>
          </div>
        )}

        {tab==='stack'&&(
          <CardStackScreen contacts={allContacts} onSelectContact={function(c){setActiveCard(c);setScreen('contact');}} cardTypeFilter={cardTypeFilter} setCardTypeFilter={setCardTypeFilter} isPro={canUseLeads} onAddLead={function(){setShowAddLead(true);}} onEditLead={function(lead){setEditingLead(lead);setShowAddLead(true);}} onToggleHidden={toggleContactStackHidden} stackPublic={myCard.stackPublic} onToggleStackPublic={function(){setMyCard(function(c){let next=c.stackPublic===true?false:true;let updated=Object.assign({},c,{stackPublic:next});lsSet('myCard',updated);return updated;});}} showSeedData={showSeedData} onRemoveSamples={toggleSeedData} onBack={goHomeTab}/>
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
                      <button onClick={handleCreateFeedPost} style={{background:'linear-gradient(135deg,'+(myCard.color&&myCard.color[0]?myCard.color[0]:'#8b5cf6')+','+(myCard.color&&myCard.color[1]?myCard.color[1]:'#6366f1')+')',border:'none',color:'white',borderRadius:'8px',padding:'7px 18px',cursor:'pointer',fontSize:'13px',fontWeight:700}}>Post</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {teamPosts.map((post)=>{return(<TeamPostCard key={'team-post-'+String(post.id)} post={post} onLike={function(id){setTeamPosts(function(p){return p.map((x)=>{return x.id===id?Object.assign({},x,{liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}):x;});});}}/>);})}
            {posts.map((post)=>{return(<PostCard key={'post-'+String(post.id)} post={post} contacts={feedContacts} myCard={myCard} onLike={handleFeedLike} onComment={handleFeedComment} onDelete={handleFeedDelete} onSelectContact={function(c){if(String(c.id).indexOf('author-')===0)return;setActiveCard(c);setScreen('contact');}} onViewOwnProfile={function(){setShowProfile(true);}}/>);})}
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
