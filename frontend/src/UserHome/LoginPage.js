import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, Setemail] = useState('')
  const [password, Setpassword] = useState("")
  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("user", JSON.stringify({ email: "admin@gmail.com", role: "admin" }));
      window.location.href = "/admin";
      return;
    }

    const param = { email, password };

    fetch("http://localhost:5000/demo/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 1) {
          localStorage.setItem("user", JSON.stringify(result));
          window.location.href = "/staffhome";
        } else if (result.status === 2) {
          localStorage.setItem("user", JSON.stringify(result));
          window.location.href = "/parenthome";
        } else if (result.status === 3) {
          localStorage.setItem("user", JSON.stringify(result));
          window.location.href = "/"; // You can change this to actual route
        } else if (result.status === 4) {
          localStorage.setItem("user", JSON.stringify(result));
          window.location.href = "/";
        } else {
          alert(result.message || "Login failed");
        }
      })
      .catch(error => console.log("Error:", error));
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #ffccf2, #b3d9ff)',
      fontFamily: 'Arial, sans-serif',
      margin: '0',
      padding: '0',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#333',
      overflow: 'hidden',
      position: 'relative',
    },
    babyImage: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'babyMove 10s infinite linear',
      zIndex: -1,
    },
    babyImgStyle: {
      width: '300px',
      height: 'auto',
      borderRadius: '50%',
      opacity: 0.8,
    },
    formContainer: {
      backgroundColor: '#fffef0',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0, 26, 255, 0.3)',
      width: '500px',
      textAlign: 'center',
      position: 'relative',
      animation: 'fadeIn 1s ease-in-out',
    },
    title: {
      color: '#040677',
      marginBottom: '30px',
      animation: 'slideDown 0.8s ease-out',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #040677',
      borderRadius: '5px',
      backgroundColor: 'white',
      color: '#333',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#040677',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
      animation: 'pulse 2s infinite',
      marginBottom: '15px',
    },
    rememberMe: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
      marginBottom: '15px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    link: {
      color: '#040677',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
    footer: {
      marginTop: '30px',
      borderTop: '1px solid #ffeeaa',
      paddingTop: '15px',
    },
    footerText: {
      color: '#666',
      marginBottom: '15px',
    },
    footerLink: {
      display: 'inline-block',
      color: '#040677',
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'color 0.3s, transform 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      {/* Baby Image Moving in the Background */}


      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back</h1>

        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <input type="email" placeholder="Email" style={styles.input} onChange={(e) => Setemail(e.target.value)} value={email} />
        </div>

        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <input type="password" placeholder="Password" style={styles.input} onChange={(e) => Setpassword(e.target.value)} value={password} />
        </div>

        <button style={styles.button} onClick={handleLogin}>LOGIN</button>

        <div style={styles.rememberMe}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" style={{ marginRight: '5px' }} />
            <span style={{ color: '#666' }}>Remember me</span>
          </label>
        </div>

        {/* <div style={styles.footer}>
          <p style={styles.footerText}>Don't have an account?</p>
          <a href="" style={styles.footerLink}><Link to="/registration">
            SIGN UP
         </Link> </a>
        </div> */}
      </div>

      <style>
        {`
          @keyframes babyMove {
            0% {
              transform: translate(-50%, -50%) translateX(0);
            }
            50% {
              transform: translate(-50%, -50%) translateX(100px);
            }
            100% {
              transform: translate(-50%, -50%) translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;