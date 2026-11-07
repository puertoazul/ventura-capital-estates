const $ = (s) => document.querySelector(s);
let config = {};
let properties = [];
const money = (value) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value || 0);
const waLink = (message='Hola, estoy interesado/a en conocer los apartamentos disponibles en Bogotá.') => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
function setupContact(){
  $('#headerWhatsapp').href=waLink(); $('#emptyWhatsapp').href=waLink(); $('#contactWhatsapp').href=waLink();
  $('#contactEmail').href=`mailto:${config.correo}?subject=${encodeURIComponent('Consulta inmobiliaria - Ventura Capital & Estates')}`;
  $('#year').textContent=new Date().getFullYear();
  document.title=`${config.marca || 'VENTURA CAPITAL & ESTATES'} | Apartamentos en Bogotá`;
}
function populateZones(){
  const zones=[...new Set(properties.map(p=>p.zona).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  $('#zoneFilter').innerHTML='<option value="">Todas las zonas</option>'+zones.map(z=>`<option value="${escapeHtml(z)}">${escapeHtml(z)}</option>`).join('');
}
function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function filtered(){
 const op=$('#operationFilter').value, zone=$('#zoneFilter').value, max=Number($('#maxPrice').value)||Infinity, beds=Number($('#bedroomFilter').value)||0;
 return properties.filter(p=>(op==='todas'||p.operacion===op)&&(!zone||p.zona===zone)&&Number(p.precio)<=max&&Number(p.habitaciones||0)>=beds);
}
function card(p){
 const image=p.imagenes?.[0] || '';
 return `<article class="property-card" tabindex="0" role="button" data-id="${escapeHtml(p.id)}" aria-label="Ver ${escapeHtml(p.titulo)}"><div class="property-photo">${image?`<img src="${escapeHtml(image)}" alt="${escapeHtml(p.titulo)}" loading="lazy">`:''}<span class="tag">${p.operacion==='venta'?'En venta':'En alquiler'}</span></div><div class="card-body"><div class="card-zone">${escapeHtml(p.zona||'Bogotá')}</div><h3 class="card-title">${escapeHtml(p.titulo)}</h3><div class="card-meta"><span>${p.habitaciones||'—'} hab.</span><span>${p.banos||'—'} baños</span><span>${p.area_m2||'—'} m²</span></div><div class="card-bottom"><span class="card-price">${money(p.precio)}${p.operacion==='alquiler'?'<small> / mes</small>':''}</span><span class="card-link">Ver detalles ↗</span></div></div></article>`;
}
function render(){
 const list=filtered(); $('#resultsCount').textContent=`${list.length} ${list.length===1?'apartamento':'apartamentos'}`;
 $('#propertyGrid').innerHTML=list.map(card).join(''); $('#emptyState').hidden=list.length>0;
 $('#propertyGrid').querySelectorAll('.property-card').forEach(el=>{el.addEventListener('click',()=>showProperty(el.dataset.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showProperty(el.dataset.id)}})});
}
function showProperty(id){
 const p=properties.find(x=>String(x.id)===String(id)); if(!p)return;
 const msg=`Hola, estoy interesado/a en el apartamento "${p.titulo}" en ${p.zona}. ¿Podrían darme más información?`;
 $('#dialogContent').innerHTML=`<div class="dialog-inner"><p class="eyebrow dark">${p.operacion==='venta'?'APARTAMENTO EN VENTA':'APARTAMENTO EN ALQUILER'} · ${escapeHtml(p.zona)}</p><h2>${escapeHtml(p.titulo)}</h2><p>${escapeHtml(p.descripcion||'Consulta para conocer más detalles de esta propiedad.')}</p><div class="dialog-specs"><span>${p.habitaciones||'—'} habitaciones</span><span>${p.banos||'—'} baños</span><span>${p.area_m2||'—'} m²</span></div><h3>${money(p.precio)}${p.operacion==='alquiler'?' / mes':''}</h3><a class="gold-button" href="${waLink(msg)}" target="_blank" rel="noopener">Consultar este apartamento ↗</a></div>`;
 $('#propertyDialog').showModal();
}
async function init(){
 try{
  const [c,p]=await Promise.all([fetch('data/configuracion.json'),fetch('data/propiedades.json')]);
  if(!c.ok||!p.ok)throw new Error('No se pudieron cargar los archivos JSON.');
  config=await c.json(); properties=await p.json();
  if(!Array.isArray(properties))throw new Error('El catálogo JSON debe ser una lista.');
  setupContact();populateZones();render();
 }catch(err){console.error(err);$('#emptyState').hidden=false;$('#emptyState').querySelector('h3').textContent='No fue posible cargar el catálogo.';$('#emptyState').querySelector('p').textContent='Verifica los archivos de configuración y propiedades antes de publicar.';}
}
['operationFilter','zoneFilter','maxPrice','bedroomFilter'].forEach(id=>$('#'+id).addEventListener('input',render));
$('#clearFilters').addEventListener('click',()=>{$('#operationFilter').value='todas';$('#zoneFilter').value='';$('#maxPrice').value='';$('#bedroomFilter').value='';render()});
$('#dialogClose').addEventListener('click',()=>$('#propertyDialog').close());
$('#propertyDialog').addEventListener('click',e=>{if(e.target===$('#propertyDialog'))$('#propertyDialog').close()});
$('#menuToggle').addEventListener('click',()=>{const nav=$('#mainNav'),open=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open))});
$('#mainNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('open')));
$('#mainNav').querySelectorAll('[data-nav-filter]').forEach(a=>a.addEventListener('click',()=>{$('#operationFilter').value=a.dataset.navFilter;render()}));
init();
