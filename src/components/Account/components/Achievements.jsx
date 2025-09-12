import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/UserContext";
import axios from "axios";
import {
  Trophy,
  Award,
  Star,
  AlertCircle,
  RefreshCw,
  Target,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchAchievements = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/fetch/achievements/${user._id}`);

      // ✅ Deduplicate achievements by _id
      const uniqueAchievements = Array.from(
        new Map(response.data.map((a) => [a._id, a])).values()
      );

      setAchievements(uniqueAchievements);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError("Failed to load achievements. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user?._id]);

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 3:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "booking":
        return <Target className="w-5 h-5" />;
      case "hosting":
        return <Trophy className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  if (initialLoad && loading) {
    return (
      <div className="my-8 bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading your achievements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
            <p className="text-yellow-100 text-sm">
              {achievements.length}{" "}
              {achievements.length === 1 ? "achievement" : "achievements"}{" "}
              unlocked
            </p>
          </div>
        </div>

        {/* Retry */}
        {error && (
          <button
            onClick={fetchAchievements}
            disabled={loading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-8 mt-6 mb-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">
                Unable to load achievements
              </p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        {loading && !initialLoad && (
          <div className="text-center py-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400 border-t-transparent mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Refreshing achievements...</p>
          </div>
        )}

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement._id} // ✅ ensure unique key
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-yellow-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0 group-hover:bg-yellow-200 transition-colors duration-300">
                    {achievement.icon ? (
                      <i
                        className={`${achievement.icon} text-yellow-600 text-xl`}
                      />
                    ) : (
                      getTypeIcon(achievement.type)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {achievement.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getLevelColor(
                          achievement.level
                        )} flex-shrink-0`}
                      >
                        Level {achievement.level}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {achievement.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {achievement.type}
                      </span>

                      <div className="flex items-center gap-1">
                        {[...Array(achievement.level)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No achievements yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start booking or hosting properties to unlock your first
              achievements!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <NavLink to="/nearby">
                <button className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                  Browse Properties
                </button>
              </NavLink>

              <NavLink to="/listProperty">
                <button className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                  Host a Property
                </button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
