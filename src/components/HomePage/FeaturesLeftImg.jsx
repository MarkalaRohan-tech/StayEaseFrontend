import React from 'react'

const FeaturesLeftImg = ({src,heading,description}) => {
  return (
    <div className="flex flex-row w-[90%] h-fit justify-evenly items-center">
      <div className="w-[400px] h-[350px] flex justify-center items-center relative">
        <img
          className="absolute w-[300px] h-[300px]"
          src="/Images/Logo/Yellow_Blob.png"
          alt="blob"
        />
        <img className="absolute w-[170px] h-[170px]" src={src} alt="LogoImg" />
      </div>
      <div className="w-1/2">
        <h1
          className="pacifico-regular text-center text-4xl m-3 font-bold text-yellow-400 text-shadow-lg"
        >
          {heading}
        </h1>
        <p className="roboto font-semibold text-justify text-black">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FeaturesLeftImg