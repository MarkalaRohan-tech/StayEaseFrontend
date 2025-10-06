import React, { useState } from "react";

const Form1 = ({ onSubmit, onPrev, defaultValues }) => {
  const [address, setAddress] = useState({
    fullAddress: defaultValues.fullAddress || "",
    locality: defaultValues.locality || "",
    area: defaultValues.area || "",
    city: defaultValues.city || "",
    state: defaultValues.state || "",
    pincode: defaultValues.pincode || "",
    country: defaultValues.country || "",
  });

  const [rentType, setRentType] = useState(defaultValues.rentType || "local");

  const handleRentTypeChange = (e) => {
    setRentType(e.target.value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const propertyData = {
      location: { ...address },
      rentType,
    };
    onSubmit(propertyData);
  };

  return (
    <form onSubmit={handleNext} className="space-y-4 sm:space-y-6">
      {/* Rent Type */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <label className="font-semibold text-base sm:text-lg">Rent Type</label>
        <div className="flex flex-col sm:flex-row w-full justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 justify-center">
            <input
              type="radio"
              id="rentTypeLocal"
              name="rentType"
              value="local"
              className="radio radio-warning"
              checked={rentType === "local"}
              onChange={handleRentTypeChange}
            />
            <label
              htmlFor="rentTypeLocal"
              className="text-sm sm:text-base cursor-pointer"
            >
              Local Rent
            </label>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <input
              type="radio"
              id="rentTypeTour"
              name="rentType"
              value="tour"
              className="radio radio-warning"
              checked={rentType === "tour"}
              onChange={handleRentTypeChange}
            />
            <label
              htmlFor="rentTypeTour"
              className="text-sm sm:text-base cursor-pointer"
            >
              Tour Rent
            </label>
          </div>
        </div>
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="sm:col-span-2">
          <label className="label font-semibold text-sm sm:text-base">
            Full Address
          </label>
          <textarea
            name="fullAddress"
            className="textarea textarea-bordered w-full text-sm sm:text-base"
            rows="3"
            value={address.fullAddress}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Locality
          </label>
          <input
            type="text"
            name="locality"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.locality}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Area
          </label>
          <input
            type="text"
            name="area"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.area}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            City
          </label>
          <input
            type="text"
            name="city"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.city}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            State
          </label>
          <input
            type="text"
            name="state"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.state}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.pincode}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Country
          </label>
          <input
            type="text"
            name="country"
            className="input input-bordered w-full text-sm sm:text-base"
            value={address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row mt-6 gap-3 sm:gap-0 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning w-full sm:w-auto order-2 sm:order-1"
          disabled={false}
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn btn-warning w-full sm:w-auto order-1 sm:order-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Form1;
