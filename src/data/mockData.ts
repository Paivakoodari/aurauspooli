import {
  PostalArea,
  ServiceRequest,
  OperatorService,
  Booking,
  PostalAreaBookingsCount,
} from '../types';

// Mock Finnish postal areas (sample data)
export const mockPostalAreas: PostalArea[] = [
  { id: '1', postalCode: '00100', city: 'Helsinki', areaName: 'Keskusta' },
  { id: '2', postalCode: '00200', city: 'Helsinki', areaName: 'Lauttasaari' },
  { id: '3', postalCode: '00300', city: 'Helsinki', areaName: 'Munkkiniemi' },
  { id: '4', postalCode: '00400', city: 'Helsinki', areaName: 'Käpylä' },
  { id: '5', postalCode: '00500', city: 'Helsinki', areaName: 'Sörnäinen' },
  { id: '6', postalCode: '02100', city: 'Espoo', areaName: 'Tapiola' },
  { id: '7', postalCode: '02200', city: 'Espoo', areaName: 'Niittykumpu' },
  { id: '8', postalCode: '02600', city: 'Espoo', areaName: 'Leppävaara' },
  { id: '9', postalCode: '01300', city: 'Vantaa', areaName: 'Tikkurila' },
  { id: '10', postalCode: '01600', city: 'Vantaa', areaName: 'Myyrmäki' },
];

// In-memory storage for service requests
export let mockServiceRequests: ServiceRequest[] = [];

// In-memory storage for operator services
export let mockOperatorServices: OperatorService[] = [];

// In-memory storage for bookings
export let mockBookings: Booking[] = [];

// In-memory storage for postal area booking counts
export let mockPostalAreaBookingsCounts: PostalAreaBookingsCount[] = [];

// Helper to generate unique IDs
let idCounter = 1;
export const generateId = () => `mock-${idCounter++}`;

// Data access functions

export function getPostalAreas(): PostalArea[] {
  return mockPostalAreas;
}

export function getPostalAreaByCode(postalCode: string): PostalArea | undefined {
  return mockPostalAreas.find(pa => pa.postalCode === postalCode);
}

export function createServiceRequest(data: Omit<ServiceRequest, 'id' | 'customerId' | 'status' | 'createdAt' | 'updatedAt'>): ServiceRequest {
  const request: ServiceRequest = {
    ...data,
    id: generateId(),
    customerId: 'mock-customer-1', // Mock customer ID
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockServiceRequests.push(request);
  return request;
}

export function getServiceRequests(): ServiceRequest[] {
  return mockServiceRequests;
}

export function getServiceRequestsByPostalCode(postalCode: string): ServiceRequest[] {
  return mockServiceRequests.filter(sr => sr.postalCode === postalCode);
}

export function createOperatorService(data: Omit<OperatorService, 'id' | 'operatorId' | 'available' | 'createdAt' | 'updatedAt'>): OperatorService {
  const service: OperatorService = {
    ...data,
    id: generateId(),
    operatorId: 'mock-operator-1', // Mock operator ID
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockOperatorServices.push(service);
  return service;
}

export function getOperatorServices(): OperatorService[] {
  return mockOperatorServices;
}

export function getOperatorServicesByPostalCode(postalCode: string): OperatorService[] {
  return mockOperatorServices.filter(os => os.postalCode === postalCode);
}

export function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
  const booking: Booking = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockBookings.push(booking);

  // Update postal area bookings count
  updatePostalAreaBookingsCount(data.serviceRequestId, data.scheduledDate);

  return booking;
}

export function getBookings(): Booking[] {
  return mockBookings;
}

export function getBookingsByPostalCodeAndDate(postalCode: string, date: string): Booking[] {
  const requestsInArea = mockServiceRequests.filter(sr => sr.postalCode === postalCode);
  const requestIds = requestsInArea.map(r => r.id);

  return mockBookings.filter(b =>
    requestIds.includes(b.serviceRequestId) &&
    b.scheduledDate === date &&
    b.status !== 'cancelled'
  );
}

function updatePostalAreaBookingsCount(serviceRequestId: string, date: string) {
  const request = mockServiceRequests.find(r => r.id === serviceRequestId);
  if (!request) return;

  const postalCode = request.postalCode;
  const existing = mockPostalAreaBookingsCounts.find(
    c => c.postalCode === postalCode && c.bookingDate === date
  );

  if (existing) {
    existing.activeBookingsCount += 1;
  } else {
    mockPostalAreaBookingsCounts.push({
      postalCode,
      bookingDate: date,
      activeBookingsCount: 1,
    });
  }
}

export function getActiveBookingsCountForArea(postalCode: string, date: string): number {
  const count = mockPostalAreaBookingsCounts.find(
    c => c.postalCode === postalCode && c.bookingDate === date
  );
  return count ? count.activeBookingsCount : 0;
}

// Helper to get current bookings count for a postal code (for any date)
export function getCurrentBookingsInArea(postalCode: string): number {
  const requests = getServiceRequestsByPostalCode(postalCode);
  return requests.filter(r => r.status === 'pending' || r.status === 'confirmed').length;
}
