import type { MentorApplicationStatus } from './mentorApplication'

/** Single item in the admin applications list */
export interface AdminMentorApplicationListItem {
  id: number
  fullName: string
  email: string
  specializations: string[]
  status: MentorApplicationStatus
  submittedAt: string
}

/** Full detail DTO returned by GET /api/admin/mentor-applications/{id} */
export interface AdminMentorApplicationDetail {
  id: number
  status: MentorApplicationStatus
  fullName: string
  email: string
  phone: string
  specializations: string[]
  experience: string
  motivation: string
  submittedAt: string
  reviewedAt: string | null
  adminComment: string | null
  rejectionReason: string | null
  reviewerEmail: string | null
}

/** Paginated response wrapper */
export interface AdminMentorApplicationPage {
  content: AdminMentorApplicationListItem[]
  totalElements: number
  totalPages: number
  number: number          // current page (0-based)
  size: number
  first: boolean
  last: boolean
}

/** Query params for the list endpoint */
export interface AdminMentorApplicationFilter {
  status?: MentorApplicationStatus | ''
  page?: number           // 0-based
  size?: number
}

/** Payload for reject action */
export interface RejectMentorApplicationPayload {
  rejectionReason: string
}

