import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serviceAPI } from '@/app/APIRoute';
import { SubService, APIResponse } from '../types';
import Cookies from 'js-cookie';

export function useSubServices(categoryId: string | null) {
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubServices = async () => {
    if (!categoryId) {
      setSubServices([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<APIResponse<SubService[]>>(
        `${serviceAPI}/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      
      if (response.data.code === 1000) {
        setSubServices(response.data.result);
      } else {
        setError('Không thể tải danh sách dịch vụ');
        toast.error('Không thể tải danh sách dịch vụ');
      }
    } catch (err) {
      const errorMessage = 'Đã xảy ra lỗi khi tải danh sách dịch vụ';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubServices();
  }, [categoryId]);

  return {
    subServices,
    loading,
    error,
    fetchSubServices,
  };
}
