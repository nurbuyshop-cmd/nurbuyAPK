// Writes PATCH.diff: a unified diff (3 lines of context) between the original API files and the patched copies.
// usage: node make-diff.js <original api folder>
const fs = require('fs');
const path = require('path');

const orig = process.argv[2];
const here = path.join(__dirname, 'api');
const files = ['index.php', 'lib/db.php', 'lib/schema.php', 'lib/notify.php', 'lib/handlers_chat.php', 'lib/handlers_user.php'];

/** Longest-common-subsequence line diff -> list of [' ', '-', '+', line]. */
function diffLines(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push([' ', a[i]]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push(['-', a[i++]]);
    else out.push(['+', b[j++]]);
  }
  while (i < n) out.push(['-', a[i++]]);
  while (j < m) out.push(['+', b[j++]]);
  return out;
}

function unified(name, a, b, ctx = 3) {
  const ops = diffLines(a, b);
  const changed = ops.map((o) => o[0] !== ' ');
  let text = `--- a/${name}\n+++ b/${name}\n`;
  let k = 0;
  while (k < ops.length) {
    if (!changed[k]) { k++; continue; }
    let start = Math.max(0, k - ctx), end = k;
    // extend the hunk while changes are close together
    while (end < ops.length) {
      let next = end;
      while (next < ops.length && !changed[next]) next++;
      if (next >= ops.length || next - end > ctx * 2) break;
      end = next + 1;
      while (end < ops.length && changed[end]) end++;
    }
    end = Math.min(ops.length, end + ctx);
    let ai = 1, bi = 1;
    for (let x = 0; x < start; x++) { if (ops[x][0] !== '+') ai++; if (ops[x][0] !== '-') bi++; }
    const hunk = ops.slice(start, end);
    const al = hunk.filter((o) => o[0] !== '+').length, bl = hunk.filter((o) => o[0] !== '-').length;
    text += `@@ -${ai},${al} +${bi},${bl} @@\n` + hunk.map((o) => o[0] + o[1]).join('\n') + '\n';
    k = end;
  }
  return text;
}

let all = '';
for (const f of files) {
  const a = fs.readFileSync(path.join(orig, f), 'utf8').split(/\r?\n/);
  const b = fs.readFileSync(path.join(here, f), 'utf8').split(/\r?\n/);
  all += unified(f, a, b) + '\n';
}
fs.writeFileSync(path.join(__dirname, 'PATCH.diff'), all);
console.log(all);

