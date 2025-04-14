import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { customerAPI as customersAPI } from '../app/APIRoute';
import { Customer, CustomerFormData, APIResponse, ValidationError } from '../types/interfaces';
import { validateEmail, validatePhone } from '../utils/validationSchemas';

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

// Services for API calls
const customerAPIService = {
  async create(data: CustomerFormData): Promise<Customer> {
    const response = await axios.post<ServerResponse<Customer>>(
      `http://localhost:8080/petcenter/users/register`,
      data
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi tạo khách hàng');
    }
    return response.data.result;
  },

  async getAll(): Promise<Customer[]> {
    const response = await axios.get<ServerResponse<Customer[]>>(
      customersAPI, 
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách khách hàng');
    }
    return response.data.result;
  },

  async update(id: string, data: Partial<CustomerFormData>): Promise<Customer> {
    const response = await axios.put<ServerResponse<Customer>>(
      `${customersAPI}/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi cập nhật thông tin');
    }
    return response.data.result;
  },

  async delete(id: string): Promise<void> {
    const response = await axios.delete<ServerResponse<void>>(
      `${customersAPI}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi xóa khách hàng');
    }
  }
};

// Custom hook for managing customers
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error trước khi fetch
      const data = await customerAPIService.getAll();
      setCustomers(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Common error handler
  const handleError = (error: unknown) => {
    const err = error as ApiError;
    const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', err);
  };

  const updateCustomer = async (id: string, data: Partial<CustomerFormData>) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await customerAPIService.update(id, data);
      await fetchCustomers(); // Refresh sau khi cập nhật
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await customerAPIService.delete(id);
      await fetchCustomers(); // Refresh sau khi xóa
      toast.success('Xóa thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (data: CustomerFormData) => {
    // Validate email and phone before creating
    const isEmailValid = await validateEmail(data.email);
    const isPhoneValid = await validatePhone(data.phone);

    if (!isEmailValid) {
      toast.error('Email không hợp lệ');
      return false;
    }

    if (!isPhoneValid) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }
    try {
      setLoading(true);
      setError(null); // Reset error
      await customerAPIService.create(data);
      await fetchCustomers(); // Refresh sau khi tạo mới
      toast.success('Tạo khách hàng mới thành công!');
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
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    updateCustomer,
    deleteCustomer,
    createCustomer
  };
}
