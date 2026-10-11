# AI 해커톤 학습노트 (SK하이닉스 AI 해커톤 2026 예선 대비)

해부학_필기노트의 엔진(필기·체크리스트·동기화)을 가져와 만든 별도 공부 사이트. 3D 모형 없음. 빌드 도구 없음(순수 HTML/JS).
해부학_필기노트와는 공부하는 사람이 달라 **서로 링크·연결 금지**.

## 주소 · 배포
- **웹(정본)**: https://rlaalswo4942.github.io/ai-hackathon-notes/ — GitHub Pages(공개 repo rlaalswo4942/ai-hackathon-notes, main 루트), 입장 코드 없음, noindex. 커밋·푸시 후 1~2분 뒤 반영
- **동기화 API**: https://ai-hackathon-sync.vercel.app/api/state — `sync-api/` (Vercel 프로젝트 ai-hackathon-sync, 계정 rlaalswo4942-create), DB = Neon 프로젝트 `ai-hackathon-notes`(id long-queen-95331418, org-shy-pine-60967716) 테이블 `note_state(space,k,t,v,updated_at)`
  - 배포: `cd sync-api && vercel deploy --prod --yes`. DATABASE_URL은 Vercel 환경변수(Sensitive). **PowerShell 파이프로 env add 하면 값이 깨짐** → node로 stdin에 개행 없이 써서 등록했음
  - CORS 허용: rlaalswo4942.github.io, localhost/LAN
- 로컬: `학습노트_열기.bat` → `server.py`(포트 8766) — 개발·확인용

## 저장 · 동기화 (js/store.js)
- 키별 `{t, v}` 최신값 우선. localStorage 접두어 `hynixai:`
- 웹: 사이드바 '🔗 동기화 설정'에서 동기화 코드 입력 → `space = sha256("hynixai:" + 코드)`만 서버로 전송. 3초 폴링 수신, 0.7초 뒤 송신, 오프라인이면 재시도
- `LOCAL_ONLY`(sideOpen·inkopts 등)는 기기별로 두고 동기화 안 함
- 한계: 같은 페이지 필기(ink:단원id)는 페이지 단위 LWW → 두 기기 동시 필기 시 나중 저장이 이김

## 콘텐츠
- `content/textbook.md` `questions.json` `sources.json` = 바탕화면 `SK_hynix_AI_해커톤_2026_완전초보_상세학습패키지_v2.zip`의 01·02·04 **원본 그대로 (수정 금지)**. 앱이 런타임에 파싱:
  - `# U00.`~`# U12.` → 단원(섹션 = `###`), `# 공부를 시작하기 전에` → START(섹션 = `##`), `# 초보자 핵심 사전` → #dict, 나머지 끝부분 → REVIEW
  - 마크다운은 vendor/marked 12.0.2 + DOMPurify 3.1.6로 렌더(임의 HTML 차단). `\[...\]` 수식은 텍스트로 변환(원본은 title). 한글 조사 앞 `**굵게**`는 boldFix로 처리
  - `[공식공지]` 등 태그 → 라벨, `[S03]` → 출처 링크
- `js/content.js` = SITE 설정 + 보강 단원 EXTRA(P1~P4) + 보강 출처 R01~R10(교재 S번호와 충돌 방지용 R번호)
- 문제: choices·answerIndex·explanation 원본 그대로, 문제 순서만 섞음. 정답률 = 정답/채점된 응답(미응답 제외)
- 원본 규칙: 교재에 새 사실 임의 추가 금지, '기출·출제 확정·합격률·배점' 표현 금지, 보강은 원문 확인 후 R번호 등록

## 구조
- `js/app.js` 라우팅(#home #guide #start #u00~#u12 #review #quiz(.U04) #calc #dict #sources #info #u13 #u14 #extra-review), 사이드바 카테고리
- `js/draw.js` 필기(펜·형광펜·가림펜·지우개, 스냅, 색 프리셋+자유 색상+굵기 슬라이더)
- 단원 id(u00…, info, u13, u14, extra-review)와 섹션 id(s01…)는 필기·체크 저장 키 → 바꾸지 말 것
