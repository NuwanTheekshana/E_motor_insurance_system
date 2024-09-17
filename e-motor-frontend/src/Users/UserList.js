import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function UserList() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    password_confirmation: '',
  });
  const [formErrors, setFormErrors] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    password_confirmation: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    password_confirmation: '',
    });
    setFormErrors({
      First_Name: '',
      Last_Name: '',
      Email: '',
      Password: '',
      password_confirmation: '',
    });
  };


  const [editingAllUser, seteditingAllUser] = useState(null);
  const [deletingAllUser, setDeletingAllUser] = useState(null);
  const [AllUser, setAllUser] = useState([]); 
  

  useEffect(() => {
    fetchData();
  }, []);


  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/api/admin/users');
      setAllUser(response.data);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data.user,
        columns: [
          { data: 'user_id', title: 'User Id' },
          { data: 'fname', title: 'First Name' },
          { data: 'lname', title: 'Last Name' },
          { data: 'email', title: 'Email' },
          {
            data: 'status', title: 'Status',
            render: function (data, type, row) {
              return data == 1 ? 'Active' : 'Inactive';
            }
          },
          {
            data: null,
            render: renderActionButtons,
          },
        ],
        language: {
          emptyTable: 'No data available in table',
        },
      });
    } catch (error) {
      console.error('Error fetching All User list', error);
    }
  };

  const renderActionButtons = (data, type, row) => {
    return (
      '<center>' +
      '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
      row.user_id + ', \'' + row.fname + '\', \'' + row.lname + '\', \'' + row.email +'\', \'' + row.status +'\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.user_id +
      ')">Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (user_id, fname, lname, email, permission) => {
    seteditingAllUser(user_id);
    setFormData({
        user_id: user_id,
        fname: fname,
        lname: lname,
        email: email,
    });
    handleShowModal();
};

window.handleDelete = (user_id) => {
    setDeletingAllUser(user_id);
    handleShowDeleteModal();
  };

  const handleDeleteAllUser = async () => {
    try {
    await axios.delete(`http://127.0.0.1:8001/api/admin/users/${deletingAllUser}`);
    console.log('User deleted successfully');
    Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting user', error);
    Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
      if (result.isConfirmed) {
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    }
};

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    try {
      const errors = {};

      if (!editingAllUser) 
      {
      if (!formData.First_Name) {
        errors.First_Name = 'First name is required.';
      }
      if (!formData.Last_Name) {
        errors.Last_Name = 'Last name is required.';
      }
      if (!formData.Email) {
        errors.Email = 'Email is required.';
      }else if (!isValidEmail(formData.Email)) {
        errors.Email = 'Please enter a valid email address.';
      } 
      if (!formData.Password) {
        errors.Password = 'Password is required.';
      }
      if (!formData.password_confirmation) {
        errors.password_confirmation = 'Confirm Password is required.';
      }
    }
    else
    {
      
      if (!formData.fname) {
        errors.fname = 'First name is required.';
      }
      if (!formData.lname) {
        errors.lname = 'Last name is required.';
      }
      if (!formData.email) {
        errors.email = 'Email is required.';
      }else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address.';
      }

      
    }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
          if (result.isConfirmed) {
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        return;
      }

      const data = {
        fname: formData.First_Name,
        lname: formData.Last_Name,
        email: formData.Email,
        password: formData.Password,
        password_confirmation: formData.password_confirmation
    }

      if (editingAllUser) {
        await axios.put(`http://127.0.0.1:8001/api/admin/users/${editingAllUser}`, formData);
      } else {
        await axios.post('http://127.0.0.1:8001/api/admin/registration', data);
      }
      console.log('User added successfully');
      Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('User added failed', error);
      Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
        if (result.isConfirmed) {
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
    }
  };


  return(
    <div className="background-container">
      <Navbar />
       
      <div className="container px-4">
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center small">
            <h4>User List</h4>
            <Button variant="warning" size="sm" onClick={handleShowModal}>
            <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New Users
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>



      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAllUser ? 'Edit Users' : 'Add New Users'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllUser ?
        <form>
            <div className="mb-3">
              <label htmlFor="First_Name" className="form-label">
                First Name
              </label>
              <input type="text" className={`form-control ${formErrors.First_Name ? 'is-invalid' : ''}`} id="First_Name" name="First_Name" placeholder="" value={formData.First_Name} onChange={handleInputChange}/>
              {formErrors.First_Name && <div className="invalid-feedback">{formErrors.First_Name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Last_Name" className="form-label">
                Last Name
              </label>
              <input type="text" className={`form-control ${formErrors.Last_Name ? 'is-invalid' : ''}`} id="Last_Name" name="Last_Name" placeholder="" value={formData.Last_Name} onChange={handleInputChange}/>
              {formErrors.Last_Name && <div className="invalid-feedback">{formErrors.Last_Name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input type="email" className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`} id="Email" name="Email" placeholder="" value={formData.Email} onChange={handleInputChange}/>
              {formErrors.Email && <div className="invalid-feedback">{formErrors.Email}</div>}
            </div>

          
          <div className="mb-3">
              <label htmlFor="Password" className="form-label">
                Password
              </label>
              <input type="password" className={`form-control ${formErrors.Password ? 'is-invalid' : ''}`} id="Password" name="Password" placeholder="" value={formData.Password} onChange={handleInputChange}/>
              {formErrors.Password && <div className="invalid-feedback">{formErrors.Password}</div>}
            </div> 

            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <input type="password" className={`form-control ${formErrors.password_confirmation ? 'is-invalid' : ''}`} id="password_confirmation" name="password_confirmation" placeholder="" value={formData.password_confirmation} onChange={handleInputChange}/>
              {formErrors.Password && <div className="invalid-feedback">{formErrors.password_confirmation}</div>}
            </div> 

          </form>

          
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="user_id" className="form-label">
                User Id
              </label>
              <input type="text" className={`form-control ${formErrors.user_id ? 'is-invalid' : ''}`} id="user_id" name="user_id" placeholder="" value={formData.user_id} onChange={handleInputChange} disabled/>
              {formErrors.user_id && <div className="invalid-feedback">{formErrors.user_id}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                First Name
              </label>
              <input type="text" className={`form-control ${formErrors.fname ? 'is-invalid' : ''}`} id="fname" name="fname" placeholder="" value={formData.fname} onChange={handleInputChange}/>
              {formErrors.fname && <div className="invalid-feedback">{formErrors.fname}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="lname" className="form-label">
                Last Name
              </label>
              <input type="text" className={`form-control ${formErrors.lname ? 'is-invalid' : ''}`} id="lname" name="lname" placeholder="" value={formData.lname} onChange={handleInputChange}/>
              {formErrors.lname && <div className="invalid-feedback">{formErrors.lname}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} id="email" name="email" placeholder="" value={formData.email} onChange={handleInputChange}/>
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>

            
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddUser}>
            {editingAllUser ? 'Save Changes' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this User?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteAllUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserList;
