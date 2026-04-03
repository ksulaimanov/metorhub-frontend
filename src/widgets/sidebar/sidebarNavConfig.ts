import {
  LayoutDashboard,
  User,
  Calendar,
  CalendarDays,
  BookOpen,
  Shield,
  FileText,
  HelpCircle,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface SidebarNavItem {
  label: string
  to: string
  icon: Component
  i18nKey: string
}

export const studentNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
  { label: 'Profile', to: '/student/profile', icon: User, i18nKey: 'sidebar.profile' },
  { label: 'Bookings', to: '/student/bookings', icon: Calendar, i18nKey: 'sidebar.bookings' },
]

export const mentorNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/mentor/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
  { label: 'Profile', to: '/mentor/profile', icon: User, i18nKey: 'sidebar.profile' },
  { label: 'Slots', to: '/mentor/slots', icon: CalendarDays, i18nKey: 'sidebar.slots' },
  { label: 'Bookings', to: '/mentor/bookings', icon: BookOpen, i18nKey: 'sidebar.bookings' },
]

export const adminNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, i18nKey: 'sidebar.dashboard' },
  { label: 'Applications', to: '/admin/mentor-applications', icon: FileText, i18nKey: 'sidebar.applications' },
]

