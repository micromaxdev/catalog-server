import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { ArrowBack, Delete, Close } from "@mui/icons-material";
import "./CartPage.css";

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [enquirySent, setEnquirySent] = useState(false);

    const pricedItems = cartItems.filter((item) => !item.is_quote_only && item.price !== null);
    const quoteItems = cartItems.filter((item) => item.is_quote_only || item.price === null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    quoteItems,
                    pricedItems,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowModal(false);

                // Remove quote items immediately — enquiry is submitted
                quoteItems.forEach((item) => removeFromCart(item.model_number));

                if (data.stripeUrl) {
                    // Don't clear priced items yet — wait for successful payment
                    window.location.href = data.stripeUrl;
                } else {
                    // No priced items, all done
                    setEnquirySent(true);
                }
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <Link to="/" className="back-btn">
                    <ArrowBack /> Back to Catalogue
                </Link>
                <h1>Your Cart</h1>
            </div>

            <div className="cart-content">
                {cartItems.length === 0 && !enquirySent ? (
                    <div className="cart-empty">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started.</p>
                        <Link to="/" className="btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {enquirySent && (
                                <div className="enquiry-success">
                                    ✅ Your enquiry has been submitted! Check your email for confirmation. Our sales team will be in touch shortly.
                                </div>
                            )}

                            {/* Priced Items */}
                            {pricedItems.length > 0 && (
                                <div className="cart-section">
                                    <h2 className="cart-section-title">🛒 Products</h2>
                                    {pricedItems.map((item) => (
                                        <div key={item.model_number} className="cart-item">
                                            <div className="cart-item-info">
                                                <h3>{item.description}</h3>
                                                <p className="cart-item-model">Model: {item.model_number}</p>
                                                <p className="cart-item-price">${(item.price ?? 0).toFixed(2)}</p>
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="quantity-control">
                                                    <button onClick={() => updateQuantity(item.model_number, item.quantity - 1)}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.model_number, item.quantity + 1)}>+</button>
                                                </div>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.model_number)}>
                                                    <Delete fontSize="small" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Quote Items */}
                            {quoteItems.length > 0 && (
                                <div className="cart-section">
                                    <h2 className="cart-section-title">📋 Quote Requests</h2>
                                    {quoteItems.map((item) => (
                                        <div key={item.model_number} className="cart-item cart-item-quote">
                                            <div className="cart-item-info">
                                                <h3>{item.description}</h3>
                                                <p className="cart-item-model">Model: {item.model_number}</p>
                                                <p className="cart-item-quote-label">Price on request</p>
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="quantity-control">
                                                    <button onClick={() => updateQuantity(item.model_number, item.quantity - 1)}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.model_number, item.quantity + 1)}>+</button>
                                                </div>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.model_number)}>
                                                    <Delete fontSize="small" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {!enquirySent && (
                            <div className="cart-summary">
                                <h2>Order Summary</h2>

                                {pricedItems.length > 0 && (
                                    <>
                                        <div className="summary-row">
                                            <span>Items ({pricedItems.reduce((sum, i) => sum + i.quantity, 0)})</span>
                                            <span>${(totalPrice ?? 0).toFixed(2)}</span>
                                        </div>
                                        <div className="summary-divider" />
                                        <div className="summary-row total">
                                            <span>Total</span>
                                            <span>${(totalPrice ?? 0).toFixed(2)}</span>
                                        </div>
                                    </>
                                )}

                                {quoteItems.length > 0 && (
                                    <div className="summary-row">
                                        <span>Quote items</span>
                                        <span>{quoteItems.length} item{quoteItems.length > 1 ? "s" : ""}</span>
                                    </div>
                                )}

                                <button className="btn-checkout" onClick={() => setShowModal(true)}>
                                    Proceed to Order
                                </button>

                                <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Your Details</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <Close />
                            </button>
                        </div>

                        <p className="modal-subtitle">
                            Please fill in your details to proceed.
                            {quoteItems.length > 0 && pricedItems.length > 0
                                ? " Your quote enquiry will be sent to our sales team and you'll be redirected to payment."
                                : quoteItems.length > 0
                                    ? " Your quote enquiry will be sent to our sales team."
                                    : " You'll be redirected to payment."}
                        </p>

                        <form onSubmit={handleSubmit} className="enquiry-form">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email Address *"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <textarea
                                placeholder="Additional message (optional)"
                                rows={3}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                            <button type="submit" className="btn-checkout" disabled={submitting}>
                                {submitting ? "Processing..." : "Confirm & Proceed"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;