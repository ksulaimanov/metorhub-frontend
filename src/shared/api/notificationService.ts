import SockJS from 'sockjs-client'
import Stomp, { type Client as StompClient } from 'webstomp-client'
import type { NotificationDto } from '@/entities/notification/model/notificationStore'

let stompClient: StompClient | null = null
type NotificationCallback = (notification: Partial<NotificationDto> & { read?: boolean }) => void
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

    const socket = new SockJS(`${baseURL}/ws-stomp`)
    stompClient = Stomp.over(socket)

    stompClient.debug = () => {}

    stompClient.connect(
      {},
      () => {
        stompClient?.subscribe('/user/topic/notifications', (message: { body: string }) => {
          try {
            const notification = JSON.parse(message.body) as Partial<NotificationDto> & { read?: boolean }
            callbacks.forEach(cb => cb(notification))
          } catch (e) {
            console.error('Failed to parse notification message', e)
          }
        })
      },
      (error: unknown) => {
        console.error('WS error', error)
        window.setTimeout(() => this.connect(), 5000)
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
