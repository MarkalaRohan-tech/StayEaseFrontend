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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/review/getComments/${id}`);
        console.log("Fetched comments:", response.data);
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleCommentPost = async (e) => {
    e.preventDefault();
    if (!commentData.comment) return;

    try {
      const postData = {
        name: user?.fullName,
        property: id,
        user: user?._id,
        rating: commentData.rating,
        interactionType: commentData.interactionType,
        comment: commentData.comment,
        host: host,
      };
      console.log(postData);
      const res = await axios.get(`/api/review/getComments/${id}`);
      const existing = res.data.data;

      const alreadyCommented = existing.some((c) => c.user === user?._id);

      if (alreadyCommented) {
        handleError("You have already posted a comment for this property.");
        return;
      }

      const response = await axios.post("/api/review/add", postData);

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
    <div className="w-full h-full pb-5 rounded-xl">
      <div className="p-3 rounded-xl w-[100%] border-2 mb-5 z-10 top-0 sticky bg-white border-yellow-400 shadow-lg">
        <h1 className="text-yellow-400 w-full text-center text-shadow-lg font-bold roboto text-2xl">
          Reviews & Comments
        </h1>
      </div>
      <center>
        <div className="p-3 rounded-xl w-[80%] border-2 mb-5 border-yellow-400 shadow-lg">
          <h1 className="font-bold text-lg mb-4 border-b-2 p-3 border-yellow-400">
            Drop Your comments
          </h1>

          <form onSubmit={handleCommentPost}>
            {/* Interaction Type */}
            <h1 className="font-bold">Interaction Type:</h1>
            <div className="flex justify-around mt-3 mb-3 items-center">
              <label className="inline-block">
                <input
                  type="radio"
                  name="interaction"
                  id="visited"
                  value="visited"
                  onChange={(e) =>
                    setCommentData((prev) => ({
                      ...prev,
                      interactionType: e.target.value,
                    }))
                  }
                  className="radio radio-warning mr-3"
                  defaultChecked
                />
                Visited
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  name="interaction"
                  id="short"
                  value="short"
                  onChange={(e) =>
                    setCommentData((prev) => ({
                      ...prev,
                      interactionType: e.target.value,
                    }))
                  }
                  className="radio radio-warning mr-3"
                />
                Short Stay
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  name="interaction"
                  id="long"
                  value="long"
                  onChange={(e) =>
                    setCommentData((prev) => ({
                      ...prev,
                      interactionType: e.target.value,
                    }))
                  }
                  className="radio radio-warning mr-3"
                />
                Long Stay
              </label>
            </div>

            {/* Rating */}
            <h1 className="font-bold">Rating</h1>
            <div className="rating mt-3 mb-3">
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
                  className="mask mask-star bg-yellow-400"
                />
              ))}
            </div>

            {/* Comment */}
            <div>
              <h1 className="font-bold">Comment:</h1>
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
                className="textarea textarea-warning w-[500px] mt-3 mb-3"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex justify-center mb-3">
              <button
                type="submit"
                className="btn btn-warning font-bold text-white"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </center>
      <div>
        <h1 className="font-bold text-lg mb-5 border-b-2 p-5 border-yellow-400">
          See What People Are Saying
        </h1>

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 my-2 shadow-sm border-yellow-400"
            >
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={comment.profilePic || "/Images/Logo/profile.png"}
                  className="w-10 h-10 rounded-full"
                  alt="Profile"
                />
                <div>
                  <div className="font-semibold">{comment.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mb-1">
                <span className="font-semibold">Interaction Type:</span>{" "}
                {comment.interactionType}
              </div>

              <div className="mb-1">
                <span className="font-semibold">Rating:</span>{" "}
                {"★".repeat(comment.rating) + "☆".repeat(5 - comment.rating)}
              </div>

              <div>
                <span className="font-semibold">Comment:</span>{" "}
                {comment.comment}
              </div>
            </div>
          ))
        ) : (
          <div className="font-bold m-5 p-5 border-2 border-yellow-400 rounded-2xl shadow-md text-center text-2xl">
            No comments yet.
            <i className="fa-solid fa-face-frown-open"></i>
            <br />
            Be the first to share your experience!
            <i className="fa-solid fa-face-grin-hearts"></i>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReviewPage;
