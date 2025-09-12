import React from 'react'

const ProgressTracker = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center space-x-6">
        {steps.map((step, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                index === currentStep
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm mt-2 ${
                index === currentStep ? "text-yellow-400 font-semibold" : ""
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
