import React, { useState } from "react";
import styles from "../STYLES/AuthCard.module.css";
import { supabase } from '../supabaseClient'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.userType) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;

      // 2. Check if email is a student email
      const studentDomains = ['up.edu.ph', 'ateneo.edu', 'dlsu.edu.ph', 'ust.edu.ph', 'admu.edu.ph'];
      const isStudentEmail = studentDomains.some(domain => formData.email.endsWith('@' + domain));

      // 3. Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          user_type: formData.userType,
          is_verified_student: isStudentEmail
        });

      if (profileError) throw profileError;

      alert('Registration successful! Please check your email to verify your account.');
      // Redirect to login
      window.location.href = '/login';

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/bg-loginpic.jpg')",
        backgroundColor: "rgba(17, 21, 67, 0.5)",
        backgroundBlendMode: "multiply",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div className={styles.transparenCard} style={{ borderRadius: "1rem", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: "2", borderRadius: "1.5rem" }}>
          <div className={styles.transparentCard}>
            <div className={styles.title}>Register</div>
            <div className={styles.subtitle}>
              Create your account to get started
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <input
                className={styles.input}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <select 
                className={styles.input} 
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Account Type</option>
                <option value="student">Student</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
              <button 
                className={styles.button} 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className={styles.switch}>
              Already have an account?{" "}
              <a href="/login" className={styles.link}>Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;