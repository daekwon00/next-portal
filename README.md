# Next Portal

> ydk-lab 프론트엔드 프로젝트 — 포트폴리오 + 기술 쇼케이스 + AI 실험 플랫폼

Next.js 16 App Router + React 19 기반의 포털 웹 애플리케이션입니다.
백엔드 Spring Boot 서버와 연동하며, MSW를 활용한 독립 개발도 지원합니다.

## 기술 스택

| 카테고리        | 기술                                          |
| --------------- | --------------------------------------------- |
| 프레임워크      | Next.js 16 (App Router, Turbopack)            |
| UI              | React 19 + TypeScript                         |
| 스타일링        | Tailwind CSS 4 + shadcn/ui + Radix UI         |
| 서버 상태       | TanStack Query 5                              |
| 클라이언트 상태 | Zustand 5                                     |
| HTTP            | ky                                            |
| 폼              | React Hook Form + Zod                         |
| 테이블          | TanStack Table 8                              |
| 인증            | NextAuth.js 5 (Auth.js) — JWT 기반            |
| 에디터          | Tiptap                                        |
| 차트            | Recharts                                      |
| 애니메이션      | Framer Motion                                 |
| 테스트          | Vitest + Testing Library + Playwright + MSW 2 |
| 코드 품질       | ESLint, Prettier, Husky, lint-staged          |

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 값을 수정하세요

# 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 환경변수

| 변수                      | 설명                 | 기본값                  |
| ------------------------- | -------------------- | ----------------------- |
| `NEXTAUTH_URL`            | NextAuth 기본 URL    | `http://localhost:3000` |
| `NEXTAUTH_SECRET`         | JWT 서명 시크릿      | (설정 필요)             |
| `API_BASE_URL`            | 백엔드 API 서버 주소 | `http://localhost:8081` |
| `NEXT_PUBLIC_API_MOCKING` | MSW 모킹 활성화      | `true`                  |

> `NEXT_PUBLIC_API_MOCKING=true`로 설정하면 백엔드 없이 MSW 목 데이터로 개발할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             #   로그인/회원가입 (공개)
│   │   ├── login/
│   │   └── register/
│   ├── (main)/             #   일반 사용자 영역 (인증 필요, 사이드바 레이아웃)
│   │   ├── boards/         #     게시판
│   │   ├── dashboard/      #     대시보드
│   │   └── user/           #     사용자 관리
│   ├── (admin)/            #   관리자 영역 (ADMIN 역할 필요)
│   │   └── admin/
│   └── api/                #   API Route Handlers
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   ├── layout/             # 레이아웃 (사이드바, 헤더 등)
│   └── editor/             # Tiptap 에디터 컴포넌트
├── features/               # 도메인별 Feature 모듈
│   ├── admin/              #   관리자 기능
│   ├── auth/               #   인증 관련
│   ├── board/              #   게시판
│   ├── dashboard/          #   대시보드
│   └── user/               #   사용자 관리
├── lib/
│   ├── api/                # API 클라이언트 및 도메인별 API 함수
│   ├── auth.ts             # NextAuth 설정
│   ├── format.ts           # 포맷 유틸
│   └── utils.ts            # 공통 유틸리티 (cn 등)
├── stores/                 # Zustand 스토어
└── middleware.ts            # 경로별 접근 제어

mocks/                      # MSW 핸들러 (서버/브라우저)
tests/
├── unit/                   # 단위 테스트
├── components/             # 컴포넌트 테스트
└── e2e/                    # E2E 테스트 (Playwright)
```

### Feature 모듈 패턴

각 도메인(`src/features/{domain}/`)은 일관된 구조를 따릅니다:

```
features/{domain}/
├── components/     # 도메인 전용 UI 컴포넌트
├── hooks/          # TanStack Query 기반 데이터 페칭 훅
└── schemas.ts      # Zod 검증 스키마 (폼 유효성 검사)
```

## 스크립트

| 명령어            | 설명                              |
| ----------------- | --------------------------------- |
| `pnpm dev`        | 개발 서버 (http://localhost:3000) |
| `pnpm build`      | 프로덕션 빌드                     |
| `pnpm start`      | 프로덕션 서버                     |
| `pnpm lint`       | ESLint 검사                       |
| `pnpm format`     | Prettier 포맷팅                   |
| `pnpm test`       | 단위/컴포넌트 테스트 (Vitest)     |
| `pnpm test:watch` | 테스트 watch 모드                 |
| `pnpm test:e2e`   | E2E 테스트 (Playwright)           |

## 인증 흐름

1. 사용자가 `/login`에서 로그인
2. NextAuth.js가 백엔드 API로 인증 요청 → JWT(accessToken/refreshToken) 발급
3. `middleware.ts`에서 경로별 접근 제어:
   - `(auth)` 경로 — 공개
   - `(main)` 경로 — 인증 필요
   - `(admin)` 경로 — ADMIN 역할 필요
4. API 호출 시 `src/lib/api/client.ts`에서 토큰 자동 갱신

## API 연동

- HTTP 클라이언트: `ky` (prefix: `/api/v1`)
- `next.config.ts` rewrites를 통해 백엔드 서버(`localhost:8081`)로 프록시
- 응답 형식: `{ success: boolean, data: T }` → 자동 언래핑
- 에러 처리: `ApiError` 클래스 (status, message, errors)
- 도메인별 API 함수: `src/lib/api/{auth,board,post,user,admin,dashboard,system,file}.ts`

## Provider 구조

`app/layout.tsx`에서 아래 순서로 중첩됩니다:

```
MswProvider → AuthProvider → ThemeProvider → QueryProvider → TooltipProvider
```

## 연관 프로젝트

- **백엔드**: [spring-cqrs](https://github.com/daekwon00/spring-cqrs) (Spring Boot, CQRS 패턴)
