/**
 * Dashboard types
 */

export interface UpcomingEvent {
  id: number
  type: 'booking' | 'lesson' | 'event'
  title: string
  description?: string
  startAt: string
  endAt: string
  mentorName: string
  studentName?: string
  lessonFormat: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  capacity?: number
  bookedCount?: number
  availableSeats?: number
}

export interface DashboardStats {
  totalBookings: number
  completedBookings: number
  upcomingBookings: number
  totalStudents: number
  totalMentors: number
  averageRating: number
}

export interface StudentDashboard {
  upcomingEvents: UpcomingEvent[]
  totalBookings: number
  completedBookings: number
}

export interface MentorDashboard {
  upcomingEvents: UpcomingEvent[]
  totalBookings: number
  completedBookings: number
  totalStudents: number
  averageRating: number
}

export interface AdminDashboard {
  stats: DashboardStats
  recentEvents: UpcomingEvent[]
}

