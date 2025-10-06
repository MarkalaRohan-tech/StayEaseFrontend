import React from "react";

const FeaturesLeftImg = ({ src, heading, description }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center lg:justify-between items-center gap-6 lg:gap-12">
      {/* Image Container - First on mobile, first on desktop */}
      <div className="w-full lg:w-1/2 order-1 lg:order-1 flex justify-center lg:justify-start">
        <div className="relative w-64 h-64 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[350px] flex justify-center items-center">
          {/* Background Blob */}
          <img
            className="absolute w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[300px] lg:h-[300px] object-contain"
            src="/Images/Logo/Yellow_Blob.png"
            alt="blob"
          />
          {/* Feature Icon */}
          <img
            className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-[170px] lg:h-[170px] object-contain z-10"
            src={src}
            alt="Feature Icon"
          />
        </div>
      </div>

      {/* Text Content - Second on mobile, second on desktop */}
      <div className="w-full lg:w-1/2 order-2 lg:order-2">
        <h1 className="pacifico-regular text-center lg:text-right text-2xl xs:text-3xl sm:text-4xl lg:text-4xl xl:text-5xl mb-4 sm:mb-6 font-bold text-yellow-400 text-shadow-lg leading-tight">
          {heading}
        </h1>
        <p className="roboto font-semibold text-justify lg:text-right text-black text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeaturesLeftImg;
