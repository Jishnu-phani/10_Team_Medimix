import React from "react";
import "./styles_pharmacy.css";

const PatientMedicine = ({ data }) => {
  const data1 = [
    {
      patient_name: "John Doe",
      date: "2023-10-01",
      diagnosis: "Flu",
      medication: "Tamiflu",
      phone_number: "123-456-7890",
      pdf_url: "https://firebase_storage_link_to_pdf_1",
    },
    {
      patient_name: "Jane Smith",
      date: "2023-10-02",
      diagnosis: "Cold",
      medication: "Paracetamol",
      phone_number: "098-765-4321",
      pdf_url: "https://firebase_storage_link_to_pdf_2",
    },
  ];

  const markAsDelivered = async (patientName) => {
    try {
      const response = await fetch("/mark_as_delivered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_name: patientName }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Prescription marked as delivered.");
        window.location.reload();
      } else {
        alert("Failed to mark as delivered.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark as delivered.");
    }
  };

  return (
    <div className="pharmacy-body">
      <div className="pharmacy-container">
        {data1.map((record, index) => (
          <div className="pharmacy-card" key={index}>
            <h2>{record.patient_name}</h2>
            <p>
              <strong>Date:</strong> {record.date}
            </p>
            <p>
              <strong>Diagnosis:</strong> {record.diagnosis}
            </p>
            <p>
              <strong>Medication:</strong> {record.medication}
            </p>
            <p>
              <strong>Phone Number:</strong> {record.phone_number}
            </p>
            <a href={record.pdf_url} className="pharmacy-button" download>
              Download PDF
            </a>
            <button
              className="pharmacy-button pharmacy-delivered-button"
              onClick={() => markAsDelivered(record.patient_name)}
            >
              Delivered
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientMedicine;
