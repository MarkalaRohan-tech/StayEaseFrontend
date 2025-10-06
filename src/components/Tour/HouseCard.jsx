import { useEffect, useState } from "react";
import { useAuth } from "../../Context/UserContext";
import axios from "axios";
import { NavLink } from "react-router-dom";

const HouseCard = ({
  id,
  title,
  price,
  area,
  facilities,
  rating,
  image,
  likedProperties,
  setLikedProperties,
}) => {
  const { user } = useAuth();
  const [fav, setFav] = useState(
    likedProperties?.includes(String(id)) || false
  );
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Update local fav when parent likedProperties changes
  useEffect(() => {
    setFav(likedProperties?.includes(String(id)) || false);
  }, [likedProperties, id]);

  const toggleFav = async () => {
    if (!user || isLoading) return;

    const nextFav = !fav;
    setFav(nextFav); // instant UI feedback
    setIsLoading(true);

    try {
      if (nextFav) {
        // Like
        await axios.post(`/api/user/${user._id}/like/${id}`);
        setLikedProperties((prev) =>
          Array.from(new Set([...prev, String(id)]))
        );
      } else {
        // Unlike
        await axios.delete(`/api/user/${user._id}/like/${id}`);
        setLikedProperties((prev) => prev.filter((pid) => pid !== String(id)));
      }
    } catch (err) {
      console.error("Error toggling fav:", err);
      setFav(!nextFav); // revert UI on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 rounded-2xl transition-all ease-in shadow-lg w-full hover:shadow-xl">
      <figure className="w-full h-60 overflow-hidden rounded-t-2xl">
        <img src={image} alt="House" className="w-full h-full object-cover" />
      </figure>

      <div className="card-body flex flex-col">
        <h2 className="card-title flex justify-between">
          {title}
          <span className="text-lg">
            <i className="fa-solid fa-star text-yellow-300"></i>({rating})
          </span>
        </h2>

        <p>
          <b>Area:</b> {area}
        </p>
        <p>
          <b>Price:</b> ₹{price.toLocaleString("en-IN")}
        </p>

        <div>
          <b>Facilities:</b>
          <ul className="flex flex-wrap gap-2 mt-1">
            {facilities.map((facility, idx) => (
              <li
                key={idx}
                className="rounded-2xl border-2 border-yellow-400 bg-yellow-200 text-yellow-800 p-1 px-3"
              >
                {facility}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-actions mt-5 justify-between">
          <button
            onClick={toggleFav}
            disabled={isLoading}
            className={`btn bg-white border-0 shadow-none rounded-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {fav ? (
              <i
                style={{ WebkitTextStroke: "1.5px black" }}
                className="fa-solid fa-heart text-2xl text-red-500"
              ></i>
            ) : (
              <i className="fa-regular fa-heart text-2xl text-gray-700"></i>
            )}
          </button>

          {user ? (
            <NavLink to={`/tourPlaceDetails/${id}`}>
              <button className="btn btn-warning text-white font-bold">
                Explore
              </button>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="btn btn-warning text-white font-bold">
                Login to Book
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
