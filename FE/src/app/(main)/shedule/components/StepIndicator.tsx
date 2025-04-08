interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'Chọn dịch vụ',
    'Chọn thú cưng & dịch vụ chi tiết',
    'Chọn ngày giờ',
    'Xác nhận',
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-1/2 left-1/2 w-full h-1 -translate-y-1/2
                  ${index < currentStep - 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            )}
            
            {/* Step circle */}
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${index < currentStep 
                    ? 'bg-blue-500 text-white' 
                    : index === currentStep 
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-500' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {index + 1}
              </div>
              
              {/* Step label */}
              <span 
                className={`mt-2 text-sm text-center hidden md:block
                  ${index < currentStep 
                    ? 'text-blue-500 font-medium' 
                    : index === currentStep 
                      ? 'text-blue-500' 
                      : 'text-gray-500'
                  }`}
              >
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
