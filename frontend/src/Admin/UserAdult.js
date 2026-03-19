import React, { useEffect, useState } from "react";
import Side from "./Side";
import AdminNav from "./AdminNav";

export default function UserAdult() {
    const [adultList, setAdultList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        fetch("http://localhost:5000/demo/adultview")
            .then((res) => res.json())
            .then((result) => {
                setAdultList(result);
            });
    }, [refresh]);

    return (
        <div>
            <div className="container-xxl position-relative bg-white d-flex p-0">
                <Side />
                <div className="content">
                    <AdminNav />
                    <div className="container-fluid pt-4 px-4">
                        <section id="user-adult" className="mt-5">
                            <h3 className="mb-4" style={{ color: "#28a745" }}>
                                Adult / Senior Management
                            </h3>

                            <div className="container mb-5">
                                <div className="row">
                                    {adultList.length > 0 ? (
                                        adultList.map((parent, index) => (
                                            <div
                                                key={index}
                                                className="col-md-4 mb-4 d-flex justify-content-center"
                                            >
                                                <div
                                                    className="card shadow-sm"
                                                    style={{ width: "100%", maxWidth: "320px" }}
                                                >
                                                    <img
                                                        src={`http://localhost:5000/${parent.regid?.image}`}
                                                        className="card-img-top"
                                                        alt="Adult User"
                                                        style={{ height: "200px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title" style={{ color: "#28a745" }}>
                                                            {parent.regid.adultname}
                                                        </h5>
                                                        <p className="card-text mb-1">
                                                            <strong>Guardian Name:</strong>{" "}
                                                            {parent.regid.parentId.parentname}
                                                        </p>
                                                        <p className="card-text mb-1">
                                                            <strong>Email:</strong> {parent.email}
                                                        </p>
                                                        <p className="card-text mb-1">
                                                            <strong>Age:</strong> {parent.regid.age}
                                                        </p>
                                                        <p className="card-text mb-1">
                                                            <strong>Gender:</strong> {parent.regid.gender}
                                                        </p>
                                                        <p className="card-text mb-1">
                                                            <strong>Phone:</strong> {parent.regid.phone}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Address:</strong> {parent.regid.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center">
                                            <p className="text-muted">No adult profiles found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
