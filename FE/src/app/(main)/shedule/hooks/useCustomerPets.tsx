import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { petAPI } from '@/app/APIRoute';
import { Pet, APIResponse } from '../types';
import Cookies from 'js-cookie';

export function useCustomerPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = Cookies.get('userId');
      console.log('Current userId:', userId);
      
      if (!userId) {
        setError('Không tìm thấy thông tin người dùng');
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.get<APIResponse<Pet[]>>(
        `${petAPI}/customer/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      console.log('Pet Response:', response.data);
      
      if (response.data.code === 1000) {
        setPets(response.data.result);
      } else {
        setError('Không thể tải danh sách thú cưng');
        toast.error('Không thể tải danh sách thú cưng');
      }
    } catch (err) {
      const errorMessage = 'Đã xảy ra lỗi khi tải danh sách thú cưng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPet = async (petData: Omit<Pet, 'petId'>) => {
    try {
      setLoading(true);
      const userId = Cookies.get('userId');
      
      if (!userId) {
        toast.error('Vui lòng đăng nhập lại');
        return null;
      }

      const response = await axios.post<APIResponse<Pet>>(
        `${petAPI}/${userId}`,
        petData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      
      if (response.data.code === 1000) {
        toast.success('Thêm thú cưng thành công!');
        await fetchPets(); // Refresh danh sách
        return response.data.result;
      } else {
        toast.error('Không thể thêm thú cưng');
        return null;
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi thêm thú cưng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    loading,
    error,
    createPet,
    fetchPets,
  };
}
