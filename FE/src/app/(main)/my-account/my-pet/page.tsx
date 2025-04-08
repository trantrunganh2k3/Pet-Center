'use client';
import React, { useState, useEffect } from "react";

const MyPet = () => {

    const [petList, setPetList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [crOpen, setCrOpen] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        age: '',
        weight: '',
        gender: '',
        color: '',
    });

    const [newPet, setNewPet] = useState({
        name: '',
        species: '',
        age: '',
        weight: '',
        gender: '',
        color: '',
    });

    const handleEdit = (customer) => {
        setSelectedPet(customer);
        setFormData({
            name: customer.name,
            species: customer.species,
            age: customer.age,
            weight: customer.weight,
            gender: customer.gender,
            color: customer.color,
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
        setNewPet({
            ...newPet,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        // e.preventDefault();
        // updateCustomer(selectedUser.customerId, formData);

        // setIsOpen(false);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        //createCustomer(newCustomer);
        setCrOpen(false);
        // Reset form
        setNewPet({
            name: '',
            species: '',
            age: '',
            weight: '',
            gender: '',
            color: '',
        });
    };

    const confirmDelete = (customerId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            // deleteCustomer(customerId);
        }
    };
    
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
                            Thêm thú cưng
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
                                    Giống loài
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tuổi
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cân nặng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giới tính
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Màu sắc
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {petList.length > 0 ? (
                                petList.map((customer, index) => (
                                    <tr key={customer.petId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-800 font-medium text-sm">
                                                        {customer.name.split(' ').map((word) => word[0]).join('').toUpperCase().substring(0, 2)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.species}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.age}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-xs">{customer.weight}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.gender}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.color}</div>
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
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có dữ liệu thú cưng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {petList.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{petList.length}</span> thú cưng
                        </div>
                    </div>
                )}
            </div>
            
            {/* Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin thú cưng</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên thú cưng</label>
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
                                    <label htmlFor="species" className="block text-sm font-medium text-gray-700">Giống loài</label>
                                    <input
                                        type="text"
                                        name="species"
                                        id="species"
                                        value={formData.species}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Tuổi</label>
                                    <input
                                        type="text"
                                        name="age"
                                        id="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Cân nặng</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        id="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
                                    <input
                                        type="text"
                                        name="gender"
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Màu sắc</label>
                                    <input
                                        type="text"
                                        name="color"
                                        id="color"
                                        value={formData.color}
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
                            <h3 className="text-lg font-medium text-gray-900">Thêm thú cưng mới</h3>
                        </div>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Tên thú cưng</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="new-name"
                                        value={newPet.name}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập tên thú cưng"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-species" className="block text-sm font-medium text-gray-700">Giống loài</label>
                                    <input
                                        type="text"
                                        name="species"
                                        id="new-species"
                                        value={newPet.species}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập giống loài"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-age" className="block text-sm font-medium text-gray-700">Tuổi</label>
                                    <input
                                        type="text"
                                        name="age"
                                        id="new-age"
                                        value={newPet.age}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập tuổi"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-weight" className="block text-sm font-medium text-gray-700">Cân nặng</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        id="new-weight"
                                        value={newPet.weight}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập cân nặng"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
                                    <input
                                        type="text"
                                        name="gender"
                                        id="new-gender"
                                        value={newPet.gender}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập giới tính"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-color" className="block text-sm font-medium text-gray-700">Màu sắc</label>
                                    <input
                                        type="text"
                                        name="color"
                                        id="new-color"
                                        value={newPet.color}
                                        onChange={handleNewCustomerChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                        placeholder="Nhập màu sắc"
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
                                    Thêm thú cưng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPet;