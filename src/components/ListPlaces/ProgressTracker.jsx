import React from "react";

const ProgressTracker = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center w-full overflow-x-auto pb-2">
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 px-4">
        {steps.map((step, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                index === currentStep
                  ? "bg-yellow-400 text-white scale-110 shadow-lg"
                  : index < currentStep
                  ? "bg-green-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`text-xs sm:text-sm mt-1 sm:mt-2 text-center whitespace-nowrap ${
                index === currentStep
                  ? "text-yellow-400 font-semibold"
                  : index < currentStep
                  ? "text-green-600"
                  : "text-gray-500"
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
