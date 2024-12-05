import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAELWzVQZiw2PxbNUT3-YK4a6KPHfYkdZ4",
  authDomain: "work-98965.firebaseapp.com",
  databaseURL: "https://work-98965-default-rtdb.firebaseio.com",
  projectId: "work-98965",
  storageBucket: "work-98965.appspot.com",
  messagingSenderId: "755408416828",
  appId: "1:755408416828:web:59f72561f27fb9ffa01339"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById("deposit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to make a deposit.");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_live_655c8bcc32899ee6c6ff3acf23036499935e69ec", // Paystack public key
    email: user.email,
    amount: amount * 100, // Amount in kobo
    currency: "NGN",
    onSuccess: function (response) {
      fetch('/server/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          reference: response.reference,
          amount: amount
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Deposit successful!");
          } else {
            alert("Failed to update balance.");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong. Please try again.");
        });
    },
    onClose: function () {
      alert("Transaction was not completed.");
    }
  });
  handler.openIframe();
});