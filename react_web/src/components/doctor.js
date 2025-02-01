import React from 'react';
import './styles_doctor.css';

const DoctorProfile = () => {
    const patientRecords = [
        {
            PatientName: "Mental Tejas",
            date: "2024-02-01",
            diagnosis: "Common Cold",
            medication: "Paracetamol",
            pdf_url: "/path/to/pdf"
        },
        {
            PatientName: "Stupid Jishnu",
            date: "2024-02-01",
            diagnosis: "Allergies",
            medication: "Antihistamine",
            pdf_url: "/path/to/pdf"
        }
    ];

    return (
        <div className="doctor-container">

            <h2 className="doctor-heading">Previous Patient Records</h2>

            {patientRecords.map((record, index) => (
                <div className="doctor-card" key={index}>
                    <p className="doctor-name">
                        <strong>Patient Name: {record.PatientName}</strong></p>
                    <p className="doctor-detail">
                        <strong>Date:</strong> {record.date}
                    </p>
                    <p className="doctor-detail">
                        <strong>Diagnosis:</strong> {record.diagnosis}
                    </p>
                    <p className="doctor-detail">
                        <strong>Medication:</strong> {record.medication}
                    </p>
                    <a 
                        href={record.pdf_url} 
                        className="doctor-button" 
                        download
                    >
                        Download PDF
                    </a>
                </div>
            ))}
        </div>
    );
};

export default DoctorProfile;