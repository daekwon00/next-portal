import {
  LayoutDashboard,
  FileText,
  User,
  Shield,
  Users,
  Settings,
  ArrowLeft,
} from "lucide-react";

export const mainMenuItems = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "게시판", href: "/boards", icon: FileText },
  { label: "프로필", href: "/user/profile", icon: User },
];

export const adminMenuItems = [
  { label: "관리자 대시보드", href: "/admin", icon: Shield },
  { label: "사용자 관리", href: "/admin/users", icon: Users },
  { label: "게시판 관리", href: "/admin/boards", icon: FileText },
  { label: "시스템 관리", href: "/admin/system", icon: Settings },
  { label: "메인으로 돌아가기", href: "/dashboard", icon: ArrowLeft },
];
