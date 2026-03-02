import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

const CheckoutSuccess = () => {
    const { cartItems, removeFromCart } = useCart();

    useEffect(() => {
        // Only remove priced items — quote items were already cleared at submission
        cartItems
            .filter((item) => !item.is_quote_only)
            .forEach((item) => removeFromCart(item.model_number));
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h1 style={{ color: "#1a365d", marginBottom: "0.5rem" }}>Order Confirmed!</h1>
            <p style={{ color: "#718096", marginBottom: "2rem" }}>
                Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <Link
                to="/"
                style={{
                    background: "linear-gradient(135deg, #1a365d 0%, #3182ce 100%)",
                    color: "white",
                    padding: "0.875rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    textDecoration: "none",
                }}
            >
                Back to Catalogue
            </Link>
        </div>
    );
};

export default CheckoutSuccess;