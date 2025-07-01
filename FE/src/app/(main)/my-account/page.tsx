// app/(main)/tai-khoan/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getCustomerAPI, customerAPI } from '@/app/APIRoute';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AccountPage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    dob: '',
    address: '',
    phone: '',
  });

  const [originalUser, setOriginalUser] = useState({
    name: '',
    email: '',
    dob: '',
    address: '',
    phone: '',
  });

  const accessToken = Cookies.get('accessToken');
  const userId = Cookies.get('userId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          getCustomerAPI, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            validateStatus: function (status) {
              return true; // Always return response instead of exception
            },
          },
        );

        const data = response.data as { code: number; message?: string; result: { name: string; email: string; dob: string; address: string; phone: string } };
        if (data.code !== 1000) {
          toast.error(data.message || 'Tải thông tin người dùng thất bại!');
        } else {
          const userData = {
            name: data.result.name,
            email: data.result.email,
            dob: data.result.dob,
            address: data.result.address,
            phone: data.result.phone,
          };
          setUser(userData);
          setOriginalUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  const handleUpdateClick = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${customerAPI}/${userId}`, 
        {
          name: user.name,
          dob: user.dob,
          address: user.address,
          phone: user.phone,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as { code: number; message?: string };
      if (data.code !== 1000) {
        toast.error(data.message || 'Cập nhật thông tin thất bại');
      } else {
        toast.success('Cập nhật thông tin thành công');
        setOriginalUser(user);
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  // Sử dụng một cấu trúc đơn giản hơn, loại bỏ các container lồng nhau không cần thiết
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Thông tin chi tiết tài khoản khách hàng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2">{user.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2">{user.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ email:</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          ) : (
            <p className="text-gray-900 py-2">{user.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh:</label>
          {editMode ? (
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2">{user.dob}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
          {editMode ? (
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2">{user.address}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        {editMode ? (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleUpdateClick}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Chỉnh sửa thông tin
          </button>
        )}
      </div>
    </div>
  );
}