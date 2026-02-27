import { createPortal } from "react-dom";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
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
  price,
  is_quote_only,
  viewMode = "list",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const parseImages = (imagePath) => {
    if (!imagePath) return [];
    if (Array.isArray(imagePath)) return imagePath;
    try {
      const parsed = JSON.parse(imagePath);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
    if (typeof imagePath === "string" && imagePath.includes(",")) {
      return imagePath.split(",").map((url) => url.trim()).filter(Boolean);
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

  const handleImageLoad = () => setImageLoading(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex(index);
  };

  const handleMouseEnter = () => {
    if (hasValidImage && !imageLoading && !imageError) setShowZoom(true);
  };

  const handleMouseLeave = () => setShowZoom(false);

  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current || !showZoom) return;

    const image = imageRef.current;
    const imageRect = image.getBoundingClientRect();
    const xPercent = ((e.clientX - imageRect.left) / imageRect.width) * 100;
    const yPercent = ((e.clientY - imageRect.top) / imageRect.height) * 100;

    const containerRect = containerRef.current.getBoundingClientRect();
    setLensPosition({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });

    const popupX = e.clientX + 20;
    const popupY = e.clientY - 200;
    setZoomPosition({
      x: popupX + 420 > window.innerWidth ? e.clientX - 440 : popupX,
      y: popupY < 0 ? 20 : popupY,
      xPercent,
      yPercent,
    });
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

  return (
    <Link to={`/product/${model_number}`} className={`product-card ${viewMode}`}>
      <div
        className="product-image-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {hasValidImage && !imageError ? (
          <>
            {imageLoading && (
              <div className="product-image-loading">
                <div className="loading-spinner"></div>
                <span>Loading image...</span>
              </div>
            )}

            <div className="image-wrapper">
              <img
                ref={imageRef}
                src={currentImage}
                alt={`${model_number} - ${description}`}
                className={`product-image ${imageLoading ? "loading" : ""}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: imageLoading ? "none" : "block" }}
                crossOrigin="anonymous"
              />
              {showZoom && !imageLoading && (
                <div
                  className="zoom-lens"
                  style={{
                    left: `${lensPosition.x - 50}px`,
                    top: `${lensPosition.y - 50}px`,
                  }}
                />
              )}
            </div>

            {showZoom &&
              !imageLoading &&
              createPortal(
                <div
                  className="image-zoom-popup"
                  style={{ top: `${zoomPosition.y}px`, left: `${zoomPosition.x}px` }}
                >
                  <div
                    className="zoom-image-wrapper"
                    style={{
                      backgroundImage: `url(${currentImage})`,
                      backgroundSize: "250%",
                      backgroundPosition: `${zoomPosition.xPercent}% ${zoomPosition.yPercent}%`,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </div>,
                document.body
              )}

            {hasMultipleImages && !imageLoading && (
              <>
                <button className="image-nav-btn prev" onClick={handlePrevImage}>‹</button>
                <button className="image-nav-btn next" onClick={handleNextImage}>›</button>
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${index === currentImageIndex ? "active" : ""}`}
                      onClick={(e) => handleDotClick(e, index)}
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
          <h3 className="product-model">{description || "No description available"}</h3>
          <p className="product-description">Model: {model_number}</p>
        </div>

        <div className="product-specs">
          <div className="spec-item">
            <span className="spec-label">Brand</span>
            <span className="spec-value spec-category">{brand || "Unknown"}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Last Updated</span>
            <span className="spec-value spec-date">{formatDate(last_modified)}</span>
          </div>
        </div>

        <div className="product-actions">
          {is_quote_only ? (
            <div
              className="btn-primary btn-contact-sales"
              onClick={(e) => e.preventDefault()}
            >
              Contact Sales
            </div>
          ) : (
            <button
              className={`btn-primary ${added ? "btn-added" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({ model_number, description, category, brand, image_path, price });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;