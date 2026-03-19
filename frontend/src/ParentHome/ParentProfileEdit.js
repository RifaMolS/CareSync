import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentNav from "./ParentNav";
import ParentSide from "./ParentSide";

export default function ParentProfileEdit() {
  const [parentname, Setparentname] = useState("");
  const [childname, Setchildname] = useState("");
  const [email, Setemail] = useState("");
  const [phone, Setphone] = useState("");
  const [password, Setpassword] = useState("");
  const [gender, Setgender] = useState("");
  const [address, Setaddress] = useState("");
  const [age, Setage] = useState("");
  const [image, setImage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let edits = {
      id: location.state.id,
    };
    fetch("http://localhost:5000/demo/parentedit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edits),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "resultresult")
        Setparentname(result.edit.parentname);
        Setchildname(result.edit.childname);
        Setemail(result.edit.email);
        Setphone(result.edit.phone);
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
      parentname: parentname,
      childname: childname,
      email: email,
      phone: phone,
      gender: gender,
      address: address,
      age: age,
      image: image,
    };
    fetch("http://localhost:5000/demo/parentupdate", {
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
        navigate("/parentprofile");
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
              Update Parent Member
            </h1>

            <form
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                width: "100%",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="parentname"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  id="parentname"
                  name="parentname"
                  placeholder="Enter full name"
                  onChange={(e) => Setparentname(e.target.value)}
                  value={parentname}
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
                  htmlFor="childname"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Child Name:
                </label>
                <input
                  type="text"
                  id="childname"
                  name="childname"
                  placeholder="Enter child name"
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

              {/* <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password"  onChange={(e) => Setpassword(e.target.value)} value={password}  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}  />
      </div> */}

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
                      value="female"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "female"}
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
                      value="male"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "male"}
                    />
                    Male
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
                      value="other"
                      onChange={(e) => Setgender(e.target.value)}
                      checked={gender === "other"}
                    />
                    Other
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
                  htmlFor="age"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Age:
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  onChange={(e) => Setage(e.target.value)}
                  value={age}
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
                  htmlFor="shift"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Email
                </label>
                <input
                  type="text"
                  id="shift"
                  name="shift"
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
                Update Guardian
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
