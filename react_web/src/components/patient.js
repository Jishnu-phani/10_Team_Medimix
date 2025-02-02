import React, { useState, useEffect } from 'react';
import './styles_patient.css';

const PatientProfile = () => {
    const phno = localStorage.getItem('phone');
    const endpoint = `http://localhost:5000/get_patient_datax/${phno}`;

    // Use state to store doctor data
    const [doctorData, setDoctorData] = useState([]);

    // Fetch and format patient data
    const fetchPatientData = async (endpoint) => {
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const formattedData = formatPatientData(data);
            setDoctorData(formattedData); // Update state with formatted data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const formatPatientData = (data) => {
        return Object.entries(data).flatMap(([name, records]) =>
            records.map(record => ({
                DoctorName: record.Doc_name, // Placeholder doctor name
                date: record.date.trim(),
                diagnosis: record.diagnosis.trim(),
                medication: record.medication.join(", "), // Convert array to string
                pdf_url: `http://localhost:5000/download_pdf/${record.appt}`, // Example PDF URL format
            }))
        );
    };

    // Use useEffect to fetch data once the component mounts
    useEffect(() => {
        fetchPatientData(endpoint);
    }, [endpoint]); // Empty dependency array ensures it only runs once on mount

    return (
        <div className="patient-container">
            <h2 className="patient-heading">Previous Doctor Visits</h2>

            {doctorData.length > 0 ? (
                doctorData.map((record, index) => (
                    <div className="patient-card" key={index}>
                        <p className="patient-name">
                            <strong>Doctor Name: {record.DoctorName}</strong>
                        </p>
                        <p className="patient-detail">
                            <strong>Date:</strong> {record.date}
                        </p>
                        <p className="patient-detail">
                            <strong>Diagnosis:</strong> {record.diagnosis}
                        </p>
                        <p className="patient-detail">
                            <strong>Medication:</strong> {record.medication}
                        </p>
                        <a
                            href={record.pdf_url}
                            className="patient-button"
                            download
                        >
                            Download PDF
                        </a>
                    </div>
                ))
            ) : (
                <p>No previous records found.</p>
            )}
        </div>
    );
};

export default PatientProfile;
