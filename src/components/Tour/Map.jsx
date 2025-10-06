import { useRef, useState, useEffect } from "react";
import { handleError } from "../../utils";
import axios from "axios";

const Map = ({ id }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [place, setPlace] = useState(null);

  // Fetch property details
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

  // Initialize map when place data changes
  useEffect(() => {
    if (!place || !place.location || !place.location.fullAddress) return;

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
        // Remove existing map
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Initialize new map after small delay
        setTimeout(() => {
          if (mapContainerRef.current) {
            const map = L.map(mapContainerRef.current).setView(
              [coords.lat, coords.lon],
              13
            );
            mapRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            L.marker([coords.lat, coords.lon])
              .addTo(map)
              .bindPopup("Property Location")
              .openPopup();

            // Fix map rendering after size transitions
            setTimeout(() => map.invalidateSize(), 200);
          }
        }, 100);
      }
    };

    setupMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [place]);

  // Handle share location
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
      .then(() => fadeAlert(success))
      .catch(() => fadeAlert(failure));

    function fadeAlert(el) {
      el.classList.remove("hidden");
      setTimeout(() => el.classList.add("opacity-100"), 10);
      setTimeout(() => {
        el.classList.remove("opacity-100");
        setTimeout(() => el.classList.add("hidden"), 500);
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto my-6 sm:my-10 transition-all duration-500 ease-in-out">
      {/* Header */}
      <div className="bg-yellow-50 border-b-2 border-yellow-400 p-4 sm:p-6 text-center">
        <h2 className="text-yellow-400 font-bold roboto text-lg sm:text-xl md:text-2xl">
          Here's your upcoming destination
        </h2>
      </div>

      {/* Map Section */}
      <div className="relative p-4 sm:p-6 flex flex-col items-center">
        {/* Alerts */}
        <div
          id="success-alert"
          className="alert alert-success fixed bottom-24 right-5 hidden opacity-0 transition-opacity duration-500 z-50 max-w-[90vw] sm:max-w-sm"
        >
          <span className="text-sm">✅ Link Copied Successfully</span>
        </div>
        <div
          id="error-alert"
          className="alert alert-error fixed bottom-24 right-5 hidden opacity-0 transition-opacity duration-500 z-50 max-w-[90vw] sm:max-w-sm"
        >
          <span className="text-sm">❌ Error! Task failed successfully.</span>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full rounded-xl border-2 z-5 border-gray-200 h-64 sm:h-80 md:h-96 lg:h-[550px] transition-all duration-500 ease-in-out"
        ></div>

        {/* Share Button */}
        <button
          className="btn btn-warning btn-sm sm:btn-md rounded-full text-white font-bold mt-6 sm:mt-8 transition-transform hover:scale-105"
          onClick={handleShareLocation}
        >
          <i className="fa-solid fa-share-nodes mr-2"></i> Share Location
        </button>
      </div>
    </div>
  );
};

export default Map;
