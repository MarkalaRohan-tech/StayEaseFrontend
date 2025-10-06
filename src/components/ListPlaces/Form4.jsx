import { useState } from "react";
import axios from "axios";
import { useFormData } from "../../Context/FormContext";

const Form4 = ({ onSubmit, onPrev, defaultValues }) => {
  const { formData } = useFormData({});
  const [mainForm, setMainForm] = useState({
    title: defaultValues?.title || "",
    price: defaultValues?.price || "",
    description: defaultValues?.description || "",
  });
  const [loadingAI, setLoadingAI] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setMainForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    onSubmit({ ...mainForm });
  };

  const fetchAIDescription = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post("/api/ai", {
        prompt:
          "Describe the property in casual language in 200 words or less using these details:" +
          JSON.stringify(formData) +
          " as if you are explaining it to user(No other other than description)",
      });

      setMainForm((prev) => ({
        ...prev,
        description:
          res.data?.choices?.[0]?.message?.content ||
          "AI could not generate description",
      }));} catch (error) {
console.error("Error fetching AI description:", error);
setMainForm((prev) => ({
...prev,
description: "Error fetching AI description",
}));
}
setLoadingAI(false);
};
return (
<form className="flex flex-col space-y-4 sm:space-y-5" onSubmit={handleNext}>
<div>
<label className="font-semibold text-gray-700 text-sm sm:text-base">
Property Title
</label>
<input
       type="text"
       name="title"
       className="input input-bordered w-full text-sm sm:text-base mt-1"
       value={mainForm.title}
       onChange={handleChange}
       placeholder="Enter property title"
     />
    </div>
<div>
    <label className="font-semibold text-gray-700 text-sm sm:text-base">
      Price
    </label>
    <input
      type="number"
      name="price"
      className="input input-bordered w-full text-sm sm:text-base mt-1"
      value={mainForm.price}
      onChange={handleChange}
      placeholder="Enter price"
    />
  </div>

  <div>
    <label className="font-semibold text-gray-700 text-sm sm:text-base">
      Description
    </label>
    <textarea
      name="description"
      className="textarea textarea-bordered w-full text-sm sm:text-base mt-1"
      rows="4"
      value={mainForm.description}
      onChange={handleChange}
      placeholder="Enter property description"
    />
    <div className="w-full flex justify-end mt-3">
      <button
        type="button"
        onClick={fetchAIDescription}
        disabled={loadingAI}
        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-lg sm:rounded-xl 
                   bg-gradient-to-r from-yellow-400 to-orange-500 
                   shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer
                   text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fa-solid fa-wand-magic-sparkles"></i>
        <span className="hidden xs:inline">
          {loadingAI ? "Generating..." : "Describe using AI"}
        </span>
        <span className="xs:hidden">
          {loadingAI ? "..." : "AI"}
        </span>
      </button>
    </div>
  </div>

  <div className="flex flex-col sm:flex-row mt-6 gap-3 sm:gap-0 justify-between">
    <button
      type="button"
      onClick={onPrev}
      className="btn btn-outline btn-warning w-full sm:w-auto order-2 sm:order-1"
    >
      Previous
    </button>
    <button type="submit" className="btn btn-warning w-full sm:w-auto order-1 sm:order-2">
      Next
    </button>
  </div>
    </form>
  );
};

export default Form4;