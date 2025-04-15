import React, { useEffect } from 'react';
import { ServiceCategory } from '@/types/interfaces';

interface ServiceCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { id?: string; name: string; description: string }) => void;
    initialData?: ServiceCategory;
    title?: string;
}

const ServiceCategoryForm: React.FC<ServiceCategoryFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title = 'Thêm danh mục dịch vụ',
}) => {
    const [formData, setFormData] = React.useState<{
        id?: string;
        name: string;
        description: string;
    }>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            const newFormData = {
                id: initialData.cateId,
                name: initialData.name,
                description: initialData.description,
            };
            setFormData(newFormData);
        } else {
            setFormData({
                name: '',
                description: '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = {
            ...(initialData?.cateId ? { id: initialData.cateId } : {}),
            name: formData.name,
            description: formData.description,
        };
        onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {title}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên danh mục
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Nhập mô tả danh mục"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {initialData ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceCategoryForm;
