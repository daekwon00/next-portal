import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(4, '아이디는 4자 이상이어야 합니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  role: z.string().min(1, '역할을 선택해주세요'),
  department: z.string().optional(),
  position: z.string().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  role: z.string().min(1, '역할을 선택해주세요'),
  department: z.string().optional(),
  position: z.string().optional(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>

export const boardSchema = z.object({
  name: z.string().min(1, '게시판 이름을 입력해주세요'),
  description: z.string().min(1, '설명을 입력해주세요'),
})

export type BoardFormValues = z.infer<typeof boardSchema>

export const roleSchema = z.object({
  name: z.string().min(1, '역할명을 입력해주세요'),
  description: z.string(),
})

export type RoleFormValues = z.infer<typeof roleSchema>

export const menuSchema = z.object({
  name: z.string().min(1, '메뉴명을 입력해주세요'),
  path: z.string().min(1, '경로를 입력해주세요'),
  icon: z.string().optional(),
  parentId: z.number().optional(),
  sortOrder: z.number().min(0, '정렬순서는 0 이상이어야 합니다'),
})

export type MenuFormValues = z.infer<typeof menuSchema>

export const codeSchema = z.object({
  groupCode: z.string().min(1, '그룹코드를 선택해주세요'),
  code: z.string().min(1, '코드를 입력해주세요'),
  name: z.string().min(1, '코드명을 입력해주세요'),
  value: z.string().optional(),
  sortOrder: z.number().min(0),
  description: z.string().optional(),
})

export type CodeFormValues = z.infer<typeof codeSchema>
