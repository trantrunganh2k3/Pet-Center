export interface Pet {
  petId: string;
  name: string;
  species: string;
  age: number;
  weight: number;
  gender: 'MALE' | 'FEMALE';
  color: string;
  customerId: string;
}

export interface Customer {
  customerId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  pets?: Pet[];
  role: 'CUSTOMER';
}

export interface CustomerFormData {
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  role: 'CUSTOMER';
}

export interface APIResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface FilterOptions {
  searchTerm: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy: 'name' | 'date' | 'email';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PetFormData {
  name: string;
  species: string;
  age: number;
  weight: number;
  gender: 'MALE' | 'FEMALE';
  color: string;
}

export interface Staff {
  staffId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  schedule?: StaffSchedule[];
}

export interface StaffFormData {
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'STAFF';
}

export interface StaffSchedule {
  date: string;
  shifts: Shift[];
}

export interface Shift {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'OFF';
  service?: string;
  customer?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  min_price: number;
  max_price: number;
}
