import React, { useState, useEffect } from "react";
import "./styles_pharmacy.css";

const PatientMedicine = () => {
  const [prescriptionData, setPrescriptionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_pharmacistx");
        const data = await response.json();
        setPrescriptionData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, []);

  const markAsDelivered = async (patientName) => {
    try {
      const endpoint = `http://localhost:5000/mark_as_delivered/${patientName}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_name: patientName }),
      });

      const result = await response.json();
      console.log(result)
      if (result.success) {
        alert("Prescription marked as delivered.");
        window.location.reload();
      } else {
        alert("Successfully delivered");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark as delivered.");
    }
  };

  if (loading) {
    return <div className="pharmacy-body">Loading...</div>;
  }

  if (error) {
    return <div className="pharmacy-body">Error: {error}</div>;
  }

  return (
    <div className="pharmacy-body">
      <div className="pharmacy-container">
        {Object.entries(prescriptionData).map(([patientName, details]) => (
          <div className="pharmacy-card" key={patientName}>
            <h2>{patientName}</h2>
            <p>
              <strong>Phone Number:</strong> {details['Phone Number']}
            </p>
            <p>
              <strong>Date:</strong> {details.date}
            </p>
            <p>
              <strong>Diagnosis:</strong> {details.diagnosis}
            </p>
            <p>
              <strong>Medications:</strong>
              
                {details.medication}
            </p>
            <button
              className="pharmacy-button pharmacy-delivered-button"
              onClick={() => markAsDelivered(patientName)}
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