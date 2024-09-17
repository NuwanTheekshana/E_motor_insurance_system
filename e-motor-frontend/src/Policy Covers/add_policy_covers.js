import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function CoverList() {
  const auth_userid = localStorage.getItem("id");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    cover_name: '',
    cover_amount: '',
    Cover_sys_amount: ''
  });
  const [formErrors, setFormErrors] = useState({
    cover_name: '',
    cover_amount: '',
    Cover_sys_amount: ''
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
        cover_name: '',
        cover_amount: '',
        Cover_sys_amount: ''
    });
    setFormErrors({
        cover_name: '',
        cover_amount: '',
        Cover_sys_amount: ''
    });
  };


  const [editingAllCover, seteditingAllCover] = useState(null);
  const [deletingAllCover, setDeletingAllCover] = useState(null);
  const [AllCover, setAllCover] = useState([]); 
  

  useEffect(() => {
    fetchData();
  }, []);


  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/api/admin/policycovers');
      setAllCover(response.data);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data.cover,
        columns: [
          { data: 'cover_id', title: 'Cover Id' },
          { data: 'cover_name', title: 'First Name' },
          { data: 'cover_amount', title: 'Last Name' },
          { data: 'cover_sys_amount', title: 'Cover_sys_amount' },
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
      console.error('Error fetching All Cover list', error);
    }
  };

  const renderActionButtons = (data, type, row) => {
    return (
      '<center>' +
      '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
      row.cover_id + ', \'' + row.cover_name + '\', \'' + row.cover_amount + '\', \'' + row.cover_sys_amount +'\', \'' + row.status +'\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.cover_id +
      ')"><i class="bi bi-trash"></i> Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (cover_id, cover_name, cover_amount, cover_sys_amount) => {
    seteditingAllCover(cover_id);
    setFormData({
        cover_id: cover_id,
        cover_name: cover_name,
        cover_amount: cover_amount,
        cover_sys_amount: cover_sys_amount,
    });
    handleShowModal();
};

window.handleDelete = (cover_id) => {
    setDeletingAllCover(cover_id);
    handleShowDeleteModal();
  };

  const handleDeleteAllCover = async () => {
    try {
      let response;
      response = await axios.delete(`http://127.0.0.1:8001/api/admin/policycovers/${deletingAllCover}`);
    Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting cover', error);
    Swal.fire({title: 'Warning', text: error.message, icon: 'error' }).then((result) => {
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

  const handleAddCover = async () => {
    try {
      const errors = {};

      if (!editingAllCover) 
      {
      if (!formData.cover_name) {
        errors.cover_name = 'Cover name is required.';
      }
      if (!formData.cover_amount) {
        errors.cover_amount = 'Cover amount is required.';
      }
      if (!formData.cover_sys_amount) {
        errors.cover_sys_amount = 'System cover amount is required.';
      }

    }
    else
    {
      
      if (!formData.cover_name) {
        errors.cover_name = 'Cover name is required.';
      }
      if (!formData.cover_amount) {
        errors.cover_amount = 'Cover name is required.';
      }
      if (!formData.cover_amount) {
        errors.cover_amount = 'System cover amount is required.';
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
        user_id: auth_userid,
        cover_name: formData.cover_name,
        cover_amount: formData.cover_amount,
        cover_sys_amount: formData.cover_sys_amount,
    }
    console.log(data);
    let response;
      if (editingAllCover) {
        response = await axios.put(`http://127.0.0.1:8001/api/admin/policycovers/${editingAllCover}`, formData);
      } else {
        response = await axios.post('http://127.0.0.1:8001/api/admin/policycovers', data);
      }
      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('Cover added failed', error);
      Swal.fire({title: 'Warning', text: error.message, icon: 'error' }).then((result) => {
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
            <h4>Policy Covers List</h4>
            <Button variant="warning" size="sm" onClick={handleShowModal}>
            <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New Policy Cover
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Cover ID</th>
                  <th>Cover Name</th>
                  <th>Cover_sys_amount</th>
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
          <Modal.Title>{editingAllCover ? 'Edit Covers' : 'Add New Covers'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllCover ?
        <form>
            <div className="mb-3">
              <label htmlFor="cover_name" className="form-label">
                Cover Name
              </label>
              <input type="text" className={`form-control ${formErrors.cover_name ? 'is-invalid' : ''}`} id="cover_name" name="cover_name" placeholder="" value={formData.cover_name} onChange={handleInputChange}/>
              {formErrors.cover_name && <div className="invalid-feedback">{formErrors.cover_name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cover_amount" className="form-label">
                Cover Amount
              </label>
              <input type="number" className={`form-control ${formErrors.cover_amount ? 'is-invalid' : ''}`} id="cover_amount" name="cover_amount" placeholder="" value={formData.cover_amount} onChange={handleInputChange}/>
              {formErrors.cover_amount && <div className="invalid-feedback">{formErrors.cover_amount}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cover_sys_amount" className="form-label">
                Cover System Amount
              </label>
              <input type="number" className={`form-control ${formErrors.cover_sys_amount ? 'is-invalid' : ''}`} id="cover_sys_amount" name="cover_sys_amount" placeholder="" value={formData.cover_sys_amount} onChange={handleInputChange}/>
              {formErrors.cover_sys_amount && <div className="invalid-feedback">{formErrors.cover_sys_amount}</div>}
            </div>
          </form>

          
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="cover_id" className="form-label">
                Cover Id
              </label>
              <input type="text" className={`form-control ${formErrors.cover_id ? 'is-invalid' : ''}`} id="cover_id" name="cover_id" placeholder="" value={formData.cover_id} onChange={handleInputChange} disabled/>
              {formErrors.cover_id && <div className="invalid-feedback">{formErrors.cover_id}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="cover_name" className="form-label">
                Cover Name
              </label>
              <input type="text" className={`form-control ${formErrors.cover_name ? 'is-invalid' : ''}`} id="cover_name" name="cover_name" placeholder="" value={formData.cover_name} onChange={handleInputChange}/>
              {formErrors.cover_name && <div className="invalid-feedback">{formErrors.cover_name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cover_amount" className="form-label">
                Cover Amount
              </label>
              <input type="number" className={`form-control ${formErrors.cover_amount ? 'is-invalid' : ''}`} id="cover_amount" name="cover_amount" placeholder="" value={formData.cover_amount} onChange={handleInputChange}/>
              {formErrors.cover_amount && <div className="invalid-feedback">{formErrors.cover_amount}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cover_sys_amount" className="form-label">
                Cover System Amount
              </label>
              <input type="number" className={`form-control ${formErrors.cover_sys_amount ? 'is-invalid' : ''}`} id="cover_sys_amount" name="cover_sys_amount" placeholder="" value={formData.cover_sys_amount} onChange={handleInputChange}/>
              {formErrors.cover_sys_amount && <div className="invalid-feedback">{formErrors.cover_sys_amount}</div>}
            </div>

            
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
          <i class="bi bi-x-circle-fill"></i>&nbsp;   Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddCover}>
          <i class="bi bi-send-fill"></i> &nbsp; {editingAllCover ? 'Save Changes' : 'Add Cover'}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Cover?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
          <i class="bi bi-x-circle-fill"></i>&nbsp;   Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteAllCover}>
          <i class="bi bi-send-fill"></i> &nbsp;  Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CoverList;
