import { http } from './http'
import type { StudentDashboard, MentorDashboard, AdminDashboard } from '../types/dashboard'

/**
 * Get student dashboard data
 */
export const getStudentDashboard = async () => {
  const { data } = await http.get<StudentDashboard>('/api/student/dashboard')
  return data
}

/**
 * Get mentor dashboard data
 */
export const getMentorDashboard = async () => {
  const { data } = await http.get<MentorDashboard>('/api/mentor/dashboard')
  return data
}

/**
 * Get admin dashboard data
 */
export const getAdminDashboard = async () => {
  const { data } = await http.get<AdminDashboard>('/api/admin/dashboard')
  return data
}

