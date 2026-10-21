import { React, useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { Areas, propertyTypes } from "./data";
import axios from "axios";
import { useAuth } from "../../Context/UserContext";
import HouseCard from "./HouseCard";

const Nearby = () => {
  const { user } = useAuth();
  const [propertyData, setPropertyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [filters, setFilters] = useState({
    area: "",
    propertyType: "",
    minPrice: 5000,
    maxPrice: 100000,
    amenities: [],
  });

  const fetchAllProperties = async () => {
    try {
      const response = await axios.get("/api/property/getAllLocal");
      const PropertyData = response.data.data;
      setPropertyData(PropertyData);
      setNoResults(false);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setPropertyData([]);
      setNoResults(true);
    }
  };

  const fetchSuggestions = async (value) => {
    const clean = String(value || "").trim();

    if (clean.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("/api/property/searchLocal", {
        params: { term: clean },
      });
      const matches = response.data?.data || [];
      setSuggestions(matches.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      fetchAllProperties();
      return;
    }

    try {
      const response = await axios.get(
        `/api/property/searchLocal?term=${searchTerm}`,
      );
      const searchData = response.data.data;

      if (searchData.length > 0) {
        setPropertyData(searchData);
        setNoResults(false);
      } else {
        setPropertyData([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error("Error searching properties:", error);
      setPropertyData([]);
      setNoResults(true);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const handleFilters = async (e) => {
    e.preventDefault();
    console.log("Applied Filters:", filters);
    try {
      const response = await axios.get("/api/property/getAllLocal", {
        params: {
          area: filters.area || undefined,
          propertyType: filters.propertyType || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          amenities:
            filters.amenities.length > 0
              ? filters.amenities.join(",")
              : undefined,
        },
      });

      const filteredData = response.data.data;
      setPropertyData(filteredData);
      setNoResults(filteredData.length === 0);
    } catch (error) {
      console.error("Error applying filters:", error);
      setPropertyData([]);
      setNoResults(true);
    }
  };

  const [likedProperties, setLikedProperties] = useState([]);
  useEffect(() => {
    if (!user) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get(`/api/user/${user._id}/likes`);
        setLikedProperties(res.data);
      } catch (err) {
        console.error("Error fetching likes:", err);
      }
    };

    fetchLikes();
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full pt-4 sm:pt-6 lg:pt-8 px-3 sm:px-4 lg:px-6">
        {/* Header Section */}
        <div className="bg-white flex flex-col md:flex-row items-center justify-between rounded-xl shadow-lg border-b-4 border-yellow-400 p-4 sm:p-5 lg:p-6 mb-6">
          {/* Title - Always visible */}
          <h1 className="text-yellow-400 font-bold roboto text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 text-center lg:text-left">
            Nearby Rental Listings
          </h1>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-end">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 flex-1 sm:flex-initial"
            >
              <label className="input input-bordered rounded-full flex-1 sm:w-64 flex items-center gap-2">
                <input
                  type="search"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setSearchTerm(nextValue);
                    fetchSuggestions(nextValue);
                  }}
                  className="grow"
                  placeholder="Search by title"
                />
              </label>
              <button type="submit" className="btn btn-warning text-white">
                Search
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className="absolute z-20 mt-12 max-w-sm rounded-xl border border-yellow-200 bg-white shadow-lg p-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion._id}
                    type="button"
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-yellow-50 rounded"
                    onClick={() => {
                      setSearchTerm(suggestion.title);
                      setSuggestions([]);
                      setPropertyData([suggestion]);
                      setNoResults(false);
                    }}
                  >
                    {suggestion.title}
                  </button>
                ))}
              </div>
            )}
            <button
              className="btn btn-warning text-white tooltip"
              data-tip="Filter"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <i className="fa-solid fa-filter"></i>
              <span className="hidden sm:inline ml-2">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box max-w-lg">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              <h3 className="font-bold text-center text-2xl text-yellow-400 mb-4">
                Filters
              </h3>

              {/* Place Filter */}
              <div className="py-3 flex flex-col sm:flex-row justify-start gap-2 items-start sm:items-center font-bold">
                <span className="min-w-fit">Place:</span>
                <select
                  value={filters.area}
                  onChange={(e) =>
                    setFilters({ ...filters, area: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select a Place</option>
                  {Areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="py-3">
                <div className="flex items-center gap-2 sm:gap-4 font-semibold mb-2">
                  <span className="font-bold min-w-fit">Price:</span>
                  <span className="text-sm">₹5,000</span>
                  <input
                    type="range"
                    min={5000}
                    max={100000}
                    step={5000}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: Number(e.target.value),
                      })
                    }
                    className="range range-warning flex-1"
                  />
                </div>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 font-bold rounded-full shadow text-sm sm:text-base">
                    Selected: ₹{filters.maxPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="py-3 flex flex-col gap-3">
                <span className="font-bold">Important Facilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                  {[
                    "24x7 Water Supply",
                    "Power Backup",
                    "Lift",
                    "Covered Parking",
                    "Gated Community",
                    "Security Guard",
                    "Swimming Pool",
                    "Wi-Fi / Internet",
                    "Gym",
                    "Balcony",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-warning checkbox-sm"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              amenities: [...filters.amenities, amenity],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              amenities: filters.amenities.filter(
                                (a) => a !== amenity,
                              ),
                            });
                          }
                        }}
                      />
                      <span className="font-medium text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="py-3 flex flex-col sm:flex-row justify-start gap-2 items-start sm:items-center font-bold">
                <span className="min-w-fit">Property Type:</span>
                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters({ ...filters, propertyType: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select a Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={handleFilters}
                  className="btn btn-warning text-white w-full sm:w-auto"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* No Results Animation */}
        {noResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center p-8 min-h-[50vh]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="p-6 rounded-full bg-yellow-100 shadow-lg"
            >
              <SearchX className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-500" />
            </motion.div>
            <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-800">
              No Results Found
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-sm px-4">
              We couldn't find anything based on your search. Try different
              keywords or explore our recommendations!
            </p>
          </motion.div>
        )}

        {/* Property Listings Grid */}
        {!noResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-8">
            {propertyData.map((property) => (
              <HouseCard
                key={property._id}
                id={property._id}
                title={property.title}
                image={property.imageUrls[0]}
                area={property.location.area}
                price={property.price}
                facilities={property.amenities}
                rating={property.rating}
                isFav={likedProperties.includes(String(property._id))}
                likedProperties={likedProperties}
                setLikedProperties={setLikedProperties}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nearby;
