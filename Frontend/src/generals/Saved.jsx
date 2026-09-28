import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReelItem from "../components/ReelItem.jsx";
import "../styles/Home.css";

function Saved() {
  const navigate = useNavigate();
  const [savedFoods, setSavedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  // When user un-saves a food from the Saved page, dynamically remove it from the list
  const handleToggleSave = (foodId, isSaved) => {
    if (!isSaved) {
      setSavedFoods((current) =>
        current.filter((item) => (item._id || item.video) !== foodId),
      );
    }
  };

  useEffect(() => {
    const hasTokenCookie = () =>
      document.cookie.split("; ").some((cookie) => cookie.startsWith("token="));

    if (!hasTokenCookie()) {
      navigate("/user/login", { replace: true });
      return;
    }

    const fetchSavedFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/food/save",
          {
            withCredentials: true,
          },
        );

        if (response.data?.savedFoods) {
          // Extract the populated food object from each saved document
          const foodsList = response.data.savedFoods
            .map((item) => {
              if (item.food && typeof item.food === "object") {
                return {
                  ...item.food,
                  isSaved: true,
                };
              }
              return null;
            })
            .filter(Boolean);

          setSavedFoods(foodsList);
        } else {
          setSavedFoods([]);
        }
      } catch (error) {
        console.error("Error fetching saved foods:", error);
        setSavedFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFoods();
  }, [navigate]);

  return (
    <div className="reels-wrapper">
      <div className="reels-feed">
        {/* Top Header Overlay */}
        <header className="reel-top-bar">
          <Link to="/" className="reel-brand">
            <span className="reel-brand-badge">⭐</span>
            <span>Saved Reels</span>
          </Link>

          <div className="reel-top-actions">
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: "700",
                color: "#4ade80",
                background: "rgba(45, 156, 109, 0.2)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                padding: "4px 10px",
                borderRadius: "999px",
              }}
            >
              {savedFoods.length} Saved
            </span>
          </div>
        </header>

        {/* Saved Reels Scroll Area */}
        <div className="reels-scroll-area">
          {loading ? (
            <div className="reels-empty-state">
              <div className="loading-spinner" />
              <p>Loading your saved reels...</p>
            </div>
          ) : savedFoods.length === 0 ? (
            <div className="reels-empty-state">
              <span style={{ fontSize: "3rem" }}>⭐</span>
              <h3>No Saved Food Reels Yet</h3>
              <p>
                Bookmark your favorite food videos from the home feed to watch
                them anytime.
              </p>
              <Link to="/" className="reel-visit-btn" style={{ width: "auto" }}>
                Explore Food Reels
              </Link>
            </div>
          ) : (
            savedFoods.map((food, index) => (
              <ReelItem
                key={food._id || index}
                food={food}
                isMuted={isMuted}
                toggleSound={toggleSound}
                isSaved={true}
                onToggleSave={handleToggleSave}
              />
            ))
          )}
        </div>

        {/* Permanently Fixed Bottom Navigation Bar */}
        <nav className="reel-bottom-nav" aria-label="Feed navigation">
          <Link to="/" className="reel-bottom-nav-btn">
            <span aria-hidden="true">⌂</span>
            <small>Home</small>
          </Link>
          <Link to="/saved" className="reel-bottom-nav-btn active">
            <span aria-hidden="true">⭐</span>
            <small>Saved</small>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Saved;
