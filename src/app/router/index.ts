import { createRouter, createWebHistory } from 'vue-router'
const HomePage = () => import('../../pages/public/HomePage.vue')
const AboutPage = () => import('../../pages/public/AboutPage.vue')
const NotFoundPage = () => import('../../pages/system/NotFoundPage.vue')
const LoginPage = () => import('../../pages/auth/LoginPage.vue')
const RegisterPage = () => import('../../pages/auth/RegisterPage.vue')
const MentorDirectoryPage = () => import('../../pages/public/MentorDirectoryPage.vue')
const PublicMentorProfilePage = () => import('../../pages/public/PublicMentorProfilePage.vue')
const StudentProfilePage = () => import('../../pages/student/StudentProfilePage.vue')
const StudentBookingsPage = () => import('../../pages/student/StudentBookingsPage.vue')
const StudentDashboardPage = () => import('../../pages/student/StudentDashboardPage.vue')
const MentorProfilePage = () => import('../../pages/mentor/MentorProfilePage.vue')
const MentorSlotsPage = () => import('../../pages/mentor/MentorSlotsPage.vue')
const MentorBookingsPage = () => import('../../pages/mentor/MentorBookingsPage.vue')
const MentorDashboardPage = () => import('../../pages/mentor/MentorDashboardPage.vue')
const AdminDashboardPage = () => import('../../pages/admin/AdminDashboardPage.vue')
const AdminMentorApplicationsPage = () => import('../../pages/admin/AdminMentorApplicationsPage.vue')
const AdminMentorApplicationDetailPage = () => import('../../pages/admin/AdminMentorApplicationDetailPage.vue')
const VerifyEmailPage = () => import('../../pages/auth/VerifyEmailPage.vue')
const ForgotPasswordPage = () => import('../../pages/auth/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../../pages/auth/ResetPasswordPage.vue')
const MentorApplyPage = () => import('../../pages/public/MentorApplyPage.vue')
const MentorApplicationStatusPage = () => import('../../pages/public/MentorApplicationStatusPage.vue')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // --- public ---
        { path: '/', name: 'home', component: HomePage, meta: { title: 'JaiMentorship — Платформа для менторов и студентов' } },
        { path: '/about', name: 'about', component: AboutPage, meta: { title: 'О платформе — JaiMentorship' } },
        { path: '/mentors', name: 'mentor-directory', component: MentorDirectoryPage, meta: { title: 'Каталог менторов — JaiMentorship' } },
        { path: '/mentors/:id', name: 'public-mentor-profile', component: PublicMentorProfilePage, props: true, meta: { title: 'Профиль ментора — JaiMentorship' } },
        { path: '/mentor/apply', name: 'mentor-apply', component: MentorApplyPage, meta: { title: 'Стать ментором — JaiMentorship' } },
        { path: '/mentor/application/status', name: 'mentor-application-status', component: MentorApplicationStatusPage, meta: { title: 'Статус заявки — JaiMentorship' } },

        // --- auth ---
        { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Вход — JaiMentorship' } },
        { path: '/register', name: 'register', component: RegisterPage, meta: { title: 'Регистрация — JaiMentorship' } },
        { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage, meta: { title: 'Восстановление пароля — JaiMentorship' } },
        { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage, meta: { title: 'Сброс пароля — JaiMentorship' } },
        { path: '/verify-email', name: 'verify-email', component: VerifyEmailPage, meta: { title: 'Подтверждение email — JaiMentorship' } },

        // --- student ---
        { path: '/student/dashboard', name: 'student-dashboard', component: StudentDashboardPage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мой кабинет — JaiMentorship' } },
        { path: '/student/profile', name: 'student-profile', component: StudentProfilePage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мой профиль — JaiMentorship' } },
        { path: '/student/bookings', name: 'student-bookings', component: StudentBookingsPage, meta: { requiresAuth: true, role: 'ROLE_STUDENT', title: 'Мои занятия — JaiMentorship' } },

        // --- mentor ---
        { path: '/mentor/dashboard', name: 'mentor-dashboard', component: MentorDashboardPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Кабинет ментора — JaiMentorship' } },
        { path: '/mentor/profile', name: 'mentor-profile', component: MentorProfilePage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Мой профиль — JaiMentorship' } },
        { path: '/mentor/slots', name: 'mentor-slots', component: MentorSlotsPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Доступные слоты — JaiMentorship' } },
        { path: '/mentor/bookings', name: 'mentor-bookings', component: MentorBookingsPage, meta: { requiresAuth: true, role: 'ROLE_MENTOR', title: 'Заявки на занятия — JaiMentorship' } },

        // --- admin ---
        { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Админ панель — JaiMentorship' } },
        { path: '/admin/mentor-applications', name: 'admin-mentor-applications', component: AdminMentorApplicationsPage, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Заявки менторов — JaiMentorship' } },
        { path: '/admin/mentor-applications/:id', name: 'admin-mentor-application-detail', component: AdminMentorApplicationDetailPage, props: true, meta: { requiresAuth: true, role: 'ROLE_ADMIN', title: 'Заявка ментора — JaiMentorship' } },

        // --- 404 ---
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: '404 — Страница не найдена' } },
    ],
})


export default router