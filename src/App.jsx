import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import Account from "./components/Account/Account.jsx";
import Login from "./components/LoginRegister/Login.jsx";
import Register from "./components/LoginRegister/Register.jsx";
import ListPlace from "./components/ListPlaces/ListPlace.jsx";
import Nearby from "./components/NearBy/Nearby.jsx";
import Tour from "./components/Tour/Tour.jsx";
import Layout from "./Layout.jsx";
import TandCpage from "./TandCpage.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import PlaceDetail from "./components/NearBy/PlaceDetail.jsx";
import TourPlaceDetail from "./components/Tour/PlaceDetail.jsx";
import LoginRedirect from "./components/LoginRedirect.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DataDeletion from "./DataDeletion.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FormProvider } from "./Context/FormContext.jsx";

function App() {
  const GoogleAuthWrapper = ({ children }) => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        {
          path: "/nearby",
          element: (
            <ProtectedRoute>
              <Nearby />
            </ProtectedRoute>
          ),
        },
        {
          path: "/tour",
          element: (
            <ProtectedRoute>
              <Tour />
            </ProtectedRoute>
          ),
        },
        {
          path: "/listProperty",
          element: (
            <ProtectedRoute>
              <FormProvider>
                <ListPlace />
              </FormProvider>
            </ProtectedRoute>
          ),
        },
        {
          path: "/account",
          element: (
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <GoogleAuthWrapper>
              <Login />
            </GoogleAuthWrapper>
          ),
        },
        {
          path: "/register",
          element: (
            <GoogleAuthWrapper>
              <Register />
            </GoogleAuthWrapper>
          ),
        },

        { path: "/terms", element: <TandCpage /> },
        { path: "/privacy", element: <PrivacyPolicy /> },
        { path: "/placeDetails/:id", element: <PlaceDetail /> },
        { path: "/tourPlaceDetails/:id", element: <TourPlaceDetail /> },
        { path: "/oauth-success", element: <LoginRedirect /> },
        { path: "/dataDeletion", element: <DataDeletion /> },
        { path: "*", element: <ErrorPage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
