import { useParams, NavLink } from "react-router-dom";
import { useRef, useState, useEffect, use } from "react";
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

        // Adjust based on backend response shape
        const placeData = foundPlace?.data?.data || foundPlace?.data;
        setPlace(placeData);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchPlace();
  }, [id]);

  const carouselRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (index) => {
    setActiveIndex(index);
    carouselRefs[index].current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  if (!place) {
    return (
      <div className="absolute flex flex-col justify-center items-center top-20 p-5 m-5 w-full">
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg text-yellow-400"></span>
          <span className="ml-4 text-xl">Loading property details...</span>
        </div>
      </div>
    );
  }

  const handlePayment = async (amount) => {
    const amt = amount;
    try {
      // Step 1: Create Order on Backend
      const orderRes = await axios.post("/api/payment/order", {
        amount: amt, // Convert to paise
        currency: "INR",
        receipt: "receipt#123",
      });

      const { id, amount, currency } = orderRes.data;
      console.log("Payment verification response:", orderRes.data);
      // Step 2: Open Razorpay Checkout
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
              bookingData
            );
            console.log("Booking data:", bookingData);
            await axios.put(`/api/user/update`, {
              userId: bookingData.userId,
              paymentId: bookingData.paymentId,
            });
            handleSuccess("Payment successful!");
            console.log("Payment ID:", verifyRes.data);
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
    <div className="absolute flex flex-col justify-center items-center top-20 p-5 m-5 w-full">
      <div className="p-3 rounded-xl w-[95vw] border-b-2 border-yellow-400 shadow-lg">
        <h1 className="text-yellow-400 w-full text-center text-shadow-lg font-bold roboto text-4xl">
          {place?.title}
        </h1>
      </div>
      <div className="grid m-5 p-5 gap-5 w-full h-[100vh] grid-cols-1">
        <div className="h-full w-full flex flex-col justify-start items-center">
          <div className="w-4/5 max-w-4xl mx-auto">
            <div className="carousel w-full h-[55vh]  border-4 border-yellow-400 rounded-xl overflow-hidden shadow-xl">
              {/* ✅ Fixed property name from images to imageUrls */}
              {place?.imageUrls?.map((src, index) => (
                <div
                  key={index}
                  ref={carouselRefs[index]}
                  className="carousel-item w-full"
                >
                  <img
                    src={src}
                    className="w-full h-96 object-contain"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => handleScroll(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-yellow-400 scale-110 shadow"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="roboto m-5">
            <div className="flex flex-row mb-5 p-5 w-full justify-around items-center shadow-lg rounded-2xl border-4 border-yellow-400">
              <p className="flex items-center justify-around gap-5 border-r-4 border-yellow-400">
                <p className="text-2xl text-yellow-400 text-shadow-lg font-bold">
                  Connect with Host:
                </p>
                <div className="flex items-center justify-center text-lg mr-5">
                  <UserCircle />
                  &nbsp;{place?.ownerContact?.name}
                </div>
                <div className="flex items-center justify-center text-lg mr-5">
                  <Mail />
                  &nbsp;{place?.ownerContact?.email}
                </div>
                <div className="flex items-center justify-center text-lg mr-5">
                  <Phone />
                  &nbsp;{place?.ownerContact?.phone}
                </div>
              </p>
              <p className="text-2xl">
                <b>Price:&nbsp;</b>
                &#8377;{place?.price?.toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => handlePayment(place?.price)}
                className="btn btn-warning text-white text-2xl shadow-lg"
              >
                Book now
              </button>
            </div>
            <h1 className="text-xl mb-3 font-bold">Description & Details:</h1>
            <p className="ml-2 mb-3">{place?.description}</p>
            <h1 className="text-lg mb-3 font-bold">Other Details:</h1>
            <p className="ml-2 grid grid-cols-2 w-full mb-3">
              <div className="flex flex-row justify-evenly">
                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2">
                  Type:&nbsp;
                  {place?.propertyType}
                </div>
                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2">
                  Bedrooms:&nbsp;
                  {place?.bedrooms}
                </div>
                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2">
                  Bathrooms:&nbsp;
                  {place?.bathrooms}
                </div>
                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2">
                  Pet:&nbsp;
                  {place?.petFriendly ? "Yes" : "No"}
                </div>
                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2">
                  Furnished:&nbsp;
                  {place?.furnished ? "Yes" : "No"}
                </div>
              </div>
            </p>
            <h1 className="text-xl mb-3 font-bold">Full Address:</h1>
            <p className="ml-2 mb-3">{place?.location?.fullAddress}</p>
            <h1 className="text-xl mb-3 font-bold">Facilities:</h1>
            <div className="ml-2 mb-3">
              {place?.amenities?.map((facility, index) => (
                <li
                  key={index}
                  style={{
                    listStyle: "none",
                    display: "inline-block",
                  }}
                  className="rounded-2xl border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3 mr-2 mt-2"
                >
                  {facility}
                </li>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="w-[100%] shadow-lg rounded-2xl border-b-2 border-yellow-400">
              <div className="font-bold text-center text-2xl text-yellow-400 text-shadow-sm p-3">
                <h1>Recommendation:</h1>
              </div>
            </div>

            {recommendation.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 m-5">
                <div className="animate-bounce mb-4">
                  <div className="w-16 h-16 border-4 border-yellow-400 rounded-full flex items-center justify-center bg-yellow-100">
                    <span className="text-2xl text-yellow-600">📍</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-yellow-600 mb-2 animate-pulse">
                  No Recommendations Found
                </h3>
                <p className="text-gray-600 text-center max-w-md animate-fade-in">
                  We couldn't find similar properties in your area right now.
                  Check back later for more recommendations!
                </p>
                <div className="mt-4 flex space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 p-5 overflow-x-auto w-full">
                {recommendation.map((house, index) => (
                  <div
                    key={index}
                    className="flex-none relative w-[500px] h-[350px] rounded-xl overflow-hidden shadow-lg group"
                  >
                    <img
                      src={house.imageUrls[0]}
                      alt={house.title}
                      className="w-[500px] h-[350px] object-cover"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-4 flex flex-col justify-center items-center">
                      <h2 className="text-lg font-bold text-yellow-400 mb-2">
                        {house.title}
                      </h2>
                      <p>
                        <span className="font-semibold">Area:</span>{" "}
                        {house.location.area}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> ₹
                        {house.price}
                      </p>
                      <p className="font-semibold mt-2">Facilities:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {house.amenities.map((f, i) => (
                          <span
                            key={i}
                            className="bg-yellow-400 text-black text-sm px-2 py-1 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      <NavLink to={`/placeDetails/${house._id}`}>
                        <button className="btn btn-warning m-5 text-white font-bold">
                          Explore
                        </button>
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Map id={place?._id} />
        {console.log(place)}
        <ReviewPage id={place?._id} host={place?.hostedBy} />
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PlaceDetail;
