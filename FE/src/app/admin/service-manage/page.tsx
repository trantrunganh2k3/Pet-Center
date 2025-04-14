'use client'
import React, { useState } from 'react';
import { ServiceCategory, Service } from '@/types/interfaces';
import ServiceCategoryCard from '@/components/ServiceCategoryCard';
import ServiceCategoryForm from '@/components/ServiceCategoryForm';
import ServiceForm from '@/components/ServiceForm';
import { useServiceCategory } from '@/data/ServiceCategoryData';
import { useServiceAPI } from '@/data/ServicesData';
import ConfirmationDialog from '@/components/ConfirmationDialog';

const ServiceManagePage = () => {
    // States for category management
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ServiceCategory | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    // States for service management
    const [isAddingService, setIsAddingService] = useState(false);
    const [isEditingService, setIsEditingService] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    // Custom hooks
    const {
        serviceCategories,
        loading: categoriesLoading,
        createServiceCategory,
        updateServiceCategory,
        deleteServiceCategory,
    } = useServiceCategory();

    const {
        services,
        loading: servicesLoading,
        fetchServices,
        createService,
        updateService,
        deleteService,
    } = useServiceAPI();

    // Category handlers
    const handleCategorySelect = (category: ServiceCategory) => {
        setSelectedCategory(category);
        fetchServices(category.id);
    };

    const handleAddCategory = async (data: { name: string; description: string }) => {
        const success = await createServiceCategory(data);
        if (success) {
            setIsAddingCategory(false);
        }
    };

    const handleEditCategory = async (data: { name: string; description: string }) => {
        if (categoryToEdit) {
            const success = await updateServiceCategory(categoryToEdit.id, data);
            if (success) {
                setIsEditingCategory(false);
                setCategoryToEdit(null);
            }
        }
    };

    const handleDeleteCategory = async () => {
        if (categoryToDelete) {
            const success = await deleteServiceCategory(categoryToDelete);
            if (success) {
                setCategoryToDelete(null);
                if (selectedCategory?.id === categoryToDelete) {
                    setSelectedCategory(null);
                }
            }
        }
    };

    // Service handlers
    const handleAddService = async (data: any) => {
        if (selectedCategory) {
            const success = await createService(selectedCategory.id, data);
            if (success) {
                setIsAddingService(false);
            }
        }
    };

    const handleEditService = async (data: any) => {
        if (serviceToEdit && selectedCategory) {
            const success = await updateService(selectedCategory.id, serviceToEdit.id, data);
            if (success) {
                setIsEditingService(false);
                setServiceToEdit(null);
            }
        }
    };

    const handleDeleteService = async () => {
        if (serviceToDelete && selectedCategory) {
            const success = await deleteService(selectedCategory.id, serviceToDelete);
            if (success) {
                setServiceToDelete(null);
            }
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Categories Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý danh mục dịch vụ</h2>
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Thêm danh mục mới
                    </button>
                </div>

                {/* Loading state for categories */}
                {categoriesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Categories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceCategories.map((category) => (
                        <ServiceCategoryCard
                            key={category.id}
                            category={category}
                            selected={selectedCategory?.id === category.id}
                            onSelect={handleCategorySelect}
                            onEdit={(category) => {
                                setCategoryToEdit(category);
                                setIsEditingCategory(true);
                            }}
                            onDelete={(id) => setCategoryToDelete(id)}
                        />
                    ))}
                    </div>
                )}
            </div>

            {/* Services Section */}
            {servicesLoading && selectedCategory && (
                <div className="space-y-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 w-1/3 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {selectedCategory && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Dịch vụ trong danh mục: {selectedCategory.name}
                        </h3>
                        <button
                            onClick={() => setIsAddingService(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Thêm dịch vụ mới
                        </button>
                    </div>

                    {/* Services Table */}
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        {services.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500">Chưa có dịch vụ nào trong danh mục này</p>
                                <button
                                    onClick={() => setIsAddingService(true)}
                                    className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Thêm dịch vụ ngay
                                </button>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên dịch vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian (phút)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá (VND)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {services.map((service) => (
                                    <tr key={service.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {service.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 line-clamp-2">
                                                {service.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {service.duration}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {service.min_price.toLocaleString()} - {service.max_price.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setServiceToEdit(service);
                                                    setIsEditingService(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => setServiceToDelete(service.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
            )}

            {/* Forms and Dialogs */}
            <ServiceCategoryForm
                isOpen={isAddingCategory}
                onClose={() => setIsAddingCategory(false)}
                onSubmit={handleAddCategory}
            />

            <ServiceCategoryForm
                isOpen={isEditingCategory}
                onClose={() => {
                    setIsEditingCategory(false);
                    setCategoryToEdit(null);
                }}
                onSubmit={handleEditCategory}
                initialData={categoryToEdit || undefined}
                title="Chỉnh sửa danh mục"
            />

            <ServiceForm
                isOpen={isAddingService}
                onClose={() => setIsAddingService(false)}
                onSubmit={handleAddService}
                categoryId={selectedCategory?.id || ''}
            />

            <ServiceForm
                isOpen={isEditingService}
                onClose={() => {
                    setIsEditingService(false);
                    setServiceToEdit(null);
                }}
                onSubmit={handleEditService}
                initialData={serviceToEdit || undefined}
                categoryId={selectedCategory?.id || ''}
                title="Chỉnh sửa dịch vụ"
            />

            <ConfirmationDialog
                isOpen={!!categoryToDelete}
                title="Xóa danh mục"
                message="Bạn có chắc chắn muốn xóa danh mục này? Tất cả dịch vụ trong danh mục sẽ bị xóa."
                onConfirm={handleDeleteCategory}
                onCancel={() => setCategoryToDelete(null)}
            />

            <ConfirmationDialog
                isOpen={!!serviceToDelete}
                title="Xóa dịch vụ"
                message="Bạn có chắc chắn muốn xóa dịch vụ này?"
                onConfirm={handleDeleteService}
                onCancel={() => setServiceToDelete(null)}
            />
        </div>
    );
};

export default ServiceManagePage;
