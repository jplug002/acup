import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/MembershipForm.css';

const MembershipForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    region: '',
    country: '',
    profession: '',
    gender: '',
    volunteerStatus: false,
    motivation: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    navigate('/thank-you'); // Redirect to a thank you page
  };

  return (
    <div className="membership-form">
      <h2>Join ACUP</h2>
      <form onSubmit={handleSubmit} className="compact-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="volunteerStatus">Volunteer Status</label>
          <div className="volunteer-checkbox">
            <input
              type="checkbox"
              id="volunteerStatus"
              name="volunteerStatus"
              checked={formData.volunteerStatus}
              onChange={handleChange}
            />
            <span>Yes, I am interested in volunteering</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="motivation">Motivation</label>
          <textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            required
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="cta-button">Get Started</button>
      </form>
    </div>
  );
};

export default MembershipForm;
