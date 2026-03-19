import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";
import { motion } from "framer-motion";
import { FaFileInvoiceDollar, FaRegCreditCard, FaSearch, FaDownload, FaMoneyBillWave } from "react-icons/fa";

export default function Billing() {
  const [paymentList, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/demo/findallpayment")
      .then((res) => res.json())
      .then((result) => {
        setPaymentList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payment:", err);
        setLoading(false);
      });
  }, []);

  const totalRevenue = paymentList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const averageTrans = paymentList.length ? Math.round(totalRevenue / paymentList.length) : 0;

  const filteredPayments = paymentList.filter(p =>
    (p?.parentId?.parentname || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <Side />
      <div className="content">
        <AdminNav />

        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-wrap justify-content-between align-items-center mb-5"
          >
            <div>
              <h2 className="fw-bold text-dark">Financial Records</h2>
              <p className="text-muted">Track payments, invoices, and revenue streams</p>
            </div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => window.print()}>
              <FaDownload className="me-2" /> Export Report
            </button>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <motion.div
                whileHover={{ translateY: -5 }}
                className="card border-0 shadow-sm overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', color: 'white' }}
              >
                <div className="card-body p-4 position-relative">
                  <FaMoneyBillWave className="position-absolute end-0 bottom-0 m-3 opacity-25" size={80} />
                  <h5 className="text-white-50">Total Revenue</h5>
                  <h2 className="display-5 fw-bold mb-0">₹{totalRevenue.toLocaleString()}</h2>
                </div>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                whileHover={{ translateY: -5 }}
                className="card border-0 shadow-sm bg-white"
              >
                <div className="card-body p-4">
                  <h5 className="text-muted small text-uppercase fw-bold">Transactions</h5>
                  <h2 className="fw-bold text-dark">{paymentList.length}</h2>
                  <div className="progress mt-3" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                whileHover={{ translateY: -5 }}
                className="card border-0 shadow-sm bg-white"
              >
                <div className="card-body p-4">
                  <h5 className="text-muted small text-uppercase fw-bold">Avg. Transaction</h5>
                  <h2 className="fw-bold text-dark">₹{averageTrans.toLocaleString()}</h2>
                  <div className="progress mt-3" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-lg rounded-4"
          >
            <div className="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h5 className="mb-0 fw-bold"><FaFileInvoiceDollar className="me-2 text-primary" />Payment History</h5>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-end-0"><FaSearch className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Search by payer name..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light text-secondary small text-uppercase">
                  <tr>
                    <th className="border-0 p-3 ps-4">Payer Details</th>
                    <th className="border-0 p-3">Date</th>
                    <th className="border-0 p-3">Room Rent</th>
                    <th className="border-0 p-3">Services</th>
                    <th className="border-0 p-3">Total Paid</th>
                    <th className="border-0 p-3">Method</th>
                    <th className="border-0 p-3 pe-4 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-5">Loading records...</td></tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-5 text-muted">No records found.</td></tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment._id}>
                        <td className="p-3 ps-4">
                          <div className="fw-bold text-dark">{payment?.parentId?.parentname || "Unknown"}</div>
                          <small className="text-muted">ID: {payment._id.substring(0, 8)}...</small>
                        </td>
                        <td className="p-3 text-secondary">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">₹{payment.roomTotal || 0}</td>
                        <td className="p-3">₹{payment.lessonTotal || 0}</td>
                        <td className="p-3 fw-bold text-dark">₹{payment.amount || 0}</td>
                        <td className="p-3">
                          <span className="badge bg-light text-dark border">
                            <FaRegCreditCard className="me-1" /> Online
                          </span>
                        </td>
                        <td className="p-3 pe-4 text-end">
                          <span className="badge bg-success-subtle text-success rounded-pill px-3">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
