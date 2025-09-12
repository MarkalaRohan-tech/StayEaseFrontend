import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollToTop from "./components/NearBy/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop/>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
