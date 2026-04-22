/** Booking status values returned by backend */
export type BookingStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED_BY_STUDENT'
    | 'CANCELLED_BY_MENTOR'

/** Student-facing booking list item (GET /api/student/bookings) */
export interface StudentBookingItem {
    id: number
    startAt: string
    endAt: string
    timezone: string
    lessonFormat: 'ONLINE' | 'OFFLINE' | 'HYBRID'
    status: BookingStatus
    studentNote: string | null
    mentorNote: string | null
    mentorFirstName: string | null
    mentorLastName: string | null
    mentorAvatarUrl: string | null
    mentorId: number | null
}

/** Mentor-facing booking list item (GET /api/mentor/bookings) */
export interface MentorBookingItem {
    id: number
    startAt: string
    endAt: string
    timezone: string
    lessonFormat: 'ONLINE' | 'OFFLINE' | 'HYBRID'
    status: BookingStatus
    studentNote: string | null
    mentorNote: string | null
    studentFirstName: string | null
    studentLastName: string | null
    studentAvatarUrl: string | null
    studentId: number | null
}
