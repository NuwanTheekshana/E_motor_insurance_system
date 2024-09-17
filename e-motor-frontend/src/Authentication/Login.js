import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '../img/emotor.gif';
import './login.css';
import Swal from 'sweetalert2';

function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/csrf-token', { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const data = {
      email: Email,
      password: Password,
    };

    const url = 'http://127.0.0.1:8001/api/admin/login';

    axios
      .post(url, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      })
      .then((result) => {
        const { token } = result.data;
        
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('id', result.data.user.user_id);
          localStorage.setItem('fname', result.data.user.fname);
          localStorage.setItem('lname', result.data.user.lname);
          localStorage.setItem('email', result.data.user.email);
          localStorage.setItem('status', result.data.user.status);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigate('/admin/home');
        } else {

          Swal.fire({title: 'Warning', text: 'Login failed. No token received.', icon: 'error' }).then((result) => {
            if (result.isConfirmed) {
              window.scrollTo({top: 0,behavior: 'smooth'});
            }
          });
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        Swal.fire({title: 'Warning', text: 'Login failed. Please check your credentials.', icon: 'error' }).then((result) => {
          if (result.isConfirmed) {
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
      });
  };

  return (
    <div className="login-background">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-primary">
              <div className="card-body">
                <center>
                  <img src={notFoundImage} className="img-fluid mb-4" width="50%" alt="Logo" />
                </center>
                <h2 className="text-center mb-4 text-primary">Log In</h2>

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-primary">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter email"
                      required
                      value={Email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-primary">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      required
                      value={Password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="form-check-label text-primary" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-person-fill-lock"></i> Log In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
