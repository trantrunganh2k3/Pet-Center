'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginAPI } from "@/app/APIRoute";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { UserOutlined, KeyOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!username || !password) {
      toast.error('Hãy nhập tên tài khoản và mật khẩu của bạn.');
      console.log('Please enter a valid username and password.');
      return;
    }

    try{
      interface LoginResponse {
        code: number;
        [key: string]: any;
      }

      const response = await axios.post<LoginResponse>(
        loginAPI, 
        {
          username: username,
          password: password,
        },
        {
          // Cấu hình này sẽ không ném lỗi cho status codes khác 2xx
          validateStatus: function (status) {
            return true; // Luôn trả về response thay vì exception
          },
        }
      );
  
      // Kiểm tra code từ response data thay vì status
      const data = response.data;
      
      if (data.code !== 1000) {
        // Hiển thị thông báo lỗi từ server
        toast.error(data.message || 'Đăng nhập thất bại');
      } else {
        // Xử lý đăng nhập thành công
        toast.success("Đăng nhập thành công!");
        
      // Giải mã token và chuyển hướng
        if (data.result.token) {
          const parts = data.result.token.split('.');
          const payload = parts[1];
          const decodedPayload = JSON.parse(atob(payload));
          const userId = decodedPayload.userID; // Lưu ý viết hoa ID
          const username = decodedPayload.sub;  // Sử dụng sub thay cho name
          const roles = decodedPayload.role;    // role là mảng
          Cookies.set('accessToken', data.result.token, { expires: 1 });
          Cookies.set('userId', userId, { expires: 1 });
          Cookies.set('username', username, { expires: 1 });
          Cookies.set('role', roles, { expires: 1 });
        
          console.log("User info - ID:", userId, "Username:", username, "Roles:", roles);
        
          //Kiểm tra role là mảng và chứa "ADMIN" hoặc "USER"
          if (roles && Array.isArray(roles)) {
            if (roles.includes("ADMIN") || roles.includes("STAFF")) {
              console.log("Redirecting to admin dashboard");
              router.push('/admin');
            } else if (roles.includes("CUSTOMER")) {
              console.log("Redirecting to user dashboard");
              router.push('/');
            } else {
              console.log("Unknown roles:", roles);
              toast.error("Unknown user role");
            }
          } else {
            console.error("Role not found or not an array");
            toast.error("Authentication error: Invalid role format");
          }
        }
      }
    }catch(error){
      toast.error("Đăng nhập thất bại. Hãy kiểm tra lại!");
    }
  };

    return (
<div className="flex min-h-screen items-center justify-center bg-blue-300 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-1/2 p-2">
                    <img 
                       src="/images/pet-login.jpg"
                       width={1000}
                       height={760}
                       className="w-full h-full object-cover rounded-lg"
                       alt="Pet login"
                    />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-end mb-4">
                        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                            <HomeOutlined />
                            <span>Quay về trang chủ</span>
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                    <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
                  <h1 className="mb-6 text-2xl font-semibold text-gray-900">
                    Hãy đăng nhập để tiếp tục
                  </h1>
                        <div className="w-full">
                          <div>
                    <label
                    className="mb-2 block text-sm font-medium text-gray-900"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Nhập username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                    className="mb-2 block text-sm font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                      className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      />
                      <KeyOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between mt-4">
                    <div className="flex items-center">
                        <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                        />
                        <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-900"
                        >
                        Ghi nhớ tài khoản
                        </label>
                    </div>
                    <a href="" className="text-sm font-medium text-blue-600 hover:underline">Quên mật khẩu?</a>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                  >
                    Đăng nhập
                  </button>
                </div>

                <div className={"items-start mt-4 justify-center text-center"}>
                  <p>{"Chưa có tài khoản?  "}
                  <span>
                    <a href="/register" className={" text-blue-600 underline"}>Đăng ký</a>
                  </span>
                  </p>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
