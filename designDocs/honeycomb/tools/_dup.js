const src = require("fs").readFileSync(__dirname + "/progression-dump.js", "utf8").split("const hc = newEngine();")[0];
eval(src);
const hc = newEngine(); hc.state = hc.newProfile();
const pool = hc.cardArray.filter(c => c.rarity !== "enemy" && c.rarity !== "special" && c.rarity !== "broken");
const norm = (v) => JSON.stringify(v, (k, x) => typeof x === "function" ? "fn" : x);
const key = c => norm({ cost: c.costArray, t: c.targetMode, e: c.effectArray, ty: c.type, typ: c.typeArray, x: c.exhausts, r: c.retain, ch: c.characterIndex });
const byName = {}, byRules = {}, byRulesAnyOwner = {};
for (const c of pool) {
  (byName[c.name] = byName[c.name] || []).push(c);
  (byRules[key(c)] = byRules[key(c)] || []).push(c);
  const k2 = norm({ cost: c.costArray, t: c.targetMode, e: c.effectArray });
  (byRulesAnyOwner[k2] = byRulesAnyOwner[k2] || []).push(c);
}
const show = c => `${c.index} [${c.characterIndex}/${c.rarity}] "${c.name}"`;
console.log("== SAME NAME"); for (const g of Object.values(byName)) if (g.length > 1) console.log(g.map(show).join("  |  "));
console.log("== SAME RULES (cost+target+effects), any owner"); for (const g of Object.values(byRulesAnyOwner)) if (g.length > 1) console.log(g.map(show).join("  |  "), "\n     ", hc.cardText(hc.resolveCard({cardIndex: g[0].index})));
console.log("pool size", pool.length);
