import { http } from './http'
import type { AvailabilitySlot, MentorReview, PublicMentorProfile } from '../types/mentor'

export const getPublicMentorProfile = async (mentorId: string | number) => {
    const { data } = await http.get<PublicMentorProfile>(`/api/public/mentors/${mentorId}`)
    return data
}

export const getPublicMentorReviews = async (mentorId: string | number) => {
    const { data } = await http.get<MentorReview[]>(`/api/public/mentors/${mentorId}/reviews`)
    return data
}

export const getPublicMentorSlots = async (mentorId: string | number) => {
    const { data } = await http.get<AvailabilitySlot[]>(`/api/public/mentors/${mentorId}/availability-slots`)
    return data
}