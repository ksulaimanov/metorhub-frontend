import { http } from './http'
import type {
    AvailabilitySlot,
    MentorDirectoryItem,
    MentorReview,
    PageResponse,
    PublicMentorProfile,
} from '../types/mentor'

export interface MentorDirectoryParams {
    query?: string
    city?: string
    sortBy?: string
    online?: boolean
    offline?: boolean
    hybrid?: boolean
    page?: number
    size?: number
}

export const getPublicMentors = async (params: MentorDirectoryParams = {}): Promise<PageResponse<MentorDirectoryItem>> => {
    const cleaned: Record<string, string | number | boolean> = {}
    if (params.query) cleaned.query = params.query
    if (params.city) cleaned.city = params.city
    if (params.sortBy) cleaned.sortBy = params.sortBy
    if (params.online) cleaned.online = true
    if (params.offline) cleaned.offline = true
    if (params.hybrid) cleaned.hybrid = true
    if (params.page !== undefined) cleaned.page = params.page
    if (params.size !== undefined) cleaned.size = params.size

    const { data } = await http.get<PageResponse<MentorDirectoryItem>>('/api/public/mentors', { params: cleaned })
    return data
}

/**
 * Convenience: fetch top-N mentors for homepage featured section
 */
export const getFeaturedMentors = async (count = 4): Promise<MentorDirectoryItem[]> => {
    const page = await getPublicMentors({ sortBy: 'ratingDesc', page: 0, size: count })
    return page.content
}

export const getPublicMentorProfile = async (mentorId: string | number) => {
    const { data } = await http.get<PublicMentorProfile>(`/api/public/mentors/${mentorId}`)
    return data
}

export const getPublicMentorReviews = async (mentorId: string | number) => {
    const { data } = await http.get<MentorReview[]>(`/api/public/mentors/${mentorId}/reviews`)
    return data
}

export const getPublicMentorSlots = async (mentorId: string | number) => {
    const { data } = await http.get<AvailabilitySlot[]>(`/api/public/mentors/${mentorId}/slots`)
    return data
}