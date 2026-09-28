import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateFood.css";

function CreateFood() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // 1. Video Selection & Instant Preview Handler
  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, WebM, MOV, etc.)");
      return;
    }

    setError("");
    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    console.log("Selected Video File:", file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleRemoveVideo = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  // 3. Form Submit - Send Data to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter a food dish name.");
      return;
    }

    if (!videoFile) {
      setError("Please upload a video file for your food reel.");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Create Multipart FormData
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("video", videoFile);

      console.log("Sending Food Data:", {
        name: name.trim(),
        description: description.trim(),
        videoFileName: videoFile.name,
      });

      // API Call to Backend with live upload progress tracking
      const response = await axios.post(
        "http://localhost:3000/api/food",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      console.log("Food Created Response:", response.data);
      setUploadProgress(100);
      setSuccess("🎉 Food reel uploaded successfully!");

      // Reset Form & Redirect to Home
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Error creating food:", err);
      const message =
        err.response?.data?.message ||
        "Failed to upload food reel. Please make sure you are logged in as a partner.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-food-page">
      {/* Uploading Loading Modal Overlay */}
      {loading && (
        <div className="upload-modal-backdrop" role="dialog" aria-modal="true">
          <div className="upload-modal-box">
            <div className="upload-radar-wrapper">
              <div className="upload-radar-pulse"></div>
              <div className="upload-radar-ring"></div>
              <span className="upload-radar-icon">🚀</span>
            </div>

            <div className="upload-modal-texts">
              <h2 className="upload-modal-title">
                {uploadProgress < 100 ? "Uploading Food Reel..." : "Processing Video..."}
              </h2>
              <p className="upload-modal-subtitle">
                {uploadProgress < 100
                  ? "Sending your video to cloud storage..."
                  : "Optimizing video quality. Almost done!"}
              </p>
            </div>

            <div className="upload-progress-container">
              <div className="upload-progress-info">
                <span>Upload Progress</span>
                <span className="upload-progress-percent">{uploadProgress}%</span>
              </div>
              <div className="upload-progress-track">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>

            <p className="upload-hint-banner">
              Please keep this page open until the upload completes.
            </p>
          </div>
        </div>
      )}

      <div className="create-food-card">
        {/* Top Navigation */}
        <div className="create-food-nav">
          <Link to="/" className="create-food-back-btn">
            <span>←</span> Back to Feed
          </Link>
          <span className="create-food-badge">🍳 Partner Kitchen</span>
        </div>

        {/* Page Header */}
        <header className="create-food-header">
          <h1 className="create-food-title">Upload Food Reel</h1>
          <p className="create-food-subtitle">
            Upload your signature recipe video and share it with food lovers.
          </p>
        </header>

        {/* Status Alerts */}
        {error && (
          <div className="create-food-alert create-food-alert--error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="create-food-alert create-food-alert--success" role="status">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Creation Form */}
        <form className="create-food-form" onSubmit={handleSubmit}>
          {/* 1. Video File Input */}
          <div className="create-food-group">
            <div className="create-food-label">
              <span>Food Video Reel</span>
              <span className="label-required">* Required</span>
            </div>

            {videoPreview ? (
              <div className="video-preview-box">
                <video
                  src={videoPreview}
                  className="video-preview-player"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
                <button
                  type="button"
                  className="video-remove-btn"
                  onClick={handleRemoveVideo}
                  aria-label="Remove video"
                  title="Remove video"
                >
                  ✕
                </button>
                <span className="video-badge-preview">📹 Live Preview</span>
              </div>
            ) : (
              <div
                className={`video-dropzone ${
                  isDragging ? "video-dropzone--active" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="video"
                  accept="video/*"
                  className="video-file-input"
                  onChange={handleInputChange}
                  aria-label="Upload food video reel"
                  required
                />
                <div className="video-dropzone-content">
                  <div className="upload-icon-circle">📹</div>
                  <p className="upload-main-text">
                    <span>Click to browse</span> or drag & drop video
                  </p>
                  <p className="upload-hint-text">
                    Supports MP4, WebM, MOV (Vertical 9:16 reels recommended)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Food Name Input */}
          <div className="create-food-group">
            <label htmlFor="food-name" className="create-food-label">
              <span>Dish / Food Name</span>
              <span className="label-required">* Required</span>
            </label>
            <input
              id="food-name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Crispy Sizzling Cheesy Burger"
              className="create-food-input"
              maxLength={80}
              required
            />
          </div>

          {/* 3. Description Input */}
          <div className="create-food-group">
            <div className="create-food-label">
              <label htmlFor="food-description">Dish Description</label>
              <span className="label-counter">{description.length}/250</span>
            </div>
            <textarea
              id="food-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your dish, special flavors, melting cheese, aromatic spices, or chef's secret recipe..."
              className="create-food-textarea"
              rows={4}
              maxLength={250}
            />
          </div>

          {/* Actions */}
          <div className="create-food-actions">
            <button
              type="submit"
              className="create-food-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Uploading to Cloud...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Publish Food Reel</span>
                </>
              )}
            </button>

            <Link to="/" className="create-food-cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateFood;
