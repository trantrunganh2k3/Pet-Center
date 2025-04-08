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
  id: number;
  name: string;
  type: string;
  breed: string;
  image: string;
}

export interface SubService {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
}
