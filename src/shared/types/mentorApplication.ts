export interface SubmitMentorApplicationRequest {
    motivationText: string
    experienceSummary: string
    portfolioUrl?: string
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
