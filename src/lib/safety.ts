export function safeText(value){
  if(value==null)return '';
  return String(value).trim();
}

export function safeUrl(url){
  if(!url)return '#';
  try{
    let u=String(url).trim();
    let p=new URL(u.startsWith('http')?u:'https://'+u);
    if(p.protocol!=='https:'&&p.protocol!=='http:')return '#';
    return p.href;
  }catch(e){
    return '#';
  }
}

export function safeName(u){
  return safeText(u).replace(/[^a-zA-Z0-9_.]/g,'').slice(0,64);
}

export function safeEmail(email){
  let out=safeText(email).toLowerCase().slice(0,254);
  if(!out||!out.includes('@'))return '';
  return out.replace(/[^a-z0-9._%+\-@]/g,'');
}

export function safePhone(phone){
  return safeText(phone).replace(/[^\d+()\-\s]/g,'').slice(0,32);
}

export function formatPhone(raw){
  const d=String(raw||'').replace(/\D/g,'').slice(0,10);
  if(!d.length)return '';
  if(d.length<=3)return '('+d;
  if(d.length<=6)return '('+d.slice(0,3)+') '+d.slice(3);
  return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6);
}

export function cleanObj(obj){
  if(!obj||typeof obj!=='object')return {};
  return Object.assign(Object.create(null),obj);
}

export function getDefaultPrivacy(t){
  return t==='professional'?'public':'private';
}

export function normalizeUsername(raw){
  if(raw==null)return '';
  let u=String(raw).trim().replace(/^@+/,'').toLowerCase().replace(/[^a-z0-9_.-]/g,'');
  return u.slice(0,32);
}

export function sanitizeUsernameInput(raw){
  return normalizeUsername(raw);
}

export function profilePublicUrl(username){
  let u=normalizeUsername(username);
  if(!u)return window.location.origin+'/';
  return window.location.origin+'/@'+u;
}
