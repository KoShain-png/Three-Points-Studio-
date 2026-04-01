export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  service: Service;
  user?: Pick<User, 'name' | 'email' | 'phone'>;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  totalPrice: number;
  createdAt: string;
}

export interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalClients: number;
}
