import {
  LayoutDashboard,
  User,
  Calendar,
  CalendarDays,
  BookOpen,
  FileText,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface SidebarNavItem {
  label: string
  to: string
  icon: Component
  i18nKey: string
}

export interface SidebarNavGroup {
  labelKey: string
  items: SidebarNavItem[]
}

export const studentNavGroups: SidebarNavGroup[] = [
  {
    labelKey: 'sidebar.sectionMain',
    items: [
      { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
      { label: 'Profile', to: '/student/profile', icon: User, i18nKey: 'sidebar.profile' },
    ],
  },
  {
    labelKey: 'sidebar.sectionActivity',
    items: [
      { label: 'Bookings', to: '/student/bookings', icon: Calendar, i18nKey: 'sidebar.bookings' },
    ],
  },
]

export const mentorNavGroups: SidebarNavGroup[] = [
  {
    labelKey: 'sidebar.sectionMain',
    items: [
      { label: 'Dashboard', to: '/mentor/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
      { label: 'Profile', to: '/mentor/profile', icon: User, i18nKey: 'sidebar.profile' },
    ],
  },
  {
    labelKey: 'sidebar.sectionManagement',
    items: [
      { label: 'Slots', to: '/mentor/slots', icon: CalendarDays, i18nKey: 'sidebar.slots' },
      { label: 'Bookings', to: '/mentor/bookings', icon: BookOpen, i18nKey: 'sidebar.bookings' },
    ],
  },
]

export const adminNavGroups: SidebarNavGroup[] = [
  {
    labelKey: 'sidebar.sectionMain',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
    ],
  },
  {
    labelKey: 'sidebar.sectionManagement',
    items: [
      { label: 'Applications', to: '/admin/mentor-applications', icon: FileText, i18nKey: 'sidebar.applications' },
    ],
  },
]

// Flat arrays kept for backward compat (used nowhere now, but safe to keep)
export const studentNavItems: SidebarNavItem[] = studentNavGroups.flatMap(g => g.items)
export const mentorNavItems: SidebarNavItem[] = mentorNavGroups.flatMap(g => g.items)
export const adminNavItems: SidebarNavItem[] = adminNavGroups.flatMap(g => g.items)

