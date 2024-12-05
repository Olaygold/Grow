import express from 'express';
import bodyParser from 'body-parser';
import paystack from './paystack.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle Paystack deposits
app.post('/server/paystack', async (req, res) => {
  const { userId, reference, amount } = req.body;

  try {
    const verification = await paystack.verifyTransaction(reference);
    if (verification.status && verification.data.amount === amount * 100) {
      // Update user balance (you'd connect this to your database logic)
      console.log(`User ${userId} successfully deposited ₦${amount}`);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid transaction." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying transaction." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));