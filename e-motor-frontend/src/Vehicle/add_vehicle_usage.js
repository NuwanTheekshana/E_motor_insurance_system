import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddVehicleUsage() {
    const auth_userid = localStorage.getItem("id");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        usage_id: '',
        usage_type: '',
    });
    const [formErrors, setFormErrors] = useState({
        usage_id: '',
        usage_type: '',
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        usage_id: '',
        usage_type: '',
      });
      setFormErrors({
        usage_id: '',
        usage_type: '',
      });
    };
  
    const [editingAllUsage, seteditingAllUsage] = useState(null);
    const [deletingAllUsage, setDeletingAllUsage] = useState(null);
    const [AllUsage, setAllUsage] = useState([]); 
    
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const tableRef = useRef(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/admin/vehicleusage');
        setAllUsage(response.data);
  
        if ($.fn.DataTable.isDataTable('#tableId')) {
          tableRef.current.DataTable().destroy();
        }
        tableRef.current = $('#tableId').DataTable({
          data: response.data.usage,
          columns: [
            { data: 'usage_id', title: 'Usage Id' },
            { data: 'usage_type', title: 'Usage Type' },
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
        console.error('Error fetching All Usage list', error);
      }
    };
  
    const renderActionButtons = (data, type, row) => {
      return (
        '<center>' +
        '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
        row.usage_id + ', \'' + row.usage_type + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
        '&nbsp;' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
        row.usage_id +
        ')"><i class="bi bi-trash"></i> Delete</button>' +
        '</center>'
      );
    };

    window.handleEdit = (usage_id, usage_type) => {
      seteditingAllUsage(usage_id);
      setFormData({
        usage_id: usage_id,
        usage_type: usage_type,
      });
      handleShowModal();
  };
  
  window.handleDelete = (usage_id) => {
      setDeletingAllUsage(usage_id);
      handleShowDeleteModal();
    };
  
    const handleDeleteAllUsage = async () => {
      try {
        let response;
        response = await axios.delete(`http://127.0.0.1:8001/api/admin/vehicleusage/${deletingAllUsage}`);
      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseDeleteModal();
      } catch (error) {
      console.error('Error deleting usage', error);
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
  
    const handleAddUsage = async () => {
      try {
        const errors = {};
        if (!editingAllUsage) 
        {

          if (!formData.usage_id) {
            errors.usage_id = 'Usage id is required.';
          }
          if (!formData.usage_type) {
            errors.usage_type = 'Usage type is required.';
          }
        }
        else
        {
          if (!formData.usage_type) {
            errors.usage_type = 'Usage type is required.';
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
                usage_id: formData.usage_id,
                usage_type: formData.usage_type,
                user_id: auth_userid,
           }
           let response;
           if (editingAllUsage) {
            response = await axios.put(`http://127.0.0.1:8001/api/admin/vehicleusage/${editingAllUsage}`, formData);
          } else {
            response = await axios.post('http://127.0.0.1:8001/api/admin/vehicleusage', data);
        }
        Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        handleCloseModal();
        
      } catch (error) {
        console.error('Usage added failed', error);
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
              <h4>Vehicle Usage List</h4>
              <Button variant="warning" size="sm" onClick={handleShowModal}>
              <i class="bi bi-plus-circle-fill"></i> &nbsp; Add New Usage
              </Button>
            </div>
            <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Usage ID</th>
                    <th>Usage Name</th>
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
            <Modal.Title>{editingAllUsage ? 'Edit Vehicle Usage' : 'Add Vehicle Usage'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {!editingAllUsage ?
          <form>
              <div className="mb-3">
                <label htmlFor="usage_id" className="form-label">
                  Usage Id
                </label>
                <input type="text" className={`form-control ${formErrors.usage_id ? 'is-invalid' : ''}`} id="usage_id" name="usage_id" placeholder="" value={formData.usage_id} onChange={handleInputChange}/>
                {formErrors.usage_id && <div className="invalid-feedback">{formErrors.usage_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="usage_type" className="form-label">
                  Usage Type
                </label>
                <input type="text" className={`form-control ${formErrors.usage_type ? 'is-invalid' : ''}`} id="usage_type" name="usage_type" placeholder="" value={formData.usage_type} onChange={handleInputChange}/>
                {formErrors.usage_type && <div className="invalid-feedback">{formErrors.usage_type}</div>}
              </div>

            </form>

            : 

            <form>
               <div className="mb-3">
                <label htmlFor="usage_id" className="form-label">
                  Usage Id
                </label>
                <input type="text" className={`form-control ${formErrors.usage_id ? 'is-invalid' : ''}`} id="usage_id" name="usage_id" placeholder="" value={formData.usage_id} onChange={handleInputChange} disabled/>
                {formErrors.usage_id && <div className="invalid-feedback">{formErrors.usage_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="usage_type" className="form-label">
                  Usage Type
                </label>
                <input type="text" className={`form-control ${formErrors.usage_type ? 'is-invalid' : ''}`} id="usage_type" name="usage_type" placeholder="" value={formData.usage_type} onChange={handleInputChange}/>
                {formErrors.usage_type && <div className="invalid-feedback">{formErrors.usage_type}</div>}
              </div>

            </form>
          }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            <i class="bi bi-x-circle-fill"></i>  Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddUsage}>
            <i class="bi bi-send-fill"></i> &nbsp; {editingAllUsage ? 'Save Changes' : 'Add Usage'}
            </Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this usage?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp;  Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAllUsage}>
            <i class="bi bi-send-fill"></i> &nbsp; Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )

}

export default AddVehicleUsage;