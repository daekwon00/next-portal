import { http, HttpResponse } from 'msw'

interface MockPost {
  id: number
  boardId: string
  title: string
  content: string
  author: {
    id: string
    username: string
    name: string
    email: string
    role: string
  }
  viewCount: number
  files: {
    id: string
    originalName: string
    storedName: string
    size: number
    contentType: string
  }[]
  createdAt: string
  updatedAt: string
}

let nextId = 21

const MOCK_POSTS: MockPost[] = Array.from({ length: 20 }, (_, i) => ({
  id: 20 - i,
  boardId: i % 3 === 0 ? 'NOTICE' : i % 3 === 1 ? 'FREE' : 'QNA',
  title: `테스트 게시글 ${20 - i}`,
  content: `<p>이것은 테스트 게시글 <strong>${20 - i}</strong>의 내용입니다.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
  author: {
    id: i % 2 === 0 ? 'admin' : 'user',
    username: i % 2 === 0 ? 'admin' : 'user',
    name: i % 2 === 0 ? '관리자' : '일반사용자',
    email: i % 2 === 0 ? 'admin@example.com' : 'user@example.com',
    role: i % 2 === 0 ? 'ADMIN' : 'USER',
  },
  viewCount: Math.floor(Math.random() * 500),
  files:
    i % 4 === 0
      ? [
          {
            id: `file-${i}-1`,
            originalName: '첨부파일.pdf',
            storedName: `stored_${i}.pdf`,
            size: 1024 * 256,
            contentType: 'application/pdf',
          },
          {
            id: `file-${i}-2`,
            originalName: '이미지.png',
            storedName: `stored_${i}.png`,
            size: 1024 * 128,
            contentType: 'image/png',
          },
        ]
      : [],
  createdAt: new Date(2026, 2, 7 - i).toISOString(),
  updatedAt: new Date(2026, 2, 7 - i).toISOString(),
}))

export const postHandlers = [
  http.get('*/api/v1/posts/recent', () => {
    return HttpResponse.json(MOCK_POSTS.slice(0, 5))
  }),

  http.get('*/api/v1/boards/:boardId/posts', ({ params, request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '10')
    const search = url.searchParams.get('search') ?? ''
    const searchType = url.searchParams.get('searchType') ?? 'all'
    const boardId = params.boardId as string

    let filtered = MOCK_POSTS.filter((p) => p.boardId === boardId)

    if (search) {
      filtered = filtered.filter((p) => {
        if (searchType === 'title') return p.title.includes(search)
        if (searchType === 'author') return p.author.name.includes(search)
        return p.title.includes(search) || p.author.name.includes(search)
      })
    }

    const start = page * size
    const content = filtered.slice(start, start + size)

    return HttpResponse.json({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      page,
      size,
    })
  }),

  http.get('*/api/v1/posts/:postId', ({ params }) => {
    const post = MOCK_POSTS.find((p) => p.id === Number(params.postId))
    if (!post) {
      return HttpResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return HttpResponse.json({ ...post, viewCount: post.viewCount + 1 })
  }),

  http.post('*/api/v1/posts', async ({ request }) => {
    const body = (await request.json()) as {
      boardId: string
      title: string
      content: string
      fileIds?: string[]
    }
    const newPost: MockPost = {
      id: nextId++,
      boardId: body.boardId,
      title: body.title,
      content: body.content,
      author: {
        id: 'admin',
        username: 'admin',
        name: '관리자',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      viewCount: 0,
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MOCK_POSTS.unshift(newPost)
    return HttpResponse.json(newPost, { status: 201 })
  }),

  http.put('*/api/v1/posts/:postId', async ({ params, request }) => {
    const body = (await request.json()) as {
      title: string
      content: string
      fileIds?: string[]
    }
    const post = MOCK_POSTS.find((p) => p.id === Number(params.postId))
    if (!post) {
      return HttpResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    post.title = body.title
    post.content = body.content
    post.updatedAt = new Date().toISOString()
    return HttpResponse.json(post)
  }),

  http.delete('*/api/v1/posts/:postId', ({ params }) => {
    const index = MOCK_POSTS.findIndex((p) => p.id === Number(params.postId))
    if (index === -1) {
      return HttpResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    MOCK_POSTS.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),
]
