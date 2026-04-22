import { defineStore } from 'pinia'

export interface NotificationDto {
  id: number
  type: 'REVIEW_REMINDER' | 'SYSTEM'
  title: string
  message: string
  payload?: Record<string, unknown>
  isRead: boolean
}

interface NotificationState {
  notifications: NotificationDto[]
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
        isRead: false,
      }
    ],
    isReviewModalOpen: false,
    reviewBookingId: null,
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.isRead).length
  },
  actions: {
    markAsRead(id: number) {
      const notif = this.notifications.find(n => n.id === id)
      if (notif) notif.isRead = true
    },
    addNotification(notif: Partial<NotificationDto> & { read?: boolean; payload?: Record<string, unknown> }) {
      this.notifications.unshift({
        id: notif.id || Date.now(),
        type: notif.type || 'SYSTEM',
        title: notif.title || 'New Notification',
        message: notif.message || '',
        payload: notif.payload,
        isRead: Boolean(notif.isRead ?? notif.read ?? false),
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
