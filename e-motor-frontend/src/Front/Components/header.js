import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Preloader from './Preloader';

function Header() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  const handleMobileNavToggle = () => {
    document.body.classList.toggle('mobile-nav-active');
    const mobileNavToggleIcon = document.querySelector('.mobile-nav-toggle');
    mobileNavToggleIcon.classList.toggle('bi-list');
    mobileNavToggleIcon.classList.toggle('bi-x');
  };

  useEffect(() => {
    // Simulate a data fetch or some loading process
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Preloader />;
  }


  return (
    <header id="header" className="header d-flex align-items-center fixed-top">

      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="/" className="logo d-flex align-items-center me-auto">
          <img src="assets/img/logo.png" alt="E-Motor logo" />
          <h1 className="sitename">E-Motor</h1>
        </a>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <a href="/#hero" className="active pointer">
                Home
              </a>
            </li>
            <li>
              <a href="/#about" className="pointer">
                About
              </a>
            </li>
            <li>
              <a href="/#features" className="pointer">
                Features
              </a>
            </li>
            <li>
              <a href="/#services" className="pointer">
                Services
              </a>
            </li>
            <li>
              <a href="/#contact" className="pointer">
                Contact
              </a>
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={handleMobileNavToggle}></i>
        </nav>

        {/* <Link to="/vehicleinfo" className="btn-getstarted">
          Take Your Certificate
        </Link> */}

        {/* Conditionally render the "Take Your Certificate" link */}
        {location.pathname === '/' && (
          <Link to="/vehicleinfo" className="btn-getstarted">
            Take Your Certificate
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
