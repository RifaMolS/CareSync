import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";

export default function Parent() {
  const [parentList, SetparentList] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/demo/parentview")
      .then((res) => res.json())
      .then((result) => {
        SetparentList(result);
        console.log(result);
      });
  }, [refresh]);

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/demo/deactive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          deactivation: 1,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data || "User deactivated!");
      } else {
        alert("Deactivation failed: " + data);
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <Side />
      <div className="content">
        <AdminNav />

        <div style={{ padding: "40px", backgroundColor: "#f8f9fa" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            📋 Guardian List
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {parentList.map((parent, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  width: "100%",
                  maxWidth: "350px",
                  padding: "20px",
                  boxSizing: "border-box",
                  transition: "transform 0.2s ease",
                }}
              >
                <img
                  src={`http://localhost:5000/${parent.regid?.image}`}
                  alt="User"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
                <h4 style={{ marginBottom: "10px", color: "#333" }}>
                  {parent.regid.parentname}
                </h4>
                <p><strong>Child:</strong> {parent.regid.childname}</p>
                <p><strong>Email:</strong> {parent.email}</p>
                <p><strong>Gender:</strong> {parent.regid.gender}</p>
                <p><strong>Age:</strong> {parent.regid.age}</p>
                <p><strong>Phone:</strong> {parent.regid.phone}</p>
                <p><strong>Address:</strong> {parent.regid.address}</p>

                {/* <button
                  onClick={() => handleDeactivate(parent._id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#c82333")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#dc3545")
                  }
                >
                  Deactivate
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}














// import React, { useEffect, useState } from "react";
// import Side from "./Side";
// import AdminNav from "./AdminNav";

// export default function Parent() {
//   const [parentList, SetparentList] = useState([]);
//   const [refresh, setRefresh] = useState(0);
//   useEffect(() => {
//     fetch("http://localhost:5000/demo/parentview")
//       .then((res) => res.json())
//       .then((result) => {
//         SetparentList(result);
//         console.log(result);
//       });
//   }, [refresh]);
//   const handleDeactivate = async (id) => {
//     try {
//       const response = await fetch("http://localhost:5000/demo/deactive", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: id,
//           deactivation: 1,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert(data || "User deactivated!");
//       } else {
//         alert("Deactivation failed: " + data);
//       }
//     } catch (error) {
//       console.error("Error deactivating user:", error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="container-xxl position-relative bg-white d-flex p-0">
//       <Side />
//       <div className="content">
//         <AdminNav />

//         <div
//           style={{
//             margin: 0,
//             fontFamily: "Arial, sans-serif",
//             backgroundColor: "#f0f4f8",
//             color: "#111827",
//             minHeight: "100vh",
//             padding: "40px",
//             animation: "fadeIn 1.5s ease-in-out",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "24px",
//               marginTop: "50px",
//               marginBottom: "20px",
//               animation: "fadeIn 1s ease",
//             }}
//           >
//             📋 Parent List
//           </h2>
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: "20px",
//               borderRadius: "10px",
//               boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
//               animation: "fadeIn 1s ease",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Parent Name
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Child Name
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     email
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     gender
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Age
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     phone
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Address
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Image
//                   </th>
//                   <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               {parentList.map((parent) => {
//                 return (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.parentname}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.childname}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.email}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.gender}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.age}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.phone}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {parent.regid.address}
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #f1f5f9",
//                       }}
//                     >
//                       {" "}
//                       <img
//                         src={`http://localhost:5000/${parent.regid?.image}`}
//                         alt="User"
//                         style={{ width: "100px", marginTop: "10px" }}
//                       />
//                     </td>

//                     <td>
//                       <button
//                         onClick={() => handleDeactivate(parent._id)}
//                         style={{
//                           padding: "8px 16px",
//                           backgroundColor: "#ff4d4f",
//                           color: "white",
//                           border: "none",
//                           borderRadius: "8px",
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           transition: "background-color 0.3s ease",
//                         }}
//                         onMouseOver={(e) =>
//                           (e.target.style.backgroundColor = "#d9363e")
//                         }
//                         onMouseOut={(e) =>
//                           (e.target.style.backgroundColor = "#ff4d4f")
//                         }
//                       >
//                         Deactivate
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
