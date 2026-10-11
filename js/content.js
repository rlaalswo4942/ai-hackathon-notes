/* AI 해커톤 학습노트 - 사이트 설정 + 보강 자료
 * 교재 본문·문제·출처의 원본은 content/ 폴더 (수정 금지, 앱이 읽어서 그대로 표시):
 *   content/textbook.md   ← SK_hynix_AI_해커톤_2026_완전초보_상세학습패키지_v2 / 01_AI_완전초보_상세교재.md (U00~U12, 사전, 복습)
 *   content/questions.json ← 02_단계별_학습문제_데이터.json (80문항, 정답·해설 원본)
 *   content/sources.json   ← 04_출처_목록.json (S01~S24)
 * 이 파일의 EXTRA(보강 P1~P4)는 2026-10-12 웹 조사로 추가한 자료. 출처 R01~R10은 원문을 직접 열어 확인했고,
 * 교재 출처(S번호)와 겹치지 않게 R 번호를 쓴다. '기출·출제 확정·합격률·배점' 표현 금지.
 * 보강 단원: { id(저장 키 — 바꾸지 말 것), tag, title, en, color, icon, desc, goals, sections: [{ id, t, h(HTML), tip, src }] }
 */
window.SITE = {
  title: "AI 해커톤 학습노트",
  icon: "🧠",
  sub: "AI 기초 지식 및 활용 역량 — 처음 배우는 사람을 위한 단계별 학습",
  unit: "", unitPrefix: "", unitEn: "UNIT",
  by: "",
  key: "hynixai",
  syncApi: "https://ai-hackathon-sync.vercel.app/api/state"
};

(function () {
  const OFF = '<span class="lb off">공식공지</span>', NEWS = '<span class="lb news">언론 보도</span>', TECH = '<span class="lb tech">기술근거</span>',
    PLAN = '<span class="lb plan">학습구성</span>', ADD = '<span class="lb add">보강</span>';

  window.RESEARCH_SOURCES = {
    R01: { kind: "언론 보도", t: "헤럴드경제 2026-09-21 「SK하이닉스, 'AI 해커톤 2026' 개최…실전 활용 역량 겨룬다」", u: "https://biz.heraldcorp.com/article/10880376" },
    R02: { kind: "언론 보도", t: "머니투데이 보도(서플 게재) 2026-08-28 — 크래프톤 Cofa-Probe 현장 검증", u: "https://supple.kr/news/cmtcb5pq300xb2a0fyivlx10j" },
    R03: { kind: "AI 기술 자료", t: "Anthropic — Building effective agents (2024-12-19)", u: "https://www.anthropic.com/research/building-effective-agents" },
    R04: { kind: "AI 기술 자료", t: "OpenAI Codex — Best practices", u: "https://learn.chatgpt.com/guides/best-practices" },
    R05: { kind: "기업 공식 자료", t: "SK hynix — Company History", u: "https://www.skhynix.com/company/UI-FR-CP05/" },
    R06: { kind: "기업 공식 자료", t: "SK하이닉스 뉴스룸 — 2026년 2분기 경영실적 (2026-07-29)", u: "https://news.skhynix.co.kr/q2-2026-business-results/" },
    R07: { kind: "기업 공식 자료", t: "SK하이닉스 뉴스룸 — AI 산업 생태계 톺아보기 2편 (2025-08-21)", u: "https://news.skhynix.co.kr/exploring-the-ai-industry-ep2/" },
    R08: { kind: "기업 공식 자료", t: "SK하이닉스 뉴스룸 — 세계 최초 HBM4 12단 샘플 공급 (2025-03-19)", u: "https://news.skhynix.co.kr/sk-hynix-hbm4-sample/" },
    R09: { kind: "기업 공식 자료", t: "SK하이닉스 뉴스룸 — 가상 계측 AI 'Panoptes VM' 양산 적용 (2023-01-10)", u: "https://news.skhynix.co.kr/panoptes_vm/" },
    R10: { kind: "기업 공식 자료", t: "SK하이닉스 뉴스룸 — 세계 최초 12단 HBM3E 양산 (2024-09-26)", u: "https://news.skhynix.co.kr/12hi-hbm3e-production/" }
  };

  window.EXTRA = [
  {
   id: "info", tag: "P1", title: "대회 정보 보강", en: "자격 · 혜택 · 보도된 평가 방식", color: "#0f766e", icon: "📅",
   desc: "교재 첫 부분(공식 일정)에 없는 참가 자격·혜택·운영 주체와, 언론에 보도된 평가 방식",
   goals: ["공식 공지와 언론 보도, 미확인 사항을 구분할 수 있다"],
   sections: [
    { id: "eligibility", t: "참가 자격 · 혜택 · 운영 주체", h: `
     <p class="lead">${OFF} 아래는 대회 공식 페이지(S01)에 적힌 내용. 일정은 교재 '공부를 시작하기 전에'에 있다.</p>
     <ul>
      <li><b>자격</b>: 만 18세 이상 또는 2027년 3월 이내 고교 졸업(예정)자. 학력·전공·경력 제한 없음. <b>개인 참가만 가능</b>(팀 참가 없음).</li>
      <li>현재 SK하이닉스 채용 전형 진행 중이어도 지원 가능 — 해커톤은 기존 채용 전형과 독립 운영.</li>
      <li><b>혜택</b>: 총상금 1억원+, 우수자 <b>채용 Fast Track</b>(향후 입사 시 서류·필기(SKCT) 전형 면제, 신입/경력 무관 포지션 제안).</li>
      <li>주관 SK하이닉스 · Powered by 멋쟁이사자처럼 · AI 파트너 KRAFTON, COFA, OpenAI, programmers. 문의 support@skhynix-hackathon.com</li>
      <li>핵심 가치: <b>ZERO-BASE</b>(배경 무관, 논리적 AI 활용·문제 해결의 집요함) · <b>REAL BUSINESS</b>(SK하이닉스 현장 과제) · <b>SHOW &amp; PROVE</b>(제대로 작동하는 결과물).</li>
      <li>선호 인재상: AI 트렌드에 민감하고 새 툴을 업무에 적용하는 사람 / 복잡한 문제를 AI로 분석해 직관적·최적화된 결과물을 내는 사람 / 실력으로 증명하고 싶은 누구나.</li>
     </ul>`, src: ["S01"] },
    { id: "press", t: "보도로 확인된 평가 방식", h: `
     <ul>
      <li>${NEWS} 온라인 예선에서는 <b>AI 기본 활용 역량과 AI 리터러시</b>를 평가하고, 크래프톤의 AI 네이티브 채용·평가 솔루션 <b>'코파 프로브(Cofa-Probe)'</b> 등 AI 활용 역량 평가 도구로 문제 정의·AI 활용·결과 검증 과정을 종합적으로 본다.</li>
      <li>${NEWS} 본선(11/11, 코엑스): AI·반도체 분야 전문가 심사위원단이 <b>AI 기반 평가 결과, 문제 해결 과정, 결과물</b>을 종합해 수상자 선정. 본선 진출자 전원 AI 역량 인증서. 당일 SK하이닉스·OpenAI·크래프톤 실무자의 AI 트렌드 세미나(일반 공개).</li>
     </ul>
     <p><small>보도 내용은 공식 페이지 문구가 아니며, 1차 예선의 문항 수·시간·도구 허용 여부는 여전히 미확인 → 개별 응시 안내로 확인. Cofa-Probe 평가 축은 P2에서 다룬다.</small></p>`, src: ["S02", "R01"] }
   ]
  },
  {
   id: "u13", tag: "P2", title: "AI Native 협업 방식", en: "Cofa-Probe · Workflows · Agents", color: "#c2410c", icon: "🤝",
   desc: "보도된 평가 도구의 3축, 워크플로·에이전트 패턴, 코딩 에이전트 실무 원칙 — 2차 예선·본선 대비",
   goals: ["Cofa-Probe 3축(Technique·Intent·Cognition)과 각 축에 대응하는 교재 단원을 말할 수 있다", "5가지 워크플로 패턴과 에이전트를 구분한다", "AI에게 맡길 작업을 Goal·Context·Constraints·Done when으로 정의할 수 있다"],
   sections: [
    { id: "cofa", t: "Cofa-Probe: AI와 일하는 과정을 보는 평가", h: `
     <p>${ADD}${NEWS} 크래프톤의 AI 네이티브 채용·평가 솔루션으로, 이번 대회 예선 평가 도구 중 하나로 보도됨(R01). 아래는 크래프톤 발표를 다룬 보도 내용이며 <b>이번 대회의 실제 문항·배점과 같다는 뜻이 아니다</b>.</p>
     <ul>
      <li><b>환경</b>: 실제 업무와 비슷한 환경에서 여러 업무 에이전트와 상호작용하며 과제 수행.</li>
      <li><b>수집</b>: 대화·프롬프트·코드·도구 설정·검증 실행 기록을 자동 수집 → 결과물뿐 아니라 <b>과정</b>을 본다.</li>
      <li><b>사후 Q&amp;A</b>: 결과물과 의사결정 과정을 직접 설명.</li>
     </ul>
     <table>
      <tr><th>평가 축 (보도)</th><th>보는 것</th><th>교재 대응 단원</th></tr>
      <tr><td><b>Technique</b> 기술 관리</td><td>코드 실행, 구조, 보안</td><td>U09 · U10 · U11</td></tr>
      <tr><td><b>Intent</b> 의도 관리</td><td>목표·제약을 AI에 정확히 전달했는가</td><td>U07</td></tr>
      <tr><td><b>Cognition</b> 인지 관리</td><td>AI 결과물을 검증·수정하고, 작동 원리와 실패 지점을 설명할 수 있는가</td><td>U04 · U06</td></tr>
     </table>`, tip: "결과물만이 아니라 '문제 정의 → 지시 → 검증 → 수정' 과정이 기록된다고 가정하고 연습", src: ["R01", "R02"] },
    { id: "patterns", t: "워크플로 vs 에이전트, 5가지 패턴", h: `
     <p>${ADD}${TECH} <b>워크플로</b> = 미리 정의된 코드 경로로 LLM·도구를 조율 / <b>에이전트</b> = LLM이 스스로 절차·도구 사용을 결정. 기본 빌딩 블록은 검색·도구·메모리를 붙인 <b>증강 LLM</b>.</p>
     <table>
      <tr><th>패턴</th><th>방식</th><th>언제</th></tr>
      <tr><td>프롬프트 체이닝</td><td>앞 단계 출력을 다음 호출이 처리, 중간에 프로그램 검사</td><td>고정된 하위 작업으로 깔끔히 나뉠 때</td></tr>
      <tr><td>라우팅</td><td>입력을 분류해 전문 처리로 보냄</td><td>범주별 처리가 다르고 분류가 정확할 때</td></tr>
      <tr><td>병렬화</td><td>하위 작업 동시 실행(분할) 또는 같은 작업 반복(투표)</td><td>속도·다각도 검토가 필요할 때</td></tr>
      <tr><td>오케스트레이터-워커</td><td>중앙 LLM이 실행 중 작업을 나눠 위임·종합</td><td>하위 작업을 미리 알 수 없을 때</td></tr>
      <tr><td>평가자-최적화</td><td>한 LLM이 생성, 다른 LLM이 평가·피드백 반복</td><td>평가 기준이 명확하고 반복이 효과적일 때</td></tr>
     </table>
     <p><b>에이전트</b>는 단계 수를 예측할 수 없는 열린 문제에 쓰되, 매 단계 환경에서 실제 결과(도구 결과·코드 실행)를 확인하고, 반복 횟수 제한 등 <b>멈춤 조건</b>과 샌드박스 테스트·가드레일을 둔다.</p>`,
     tip: "가장 단순한 해법부터 — 필요할 때만 복잡도를 올린다", src: ["R03"] },
    { id: "principles", t: "에이전트 설계 3원칙과 도구 설계", h: `
     <p>${ADD}${TECH}</p>
     <ol>
      <li><b>단순하게</b> 설계한다.</li>
      <li>에이전트의 계획 단계를 명시적으로 보여 <b>투명하게</b> 한다.</li>
      <li>도구 문서화·테스트로 <b>에이전트-컴퓨터 인터페이스(ACI)</b>를 신중히 만든다.</li>
     </ol>
     <ul>
      <li>도구 정의에도 메인 프롬프트만큼 공을 들인다: 사용 예시, 경계 사례, 입력 요건, 비슷한 도구 간 경계.</li>
      <li>실수하기 어렵게(poka-yoke) 만든다 — 예: 상대 경로 대신 <b>절대 경로</b>를 요구해 오류 제거.</li>
      <li>프레임워크는 내부 프롬프트·응답을 가려 디버깅을 어렵게 할 수 있다 → 쓰더라도 내부 동작을 이해하고 쓴다.</li>
     </ul>`, src: ["R03"] },
    { id: "codex", t: "코딩 에이전트와 일하는 법", h: `
     <p>${ADD}${TECH} OpenAI Codex 공식 가이드의 실무 원칙 (대회 AI 파트너: OpenAI)</p>
     <ul>
      <li>지시 4요소: <b>Goal</b>(목표) · <b>Context</b>(관련 파일·문서·에러) · <b>Constraints</b>(표준·규칙) · <b>Done when</b>(완료 전에 참이어야 할 것). → 교재 U07의 6칸 구조와 대응.</li>
      <li>복잡하거나 모호한 작업은 <b>먼저 계획</b>하게 한다. 대략적 아이디어는 AI가 질문해 구체화하게 할 수 있다.</li>
      <li>반복 규칙은 매번 프롬프트에 쓰지 말고 <b>AGENTS.md</b>에 둔다(구조·실행법·빌드/테스트 명령·규칙·금지사항·완료 기준). 짧고 정확하게, 같은 실수가 반복될 때 규칙 추가.</li>
      <li>변경으로 끝내지 말고 <b>테스트 작성·관련 검사 실행·요청과 동작 일치 확인</b>, 수락 전 diff 리뷰.</li>
      <li>권한·샌드박스는 기본값으로 시작해 신뢰된 작업에서만 완화. 한 대화 = 한 작업 단위.</li>
      <li>흔한 실수: 계획 없이 다단계 작업, 워크플로 이해 전 넓은 권한 부여, 프로젝트 전체를 한 대화로.</li>
     </ul>`, tip: "Intent = 목표·맥락·제약·완료 기준을 명확히 / Cognition = 테스트·검사로 직접 확인", src: ["R04"] }
   ]
  },
  {
   id: "u14", tag: "P3", title: "SK하이닉스 기업 분석", en: "Company · HBM · Fab AI", color: "#e11d48", icon: "💾",
   desc: "회사 연혁, AI 메모리(HBM)와 TSV·MR-MUF, 2026년 2분기 실적, 제조 현장의 AI 활용 — 본선 대비",
   goals: ["SK하이닉스의 주력 제품과 HBM의 구조를 설명할 수 있다", "AI 시대에 메모리가 중요한 이유를 말할 수 있다", "반도체 제조 현장에서 AI가 쓰이는 사례를 데이터 관점으로 설명할 수 있다"],
   sections: [
    { id: "history", t: "회사 개요와 연혁", h: `
     <p>${ADD}${TECH} 회사 공식 연혁 기준</p>
     <table>
      <tr><th>연도</th><th>내용</th></tr>
      <tr><td>1983</td><td>현대전자산업 설립</td></tr>
      <tr><td>2001</td><td>하이닉스반도체로 사명 변경</td></tr>
      <tr><td>2012</td><td>SK텔레콤이 최대주주(2월) → SK하이닉스로 사명 변경(3월)</td></tr>
      <tr><td>2013</td><td>세계 최초 TSV 기반 HBM 개발</td></tr>
      <tr><td>2021</td><td>세계 최초 HBM3 개발</td></tr>
      <tr><td>2024</td><td>세계 최초 12단 HBM3E 양산, 세계 최초 321단 낸드 양산, 10나노급 6세대(1c) DDR5 개발</td></tr>
      <tr><td>2025</td><td>세계 최초 HBM4 12단 샘플 공급(3월), HBM4 개발 완료(9월)</td></tr>
     </table>
     <p>주력: <b>D램</b>(HBM·서버/모바일 D램 등)과 <b>낸드플래시</b>(eSSD 등) 메모리 반도체.</p>`, src: ["R05"] },
    { id: "hbm", t: "AI와 메모리, 그리고 HBM", h: `
     <p>${ADD}${TECH}</p>
     <ul>
      <li><b>메모리 병목</b>: GPU는 병렬 연산으로 AI를 가속했지만 프로세서와 메모리 사이 데이터 병목이 과제 — 데이터를 얼마나 빨리 읽고 쓰는지가 AI 성능의 핵심.</li>
      <li><b>HBM(고대역폭 메모리)</b>: 여러 D램을 <b>TSV</b>로 수직 연결·적층해 기존 D램보다 데이터 처리 속도를 크게 높인 고성능 제품.</li>
      <li><b>TSV</b>: D램 칩에 미세한 구멍을 수천 개 뚫어 위아래 칩을 수직 관통 전극으로 연결하는 어드밴스드 패키징 기술.</li>
      <li><b>MR-MUF</b>: 칩을 쌓은 뒤 칩 사이에 액체 보호재를 주입해 굳히는 공정. 필름형 소재 방식보다 효율적이고 열 방출에 유리. <b>어드밴스드 MR-MUF</b>는 적층 압력을 줄이고 휨(warpage) 제어를 높임.</li>
      <li>세대: HBM → HBM2 → HBM2E → HBM3 → HBM3E(5세대) → <b>HBM4</b>(6세대).</li>
      <li>HBM3E 12단: 36GB, 9.6Gbps. HBM4 12단 샘플: 36GB, 초당 2TB 이상(HBM3E 대비 60% 이상 빠름).</li>
      <li>전략: 빅테크 ASIC 수요에 맞춘 <b>커스텀 HBM</b>, '풀스택 AI 메모리 프로바이더' 지향. 협력: 엔비디아(HBM4 공개), TSMC(CoWoS 패키징).</li>
     </ul>`, tip: "HBM = D램 수직 적층(TSV) → 대역폭↑ · AI 성능의 병목은 메모리", src: ["R07", "R08", "R10"] },
    { id: "q2", t: "최근 실적: 2026년 2분기", h: `
     <p>${ADD}${TECH} 회사 발표(2026-07-29, K-IFRS, 외부 감사 전)</p>
     <table>
      <tr><th>항목</th><th>2026 Q2</th><th>비고</th></tr>
      <tr><td>매출</td><td>약 79.3조 원</td><td>전분기 +51%, 전년 동기 +257%</td></tr>
      <tr><td>영업이익</td><td>약 60.5조 원</td><td>영업이익률 76%</td></tr>
      <tr><td>순이익</td><td>약 93.9조 원</td><td>분기 사상 최대, 상반기 누적 매출 첫 100조 원대</td></tr>
     </table>
     <ul>
      <li>D램·낸드 가격 동반 상승, HBM·AI 서버용 D램·eSSD 등 고부가 제품이 성장 주도. 회사는 <b>AI 에이전트 확산이 메모리 수요 기반을 넓힌다</b>고 설명.</li>
      <li>HBM4 2분기 대량 출하 시작·하반기 생산 확대, HBM4E 상반기 샘플 공급, SOCAMM2 판매 급증, 321단 낸드 비중 확대.</li>
      <li>주요 고객 포함 약 10개 고객사와 장기공급계약(LTA). M15X 양산 가속, 용인 첫 팹 클린룸 2027년 초 오픈 계획.</li>
     </ul>`, src: ["R06"] },
    { id: "fab-ai", t: "제조 현장의 AI: 가상 계측 Panoptes VM", h: `
     <p>${ADD}${TECH} 본선 주제가 '반도체 현장의 고민'이므로, 공개된 실제 적용 사례를 교재 U02~U04 개념으로 읽는 연습</p>
     <ul>
      <li><b>무엇</b>: SK하이닉스가 투자한 가우스랩스의 가상 계측 AI. 2022년 12월부터 양산 팹 적용, 박막 증착 공정부터.</li>
      <li><b>왜</b>: 박막 두께·굴절률은 품질과 직결되지만 실측은 시간·자원이 많이 들어 전수 측정이 어렵다.</li>
      <li><b>어떻게</b>: 장비 센서 데이터(챔버 압력·온도·가스 주입량·전류량 등) → 공정 결과 <b>예측</b> → 전수 검사에 가까운 효과.</li>
      <li><b>성과</b>: 예측값을 APC(공정 제어)와 연동해 공정 산포 평균 21.5% 감소, 수율 향상, 이상 상황 조기 포착.</li>
      <li><b>데이터 과제</b>: 적은 실측 데이터, 수백 개 센서 변수, 장비 상태 변화(데이터 드리프트)·정비에 따른 변화(데이터 시프트) → 중요 파라미터 추천, 엔지니어 도메인 지식 반영, 데이터 변화 자동 학습·모델 업데이트.</li>
     </ul>
     <blockquote>${PLAN} 연습 질문: 이 문제는 분류인가 회귀인가(U02)? 검증 데이터는 시점을 어떻게 나눠야 하나(U03)? 장비 정비 직후 성능이 떨어진다면 무엇을 의심하나?</blockquote>`,
     tip: "센서 데이터 → 공정 결과 예측(회귀) · 드리프트/시프트 대응이 운영의 핵심", src: ["R09"] }
   ]
  },
  {
   id: "extra-review", tag: "P4", title: "보강 카드 · 비교분석", en: "v1 · v2 · 웹 조사 비교", color: "#475569", icon: "🗒️",
   desc: "보강 자료의 외울 문장, 교재 v1·v2·웹 조사 비교 결과와 반영 원칙",
   goals: ["보강 카드 K1~K6을 보지 않고 말할 수 있다"],
   sections: [
    { id: "cards", t: "보강 핵심 카드 K1~K6", h: `
     <table>
      <tr><th>ID</th><th>외울 핵심 문장</th><th>출처</th></tr>
      <tr><td>K1</td><td>Cofa-Probe 3축(보도): Technique(기술 관리)·Intent(의도 관리)·Cognition(인지 관리).</td><td>R02</td></tr>
      <tr><td>K2</td><td>워크플로는 미리 정의된 코드 경로, 에이전트는 LLM이 스스로 절차·도구를 결정한다.</td><td>R03</td></tr>
      <tr><td>K3</td><td>가장 단순한 해법부터 시작하고 필요할 때만 복잡도를 올린다.</td><td>R03</td></tr>
      <tr><td>K4</td><td>AI에게 맡길 때: Goal · Context · Constraints · Done when.</td><td>R04</td></tr>
      <tr><td>K5</td><td>HBM은 여러 D램을 TSV로 수직 연결·적층한 고대역폭 메모리다.</td><td>R07, R10</td></tr>
      <tr><td>K6</td><td>가상 계측은 장비 센서 데이터로 공정 결과를 예측해 전수 검사에 가까운 효과를 낸다.</td><td>R09</td></tr>
     </table>
     <p><small>🙈 가림펜으로 가운데 열을 가리고 ID만 보고 말해 보세요. 탭하면 정답이 보입니다.</small></p>` },
    { id: "compare", t: "자료 비교와 반영 결과", h: `
     <table>
      <tr><th>자료</th><th>구성</th><th>이 사이트 반영</th></tr>
      <tr><td>01_검증된_학습교재 (v1)</td><td>12단원 요약, 출처 18</td><td>v2가 v1 내용을 포함·확장 → <b>v2로 교체</b></td></tr>
      <tr><td>완전초보 상세학습패키지 (v2)</td><td>U00~U12 상세 본문, 문제 80, 출처 24, 사전·15쌍 비교·공식·25문항 복습</td><td>본문·문제·출처 <b>원본 그대로</b> 표시 (요약·재작성 없음), 연습문제·계산기·사전 기능</td></tr>
      <tr><td>웹 조사 (2026-10-12)</td><td>대회 자격·혜택, 보도된 평가 방식, AI Native 협업, SK하이닉스 기업·제조 AI</td><td>P1~P4 보강 단원 (출처 R01~R10)</td></tr>
     </table>
     <ul>
      <li>v2 교재는 1차 예선(AI 기초 지식·활용)에 맞춰 충실하다. 비어 있던 것은 <b>2차 예선(AI Native)</b>과 <b>본선(반도체 현장)</b> 대비 → P2·P3.</li>
      <li>v2와 v1의 차이: U00 입문 신설, 회귀·함수 호출·프롬프트 인젝션·OCR·생성형 AI 용어·ML 문제 정의 출처(S19~S24) 추가, S13·S15 링크 최신화, 문제 38→80.</li>
      <li>보강 출처는 교재의 S 번호와 겹치지 않게 <b>R 번호</b>로 구분했다. 언론 보도는 '언론 보도'로, 공식 사이트 사실만 '공식공지'로 표시.</li>
      <li>교재 S01~S24 링크는 패키지 작성자가 확인한 것으로 보고 다시 열지 않았다. R01~R10은 2026-10-12에 원문을 직접 확인.</li>
     </ul>` }
   ]
  }
  ];
})();
