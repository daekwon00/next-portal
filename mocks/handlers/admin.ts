import { http, HttpResponse } from 'msw'

const mockUsers = Array.from({ length: 25 }, (_, i) => ({
  id: i === 0 ? 'admin' : `user${i}`,
  username: i === 0 ? 'admin' : `user${i}`,
  name: i === 0 ? '관리자' : `사용자${i}`,
  email: i === 0 ? 'admin@example.com' : `user${i}@example.com`,
  role: i === 0 ? 'ADMIN' : 'USER',
  department: ['개발팀', '기획팀', '디자인팀', '경영지원'][i % 4],
  position: ['사원', '대리', '과장', '부장'][i % 4],
  isActive: i < 20,
  lastLoginAt: new Date(Date.now() - i * 86400000).toISOString(),
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
}))

const mockRoles = [
  { id: 'ROLE_ADMIN', name: 'ADMIN', description: '시스템 관리자' },
  { id: 'ROLE_USER', name: 'USER', description: '일반 사용자' },
  { id: 'ROLE_MANAGER', name: 'MANAGER', description: '매니저' },
]

const mockMenus = [
  {
    id: 'MENU_DASHBOARD',
    name: '대시보드',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    sortOrder: 1,
    isActive: true,
    children: [],
  },
  {
    id: 'MENU_BOARDS',
    name: '게시판',
    path: '/boards',
    icon: 'FileText',
    sortOrder: 2,
    isActive: true,
    children: [
      {
        id: 'MENU_NOTICE',
        name: '공지사항',
        path: '/boards/NOTICE',
        sortOrder: 1,
        isActive: true,
        parentId: 'MENU_BOARDS',
      },
      {
        id: 'MENU_FREE',
        name: '자유게시판',
        path: '/boards/FREE',
        sortOrder: 2,
        isActive: true,
        parentId: 'MENU_BOARDS',
      },
    ],
  },
  {
    id: 'MENU_AI_CHAT',
    name: 'AI 채팅',
    path: '/ai-chat',
    icon: 'MessageSquare',
    sortOrder: 3,
    isActive: true,
    children: [],
  },
  {
    id: 'MENU_MY_INFO',
    name: '내 정보',
    path: '/user',
    icon: 'UserCircle',
    sortOrder: 4,
    isActive: true,
    children: [
      {
        id: 'MENU_MYPAGE',
        name: '마이페이지',
        path: '/user/mypage',
        sortOrder: 1,
        isActive: true,
        parentId: 'MENU_MY_INFO',
      },
      {
        id: 'MENU_PROFILE',
        name: '프로필 수정',
        path: '/user/profile',
        sortOrder: 2,
        isActive: true,
        parentId: 'MENU_MY_INFO',
      },
      {
        id: 'MENU_CHANGE_PASSWORD',
        name: '비밀번호 변경',
        path: '/user/change-password',
        sortOrder: 3,
        isActive: true,
        parentId: 'MENU_MY_INFO',
      },
    ],
  },
]

const mockMenuRoles = [
  { menuId: 'MENU_DASHBOARD', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_BOARDS', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_NOTICE', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_FREE', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_AI_CHAT', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_MY_INFO', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_MYPAGE', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_PROFILE', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_CHANGE_PASSWORD', roleId: 'ROLE_ADMIN' },
  { menuId: 'MENU_DASHBOARD', roleId: 'ROLE_USER' },
  { menuId: 'MENU_BOARDS', roleId: 'ROLE_USER' },
  { menuId: 'MENU_NOTICE', roleId: 'ROLE_USER' },
  { menuId: 'MENU_FREE', roleId: 'ROLE_USER' },
  { menuId: 'MENU_AI_CHAT', roleId: 'ROLE_USER' },
  { menuId: 'MENU_MY_INFO', roleId: 'ROLE_USER' },
  { menuId: 'MENU_MYPAGE', roleId: 'ROLE_USER' },
  { menuId: 'MENU_PROFILE', roleId: 'ROLE_USER' },
  { menuId: 'MENU_CHANGE_PASSWORD', roleId: 'ROLE_USER' },
]

const mockCodeGroups = [
  { id: 'DEPT', name: '부서', description: '부서 코드', isActive: true },
  { id: 'POSITION', name: '직급', description: '직급 코드', isActive: true },
  { id: 'STATUS', name: '상태', description: '상태 코드', isActive: true },
]

const mockCodes = [
  {
    id: 'DEPT_DEV',
    groupCode: 'DEPT',
    code: 'DEV',
    name: '개발팀',
    value: '개발팀',
    sortOrder: 1,
    isActive: true,
    description: '',
  },
  {
    id: 'DEPT_PLAN',
    groupCode: 'DEPT',
    code: 'PLAN',
    name: '기획팀',
    value: '기획팀',
    sortOrder: 2,
    isActive: true,
    description: '',
  },
  {
    id: 'DEPT_DESIGN',
    groupCode: 'DEPT',
    code: 'DESIGN',
    name: '디자인팀',
    value: '디자인팀',
    sortOrder: 3,
    isActive: true,
    description: '',
  },
  {
    id: 'POS_STAFF',
    groupCode: 'POSITION',
    code: 'STAFF',
    name: '사원',
    value: '사원',
    sortOrder: 1,
    isActive: true,
    description: '',
  },
  {
    id: 'POS_SENIOR',
    groupCode: 'POSITION',
    code: 'SENIOR',
    name: '대리',
    value: '대리',
    sortOrder: 2,
    isActive: true,
    description: '',
  },
  {
    id: 'POS_MANAGER',
    groupCode: 'POSITION',
    code: 'MANAGER',
    name: '과장',
    value: '과장',
    sortOrder: 3,
    isActive: true,
    description: '',
  },
  {
    id: 'STATUS_ACTIVE',
    groupCode: 'STATUS',
    code: 'ACTIVE',
    name: '활성',
    value: 'Y',
    sortOrder: 1,
    isActive: true,
    description: '',
  },
  {
    id: 'STATUS_INACTIVE',
    groupCode: 'STATUS',
    code: 'INACTIVE',
    name: '비활성',
    value: 'N',
    sortOrder: 2,
    isActive: true,
    description: '',
  },
]

const mockPositionRoles = [
  { positionId: 'POS_STAFF', positionName: '사원', roleIds: ['ROLE_USER'] },
  { positionId: 'POS_SENIOR', positionName: '대리', roleIds: ['ROLE_USER'] },
  {
    positionId: 'POS_MANAGER',
    positionName: '과장',
    roleIds: ['ROLE_USER', 'ROLE_MANAGER'],
  },
  {
    positionId: 'POS_DIRECTOR',
    positionName: '부장',
    roleIds: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'],
  },
]

const mockAdminMenus = [
  {
    id: 'AMENU_DASHBOARD',
    name: '관리자 대시보드',
    path: '/admin',
    icon: 'Shield',
    sortOrder: 1,
    isActive: true,
    children: [],
  },
  {
    id: 'AMENU_USERS',
    name: '사용자 관리',
    path: '/admin/users',
    icon: 'Users',
    sortOrder: 2,
    isActive: true,
    children: [],
  },
  {
    id: 'AMENU_BOARDS',
    name: '게시판 관리',
    path: '/admin/boards',
    icon: 'FileText',
    sortOrder: 3,
    isActive: true,
    children: [],
  },
  {
    id: 'AMENU_SYSTEM',
    name: '시스템 관리',
    path: '/admin/system',
    icon: 'Settings',
    sortOrder: 4,
    isActive: true,
    children: [
      {
        id: 'AMENU_ROLES',
        name: '역할 관리',
        path: '/admin/system/roles',
        sortOrder: 1,
        isActive: true,
        parentId: 'AMENU_SYSTEM',
      },
      {
        id: 'AMENU_MENUS',
        name: '메뉴 관리',
        path: '/admin/system/menus',
        sortOrder: 2,
        isActive: true,
        parentId: 'AMENU_SYSTEM',
      },
      {
        id: 'AMENU_MENUROLES',
        name: '권한 매핑',
        path: '/admin/system/menu-roles',
        sortOrder: 3,
        isActive: true,
        parentId: 'AMENU_SYSTEM',
      },
      {
        id: 'AMENU_CODES',
        name: '공통코드',
        path: '/admin/system/codes',
        sortOrder: 4,
        isActive: true,
        parentId: 'AMENU_SYSTEM',
      },
      {
        id: 'AMENU_POSROLES',
        name: '직급-역할',
        path: '/admin/system/position-roles',
        sortOrder: 5,
        isActive: true,
        parentId: 'AMENU_SYSTEM',
      },
    ],
  },
]

export const adminHandlers = [
  // 내 메뉴 (역할 기반)
  http.get('*/api/v1/menus/my', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) return new HttpResponse(null, { status: 401 })
    // 토큰에서 역할 판별: admin 토큰이면 adminMenus 포함, 일반 사용자는 빈 배열
    const token = authHeader.replace('Bearer ', '')
    const isAdmin = token.includes('admin')
    return HttpResponse.json({
      menus: mockMenus,
      adminMenus: isAdmin ? mockAdminMenus : [],
    })
  }),

  // 관리자 대시보드
  http.get('*/api/v1/admin/dashboard/stats', () => {
    return HttpResponse.json({
      totalUsers: 25,
      todayRegistered: 3,
      activeBoards: 3,
      todayPosts: 12,
    })
  }),

  http.get('*/api/v1/admin/dashboard/recent-users', () => {
    return HttpResponse.json(
      mockUsers.slice(0, 5).map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }))
    )
  }),

  // 사용자 관리
  http.get('*/api/v1/admin/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '10')
    const search = url.searchParams.get('search') ?? ''

    let filtered = mockUsers
    if (search) {
      filtered = mockUsers.filter(
        (u) => u.name.includes(search) || u.email.includes(search)
      )
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

  http.get('*/api/v1/admin/users/:userId', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.userId)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),

  http.post('*/api/v1/admin/users', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newUser = {
      id: body.username as string,
      ...body,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.put('*/api/v1/admin/users/:userId', async ({ params, request }) => {
    const user = mockUsers.find((u) => u.id === params.userId)
    if (!user) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...user, ...body })
  }),

  http.patch('*/api/v1/admin/users/:userId/toggle-active', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.userId)
    if (!user) return new HttpResponse(null, { status: 404 })
    user.isActive = !user.isActive
    return HttpResponse.json(user)
  }),

  // 게시판 관리
  http.get('*/api/v1/admin/boards', () => {
    return HttpResponse.json([
      {
        id: 'NOTICE',
        name: '공지사항',
        description: '공지사항 게시판',
        isActive: true,
        postCount: 15,
      },
      {
        id: 'FREE',
        name: '자유게시판',
        description: '자유롭게 글을 쓸 수 있는 게시판',
        isActive: true,
        postCount: 42,
      },
      {
        id: 'QNA',
        name: '질문답변',
        description: '질문과 답변 게시판',
        isActive: true,
        postCount: 28,
      },
    ])
  }),

  http.post('*/api/v1/admin/boards', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: `BOARD_${Date.now()}`, ...body, isActive: true, postCount: 0 },
      { status: 201 }
    )
  }),

  http.put('*/api/v1/admin/boards/:boardId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      id: params.boardId,
      ...body,
      isActive: true,
      postCount: 0,
    })
  }),

  http.patch('*/api/v1/admin/boards/:boardId/toggle-active', ({ params }) => {
    return HttpResponse.json({
      id: params.boardId,
      name: '게시판',
      description: '',
      isActive: false,
      postCount: 0,
    })
  }),

  // 역할 관리
  http.get('*/api/v1/admin/roles', () => HttpResponse.json(mockRoles)),

  http.post('*/api/v1/admin/roles', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: `ROLE_${Date.now()}`, ...body },
      { status: 201 }
    )
  }),

  http.put('*/api/v1/admin/roles/:roleId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ id: params.roleId, ...body })
  }),

  http.delete(
    '*/api/v1/admin/roles/:roleId',
    () => new HttpResponse(null, { status: 204 })
  ),

  // 메뉴 관리
  http.get('*/api/v1/admin/menus', () => HttpResponse.json(mockMenus)),

  http.post('*/api/v1/admin/menus', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: `MENU_${Date.now()}`, ...body, isActive: true, children: [] },
      { status: 201 }
    )
  }),

  http.put('*/api/v1/admin/menus/:menuId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      id: params.menuId,
      ...body,
      isActive: true,
    })
  }),

  http.delete(
    '*/api/v1/admin/menus/:menuId',
    () => new HttpResponse(null, { status: 204 })
  ),

  // 메뉴-역할 매핑
  http.get('*/api/v1/admin/menu-roles', () => HttpResponse.json(mockMenuRoles)),

  http.put('*/api/v1/admin/menu-roles/:roleId', () =>
    HttpResponse.json({ success: true })
  ),

  // 공통코드
  http.get('*/api/v1/admin/code-groups', () =>
    HttpResponse.json(mockCodeGroups)
  ),

  http.get('*/api/v1/admin/codes', ({ request }) => {
    const url = new URL(request.url)
    const groupCode = url.searchParams.get('groupCode')
    const filtered = groupCode
      ? mockCodes.filter((c) => c.groupCode === groupCode)
      : mockCodes
    return HttpResponse.json(filtered)
  }),

  http.post('*/api/v1/admin/codes', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: `NEW_${Date.now()}`, ...body, isActive: true },
      { status: 201 }
    )
  }),

  http.put('*/api/v1/admin/codes/:codeId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ id: params.codeId, ...body, isActive: true })
  }),

  http.delete(
    '*/api/v1/admin/codes/:codeId',
    () => new HttpResponse(null, { status: 204 })
  ),

  // 직급-역할 매핑
  http.get('*/api/v1/admin/position-roles', () =>
    HttpResponse.json(mockPositionRoles)
  ),

  http.put('*/api/v1/admin/position-roles/:positionId', () =>
    HttpResponse.json({ success: true })
  ),
]
