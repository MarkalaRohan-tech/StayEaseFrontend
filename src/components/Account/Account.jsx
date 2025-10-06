import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Star,
  Luggage,
  Home,
  User,
  UserCircle,
  LogOut,
  Edit,
  MapPinCheck,
  Mail,
  Phone,
  Camera,
} from "lucide-react";
import axios from "axios";
import StatsCard from "./components/StatusCard";
import Bookings from "./components/Bookings";
import Hostings from "./components/Hostings";
import Achievements from "./components/Achievements";
import BarChart from "./components/BarChart";
import { useAuth } from "../../Context/UserContext";
import { handleSuccess } from "../../utils";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    handleSuccess("Logged out Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const [bookingData, setBookingData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Bookings",
        data: Array(12).fill(0),
        backgroundColor: "#2563eb",
      },
      {
        label: "Hosting",
        data: Array(12).fill(0),
        backgroundColor: "#f97316",
      },
    ],
  });

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user"))._id;
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/user/${id}/activity`);
        setBookingData((prev) => ({
          ...prev,
          datasets: [
            { ...prev.datasets[0], data: res.data.bookings },
            { ...prev.datasets[1], data: res.data.hosting },
          ],
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivity();
  }, []);

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("user"));

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuth(!!user);
    };

    const interval = setInterval(checkAuth, 60000);
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const [userData, setUserData] = useState({
    profilePic: "",
    fullName: "",
    address: "",
    phone: "",
    email: "",
    aboutMe: "",
    totalReviews: 0,
    avgRating: 0,
    badges: [],
    hosting: [],
    bookings: [],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const { _id } = JSON.parse(storedUser);
          const response = await axios.get(`/api/user/${_id}`, {
            withCredentials: true,
          });
          setUserData((prev) => ({ ...prev, ...response.data }));
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      const allocateBadges = async () => {
        try {
          const res = await axios.post(`/api/user/${user._id}/allocate-badges`);
          setUserData(res.data);
        } catch (err) {
          console.error("Error allocating badges:", err);
        }
      };
      allocateBadges();
    }
  }, [user?._id]);

  const [reviews, setReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const { _id } = JSON.parse(storedUser);
          const response = await axios.get(`/api/user/${_id}/reviews`);
          setReviews(response.data.totalReviews || 0);
          setAvgRating(response.data.avgRating || 0);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      }
    };
    fetchReviews();
  }, []);

  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      let profilePicUrl = userData.profilePic;

      if (profileFile) {
        const { data } = await axios.get(
          `/api/upload/get-profile-presigned-url?fileName=${profileFile.name}&fileType=${profileFile.type}`
        );

        await axios.put(data.uploadUrl, profileFile, {
          headers: { "Content-Type": profileFile.type },
        });

        profilePicUrl = data.fileUrl;
      }

      const storedUser = localStorage.getItem("user");
      const { _id } = JSON.parse(storedUser);
      const updatedUserData = { ...userData, profilePic: profilePicUrl, _id };
      await axios.put(`/api/user/update-profile/`, updatedUserData);
      setUserData(updatedUserData);
      setProfileFile(null);
      setPreviewUrl(null);
      document.getElementById("my_modal_3").close();
      handleSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Edit Profile Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-[95%] max-w-2xl bg-white border border-yellow-200 shadow-2xl">
          <form className="space-y-4 sm:space-y-6">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-yellow-100"
              onClick={() => {
                document.getElementById("my_modal_3").close();
                setPreviewUrl(null);
                setProfileFile(null);
              }}
            >
              ✕
            </button>

            <div className="text-center mb-4 sm:mb-6 pt-8 sm:pt-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                Edit Profile
              </h3>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base px-4">
                Update your personal information
              </p>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
                  <img
                    src={
                      previewUrl ||
                      userData.profilePic ||
                      "/Images/Logo/profile.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
                Click to change profile picture
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 px-2">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={14} className="sm:w-4 sm:h-4" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                  className="input input-bordered w-full text-sm border-yellow-200 focus:border-yellow-400"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={14} className="sm:w-4 sm:h-4" /> Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="input input-bordered w-full text-sm border-yellow-200 focus:border-yellow-400"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail size={14} className="sm:w-4 sm:h-4" /> Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="input input-bordered w-full text-sm border-yellow-200 focus:border-yellow-400"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPinCheck size={14} className="sm:w-4 sm:h-4" /> Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="input input-bordered w-full text-sm border-yellow-200 focus:border-yellow-400"
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2 sm:col-span-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <UserCircle size={14} className="sm:w-4 sm:h-4" /> About Me
                </label>
                <textarea
                  placeholder="Tell us about yourself"
                  value={userData.aboutMe}
                  onChange={(e) =>
                    setUserData({ ...userData, aboutMe: e.target.value })
                  }
                  className="textarea textarea-bordered w-full h-20 sm:h-24 text-sm border-yellow-200 focus:border-yellow-400 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-4 px-2">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("my_modal_3").close();
                  setPreviewUrl(null);
                  setProfileFile(null);
                }}
                className="btn btn-outline btn-warning w-full sm:w-auto text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProfile}
                type="submit"
                className="btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none hover:from-yellow-500 hover:to-orange-500 w-full sm:w-auto text-xs sm:text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 lg:px-6 pt-10 sm:pt-10 pb-6 sm:pb-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
            My Account
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg px-4">
            Manage your profile, track your journey, and grow your hosting
            business
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-100 to-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-yellow-200">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={userData.profilePic || "/Images/Logo/profile.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className="bg-yellow-400 rounded-full p-1.5 sm:p-2 shadow-lg">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left w-full">
                  {/* Badges */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3 sm:mb-4">
                    {userData.bookings.length >= 10 && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2.5 py-1.5 rounded-full shadow-lg font-semibold">
                        <Luggage size={12} className="sm:w-3.5 sm:h-3.5" />
                        Traveler
                      </span>
                    )}
                    {userData.hosting.length >= 10 && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2.5 py-1.5 rounded-full shadow-lg font-semibold">
                        <Home size={12} className="sm:w-3.5 sm:h-3.5" />
                        Superhost
                      </span>
                    )}
                    {reviews >= 10 && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1.5 rounded-full shadow-lg font-semibold">
                        <Star size={12} className="sm:w-3.5 sm:h-3.5" />
                        Top Rated
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center lg:justify-start gap-2 px-2">
                    <User
                      size={18}
                      className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0"
                    />
                    <span className="break-words">{userData.fullName}</span>
                  </h2>

                  <div className="space-y-2 text-gray-700 text-xs sm:text-sm md:text-base">
                    <p className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 px-2">
                      <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <MapPinCheck
                          size={14}
                          className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                        />
                        Location:
                      </span>
                      <span className="break-words text-center sm:text-left">
                        {userData.address}
                      </span>
                    </p>
                    <p className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 px-2">
                      <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <Mail
                          size={14}
                          className="sm:w-4 sm:h-4 text-blue-600 flex-shrink-0"
                        />
                        Email:
                      </span>
                      <span className="break-all text-center sm:text-left">
                        {userData.email}
                      </span>
                    </p>
                    <p className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 px-2">
                      <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <Phone
                          size={14}
                          className="sm:w-4 sm:h-4 text-purple-600 flex-shrink-0"
                        />
                        Phone:
                      </span>
                      <span className="break-words text-center sm:text-left">
                        {userData.phone}
                      </span>
                    </p>
                  </div>

                  {userData.aboutMe && (
                    <div className="mt-3 sm:mt-4">
                      <p className="flex flex-col sm:flex-row items-start justify-center lg:justify-start gap-1 text-gray-700 text-xs sm:text-sm md:text-base px-2">
                        <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
                          <UserCircle
                            size={14}
                            className="sm:w-4 sm:h-4 text-orange-600 flex-shrink-0"
                          />
                          About:
                        </span>
                        <span className="text-gray-600 text-center sm:text-left break-words">
                          {userData.aboutMe}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-yellow-200">
                <button
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                  className="btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none hover:from-yellow-500 hover:to-orange-500 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 max-w-6xl mx-auto">
          <StatsCard
            title="Total Bookings"
            value={userData.bookings.length}
            subTitle="Stays booked"
            iconColor="text-green-500"
            icon={
              <i className="fa-solid fa-house text-lg sm:text-xl md:text-2xl"></i>
            }
            border="border-green-400"
            shadowColor="shadow-green-200"
            shadow="shadow-xl"
          />
          <StatsCard
            title="Properties Hosted"
            value={userData.hosting.length}
            subTitle="Active Listings"
            iconColor="text-orange-500"
            icon={
              <i className="fa-solid fa-hotel text-lg sm:text-xl md:text-2xl"></i>
            }
            border="border-orange-400"
            shadowColor="shadow-orange-200"
            shadow="shadow-xl"
          />
          <StatsCard
            title="Total Reviews"
            value={reviews}
            subTitle={`Avg: ${
              typeof avgRating === "number" ? avgRating.toFixed(1) : "0.0"
            }`}
            iconColor="text-blue-500"
            icon={
              <i className="fa-solid fa-star text-lg sm:text-xl md:text-2xl"></i>
            }
            border="border-blue-400"
            shadowColor="shadow-blue-200"
            shadow="shadow-xl"
          />
        </div>

        {/* Chart and Components */}
        <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100">
            <BarChart bookingData={bookingData} />
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100">
            <Bookings />
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100">
            <Hostings />
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border border-gray-100">
            <Achievements />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Account;
