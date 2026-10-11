/* 저장소: 브라우저 저장(localStorage) + 동기화 백엔드
 *  - cloud : claude.ai Artifact로 열었을 때, 보는 사람 계정의 개인 공간(data/users/<id>/)에 저장 → 같은 계정의 모든 기기 동기화
 *  - server: server.py(노트북 로컬 서버)로 열었을 때, notes_data/state.json 공유
 *  - local : 그 외(파일로 열기 등), 이 기기에만 저장
 * 각 키는 {t: 수정시각, v: 값}. 더 최근 값이 이김.
 */
(function () {
  const PREFIX = ((window.SITE && SITE.key) || "studynote") + ":"; // 사이트마다 다른 키 → 같은 주소(localhost)에서도 저장이 섞이지 않음
  const MAX_DOC = 250000; // cloud 문서 1개 한도(256KiB) 여유
  const mem = {};
  let mode = "local";
  let col = null; // cloud 컬렉션
  const pending = {};
  let flushTimer = null;
  const listeners = [];
  const writing = {};
  let warnedBig = false;

  function lsGet(k) {
    try { const s = localStorage.getItem(PREFIX + k); return s ? JSON.parse(s) : mem[k] || null; } catch (e) { return mem[k] || null; }
  }
  function lsSet(k, rec) {
    mem[k] = rec;
    try { localStorage.setItem(PREFIX + k, JSON.stringify(rec)); } catch (e) { /* 저장 불가 환경: 메모리에만 */ }
  }
  function lsKeys() {
    const out = new Set(Object.keys(mem));
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX)) out.add(k.slice(PREFIX.length)); } } catch (e) {}
    return [...out];
  }

  const Store = {
    get(k, def) { const r = lsGet(k); return r ? r.v : def; },
    set(k, v) {
      const rec = { t: Date.now(), v };
      lsSet(k, rec);
      if (mode === "cloud" || mode === "server") { pending[k] = rec; scheduleFlush(); }
    },
    mode() { return mode; },
    exportAll() { const o = {}; lsKeys().forEach(k => (o[k] = lsGet(k))); return o; },
    importAll(o) {
      const changed = [];
      Object.keys(o || {}).forEach(k => { const r = o[k]; if (r && typeof r === "object" && "v" in r) { const rec = { t: Date.now(), v: r.v }; lsSet(k, rec); changed.push(k); if (mode === "cloud" || mode === "server") pending[k] = rec; } });
      scheduleFlush();
      return changed.length;
    },
    isServer() { return mode === "server"; },
    onRemote(fn) { listeners.push(fn); },
    async init() {
      if (window.claude && typeof window.claude.use === "function") {
        const m = await initCloud().catch(() => null);
        if (m) return (mode = m);
      }
      // 로컬 서버(server.py)일 때만 동기화 API 사용 (일반 웹 배포에선 요청하지 않음)
      if (/^http:\/\/(localhost|127\.|192\.168\.|10\.|172\.)/.test(location.href) && await initServer().catch(() => false)) return (mode = "server");
      return (mode = "local");
    }
  };

  function merge(remote) {
    const changed = [];
    Object.keys(remote).forEach(k => {
      const l = lsGet(k), rr = remote[k];
      if (rr && typeof rr.t === "number" && (!l || rr.t > l.t) && !pending[k]) { lsSet(k, rr); changed.push(k); }
    });
    if (changed.length) listeners.forEach(fn => { try { fn(changed); } catch (e) { console.error(e); } });
    return changed;
  }
  function queueNewerLocal(remote) {
    lsKeys().forEach(k => { const l = lsGet(k), rr = remote[k]; if (l && (!rr || l.t > rr.t)) pending[k] = l; });
    scheduleFlush();
  }

  /* ── cloud (Artifact db) ── */
  async function initCloud() {
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!db || !user) return null;
    const uid = await user.id();
    if (!uid) return null;
    col = db.collection("data/users/" + uid);
    const snap = await col.get();
    const remote = {};
    snap.docs.forEach(d => { if (d.exists) remote[d.id] = d.data(); });
    mode = "cloud";
    merge(remote);
    queueNewerLocal(remote);
    col.onSnapshot(s => {
      const r = {};
      s.docChanges().forEach(c => { if (c.type !== "removed" && !c.doc.metadata.hasPendingWrites) r[c.doc.id] = c.doc.data(); });
      merge(r);
    }, () => { /* 구독 종료: 이후엔 이 기기 저장으로 계속 동작 */ });
    return "cloud";
  }
  function writeCloud(k, rec) {
    if (JSON.stringify(rec).length > MAX_DOC) {
      if (!warnedBig && window.App) { warnedBig = true; App.toast("이 페이지 필기가 많아 동기화 한도를 넘었어요. 이 기기에는 저장돼요."); }
      return Promise.resolve(true);
    }
    // 같은 문서는 한 번에 하나씩 쓰기
    const prev = writing[k] || Promise.resolve();
    const p = prev.then(() => col.doc(k).set({ t: rec.t, v: rec.v })).then(() => true, e => {
      if (e && e.code === "invalid_argument") { mode = "readonly"; setSync("💾 이 기기에만 저장 (동기화하려면 편집 권한 필요)"); return true; }
      return false;
    });
    writing[k] = p;
    return p;
  }

  /* ── server (server.py) ── */
  async function initServer() {
    const r = await fetch("api/state", { cache: "no-store" });
    if (!r.ok || !(r.headers.get("content-type") || "").includes("json")) return false;
    const remote = await r.json();
    mode = "server";
    merge(remote);
    queueNewerLocal(remote);
    setInterval(poll, 15000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });
    return true;
  }
  async function poll() {
    try { const r = await fetch("api/state", { cache: "no-store" }); if (r.ok) merge(await r.json()); setSync("🟢 기기 간 동기화 중 (노트북 서버)"); } catch (e) { setSync("🟠 서버 연결 끊김 — 이 기기에 임시 저장"); }
  }

  function scheduleFlush() { clearTimeout(flushTimer); flushTimer = setTimeout(flush, 700); }
  async function flush() {
    const keys = Object.keys(pending);
    if (!keys.length) return;
    if (mode === "cloud") {
      const batch = {}; keys.forEach(k => (batch[k] = pending[k]));
      const results = await Promise.all(keys.map(k => writeCloud(k, batch[k]).then(ok => [k, ok])));
      let retry = false;
      results.forEach(([k, ok]) => { if (ok && pending[k] === batch[k]) delete pending[k]; if (!ok) retry = true; });
      if (mode === "readonly") keys.forEach(k => delete pending[k]);
      else if (retry) setTimeout(scheduleFlush, 3000 + Math.random() * 2000);
      return;
    }
    if (mode !== "server") return;
    const body = {}; keys.forEach(k => (body[k] = pending[k]));
    try {
      const r = await fetch("api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.ok) { keys.forEach(k => { if (pending[k] === body[k]) delete pending[k]; }); setSync("🟢 기기 간 동기화 중 (노트북 서버)"); } else setSync("🟠 서버 저장 실패 — 이 기기에 임시 저장");
    } catch (e) { setSync("🟠 서버 연결 끊김 — 이 기기에 임시 저장"); scheduleFlush(); }
  }
  function setSync(text) { const el = document.getElementById("sync-state"); if (el) el.textContent = text; }
  window.addEventListener("pagehide", () => { if (Object.keys(pending).length) flush(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && Object.keys(pending).length) flush(); });
  window.Store = Store;
})();
