import { useState } from "react";

const Form3 = ({ onSubmit, onPrev, defaultValues }) => {
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
    <form onSubmit={handleNext} className="space-y-4 sm:space-y-6">
      <div>
        <label className="label font-semibold text-sm sm:text-base">
          Keyword
        </label>
        <input
          type="text"
          name="keyword"
          className="input input-bordered w-full text-sm sm:text-base"
          value={details.keyword}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            className="input input-bordered w-full text-sm sm:text-base"
            value={details.bedrooms}
            min={0}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            className="input input-bordered w-full text-sm sm:text-base"
            value={details.bathrooms}
            min={0}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Property Type
          </label>
          <select
            name="propertyType"
            className="select select-bordered w-full text-sm sm:text-base"
            value={details.propertyType}
            onChange={handleChange}
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="Studio">Duplex</option>
          </select>
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Size (e.g. 2000 sq.ft)
          </label>
          <input
            type="text"
            name="size"
            className="input input-bordered w-full text-sm sm:text-base"
            value={details.size}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-4">
          <input
            type="checkbox"
            name="furnished"
            className="checkbox checkbox-warning"
            checked={details.furnished}
            onChange={handleChange}
          />
          <span className="text-sm sm:text-base">Furnished</span>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-4">
          <input
            type="checkbox"
            name="petFriendly"
            className="checkbox checkbox-warning"
            checked={details.petFriendly}
            onChange={handleChange}
          />
          <span className="text-sm sm:text-base">Pet Friendly</span>
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Floor
          </label>
          <input
            type="number"
            name="floor"
            className="input input-bordered w-full text-sm sm:text-base"
            value={details.floor}
            min={0}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label font-semibold text-sm sm:text-base">
            Total Floors
          </label>
          <input
            type="number"
            name="totalFloors"
            className="input input-bordered w-full text-sm sm:text-base"
            value={details.totalFloors}
            min={0}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="label font-semibold text-center text-sm sm:text-base mb-3">
          Amenities
        </label>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                value={amenity}
                checked={details.amenities.includes(amenity)}
                onChange={handleAmenityChange}
                className="checkbox checkbox-warning checkbox-sm"
              />
              <span className="text-sm sm:text-base">{amenity}</span>
            </label>
          ))}
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

export default Form3;
