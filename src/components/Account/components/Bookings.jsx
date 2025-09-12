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
      <div className="my-8 bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Bookings</h2>
              <p className="text-yellow-100 text-sm">
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
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-8 mt-6 mb-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">
                Unable to load bookings
              </p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-8">
        {/* Secondary loading indicator for retry */}
        {loading && !initialLoad && (
          <div className="text-center py-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400 border-t-transparent mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Refreshing bookings...</p>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-yellow-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                        <Home className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                          {booking.property_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
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

                  {/* Booking Details */}
                  <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 lg:text-right">
                    {/* Amount */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <div className="flex items-center gap-1 lg:justify-end">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{booking.amount?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Payment ID:</span>
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {booking.payment_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Booking ID:</span>
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {booking.booking_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring amazing properties and make your first booking!
            </p>
            <NavLink to="/nearby">
              <button className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
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
