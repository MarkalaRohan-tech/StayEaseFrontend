import React, { useState } from "react";
import { uploadToS3 } from "../../Services/uploadService"; // Adjust the import path as needed

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 max-w-md mx-auto"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
        disabled={imagesURL.length >= 4}
      />

      <p className="text-sm text-gray-500">
        (Note: You can upload a maximum of 4 images and once uploaded images
        cannot be changed)
      </p>

      <div className="grid grid-cols-2 gap-4">
        {imagesURL.map((img, index) => (
          <div key={index} className="relative border p-2 rounded-lg shadow">
            <img
              src={img.preview}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />

            <div className="flex justify-between mt-2">
              <label className="btn btn-xs btn-outline btn-info">
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
                className="btn btn-xs btn-outline btn-error"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-5 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning"
        >
          Previous
        </button>

        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-warning"
        >
          Next
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-t-yellow-400 border-gray-200 rounded-full animate-spin"></div>
            <p className="text-white text-lg font-semibold">Uploading images...</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default Form2;
