import "../styles/Profile.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const { id } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/api/food-partner/profile/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfileData(response.data.partner);
        setVideos(response.data.foods || []);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id]);

  return (
    <main className="partner-profile">
      <section
        className="partner-profile__card"
        aria-label="Food partner profile"
      >
        {/* Top Navigation */}
        <div className="partner-profile__nav">
          <Link to="/" className="partner-profile__back">
            <span>←</span> Back to Reels
          </Link>
          <span className="partner-profile__badge">✓ Verified Partner</span>
        </div>

        {/* Main Header */}
        <header className="partner-profile__header">
          <div className="partner-profile__identity">
            <div className="partner-profile__avatar" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1530554764233-e79e16c91d08?w=400&h=400&fit=crop&crop=center&q=80"
                alt="Partner Avatar"
                className="partner-profile__avatar-img"
              />
            </div>
            <div className="partner-profile__details">
              <h1>{profileData?.name || "Food Partner"}</h1>
              {profileData?.contactName && (
                <p className="partner-profile__manager">
                  Managed by <strong>{profileData.contactName}</strong>
                </p>
              )}
              <div className="partner-profile__meta-tags">
                {profileData?.address && (
                  <span className="partner-profile__location">
                    📍 {profileData.address}
                  </span>
                )}
                {profileData?.phone && (
                  <span className="partner-profile__phone">
                    📞 {profileData.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link to="/create-food" className="partner-profile__action-btn">
            + Upload Food
          </Link>
        </header>

        {/* Stats Grid */}
        <div
          className="partner-profile__stats"
          aria-label="Business statistics"
        >
          <div className="stat-card">
            <strong>{videos.length}</strong>
            <span>Total Food Videos</span>
          </div>
          <div className="stat-card">
            <strong>15.2K</strong>
            <span>Foodies Reached</span>
          </div>
          <div className="stat-card">
            <strong>4.9 ★</strong>
            <span>Customer Rating</span>
          </div>
        </div>

        {/* Video Grid Section */}
        <div className="partner-profile__content">
          <div className="partner-profile__section-heading">
            <div>
              <p className="partner-profile__eyebrow">From our kitchen</p>
              <h2>Food Videos</h2>
            </div>
            <span className="partner-profile__video-count">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {videos.length === 0 ? (
            <div className="partner-profile__empty">
              <p>No food videos uploaded yet.</p>
              <Link to="/create-food" className="partner-profile__empty-btn">
                + Upload First Video
              </Link>
            </div>
          ) : (
            <div className="partner-profile__video-grid">
              {videos.map((video) => (
                <article className="partner-profile__video" key={video._id}>
                  <video
                    src={video.video}
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={video.name}
                    onMouseEnter={(e) => e.target.play().catch(() => {})}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                  <div className="partner-profile__video-info">
                    <span className="partner-profile__video-title">
                      {video.name}
                    </span>
                    {video.description && (
                      <span className="partner-profile__video-desc">
                        {video.description}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Profile;
