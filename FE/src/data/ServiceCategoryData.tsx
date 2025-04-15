import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { serviceCategoryAPI } from '../app/APIRoute';
import { ServiceCategory } from '../types/interfaces';

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

interface ServiceCategoryFormData {
  name: string;
  description: string;
  imageUrl?: string;
}

// API services
const serviceCategoryAPIService = {
  async create(data: ServiceCategoryFormData): Promise<ServiceCategory> {
    const response = await axios.post<ServerResponse<ServiceCategory>>(
      serviceCategoryAPI,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Error creating service category');
    }
    return response.data.result;
  },

  async getAll(): Promise<ServiceCategory[]> {
    const response = await axios.get<ServerResponse<ServiceCategory[]>>(
      serviceCategoryAPI,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Error fetching service categories');
    }
    return response.data.result;
  },

  async update(id: string, data: { name: string; description: string }): Promise<ServiceCategory> {
    const response = await axios.put<ServerResponse<ServiceCategory>>(
      `${serviceCategoryAPI}/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          'Content-Type': 'application/json'
        },
      }
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Error updating service category');
    }
    return response.data.result;
  },

  async delete(id: string): Promise<void> {
    const response = await axios.delete<ServerResponse>(
      `${serviceCategoryAPI}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Error deleting service category');
    }
  },
}

// Custom hook to manage service categories
export function useServiceCategory() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceCategoryAPIService.getAll();
      setServiceCategories(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    const err = error as ApiError;
    const errorMessage = err.response?.data.message || err.message || 'Có lỗi xảy ra';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', err);
  };

  const updateServiceCategory = async (id: string, data: { name: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceCategoryAPIService.update(id, data);
      await fetchServiceCategories();
      toast.success('Cập nhật danh mục dịch vụ thành công!');
      return true;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await serviceCategoryAPIService.delete(id);
      await fetchServiceCategories();
      toast.success('Xóa danh mục dịch vụ thành công!');
      return true;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const createServiceCategory = async (data: ServiceCategoryFormData) => {
    try {
      setLoading(true);
      setError(null);
      await serviceCategoryAPIService.create(data);
      await fetchServiceCategories();
      toast.success('Tạo danh mục dịch vụ thành công!');
      return true;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  return {
    serviceCategories,
    loading,
    error,
    fetchServiceCategories,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
  };
}
