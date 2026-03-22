export interface PublicMentorProfile {
    id: number
    userId: number
    firstName: string | null
    lastName: string | null
    avatarKey: string | null
    headline: string | null
    bio: string | null
    specialization: string | null
    yearsExperience: number | null
    lessonFormatOnline: boolean
    lessonFormatOffline: boolean
    lessonFormatHybrid: boolean
    city: string | null
    addressText: string | null
    meetingLink: string | null
    pricePerHour: number | null
    averageRating: number | null
    lessonsCompleted: number | null
    verified: boolean
}

export interface MentorReview {
    id: number
    bookingId: number
    mentorId: number
    studentId: number
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
    meetingLink: string | null
    addressText: string | null
    active: boolean
}