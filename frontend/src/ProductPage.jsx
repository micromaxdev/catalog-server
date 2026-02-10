import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, Download, Description, PictureAsPdf, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import "./ProductPage.css";

const ProductPage = () => {
    const { model_number } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [downloadsExpanded, setDownloadsExpanded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products?model_number=${model_number}`);
                const data = await response.json();

                if (data.length > 0) {
                    const productData = data[0];
                    setProduct(productData);

                    try {
                        const docsResponse = await fetch(`/api/products/${model_number}/documents`);
                        const docsData = await docsResponse.json();
                        console.log('📦 Documents API Response:', docsData);
                        setDocuments(docsData.documents_by_type || []);
                    } catch (err) {
                        console.error("Error fetching documents:", err);
                    }

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

    const formatFileSize = (bytes) => {
        if (!bytes) return "N/A";
        const mb = bytes / (1024 * 1024);
        if (mb < 1) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${mb.toFixed(2)} MB`;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Find documents by slug (database-driven)
    const findDocumentBySlug = (slug) => {
        return documents.find(d => d.slug === slug);
    };

    const keyFeatures = findDocumentBySlug('key-features');
    const specifications = findDocumentBySlug('specifications');

    // Debug logging
    console.log('📦 Documents loaded:', documents.length, 'types');
    console.log('✅ Key Features:', keyFeatures ? 'Found' : 'Not found');
    console.log('✅ Specifications:', specifications ? 'Found' : 'Not found');

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

    return (
        <div className="product-page">
            <div className="product-page-header">
                <button onClick={() => navigate("/")} className="back-btn">
                    <ArrowBack /> Back to Catalog
                </button>
            </div>

            <div className="product-page-content">
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

                    <div className="details-header">
                        <h1>{product.description || "No description available"}</h1>
                        <p className="model-number">Model: {product.model_number}</p>
                    </div>
                </div>

                <div className="product-page-details">
                    {/* Key Features Section */}
                    {keyFeatures && keyFeatures.documents && keyFeatures.documents.length > 0 && (
                        <div className="details-section key-features-section">
                            <h3>📋 {keyFeatures.type_name}</h3>
                            {keyFeatures.formatted_sections && keyFeatures.formatted_sections.length > 0 ? (
                                <div className="extracted-content">
                                    {keyFeatures.formatted_sections.map((section, idx) => (
                                        <div key={idx} className="content-section">
                                            {section.title && <h4 className="section-title">{section.title}</h4>}
                                            <div className="section-content">
                                                {section.content.map((paragraph, pIdx) => (
                                                    <p key={pIdx}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="document-list">
                                    {keyFeatures.documents.map((doc) => (
                                        <div key={doc.id} className="document-item">
                                            <div className="document-icon">
                                                <PictureAsPdf />
                                            </div>
                                            <div className="document-info">
                                                <span className="document-name">{doc.file_name}</span>
                                                <span className="document-size">{formatFileSize(doc.file_size)}</span>
                                            </div>
                                            <a
                                                href={doc.s3_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="document-download-btn"
                                            >
                                                <Download />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Specifications Section */}
            {specifications && specifications.documents && specifications.documents.length > 0 && (
                <div className="specifications-full-width">
                    <div className="specifications-container">
                        <h2>📊 {specifications.type_name}</h2>
                        {specifications.formatted_sections && specifications.formatted_sections.length > 0 ? (
                            <div className="specifications-grid">
                                {specifications.formatted_sections.map((section, idx) => (
                                    <div key={idx} className="specification-column">
                                        {section.title && <h3 className="spec-column-title">{section.title}</h3>}
                                        <div className="spec-column-content">
                                            {section.content.map((paragraph, pIdx) => (
                                                <p key={pIdx}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="document-list">
                                {specifications.documents.map((doc) => (
                                    <div key={doc.id} className="document-item">
                                        <div className="document-icon">
                                            <PictureAsPdf />
                                        </div>
                                        <div className="document-info">
                                            <span className="document-name">{doc.file_name}</span>
                                            <span className="document-size">{formatFileSize(doc.file_size)}</span>
                                        </div>
                                        <a
                                            href={doc.s3_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="document-download-btn"
                                        >
                                            <Download />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Downloads Section - Single Accordion */}
            {documents.length > 0 && (
                <div className="downloads-section">
                    <h2>📥 Downloads & Documentation</h2>
                    <Accordion
                        expanded={downloadsExpanded}
                        onChange={() => setDownloadsExpanded(!downloadsExpanded)}
                        className="downloads-single-accordion"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            className="download-accordion-header"
                        >
                            <div className="accordion-header-content">
                                <Description className="accordion-icon" />
                                <div className="accordion-title">
                                    <Typography variant="h6">All Documents</Typography>
                                    <Typography variant="caption" className="document-count">
                                        {documents.reduce((total, docType) => total + docType.documents.length, 0)} files available
                                    </Typography>
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className="download-accordion-content">
                            <div className="downloads-grouped-list">
                                {documents.map((docType) => (
                                    <div key={docType.type_id} className="download-group">
                                        <h4 className="download-group-title">
                                            {docType.type_name} ({docType.documents.length})
                                        </h4>
                                        <div className="download-files-list">
                                            {docType.documents.map((doc) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.s3_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="download-file-item"
                                                >
                                                    <div className="download-file-icon">
                                                        <PictureAsPdf />
                                                    </div>
                                                    <div className="download-file-info">
                                                        <span className="download-file-name">{doc.file_name}</span>
                                                        <span className="download-file-meta">
                                                            {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)}
                                                        </span>
                                                    </div>
                                                    <div className="download-file-action">
                                                        <Download />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}

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