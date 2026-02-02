import React from "react";
import { FaFacebookF, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import styles from "../STYLES/AuthCard.module.css";

const Login = () => (
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
    }}
  >
    {/* Outer flex container holding both cards */}
    <div
      style={{
        display: "flex",
        alignItems: "stretch",     // make both cards the same height
        justifyContent: "flex-start", // remove gap between them
      }}
    >
      {/* LEFT: Login card */}
      <div className={styles.transparenCard}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: "2",
          }}
        >
          <img
            src="/images/AOSlogo(sub).svg"
            alt="Logo"
            style={{ height: 60, marginBottom: "1rem" }}
          />
        </div>

        {/* Login form */}
        <form>
          <input
            className={styles.input}
            type="email"
            placeholder="Email Address"
            autoComplete="username"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <label>
              <input type="checkbox" style={{ marginRight: 6 }} /> Remember Me
            </label>
            <span className={styles.link}>Forgot Password?</span>
          </div>
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={styles.button}
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Switch to signup */}
        <div className={styles.switch}>
          Don’t have an account?{" "}
          <a href="/register" className={styles.link}>
            Sign Up
          </a>
        </div>

        {/* Social login */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#64748b",
          }}
        >
          Or login with
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "0.5rem",
          }}
        >
          <a
            href="https://www.facebook.com/YourPage"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <FaLinkedinIn size={24} />
          </a>
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <FaGoogle size={24} />
          </a>
        </div>
      </div>

      {/* RIGHT: Image card */}
<div
  className="relative rounded-r-2xl overflow-hidden"
  style={{
    flex: 1,
    display: "flex",
    minHeight: "100%",
  }}
>
  {/* Background image */}
  <img
    src="/images/login pic.jpg"
    alt="Building"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Shadow overlay */}
  <div
    className="absolute inset-0 rounded-r-2xl"
    style={{
      boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.5)",
      pointerEvents: "none",
    }}
  ></div>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/20"></div>

  {/* Content overlay (TOP RIGHT) */}
  <div
    className="relative z-10 flex justify-end items-start"
    style={{
      padding: "1rem", // spacing from edges
      width: "100%",
      marginLeft: "19rem",
    }}
  >
    <img
      src="/images/AOSlogo(Login).svg"
      alt="Logo"
      style={{ height: 80, marginTop: "-.5rem" }}
    />
  </div>
</div>

    </div>
  </div>
);

export default Login;
