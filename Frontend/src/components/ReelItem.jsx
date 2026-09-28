import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ReelItem({
  food,
  isMuted,
  toggleSound,
  isSaved = false,
  onToggleSave,
  onToggleLike,
}) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  const [isLiked, setIsLiked] = useState(Boolean(food.isLiked));

  const [likeCount, setLikeCount] = useState(() =>
    Number(food.likeCount || food.likes || 0),
  );
  const [saveCount, setSaveCount] = useState(() =>
    Number(food.saveCount || food.saves || 0),
  );

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Sync DOM muted and volume property directly on video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1.0;
    }
  }, [isMuted]);

  // IntersectionObserver: Play active reel (>= 60%), Pause off-screen reels
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = isMuted;
            video.play().catch(() => {
              // Fallback to muted if browser blocks unmuted autoplay
              video.muted = true;
              video.play().catch(() => {});
            });
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [isMuted]);

  const submitComment = (event) => {
    event.preventDefault();
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    setComments((currentComments) => [...currentComments, trimmedComment]);
    setComment("");
  };

  const likeVideo = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: item._id },
        { withCredentials: true },
      );
      if (response.data) {
        const nextLiked = response.data.isLiked;
        setIsLiked(nextLiked);
        if (response.data.likeCount !== undefined) {
          setLikeCount(response.data.likeCount);
        } else {
          setLikeCount((count) => Math.max(0, count + (isLiked ? -1 : 1)));
        }
        if (onToggleLike) {
          onToggleLike(item._id, nextLiked);
        }
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleSaveVideo = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true },
      );
      if (response.data) {
        const nextSaved = response.data.isSaved;
        if (response.data.saveCount !== undefined) {
          setSaveCount(response.data.saveCount);
        } else {
          setSaveCount((count) => Math.max(0, count + (isSaved ? -1 : 1)));
        }
        if (onToggleSave) {
          onToggleSave(item._id || food._id, nextSaved);
        }
      }
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  return (
    <div className="reel-card" ref={cardRef}>
      {/* Background Video */}
      <video
        ref={videoRef}
        src={food.video}
        className="reel-video"
        loop
        playsInline
        preload="auto"
        onClick={toggleSound}
      />

      {/* Floating Mute/Unmute Button */}
      <button
        className={`reel-mute-btn ${!isMuted ? "unmuted" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <span>{isMuted ? "🔇" : "🔊"}</span>
      </button>

      {/* Right Action Rail (Like, Comment, Save) */}
      <div className="reel-action-rail" aria-label="Food actions">
        {/* Like Button */}
        <button
          onClick={() => likeVideo(food)}
          type="button"
          className={`reel-action-btn ${isLiked ? "active is-liked" : ""}`}
          aria-label={isLiked ? "Unlike food" : "Like food"}
          aria-pressed={isLiked}
        >
          <span className="reel-action-icon">{isLiked ? "❤️" : "🤍"}</span>
          <small className="reel-action-count">{likeCount}</small>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          className={`reel-action-btn ${showComments ? "active" : ""}`}
          onClick={() => setShowComments((visible) => !visible)}
          aria-label="View comments"
          aria-expanded={showComments}
        >
          <span className="reel-action-icon">💬</span>
          <small className="reel-action-count">{comments.length}</small>
        </button>

        {/* Save Button */}
        <button
          type="button"
          className={`reel-action-btn ${isSaved ? "active is-saved" : ""}`}
          onClick={() => handleSaveVideo(food)}
          aria-label={isSaved ? "Remove from saved" : "Save food"}
          aria-pressed={isSaved}
        >
          <span className="reel-action-icon">{isSaved ? "⭐" : "☆"}</span>
          <small className="reel-action-count">{saveCount}</small>
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div
          className="reel-comments-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="reel-comments-heading">
            <strong>Comments</strong>
            <button
              type="button"
              className="reel-comments-close"
              onClick={() => setShowComments(false)}
              aria-label="Close comments"
            >
              ×
            </button>
          </div>
          <div className="reel-comments-list">
            {comments.length === 0 ? (
              <p className="reel-comments-empty">
                Be the first to share your thoughts.
              </p>
            ) : (
              comments.map((item, index) => (
                <p key={`${item}-${index}`} className="reel-comment">
                  {item}
                </p>
              ))
            )}
          </div>
          <form className="reel-comment-form" onSubmit={submitComment}>
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add a comment..."
              aria-label="Add a comment"
              maxLength={200}
            />
            <button type="submit" aria-label="Post comment">
              Post
            </button>
          </form>
        </div>
      )}

      {/* Bottom Content Overlay */}
      <div className="reel-bottom-overlay">
        {food.foodPartner?.name && (
          <div className="reel-partner-tag">
            <span>🏪</span>
            <span>{food.foodPartner.name}</span>
          </div>
        )}

        <h2 className="reel-food-title">{food.name}</h2>

        {/* Truncated Description */}
        {food.description && (
          <p className="reel-description" title={food.description}>
            {food.description}
          </p>
        )}

        {/* Visit Store Button (Direct Link to Partner Profile) */}
        <Link
          to={`/food-partner/profile/${food.foodPartner?._id || ""}`}
          className="reel-visit-btn"
          aria-label="Visit store"
          onClick={(e) => e.stopPropagation()}
        >
          Visit Store
        </Link>
      </div>
    </div>
  );
}

export default ReelItem;
