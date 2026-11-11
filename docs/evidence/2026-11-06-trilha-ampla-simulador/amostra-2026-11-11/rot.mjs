// Lê `maestro hierarchy` no stdin e imprime os rótulos visíveis, um por linha.
let raw='';process.stdin.on('data',c=>raw+=c).on('end',()=>{
  const d=JSON.parse(raw.slice(raw.indexOf('{')));const out=[];
  const walk=n=>{const a=n.attributes||{};const t=(a.accessibilityText||a.text||'').trim();
    if(t&&a.enabled!=='false'&&out.at(-1)!==t)out.push(t.replace(/\n/g,' ').slice(0,150));(n.children||[]).forEach(walk)};
  walk(d);console.log(out.join('\n'));});
