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
      }));
    } catch (error) {
      console.error("Error fetching AI description:", error);
      setMainForm((prev) => ({
        ...prev,
        description: "Error fetching AI description",
      }));
    }
    setLoadingAI(false);
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleNext}>
      {/* Title */}
      <div>
        <label className="font-semibold text-gray-700">Property Title</label>
        <input
          type="text"
          name="title"
          className="input input-bordered w-full"
          value={mainForm.title}
          onChange={handleChange}
          placeholder="Enter property title"
        />
      </div>

      {/* Price */}
      <div>
        <label className="font-semibold text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          className="input input-bordered w-full"
          value={mainForm.price}
          onChange={handleChange}
          placeholder="Enter price"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          className="textarea textarea-bordered w-full"
          rows="4"
          value={mainForm.description}
          onChange={handleChange}
          placeholder="Enter property description"
        />
        <div className="w-full h-fit p-3 flex justify-end">
          <button
            type="button" 
            onClick={fetchAIDescription}
            disabled={loadingAI}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                       bg-gradient-to-r from-yellow-400 to-orange-500 
                       bg-[length:200%_200%] animate-gradient-x
                       shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            {loadingAI ? "Generating..." : "Describe using AI"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex mt-5 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning"
        >
          Previous
        </button>
        <button type="submit" className="btn btn-warning">
          Next
        </button>
      </div>
    </form>
  );
};

export default Form4;
