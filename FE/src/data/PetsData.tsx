import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { petAPI } from '../app/APIRoute';
import { Pet } from '../types/interfaces';

interface ServerResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

type ApiError = {
  response?: {
    data: ServerResponse;
    status: number;
    statusText: string;
  };
  message: string;
};

interface PetFormData {
  name: string;
  species: string;
  age: number;
  weight: number;
  gender: 'MALE' | 'FEMALE';
  color: string;
  customerId?: string;
}

// API services
const petAPIService = {
    async create(data: PetFormData, customerId: string): Promise<Pet> {
        const response = await axios.post<ServerResponse<Pet>>(
            `${petAPI}/${customerId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            }
        );
        if (response.data && response.data.code !== 1000) {
            throw new Error(response.data.message || 'Lỗi khi thêm thú cưng');
          }
          return response.data.result;
    },

    async getAll(): Promise<Pet[]> {
        const response = await axios.get<ServerResponse<Pet[]>>(
          petAPI, {
            headers: {
              Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          },
        );
        if (response.data && response.data.code !== 1000) {
          throw new Error(response.data.message || 'Lỗi khi lấy danh sách thú cưng');
        }
        return response.data.result;
    },

    async getByCustomerId(customerId: string): Promise<Pet[]> {
        const response = await axios.get<ServerResponse<Pet[]>>(
          `${petAPI}/customer/${customerId}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          },
        );
        if (response.data && response.data.code !== 1000) {
          throw new Error(response.data.message || 'Lỗi khi lấy danh sách thú cưng');
        }
        return response.data.result;
    },

    async update(id: string, data: Partial<PetFormData>): Promise<Pet> {
        const response = await axios.put<ServerResponse<Pet>>(
          `${petAPI}/${id}`,
          data, {
            headers: {
              Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          },
        );
        if (response.data && response.data.code !== 1000) {
          throw new Error(response.data.message || 'Lỗi khi cập nhật thông tin');
        }
        return response.data.result;
    },

    async delete(id: string): Promise<void> {
        const response = await axios.delete<ServerResponse<void>>(
          `${petAPI}/${id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          },
        );
        if (response.data && response.data.code !== 1000) {
          throw new Error(response.data.message || 'Lỗi khi xóa thú cưng');
        }
        return response.data.result;
      }
}

// Custom hook for managing pets
export function usePets() {

  const [pets, setPets] = useState<Pet[]>([]);
  const [petsPerCustomer, setPetsPerCustomer] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const roles = Cookies.get('role');

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error trước khi fetch
      const data = await petAPIService.getAll();
      setPets(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetPerCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error trước khi fetch
      const data = await petAPIService.getByCustomerId(customerId);
      setPetsPerCustomer(data);
    } catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  }

  // Hàm xử lý lỗi chung
  const handleError = (error: unknown) => {
    const err = error as ApiError;
    const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', err);
  };

  const updatePet = async (id: string, data: Partial<PetFormData>) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await petAPIService.update(id, data);
      await fetchPets(); // Refresh sau khi cập nhật
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await petAPIService.delete(id);
      await fetchPets(); // Refresh sau khi xóa
      toast.success('Xóa thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createPet = async (data: PetFormData, customerId: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await petAPIService.create(data, customerId);
      await fetchPets(); // Refresh sau khi tạo mới
      toast.success('Tạo thú cưng mới thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải khi component mount
  useEffect(() => {
    fetchPets();
    if(roles === "CUSTOMER"){
      const customerId = Cookies.get('userId');
      if (customerId) {
        fetchPetPerCustomer(customerId);
      }
    } // Lấy danh sách thú cưng theo customerId mặc định
  }, []);

  const fetchCustomerPets = async (customerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await petAPIService.getByCustomerId(customerId);
      return data;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    pets,
    petsPerCustomer,
    loading,
    error,
    fetchPets,
    updatePet,
    deletePet,
    createPet,
    fetchCustomerPets,
  };
}
