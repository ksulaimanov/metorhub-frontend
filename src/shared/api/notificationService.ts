import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { useNotificationStore } from '../../stores/notificationStore'
import { useToastStore } from '../../shared/lib/getApiErrorMessage'

let stompClient: any = null

export const notificationService = {
  connect() {
    if (stompClient && stompClient.connected) return

    const token = localStorage.getItem('accessToken')
    if (!token) return

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const socket = new SockJS(`${baseURL}/ws`)
    stompClient = Stomp.over(socket)

    // Disable debug logs to keep console clean
    stompClient.debug = () => {}

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        stompClient.subscribe('/user/topic/notifications', (message: any) => {
          try {
            const notification = JSON.parse(message.body)
            const notificationStore = useNotificationStore()
            const toastStore = useToastStore()

            notificationStore.addNotification(notification)

            // Show toast
            toastStore.info(`${notification.title}: ${notification.message}`)
          } catch (e) {
            console.error('Failed to parse notification message', e)
          }
        })
      },
      (error: any) => {
        console.error('WS error', error)
        setTimeout(() => this.connect(), 5000) // reconnect with delay
      }
    )
  },

  disconnect() {
    if (stompClient) {
      stompClient.disconnect()
      stompClient = null
    }
  }
}

