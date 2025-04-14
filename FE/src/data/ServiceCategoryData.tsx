import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { serviceCategoryAPI } from '../app/APIRoute';
import { ServiceCategory } from '../types/interfaces';
import { set } from 'react-hook-form';

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

  async update(id: string, data: Partial<ServiceCategoryFormData>): Promise<ServiceCategory> {
    const response = await axios.put<ServerResponse<ServiceCategory>>(
      `${serviceCategoryAPI}/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
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

export function useServiceCategory () {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fecthServiceCategories = async () => {
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

  const updateServiceCategory = async (id: string, data: Partial<ServiceCategoryFormData>) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await serviceCategoryAPIService.update(id, data);
      await fecthServiceCategories(); // Fetch updated list
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
      setError(null); // Reset error
      await serviceCategoryAPIService.delete(id);
      await fecthServiceCategories(); // Fetch updated list
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
      setError(null); // Reset error
      await serviceCategoryAPIService.create(data);
      await fecthServiceCategories(); // Fetch updated list
      toast.success('Tạo danh mục dịch vụ thành công!');
      return true;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthServiceCategories();
  }, []);

  return {
    serviceCategories,
    loading,
    error,
    fecthServiceCategories,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
  };
}