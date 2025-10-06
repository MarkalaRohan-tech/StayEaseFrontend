import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/UserContext";
import axios from "axios";
import {
  Calendar,
  CreditCard,
  Home,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { NavLink } from "react-router";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchBookings = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching bookings for user ID:", user._id);
      const response = await axios.get(`/api/fetch/booking/${user._id}`);
      setBookings(response.data);
      console.log("Booking data:", response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?._id]);

  // Show loading only on initial load to prevent flickering
  if (initialLoad && loading) {
    return (
      <div className="mx-4 my-6 sm:mx-6 sm:my-8 lg:mx-auto lg:max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent mb-3 sm:mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 my-6 sm:mx-6 sm:my-8 lg:mx-auto lg:max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Your Bookings
              </h2>
              <p className="text-yellow-100 text-xs sm:text-sm">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"} found
              </p>
            </div>
          </div>

          {/* Retry button */}
          {error && (
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden xs:inline">Retry</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 mb-2 sm:mx-6 sm:mt-6 lg:mx-8 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-red-800 font-medium text-sm sm:text-base">
                Unable to load bookings
              </p>
              <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
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
              Refreshing bookings...
            </p>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-yellow-200"
              >
                <div className="flex flex-col gap-4">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg mt-1">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight break-words">
                          {booking.property_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>
                              {new Date(booking.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details - Responsive Layout */}
                  <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 xs:justify-between">
                    {/* Amount */}
                    <div className="xs:text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Total Amount
                      </p>
                      <div className="flex items-center gap-1 xs:justify-start sm:justify-end">
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">
                          ₹{booking.amount?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="xs:text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Status
                      </p>
                      <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        Payment ID:
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded truncate min-w-0">
                        {booking.payment_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        Booking ID:
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded truncate min-w-0">
                        {booking.booking_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-yellow-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              Start exploring amazing properties and make your first booking!
            </p>
            <NavLink to="/nearby">
              <button className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base">
                Browse Properties
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
