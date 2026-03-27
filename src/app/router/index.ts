import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../pages/public/HomePage.vue'
import AboutPage from '../../pages/public/AboutPage.vue'
import NotFoundPage from '../../pages/system/NotFoundPage.vue'
import LoginPage from '../../pages/auth/LoginPage.vue'
import RegisterPage from '../../pages/auth/RegisterPage.vue'
import MentorDirectoryPage from '../../pages/public/MentorDirectoryPage.vue'
import PublicMentorProfilePage from '../../pages/public/PublicMentorProfilePage.vue'
import StudentProfilePage from '../../pages/student/StudentProfilePage.vue'
import StudentBookingsPage from '../../pages/student/StudentBookingsPage.vue'
import StudentDashboardPage from '../../pages/student/StudentDashboardPage.vue'
import MentorProfilePage from '../../pages/mentor/MentorProfilePage.vue'
import MentorSlotsPage from '../../pages/mentor/MentorSlotsPage.vue'
import MentorBookingsPage from '../../pages/mentor/MentorBookingsPage.vue'
import MentorDashboardPage from '../../pages/mentor/MentorDashboardPage.vue'
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage.vue'
import AdminMentorApplicationsPage from '../../pages/admin/AdminMentorApplicationsPage.vue'
import AdminMentorApplicationDetailPage from '../../pages/admin/AdminMentorApplicationDetailPage.vue'
import VerifyEmailPage from '../../pages/auth/VerifyEmailPage.vue'
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage.vue'
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage.vue'
import MentorApplyPage from '../../pages/public/MentorApplyPage.vue'
import MentorApplicationStatusPage from '../../pages/public/MentorApplicationStatusPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // --- public ---
        { path: '/', name: 'home', component: HomePage, meta: { title: 'MentorHub — Платформа для менторов и студентов' } },
        { path: '/about', name: 'about', component: AboutPage, meta: { title: 'О платформе — MentorHub' } },
        { path: '/mentors', name: 'mentor-directory', component: MentorDirectoryPage, meta: { title: 'Каталог менторов — MentorHub' } },
        { path: '/mentors/:id', name: 'public-mentor-profile', component: PublicMentorProfilePage, props: true, meta: { title: 'Профиль ментора — MentorHub' } },
        { path: '/mentor/apply', name: 'mentor-apply', component: MentorApplyPage, meta: { title: 'Стать ментором — MentorHub' } },
        { path: '/mentor/application/status', name: 'mentor-application-status', component: MentorApplicationStatusPage, meta: { title: 'Статус заявки — MentorHub' } },

        // --- auth ---
        { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Вход — MentorHub' } },
        { path: '/register', name: 'register', component: RegisterPage, meta: { title: 'Регистрация — MentorHub' } },
        { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage, meta: { title: 'Восстановление пароля — MentorHub' } },
        { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage, meta: { title: 'Сброс пароля — MentorHub' } },
        { path: '/verify-email', name: 'verify-email', component: VerifyEmailPage, meta: { title: 'Подтверждение email — MentorHub' } },

        // --- student ---
        { path: '/student/dashboard', name: 'student-dashboard', component: StudentDashboardPage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мой кабинет — MentorHub' } },
        { path: '/student/profile', name: 'student-profile', component: StudentProfilePage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мой профиль — MentorHub' } },
        { path: '/student/bookings', name: 'student-bookings', component: StudentBookingsPage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мои занятия — MentorHub' } },

        // --- mentor ---
        { path: '/mentor/dashboard', name: 'mentor-dashboard', component: MentorDashboardPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Кабинет ментора — MentorHub' } },
        { path: '/mentor/profile', name: 'mentor-profile', component: MentorProfilePage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Мой профиль — MentorHub' } },
        { path: '/mentor/slots', name: 'mentor-slots', component: MentorSlotsPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Доступные слоты — MentorHub' } },
        { path: '/mentor/bookings', name: 'mentor-bookings', component: MentorBookingsPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Заявки на занятия — MentorHub' } },

        // --- admin ---
        { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Админ панель — MentorHub' } },
        { path: '/admin/mentor-applications', name: 'admin-mentor-applications', component: AdminMentorApplicationsPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Заявки менторов — MentorHub' } },
        { path: '/admin/mentor-applications/:id', name: 'admin-mentor-application-detail', component: AdminMentorApplicationDetailPage, props: true, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Заявка ментора — MentorHub' } },

        // --- 404 ---
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: '404 — Страница не найдена' } },
    ],
})

// Guards подключаются в main.ts после app.use(pinia) через setupRouteGuards(router)

export default router