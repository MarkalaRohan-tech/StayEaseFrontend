import { useState } from "react";

const Form3 = ({ onSubmit,onPrev, defaultValues }) => {

  const amenitiesList = [
    "Lift",
    "Parking",
    "Power Backup",
    "Gym",
    "Swimming Pool",
    "Security",
    "Wi-Fi",
    "CCTV",
    "Garden",
    "Intercom",
  ];

  const [details, setDetails] = useState({
    keyword: defaultValues.keyword || "",
    bedrooms: defaultValues.bedrooms || 1,
    bathrooms: defaultValues.bathrooms || 1,
    furnished: defaultValues.furnished || false,
    amenities: [...(defaultValues.amenities || [])],
    propertyType: defaultValues.propertyType || "Apartment",
    size: defaultValues.size || "",
    petFriendly: defaultValues.petFriendly || false,
    floor: defaultValues.floor || 1,
    totalFloors: defaultValues.totalFloors || 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };


  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setDetails((prev) => {
      const updatedAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value);
      return { ...prev, amenities: updatedAmenities };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    onSubmit({ ...details });
  };

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div>
        <label className="label font-semibold">Keyword</label>
        <input
          type="text"
          name="keyword"
          className="input input-bordered w-full"
          value={details.keyword}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {/* Bedrooms */}
        <div>
          <label className="label font-semibold">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            className="input input-bordered w-full"
            value={details.bedrooms}
            min={0}
            onChange={handleChange}
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label className="label font-semibold">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            className="input input-bordered w-full"
            value={details.bathrooms}
            min={0}
            onChange={handleChange}
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="label font-semibold">Property Type</label>
          <select
            name="propertyType"
            className="select select-bordered w-full"
            value={details.propertyType}
            onChange={handleChange}
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="Studio">Duplex</option>
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="label font-semibold">Size (e.g. 2000 sq.ft)</label>
          <input
            type="text"
            name="size"
            className="input input-bordered w-full"
            value={details.size}
            onChange={handleChange}
          />
        </div>

        {/* Furnished */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="furnished"
            className="checkbox"
            checked={details.furnished}
            onChange={handleChange}
          />
          <span>Furnished</span>
        </div>

        {/* Pet Friendly */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="petFriendly"
            className="checkbox"
            checked={details.petFriendly}
            onChange={handleChange}
          />
          <span>Pet Friendly</span>
        </div>

        {/* Floor */}
        <div>
          <label className="label font-semibold">Floor</label>
          <input
            type="number"
            name="floor"
            className="input input-bordered w-full"
            value={details.floor}
            min={0}
            onChange={handleChange}
          />
        </div>

        {/* Total Floors */}
        <div>
          <label className="label font-semibold">Total Floors</label>
          <input
            type="number"
            name="totalFloors"
            className="input input-bordered w-full"
            value={details.totalFloors}
            min={0}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="label font-semibold text-center mb-5">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={amenity}
                checked={details.amenities.includes(amenity)}
                onChange={handleAmenityChange}
                className="checkbox"
              />
              {amenity}
            </label>
          ))}
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

export default Form3;
