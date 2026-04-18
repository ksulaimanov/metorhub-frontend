import { defineStore } from 'pinia'

export interface AppNotification {
  id: number
  type: 'REVIEW_REMINDER' | 'SYSTEM'
  title: string
  message: string
  payload?: any
  read: boolean
}

interface NotificationState {
  notifications: AppNotification[]
  isReviewModalOpen: boolean
  reviewBookingId: number | null
}

export const useNotificationStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [
      {
        id: 1,
        type: 'REVIEW_REMINDER',
        title: 'Оставьте отзыв',
        message: 'Поделитесь впечатлениями о недавнем уроке.',
        payload: { bookingId: 101 },
        read: false
      }
    ], // Mock initial data for demonstration as requested
    isReviewModalOpen: false,
    reviewBookingId: null,
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length
  },
  actions: {
    markAsRead(id: number) {
      const notif = this.notifications.find(n => n.id === id)
      if (notif) notif.read = true
    },
    addNotification(notif: any) {
      this.notifications.unshift({
        id: notif.id || Date.now(),
        type: notif.type || 'SYSTEM',
        title: notif.title || 'New Notification',
        message: notif.message || '',
        payload: notif.payload,
        read: false
      })
    },
    openReviewModal(bookingId: number) {
      this.reviewBookingId = bookingId
      this.isReviewModalOpen = true
    },
    closeReviewModal() {
      this.isReviewModalOpen = false
      this.reviewBookingId = null
    }
  }
})
