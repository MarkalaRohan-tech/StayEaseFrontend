import React, { useState, useContext, createContext } from 'react';

const FormContext = createContext();

export const useFormData = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({})
    
    const updatedFormData = (stepData) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
    };

    return (
        <FormContext.Provider value={{ formData, updatedFormData }}>
            {children}
        </FormContext.Provider>
    );
};