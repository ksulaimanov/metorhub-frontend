import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

let stompClient: any = null
type NotificationCallback = (notification: any) => void
const callbacks: NotificationCallback[] = []

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not configured. Set it in your environment file before running the app.')
}

export const notificationService = {
  onNotification(callback: NotificationCallback) {
    callbacks.push(callback)
  },

  offNotification(callback: NotificationCallback) {
    const index = callbacks.indexOf(callback)
    if (index > -1) callbacks.splice(index, 1)
  },

  connect() {
    if (stompClient && stompClient.connected) return

    // Create socket with credentials if cross-origin cookies are needed
    const socket = new SockJS(`${baseURL}/ws`)
    stompClient = Stomp.over(socket)

    // Disable debug logs to keep console clean
    stompClient.debug = () => {}

    stompClient.connect(
      {}, // Empty headers since we use cookies now
      () => {
        stompClient.subscribe('/user/topic/notifications', (message: any) => {
          try {
            const notification = JSON.parse(message.body)
            callbacks.forEach(cb => cb(notification))
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
