import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { staffAPI, addStaffAPI } from '../app/APIRoute';
import { Staff, StaffFormData, APIResponse } from '../types/interfaces';

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

// API services
const staffAPIService = {
  async create(data: StaffFormData): Promise<Staff> {
    const response = await axios.post<ServerResponse<Staff>>(
      `${addStaffAPI}`,
      data
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi tạo nhân viên');
    }
    return response.data.result;
  },

  async getAll(): Promise<Staff[]> {
    const response = await axios.get<ServerResponse<Staff[]>>(
      staffAPI,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách nhân viên');
    }
    return response.data.result;
  },

  async update(id: string, data: Partial<StaffFormData>): Promise<Staff> {
    const response = await axios.put<ServerResponse<Staff>>(
      `${staffAPI}/${id}`,
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
      `${staffAPI}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      }
    );
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi xóa nhân viên');
    }
  }
};

// Custom hook sử dụng services ở trên
export function useStaffs() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error trước khi fetch
      const data = await staffAPIService.getAll();
      setStaffs(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý lỗi chung
  const handleError = (error: unknown) => {
    const err = error as ApiError;
    const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
    setError(errorMessage);
    toast.error(errorMessage);
    console.error('API Error:', err);
  };

  const updateStaff = async (id: string, data: Partial<StaffFormData>) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await staffAPIService.update(id, data);
      await fetchStaffs(); // Refresh sau khi cập nhật
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await staffAPIService.delete(id);
      await fetchStaffs(); // Refresh sau khi xóa
      toast.success('Xóa thông tin thành công!');
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (data: StaffFormData) => {
    try {
      setLoading(true);
      setError(null); // Reset error
      await staffAPIService.create(data);
      await fetchStaffs(); // Refresh sau khi tạo mới
      toast.success('Tạo mới thành công!');
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
    fetchStaffs();
  }, []);

  return {
    staffs,
    loading,
    error,
    fetchStaffs,
    updateStaff,
    deleteStaff,
    createStaff,
  };

}
