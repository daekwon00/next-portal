# Phase 2: 앱 레이아웃

## 상태: 완료

## 작업 내용

- [x] Route Groups 구성
  - `(auth)` — 로그인/회원가입 (공개)
  - `(main)` — 일반 사용자 (사이드바 레이아웃, 인증 필요)
  - `(admin)` — 관리자 (ADMIN role 필요)
- [x] 레이아웃 컴포넌트
  - AppSidebar — 사이드바 + 사용자 메뉴
  - AdminSidebar — 관리자 사이드바
  - AppHeader — 헤더 + 브레드크럼 + 테마 토글
- [x] Provider 체인 (root layout)
  - MswProvider > AuthProvider > ThemeProvider > QueryProvider > TooltipProvider
- [x] 다크모드 (next-themes)
  - Light / Dark / System 토글
  - CSS 변수 기반 shadcn/ui 테마
