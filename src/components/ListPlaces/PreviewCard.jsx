import React from "react";
import { useFormData } from "../../Context/FormContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../utils";
import axios from "axios";

const PreviewCard = ({ onPrev }) => {
  const { formData, updatedFormData } = useFormData();
  const user = JSON.parse(localStorage.getItem("user"));
  const hostedBy = user ? user._id : null;
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const propertyData = {
      ...formData,
      hostedBy: hostedBy,
      keyword: formData.keyword
        ? formData.keyword
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k !== "")
        : [],
    };

    console.log("Property Data to be sent:", propertyData);

    try {
      const response = await fetch("/api/property/createNew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        const rentType = formData.rentType;
        handleSuccess("Property posted successfully!");
        await axios.put(`/api/user/updateHosting`, {
          userId: user._id,
          placeId: data.data._id,
        });
        setTimeout(() => {
          if (rentType === "local") {
            navigate("/nearby");
          } else {
            navigate("/tour");
          }
        }, 2000);
        updatedFormData({});
      } else {
        handleError(
          "Error creating property: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        handleError("Network error: Unable to connect to server");
      } else if (error.message.includes("JSON")) {
        handleError("Server response error: Invalid data format");
      } else {
        handleError("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 items-center px-2 sm:px-4">
      <div className="card bg-base-100 rounded-xl sm:rounded-2xl transition-all ease-in shadow-md hover:shadow-xl w-full max-w-2xl overflow-hidden">
        <figure className="h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={formData.imageUrls?.[0] || "/placeholder.jpg"}
            alt={formData.title || "Property Title"}
            className="object-cover w-full h-full"
          />
        </figure>
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            {formData.title || "Property Title"}
          </h2>
          <p className="text-sm sm:text-base">
            <b>Area:</b> {formData.location.area || "Not specified"}
          </p>
          <p className="text-sm sm:text-base">
            <b>Price:</b> ₹{formData.price?.toLocaleString("en-IN")}
          </p>
          <div>
            <b className="text-sm sm:text-base">Amenities:</b>
            <ul className="flex flex-wrap gap-2 mt-2">
              {formData.amenities?.length > 0 ? (
                formData.amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="rounded-full sm:rounded-2xl border border-yellow-400 bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    {amenity}
                  </li>
                ))
              ) : (
                <span className="text-gray-400 ml-1 text-sm">None</span>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-3 sm:gap-0 justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning w-full sm:w-auto order-2 sm:order-1"
        >
          Previous
        </button>
        <button
          onClick={handleConfirm}
          className="btn btn-warning text-white font-bold w-full sm:w-auto order-1 sm:order-2"
        >
          Confirm & Submit
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PreviewCard;
