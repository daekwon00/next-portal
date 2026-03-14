# Phase 3: 인증 시스템

## 상태: 완료

## 작업 내용

- [x] NextAuth.js 5 (Auth.js) 설정
  - CredentialsProvider (username/password)
  - JWT 콜백: accessToken, refreshToken 저장
  - Session 콜백: user 정보 노출
- [x] API 클라이언트 (Ky)
  - Bearer 토큰 자동 주입
  - 401 시 토큰 갱신 후 재시도
  - ApiError 클래스 (status, message, errors)
  - 응답 `{ success, data }` 자동 언래핑
- [x] 로그인/회원가입 폼
  - React Hook Form + Zod 검증
  - loginSchema: username (min 3), password (min 6)
  - registerSchema: 필드 + 비밀번호 확인
- [x] 미들웨어 경로 보호
  - /dashboard, /boards, /user → 인증 필요
  - /admin → ADMIN role 필요
- [x] MSW 모킹 핸들러
  - 테스트 계정: admin/admin1234, user/user1234
  - instrumentation.ts: 서버 사이드 MSW
  - MswProvider: 클라이언트 사이드 MSW
