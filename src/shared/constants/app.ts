export const APP_NAME = 'JaiMentorship'

export const ROLES = {
    STUDENT: 'ROLE_STUDENT',
    MENTOR: 'ROLE_MENTOR',
    ADMIN: 'ROLE_ADMIN',
} as const

export type AppRole = (typeof ROLES)[keyof typeof ROLES]

export const TOAST_DURATION = {
    SHORT: 2000,
    DEFAULT: 3500,
    LONG: 5000,
} as const

