# next-portal — Progress

## Phase 1: 프로젝트 초기 설정

- [x] Next.js 16 프로젝트 스캐폴딩
- [x] Tailwind CSS 4 + shadcn/ui 설정
- [x] TypeScript, ESLint, Prettier 설정
- [x] 디렉토리 구조 확립

## Phase 2: 앱 레이아웃

- [x] Route Groups 구성 — (auth), (main), (admin)
- [x] AppSidebar + AdminSidebar + AppHeader 컴포넌트
- [x] Provider 체인 구성
- [x] 다크모드 테마 토글

## Phase 3: 인증 시스템

- [x] NextAuth.js 5 + CredentialsProvider 설정
- [x] JWT accessToken/refreshToken 관리
- [x] Ky HTTP 클라이언트 자동 토큰 갱신
- [x] 로그인/회원가입 폼
- [x] 미들웨어 경로 보호 및 역할 체크
- [x] MSW 모킹 핸들러

## Phase 4: 게시판 시스템

- [x] 게시판 목록 (카드 UI)
- [x] 게시글 목록 (TanStack Table + 페이지네이션 + 검색)
- [x] 게시글 작성/수정 (Tiptap 에디터)
- [x] 파일 첨부 (드래그 앤 드롭)
- [x] 게시글 상세 보기 + 삭제 확인

## Phase 5: 사용자 기능 + 대시보드

- [x] 대시보드 통계 카드 4종 (Framer Motion)
- [x] 게시글 트렌드 차트 (Recharts, 7일/30일)
- [x] 최근 게시글 위젯
- [x] 사용자 프로필 조회/수정
- [x] 비밀번호 변경

## Phase 6: 관리자 기능

- [x] 관리자 대시보드
- [x] 사용자 관리 (목록/검색/등록/수정/활성화 토글)
- [x] 게시판 관리 (다이얼로그 CRUD)
- [x] 시스템 관리 (역할/메뉴/메뉴-역할/공통코드/직급-역할)

## Phase 7: 고도화

- [x] Step 1: 동적 메뉴 시스템 (Zustand + API)
- [ ] Step 2: MSW → 실제 API 전환
- [x] Step 3: 개발자 도구 (Prettier, Husky, lint-staged)
- [x] Step 4: 단위/컴포넌트 테스트 (31개)
- [x] Step 5: E2E 테스트 (7개)
- [x] Step 6: 성능 최적화 (lazy loading, 메타데이터)
- [ ] Step 7: AI 채팅 페이지
