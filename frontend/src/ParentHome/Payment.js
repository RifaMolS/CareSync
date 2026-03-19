import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";

export default function PaymentProcess() {
  const [payer, setPayer] = useState("");
  const [payerdetail, setpayerdetail] = useState("");
  const [amount, setAmount] = useState("");
  const [totals, setTotals] = useState({
    roomTotal: 0,
    lessonTotal: 0,
    grandTotal: 0,
  });
  const [monthlyPayments, setMonthlyPayments] = useState([]); // all payments made (history)
  const [currentMonth, setCurrentMonth] = useState(""); // current month string e.g. May 2025
  const [isPaidThisMonth, setIsPaidThisMonth] = useState(false);

  const fetchPaymentHistory = (parentId) => {
    fetch("http://localhost:5000/demo/payments-by-parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId }),
    })
      .then((res) => res.json())
      .then((payments) => {
        setMonthlyPayments(payments);

        const currentMonthStr = new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        setCurrentMonth(currentMonthStr);

        const paidThisMonth = payments.some(
          (p) => p.monthYear === currentMonthStr
        );
        setIsPaidThisMonth(paidThisMonth);
      })
      .catch((err) => console.error("Error fetching payments history:", err));
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const id = auth?.regid;

    // Fetch monthly sum (total for current month)
    fetch("http://localhost:5000/demo/monthlysum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTotals(data);
        setAmount(data.grandTotal); // auto-fill amount
      })
      .catch((err) => console.error("Error fetching monthly sum:", err));

    // Fetch parent info
    fetch("http://localhost:5000/demo/parentid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPayer(result.parentname);
        setpayerdetail(result);
      });

    if (id) {
      fetchPaymentHistory(id);
    }
  }, []);

  const handleSubmit = () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;
    if (isPaidThisMonth) {
      alert("You have already paid for this month.");
      return;
    }
    if (!payer || !amount) {
      alert("Please fill all fields");
      return;
    }

    const options = {
      key: "rzp_test_4Ex6Tyjkp79GFy", // Replace with your Razorpay key
      amount: parseFloat(amount) * 100, // in paise
      currency: "INR",
      name: "Monthly Payment",
      description: `Payment by ${payer}`,
      handler: function (response) {
        const paymentDetails = {
          paymentid: response.razorpay_payment_id,
          parentId,
          payer,
          amount,
          roomTotal: totals.roomTotal,
          lessonTotal: totals.lessonTotal,
          grandTotal: totals.grandTotal,
          date: new Date().toISOString(), // current timestamp
        };

        console.log("Payment Details:", paymentDetails);

        fetch("http://localhost:5000/demo/payment-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentDetails),
        })
          .then((res) => res.json())
          .then((result) => {
            alert("✅ Payment recorded successfully!");
            fetchPaymentHistory(parentId);
          })
          .catch((err) => {
            console.error("❌ Error saving payment:", err);
          });
      },
      prefill: {
        name: payer,
        address: payerdetail.address,
        contact: payerdetail.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", overflow: "hidden" }}>
      <ParentSide />
      <div className="content" style={{
        marginLeft: "260px",
        flex: 1,
        overflowY: "auto",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ParentNav />
        <div className="page-container" style={{ padding: '2rem' }}>
          <h1 className="page-title">💸 Payment Process</h1>

          <div className="card summary-card">
            <h3>📊 Monthly Charges</h3>
            <p>🛏️ Room Charges: ₹{totals.roomTotal}</p>
            <p>📚 Lesson Charges: ₹{totals.lessonTotal}</p>
            <h4>💰 Grand Total: ₹{totals.grandTotal}</h4>
          </div>

          <div className="payment-box">
            <h2>🧾 Make a Payment</h2>

            <input
              placeholder="👤 Name"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            />
            <input
              type="number"
              placeholder="💰 Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPaidThisMonth} // disable editing amount if paid
            />

            <button
              onClick={handleSubmit}
              disabled={isPaidThisMonth}
              style={{
                backgroundColor: isPaidThisMonth ? "gray" : "#3399cc",
                cursor: isPaidThisMonth ? "not-allowed" : "pointer",
              }}
            >
              {isPaidThisMonth ? "✅ Paid" : "💳 Pay Now"}
            </button>
          </div>

          {/* Payment History Section */}

          {monthlyPayments.length > 0 && (
            <div className="payment-history">
              <h2>📜 Payment History</h2>
              <table className="payment-history-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount Paid (₹)</th>
                    <th>Payment ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td data-label="Month">{payment.monthYear}</td>
                      <td data-label="Amount Paid (₹)">{payment.amount}</td>
                      <td data-label="Payment ID">{payment.paymentid}</td>
                      <td data-label="Date">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <style>{`
            .page-container {
              padding: 40px 20px;
              font-family: 'Segoe UI', sans-serif;
              background: #f9fafe;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .page-title {
              color: #2c3e50;
              margin-bottom: 30px;
              font-size: 2rem;
            }

            .card {
              background: #ffffff;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
              margin-bottom: 20px;
              width: 100%;
              max-width: 500px;
            }

            .info-card h3,
            .summary-card h3 {
              color: #333;
              margin-bottom: 10px;
            }

            .summary-card h4 {
              margin-top: 15px;
              color: #007bff;
            }

            .payment-box {
              background: white;
              padding: 30px 20px;
              border-radius: 12px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 400px;
              display: flex;
              flex-direction: column;
              gap: 15px;
            }

            .payment-box input,
            .payment-box select {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 8px;
              font-size: 1rem;
            }

            .payment-box button {
              background: #3366cc;
              color: white;
              padding: 10px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              transition: background 0.3s;
            }

            .payment-box button:hover {
              background: #254a99;
            }

            .payment-card {
              background: #f1f5ff;
              padding: 15px;
              margin-top: 20px;
              border-radius: 10px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: center;
            }
              .payment-history {
  margin-top: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.payment-history h2 {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; /* space between rows */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 10px;
  background: white;
}

.payment-history-table thead tr {
  background-color: #0077cc;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}

.payment-history-table th,
.payment-history-table td {
  padding: 15px 20px;
  text-align: center;
  vertical-align: middle;
  font-size: 1rem;
}

.payment-history-table tbody tr {
  background-color: #f9fbfd;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border-radius: 8px;
}

.payment-history-table tbody tr:not(:last-child) {
  margin-bottom: 10px;
}

.payment-history-table tbody tr:hover {
  background-color: #d0e7ff;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 119, 204, 0.2);
}

.payment-history-table td {
  border: none; /* no borders for cleaner look */
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .payment-history-table thead {
    display: none; /* hide headers on mobile */
  }

  .payment-history-table, 
  .payment-history-table tbody, 
  .payment-history-table tr, 
  .payment-history-table td {
    display: block;
    width: 100%;
  }

  .payment-history-table tr {
    margin-bottom: 15px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    border-radius: 10px;
  }

  .payment-history-table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .payment-history-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 20px;
    top: 15px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #0077cc;
  }
}

          `}</style>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// import ParentSide from './ParentSide';
// import ParentNav from './ParentNav';

// export default function PaymentProcess() {
//   const [payer, setPayer] = useState('');
//   const [amount, setAmount] = useState('');
//   const [method, setMethod] = useState('Credit Card');
//   const [paymentData, setPaymentData] = useState(null);
// useEffect(() => {
//   const auth = JSON.parse(localStorage.getItem("user"));
//   const id = auth?.regid;

//   fetch('http://localhost:5000/demo/monthlysum', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ parentId: id }),
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log("Room Total:", data.roomTotal);
//       console.log("Lesson Total:", data.lessonTotal);
//       console.log("Grand Total:", data.grandTotal);
//     })
//     .catch(err => console.error("Error fetching monthly sum:", err));
// }, []);

//     useEffect(() => {
//        const auth = JSON.parse(localStorage.getItem("user"));
//   const id = auth?.regid;

//         fetch('http://localhost:5000/demo/parentid', {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({id: id }),
//         })
//             .then((res) => res.json())
//             .then((result) => {
//                 console.log(result,"resultside")
//             });
//     }, []);
//   const handleSubmit = () => {
//     if (!payer || !amount) {
//       alert("Please fill all fields");
//       return;
//     }
//     setPaymentData({ payer, amount, method });
//     setPayer('');
//     setAmount('');
//     setMethod('Credit Card');
//   };

//   const handleClear = () => {
//     setPaymentData(null);
//   };

//   return (
//     <div className="container-xxl d-flex p-0 bg-white">
//       <ParentSide />
//       <div className="content">
//         <ParentNav />
//         <div className="page-container">
//           <h1 className="page-title">💸 Payment Process</h1>

//           <div className="payment-box">
//             <h2>🧾 Make a Payment</h2>

//             <input
//               placeholder="👤 Name"
//               value={payer}
//               onChange={e => setPayer(e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="💰 Amount"
//               value={amount}
//               onChange={e => setAmount(e.target.value)}
//             />
//             <select value={method} onChange={e => setMethod(e.target.value)}>
//               <option>Credit Card</option>
//               <option>UPI</option>
//               <option>Net Banking</option>
//               <option>Cash</option>
//             </select>

//             <button onClick={handleSubmit}>💳 Pay</button>

//             {paymentData && (
//               <div className="payment-card">
//                 <h3>👤 {paymentData.payer}</h3>
//                 <p>💰 ₹{paymentData.amount}</p>
//                 <p>💳 {paymentData.method}</p>
//                 <button onClick={handleClear}>🗑️ Clear</button>
//               </div>
//             )}
//           </div>

//           <style>{`
//             .page-container {
//               padding: 40px 20px;
//               font-family: 'Segoe UI', sans-serif;
//               background: #f9fafe;
//               min-height: 100vh;
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//             }

//             .page-title {
//               color: #2c3e50;
//               margin-bottom: 30px;
//               font-size: 2rem;
//             }

//             .payment-box {
//               background: white;
//               padding: 30px 20px;
//               border-radius: 12px;
//               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//               width: 100%;
//               max-width: 400px;
//               display: flex;
//               flex-direction: column;
//               gap: 15px;
//             }

//             .payment-box input,
//             .payment-box select {
//               padding: 10px;
//               border: 1px solid #ccc;
//               border-radius: 8px;
//               font-size: 1rem;
//             }

//             .payment-box input:focus,
//             .payment-box select:focus {
//               outline: none;
//               border-color: #6699ff;
//               box-shadow: 0 0 5px rgba(102, 153, 255, 0.5);
//             }

//             .payment-box button {
//               background: #3366cc;
//               color: white;
//               padding: 10px;
//               border: none;
//               border-radius: 8px;
//               cursor: pointer;
//               font-size: 1rem;
//               transition: background 0.3s;
//             }

//             .payment-box button:hover {
//               background: #254a99;
//             }

//             .payment-card {
//               background: #f1f5ff;
//               padding: 15px;
//               margin-top: 20px;
//               border-radius: 10px;
//               display: flex;
//               flex-direction: column;
//               gap: 8px;
//               align-items: center;
//             }
//           `}</style>
//         </div>
//       </div>
//     </div>
//   );
// }
