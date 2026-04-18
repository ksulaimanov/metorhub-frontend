import { http } from '@/shared/api/http'
import type {
  AdminMentorApplicationPage,
  AdminMentorApplicationDetail,
  AdminMentorApplicationListItem,
  AdminMentorApplicationFilter,
  RejectMentorApplicationPayload,
} from '@/shared/types/adminMentorApplication'

const BASE = '/api/admin/mentor-applications'

/**
 * Normalize a single list/detail item coming from the backend.
 * Handles: name→fullName fallback, null specializations.
 */
function normalizeItem<T extends { fullName?: string; specializations?: string[] | null }>(
  raw: any,
): T {
  return {
    ...raw,
    fullName: raw.fullName || raw.name || '',
    specializations: Array.isArray(raw.specializations) ? raw.specializations : [],
  } as T
}

export const getAdminMentorApplications = async (
  filter: AdminMentorApplicationFilter = {},
): Promise<AdminMentorApplicationPage> => {
  const params: Record<string, string | number> = {}

  if (filter.status) params.status = filter.status
  if (filter.page !== undefined) params.page = filter.page
  if (filter.size !== undefined) params.size = filter.size

  const { data } = await http.get(BASE, { params })

  return {
    ...data,
    content: Array.isArray(data.content)
      ? data.content.map((item: any) => normalizeItem<AdminMentorApplicationListItem>(item))
      : [],
  }
}

export const getAdminMentorApplicationById = async (
  id: number,
): Promise<AdminMentorApplicationDetail> => {
  const { data } = await http.get(`${BASE}/${id}`)
  return normalizeItem<AdminMentorApplicationDetail>(data)
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

