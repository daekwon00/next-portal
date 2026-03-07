# 도움말 (HELP)

Next Portal 프로젝트를 처음 접하는 사용자를 위한 가이드입니다.

## 목차

- [빠른 시작](#빠른-시작)
- [개발 모드](#개발-모드)
- [자주 묻는 질문](#자주-묻는-질문)
- [문제 해결](#문제-해결)
- [개발 가이드](#개발-가이드)

---

## 빠른 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 복사 및 설정
cp .env.example .env.local

# 3. 개발 서버 실행
pnpm dev
```

브라우저에서 http://localhost:3000 을 열면 됩니다.

---

## 개발 모드

### 백엔드 없이 개발하기 (MSW 모킹)

`.env.local`에 아래 설정이 되어 있으면 백엔드 서버 없이 목 데이터로 개발할 수 있습니다:

```
NEXT_PUBLIC_API_MOCKING=true
```

MSW 핸들러는 `mocks/handlers/` 디렉토리에 있습니다.
새로운 API 엔드포인트를 모킹하려면 해당 디렉토리에 핸들러를 추가하세요.

### 실제 백엔드 연동

```
NEXT_PUBLIC_API_MOCKING=false
API_BASE_URL=http://localhost:8081
```

Spring Boot 백엔드 서버가 `localhost:8081`에서 실행 중이어야 합니다.

---

## 자주 묻는 질문

### Q: 새로운 페이지는 어디에 만드나요?

라우트 그룹에 따라 다릅니다:

| 영역        | 경로               | 설명                         |
| ----------- | ------------------ | ---------------------------- |
| 공개 페이지 | `src/app/(auth)/`  | 로그인, 회원가입 등          |
| 일반 사용자 | `src/app/(main)/`  | 사이드바 레이아웃, 인증 필요 |
| 관리자      | `src/app/(admin)/` | ADMIN 역할 필요              |

### Q: 새로운 UI 컴포넌트(shadcn)를 추가하려면?

```bash
pnpm dlx shadcn@latest add [컴포넌트명]
```

추가된 컴포넌트는 `src/components/ui/`에 생성됩니다.

### Q: 새로운 Feature 모듈은 어떻게 만드나요?

`src/features/{도메인명}/` 디렉토리를 만들고 아래 구조를 따르세요:

```
features/새도메인/
├── components/     # 도메인 전용 UI 컴포넌트
├── hooks/          # TanStack Query 기반 데이터 페칭 훅
└── schemas.ts      # Zod 검증 스키마 (폼 유효성 검사)
```

- **컴포넌트**: 해당 도메인에서만 쓰이는 UI 컴포넌트
- **훅**: `useQuery`, `useMutation` 등 서버 상태 관리
- **스키마**: 폼 입력값 검증 (React Hook Form + Zod)

### Q: API 함수는 어디에 작성하나요?

`src/lib/api/` 디렉토리에 도메인별 파일로 관리합니다.
기존 파일: `auth.ts`, `board.ts`, `post.ts`, `user.ts`, `admin.ts`, `dashboard.ts`, `system.ts`, `file.ts`

API 클라이언트(`client.ts`)가 토큰 관리와 에러 처리를 담당하므로, 도메인 API 파일에서는 엔드포인트와 타입만 정의하면 됩니다.

### Q: 전역 상태는 어떻게 관리하나요?

- **서버 상태** (API 데이터): TanStack Query 사용 → `features/*/hooks/`
- **클라이언트 상태** (UI 상태): Zustand 사용 → `src/stores/`

---

## 문제 해결

### 개발 서버가 시작되지 않아요

1. Node.js 20 이상인지 확인: `node -v`
2. 의존성 재설치: `rm -rf node_modules && pnpm install`
3. `.env.local` 파일이 존재하는지 확인

### API 호출이 실패해요

- MSW 모드인 경우: `NEXT_PUBLIC_API_MOCKING=true` 확인, 해당 엔드포인트의 MSW 핸들러가 있는지 확인
- 실서버 모드인 경우: 백엔드 서버가 `API_BASE_URL` 주소에서 실행 중인지 확인

### 로그인이 안 돼요

- `NEXTAUTH_SECRET`이 `.env.local`에 설정되어 있는지 확인
- MSW 모드라면 `mocks/handlers/`에 인증 핸들러가 있는지 확인

### lint-staged / pre-commit 훅 에러

```bash
# Husky 재설치
pnpm prepare

# 수동으로 lint + format 실행
pnpm format && pnpm lint
```

### 타입 에러가 발생해요

```bash
# TypeScript 타입 체크
pnpm tsc --noEmit
```

---

## 개발 가이드

### 테스트 실행

```bash
# 전체 단위/컴포넌트 테스트
pnpm test

# 특정 테스트 파일
pnpm vitest run tests/unit/format.test.ts

# watch 모드 (파일 변경 시 자동 재실행)
pnpm test:watch

# E2E 테스트
pnpm test:e2e

# 특정 E2E 테스트
pnpm playwright test tests/e2e/auth.spec.ts
```

### 코드 스타일

- **포맷팅**: Prettier (`pnpm format`)
- **린트**: ESLint (`pnpm lint`)
- 커밋 시 Husky + lint-staged가 자동으로 포맷팅/린트를 실행합니다
- path alias: `@/*` → `./src/*`

### Provider 구조

`app/layout.tsx`에서 Provider가 아래 순서로 중첩됩니다:

```
MswProvider → AuthProvider → ThemeProvider → QueryProvider → TooltipProvider
```

이 순서를 변경하면 의존성 문제가 발생할 수 있으니 주의하세요.
