import { createStripeSession } from "../services/stripeService.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    const url = await createStripeSession(items);
    res.status(200).json({ url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
};
