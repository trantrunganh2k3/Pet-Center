import React from 'react';
import { ServiceCategory } from '@/types/interfaces';

interface ServiceCategoryCardProps {
    category: ServiceCategory;
    selected: boolean;
    onSelect: (category: ServiceCategory) => void;
    onEdit: (category: ServiceCategory) => void;
    onDelete: (id: string) => void;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
    category,
    selected,
    onSelect,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            className={`
                p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200
                ${selected 
                    ? 'bg-blue-50 border-2 border-blue-500' 
                    : 'bg-white hover:shadow-lg border border-gray-200'
                }
            `}
            onClick={() => onSelect(category)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {category.name}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(category);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Sửa danh mục"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(category.cateId);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Xóa danh mục"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
                {category.description}
            </p>
            <div className="mt-3">
                <div className="text-sm text-gray-500">
                    Nhấn để xem chi tiết các dịch vụ
                </div>
            </div>
        </div>
    );
};

export default ServiceCategoryCard;
