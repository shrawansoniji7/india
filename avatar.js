/* Local-first avatar presentation and private chat history.
   The animation is visual only; real local LLM and native speech bridge are separate integrations. */
(()=>{const stage=document.getElementById('avatarStage');if(!stage)return;
const status=document.getElementById('avatarStatus');const log=document.getElementById('chatLog');
const DB='shravan-ai-private',STORE='messages';let db;
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function save(role,content){if(!db)return;const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).add({role,content,at:Date.now()})}
function setMood(m){stage.classList.remove('avatar-speaking','avatar-thinking');if(m==='speaking')stage.classList.add('avatar-speaking');if(m==='thinking')stage.classList.add('avatar-thinking');status.textContent=m==='speaking'?'● बोल रही हूँ':m==='thinking'?'● सोच रही हूँ':'● सुनने के लिए तैयार'}
function render(role,content){const el=document.createElement('div');el.className='bubble '+(role==='user'?'user':'ai');const sm=document.createElement('small');sm.textContent=role==='user'?'YOU':'SHRAVAN AI';el.append(sm,document.createTextNode(content));log.append(el);log.scrollTop=log.scrollHeight;save(role,content)}
async function restore(){try{db=await openDB();const req=db.transaction(STORE).objectStore(STORE).getAll();req.onsuccess=()=>{for(const m of req.result.slice(-40)){const el=document.createElement('div');el.className='bubble '+(m.role==='user'?'user':'ai');const sm=document.createElement('small');sm.textContent=m.role==='user'?'YOU':'SHRAVAN AI';el.append(sm,document.createTextNode(m.content));log.append(el)}}}catch(e){console.warn('Local history unavailable',e)}}
window.ShravanAvatar={setMood,render,speak(text){if(!('speechSynthesis'in window)){status.textContent='● आवाज़ उपलब्ध नहीं';return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=/[\\u0900-\\u097F]/.test(text)?'hi-IN':'en-IN';u.onstart=()=>setMood('speaking');u.onend=()=>setMood('idle');u.onerror=()=>setMood('idle');speechSynthesis.speak(u)}};
restore();setMood('idle');
})();