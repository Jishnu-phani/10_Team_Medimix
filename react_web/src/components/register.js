import React, { useState } from 'react';
import './styles_register.css';

const Registration = () => {
  const [activeForm, setActiveForm] = useState(null);

  const submitForm = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(result.message);
      window.location.href = 'http://localhost:3000/login';
    } catch (error) {
      alert('Error submitting form');
    }
    alert(JSON.stringify(formData));
    
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'patient',
      email: e.target.email.value,
      phone: e.target.phoneno.value,
      gender: e.target.gender.value,
      name: e.target.name.value,
      dob: e.target.dob.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'doctor',
      email: e.target.email.value,
      phone: e.target.phoneno.value,
      name: e.target.name.value,
      location: e.target.location.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  const handlePharmacistSubmit = (e) => {
    e.preventDefault();
    const formData = {
      role: 'pharmacist',
      email: e.target.email.value,
      phone: e.target.phoneno.value,
      name: e.target.name.value,
      location: e.target.location.value,
      password: e.target.password.value
    };
    submitForm(formData);
  };

  return (
    <div className="registration-body">
      <div className="registration-container">
        <h2 className='register_h2'>Register your Account</h2>

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
          <form className="registration-form" onSubmit={handlePatientSubmit}>
            <h3>Patient Registration</h3>
            
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
            />

            <label>Phone No :</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Name:</label>
            <input
              type="text"
              name="name"
              required
            />

            <label>Gender :</label>
            <input
              type="text"
              name="gender"
              required
            />
            

            <label>DOB:</label>
            <input
              type="date"
              name="dob"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
            />

            <button type="submit">
              Register as Patient
            </button>
          </form>
        )}

        {activeForm === 'Doctor' && (
          <form className="registration-form" onSubmit={handleDoctorSubmit}>
            <h3>Doctor Registration</h3>
            
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
            />

            <label>Phone No :</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Name:</label>
            <input
              type="text"
              name="name"
              required
            />
            

            <label>Clinic / Hospital :</label>
            <input
              type="text"
              name="location"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
            />

            <button type="submit">
              Register as Doctor
            </button>
          </form>
        )}

        {activeForm === 'Pharmacist' && (
          <form className="registration-form" onSubmit={handlePharmacistSubmit}>
            <h3>Doctor Registration</h3>
            
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
            />

            <label>Phone No :</label>
            <input
              type="phone"
              pattern="[6-9]{1}[0-9]{9}"
              name="phoneno"
              required
            />

            <label>Name:</label>
            <input
              type="text"
              name="name"
              required
            />
            

            <label>Pharmacy :</label>
            <input
              type="text"
              name="location"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
            />

            <button type="submit">
              Register as Pharmacist
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Registration;