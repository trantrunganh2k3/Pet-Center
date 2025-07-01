// components/AuthButtons.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Cần cài đặt: npm install js-cookie
import { authenticateAPI } from "@/app/APIRoute";
import axios from "axios";
import { toast } from "react-toastify";
import GlobalLoading from "./GlobalLoading";

export default function AuthButtons() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra xem token có tồn tại trong cookies không
        const token = Cookies.get('accessToken'); // hoặc tên cookie bạn đang sử dụng
        
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Tùy chọn: Xác thực token với backend
        try {
          interface AuthResponse {
            code: number;
          }

          const response = await axios.post<AuthResponse>(
            authenticateAPI,
            {
              token: token,
            },
            {
              // Cấu hình này sẽ không ném lỗi cho status codes khác 2xx
              validateStatus: function (status) {
                return true; // Luôn trả về response thay vì exception
              },
            }
          )
          
          if (response.data.code === 1000) {
            setIsAuthenticated(true);
            setUser(Cookies.get('username') ? { name: Cookies.get('username') } : null); // Lưu ý: bạn cần lưu tên người dùng vào cookie khi đăng nhập thành công
          } else {
            // Token không hợp lệ
            Cookies.remove('accessToken');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Lỗi khi xác thực token:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Gọi API đăng xuất để hủy token trên backend (nếu cần)
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Xóa cookie
      Cookies.remove('accessToken'); // hoặc tên cookie bạn đang sử dụng
      Cookies.remove('username'); // Xóa tên người dùng nếu bạn đã lưu vào cookie
      Cookies.remove('userId'); // Xóa userId nếu bạn đã lưu vào cookie
      
      // Cập nhật state
      setIsAuthenticated(false);
      setUser(null);
      
      toast.success('Đăng xuất thành công!');
      
      // Chuyển hướng về trang chủ
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  if (isLoading) {
    return <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.name || 'Người dùng'}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Đăng ký
      </Link>
    </div>
  );
}
