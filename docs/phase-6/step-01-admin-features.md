# Phase 6: 관리자 기능

## 상태: 완료

## 작업 내용

- [x] 관리자 대시보드
  - AdminStatsCards — 전체 사용자, 오늘 가입, 활성 게시판, 오늘 게시글
  - RecentUsersCard — 최근 가입자 5명
- [x] 사용자 관리
  - 목록 (DataTable + 페이지네이션 + 검색)
  - 등록 (/admin/users/register)
  - 수정 (/admin/users/[userId]/edit)
  - 활성화/비활성화 토글
- [x] 게시판 관리
  - 다이얼로그 기반 CRUD
  - 게시판 생성/수정/삭제
- [x] 시스템 관리 (통합 탭 UI — /admin/system)
  - 역할 관리 (RoleManagement) — CRUD
  - 메뉴 관리 (MenuManagement) — 트리 구조
  - 메뉴-역할 매핑 (MenuRoleManagement) — 체크박스 매트릭스
  - 공통코드 관리 (CodeManagement) — 그룹 선택 + 코드 CRUD
  - 직급-역할 매핑 (PositionRoleManagement) — 매트릭스
