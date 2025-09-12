import React, { useState} from "react";

const Form1 = ({ onSubmit,onPrev, defaultValues }) => {

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


  // Handlers
  const handleRentTypeChange = (e) => {
    setRentType(e.target.value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Save step data to session & move to next
  const handleNext = (e) => {
    e.preventDefault();
    const propertyData = {
      location: { ...address },
      rentType,
    };
    onSubmit(propertyData);
  };


  return (
    <form onSubmit={handleNext}>
      <div className="flex flex-col justify-start gap-5 items-center my-5 mx-3 p-5">
        <label className="label font-semibold">Rent Type</label>
        <div className="flex flex-row w-full justify-center gap-5">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="rentTypeLocal"
              name="rentType"
              value="local"
              className="radio radio-warning"
              checked={rentType === "local"}
              onChange={handleRentTypeChange}
            />
            <label htmlFor="rentTypeLocal">Local Rent</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="rentTypeTour"
              name="rentType"
              value="tour"
              className="radio radio-warning"
              checked={rentType === "tour"}
              onChange={handleRentTypeChange}
            />
            <label htmlFor="rentTypeTour">Tour Rent</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <div>
          <label className="label font-semibold">Full Address</label>
          <textarea
            name="fullAddress"
            className="textarea textarea-bordered w-full"
            rows="3"
            value={address.fullAddress}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">Locality</label>
          <input
            type="text"
            name="locality"
            className="input input-bordered w-full"
            value={address.locality}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">Area</label>
          <input
            type="text"
            name="area"
            className="input input-bordered w-full"
            value={address.area}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">City</label>
          <input
            type="text"
            name="city"
            className="input input-bordered w-full"
            value={address.city}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">State</label>
          <input
            type="text"
            name="state"
            className="input input-bordered w-full"
            value={address.state}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">Pincode</label>
          <input
            type="text"
            name="pincode"
            className="input input-bordered w-full"
            value={address.pincode}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div>
          <label className="label font-semibold">Country</label>
          <input
            type="text"
            name="country"
            className="input input-bordered w-full"
            value={address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
      <div className="flex mt-5 justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="btn btn-outline btn-warning"
          disabled={false} // disable only on step 0
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

export default Form1;
