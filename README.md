# next-portal

> ydk-lab 프론트엔드 프로젝트 — 포트폴리오 + 기술 쇼케이스 + AI 실험 플랫폼

## 기술 스택

| 카테고리 | 기술 |
|----------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript |
| 스타일링 | Tailwind CSS 4 + shadcn/ui |
| 서버 상태 | TanStack Query 5 |
| 클라이언트 상태 | Zustand 5 |
| HTTP | ky |
| 폼 | React Hook Form + Zod |
| 테이블 | TanStack Table 8 |
| 인증 | NextAuth.js 5 (Auth.js) |
| 에디터 | Tiptap |
| 차트 | Recharts |
| 테스트 | Vitest + Playwright + MSW |

## 시작하기

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router (Route Groups)
│   ├── (auth)/       # 인증 페이지 (로그인, 회원가입)
│   ├── (main)/       # 일반 사용자 영역 (사이드바 레이아웃)
│   ├── (admin)/      # 관리자 영역
│   └── api/          # Route Handlers
├── components/       # 공유 컴포넌트
│   ├── ui/           # shadcn/ui 컴포넌트
│   ├── layout/       # 사이드바, 헤더
│   └── common/       # 공통 컴포넌트
├── features/         # 기능 모듈 (auth, board, user, admin, dashboard)
├── lib/              # 유틸리티, API 클라이언트, 설정
├── hooks/            # 글로벌 커스텀 훅
├── stores/           # Zustand 스토어
├── types/            # TypeScript 타입
└── providers/        # Context Providers
```

## 연관 프로젝트

- **백엔드**: [spring-cqrs](https://github.com/daekwon00/spring-cqrs) (Spring Boot, CQRS 패턴)
