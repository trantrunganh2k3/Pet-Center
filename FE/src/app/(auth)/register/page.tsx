'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { registerAPI } from "@/app/APIRoute";
import { toast } from "react-toastify";
import { UserOutlined, KeyOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

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

    const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        toast.error('Đăng ký thất bại!');
      } else {
        // Xử lý đăng nhập thành công
        toast.success("Đăng ký thành công!");
        
        // Chuyển hướng đến trang đăng nhập
        router.push("/login");
      }
    }catch(error){
      toast.error("Đăng ký thất bại. Hãy kiểm tra lại!");
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
                       alt="Pet registration"
                    />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-end mb-4">
                        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                            <HomeOutlined />
                            <span>Quay về trang chủ</span>
                        </Link>
                    </div>
                    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <h1 className="mb-6 text-2xl font-semibold text-gray-900">
                      Chào mừng đến với ứng dụng.
                    </h1>
                    <div className="w-full space-y-3">
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
                            value={newCustomer.username}
                            onChange={handleNewCustomerChange}
                            required
                          />
                          <UserOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
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
                          value={newCustomer.password}
                          onChange={handleNewCustomerChange}
                          required
                          />
                          <KeyOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium text-gray-900"
                          htmlFor="name"
                        >
                          Tên của bạn
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                          className="mb-2 block text-sm font-medium text-gray-900"
                          htmlFor="phone"
                        >
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                          className="mb-2 block text-sm font-medium text-gray-900"
                          htmlFor="email"
                        >
                          Địa chỉ email
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                          className="mb-2 block text-sm font-medium text-gray-900"
                          htmlFor="address"
                        >
                          Địa chỉ
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                          className="mb-2 block text-sm font-medium text-gray-900"
                          htmlFor="dob"
                        >
                          Ngày sinh
                        </label>
                        <div className="relative">
                          <input
                          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                        className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                      >
                        Đăng ký
                      </button>
                    </div>

                    <div className="text-center">
                      <p>{"Bạn đã có tài khoản?  "}
                      <span>
                        <a href="/login" className="text-blue-600 underline">Đăng nhập</a>
                      </span>
                      </p>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
