/* 공부노트 - 앱 본체: 라우팅, 홈(2×n 카테고리), 사이드바, 단원 페이지, 체크리스트 */
(function () {
  const SITE = window.SITE, LECS = window.LECTURES;
  const unit = L => L.tag || `${SITE.unitPrefix || ""}${L.no}${SITE.unit}`; // 예: "3강", "U03", 단원별 tag 우선
  // 섹션 src: ["S01", ...] → 하단에 근거 자료 목록 (window.SOURCES 의 제목·URL)
  function srcHtml(ids) {
    if (!ids || !ids.length) return "";
    const S = window.SOURCES || {};
    return `<div class="src"><b>📎 근거 자료</b><ul>${ids.map(id => { const s = S[id]; return `<li><span class="sid">${id}</span>${s ? `${s.t} — <a href="${s.u}" target="_blank" rel="noopener">${s.u.replace(/^https?:\/\//, "")}</a>` : "(출처 목록에 없음)"}</li>`; }).join("")}</ul></div>`;
  }
  const main = document.getElementById("main");
  const crumb = document.getElementById("crumb");
  let scale = 1, page = null, scaler = null, ro = null;

  document.title = SITE.title;
  document.querySelector('link[rel="icon"]') || document.head.insertAdjacentHTML("beforeend", `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${SITE.icon}</text></svg>">`);

  /* ── 진행도 ── */
  const checks = () => Store.get("checks", {});
  const goalsSt = () => Store.get("goals", {});
  function isDone(lid, sid) { const c = checks(); return !!(c[lid] && c[lid][sid]); }
  function setDone(lid, sid, v) { const c = checks(); (c[lid] = c[lid] || {})[sid] = v; if (!v) delete c[lid][sid]; Store.set("checks", c); }
  function progress(L) { const c = checks()[L.id] || {}; const n = L.sections.filter(s => c[s.id]).length, total = L.sections.length; return { n, total, pct: total ? Math.round(n / total * 100) : 0 }; }
  function overall() { let n = 0, t = 0; LECS.forEach(L => { const p = progress(L); n += p.n; t += p.total; }); return { n, t, pct: t ? Math.round(n / t * 100) : 0 }; }

  /* ── 사이드바 ── */
  function renderSide() {
    const nav = document.getElementById("side-nav");
    const route = (parseHash()[0] || "").replace(/^home$/, "");
    let h = `<button class="side-item ${route === "" ? "active" : ""}" data-go="#home"><span class="ico" style="background:#eef">🏠</span><span class="txt"><span>홈 · 전체 목차</span><small>전체 진도 ${overall().pct}%</small></span></button>`;
    LECS.forEach(L => {
      const p = progress(L);
      h += `<button class="side-item ${route === L.id ? "active" : ""}" data-go="#${L.id}"><span class="ico" style="background:${L.color}22">${L.icon}</span><span class="txt"><small>${unit(L)} · ${p.n}/${p.total}</small><span>${L.title}</span><div class="mini-bar"><i style="width:${p.pct}%;background:${L.color}"></i></div></span></button>`;
    });
    nav.innerHTML = h;
  }
  document.getElementById("side-nav").addEventListener("click", e => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    location.hash = b.dataset.go;
    if (window.innerWidth < 900) setSide(false);
  });
  function setSide(open) { document.body.classList.toggle("side-closed", !open); Store.set("sideOpen", open); setTimeout(fit, 280); }
  document.getElementById("side-toggle").addEventListener("click", () => setSide(document.body.classList.contains("side-closed")));
  document.getElementById("side-close").addEventListener("click", () => setSide(false));

  /* ── 홈: 2×n 카테고리 그리드 ── */
  function renderHome() {
    const o = overall();
    let h = `<div class="home"><h1>${SITE.icon} ${SITE.title}</h1><p class="sub">${SITE.sub}</p>
      <div class="cat-grid">`;
    LECS.forEach(L => {
      const p = progress(L), img = L.thumb || L.summary;
      const thumb = img ? `<span class="thumb" style="background-image:url('${img}')">` : `<span class="thumb noimg" style="background:linear-gradient(135deg, ${L.color}33, ${L.color}11)">${L.icon}`;
      h += `<button class="cat" data-go="#${L.id}">
        ${thumb}<span class="no" style="background:${L.color}">${unit(L)}</span></span>
        <span class="body"><b>${L.icon} ${L.title}</b><small>${L.en || ""}</small><p>${L.desc || ""}</p>
        <span class="prog"><span class="mini-bar"><i style="width:${p.pct}%;background:${L.color}"></i></span>${p.n}/${p.total} 완료</span></span></button>`;
    });
    h += `</div>
      <div class="overall" style="margin-top:16px"><b>전체 진도</b><span class="bar"><i style="width:${o.pct}%"></i></span><b>${o.pct}%</b><small>${o.n}/${o.t} 섹션</small></div>
      <div class="howto"><h3>✍️ 사용법</h3>
      <b>필기 툴바</b>(${SITE.unit === "강" ? "강의" : "단원"} 페이지 오른쪽): ✏️ 펜 · 🖍️ 형광펜 · 🙈 가림펜 · 🧽 지우개 · ↶ 실행취소<br>
      • <b>가림펜</b>: 외울 부분을 칠하면 가려지고, <b>탭(클릭)하면 투명</b>해져 답이 보입니다. 다시 탭하면 다시 가려져요. 👁️로 페이지 전체 보기/가리기.<br>
      • <b>🧲 스냅</b>(기본 켬): 형광펜·가림펜으로 대충 칠해도 <b>글자/단어 크기에 딱 맞게</b> 정리되고, 그림 위에서는 그림 속 글자·선 영역에 맞춰 사각형으로 맞춰집니다.<br>
      • <b>🖊️ 펜전용</b>: 아이패드/갤럭시탭에서 켜면 손가락은 스크롤, 펜(애플펜슬·S펜)으로만 필기됩니다.<br>
      • 단축키: <kbd>V</kbd> 읽기 <kbd>P</kbd> 펜 <kbd>H</kbd> 형광펜 <kbd>M</kbd> 가림펜 <kbd>E</kbd> 지우개 <kbd>Ctrl+Z</kbd> 취소<br>
      <b>체크리스트</b>: 세부 섹션마다 "공부 완료"를 눌러 진도를 기록하세요. 홈과 사이드바에 진도율이 표시됩니다.<br>
      <b>저장</b>: 필기와 체크는 이 기기(브라우저)에 자동 저장돼요. 노트북과 태블릿을 오갈 땐 왼쪽 목차 아래 <b>💾 백업 저장</b>으로 파일을 만들고, 다른 기기에서 <b>📂 백업 불러오기</b>로 여세요.</div></div>`;
    main.innerHTML = h;
    main.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => (location.hash = b.dataset.go)));
  }

  /* ── 단원 페이지 ── */
  function renderLecture(L, anchor) {
    const p = progress(L);
    const C = 2 * Math.PI * 34;
    const goals = L.goals || [];
    let h = `<div class="hero" style="background:linear-gradient(135deg, ${L.color}, ${L.color}cc)">
      <div class="k">${L.tag || `${SITE.unitEn} ${L.no}`}</div><h1>${L.icon} ${L.title}</h1><div class="en">${[L.en, SITE.by].filter(Boolean).join(" · ")}</div>
      <div class="hero-row"><button data-jump="checklist">✅ 체크리스트</button>${L.summary ? `<button data-jump="summary">🖼️ 핵심정리 시트</button>` : ""}${goals.length ? `<button data-jump="goals">🎯 학습목표 점검</button>` : ""}</div>
      <svg class="ring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="8"/><circle class="ring-fg" cx="42" cy="42" r="34" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p.pct / 100)}" transform="rotate(-90 42 42)"/></svg>
      <div class="ring"><b class="ring-txt">${p.pct}%</b></div></div>`;
    // 체크리스트
    h += `<div class="card" id="checklist"><h2>✅ 공부 체크리스트 <small style="font-size:13px;color:var(--sub);font-weight:500">(${L.sections.length}개 세부 섹션 · 체크하면 진도에 반영)</small></h2><div class="checklist">`;
    L.sections.forEach((s, i) => (h += `<div class="ck ${isDone(L.id, s.id) ? "done" : ""}" data-sec="${s.id}"><span class="num">${i + 1}</span><span class="box"></span><span class="lbl">${s.t}</span><span class="go" data-goto="${s.id}">이동 ›</span></div>`));
    h += `</div></div>`;
    // 섹션 (p: 슬라이드 페이지 번호 → img/slides/<단원id>/pNN.jpg, 없으면 본문만 넓게)
    L.sections.forEach((s, i) => {
      const slides = (s.p || []).map(n => `<div class="slide"><img src="img/slides/${L.id}/p${String(n).padStart(2, "0")}.jpg" width="1400" height="788" loading="lazy" decoding="async" alt="${unit(L)} 슬라이드 ${n}"><span class="pg">p.${n}</span></div>`).join("");
      const wide = s.wide || !slides;
      h += `<section class="sec ${isDone(L.id, s.id) ? "done" : ""}" id="s-${s.id}" data-sec="${s.id}">
        <div class="sec-head"><span class="n">${i + 1}</span><h3>${s.t}</h3><button class="done-btn">${isDone(L.id, s.id) ? "✓ 완료" : "공부 완료"}</button></div>
        <div class="sec-body ${wide ? "wide" : ""}"><div class="notes">${s.h || ""}${s.tip ? `<div class="tip">${s.tip}</div>` : ""}${srcHtml(s.src)}</div>${slides ? `<div class="slides">${slides}</div>` : ""}</div></section>`;
    });
    // 요약 시트, 학습목표 (있을 때만)
    if (L.summary) h += `<div class="card" id="summary"><h2>🖼️ ${unit(L)} 핵심정리 시트</h2><img class="summary-img" src="${L.summary}" loading="lazy" alt="${unit(L)} 핵심정리"></div>`;
    if (goals.length) {
      const gs = goalsSt()[L.id] || {};
      h += `<div class="card" id="goals"><h2>🎯 학습목표 자가점검 <small style="font-size:13px;color:var(--sub);font-weight:500">설명할 수 있으면 체크</small></h2><div class="checklist" style="grid-template-columns:1fr">`;
      goals.forEach((g, i) => (h += `<div class="ck goal ${gs[i] ? "done" : ""}" data-goal="${i}"><span class="num">${i + 1}</span><span class="box"></span><span class="lbl">${g}</span></div>`));
      h += `</div></div>`;
    }
    const idx = LECS.indexOf(L), prev = LECS[idx - 1], next = LECS[idx + 1];
    h += `<div class="pn">${prev ? `<button data-go="#${prev.id}"><small>‹ 이전</small>${unit(prev)} ${prev.title}</button>` : "<span></span>"}${next ? `<button data-go="#${next.id}"><small>다음 ›</small>${unit(next)} ${next.title}</button>` : `<button data-go="#home"><small>마지막 ${SITE.unit === "강" ? "강의" : "단원"}</small>🏠 홈으로</button>`}</div>`;

    main.innerHTML = `<div class="scaler"><div class="page" id="page">${h}</div></div>`;
    scaler = main.querySelector(".scaler"); page = main.querySelector(".page");
    page.addEventListener("click", e => onPageClick(L, e));
    ro = new ResizeObserver(() => fit()); ro.observe(page);
    fit();
    Ink.attach(page, L.id, () => scale, main);
    if (anchor) requestAnimationFrame(() => jumpTo(anchor === "checklist" || anchor === "summary" || anchor === "goals" ? anchor : "s-" + anchor));
  }
  function onPageClick(L, e) {
    const t = e.target;
    const jump = t.closest("[data-jump]"); if (jump) return jumpTo(jump.dataset.jump);
    const go = t.closest("[data-goto]"); if (go) { e.stopPropagation(); return jumpTo("s-" + go.dataset.goto); }
    const nav = t.closest("[data-go]"); if (nav) return (location.hash = nav.dataset.go);
    const ck = t.closest(".ck[data-sec]"); if (ck) return toggleSec(L, ck.dataset.sec);
    const db = t.closest(".done-btn"); if (db) return toggleSec(L, db.closest(".sec").dataset.sec);
    const gl = t.closest(".ck.goal"); if (gl) { const g = goalsSt(); const o = (g[L.id] = g[L.id] || {}); o[gl.dataset.goal] = !o[gl.dataset.goal]; Store.set("goals", g); gl.classList.toggle("done", !!o[gl.dataset.goal]); return; }
    const img = t.closest(".slide img, .summary-img, .notes img"); if (img) openLightbox(img.src);
  }
  function toggleSec(L, sid) {
    const v = !isDone(L.id, sid); setDone(L.id, sid, v);
    page.querySelectorAll(`[data-sec="${sid}"]`).forEach(el => el.classList.toggle("done", v));
    const btn = page.querySelector(`#s-${sid} .done-btn`); if (btn) btn.textContent = v ? "✓ 완료" : "공부 완료";
    updateRing(L); renderSide();
    if (v) { const p = progress(L); toast(p.n === p.total ? `🎉 ${unit(L)} 모든 섹션 완료!` : `✓ 완료 (${p.n}/${p.total})`); }
  }
  function updateRing(L) {
    const p = progress(L), C = 2 * Math.PI * 34;
    const fg = page.querySelector(".ring-fg"); if (fg) fg.setAttribute("stroke-dashoffset", C * (1 - p.pct / 100));
    const tx = page.querySelector(".ring-txt"); if (tx) tx.textContent = p.pct + "%";
  }
  function jumpTo(id) {
    const el = page && page.querySelector("#" + id); if (!el) return;
    let y = 0, n = el; while (n && n !== page) { y += n.offsetTop; n = n.offsetParent; }
    main.scrollTo({ top: scaler.offsetTop + y * scale - 10, behavior: "smooth" });
  }
  function fit() {
    if (!page || !page.isConnected) return;
    const avail = main.clientWidth - (window.innerWidth >= 1000 ? 84 : 12); // 넓은 화면: 오른쪽 세로 툴바 공간 / 좁은 화면: 하단 툴바
    scale = Math.max(0.3, Math.min(1.25, avail / 1000));
    page.style.transform = `scale(${scale})`;
    scaler.style.width = 1000 * scale + "px";
    scaler.style.height = page.offsetHeight * scale + "px";
    Ink.resize();
  }
  window.addEventListener("resize", fit);

  /* ── 라이트박스 / 토스트 ── */
  const lb = document.getElementById("lightbox");
  function openLightbox(src) { if (document.body.classList.contains("drawing")) return; lb.querySelector("img").src = src; lb.classList.add("show"); }
  lb.addEventListener("click", () => lb.classList.remove("show"));
  let tt; function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); }

  /* ── 백업 (다른 기기로 옮기기) ── */
  const bExp = document.getElementById("btn-export"), bImp = document.getElementById("btn-import"), fImp = document.getElementById("file-import");
  bExp.addEventListener("click", () => {
    Ink.flushSave();
    const blob = new Blob([JSON.stringify(Store.exportAll())], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${SITE.title.replace(/\s+/g, "")}_백업_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("💾 백업 파일을 저장했어요. 다른 기기에서 '백업 불러오기'로 여세요");
  });
  bImp.addEventListener("click", () => fImp.click());
  fImp.addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    try { const n = Store.importAll(JSON.parse(await f.text())); toast(`📂 백업을 불러왔어요 (${n}개 항목)`); route(); }
    catch (err) { toast(`이 파일은 ${SITE.title} 백업 파일이 아니에요`); }
    e.target.value = "";
  });

  /* ── 라우팅: #home, #ch01, #ch01.섹션id (claude.ai Artifact 호환 위해 점 구분) ── */
  function parseHash() { return location.hash.replace(/^#\/?/, "").split(/[./]/); }
  function route() {
    const parts = parseHash();
    const id = parts[0] === "home" ? "" : parts[0] || "";
    Ink.detach();
    if (ro) { ro.disconnect(); ro = null; }
    page = null;
    main.scrollTop = 0;
    const L = LECS.find(l => l.id === id);
    if (L) { crumb.innerHTML = `${unit(L)} · ${L.title}<small>${L.en || ""}</small>`; renderLecture(L, parts[1]); }
    else { crumb.innerHTML = `${SITE.icon} ${SITE.title}<small>홈</small>`; renderHome(); }
    renderSide();
  }
  window.addEventListener("hashchange", route);
  Store.onRemote(keys => {
    if (!keys.includes("checks") && !keys.includes("goals")) return;
    if (!document.body.classList.contains("drawing")) { const y = main.scrollTop; route(); main.scrollTop = y; } else renderSide();
  });

  window.App = { toast, fit };
  if (Store.get("sideOpen", window.innerWidth >= 1100) === false || window.innerWidth < 900) document.body.classList.add("side-closed");
  route(); // 먼저 이 기기 저장분으로 그리고, 동기화가 연결되면 최신 내용으로 갱신
  Store.init().then(mode => {
    const el = document.getElementById("sync-state");
    el.textContent = mode === "cloud" ? "🟢 내 계정에 저장 · 기기 간 동기화" : mode === "server" ? "🟢 기기 간 동기화 중 (노트북 서버)"
      : mode === "readonly" ? "💾 이 기기에만 저장 (동기화하려면 편집 권한 필요)" : "💾 이 기기에 자동 저장 · 다른 기기로 옮길 땐 아래 백업";
  });
})();
