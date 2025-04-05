import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { staffAPI } from '../app/APIRoute';

// Services (các hàm gọi API)
const staffAPIService = {
  async create(data) {
    const response = await axios.post(
      `http://localhost:8080/petcenter/users/staff-register`,
      data,
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi tạo khách hàng');
    }
    return response.data.result;
  },

  async getAll() {
    const response = await axios.get(
      staffAPI, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      },
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách khách hàng');
    }
    return response.data.result;
  },

  async update(id, data) {
    const response = await axios.put(
      `${staffAPI}/${id}`,
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

  async delete(id) {
    const response = await axios.delete(
      `${staffAPI}/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      },
    );
    if (response.data && response.data.code !== 1000) {
      throw new Error(response.data.message || 'Lỗi khi xóa khách hàng');
    }
    return response.data.result;
  }
};

// Custom hook sử dụng services ở trên
export function useStaffs() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const handleError = (err) => {
    if (err.response && err.response.data) {
      // Lỗi từ API response
      setError(err.response.data.message || 'Có lỗi xảy ra từ server');
      toast.error(err.response.data.message || 'Có lỗi xảy ra từ server');
    } else {
      // Lỗi khác (network, timeout...)
      setError(err.message || 'Có lỗi xảy ra');
      toast.error(err.message || 'Có lỗi xảy ra');
    }
    console.error('API Error:', err);
  };

  const updateStaff = async (id, data) => {
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

  const deleteStaff = async (id) => {
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

  const createStaff = async (data) => {
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