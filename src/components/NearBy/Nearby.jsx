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
  const [noResults, setNoResults] = useState(false);
  const [filters,setFilters] = useState({
    area: "",
    propertyType: "",
    minPrice: 5000,
    maxPrice: 100000,
    amenities: []
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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      fetchAllProperties();
      return;
    }

    try {
      const response = await axios.get(
        `/api/property/searchLocal?term=${searchTerm}`
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
    <div className="relative w-full h-full">
      <div className="absolute flex flex-col justify-center items-center top-20 p-5 w-full">
        <div className="p-3 rounded-xl w-[95vw] flex justify-between border-b-2 border-yellow-400 shadow-lg">
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <h3 className="font-bold text-center text-2xl text-yellow-400">
                  Filters
                </h3>
                <div className="py-4 flex justify-start gap-2 items-center font-bold">
                  <span>Place: </span>
                  <select
                    value={filters.area}
                    onChange={(e) =>
                      setFilters({ ...filters, area: e.target.value })
                    }
                    className="select"
                  >
                    <option value="">Select a Place</option>
                    {Areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 font-semibold">
                  <span className="font-bold">Price:</span>
                  <span>&#8377;5,000</span>
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
                    className="range flex-1 range-warning"
                  />
                  <div className="mt-3 text-center">
                    <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 font-bold rounded-full shadow">
                      Selected Price: ₹
                      {filters.maxPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="py-4 flex flex-col justify-start gap-2 items-start font-bold">
                  <span>Important Facilities: </span>
                  <div className="grid grid-cols-2 w-full gap-2">
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
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
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
                                  (a) => a !== amenity
                                ),
                              });
                            }
                          }}
                        />
                        <span className="font-medium">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="py-4 flex justify-start gap-2 items-center font-bold">
                  <span>Property Type: </span>

                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="select"
                  >
                    <option value="">Select a Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleFilters}
                    className="btn btn-warning text-white"
                  >
                    Apply filter
                  </button>
                </div>
              </form>
            </div>
          </dialog>
          <h1 className="text-yellow-400 text-left font-bold roboto text-4xl">
            Nearby Rental Listings
          </h1>
          <div className="flex justify-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <label className="input border-none rounded-full">
                <input
                  type="search"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none"
                  placeholder="Search by title"
                />
              </label>
              <button type="submit" className="btn btn-warning">
                Search
              </button>
            </form>
            <button
              className="btn btn-warning shadow-none tooltip"
              data-tip="Filter"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <i className="fa-solid fa-filter"></i>
            </button>
          </div>
        </div>
        <br />

        {/* No Results Animation */}
        {noResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="p-6 rounded-full bg-yellow-100 shadow-lg"
            >
              <SearchX className="w-14 h-14 text-yellow-500" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">
              No Results Found
            </h2>
            <p className="mt-2 text-gray-500 max-w-sm">
              We couldn’t find anything based on your search. Try different
              keywords or explore our recommendations!
            </p>
          </motion.div>
        )}

        {/* Property Listings */}
        {!noResults && (
          <div className="p-5 mx-5 grid grid-cols-3 gap-10 w-[95vw]">
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
