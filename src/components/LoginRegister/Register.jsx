import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useBeforeUnload, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {handleError,handleSuccess} from "../../utils"
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google"
import { googleAuth } from "./googleApi";
import { useAuth } from "../../Context/UserContext";

const Register = () => {
  
const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");
  const fullName = watch("fullName");
  const email = watch("email");
  const phone = watch("phone");
  const address = watch("address");

  const onSubmit = () => {
    const dataToSend = {
      fullName,
      email,
      phone,
      address,
      password,
    };
    axios.post("/api/user/signup", dataToSend)
      .then(() => {
        handleSuccess("Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        handleError(error.response?.data?.message || "Registration failed");
      });
  };

const signupWithGoogle = useGoogleLogin({
  onSuccess: async (authResult) => {
    try {
      if (authResult?.code) {
        const response = await googleAuth(authResult.code);
        const { token, user } = response.data;
        login(user, token);
        handleSuccess("Google login successful");
        setTimeout(() => {
          navigate("/nearby");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      handleError("Google login failed");
    }
  },
  onError: (error) => {
    console.error("Google login error:", error);
    handleError("Google login failed");
  },
  flow: "auth-code",
});

  return (
    <div className="absolute top-20 mb-5 w-full h-full min-h-screen flex justify-center items-center">
      <div className="card relative border-4 border-yellow-400 bg-white w-full max-w-lg shadow-lg p-6">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 border-4 border-white px-4 py-1 rounded-full shadow-md">
          <p className="text-white font-bold">Register</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
          {/* Full Name */}
          <div className="form-control w-full">
            <label className="label text-left font-semibold text-yellow-500">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
              {...register("fullName", {
                required: "Full name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name should contain only letters and spaces",
                },
              })}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div className="form-control w-full">
              <label className="label text-left font-semibold text-yellow-500">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label text-left font-semibold text-yellow-500">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[7-9]\d{9}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="form-control w-full">
            <label className="label text-left font-semibold text-yellow-500">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter Address"
              className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label text-left font-semibold text-yellow-500">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
                    message:
                      "Must include letters, numbers, and special characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label text-left font-semibold text-yellow-500">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
                {...register("ConfirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.ConfirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i>
                  {errors.ConfirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <br />
          <div className="form-control mt-4 flex flex-col justify-center items-center">
            <button
              type="submit"
              className="btn btn-warning text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <br />
        <div className="flex items-center justify-center w-full my-4">
          <div className="flex-1 h-0.5 bg-gray-400"></div>
          <span className="mx-4 text-gray-500 text-lg">or</span>
          <div className="flex-1 h-0.5 bg-gray-400"></div>
        </div>
        <div className="flex justify-center gap-5 items-center">
          <button
            onClick={() => signupWithGoogle()}
            type="button"
            className="btn text-lg py-6 bg-black text-white rounded-full"
          >
            <img src="/Images/Logo/google.png" width={25} height={25} alt="Google logo" />
            <span className="ml-2">Signup with Google</span>
          </button>
        </div>
        <p className="text-center font-semibold roboto m-2">
          Already have an account?&nbsp;
          <NavLink
            className="underline font-semibold roboto hover:text-yellow-400"
            to="/login"
          >
            Login
          </NavLink>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register