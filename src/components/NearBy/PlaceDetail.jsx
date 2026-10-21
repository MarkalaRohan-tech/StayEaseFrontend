import { useParams, NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../Context/UserContext";
import ReviewPage from "./ReviewPage";
import Map from "./Map";
import axios from "axios";
import { UserCircle, Mail, Phone } from "lucide-react";

const PlaceDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState([]);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(`/api/property/getRecommended/${id}`);
        setRecommendation(res.data.data || []);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    };
    fetchRecommendation();
  }, [id]);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const foundPlace = await axios.get(`/api/property/getDetails/${id}`);
        console.log("Fetched place data:", foundPlace.data);
        const placeData = foundPlace?.data?.data || foundPlace?.data;
        setPlace(placeData);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchPlace();
  }, [id]);

  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = Array.isArray(place?.imageUrls)
    ? place.imageUrls.filter(Boolean)
    : [];

  const handleScroll = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setActiveIndex(index);
    carousel.scrollTo({
      left: index * carousel.clientWidth,
      behavior: "smooth",
    });
  };

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <span className="loading loading-spinner loading-lg text-yellow-400"></span>
        <span className="ml-4 text-base sm:text-xl mt-4">
          Loading property details...
        </span>
      </div>
    );
  }

  const handlePayment = async (amount) => {
    const amt = amount;
    try {
      const orderRes = await axios.post("/api/payment/order", {
        amount: amt,
        currency: "INR",
        receipt: "receipt#123",
      });

      const { id, amount, currency } = orderRes.data;
      console.log("Payment verification response:", orderRes.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: "StayEase",
        description: "Booking Payment",
        order_id: id,
        handler: async function (response) {
          const verifyRes = await axios.post("/api/payment/verify", {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          console.log("Payment verification response:", verifyRes.data);
          const bookingData = {
            userId: user._id,
            placeId: place._id,
            paymentId: verifyRes.data.paymentId,
            amount: place.price,
          };
          console.log("Booking data:", bookingData);
          if (verifyRes.data.status === "success") {
            const saveRes = await axios.post("/api/payment/save", bookingData);
            console.log(
              "Payment saved successfully:",
              saveRes.data,
              bookingData,
            );
            await axios.put(`/api/user/update`, {
              userId: bookingData.userId,
              paymentId: bookingData.paymentId,
            });
            handleSuccess("Payment successful!");
            setTimeout(() => {
              navigate("/account");
            }, 3000);
          } else {
            handleError("Payment verification failed!");
          }
        },
        prefill: {
          name: `${user?.name || "Guest"}`,
          email: `${user?.email || "guest@example.com"}`,
          contact: `${user?.contact || "9XXXXXXXXX"}`,
        },
        theme: {
          color: "#FDE047",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border-b-4 border-yellow-400 p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-yellow-400 text-center text-shadow-lg font-bold roboto text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {place?.title}
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Image Carousel */}
          <div className="w-full max-w-5xl mx-auto">
            <div
              ref={carouselRef}
              className="carousel w-full h-48 xs:h-64 sm:h-80 md:h-96 lg:h-[400px] border-4 border-yellow-400 rounded-xl overflow-x-auto overflow-y-hidden shadow-xl scroll-smooth"
            >
              {images.length > 0 ? (
                images.map((src, index) => (
                  <div
                    key={index}
                    className="carousel-item w-full min-w-full shrink-0"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt={`Slide ${index + 1}`}
                    />
                  </div>
                ))
              ) : (
                <div className="flex w-full min-w-full items-center justify-center text-gray-500">
                  No house photos available
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex justify-center mt-4 gap-2 sm:gap-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show photo ${i + 1}`}
                    onClick={() => handleScroll(i)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${
                      i === activeIndex
                        ? "bg-yellow-400 scale-110 shadow"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Host Contact & Booking Section */}
          <div className="bg-white rounded-2xl shadow-lg border-4 border-yellow-400 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
              {/* Host Contact Info */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl text-yellow-400 font-bold mb-3 sm:mb-4">
                  Connect with Host:
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">
                      {place?.ownerContact?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">
                      {place?.ownerContact?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{place?.ownerContact?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 sm:gap-4 lg:gap-3 border-t lg:border-t-0 lg:border-l-4 border-yellow-400 pt-4 lg:pt-0 lg:pl-6">
                <p className="text-xl sm:text-2xl font-bold whitespace-nowrap">
                  ₹{place?.price?.toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => handlePayment(place?.price)}
                  className="btn btn-warning text-white text-base sm:text-lg lg:text-xl shadow-lg w-full sm:w-auto"
                >
                  Book now
                </button>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Description & Details:
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {place?.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Other Details:
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base">
                  Type: {place?.propertyType}
                </span>
                <span className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base">
                  Bedrooms: {place?.bedrooms}
                </span>
                <span className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base">
                  Bathrooms: {place?.bathrooms}
                </span>
                <span className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base">
                  Pet: {place?.petFriendly ? "Yes" : "No"}
                </span>
                <span className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base">
                  Furnished: {place?.furnished ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Full Address:
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                {place?.location?.fullAddress}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Facilities:
              </h2>
              <div className="flex flex-wrap gap-2">
                {place?.amenities?.map((facility, index) => (
                  <span
                    key={index}
                    className="rounded-2xl border-2 border-yellow-400 bg-yellow-200 text-yellow-800 px-3 py-1 text-sm sm:text-base"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-yellow-50 border-b-2 border-yellow-400 p-4 sm:p-6">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-yellow-400">
                Recommendations
              </h2>
            </div>

            {recommendation.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-10">
                <div className="animate-bounce mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-yellow-400 rounded-full flex items-center justify-center bg-yellow-100">
                    <span className="text-xl sm:text-2xl text-yellow-600">
                      📍
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-yellow-600 mb-2 text-center">
                  No Recommendations Found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center max-w-md px-4">
                  We couldn't find similar properties in your area right now.
                  Check back later for more recommendations!
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-6 overflow-x-auto">
                <div className="flex gap-3 sm:gap-4 pb-2">
                  {recommendation.map((house, index) => (
                    <div
                      key={index}
                      className="flex-none relative w-72 sm:w-80 md:w-96 h-56 sm:h-64 md:h-80 rounded-xl overflow-hidden shadow-lg group"
                    >
                      <img
                        src={house.imageUrls[0]}
                        alt={house.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-4 flex flex-col justify-center items-center">
                        <h3 className="text-base sm:text-lg font-bold text-yellow-400 mb-2 text-center">
                          {house.title}
                        </h3>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Area:</span>{" "}
                          {house.location.area}
                        </p>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Price:</span> ₹
                          {house.price}
                        </p>
                        <p className="font-semibold mt-2 text-sm sm:text-base">
                          Facilities:
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 justify-center">
                          {house.amenities.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="bg-yellow-400 text-black text-xs sm:text-sm px-2 py-1 rounded-full"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                        <NavLink to={`/placeDetails/${house._id}`}>
                          <button className="btn btn-warning btn-sm sm:btn-md mt-3 text-white font-bold">
                            Explore
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <Map id={place?._id} />

          {/* Reviews */}
          <ReviewPage id={place?._id} host={place?.hostedBy} />
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default PlaceDetail;
