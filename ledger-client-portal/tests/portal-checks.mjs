// Current aggregate suite. Replaces the v1 fixture that forced completed task states.
await import('./portal-end-to-end.mjs');
await import('./ledger-journey.mjs');
import {readFileSync,writeFileSync} from 'node:fs';
const suites=['tests/portal-end-to-end-results.json','tests/ledger-journey-results.json'].map(p=>JSON.parse(readFileSync(p,'utf8')));
const results={method:'Production route and cross-app workflow checks in isolated SQLite/object storage. No live client records or provider calls.',passed:suites.reduce((n,s)=>n+s.passed,0),checks:suites.flatMap(s=>s.checks)};
writeFileSync('tests/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({passed:results.passed}));
