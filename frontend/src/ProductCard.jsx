import { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({
  model_number,
  description,
  category,
  image_path,
  datasheet_path,
  last_modified,
  data_hash,
}) => {
  const [imageError, setImageError] = useState(false);

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

  const getStatusColor = () => {
    // This could be based on actual product data
    return "available"; // available, out-of-stock, discontinued
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className={`product-status ${getStatusColor()}`}>Available</div>
        {image_path && !imageError ? (
          <img
            src={image_path}
            alt={`${model_number} - ${description}`}
            className="product-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-placeholder">No Image Available</div>
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
            <span className="spec-label">Category</span>
            <span className="spec-value spec-category">
              {category || "General"}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Last Updated</span>
            <span className="spec-value spec-date">
              {formatDate(last_modified)}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Product ID</span>
            <span className="spec-value spec-hash">
              {formatHash(data_hash)}
            </span>
          </div>
        </div>

        <div className="product-actions">
          {datasheet_path && (
            <a
              href={datasheet_path}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              aria-label={`Download datasheet for ${model_number}`}
            >
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Datasheet
            </a>
          )}
          <button
            className="btn-secondary"
            aria-label={`View details for ${model_number}`}
          >
            <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
