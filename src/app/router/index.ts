import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../pages/public/HomePage.vue'
import LoginPage from '../../pages/auth/LoginPage.vue'
import RegisterPage from '../../pages/auth/RegisterPage.vue'
import MentorDirectoryPage from '../../pages/public/MentorDirectoryPage.vue'
import PublicMentorProfilePage from '../../pages/public/PublicMentorProfilePage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage,
        },
        {
            path: '/mentors',
            name: 'mentor-directory',
            component: MentorDirectoryPage,
        },
        {
            path: '/mentors/:id',
            name: 'public-mentor-profile',
            component: PublicMentorProfilePage,
            props: true,
        },
    ],
})

export default router