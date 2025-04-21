export interface APIResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export interface ServiceCategory {
  cateId: string;
  name: string;
  description: string;
}

export interface Pet {
  petId: string;
  name: string;
  type: string;
  breed: string;
  image: string;
}

export interface SubService {
  serviceId: string;
  name: string;
  description: string;
  categoryId: string;
  min_price: number;
  max_price: number;
}

export interface Schedule {
  scheduleId?: string;
  customerId: string;
  petId: string;
  subServiceIds: string[];
  date: Date;
  time: string;
  createdAt: Date;
}
