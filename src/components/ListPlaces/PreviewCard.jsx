import React, { useEffect, useState } from "react";
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

      // parse JSON directly
      const data = await response.json();

      console.log("Parsed response data:", data);

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
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <div className="card bg-base-100 rounded-2xl transition-all ease-in shadow-md hover:shadow-xl w-[60%] overflow-hidden">
        <figure className="h-52 overflow-hidden">
          <img
            src={formData.imageUrls?.[0] || "/placeholder.jpg"}
            alt={formData.title || "Property Title"}
            className="object-cover w-full h-full"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold text-gray-800">
            {formData.title || "Property Title"}
          </h2>
          <p>
            <b>Area:</b> {formData.location.area || "Not specified"}
          </p>
          <p>
            <b>Price:</b> ₹{formData.price?.toLocaleString("en-IN")}
          </p>
          <div>
            <b>Amenities:</b>
            <ul className="flex flex-wrap gap-2 mt-2">
              {formData.amenities?.length > 0 ? (
                formData.amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="rounded-2xl border border-yellow-400 bg-yellow-100 text-yellow-800 px-3 py-1 text-sm"
                  >
                    {amenity}
                  </li>
                ))
              ) : (
                <span className="text-gray-400 ml-1">None</span>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-full mt-5 justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning"
          disabled={false}
        >
          Previous
        </button>
        <button
          onClick={handleConfirm}
          className="btn btn-warning text-white font-bold"
        >
          Confirm & Submit
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PreviewCard;
