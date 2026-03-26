export interface MentorApplicationRequest {
    name: string
    email: string
    phone: string
    motivation: string
    experience: string
    specializations: string[]
}

export type MentorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface MentorApplicationStatusResponse {
    status: MentorApplicationStatus
    submittedAt: string
    reviewedAt: string | null
    reviewComment: string | null
}

export interface MentorApplicationSubmitResponse {
    token: string
    message: string
}

