import { http } from './http'
import type {
  AdminMentorApplicationPage,
  AdminMentorApplicationDetail,
  AdminMentorApplicationFilter,
  RejectMentorApplicationPayload,
} from '../types/adminMentorApplication'

const BASE = '/api/admin/mentor-applications'

export const getAdminMentorApplications = async (
  filter: AdminMentorApplicationFilter = {},
): Promise<AdminMentorApplicationPage> => {
  const params: Record<string, string | number> = {}

  if (filter.status) params.status = filter.status
  if (filter.page !== undefined) params.page = filter.page
  if (filter.size !== undefined) params.size = filter.size

  const { data } = await http.get(BASE, { params })
  return data
}

export const getAdminMentorApplicationById = async (
  id: number,
): Promise<AdminMentorApplicationDetail> => {
  const { data } = await http.get(`${BASE}/${id}`)
  return data
}

export const approveApplication = async (id: number): Promise<void> => {
  await http.post(`${BASE}/${id}/approve`)
}

export const rejectApplication = async (
  id: number,
  payload: RejectMentorApplicationPayload,
): Promise<void> => {
  await http.post(`${BASE}/${id}/reject`, payload)
}

