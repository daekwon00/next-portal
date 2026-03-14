# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # 개발 서버 (http://localhost:3000)
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint
pnpm format           # Prettier (src/**/*.{ts,tsx,json,md})
pnpm test             # Vitest 단위/컴포넌트 테스트 (전체)
pnpm test:watch       # Vitest watch 모드
pnpm test:e2e         # Playwright E2E 테스트
```

단일 테스트 실행:

```bash
pnpm vitest run tests/unit/format.test.ts        # 특정 단위 테스트
pnpm playwright test tests/e2e/auth.spec.ts      # 특정 E2E 테스트
```

## Architecture

Next.js 16 App Router + React 19 포털 애플리케이션. 백엔드는 별도 Spring Boot 서버 (localhost:8081).

### Route Groups

- `(auth)` — 로그인/회원가입 (공개)
- `(main)` — 일반 사용자 영역 (사이드바 레이아웃, 인증 필요)
- `(admin)` — 관리자 영역 (ADMIN role 필요)

### 인증 흐름

- NextAuth.js 5 (Auth.js) 사용. `src/middleware.ts`에서 경로별 접근 제어
- JWT 기반: accessToken/refreshToken. `src/lib/api/client.ts`에서 자동 토큰 갱신
- MSW 모킹: `NEXT_PUBLIC_API_MOCKING=true`이면 `instrumentation.ts`에서 서버 사이드 MSW 시작, 클라이언트는 `MswProvider`에서 시작

### API 클라이언트

- HTTP 클라이언트: `ky` (`src/lib/api/client.ts`)
- prefix: `/api/v1` → `next.config.ts` rewrites로 백엔드 프록시 (`localhost:8081`)
- 응답 래퍼 `{ success, data }` 자동 언래핑 처리됨
- 에러: `ApiError` 클래스 (status, message, errors)
- 도메인별 API 함수: `src/lib/api/{auth,board,post,user,admin,dashboard,system,file}.ts`

### 상태 관리

- 서버 상태: TanStack Query 5 (features 폴더 내 hooks에서 사용)
- 클라이언트 상태: Zustand (`src/stores/`)
- 폼: React Hook Form + Zod 스키마 (`features/*/schemas.ts`)

### Feature 모듈 패턴

`src/features/{domain}/` 각 도메인은:

- `components/` — 도메인 전용 UI 컴포넌트
- `hooks/` — TanStack Query 기반 데이터 페칭 훅
- `schemas.ts` — Zod 검증 스키마

### UI

- shadcn/ui 컴포넌트 (`src/components/ui/`)
- Tailwind CSS 4, path alias `@/*` → `./src/*`

### Provider 순서 (layout.tsx)

MswProvider > AuthProvider > ThemeProvider > QueryProvider > TooltipProvider

### 테스트

- 단위/컴포넌트: Vitest + jsdom + Testing Library (`tests/unit/`, `tests/components/`)
- E2E: Playwright (`tests/e2e/`), dev 서버 자동 시작
- MSW 핸들러: `mocks/handlers/`

### Pre-commit

Husky + lint-staged: `*.{ts,tsx}` → Prettier + ESLint fix

### Git 커밋 규칙

- 커밋 메시지에 `Co-Authored-By` 줄을 포함하지 않는다
- 작업이 끝나면 커밋 메시지를 제안하고 "커밋할까요?"라고 확인을 받는다
- 사용자가 "gogo", "commit" 등 진행 의사를 밝히면 `git commit`을 실행한다
- `.gitignore` 파일을 수정할 때는 반드시 사용자에게 변경 내용을 보여주고 확인을 받은 후 수정한다

## SDD (Spec-Driven Development)

- `prd.md` — 프로젝트 요구사항 정의
- `docs/progress.md` — Phase/Step별 진행 체크리스트
- `docs/phase-N/step-NN-*.md` — 단계별 작업 명세
- 새 작업 시작 전 progress.md 확인, 완료 시 체크 표시 업데이트
