import { use } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import { useAuth } from "../../Context/UserContext";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./googleApi";


const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const email = watch("email");
  const { login } = useAuth();
  const onSubmit = () => {
  const dataToSend = {
    email,
    password,
  };
    axios
      .post("/api/user/login", dataToSend)
      .then((res) => {
        const { token, user } = res.data;
        login(user, token);
        handleSuccess("Login successful");
        setTimeout(() => {
          navigate("/nearby");
        }, 1000);
      })
      .catch((error) => {
        handleError("Invalid email or password!");
      });
  };
const signinWithGoogle  = useGoogleLogin({
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
    <div className=" absolute top-10 w-full h-full min-h-screen flex justify-center items-center">
      <div className="card w-full max-w-md bg-white shadow-xl border-4 border-yellow-400 p-6 relative">
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 border-4 border-white bg-yellow-400 px-4 py-1 rounded-full shadow-md">
          <h1 className="text-white font-bold text-lg">Login</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-control flex flex-col justify-center items-center mt-6 space-y-4 "
          noValidate
        >
          {/* Email */}
          <div className="form-control w-full">
            <label className="text-left label font-semibold text-yellow-500">
              Email
            </label>
            <br />
            <input
              type="email"
              placeholder="Enter email address"
              className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
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
          <br />
          {/* Password */}
          <div className="form-control w-full">
            <label className="text-left label font-semibold text-yellow-500">
              Password
            </label>
            <br />
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full border-yellow-400 focus:outline-yellow-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Maximum 30 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "Include letters, numbers, and special characters",
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
          <br />
          {/* Submit Button */}
          <div className="form-control mt-6 flex flex-col justify-center items-center">
            <button
              type="submit"
              className="btn btn-warning text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
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
            onClick={() => signinWithGoogle()}
            type="button"
            className="btn text-lg py-6 bg-black text-white rounded-full"
          >
            <img
              src="/Images/Logo/google.png"
              width={25}
              height={25}
              alt="Google logo"
            />
            <span className="ml-2">Signin with Google</span>
          </button>
        </div>
        <p className="text-center font-semibold roboto m-2">
          Don't have a account ? &nbsp;
          <NavLink
            className="underline font-semibold roboto hover:text-yellow-400"
            to="/register"
          >
            Register
          </NavLink>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
