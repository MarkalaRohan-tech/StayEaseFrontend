import React from "react";

const StatsCard = ({
  title,
  value,
  subTitle,
  icon,
  iconColor,
  border,
  shadow,
  shadowColor,
}) => (
  <div
    className={`p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow border-l-4 ${border} ${shadow} ${shadowColor} bg-white hover:shadow-lg transition-shadow duration-200`}
  >
    <div
      className={`font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 ${iconColor} truncate`}
    >
      {title}
    </div>
    <div
      className={`flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-bold ${iconColor} mb-2 sm:mb-3`}
    >
      <span className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
        {icon}
      </span>
      <span className="break-words min-w-0">{value}</span>
    </div>
    <div className="text-xs sm:text-sm lg:text-base text-gray-500 leading-relaxed">
      {subTitle}
    </div>
  </div>
);

export default StatsCard;
