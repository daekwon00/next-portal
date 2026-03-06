import {
  LayoutDashboard,
  FileText,
  User,
  Shield,
  Users,
  Settings,
  KeyRound,
  Menu,
  Code,
  UserCog,
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
  {
    label: "시스템 관리",
    icon: Settings,
    children: [
      { label: "역할 관리", href: "/admin/system/roles", icon: KeyRound },
      { label: "메뉴 관리", href: "/admin/system/menus", icon: Menu },
      { label: "권한 매핑", href: "/admin/system/menu-roles", icon: UserCog },
      { label: "공통코드", href: "/admin/system/codes", icon: Code },
    ],
  },
];
