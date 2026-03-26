import { http } from './http'
import type {
    MentorApplicationRequest,
    MentorApplicationStatusResponse,
    MentorApplicationSubmitResponse,
} from '../types/mentorApplication'

export const submitMentorApplication = async (
    payload: MentorApplicationRequest,
): Promise<MentorApplicationSubmitResponse> => {
    const { data } = await http.post('/api/mentor-applications', payload)
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

