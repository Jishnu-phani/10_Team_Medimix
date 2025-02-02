// import React, { useState, useEffect } from 'react';
// import './styles_doctor.css';

// const DoctorProfile = () => {
//     const phno = localStorage.getItem('phone');
//     const endpoint = `http://localhost:5000/get_doctor_data/${phno}`;

//     // Use state to store patient records
//     const [patientRecords, setPatientRecords] = useState([]);

//     // Fetch patient data from the API
//     const fetchPatientData = async (endpoint) => {
//         try {
//             const response = await fetch(endpoint, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             const formattedData = formatPatientData(data);
//             setPatientRecords(formattedData); // Update state with formatted data
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     // Format the fetched data into the desired structure
//     const formatPatientData = (data) => {
//         return Object.entries(data).flatMap(([name, records]) =>
//             records.map(record => ({
//                 name,
//                 date: record.date.trim(),
//                 diagnosis: record.diagnosis.trim(),
//                 medication: record.medication.map(med => med.trim()), // Clean up each medication
//                 pdf_url: `/pdfs/${name}-${record.date}.pdf`, // Generate PDF URL based on the patient name and date
//             }))
//         );
//     };

//     // Use useEffect to fetch data once the component mounts
//     useEffect(() => {
//         fetchPatientData(endpoint);
//     }, [endpoint]); // Empty dependency array ensures it only runs once on mount

//     return (
//         <div className="doctor-container">
//             <h2 className="doctor-heading">Previous Patient Records</h2>

//             {patientRecords.length > 0 ? (
//                 patientRecords.map((record, index) => (
//                     <div className="doctor-card" key={index}>
//                         <p className="doctor-name">
//                             <strong>Patient Name: {record.name}</strong>
//                         </p>
//                         <p className="doctor-detail">
//                             <strong>Date:</strong> {record.date}
//                         </p>
//                         <p className="doctor-detail">
//                             <strong>Diagnosis:</strong> {record.diagnosis}
//                         </p>
//                         <p className="doctor-detail">
//                             <strong>Medication:</strong> {record.medication.join(', ')} {/* Join the medication list if it's an array */}
//                         </p>
//                         <a 
//                             href={record.pdf_url} 
//                             className="doctor-button" 
//                             download
//                         >
//                             Download PDF
//                         </a>
//                     </div>
//                 ))
//             ) : (
//                 <p>No patient records found.</p>
//             )}
//         </div>
//     );
// };

// export default DoctorProfile;

import React, { useState, useEffect } from 'react';
import './styles_doctor.css';

const DoctorProfile = () => {
    const phno = localStorage.getItem('phone');
    const endpoint = `http://localhost:5000/get_doctor_data/${phno}`;
    const [patientRecords, setPatientRecords] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatientData = async (endpoint) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.status === 'error') {
                throw new Error(result.message);
            }
            console.log(result)
            console.log("eheheheh")
            
            setDoctorName(result.data.doctor_name);
            const formattedData = formatPatientData(result.data.data);
            console.log(formattedData)
            setPatientRecords(formattedData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatPatientData = (data) => {
        return Object.entries(data).map(([recordId, record]) => ({
            id: recordId,
            patient_phno: record.patient_phno,
            date: record.date,
            diagnosis: record.diagnosis,
            medication: Array.isArray(record.medication) ? record.medication : [record.medication],
            pdf_url: `http://localhost:5000/download_pdf/${record.appt}`
        }));
    };

    useEffect(() => {
        fetchPatientData(endpoint);
    }, [endpoint]);

    return (
        <div className="doctor-container">
            {doctorName && <h2 className="doctor-heading">Dr. {doctorName}'s Patient Records</h2>}
            
            {loading && <p>Loading patient data...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && patientRecords.length === 0 && (
                <p>No patient records found.</p>
            )}
            
            {patientRecords.map((record) => (
                <div className="doctor-card" key={record.id}>
                    <p className="doctor-name">
                        <strong>Patient Phone: {record.patient_phno}</strong>
                    </p>
                    <p className="doctor-detail">
                        <strong>Date:</strong> {record.date || 'Not specified'}
                    </p>
                    <p className="doctor-detail">
                        <strong>Diagnosis:</strong> {record.diagnosis || 'No diagnosis'}
                    </p>
                    <p className="doctor-detail">
                        <strong>Medication:</strong> {record.medication.join(', ') || 'No medication'}
                    </p>
                    <a href={record.pdf_url} className="doctor-button">
                        Download PDF
                    </a>
                </div>
            ))}
        </div>
    );
};

export default DoctorProfile;