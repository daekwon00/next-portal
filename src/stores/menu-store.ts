import { create } from 'zustand'
import { getMyMenus } from '@/lib/api/system'

export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  sortOrder: number
  children?: MenuItem[]
}

interface MenuState {
  menus: MenuItem[]
  adminMenus: MenuItem[]
  isLoaded: boolean
  fetchMenus: () => Promise<void>
  reset: () => void
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  adminMenus: [],
  isLoaded: false,
  fetchMenus: async () => {
    if (get().isLoaded) return
    try {
      const data = await getMyMenus()
      set({
        menus: data.menus ?? [],
        adminMenus: data.adminMenus ?? [],
        isLoaded: true,
      })
    } catch {
      set({ isLoaded: true })
    }
  },
  reset: () => set({ menus: [], adminMenus: [], isLoaded: false }),
}))
