import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddVehicleFuel() {
    const auth_userid = localStorage.getItem("id");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        fuel_id: '',
        fuel_type: '',
    });
    const [formErrors, setFormErrors] = useState({
        fuel_id: '',
        fuel_type: '',
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        fuel_id: '',
        fuel_type: '',
      });
      setFormErrors({
        fuel_id: '',
        fuel_type: '',
      });
    };
  
    const [editingAllFuel, seteditingAllFuel] = useState(null);
    const [deletingAllFuel, setDeletingAllFuel] = useState(null);
    const [AllFuel, setAllFuel] = useState([]); 
    
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const tableRef = useRef(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/admin/vehiclefuel');
        setAllFuel(response.data);
  
        if ($.fn.DataTable.isDataTable('#tableId')) {
          tableRef.current.DataTable().destroy();
        }
        tableRef.current = $('#tableId').DataTable({
          data: response.data.fuel,
          columns: [
            { data: 'fuel_id', title: 'Fuel Id' },
            { data: 'fuel_type', title: 'Fuel Type' },
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
        console.error('Error fetching All Fuel list', error);
      }
    };
  
    const renderActionButtons = (data, type, row) => {
      return (
        '<center>' +
        '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
        row.fuel_id + ', \'' + row.fuel_type + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
        '&nbsp;' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
        row.fuel_id +
        ')"><i class="bi bi-trash"></i> Delete</button>' +
        '</center>'
      );
    };

    window.handleEdit = (fuel_id, fuel_type) => {
      seteditingAllFuel(fuel_id);
      setFormData({
        fuel_id: fuel_id,
        fuel_type: fuel_type,
      });
      handleShowModal();
  };
  
  window.handleDelete = (fuel_id) => {
      setDeletingAllFuel(fuel_id);
      handleShowDeleteModal();
    };
  
    const handleDeleteAllFuel = async () => {
      try {
        let response;
        response = await axios.delete(`http://127.0.0.1:8001/api/admin/vehiclefuel/${deletingAllFuel}`);

      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseDeleteModal();
      } catch (error) {
      console.error('Error deleting fuel', error.message);
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
  
    const handleAddFuel = async () => {
      try {
        const errors = {};
        if (!editingAllFuel) 
          {

        if (!formData.fuel_id) {
          errors.fuel_id = 'Fuel id is required.';
        }
        if (!formData.fuel_type) {
          errors.fuel_type = 'Fuel type is required.';
        }
      }
      else
      {
        if (!formData.fuel_type) {
          errors.fuel_type = 'Fuel type is required.';
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
                fuel_id: formData.fuel_id,
                fuel_type: formData.fuel_type,
                user_id: auth_userid,
           }
           let response;
        if (editingAllFuel) {
          response = await axios.put(`http://127.0.0.1:8001/api/admin/vehiclefuel/${editingAllFuel}`, formData);
        } else {
          response = await axios.post('http://127.0.0.1:8001/api/admin/vehiclefuel', data);
        }

        Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        handleCloseModal();
        
      } catch (error) {
        console.error('Fuel added failed', error.message);
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
              <h4>Vehicle Fuel List</h4>
              <Button variant="warning" size="sm" onClick={handleShowModal}>
              <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New Fuel
              </Button>
            </div>
            <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Fuel ID</th>
                    <th>Fuel Name</th>
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
            <Modal.Title>{editingAllFuel ? 'Edit Fuel Type' : 'Add Vehicle Fuel'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {!editingAllFuel ?
          <form>
              <div className="mb-3">
                <label htmlFor="fuel_id" className="form-label">
                  Fuel Id
                </label>
                <input type="number" className={`form-control ${formErrors.fuel_id ? 'is-invalid' : ''}`} id="fuel_id" name="fuel_id" placeholder="" value={formData.fuel_id} onChange={handleInputChange}/>
                {formErrors.fuel_id && <div className="invalid-feedback">{formErrors.fuel_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="fuel_type" className="form-label">
                  Fuel Type
                </label>
                <input type="text" className={`form-control ${formErrors.fuel_type ? 'is-invalid' : ''}`} id="fuel_type" name="fuel_type" placeholder="" value={formData.fuel_type} onChange={handleInputChange}/>
                {formErrors.fuel_type && <div className="invalid-feedback">{formErrors.fuel_type}</div>}
              </div>

            </form>
            : 

            <form>
              <div className="mb-3">
                <label htmlFor="fuel_id" className="form-label">
                  Fuel Id
                </label>
                <input type="number" className={`form-control ${formErrors.fuel_id ? 'is-invalid' : ''}`} id="fuel_id" name="fuel_id" placeholder="" value={formData.fuel_id} onChange={handleInputChange} disabled/>
                {formErrors.fuel_id && <div className="invalid-feedback">{formErrors.fuel_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="fuel_type" className="form-label">
                  Fuel Type
                </label>
                <input type="text" className={`form-control ${formErrors.fuel_type ? 'is-invalid' : ''}`} id="fuel_type" name="fuel_type" placeholder="" value={formData.fuel_type} onChange={handleInputChange}/>
                {formErrors.fuel_type && <div className="invalid-feedback">{formErrors.fuel_type}</div>}
              </div>

            </form>
          }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp; Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddFuel}>
            <i class="bi bi-send-fill"></i> &nbsp;  {editingAllFuel ? 'Save Changes' : 'Add Fuel'}
            </Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this fuel type?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp; Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAllFuel}>
            <i class="bi bi-send-fill"></i> &nbsp; Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )

}

export default AddVehicleFuel;