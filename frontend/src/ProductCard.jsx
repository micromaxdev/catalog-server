import { useState } from "react";

const ProductCard = ({
  part_number,
  long_description,
  category,
  image_path,
  datasheet_path,
  last_modified,
  data_hash,
}) => {
  const [imageError, setImageError] = useState(false);

  // Format the last_modified date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div
      className="product-card"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginBottom: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "200px",
          minWidth: "200px",
          height: "200px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        {image_path && !imageError ? (
          <img
            src={image_path}
            alt={part_number}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "#e0e0e0",
              color: "#666",
            }}
          >
            No Image
          </div>
        )}
      </div>

      <div
        style={{
          padding: "1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.25rem",
              color: "#333",
            }}
          >
            Part Number: {part_number}
          </h3>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#666",
              fontSize: "1rem",
            }}
          >
            Description: {long_description}
          </p>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#888",
              fontSize: "0.875rem",
            }}
          >
            Category: {category || "N/A"}
          </p>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#888",
              fontSize: "0.875rem",
            }}
          >
            Last Modified: {formatDate(last_modified)}
          </p>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#888",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            Data Hash: {data_hash}
          </p>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {datasheet_path && (
            <a
              href={datasheet_path}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#0C75BC",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              View Datasheet
            </a>
          )}
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0C75BC",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
