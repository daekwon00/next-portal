import { http, HttpResponse } from "msw";

const MOCK_BOARDS = [
  { id: 1, name: "공지사항", description: "전체 공지사항을 확인하세요", isActive: true, postCount: 12 },
  { id: 2, name: "자유게시판", description: "자유롭게 글을 작성하세요", isActive: true, postCount: 45 },
  { id: 3, name: "질문답변", description: "궁금한 점을 질문하세요", isActive: true, postCount: 23 },
];

export const boardHandlers = [
  http.get("*/api/v1/boards", () => {
    return HttpResponse.json(MOCK_BOARDS);
  }),

  http.get("*/api/v1/boards/:boardId", ({ params }) => {
    const board = MOCK_BOARDS.find((b) => b.id === Number(params.boardId));
    if (!board) {
      return HttpResponse.json({ message: "게시판을 찾을 수 없습니다." }, { status: 404 });
    }
    return HttpResponse.json(board);
  }),
];
