import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form4 from "./Form4";
import Form5 from "./Form5";
import PreviewCard from "./PreviewCard";
import ProgressTracker from "./ProgressTracker";
import { useFormData } from "../../Context/FormContext";
import { useNavigate } from "react-router-dom";

const steps = [
  "Location",
  "Images",
  "Details",
  "Place Details",
  "Contact",
  "Review",
];

const ListPlace = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const { formData, updatedFormData } = useFormData({});

  const handleNext = (stepData) => {
    updatedFormData(stepData);
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    console.log("Form Data changed:", formData);
  }, [formData]);

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("user"));

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuth(!!user);
    };

    const interval = setInterval(checkAuth, 60000);
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form1
            onSubmit={handleNext}
            onPrev={handlePrev}
            defaultValues={formData}
          />
        );
      case 1:
        return (
          <Form2
            onSubmit={handleNext}
            onPrev={handlePrev}
            defaultValues={formData}
          />
        );
      case 2:
        return (
          <Form3
            onSubmit={handleNext}
            onPrev={handlePrev}
            defaultValues={formData}
          />
        );
      case 3:
        return (
          <Form4
            onSubmit={handleNext}
            onPrev={handlePrev}
            defaultValues={formData}
          />
        );
      case 4:
        return (
          <Form5
            onSubmit={handleNext}
            onPrev={handlePrev}
            defaultValues={formData}
          />
        );
      case 5:
        return <PreviewCard data={formData} onPrev={handlePrev} />;
      default:
        return (
          <motion.div
            className="w-full h-full flex justify-center items-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Completed!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Your listing has been created successfully.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    }),
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.4 },
    },
  };

  const formContainerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50 pt-4 sm:pt-6 lg:pt-8 px-3 sm:px-4 lg:px-6 pb-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Progress Tracker */}
      <motion.div
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ProgressTracker steps={steps} currentStep={currentStep} />
      </motion.div>

      {/* Main Form Container */}
      <motion.div
        className="w-full max-w-4xl mx-auto bg-white shadow-xl p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-yellow-200"
        variants={formContainerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Step Title */}
        <motion.h2
          className="text-center font-bold text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent"
          variants={titleVariants}
          key={currentStep}
          initial="initial"
          animate="animate"
        >
          Step {currentStep + 1}: {steps[currentStep]}
        </motion.h2>

        {/* Step Content */}
        <div className="min-h-[400px] sm:min-h-[450px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator Dots */}
        <motion.div
          className="flex justify-center space-x-2 mt-6 sm:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 w-8"
                  : index < currentStep
                  ? "bg-green-400 w-2"
                  : "bg-gray-300 w-2"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1 * index,
                type: "spring",
                stiffness: 500,
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Action Hint - Hidden on mobile */}
      {currentStep < steps.length - 1 && (
        <motion.div
          className="hidden sm:flex fixed bottom-8 right-8 bg-yellow-400 text-white p-3 rounded-full shadow-lg cursor-pointer z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ListPlace;
