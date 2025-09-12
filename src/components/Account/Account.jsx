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
      { label: "Hosting", data: Array(12).fill(0), backgroundColor: "#f97316" },
    ],
  });

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user"))._id;
    const fetchActivity = async () => {
      try {
        console.log("Fetching activity for user ID:", id);
        const res = await axios.get(`/api/user/${id}/activity`);
        console.log("Bar Graph Data:", res.data);
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
  }, [isAuth]);

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

          setUserData((prev) => ({
            ...prev,
            ...response.data,
          }));
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      } else {
        console.log("No user or token in localStorage");
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
      } else {
        console.log("No user logged in");
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
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

        const { uploadUrl, fileUrl } = data;

        await axios.put(uploadUrl, profileFile, {
          headers: { "Content-Type": profileFile.type },
        });

        profilePicUrl = fileUrl;
      }

      const storedUser = localStorage.getItem("user");
      const { _id } = JSON.parse(storedUser);
      const updatedUserData = { ...userData, profilePic: profilePicUrl, _id };
      const response = await axios.put(
        `/api/user/update-profile/`,
        updatedUserData
      );
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
    <div className="min-h-screen">
      {/* Edit Profile Modal */}
      <dialog id="my_modal_3" className="modal backdrop-blur-sm">
        <div className="modal-box max-w-2xl bg-white/95 backdrop-blur-md border border-yellow-200 shadow-2xl">
          <form encType="multipart/form-data" className="space-y-6">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:bg-yellow-100"
              onClick={() => {
                document.getElementById("my_modal_3").close();
                setPreviewUrl(null);
                setProfileFile(null);
              }}
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                Edit Profile
              </h3>
              <p className="text-gray-600 mt-2">
                Update your personal information
              </p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-300 shadow-lg">
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
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                  <Camera className="text-white w-8 h-8" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Click to change profile picture
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                  className="input input-bordered w-full border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={16} /> Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="input input-bordered w-full border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="input input-bordered w-full border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPinCheck size={16} /> Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="input input-bordered w-full border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className=" font-semibold text-gray-700 flex items-center gap-2">
                  <UserCircle size={16} /> About Me
                </label>
                <textarea
                  placeholder="Tell us about yourself"
                  value={userData.aboutMe}
                  onChange={(e) =>
                    setUserData({ ...userData, aboutMe: e.target.value })
                  }
                  className="textarea textarea-bordered w-full h-24 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("my_modal_3").close();
                  setPreviewUrl(null);
                  setProfileFile(null);
                }}
                className="btn btn-outline btn-warning hover:bg-yellow-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProfile}
                type="submit"
                className="btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none hover:from-yellow-500 hover:to-orange-500 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-4">
            My Account
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile, track your journey, and grow your hosting
            business
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-100 to-white rounded-3xl shadow-2xl overflow-hidden border border-yellow-200">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <img
                        src={userData.profilePic || "/Images/Logo/profile.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Badges */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                    {userData.bookings.length >= 10 && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg font-semibold">
                        <Luggage size={16} /> Traveler
                      </span>
                    )}
                    {userData.hosting.length >= 10 && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-4 py-2 rounded-full shadow-lg font-semibold">
                        <Home size={16} /> Superhost
                      </span>
                    )}
                    {reviews >= 10 && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-lg font-semibold">
                        <Star size={16} /> Top Rated
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center lg:justify-start gap-2">
                    <User size={24} />
                    {userData.fullName}
                  </h2>

                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center justify-center lg:justify-start gap-2">
                      <MapPinCheck size={18} className="text-green-600" />
                      <span className="font-semibold">Location:</span>
                      <span>{userData.address}</span>
                    </p>
                    <p className="flex items-center justify-center lg:justify-start gap-2">
                      <Mail size={18} className="text-blue-600" />
                      <span className="font-semibold">Email:</span>
                      <span>{userData.email}</span>
                    </p>
                    <p className="flex items-center justify-center lg:justify-start gap-2">
                      <Phone size={18} className="text-purple-600" />
                      <span className="font-semibold">Phone:</span>
                      <span>{userData.phone}</span>
                    </p>
                  </div>

                  {userData.aboutMe && (
                    <div className="mt-4">
                      <p className="flex items-start justify-center lg:justify-start gap-2 text-gray-700">
                        <UserCircle
                          size={18}
                          className="text-orange-600 mt-0.5"
                        />
                        <span>
                          <span className="font-semibold">About Me:</span>
                          <br />
                          <span className="text-gray-600">
                            {userData.aboutMe}
                          </span>
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-yellow-200">
                <button
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                  className="btn bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none hover:from-yellow-500 hover:to-orange-500 shadow-lg flex items-center gap-2"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-lg flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Bookings"
            value={userData.bookings.length}
            subTitle="Stays booked this year"
            iconColor="text-green-500"
            icon={<i className="fa-solid fa-house text-2xl"></i>}
            border="border-green-400"
            shadowColor="shadow-green-200"
            shadow="shadow-xl"
          />
          <StatsCard
            title="Properties Hosted"
            value={userData.hosting.length}
            subTitle="Active Listings"
            iconColor="text-orange-500"
            icon={<i className="fa-solid fa-hotel text-2xl"></i>}
            border="border-orange-400"
            shadowColor="shadow-orange-200"
            shadow="shadow-xl"
          />
          <StatsCard
            title="Total Reviews"
            value={reviews}
            subTitle={`Average Rating: ${
              typeof avgRating === "number" ? avgRating.toFixed(1) : "0.0"
            }`}
            iconColor="text-blue-500"
            icon={<i className="fa-solid fa-star text-2xl"></i>}
            border="border-blue-400"
            shadowColor="shadow-blue-200"
            shadow="shadow-xl"
          />
        </div>

        {/* Chart and Other Components */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <BarChart bookingData={bookingData} />
          </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <Bookings />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <Hostings />
            </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <Achievements />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Account;
