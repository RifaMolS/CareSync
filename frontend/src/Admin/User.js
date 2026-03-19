import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";

export default function User() {
  const [childList, SetchildList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    fetch("http://localhost:5000/demo/childview")
      .then((res) => res.json())
      .then((result) => {
        SetchildList(result);
      });
  }, [refresh]);

  return (
    <div>
      <div className="container-xxl position-relative bg-white d-flex p-0">
        <Side />
        <div className="content">
          <AdminNav />
          <div className="container-fluid pt-4 px-4">
            <section id="user" className="mt-5">
              <h3 className="mb-4">User Management</h3>

              <div className="container mb-5">
                <div className="row">
                  {childList.map((parent, index) => (
                    <div
                      key={index}
                      className={`col-md-4 mb-4 d-flex justify-content-center`}
                    >
                      <div
                        className="card shadow-sm"
                        style={{ width: "100%", maxWidth: "320px" }}
                      >
                        <img
                          src={`http://localhost:5000/${parent.regid?.image}`}
                          className="card-img-top"
                          alt="User"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{parent.regid?.childname}</h5>
                          <p className="card-text mb-1">
                            <strong>Email:</strong> {parent.email}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Age:</strong> {parent.regid?.age}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Gender:</strong> {parent.regid?.gender}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Phone:</strong> {parent.regid?.phone}
                          </p>
                          <p className="card-text">
                            <strong>Address:</strong> {parent.regid?.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import Side from "./Side";
// import AdminNav from "./AdminNav";

// export default function User() {
//   const [childList, SetchildList] = useState([]);
//   const [refresh, setRefresh] = useState(0);
//   useEffect(() => {
//     fetch("http://localhost:5000/demo/childview")
//       .then((res) => res.json())
//       .then((result) => {
//         SetchildList(result);
//       });
//   }, [refresh]);

//   return (
//     <div>
//       <div class="container-xxl position-relative bg-white d-flex p-0">
//         <Side />
//         <div class="content">
//           <AdminNav />
//           <section id="user" class="mt-5">
//             <h3 class="mb-4">User Management</h3>

//             <div class="table-responsive mb-5">
//               <table class="table table-bordered table-striped align-middle">
//                 <thead class="table-dark">
//                   <tr>
//                     <th>Id</th>
//                     <th>parent name</th>
//                     <th>child Name</th>
//                     <th>Email</th>
//                     <th>age</th>
//                     <th>gender</th>
//                     <th>phone</th>
//                     <th>Address</th>
//                      <th
//                     style={{
//                       borderBottom: "1px solid #e2e8f0",
//                       textAlign: "left",
//                     }}
//                   >
//                     Image
//                   </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {childList.map((parent, index) => (
//                     <tr key={index}>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {index + 1}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.parentId.parentname}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.childname}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.email}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.gender}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.age}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.phone}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px",
//                           borderBottom: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {parent.regid.address}
//                       </td>
//                       <td
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

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }
