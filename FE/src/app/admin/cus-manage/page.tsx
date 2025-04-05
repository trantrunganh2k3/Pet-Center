'use client';
import React, { useState, useEffect, use } from "react";
import { useCustomers } from '../../../data/CustomersData';

const Customers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [crOpen, setCrOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: ''
    });
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

    const { 
        customers, 
        loading, 
        error, 
        fetchCustomers, 
        updateCustomer, 
        deleteCustomer,
        createCustomer,
    } = useCustomers();

    const handleEdit = (customer) => {
        setSelectedUser(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            dob: customer.dob ? new Date(customer.dob).toISOString().split('T')[0] : ''
        });
        setIsOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({
            ...newCustomer,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCustomer(selectedUser.customerId, formData);

        setIsOpen(false);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createCustomer(newCustomer);
        setCrOpen(false);
        // Reset form
        setNewCustomer({
            username: '',
            password: '',
            role: 'CUSTOMER',
            name: '',
            email: '',
            phone: '',
            address: '',
            dob: ''
        });
    };

    const confirmDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            deleteCustomer(id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Lỗi! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Danh sách khách hàng</h2>
                        <button 
                            onClick={() => setCrOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Thêm khách hàng
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Điện thoại
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày sinh
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.length > 0 ? (
                                customers.map((customer, index) => (
                                    <tr key={customer.customerId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-800 font-medium text-sm">
                                                        {customer.name.split(' ').map((word: string) => word[0]).join('').toUpperCase().substring(0, 2)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-xs">{customer.address}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(customer.dob)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleEdit(customer)}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-1 mr-2 transition duration-150 ease-in-out"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(customer.customerId)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md px-3 py-1 transition duration-150 ease-in-out"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có dữ liệu khách hàng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {customers.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{customers.length}</span> khách hàng
                        </div>
                    </div>
                )}
            </div>
            
            {/* Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin khách hàng</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <textarea
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        id="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 text-right">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {crOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Thêm khách hàng mới</h3>
                        </div>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="p-6 space-y-4">
                            <div>
                                    <label htmlFor="new-username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="new-username"
                                        value={newCustomer.username}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập username"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="new-password"
                                        value={newCustomer.password}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="new-name"
                                        value={newCustomer.name}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập tên khách hàng"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="new-email"
                                        value={newCustomer.email}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700">Điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="new-phone"
                                        value={newCustomer.phone}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <textarea
                                        name="address"
                                        id="new-address"
                                        value={newCustomer.address}
                                        onChange={handleNewCustomerChange}
                                        required
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Địa chỉ khách hàng"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="new-dob" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        id="new-dob"
                                        value={newCustomer.dob}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 text-right">
                                <button
                                    type="button"
                                    onClick={() => setCrOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                                >
                                    Thêm khách hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Customers;