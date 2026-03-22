import { http } from './http'

export const createStudentReview = async (payload: {
  bookingId: number
  rating: number
  comment: string
}) => {
  const { data } = await http.post('/api/student/reviews', payload)
  return data
}