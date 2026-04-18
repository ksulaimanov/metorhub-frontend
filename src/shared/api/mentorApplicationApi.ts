import { http } from '@/shared/api/http'
import type {
    SubmitMentorApplicationRequest,
    MentorApplicationStatusResponse,
    MentorApplicationSubmitResponse,
} from '@/shared/types/mentorApplication'

export const submitMentorApplication = async (
    payload: SubmitMentorApplicationRequest,
): Promise<MentorApplicationSubmitResponse> => {
    const { data } = await http.post('/api/student/mentor-application', payload)
    return data
}

export const getMyMentorApplicationStatus = async (): Promise<MentorApplicationStatusResponse> => {
    const { data } = await http.get('/api/student/mentor-application/me')
    return data
}

export const getMentorApplicationStatus = async (
    email: string,
    token: string,
): Promise<MentorApplicationStatusResponse> => {
    const { data } = await http.get('/api/mentor-applications/status', {
        params: { email, token },
    })
    return data
}
