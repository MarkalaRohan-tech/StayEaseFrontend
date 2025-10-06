import React, { useState } from "react";
import { uploadToS3 } from "../../Services/uploadService";

const Form2 = ({ onSubmit, onPrev, defaultValues }) => {
  const [loading, setLoading] = useState(false);
  const [imagesURL, setImagesURL] = useState(
    (defaultValues.imageUrls || []).map((url) => ({ file: null, preview: url }))
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (imagesURL.length >= 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    const newImage = {
      file,
      preview: URL.createObjectURL(file),
    };

    setImagesURL((prev) => [...prev, newImage]);
  };

  const handleDelete = (index) => {
    const updated = imagesURL.filter((_, i) => i !== index);
    setImagesURL(updated);
  };

  const handleReplace = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...imagesURL];
    updated[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImagesURL(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const urls = await Promise.all(
        imagesURL.map((img) => (img.file ? uploadToS3(img.file) : img.preview))
      );
      setImagesURL(urls.map((url) => ({ file: null, preview: url })));

      onSubmit({ imageUrls: urls });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full text-sm sm:text-base"
        disabled={imagesURL.length >= 4}
      />

      <p className="text-xs sm:text-sm text-gray-500 px-2">
        (Note: You can upload a maximum of 4 images and once uploaded images
        cannot be changed)
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {imagesURL.map((img, index) => (
          <div
            key={index}
            className="relative border-2 border-gray-200 p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={img.preview}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-32 sm:h-40 object-cover rounded"
            />

            <div className="flex justify-between mt-2 gap-2">
              <label className="btn btn-xs sm:btn-sm btn-outline btn-info flex-1">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleReplace(e, index)}
                />
              </label>

              <button
                type="button"
                className="btn btn-xs sm:btn-sm btn-outline btn-error flex-1"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row mt-6 gap-3 sm:gap-0 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning w-full sm:w-auto order-2 sm:order-1"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-warning w-full sm:w-auto order-1 sm:order-2"
        >
          Next
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-yellow-400 border-gray-200 rounded-full animate-spin"></div>
            <p className="text-gray-800 text-base sm:text-lg font-semibold">
              Uploading images...
            </p>
          </div>
        </div>
      )}
    </form>
  );
};

export default Form2;
