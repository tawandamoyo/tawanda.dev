(function () {
  // Approximate sunrise/sunset in Harare by month (local time, UTC+2).
  var SUN = [
    [5.6, 18.8], [5.9, 18.7], [6.05, 18.3], [6.15, 17.8], [6.35, 17.45], [6.5, 17.35],
    [6.55, 17.5], [6.3, 17.7], [5.9, 17.85], [5.45, 18.05], [5.25, 18.35], [5.3, 18.65]
  ];
  var root = document.documentElement;
  var note = document.getElementById('sun-note');
  var toggle = document.getElementById('sun-toggle');
  var MODES = ['sun', 'day', 'night'];
  var LABELS = { sun: 'following the sun', day: 'always daylight', night: 'always night' };
  var mode = localStorage.getItem('sun-mode') || 'sun';
  if (MODES.indexOf(mode) === -1) mode = 'sun';

  function harareNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Harare', hour: 'numeric', minute: 'numeric', month: 'numeric', hour12: false
    }).formatToParts(new Date());
    var get = function (t) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parseInt(parts[i].value, 10);
      return 0;
    };
    return { month: get('month'), hour: get('hour') + get('minute') / 60 };
  }

  var PAL = {
    night: { ground: '#0F130F', ink: '#D6D8CC', muted: '#8B9084', faint: '#62675C', accent: '#8CC29B', hair: [214, 216, 204, 0.16] },
    dawn:  { ground: '#F8F4EC', ink: '#262420', muted: '#77716A', faint: '#A39C92', accent: '#396B45', hair: [38, 36, 32, 0.14] },
    day:   { ground: '#F7F8F3', ink: '#20241E', muted: '#6E7268', faint: '#9A9E93', accent: '#2F6B45', hair: [32, 36, 30, 0.14] },
    dusk:  { ground: '#F3EFE6', ink: '#27231E', muted: '#786F63', faint: '#A59A8B', accent: '#38663F', hair: [39, 35, 30, 0.15] }
  };
  var KEYS = ['ground', 'ink', 'muted', 'faint', 'accent'];

  function anchorsFor(month) {
    var s = SUN[month - 1], rise = s[0], set = s[1];
    return [
      [rise - 0.7, 'night'], [rise, 'dawn'], [rise + 1.2, 'day'],
      [set - 2.5, 'day'], [set - 0.2, 'dusk'], [set + 0.7, 'night']
    ];
  }

  function blendAt(t) {
    var A = anchorsFor(t.month), h = t.hour;
    if (h < A[0][0] || h >= A[A.length - 1][0]) return { a: 'night', b: 'night', f: 0 };
    for (var i = 0; i < A.length - 1; i++) {
      if (h >= A[i][0] && h < A[i + 1][0]) {
        return { a: A[i][1], b: A[i + 1][1], f: (h - A[i][0]) / (A[i + 1][0] - A[i][0]) };
      }
    }
    return { a: 'night', b: 'night', f: 0 };
  }

  function rgb(hex) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  function mixCh(a, b, f) { return Math.round(a + (b - a) * f); }
  function mixHex(h1, h2, f) {
    var a = rgb(h1), b = rgb(h2);
    return 'rgb(' + mixCh(a[0], b[0], f) + ',' + mixCh(a[1], b[1], f) + ',' + mixCh(a[2], b[2], f) + ')';
  }

  function setBlend(bl) {
    var pa = PAL[bl.a], pb = PAL[bl.b];
    for (var i = 0; i < KEYS.length; i++) {
      root.style.setProperty('--' + KEYS[i], mixHex(pa[KEYS[i]], pb[KEYS[i]], bl.f));
    }
    var ha = pa.hair, hb = pb.hair;
    root.style.setProperty('--hairline', 'rgba(' + mixCh(ha[0], hb[0], bl.f) + ',' + mixCh(ha[1], hb[1], bl.f) + ',' +
      mixCh(ha[2], hb[2], bl.f) + ',' + (ha[3] + (hb[3] - ha[3]) * bl.f).toFixed(3) + ')');
  }
  function clearBlend() {
    for (var i = 0; i < KEYS.length; i++) root.style.removeProperty('--' + KEYS[i]);
    root.style.removeProperty('--hairline');
  }

  function sunNote(t, phase) {
    var s = SUN[t.month - 1], rise = s[0], set = s[1], h = t.hour;
    function hrs(x) { var r = Math.round(x); return r <= 1 ? 'about an hour' : 'about ' + r + ' hours'; }
    if (phase === 'dawn') return 'first light is breaking over southern Africa now.';
    if (phase === 'dusk') return 'the sun is setting over southern Africa now.';
    if (phase === 'day') {
      var left = set - h;
      if (left < 1.5) return 'it is late afternoon in southern Africa — sunset soon.';
      return 'it is daylight in southern Africa — sunset in ' + hrs(left) + '.';
    }
    var until = h < rise ? rise - h : 24 - h + rise;
    if (until < 1.5) return 'it is night in southern Africa — first light soon.';
    return 'it is night in southern Africa — sunrise in ' + hrs(until) + '.';
  }

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--ground').trim());
  }

  function apply() {
    if (mode === 'sun') {
      var t = harareNow();
      var bl = blendAt(t);
      var phase = bl.f < 0.5 ? bl.a : bl.b;
      setBlend(bl);
      root.setAttribute('data-phase', phase);
      note.textContent = 'This page keeps Central Africa Time — ' + sunNote(t, phase);
    } else {
      clearBlend();
      root.setAttribute('data-phase', mode);
      note.textContent = 'This page keeps Central Africa Time.';
    }
    toggle.textContent = LABELS[mode];
    syncThemeColor();
  }

  toggle.addEventListener('click', function () {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    localStorage.setItem('sun-mode', mode);
    apply();
  });

  apply();
  setInterval(apply, 60 * 1000);
})();
