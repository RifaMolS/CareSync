import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";

const LessonUpdate = () => {
  const [form, setForm] = useState({
    category: "child",
    ageGroup: "4-6",
    book: "",
    studyTime: "",
    revisionTime: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    price: "",
    staffassign: "user_id", // Replace with actual user ID
  });

  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // get ID passed from previous page

  const childAges = ["4-6", "7-9", "10-12", "13-17"];
  const adultAges = ["18-20"];

  // 🟡 Step 1: Set editId from location
  useEffect(() => {
    if (id) {
      setEditId(id);
    }
  }, [id]);

  // 🟡 Step 2: Fetch data using editId
  useEffect(() => {
    if (editId) {
      fetch('http://localhost:5000/demo/lessonedit')
        .then((res) => res.json())
        .then((data) => {
          setForm({
            category: data.category,
            ageGroup: data.ageGroup,
            book: data.book,
            studyTime: data.studyTime,
            revisionTime: data.revisionTime,
            date: data.date?.split("T")[0],
            time: data.time,
            price: data.price,
            staffassign: data.staffassign || "user_id",
          });
        })
        .catch((err) => console.error("Fetch error", err));
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/demo/lessonupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...form, id: editId }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Lesson updated successfully!");
        navigate("/lessonplanning");
      })
      .catch((err) => console.error("Update error", err));
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <StaffSide />
      <div className="content">
        <StaffNav />
        <div className="container mt-4">
          <h2 className="text-center text-primary mb-4">📘 Update Lesson</h2>

          <form onSubmit={handleSubmit} className="row g-3 bg-light p-4 rounded shadow-sm">
            <div className="col-md-3">
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                <option value="child">🧒 Child</option>
                <option value="adult">🧑 Adult</option>
              </select>
            </div>

            <div className="col-md-3">
              <select name="ageGroup" className="form-select" value={form.ageGroup} onChange={handleChange}>
                {(form.category === "child" ? childAges : adultAges).map((age) => (
                  <option key={age} value={age}>
                    {age} yrs
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="book"
                className="form-control"
                value={form.book}
                onChange={handleChange}
                placeholder="📖 Book"
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="studyTime"
                className="form-control"
                value={form.studyTime}
                onChange={handleChange}
                placeholder="Study Time"
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="revisionTime"
                className="form-control"
                value={form.revisionTime}
                onChange={handleChange}
                placeholder="Revision Time"
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="time"
                name="time"
                className="form-control"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                placeholder="💰 Price"
              />
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning px-4">
                🔄 Update Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LessonUpdate;
