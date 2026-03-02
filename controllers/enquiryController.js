import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, quoteItems, pricedItems } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hasQuoteItems = quoteItems && quoteItems.length > 0;
    const hasPricedItems = pricedItems && pricedItems.length > 0;

    if (!hasQuoteItems && !hasPricedItems) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Emails only sent when quote items exist, and only about quote items
    if (hasQuoteItems) {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: `New Quote Enquiry from ${name}`,
        html: `
          <h2>New Quote Enquiry</h2>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

          <h3>Products Requested for Quote</h3>
          <ul>
            ${quoteItems.map((item) => `<li>${item.description} — Model: ${item.model_number} x${item.quantity}</li>`).join("")}
          </ul>

          <h3>Message</h3>
          <p>${message || "No message provided"}</p>
        `,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "We've received your enquiry — Micromax Technology",
        html: `
          <h2>Thank you, ${name}!</h2>
          <p>We've received your enquiry and our sales team will get back to you shortly.</p>

          <h3>Products Requested for Quote</h3>
          <ul>
            ${quoteItems.map((item) => `<li>${item.description} (Model: ${item.model_number}) x${item.quantity}</li>`).join("")}
          </ul>

          <p>If you have any questions in the meantime, feel free to reply to this email.</p>
          <p>Kind regards,<br/>Micromax Technology Sales Team</p>
        `,
      });
    }

    // Create Stripe session if priced items exist
    let stripeUrl = null;
    if (hasPricedItems) {
      const stripeResponse = await fetch(
        `${process.env.CLIENT_URL}/api/checkout/session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: pricedItems }),
        },
      );
      const stripeData = await stripeResponse.json();
      stripeUrl = stripeData.url || null;
    }

    res.status(200).json({ success: true, stripeUrl });
  } catch (err) {
    console.error("Enquiry email error:", err);
    res.status(500).json({ error: err.message });
  }
};
