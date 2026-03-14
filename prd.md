# next-portal — PRD (Product Requirements Document)

## 프로젝트 개요

사내 인트라넷 포털 웹 애플리케이션. Spring Boot 백엔드 API와 연동하여 게시판, 사용자 관리,
대시보드, 관리자 기능을 제공하는 풀스택 프론트엔드.

## 기술 스택

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + shadcn/ui
- TanStack Query 5 (서버 상태) + Zustand (클라이언트 상태)
- React Hook Form + Zod (폼 검증)
- NextAuth.js 5 (인증)
- MSW (개발용 API 모킹)
- Vitest + Playwright (테스트)

## Phase 구성

### Phase 1: 프로젝트 초기 설정

- Next.js 16 프로젝트 스캐폴딩
- Tailwind CSS 4 + shadcn/ui 설정
- TypeScript, ESLint, Prettier 설정
- 디렉토리 구조 확립 (features/, components/, lib/, types/)

### Phase 2: 앱 레이아웃

- Route Groups: (auth), (main), (admin) 구성
- AppSidebar / AdminSidebar / AppHeader 레이아웃 컴포넌트
- Provider 체인: MswProvider > AuthProvider > ThemeProvider > QueryProvider > TooltipProvider
- 다크모드 (Light/Dark/System) 테마 토글

### Phase 3: 인증 시스템

- NextAuth.js 5 + CredentialsProvider
- JWT 기반 accessToken/refreshToken 관리
- Ky HTTP 클라이언트 자동 토큰 갱신
- 로그인/회원가입 폼 (React Hook Form + Zod)
- 미들웨어 기반 경로 보호 및 역할 체크
- MSW 모킹 핸들러

### Phase 4: 게시판 시스템

- 게시판 목록 (카드 UI)
- 게시글 목록 (TanStack Table + 페이지네이션 + 검색)
- 게시글 작성/수정 (Tiptap 리치 텍스트 에디터)
- 파일 첨부 (드래그 앤 드롭, 최대 5개 10MB)
- 게시글 상세 보기 + 삭제 확인 다이얼로그

### Phase 5: 사용자 기능 + 대시보드

- 대시보드: 통계 카드 4종 (Framer Motion 애니메이션)
- 게시글 트렌드 차트 (Recharts, 7일/30일)
- 최근 게시글 위젯
- 사용자 프로필 조회/수정
- 비밀번호 변경

### Phase 6: 관리자 기능

- 관리자 대시보드 (통계 + 최근 가입자)
- 사용자 관리 (목록/검색/등록/수정/활성화 토글)
- 게시판 관리 (다이얼로그 기반 CRUD)
- 시스템 관리 (탭 UI): 역할, 메뉴, 메뉴-역할 매핑, 공통코드, 직급-역할 매핑

### Phase 7: 고도화

- Step 1: 동적 메뉴 시스템 (Zustand + API 기반 역할별 메뉴)
- Step 2: MSW → 실제 API 전환 (백엔드 완성 시)
- Step 3: 개발자 도구 (Prettier, Husky, lint-staged)
- Step 4: 단위/컴포넌트 테스트 (Vitest, 31개)
- Step 5: E2E 테스트 (Playwright, 7개)
- Step 6: 성능 최적화 (Tiptap/Recharts lazy loading, 메타데이터)
- Step 7: AI 채팅 페이지 (백엔드 완성 시)
