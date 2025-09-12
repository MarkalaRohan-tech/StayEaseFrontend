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
    className={`p-4 rounded-lg shadow border-l-4 ${border} ${shadow} ${shadowColor}`}
  >
    <div className={`font-bold mb-3 ${iconColor}`}>{title}</div>
    <div className={`text-3xl font-bold ${iconColor}`}>
      {icon}&nbsp;{value}
    </div>
    <div className="text-sm mt-2 text-gray-500 mb-3">{subTitle}</div>
  </div>
);

export default StatsCard;
