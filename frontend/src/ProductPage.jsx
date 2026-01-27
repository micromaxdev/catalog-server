import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Download } from "@mui/icons-material";
import "./ProductPage.css";

const ProductPage = () => {
    const { model_number } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products?model_number=${model_number}`);
                const data = await response.json();

                if (data.length > 0) {
                    const productData = data[0];
                    setProduct(productData);

                    // Fetch related products (same category)
                    if (productData.category) {
                        const relatedResponse = await fetch(`/api/products?category=${productData.category}`);
                        const relatedData = await relatedResponse.json();
                        const filtered = relatedData
                            .filter(p => p.model_number !== model_number)
                            .slice(0, 4);
                        setRelatedProducts(filtered);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [model_number]);

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
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

    if (loading) {
        return (
            <div className="product-page-loading">
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page-error">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <button onClick={() => navigate("/")} className="btn-primary">
                    <ArrowBack /> Back to Catalog
                </button>
            </div>
        );
    }

    const images = parseImages(product.image_path);
    const currentImage = images[currentImageIndex] || null;
    const hasValidImage = currentImage && isValidUrl(currentImage);
    const hasValidDatasheet = product.datasheet_path && isValidUrl(product.datasheet_path);

    return (
        <div className="product-page">
            {/* Header */}
            <div className="product-page-header">
                <button onClick={() => navigate("/")} className="back-btn">
                    <ArrowBack /> Back to Catalog
                </button>
            </div>

            {/* Main Content */}
            <div className="product-page-content">
                {/* Left Column - Images */}
                <div className="product-page-gallery">
                    <div className="gallery-main">
                        {hasValidImage && !imageError ? (
                            <>
                                {imageLoading && (
                                    <div className="gallery-loading">
                                        <div className="loading-spinner"></div>
                                    </div>
                                )}
                                <img
                                    src={currentImage}
                                    alt={product.description}
                                    className={`gallery-main-image ${imageLoading ? "loading" : ""}`}
                                    onLoad={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading(false);
                                    }}
                                    style={{ display: imageLoading ? "none" : "block" }}
                                />
                            </>
                        ) : (
                            <div className="gallery-placeholder">
                                <div className="placeholder-icon">📦</div>
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="gallery-thumbnails">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setImageLoading(true);
                                        setImageError(false);
                                    }}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="product-page-details">
                    <div className="details-header">
                        <h1>{product.description || "No description available"}</h1>
                        <p className="model-number">Model: {product.model_number}</p>
                    </div>

                    <div className="details-section">
                        <h3>Product Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Brand</span>
                                <span className="info-value">{product.brand || "Unknown"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Category</span>
                                <span className="info-value">{product.category || "General"}</span>
                            </div>
                            {product.subcategory && (
                                <div className="info-item">
                                    <span className="info-label">Subcategory</span>
                                    <span className="info-value">{product.subcategory}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">Last Updated</span>
                                <span className="info-value">{formatDate(product.last_modified)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="details-section">
                        <h3>Downloads</h3>
                        {hasValidDatasheet ? (
                            <a
                                href={product.datasheet_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-btn"
                            >
                                <Download /> Download Datasheet
                            </a>
                        ) : (
                            <p className="no-datasheet">No datasheet available for this product.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Related Products</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map((relatedProduct) => {
                            const relatedImages = parseImages(relatedProduct.image_path);
                            const relatedImage = relatedImages[0];
                            const hasRelatedImage = relatedImage && isValidUrl(relatedImage);

                            return (
                                <div
                                    key={relatedProduct.model_number}
                                    className="related-product-card"
                                    onClick={() => navigate(`/product/${relatedProduct.model_number}`)}
                                >
                                    <div className="related-product-image">
                                        {hasRelatedImage ? (
                                            <img src={relatedImage} alt={relatedProduct.description} />
                                        ) : (
                                            <div className="related-placeholder">
                                                <span>📦</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="related-product-info">
                                        <h4>{relatedProduct.description}</h4>
                                        <p>{relatedProduct.model_number}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;