import { useRef, useState, useEffect } from "react";
import { handleError } from "../../utils";
import axios from "axios";

const Map = ({ id }) => {
    const mapRef = useRef(null);
    const [place, setPlace] = useState(null);
    
    useEffect(() => {
    const fetchPlace = async () => {
        try {
        const foundPlace = await axios.get(
            `/api/property/getDetails/${id}`
        );
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

  useEffect(() => {
    if (!place || !place.location || !place.location.fullAddress) {
      return;
    }

    const address = place.location.fullAddress;

    const getLatLongFromAddress = async (address) => {
      if (!address) {
        handleError("Address is empty or undefined");
        return;
      }
      try {
        const response = await fetch(
          `/api/geocode?address=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          return { lat, lon };
        } else {
          console.error("Address not found");
          return null;
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
      }
    };

    const setupMap = async () => {
      const coords = await getLatLongFromAddress(address);

      if (coords) {
        if (mapRef.current) {
          mapRef.current.remove();
        }

        const map = L.map("map").setView([coords.lat, coords.lon], 13);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([coords.lat, coords.lon])
          .addTo(map)
          .bindPopup("Property Location")
          .openPopup();
      }
    };

    setupMap();
  }, [place]);

  const handleShareLocation = () => {
    if (!mapRef.current) {
      alert("Map not initialized!");
      return;
    }

    const center = mapRef.current.getCenter();
    const shareUrl = `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=18/${center.lat}/${center.lng}`;

    const success = document.getElementById("success-alert");
    const failure = document.getElementById("error-alert");

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        fadeAlert(success);
      })
      .catch(() => {
        fadeAlert(failure);
      });

    // Reusable fade animation
    function fadeAlert(el) {
      el.classList.remove("hidden");
      setTimeout(() => el.classList.add("opacity-100"), 10); // fade in
      setTimeout(() => {
        el.classList.remove("opacity-100"); // fade out
        setTimeout(() => el.classList.add("hidden"), 500); // hide after fade
      }, 2000);
    }
  };
  return (
    <div className="h-screen w-full grid">
      <div className="w-full h-full flex flex-col justify-start items-center relative">
        <div className="p-3 rounded-xl w-[100%] border-2 mb-5 bg-white border-yellow-400 shadow-lg">
          <h1 className="text-yellow-400 w-full text-center text-shadow-lg font-bold roboto text-2xl">
            Here's your upcoming destination
          </h1>
        </div>
        <div
          id="success-alert"
          className="alert alert-success fixed bottom-24 right-5 hidden opacity-0 transition-opacity duration-500 z-50"
        >
          <span>✅ Link Copied Successfully</span>
        </div>
        <div
          id="error-alert"
          className="alert alert-error fixed bottom-24 right-5 hidden opacity-0 transition-opacity duration-500 z-50"
        >
          <span>❌ Error! Task failed successfully.</span>
        </div>

        <div id="map" className="w-full h-[400px] rounded-xl"></div>

        <button
          className="btn btn-warning rounded-full text-white font-bold absolute bottom-3 m-2 right-3 z-5"
          onClick={() => handleShareLocation()}
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>
    </div>
  );
};

export default Map;
