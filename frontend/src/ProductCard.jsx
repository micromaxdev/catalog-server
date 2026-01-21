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

  // Parse multiple images from image_path
  const parseImages = (imagePath) => {
    if (!imagePath) return [];
    
    // If it's already an array, return it
    if (Array.isArray(imagePath)) return imagePath;
    
    // Try parsing as JSON array
    try {
      const parsed = JSON.parse(imagePath);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not JSON, continue to other formats
    }
    
    // Try comma-separated string
    if (typeof imagePath === 'string' && imagePath.includes(',')) {
      return imagePath.split(',').map(url => url.trim()).filter(Boolean);
    }
    
    // Single image as string
    if (typeof imagePath === 'string' && imagePath.trim()) {
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

  const formatHash = (hash) => {
    if (!hash) return "N/A";
    return hash.substring(0, 8) + "...";
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
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex(index);
  };

  const getFileExtension = (path) => {
    if (!path) return "";
    const extension = path.split(".").pop();
    return extension ? extension.toUpperCase() : "";
  };

  const getFileName = (path) => {
    if (!path) return "File";
    const fileName = path.split("/").pop();
    return fileName || "File";
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if we have valid URLs
  const hasValidImage = currentImage && isValidUrl(currentImage);
  const hasValidDatasheet = datasheet_path && isValidUrl(datasheet_path);

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
            <div className="image-wrapper">
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
            
            {hasMultipleImages && !imageLoading && (
              <>
                <button 
                  className="image-nav-btn prev" 
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button 
                  className="image-nav-btn next" 
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to image ${index + 1}`}
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
            {image_path && !isValidUrl(image_path) && (
              <small>Invalid URL format</small>
            )}
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
              className={`btn-primary datasheet-${getFileExtension(
                datasheet_path
              ).toLowerCase()}`}
              aria-label={`Download datasheet for ${model_number}`}
            >
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Download Datasheet
            </a>
          ) : (
            <div className="btn-primary btn-disabled">
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              No Datasheet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;