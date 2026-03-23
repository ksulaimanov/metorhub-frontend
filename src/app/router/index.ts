import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../pages/public/HomePage.vue'
import LoginPage from '../../pages/auth/LoginPage.vue'
import RegisterPage from '../../pages/auth/RegisterPage.vue'
import MentorDirectoryPage from '../../pages/public/MentorDirectoryPage.vue'
import PublicMentorProfilePage from '../../pages/public/PublicMentorProfilePage.vue'
import StudentProfilePage from '../../pages/student/StudentProfilePage.vue'
import StudentBookingsPage from '../../pages/student/StudentBookingsPage.vue'
import MentorProfilePage from '../../pages/mentor/MentorProfilePage.vue'
import MentorSlotsPage from '../../pages/mentor/MentorSlotsPage.vue'
import MentorBookingsPage from '../../pages/mentor/MentorBookingsPage.vue'
import VerifyEmailPage from '../../pages/auth/VerifyEmailPage.vue'
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage.vue'
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage.vue'

const getRoles = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('roles') || '[]')
    } catch {
        return []
    }
}

const isAuthenticated = () => Boolean(localStorage.getItem('accessToken'))
const hasRole = (role: string) => getRoles().includes(role)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomePage },
        { path: '/login', name: 'login', component: LoginPage },
        { path: '/register', name: 'register', component: RegisterPage },
        { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage },
        { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage },
        { path: '/verify-email', name: 'verify-email', component: VerifyEmailPage },
        { path: '/mentors', name: 'mentor-directory', component: MentorDirectoryPage },
        {
            path: '/mentors/:id',
            name: 'public-mentor-profile',
            component: PublicMentorProfilePage,
            props: true,
        },

        {
            path: '/student/profile',
            name: 'student-profile',
            component: StudentProfilePage,
            meta: { requiresAuth: true, role: 'ROLE_STUDENT' },
        },
        {
            path: '/student/bookings',
            name: 'student-bookings',
            component: StudentBookingsPage,
            meta: { requiresAuth: true, role: 'ROLE_STUDENT' },
        },

        {
            path: '/mentor/profile',
            name: 'mentor-profile',
            component: MentorProfilePage,
            meta: { requiresAuth: true, role: 'ROLE_MENTOR' },
        },
        {
            path: '/mentor/slots',
            name: 'mentor-slots',
            component: MentorSlotsPage,
            meta: { requiresAuth: true, role: 'ROLE_MENTOR' },
        },
        {
            path: '/mentor/bookings',
            name: 'mentor-bookings',
            component: MentorBookingsPage,
            meta: { requiresAuth: true, role: 'ROLE_MENTOR' },
        },
    ],
})

router.beforeEach((to, _from, next) => {
    const requiresAuth = Boolean(to.meta.requiresAuth)
    const role = to.meta.role as string | undefined

    if (requiresAuth && !isAuthenticated()) {
        next('/login')
        return
    }

    if (role && !hasRole(role)) {
        if (hasRole('ROLE_MENTOR')) {
            next('/mentor/profile')
            return
        }

        if (hasRole('ROLE_STUDENT')) {
            next('/student/profile')
            return
        }

        next('/')
        return
    }

    next()
})

export default router