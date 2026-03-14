# Phase 4: 게시판 시스템

## 상태: 완료

## 작업 내용

- [x] 게시판 목록
  - 카드 UI (BoardCard)
  - 게시글 수 표시
- [x] 게시글 목록
  - TanStack Table (PostDataTable)
  - 페이지네이션 (서버 사이드)
  - 검색 (제목/작성자/전체)
  - 정렬
- [x] 게시글 작성/수정
  - Tiptap 리치 텍스트 에디터 (StarterKit)
  - 파일 첨부 (FileUpload 컴포넌트)
    - 드래그 앤 드롭 + 클릭
    - 최대 5개, 10MB 제한
  - PostForm 공용 컴포넌트 (생성/수정)
- [x] 게시글 상세
  - HTML 렌더링 (PostViewer)
  - 첨부파일 다운로드
  - 삭제 확인 다이얼로그 (ConfirmDialog)
- [x] MSW 목 데이터
  - 3개 게시판: 공지사항, 자유게시판, 질문답변
  - 20+ 더미 게시글
