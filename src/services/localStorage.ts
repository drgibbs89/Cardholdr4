let _mem={};

function withPrefix(key){
  return 'ch_'+key;
}

export function lsGet(key,fallback){
  try{
    let r=window.localStorage.getItem(withPrefix(key));
    if(r===null||r===undefined)return fallback;
    return JSON.parse(r);
  }catch(e){
    try{
      let v=_mem[withPrefix(key)];
      if(v===undefined)return fallback;
      return JSON.parse(v);
    }catch(e2){
      return fallback;
    }
  }
}

export function lsSet(key,value){
  try{
    let s=JSON.stringify(value);
    window.localStorage.setItem(withPrefix(key),s);
    _mem[withPrefix(key)]=s;
  }catch(e){
    try{
      _mem[withPrefix(key)]=JSON.stringify(value);
    }catch(e2){}
  }
}

export function lsDel(key){
  try{window.localStorage.removeItem(withPrefix(key));}catch(e){}
  delete _mem[withPrefix(key)];
}
