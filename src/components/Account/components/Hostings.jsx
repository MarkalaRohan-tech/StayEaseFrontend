import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/UserContext";
import axios from "axios";
import {
  Home,
  Calendar,
  IndianRupee,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit,
  Plus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Hostings = () => {
  const { user } = useAuth();
  const [hostings, setHostings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchHostings = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching hostings for user ID:", user._id);
      const response = await axios.get(`/api/fetch/hosting/${user._id}`);
      setHostings(response.data);
      console.log("Hosting data:", response.data);
    } catch (err) {
      console.error("Error fetching hostings:", err);
      setError("Failed to load your properties. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchHostings();
  }, [user?._id]);

  // Show loading only on initial load to prevent flickering
  if (initialLoad && loading) {
    return (
      <div className="my-6 sm:my-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent mb-3 sm:mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base text-center">
            Loading your properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 sm:my-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Your Properties
              </h2>
              <p className="text-yellow-100 text-xs sm:text-sm">
                {hostings.length}{" "}
                {hostings.length === 1 ? "property" : "properties"} hosted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 mb-2 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0">
              <p className="text-red-800 font-medium text-sm sm:text-base">
                Unable to load properties
              </p>
              <p className="text-red-600 text-xs sm:text-sm break-words">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Secondary loading indicator for retry */}
        {loading && !initialLoad && (
          <div className="text-center py-3 sm:py-4 mb-3 sm:mb-4">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-yellow-400 border-t-transparent mx-auto mb-2"></div>
            <p className="text-gray-500 text-xs sm:text-sm">
              Refreshing properties...
            </p>
          </div>
        )}

        {hostings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {hostings.map((hosting) => (
              <div
                key={hosting._id}
                className="bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-yellow-200 group"
              >
                {/* Property Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={hosting.imageUrls?.[0]}
                    alt={hosting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMjUgMTAwIDI1LTI1aDI1djUweiIgZmlsbD0iIzlmYTJhNSIvPgo8L3N2Zz4K";
                    }}
                  />

                  {/* Image overlay with count */}
                  {hosting.imageUrls && hosting.imageUrls.length > 1 && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium">
                      +{hosting.imageUrls.length - 1} more
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-3 sm:p-4 lg:p-5">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {hosting.title}
                    </h3>

                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-1">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {hosting.price?.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          /night
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(hosting.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-2 sm:mb-4">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="bg-yellow-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Home className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No properties hosted yet
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Start earning by hosting your first property on our platform!
            </p>
            <NavLink to="/listProperty">
              <button className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">
                  Add Your First Property
                </span>
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hostings;
