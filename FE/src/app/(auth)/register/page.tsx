
'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { registerAPI } from "@/app/APIRoute";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const Register = () => {

    const [newCustomer, setNewCustomer] = useState({
            username: '',
            password: '',
            role: 'CUSTOMER',
            name: '',
            email: '',
            phone: '',
            address: '',
            dob: ''
        });
    const router = useRouter();

    const handleNewCustomerChange = (e) => {
      const { name, value } = e.target;
      setNewCustomer({
          ...newCustomer,
          [name]: value
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      interface LoginResponse {
        code: number;
        [key: string]: any;
      }

      const response = await axios.post<LoginResponse>(
        registerAPI, 
        {
          username: newCustomer.username,
          password: newCustomer.password,
          role: newCustomer.role,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          dob: newCustomer.dob,
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
        toast.error(data.message || 'Đăng ký thất bại!');
      } else {
        // Xử lý đăng nhập thành công
        toast.success("Đăng ký thành công!");
        
        // Chuyển hướng đến trang đăng nhập
        router.push("/auth/login");
      }
    }catch(error){
      toast.error("Login failed. Please check your credentials.");
    }
  };

    return (
        <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-blue-300 overflow-auto py-8">
            <div className="hidden md:flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                <img 
                       width={1000}
                       height={760}
                       className="hidden md:block"
                       alt="Screenshots of the register page"
                />
            </div>
            <div className="w-full max-w-md md:w-2/5 lg:w-1/3 px-4 md:px-0">
              <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                <form className="space-y-3 w-full" onSubmit={handleSubmit}>
                  <div className="rounded-lg bg-gray-50 px-4 md:px-6 pb-4 pt-6">
                    <h1 className="mb-3 text-xl md:text-2xl font-medium">
                      Chào mừng đến với ứng dụng.
                    </h1>
                    <div className="w-full space-y-3">
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="username"
                        >
                          Username
                        </label>
                        <div className="relative">
                          <input
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Nhập username"
                            value={newCustomer.username}
                            onChange={handleNewCustomerChange}
                            required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="password"
                        >
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Nhập mật khẩu"
                          value={newCustomer.password}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <KeyOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="name"
                        >
                          Tên của bạn
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Nhập tên của bạn"
                          value={newCustomer.name}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="phone"
                        >
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="phone"
                          type="text"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={newCustomer.phone}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="email"
                        >
                          Địa chỉ email
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Nhập địa chỉ email"
                          required
                          value={newCustomer.email}
                          onChange={handleNewCustomerChange}
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="address"
                        >
                          Địa chỉ
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="address"
                          type="text"
                          name="address"
                          placeholder="Nhập địa chỉ"
                          value={newCustomer.address}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-xs font-medium text-gray-900"
                          htmlFor="dob"
                        >
                          Ngày sinh
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          id="dob"
                          type="date"
                          name="dob"
                          placeholder="Nhập ngày sinh"
                          value={newCustomer.dob}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-center">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-40"
                      >
                        Đăng ký
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p>{"Bạn đã có tài khoản?  "}
                      <span>
                        <a href="/login" className="text-blue-600 underline">Đăng nhập</a>
                      </span>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        </div>
    );
};

export default Register;
