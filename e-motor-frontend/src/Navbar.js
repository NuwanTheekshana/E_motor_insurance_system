import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import comlogo from './img/logo.png';

import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'jquery/dist/jquery.min.js'; 
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';



function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 100,
    });
  }, []);

  const token = localStorage.getItem("token");
  const UserName = localStorage.getItem("fname")+' '+localStorage.getItem("lname");

  useEffect(() => {
    if (token === null) {
      navigate('/');
    }
  }, [navigate]);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    localStorage.removeItem('email');
    localStorage.removeItem('status');
    navigate('/admin');
  }

  return (
    
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        &nbsp; &nbsp;&nbsp;<img src={comlogo} className="img-fluid logo" style={{ width: '3%' }}  alt="Company Logo" />
            &nbsp;&nbsp;&nbsp;
                <Link to="/admin/home" className="navbar-brand">
                  <b>E-Motor - Admin Pannel</b>
                </Link>
            <div className="container">

                <ul></ul>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>



                <ul className="navbar-nav ms-auto">

                    <li class="nav-item">
                        <a class="nav-link" href="/admin/home">
                        <i class="bi bi-house-door-fill"></i> &nbsp; Home</a>
                        
                    </li>

                    <ul></ul>

                            <li className="nav-item dropdown">
                                <a id="navbarDropdownConsultant" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bi bi-car-front-fill"></i> &nbsp; Vehicle
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownConsultant">
                                    <Link to="/admin/vehiclecategory" className="dropdown-item">
                                        Add Vehicle Category
                                    </Link>
                                    <Link to="/admin/vehicleusage" className="dropdown-item">
                                        Add Vehicle Usage
                                    </Link>
                                    <Link to="/admin/vehiclefueltype" className="dropdown-item">
                                        Add Fuel Type
                                    </Link>
                                </div>
                            </li>

                            <ul></ul>

                            <li className="nav-item dropdown">
                                <a id="navbarDropdownConsultant" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bi bi-shield-fill-check"></i> &nbsp;  Policy Covers
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownConsultant">
                                    <Link to="/admin/add_policy_covers" className="dropdown-item">
                                        Add Policy Covers
                                    </Link>
                                    <Link to="/admin/vehicle_rate_discount" className="dropdown-item">
                                        Add Vehicle Rates & Discounts
                                    </Link>
                                    
                                </div>
                            </li>

                            <ul></ul>

                            <li className="nav-item dropdown">
                                <a id="navbarDropdownConsultant" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bi bi-card-list"></i> &nbsp; Black List
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownConsultant">
                                    <Link to="/admin/vehicleblacklist" className="dropdown-item">
                                        Add Total Loss & Black List Vehicles
                                    </Link>
                                    <Link to="/admin/blacklistcustomers" className="dropdown-item">
                                        Add Black List Customers
                                    </Link>
                                    
                                </div>
                            </li>
                            
                </ul>

                <ul></ul>

            
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                        <a id="user_dataDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="bi bi-file-bar-graph-fill"></i> &nbsp;  Report
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="user_dataDropdown">
                            <Link to="/admin/policylistreport" className="dropdown-item">
                            Policy List
                            </Link>
                        </div>
                        </li>
                    </ul>

                <ul></ul>

            
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                        <a id="user_dataDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="bi bi-people-fill"></i> &nbsp;  Users
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="user_dataDropdown">
                            <Link to="/admin/users" className="dropdown-item">
                            User List
                            </Link>
                        </div>
                        </li>
                    </ul>
                 

                    

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    

                    <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="bi bi-person-circle"></i> &nbsp;  {UserName}
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" onClick={logout}>
                                        Logout
                                    </a>

                                </div>
                            </li>
                    </ul>


                </div>


            </div>
        </nav>
  );
}

export default Navbar;
