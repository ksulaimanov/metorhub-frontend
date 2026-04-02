import { http } from './http'
import type { StudentBookingItem, MentorBookingItem, BookingStatus } from '../types/booking'

// ─── Student ────────────────────────────────────────────────────────────────

export const createStudentBooking = async (payload: {
    availabilitySlotId: number
    studentNote: string
}) => {
    const { data } = await http.post('/api/student/bookings', payload)
    return data
}

export const getStudentBookings = async (): Promise<StudentBookingItem[]> => {
    const { data } = await http.get<StudentBookingItem[]>('/api/student/bookings')
    return data
}

export const cancelStudentBooking = async (bookingId: number): Promise<void> => {
    await http.patch(`/api/student/bookings/${bookingId}/cancel`)
}

// ─── Mentor ─────────────────────────────────────────────────────────────────

export const getMentorBookings = async (): Promise<MentorBookingItem[]> => {
    const { data } = await http.get<MentorBookingItem[]>('/api/mentor/bookings')
    return data
}

export const updateMentorBookingStatus = async (
    bookingId: number,
    status: BookingStatus,
    mentorNote: string = '',
): Promise<void> => {
    await http.patch(`/api/mentor/bookings/${bookingId}/status`, {
        status,
        mentorNote,
    })
}
