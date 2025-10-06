import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../utils";

const ReviewPage = ({ id, host }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]);
  const [commentData, setCommentData] = useState({
    name: user?.fullName,
    property: id,
    user: user?._id,
    rating: 5,
    interactionType: "visited",
    comment: "",
    host: host,
  });

  // ✅ Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/review/getComments/${id}`);
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  // ✅ Handle post comment
  const handleCommentPost = async (e) => {
    e.preventDefault();
    if (!commentData.comment) return handleError("Comment cannot be empty!");

    try {
      const res = await axios.get(`/api/review/getComments/${id}`);
      const existing = res.data.data;
      const alreadyCommented = existing.some((c) => c.user === user?._id);

      if (alreadyCommented) {
        handleError("You have already posted a comment for this property.");
        return;
      }

      const response = await axios.post("/api/review/add", commentData);

      if (response.status === 201) {
        handleSuccess(response.data.message);
        setCommentData((prev) => ({ ...prev, comment: "" }));

        const updated = await axios.get(`/api/review/getComments/${id}`);
        setComments(updated.data.data);
      } else {
        handleError("Error posting comment");
      }
    } catch (error) {
      handleError(error);
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto my-8 overflow-hidden transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="bg-yellow-50 border-b-2 border-yellow-400 p-4 text-center sticky top-0 z-10">
        <h2 className="text-yellow-500 font-extrabold text-xl sm:text-2xl tracking-wide">
          Guest Reviews & Comments
        </h2>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* Comment Form */}
        <div className="border border-yellow-300 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-yellow-50 to-white shadow-md">
          <h3 className="font-bold text-lg sm:text-xl mb-4 border-b-2 border-yellow-300 pb-2 flex items-center gap-2">
            Leave a Review
          </h3>

          <form onSubmit={handleCommentPost} className="space-y-5">
            {/* Interaction Type */}
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">
                Interaction Type
              </h4>
              <div className="flex flex-wrap gap-3">
                {["visited", "short", "long"].map((type) => (
                  <label
                    key={type}
                    className={`cursor-pointer flex items-center gap-2 rounded-full px-4 py-2 border ${
                      commentData.interactionType === type
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : "border-yellow-300 text-gray-600"
                    } transition-all duration-200`}
                  >
                    <input
                      type="radio"
                      name="interaction"
                      value={type}
                      checked={commentData.interactionType === type}
                      onChange={(e) =>
                        setCommentData((prev) => ({
                          ...prev,
                          interactionType: e.target.value,
                        }))
                      }
                      className="hidden"
                    />
                    {type === "visited" && "Visited"}
                    {type === "short" && "Short Stay"}
                    {type === "long" && "Long Stay"}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">
                Rating
              </h4>
              <div className="rating rating-lg flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    checked={commentData.rating === star}
                    value={star}
                    onChange={(e) =>
                      setCommentData((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="mask mask-star bg-yellow-400 transition-transform hover:scale-110"
                  />
                ))}
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">
                Comment
              </h4>
              <textarea
                name="comment"
                value={commentData.comment}
                onChange={(e) =>
                  setCommentData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Share your experience..."
                className="textarea textarea-warning w-full min-h-[100px] text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 transition-all"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-warning text-white font-bold w-full sm:w-auto rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                Post Review
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div>
          <h3 className="font-bold text-lg sm:text-xl mb-4 pb-2 border-b-2 border-yellow-300 flex items-center gap-2">
            What Guests Are Saying
          </h3>

          {comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="border border-yellow-300 rounded-xl p-4 shadow-sm bg-gradient-to-br from-white to-yellow-50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={comment.profilePic || "/Images/Logo/profile.png"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300"
                      alt="Profile"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm sm:text-base">
                        {comment.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm sm:text-base text-gray-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 text-xs bg-yellow-100 border border-yellow-300 rounded-full font-semibold">
                        {comment.interactionType.toUpperCase()}
                      </span>
                      <span className="text-yellow-400 text-lg">
                        {"★".repeat(comment.rating)}
                        <span className="text-gray-300">
                          {"★".repeat(5 - comment.rating)}
                        </span>
                      </span>
                    </div>

                    <p className="italic leading-snug text-gray-800">
                      “{comment.comment}”
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center border-2 border-yellow-300 rounded-xl p-8 bg-yellow-50 shadow-inner">
              <p className="font-semibold text-gray-700 text-base sm:text-lg">
                No comments yet 😔
              </p>
              <p className="text-yellow-600 mt-2">
                Be the first to share your experience 🌟
              </p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReviewPage;
