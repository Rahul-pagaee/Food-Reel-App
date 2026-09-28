import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllFoods } from "../auth.api";
import ReelItem from "../components/ReelItem.jsx";
import "../styles/Home.css";

// Fallback sample reels with sound
const SAMPLE_FOODS = [
  {
    _id: "sample-1",
    name: "Crispy Sizzling Cheesy Burger",
    description:
      "Juicy grilled patty topped with melting cheddar cheese, caramelized onions, crispy lettuce and secret chipotle sauce on a toasted brioche bun.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    foodPartner: {
      name: "Burger Craft & Co.",
      contactName: "Chef Rohit",
      phone: "+91 98765 43210",
      address: "12, High Street, Near City Mall, Bhopal",
    },
  },
  {
    _id: "sample-2",
    name: "Wood-Fired Margherita Pizza",
    description:
      "Authentic Italian crust with San Marzano tomato sauce, fresh buffalo mozzarella, aromatic basil leaves and a drizzle of extra virgin olive oil.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    foodPartner: {
      name: "La Bella Napoli",
      contactName: "Marco Rossi",
      phone: "+91 91234 56789",
      address: "Shop 4, Food Street, Arera Colony, Bhopal",
    },
  },
  {
    _id: "sample-3",
    name: "Chef's Special Sizzler & Fries",
    description:
      "Crispy salted potato fries served piping hot with creamy garlic dip, spicy peri-peri seasoning, cheese pull and tangy ketchup.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    foodPartner: {
      name: "The Fry Kitchen",
      contactName: "Aman Verma",
      phone: "+91 99887 76655",
      address: "Booth 8, Sector C, Indrapuri, Bhopal",
    },
  },
];

function Home() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFeed, setActiveFeed] = useState("home");
  const [savedFoodIds, setSavedFoodIds] = useState(new Set());

  const toggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleSavedFood = (foodId) => {
    setSavedFoodIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(foodId)) {
        nextIds.delete(foodId);
      } else {
        nextIds.add(foodId);
      }
      return nextIds;
    });
  };

  useEffect(() => {
    const hasTokenCookie = () =>
      document.cookie.split("; ").some((cookie) => cookie.startsWith("token="));

    if (!hasTokenCookie()) {
      navigate("/user/login", { replace: true });
      return;
    }

    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await getAllFoods();
        if (data?.foodItems && data.foodItems.length > 0) {
          setFoods(data.foodItems);
        } else {
          // If database has no videos yet, fallback to sample reels with audio
          setFoods(SAMPLE_FOODS);
        }
      } catch (error) {
        console.log("Using sample reels with sound:", error.message);
        setFoods(SAMPLE_FOODS);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [navigate]);

  const visibleFoods =
    activeFeed === "saved"
      ? foods.filter((food, index) =>
          savedFoodIds.has(food._id || food.video || food.name || index),
        )
      : foods;

  return (
    <div className="reels-wrapper">
      <div className="reels-feed">
        {/* Top Header Overlay */}
        <header className="reel-top-bar">
          <Link to="/" className="reel-brand">
            <span className="reel-brand-badge">F</span>
            <span>FoodView</span>
          </Link>

          <div className="reel-top-actions">
            <Link to="/user/login" className="reel-auth-btn">
              Login
            </Link>
          </div>
        </header>

        {/* Reels Scroll Area */}
        <div className="reels-scroll-area">
          {loading ? (
            <div className="reels-empty-state">
              <div className="loading-spinner" />
              <p>Loading tasty reels...</p>
            </div>
          ) : visibleFoods.length === 0 ? (
            <div className="reels-empty-state">
              <h3>
                {activeFeed === "saved"
                  ? "No Saved Reels Yet"
                  : "No Food Videos Yet"}
              </h3>
              <p>
                {activeFeed === "saved"
                  ? "Save food reels to find them here."
                  : "Food partners haven't uploaded any videos."}
              </p>
              <Link
                to={activeFeed === "saved" ? "/" : "/partner/login"}
                className="reel-visit-btn"
                onClick={(event) => {
                  if (activeFeed === "saved") {
                    event.preventDefault();
                    setActiveFeed("home");
                  }
                }}
                style={{ width: "auto" }}
              >
                {activeFeed === "saved"
                  ? "Back to Home"
                  : "Upload Food as Partner"}
              </Link>
            </div>
          ) : (
            visibleFoods.map((food, index) => (
              <ReelItem
                key={food._id || index}
                food={food}
                isMuted={isMuted}
                toggleSound={toggleSound}
                isSaved={savedFoodIds.has(
                  food._id || food.video || food.name || index,
                )}
                onToggleSave={() =>
                  toggleSavedFood(food._id || food.video || food.name || index)
                }
              />
            ))
          )}
        </div>

        {/* Permanently Fixed Bottom Navigation Bar */}
        <nav className="reel-bottom-nav" aria-label="Feed navigation">
          <Link to="/" className="reel-bottom-nav-btn active">
            <span aria-hidden="true">⌂</span>
            <small>Home</small>
          </Link>
          <Link to="/saved" className="reel-bottom-nav-btn">
            <span aria-hidden="true">⭐</span>
            <small>Saved</small>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Home;
