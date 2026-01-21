import { createPortal } from "react-dom";
import { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({
  model_number,
  description,
  category,
  brand,
  image_path,
  datasheet_path,
  last_modified,
  data_hash,
  viewMode = "list",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Zoom popup state
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Parse multiple images from image_path
  const parseImages = (imagePath) => {
    if (!imagePath) return [];

    if (Array.isArray(imagePath)) return imagePath;

    try {
      const parsed = JSON.parse(imagePath);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }

    if (typeof imagePath === "string" && imagePath.includes(",")) {
      return imagePath
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }

    if (typeof imagePath === "string" && imagePath.trim()) {
      return [imagePath.trim()];
    }

    return [];
  };

  const images = parseImages(image_path);
  const currentImage = images[currentImageIndex] || null;
  const hasMultipleImages = images.length > 1;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    console.log(`Failed to load image: ${currentImage}`);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index) => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex(index);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const hasValidImage = currentImage && isValidUrl(currentImage);
  const hasValidDatasheet = datasheet_path && isValidUrl(datasheet_path);

  // ✅ Zoom handlers
  const handleMouseEnter = () => {
    console.log("🟢 Mouse entered image");
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    console.log("🔴 Mouse left image");
    setShowZoom(false);
  };

  const handleMouseMove = (e) => {
    console.log("🟡 Mouse moving on image", e.clientX, e.clientY);
    setZoomPosition({
      x: e.clientX + 20,
      y: e.clientY + 20,
    });
  };


  return (
    <div className={`product-card ${viewMode}`}>
      <div className="product-image-container">
        {hasValidImage && !imageError ? (
          <>
            {imageLoading && (
              <div className="product-image-loading">
                <div className="loading-spinner"></div>
                <span>Loading image...</span>
              </div>
            )}

            <div
              className="image-wrapper"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={{ border: "2px solid red" }}
            >
              <img
                src={currentImage}
                alt={`${model_number} - ${description}`}
                className={`product-image ${imageLoading ? "loading" : ""}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: imageLoading ? "none" : "block" }}
                crossOrigin="anonymous"
              />
            </div>

            {showZoom && hasValidImage &&
              createPortal(
                <div
                  className="image-zoom-popup"
                  style={{
                    top: zoomPosition.y,
                    left: zoomPosition.x,
                  }}
                >
                  <img src={currentImage} alt="Zoom preview" />
                </div>,
                document.body
              )
            }


            {hasMultipleImages && !imageLoading && (
              <>
                <button className="image-nav-btn prev" onClick={handlePrevImage}>
                  ‹
                </button>
                <button className="image-nav-btn next" onClick={handleNextImage}>
                  ›
                </button>

                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${index === currentImageIndex ? "active" : ""
                        }`}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </div>

                <div className="image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <div className="placeholder-icon">📦</div>
            <span>No Image Available</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-model">
            {description || "No description available"}
          </h3>
          <p className="product-description">Model: {model_number}</p>
        </div>

        <div className="product-specs">
          <div className="spec-item">
            <span className="spec-label">Brand</span>
            <span className="spec-value spec-category">
              {brand || "Unknown"}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Last Updated</span>
            <span className="spec-value spec-date">
              {formatDate(last_modified)}
            </span>
          </div>
        </div>

        <div className="product-actions">
          {hasValidDatasheet ? (
            <a
              href={datasheet_path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Download Datasheet
            </a>
          ) : (
            <div className="btn-primary btn-disabled">No Datasheet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
