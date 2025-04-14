import { ServiceCategory } from '../types';

interface ServiceCategorySelectionProps {
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;
  onSelect: (category: ServiceCategory) => void;
}

const ServiceCategorySelection: React.FC<ServiceCategorySelectionProps> = ({
  categories,
  loading,
  error,
  onSelect,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Chọn loại dịch vụ bạn muốn đặt lịch
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.cateId}
            onClick={() => onSelect(category)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer 
                     hover:shadow-lg transition duration-200 transform hover:-translate-y-1
                     border-2 border-transparent hover:border-blue-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {category.name}
            </h3>
            
            {category.description && (
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
            )}
            
            <div className="mt-4 flex justify-end">
              <span className="text-blue-500 text-sm">
                Chọn dịch vụ này →
              </span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          Không có dịch vụ nào. Vui lòng thử lại sau.
        </div>
      )}
    </div>
  );
};

export default ServiceCategorySelection;
