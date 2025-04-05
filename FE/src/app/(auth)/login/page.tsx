'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginAPI } from "@/app/APIRoute";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!username || !password) {
      toast.error('Please enter a valid username and password.');
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
        toast.error(data.message || 'Login failed');
      } else {
        // Xử lý đăng nhập thành công
        toast.success("Login successful!");
        
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
        
          console.log("User info - ID:", userId, "Username:", username, "Roles:", roles);
        
          //Kiểm tra role là mảng và chứa "ADMIN" hoặc "USER"
          if (roles && Array.isArray(roles)) {
            if (roles.includes("ADMIN")) {
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
      toast.error("Login failed. Please check your credentials.");
    }
  };

    return (
        <div className="flex flex-row h-screen items-center justify-center bg-blue-300">
            <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                <img 
                       width={1000}
                       height={760}
                       className="hidden md:block"
                       alt="Screenshots of the login page"
                />
            </div>
            <div className="w-96 h-auto p-6 bg-white rounded-lg shadow-lg flex items-center justify-center md:w-1/3">
              <form className="space-y-3 w-full" onSubmit={handleSubmit}>
                <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 w-full" >
                  <h1 className={`mb-3 text-2xl`}>
                    Hãy đăng nhập để tiếp tục
                  </h1>
                <div className="w-full">
                  <div>
                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-40"
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
              </div>
            </form>
          </div>
        </div>
    );
};

export default Login;
