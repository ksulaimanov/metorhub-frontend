/**
 * Spring Boot Page<T> response shape
 */
export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    number: number        // current page (0-based)
    size: number
    first: boolean
    last: boolean
    empty: boolean
}

export interface PublicMentorProfile {
    id: number
    firstName: string | null
    lastName: string | null
    avatarUrl?: string | null
    headline: string | null
    bio: string | null
    specialization: string | null
    yearsExperience: number | null
    lessonFormatOnline: boolean
    lessonFormatOffline: boolean
    lessonFormatHybrid: boolean
    city: string | null
    pricePerHour: number | null
    averageRating: number | null
    lessonsCompleted: number | null
    verified: boolean
    hasAvailableSlots: boolean
    instagramUrl?: string | null
    telegramUsername?: string | null
    publicEmail?: string | null
}

export interface MentorDirectoryItem {
    id: number
    firstName: string | null
    lastName: string | null
    avatarUrl?: string | null
    headline: string | null
    specialization: string | null
    city: string | null
    pricePerHour: number | null
    averageRating: number | null
    lessonsCompleted: number | null
    verified: boolean
    lessonFormatOnline: boolean
    lessonFormatOffline: boolean
    lessonFormatHybrid: boolean
}

export interface MentorReview {
    id: number
    bookingId: number
    mentorId: number
    studentId: number
    studentFirstName?: string | null
    studentLastName?: string | null
    rating: number
    comment: string | null
    createdAt: string
}

export interface AvailabilitySlot {
    id: number
    mentorId: number
    startAt: string
    endAt: string
    timezone: string
    lessonFormat: 'ONLINE' | 'OFFLINE' | 'HYBRID'
    capacity: number
    availableSeats: number
    active: boolean
    bookable: boolean
}