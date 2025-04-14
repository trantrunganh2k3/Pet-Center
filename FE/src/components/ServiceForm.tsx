import React, { useEffect } from 'react';
import { Service } from '@/types/interfaces';

interface ServiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ServiceFormData) => void;
    initialData?: Service;
    title?: string;
    categoryId: string;
}

interface ServiceFormData {
    name: string;
    description: string;
    min_price: number;
    max_price: number;
    duration: number;
    categoryId?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title = 'Thêm dịch vụ mới',
    categoryId,
}) => {
    const [formData, setFormData] = React.useState<ServiceFormData>({
        name: '',
        description: '',
        min_price: 0,
        max_price: 0,
        duration: 30,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                min_price: initialData.min_price,
                max_price: initialData.max_price,
                duration: initialData.duration,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                min_price: 0,
                max_price: 0,
                duration: 30,
            });
        }
    }, [initialData, categoryId, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value) || 0,
        });
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
                                Tên dịch vụ
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Nhập tên dịch vụ"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Nhập mô tả dịch vụ"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="min_price" className="block text-sm font-medium text-gray-700">
                                    Giá thấp nhất
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="min_price"
                                        id="min_price"
                                        value={formData.min_price}
                                        onChange={handleNumberChange}
                                        min="0"
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">VND</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="max_price" className="block text-sm font-medium text-gray-700">
                                    Giá cao nhất
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="max_price"
                                        id="max_price"
                                        value={formData.max_price}
                                        onChange={handleNumberChange}
                                        min={formData.min_price}
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">VND</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Thời gian thực hiện (phút)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                id="duration"
                                value={formData.duration}
                                onChange={handleNumberChange}
                                min="1"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

export default ServiceForm;
