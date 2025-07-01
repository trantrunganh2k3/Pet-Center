'use client';
import React, { useState } from "react";
import { useCustomers } from '../../../data/CustomersData';
import { usePets } from '../../../data/PetsData';
import { Customer, CustomerFormData, Pet } from '../../../types/interfaces';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import ErrorBoundary from '../../../components/ErrorBoundary';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CustomerPetsModal from '../../../components/CustomerPetsModal';

const Customers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
    const [crOpen, setCrOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<Partial<CustomerFormData>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: ''
    });
    const [newCustomer, setNewCustomer] = useState<CustomerFormData>({
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
        updateCustomer, 
        deleteCustomer,
        createCustomer,
    } = useCustomers();

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const handleEdit = (customer: Customer) => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            const success = await updateCustomer(selectedUser.customerId, formData);
            if (success) {
                setIsOpen(false);
            }
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createCustomer(newCustomer);
        if (success) {
            setCrOpen(false);
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
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setCustomerToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (customerToDelete) {
            await deleteCustomer(customerToDelete);
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    const [petsModalOpen, setPetsModalOpen] = useState(false);
    const [selectedCustomerPets, setSelectedCustomerPets] = useState<{
        name: string;
        pets: Pet[];
    } | null>(null);

    const { fetchCustomerPets } = usePets();

    const handleViewPets = async (customer: Customer) => {
        setSelectedCustomerPets({
            name: customer.name,
            pets: []
        });
        setPetsModalOpen(true);
        const pets = await fetchCustomerPets(customer.customerId);
        setSelectedCustomerPets(prev => ({
            name: customer.name,
            pets: pets
        }));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <ErrorBoundary>
            <div className="container mx-auto mt-8 px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
                            <h2 className="text-2xl font-bold text-gray-800">Danh sách khách hàng</h2>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg
                                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <button 
                                    onClick={() => setCrOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Thêm khách hàng
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
                            <strong className="font-bold">Lỗi! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <LoadingSkeleton rows={5} />
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer, index) => (
                                        <tr key={customer.customerId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-800 font-medium text-sm">
                                                            {customer.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
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
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleViewPets(customer)}
                                                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md px-3 py-1 transition duration-150 ease-in-out"
                                                    >
                                                        Thú cưng
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(customer)}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-1 transition duration-150 ease-in-out"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(customer.customerId)}
                                                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md px-3 py-1 transition duration-150 ease-in-out"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                            {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Không có dữ liệu khách hàng nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredCustomers.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{filteredCustomers.length}</span> khách hàng
                                {searchTerm && <span> (đã lọc từ {customers.length} khách hàng)</span>}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Edit Modal Component remains the same */}
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

                {/* Create Modal Component remains the same */}
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
                <ConfirmationDialog
                    isOpen={deleteDialogOpen}
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa khách hàng này?"
                    confirmLabel="Xóa"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
                {selectedCustomerPets && (
                    <CustomerPetsModal
                        isOpen={petsModalOpen}
                        onClose={() => {
                            setPetsModalOpen(false);
                            setSelectedCustomerPets(null);
                        }}
                        customerName={selectedCustomerPets.name}
                        pets={selectedCustomerPets.pets}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}

export default Customers;
