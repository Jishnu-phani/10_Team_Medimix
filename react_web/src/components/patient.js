import React from 'react';
import './styles_patient.css';

const PatientProfile = () => {
    const patientRecords = [
        {
            name: "John Doe",
            date: "2024-02-01",
            diagnosis: "Common Cold",
            medication: "Paracetamol",
            pdf_url: "/path/to/pdf"
        },
        {
            name: "Jane Smith",
            date: "2024-02-01",
            diagnosis: "Allergies",
            medication: "Antihistamine",
            pdf_url: "/path/to/pdf"
        }
    ];

    return (
        <div className="patient-container">

            <h2 className="patient-heading">Patient Records</h2>

            {patientRecords.map((record, index) => (
                <div className="patient-card" key={index}>
                    <h2 className="patient-name">{record.name}</h2>
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
            ))}
        </div>
    );
};

export default PatientProfile;