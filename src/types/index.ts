export type UserType = 'customer' | 'operator';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: UserType;
  createdAt: Date;
}

export interface PostalArea {
  id: string;
  postalCode: string;
  city: string;
  areaName?: string;
}

export type ServiceType = 'hand' | 'machine' | 'both';
export type YardSizeCategory = 'small' | 'medium' | 'large';
export type ServiceRequestStatus = 'pending' | 'confirmed' | 'assigned' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  customerId: string;
  postalCode: string;
  address: string;
  yardSizeCategory: YardSizeCategory;
  estimatedTimeMinutes: number;
  serviceType: ServiceType;
  status: ServiceRequestStatus;
  requestedDate?: string; // ISO date string
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperatorService {
  id: string;
  operatorId: string;
  postalCode: string;
  serviceType: ServiceType;
  available: boolean;
  maxCapacityPerDay?: number;
  equipmentDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  serviceRequestId: string;
  operatorServiceId?: string;
  scheduledDate: string; // ISO date string
  scheduledTime?: string; // HH:MM format
  actualTimeMinutes?: number;
  basePrice: number;
  hourlyRate: number;
  discountMultiplier: number;
  finalPrice: number;
  status: BookingStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostalAreaBookingsCount {
  postalCode: string;
  bookingDate: string; // ISO date string
  activeBookingsCount: number;
}

// Form data types
export interface ServiceRequestFormData {
  postalCode: string;
  address: string;
  yardSizeCategory: YardSizeCategory;
  serviceType: ServiceType;
  requestedDate?: string;
  notes?: string;
}

export interface OperatorServiceFormData {
  postalCode: string;
  serviceType: ServiceType;
  maxCapacityPerDay?: number;
  equipmentDescription?: string;
}
