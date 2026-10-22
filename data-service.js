
/* Durga Samiti demo data service.
   Local Storage is device/browser-local and is NOT a secure database.
   A future Supabase adapter can replace these functions without rewriting page UI. */
(function(){
 const KEY='durgaSamitiDataV1', SESSION='durgaSamitiSessionV1';
 const DEFAULT_LOGO='assets/durga-samiti-logo.png';
 const defaults = {"version": 1, "settings": {"siteName": "দুর্গা সমিতি", "motto": "ঐক্য, সেবা ও শক্তির বন্ধনে", "theme": "cream", "logo": "assets/durga-samiti-logo.png", "footer": "© দুর্গা সমিতি", "chatName": "দুর্গা সমিতি — গ্রুপ চ্যাট", "settingsPassword": "AK@2026#", "customFields": []}, "members": [{"id": "DUR@900", "name": "আকাশ কর্মকার", "role": "অ্যাডমিন", "active": true, "birthday": "", "address": "", "phone": "", "contribution": 0, "photo": "", "password": "password", "isAdmin": true}, {"id": "DUR002", "name": "সায়ন কোলে", "role": "সদস্য", "active": true, "birthday": "", "address": "", "phone": "", "contribution": 0, "photo": "", "password": "Durga@1002", "isAdmin": false}, {"id": "DUR003", "name": "সস্তিক কর্মকার", "role": "সদস্য", "active": true, "birthday": "", "address": "", "phone": "", "contribution": 0, "photo": "", "password": "Durga@1003", "isAdmin": false}, {"id": "DUR004", "name": "হমাংস মালিক", "role": "সদস্য", "active": true, "birthday": "", "address": "", "phone": "", "contribution": 0, "photo": "", "password": "Durga@1004", "isAdmin": false}, {"id": "DUR005", "name": "অরিত্র মালিক", "role": "সদস্য", "active": true, "birthday": "", "address": "", "phone": "", "contribution": 0, "photo": "", "password": "Durga@1005", "isAdmin": false}], "gallery": [], "messages": [{"id": "msg1", "memberId": "DUR@900", "name": "আকাশ কর্মকার", "text": "সবাইকে দুর্গা সমিতির পক্ষ থেকে স্বাগতম।", "time": "2026-10-23T09:00:00.000Z"}], "transactions": [{"id": "tx1", "year": 2026, "date": "2026-10-01", "type": "contribution", "direction": "income", "amount": 0, "payer": "সদস্যদের চাঁদা", "item": "প্রাথমিক নমুনা রেকর্ড", "description": "প্রকৃত হিসাব যোগ করার পরিমাণ ০ রাখা হয়েছে", "responsible": "আকাশ কর্মকার", "comment": "নমুনা"}], "financialYears": [2025, 2026, 2027]};
 function clone(v){return JSON.parse(JSON.stringify(v));}
 function read(){
   try { const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw); if(parsed && parsed.members && parsed.settings) return parsed;} } catch(e){}
   return clone(defaults);
 }
 let state=read();
 function save(){localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('durga:data-changed'));}
 function all(){return state;}
 function persist(){save();}
 function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch(e){return null}}
 function setSession(m){sessionStorage.setItem(SESSION,JSON.stringify({id:m.id,name:m.name,isAdmin:!!m.isAdmin,at:Date.now()}))}
 function clearSession(){sessionStorage.removeItem(SESSION)}
 function currentMember(){const s=getSession();return s?state.members.find(m=>m.id===s.id)||null:null}
 function isAdmin(){const m=currentMember();return !!(m&&m.isAdmin&&m.active)}
 function requireLogin(){if(!currentMember()){location.href='Index.html';return false}return true}
 function requireAdmin(){if(!requireLogin())return false;if(!isAdmin()){alert('এই সুবিধাটি শুধু অ্যাডমিন ব্যবহার করতে পারবেন।');location.href='Dashboard.html';return false}return true}
 function login(name,id,password){
   const clean=v=>String(v??'').normalize('NFC').trim().replace(/\s+/g,' ');
   const normName=v=>clean(v).toLocaleLowerCase('bn');
   const normId=v=>clean(v).toLocaleLowerCase('en');
   const enteredName=normName(name), enteredId=normId(id), enteredPassword=String(password??'');
   const matches=x=>normId(x.id)===enteredId && normName(x.name)===enteredName && String(x.password??'')===enteredPassword && x.active!==false;
   let m=state.members.find(matches);
   /* Migrate old browser demo data only after all three demo credentials match. */
   if(!m){
     const demo=defaults.members.find(matches);
     if(demo){
       let existing=state.members.find(x=>normName(x.name)===normName(demo.name)||normId(x.id)===normId(demo.id));
       if(existing){Object.assign(existing,clone(demo));m=existing;}
       else{m=clone(demo);state.members.push(m);}
       save();
     }
   }
   if(!m)return {ok:false,message:'নাম, সদস্য ID অথবা পাসওয়ার্ড মিলছে না, অথবা অ্যাকাউন্ট নিষ্ক্রিয়। নাম, ID ও পাসওয়ার্ড ঠিকভাবে লিখে আবার চেষ্টা করুন।'};
   if(m.active===false)return {ok:false,message:'এই সদস্য অ্যাকাউন্টটি নিষ্ক্রিয়। অ্যাডমিনের সঙ্গে যোগাযোগ করুন।'};
   setSession(m);return {ok:true,member:m};
 }
 function initials(name){return (name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('')}
 function avatar(m,sizeClass='avatar'){if(m&&m.photo)return `<img class="${sizeClass}" src="${esc(m.photo)}" alt="${esc(m.name)}">`;return `<span class="${sizeClass}">${esc(initials(m&&m.name))}</span>`}
 function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function money(n){return new Intl.NumberFormat('bn-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number(n)||0)}
 function uid(prefix='id'){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7)}
 function addMember(m){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');if(state.members.some(x=>x.id.toLowerCase()===m.id.toLowerCase()))throw Error('এই সদস্য ID আগে থেকেই আছে');state.members.push({...m,isAdmin:!!m.isAdmin});save()}
 function updateMember(id,patch){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');const m=state.members.find(x=>x.id===id);if(!m)throw Error('সদস্য পাওয়া যায়নি');Object.assign(m,patch);save()}
 function deleteMember(id){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');if(id===currentMember().id)throw Error('নিজের অ্যাকাউন্ট সরানো যাবে না');state.members=state.members.filter(x=>x.id!==id);save()}
 function addTransaction(t){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.transactions.push({...t,id:uid('tx')});save()}
 function updateTransaction(id,patch){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');const t=state.transactions.find(x=>x.id===id);if(!t)throw Error('রেকর্ড পাওয়া যায়নি');Object.assign(t,patch);save()}
 function deleteTransaction(id){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.transactions=state.transactions.filter(x=>x.id!==id);save()}
 function addMessage(text){const m=currentMember();if(!m)throw Error('লগইন করুন');state.messages.push({id:uid('msg'),memberId:m.id,name:m.name,text,time:new Date().toISOString()});save()}
 function editMessage(id,text){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');const m=state.messages.find(x=>x.id===id);if(m){m.text=text;save()}}
 function deleteMessage(id){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.messages=state.messages.filter(x=>x.id!==id);save()}
 function addGallery(item){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.gallery.unshift({...item,id:uid('gal'),createdAt:new Date().toISOString(),visible:true});save()}
 function deleteGallery(id){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.gallery=state.gallery.filter(x=>x.id!==id);save()}
 function updateSettings(patch){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');Object.assign(state.settings,patch);save()}
 function addCustomField(field){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.settings.customFields=state.settings.customFields||[];state.settings.customFields.push({...field,id:uid('field')});save()}
 function deleteCustomField(id){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state.settings.customFields=(state.settings.customFields||[]).filter(x=>x.id!==id);save()}
 function exportJSON(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='durga-samiti-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 function importJSON(file){return new Promise((resolve,reject)=>{if(!isAdmin())return reject(Error('অ্যাডমিন অনুমতি প্রয়োজন'));const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.members||!d.settings||!d.transactions||!d.messages||!d.gallery)throw Error('JSON কাঠামো সঠিক নয়');state=d;save();resolve(true)}catch(e){reject(e)}};r.onerror=()=>reject(Error('ফাইল পড়া যায়নি'));r.readAsText(file)})}
 function reset(){if(!isAdmin())throw Error('অ্যাডমিন অনুমতি প্রয়োজন');state=clone(defaults);save()}
 window.DurgaData={all,persist,getSession,currentMember,isAdmin,requireLogin,requireAdmin,login,clearSession,initials,avatar,esc,money,uid,addMember,updateMember,deleteMember,addTransaction,updateTransaction,deleteTransaction,addMessage,editMessage,deleteMessage,addGallery,deleteGallery,updateSettings,addCustomField,deleteCustomField,exportJSON,importJSON,reset,DEFAULT_LOGO};
})();
