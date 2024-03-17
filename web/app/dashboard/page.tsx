//@ts-nocheck
"use client";
import React, { useState } from "react";
import Head from "next/head";
import "./doctordash.css"; // Import CSS file for styling

const AddRecordForm = ({ onAddRecord }: any) => {
  const [state, setState] = useState({
    name: "",
    phoneNumber: "",
    nextVisit: "",
    diagnosis: "",
    prescription: "",
    bill: "",
    notes: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      name,
      phoneNumber,
      nextVisit,
      diagnosis,
      prescription,
      bill,
      notes,
    } = state;
    if (!name || !diagnosis || !prescription || !bill) {
      alert(
        "Please fill in all required fields: Name, Diagnosis, Prescription, Bill"
      );
      return;
    }
    const newRecord = {
      name,
      phoneNumber,
      nextVisit,
      diagnosis,
      prescription,
      bill,
      notes,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    function parseJwt(token) {
      return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    }
    const decoded = parseJwt(token);
    const res = await fetch("/api/create_record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        bill: state.bill,
        diagnosis: state.diagnosis,
        name: state.name,
        phone_number: state.phoneNumber,
        next_visit: state.nextVisit,
        prescription: state.prescription,
        notes: state.notes,
        doctor_name: decoded.name,
        doctor_phoneNumber: decoded.number,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      alert("Record added successfully");

    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={state.phoneNumber}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Next Visit:
        <input
          type="date"
          name="nextVisit"
          value={state.nextVisit}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Diagnosis:
        <input
          type="text"
          name="diagnosis"
          value={state.diagnosis}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Prescription:
        <textarea
          name="prescription"
          value={state.prescription}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Bill:
        <input
          type="text"
          name="bill"
          value={state.bill}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Notes:
        <textarea
          name="notes"
          value={state.notes}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save Record</button>
    </form>
  );
};

const DoctorRecords = () => {
  const [records, setRecords] = useState([]);
  const [enlargedRecord, setEnlargedRecord] = useState(null);

  const handleAddRecord = (newRecord) => {
    setRecords([...records, newRecord]);
  };

  const handleDeleteRecord = (index) => {
    setRecords(records.filter((record, i) => i !== index));
  };

  const handleViewRecord = (record) => {
    setEnlargedRecord(record);
  };

  const handleCloseEnlarge = () => {
    setEnlargedRecord(null);
  };

  return (
    <div className="container">
      <h2>Doctor Records</h2>
      <AddRecordForm onAddRecord={handleAddRecord} />
    </div>
  );
};

export default DoctorRecords;
