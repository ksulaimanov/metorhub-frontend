import { http } from './http'

export const createStudentBooking = async (payload: {
    availabilitySlotId: number
    studentNote: string
}) => {
    const { data } = await http.post('/api/student/bookings', payload)
    return data
}