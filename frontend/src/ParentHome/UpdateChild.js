import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";

export default function UpdateChild() {
  const [childname, Setchildname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [dob, Setdob] = useState("");
  const [gender, Setgender] = useState("");
  const [age, Setage] = useState("");
  const [address, Setaddress] = useState("");
  const [image, setImage] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    let edits = {
      id: location.state.id,
    };
    fetch("http://localhost:5000/demo/childedit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edits),
    })
      .then((res) => res.json())
      .then((result) => {
        Setchildname(result.edit.childname);
        Setphone(result.edit.phone);
        Setdob(formatDate(result.edit.dob));
        Setgender(result.edit.gender);
        Setaddress(result.edit.address);
        Setage(result.edit.age);
        Setemail(result.valid.email);
        setImage(result.edit.image);
      });
  }, []);

  const fileUpload = (e, setFile) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/util/fileUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setFile(result);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  const handleupdate = (e) => {
    e.preventDefault();
    let ids = {
      id: location.state.id,
      childname: childname,
      email: email,
      phone: phone,
      gender: gender,
      address: address,
      image: image,
      dob: dob,
      age: age,
    };
    fetch("http://localhost:5000/demo/childupdate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        navigate("/MyChild");
      });
  };

  return (
    <>
      <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflow: 'hidden' }}>
        <ParentSide />
        <div className="content" style={{
          marginLeft: "260px",
          flex: 1,
          overflowY: "auto",
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ParentNav />

          <div
            style={{
              margin: 0,
              fontFamily: "Arial, sans-serif",
              backgroundColor: "#f9fafb",
              color: "#111827",
              minHeight: "100vh",
              padding: "40px",
            }}
          >
            <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
              Update Child Member
            </h1>

            <form
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                maxWidth: "600px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="childname"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Child Name:
                </label>
                <input
                  type="text"
                  id="childname"
                  name="childname"
                  placeholder="Enter Child name"
                  onChange={(e) => Setchildname(e.target.value)}
                  value={childname}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="email"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={(e) => Setemail(e.target.value)}
                  value={email}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="phone"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  onChange={(e) => Setphone(e.target.value)}
                  value={phone}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Gender:
                </label>
                <div style={{ display: "flex", gap: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "Female"}
                      required
                    />
                    Female
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "Male"}
                    />
                    Male
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="address"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={(e) => Setaddress(e.target.value)}
                  value={address}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="dob"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Dob:
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  onChange={(e) => {
                    Setdob(e.target.value);
                    Setage(calculateAge(e.target.value));
                  }}
                  value={dob}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="age"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Age:
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  onChange={(e) => { }} // Read-only, no change
                  value={age}
                  readOnly={true}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="image"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Profile Picture:
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => fileUpload(e, setImage)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                  }}
                  required
                />
                {image && (
                  <img
                    src={`http://localhost:5000/${image}`}
                    alt="User"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>
              <button
                type="submit"
                onClick={handleupdate}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Update child
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
