/* markup.js — math typography for content HTML and for whatever Max types.
 *   md(html): [[f:33/400]] stacked fraction, [[m:8 1/4]] mixed number, [[r:0.1(6)]] repeating decimal (overbar).
 *   typed(raw): renders a typed answer ("8 1/4%", "0.1(6)", "33/400") as real math, coloured by form
 *               (fraction green, decimal blue, percent red), for the live preview and figure labels.
 * Content HTML is authored by us and trusted; typed text is escaped.
 */
(function (root) {
  'use strict';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const q = (x) => (String(x).trim() === '?' ? '<span class="blank" aria-label="blank">?</span>' : esc(x));
  function frac(a, b) {
    return '<span class="fr" role="img" aria-label="' + esc(a) + ' over ' + esc(b) + '"><span class="fr-n" aria-hidden="true">' + q(a) +
      '</span><span class="fr-d" aria-hidden="true">' + (b === '' ? '<span class="fr-empty"></span>' : q(b)) + '</span></span>';
  }
  function mixed(w, a, b) { return '<span class="mx">' + q(w) + frac(a, b) + '</span>'; }
  /** "0.1(6)" -> 0.1 with an overbar on 6. Accepts a missing ")" (keypad repeat bar). */
  function rep(s) {
    const i = s.indexOf('(');
    if (i < 0) return esc(s);
    const j = s.indexOf(')', i);
    const barred = j < 0 ? s.slice(i + 1) : s.slice(i + 1, j);
    const rest = j < 0 ? '' : s.slice(j + 1);
    const label = s.slice(0, i) + ' with ' + barred + ' repeating';
    return '<span class="rep" aria-label="' + esc(label) + '">' + esc(s.slice(0, i)) +
      '<span class="ol" aria-hidden="true">' + (barred ? esc(barred) : '<span class="ol-empty"></span>') + '</span>' + esc(rest) + '</span>';
  }

  /** One side of a complex fraction: "3/4", "2 1/2", "5" or "0.75". */
  function part(x) {
    x = String(x).trim();
    let m;
    if ((m = /^(-?[\d?]+)\s+([\d?]+)\s*\/\s*([\d?]+)$/.exec(x))) return mixed(m[1], m[2], m[3]);
    if ((m = /^(-?[^/]+)\/(.+)$/.exec(x))) return frac(m[1].trim(), m[2].trim());
    return x.indexOf('(') >= 0 ? rep(x) : esc(x);
  }

  /** Content markup -> HTML. Unknown tokens are left as text. */
  function md(html) {
    if (html === undefined || html === null) return '';
    return String(html).replace(/\[\[([fmrc]):([^\]]*)\]\]/g, (all, k, body) => {
      body = body.trim();
      if (k === 'c') {
        const parts = body.split('|');
        if (parts.length !== 2) return esc(body);
        return '<span class="mth f"><span class="cfr" role="img" aria-label="' + esc(parts[0].trim()) + ' over ' + esc(parts[1].trim()) + '"><span class="cfr-n" aria-hidden="true">' +
          part(parts[0]) + '</span><span class="cfr-d" aria-hidden="true">' + part(parts[1]) + '</span></span></span>';
      }
      if (k === 'f') {
        const m = /^(-?[^/]+)\/(.+)$/.exec(body);
        return m ? '<span class="mth f">' + frac(m[1].trim(), m[2].trim()) + '</span>' : esc(body);
      }
      if (k === 'm') {
        const m = /^(-?[\d?]+)\s+([\d?]+)\s*\/\s*([\d?]+)$/.exec(body);
        return m ? '<span class="mth f">' + mixed(m[1], m[2], m[3]) + '</span>' : esc(body);
      }
      return '<span class="mth d">' + rep(body) + '</span>';
    });
  }

  /** Render what was typed. Returns HTML (always safe). */
  function typed(raw) {
    let s = String(raw === undefined || raw === null ? '' : raw).replace(/\s+/g, ' ').trim();
    if (!s) return '';
    let pre = '', post = '';
    if (/%\s*$/.test(s)) { post = '%'; s = s.replace(/\s*%\s*$/, ''); }
    let m = /^(-?\s*\$?\s*)(.*)$/.exec(s);
    pre = m[1].replace(/\s/g, ''); s = m[2];
    let body, cls = '';
    if ((m = /^(\d[\d,]*)\s+([\d.,]*)\s*\/\s*([\d.,]*)$/.exec(s))) { body = mixed(m[1], m[2], m[3]); cls = 'f'; }
    else if ((m = /^([\d.,]*)\s*\/\s*([\d.,]*)$/.exec(s))) { body = frac(m[1], m[2]); cls = 'f'; }
    else if (s.indexOf('(') >= 0) { body = rep(s); cls = 'd'; }
    else { body = esc(s); cls = /\./.test(s) ? 'd' : ''; }
    if (post) cls = 'p';
    if (pre.indexOf('$') >= 0) cls = '';
    return '<span class="mth ' + cls + '">' + esc(pre) + body + esc(post) + '</span>';
  }

  /** Strip markup to plain text (for summaries, aria labels). */
  function plain(html) {
    return String(html === undefined || html === null ? '' : html)
      .replace(/\[\[f:\s*([^\]/]+)\/([^\]]+)\]\]/g, '$1/$2')
      .replace(/\[\[m:\s*([^\]]+)\]\]/g, '$1')
      .replace(/\[\[c:\s*([^\]|]+)\|([^\]]+)\]\]/g, '($1) / ($2)')
      .replace(/\[\[r:\s*([^\]]+)\]\]/g, (a, b) => b.replace(/\(([^)]*)\)?/, (x, d) => d + d + d + '...'))
      .replace(/<[^>]+>/g, '')
      .replace(/&times;/g, '×').replace(/&divide;/g, '÷').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ').trim();
  }

  root.FDPMark = { md, typed, plain, esc, frac, rep };
})(typeof window !== 'undefined' ? window : globalThis);
