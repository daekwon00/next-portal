export interface UserProfile {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  department?: string
  position?: string
  role: string
  createdAt: string
}

export interface UpdateProfileRequest {
  name: string
  email: string
  phone?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface LoginHistory {
  loginIp: string
  loginSuccess: boolean
  loginFailReason: string | null
  loginDate: string
}
