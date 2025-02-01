import React, { useState } from 'react';
import './styles_login.css';

const Logindone = () => {
  const [activeForm, setActiveForm] = useState(null);
  const redirection = {
    patient: 'http://localhost:3000/patient',
    doctor: 'http://localhost:3000/record',
    pharmacist: 'http://localhost:3000/pharmacist'
  }
  const submitForm = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(result.message);
      console.log(redirection[formData.role]);
      if (formData.role === 'patient') {
        const sendPhone = await fetch("http://localhost:3000/patient", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.phone)
        });
        const sendPhoneResult = await sendPhone.json();
        alert(sendPhoneResult.message)
        window.location.href = redirection[formData.role];
      }
      else if (formData.role === 'doctor') {
        const sendPhone = await fetch("http://localhost:3000/doctor", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.phone)
        });
        const sendPhoneResult = await sendPhone.json();
        alert(sendPhoneResult.message)
        window.location.href = redirection[formData.role];
      }
        // window.location.href = redirection[formData.role]+"/"+formData.phone;
      else 
        window.location.href = redirection[formData.role];
    } catch (error) {
      alert('Error submitting form');
    }
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'patient',
      phone: e.target.phoneno.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'doctor',
      phone: e.target.phoneno.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  const handlePharmacistSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'pharmacist',
      phone: e.target.phoneno.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Login to your Account</h2>

        <div className="role-selection">
          <button onClick={() => setActiveForm('Patient')}>
            Patient
          </button>
          <button onClick={() => setActiveForm('Doctor')}>
            Doctor
          </button>
          <button onClick={() => setActiveForm('Pharmacist')}>
            Pharmacist
          </button>
        </div>

        {activeForm === 'Patient' && (
          <form className="login-form" onSubmit={handlePatientSubmit}>
            <h3>Patient Login</h3>
            
            <label>Phone No:</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
            />

            <button type="submit">
              Login as Patient
            </button>
          </form>
        )}

        {activeForm === 'Doctor' && (
          <form className="login-form" onSubmit={handleDoctorSubmit}>
            <h3>Doctor Login</h3>
            
            <label>Phone No:</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />

            <button type="submit">
              Login as Doctor
            </button>
          </form>
        )}

        {activeForm === 'Pharmacist' && (
          <form className="login-form" onSubmit={handlePharmacistSubmit}>
            <h3>Pharmacist Login</h3>
            
            <label>Phone No:</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />

            <button type="submit">
              Login as Pharmacist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Logindone;