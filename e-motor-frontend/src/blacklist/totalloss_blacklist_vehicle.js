import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddVehicleBlacklist() {
    const auth_userid = localStorage.getItem("id");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        blacklist_id: '',
        vehicle_reg_no: '',
        vehicle_chassis_no: '',
        vehicle_engine_no: '',
        blacklist_type: '',
    });
    const [formErrors, setFormErrors] = useState({
        blacklist_id: '',
        vehicle_reg_no: '',
        vehicle_chassis_no: '',
        vehicle_engine_no: '',
        blacklist_type: '',
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        blacklist_id: '',
        vehicle_reg_no: '',
        vehicle_chassis_no: '',
        vehicle_engine_no: '',
        blacklist_type: '',
      });
      setFormErrors({
        blacklist_id: '',
        vehicle_reg_no: '',
        vehicle_chassis_no: '',
        vehicle_engine_no: '',
        blacklist_type: '',
      });
    };
  
    const [editingAllBlacklist, seteditingAllBlacklist] = useState(null);
    const [deletingAllBlacklist, setDeletingAllBlacklist] = useState(null);
    const [AllBlacklist, setAllBlacklist] = useState([]); 
    
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const tableRef = useRef(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/admin/vehicleblacklist');
        setAllBlacklist(response.data);
  
        if ($.fn.DataTable.isDataTable('#tableId')) {
          tableRef.current.DataTable().destroy();
        }
        tableRef.current = $('#tableId').DataTable({
          data: response.data.blacklist_vehicle,
          columns: [
            { data: 'totalloss_blacklist_id', title: 'Vehicle Blacklist Id' },
            { data: 'vehicle_reg_no', title: 'Vehicle No' },
            { data: 'vehicle_chassis_no', title: 'Chassis No' },
            { data: 'vehicle_engine_no', title: 'Engine No' },
            { data: 'blacklist_type', title: 'Black List Type' },
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
        console.error('Error fetching All Blacklist list', error);
      }
    };
  
    const renderActionButtons = (data, type, row) => {
      return (
        '<center>' +
        '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
        row.totalloss_blacklist_id + ', \'' + row.vehicle_reg_no + '\', \'' + row.vehicle_chassis_no + '\', \'' + row.vehicle_engine_no + '\', \'' + row.blacklist_type + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
        '&nbsp;' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
        row.totalloss_blacklist_id +
        ')"><i class="bi bi-trash"></i> Delete</button>' +
        '</center>'
      );
    };

    window.handleEdit = (totalloss_blacklist_id, vehicle_reg_no, vehicle_chassis_no, vehicle_engine_no, blacklist_type) => {
      seteditingAllBlacklist(totalloss_blacklist_id);
      setFormData({
        blacklist_id: totalloss_blacklist_id,
        vehicle_reg_no: vehicle_reg_no,
        vehicle_chassis_no: vehicle_chassis_no,
        vehicle_engine_no: vehicle_engine_no,
        blacklist_type: blacklist_type,
      });
      handleShowModal();
  };
  
  window.handleDelete = (totalloss_blacklist_id) => {
      setDeletingAllBlacklist(totalloss_blacklist_id);
      handleShowDeleteModal();
    };
  
    const handleDeleteAllBlacklist = async () => {
      try {
        let response;
        response = await axios.delete(`http://127.0.0.1:8001/api/admin/vehicleblacklist/${deletingAllBlacklist}`);

      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseDeleteModal();
      } catch (error) {
      console.error('Error deleting blacklist', error.message);
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
  
    const handleAddBlacklist = async () => {
      try {
        const errors = {};
        if (!editingAllBlacklist) 
          {
            if (!formData.vehicle_reg_no) {
            errors.vehicle_reg_no = 'Vehicle number is required.';
            }
            if (!formData.vehicle_chassis_no) {
                errors.vehicle_chassis_no = 'Chassis number is required.';
            }
            if (!formData.vehicle_engine_no) {
                errors.vehicle_engine_no = 'Engine number is required.';
            }
            if (!formData.blacklist_type) {
                errors.blacklist_type = 'Blacklist type is required.';
            }
      }
      else
        {
            if (!formData.blacklist_id) {
                errors.blacklist_id = 'Blacklist id is required.';
            }
            if (!formData.blacklist_type) {
            errors.blacklist_type = 'Blacklist type is required.';
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
                vehicle_reg_no: formData.vehicle_reg_no,
                vehicle_chassis_no: formData.vehicle_chassis_no,
                vehicle_engine_no: formData.vehicle_engine_no,
                blacklist_type: formData.blacklist_type,
                user_id: auth_userid,
           }
           let response;
        if (editingAllBlacklist) {
          response = await axios.put(`http://127.0.0.1:8001/api/admin/vehicleblacklist/${editingAllBlacklist}`, formData);
        } else {
          response = await axios.post('http://127.0.0.1:8001/api/admin/vehicleblacklist', data);
        }

        Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        handleCloseModal();
        
      } catch (error) {
        console.error('Blacklist added failed', error.message);
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
              <h4>Vehicle Blacklist List</h4>
              <Button variant="warning" size="sm" onClick={handleShowModal}>
              <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New Blacklist
              </Button>
            </div>
            <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Vehicle Blacklist Id</th>
                    <th>Vehicle No</th>
                    <th>Chassis No</th>
                    <th>Engine No</th>
                    <th>Black List Type</th>
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
            <Modal.Title>{editingAllBlacklist ? 'Edit Blacklist Type' : 'Add Vehicle Blacklist'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {!editingAllBlacklist ?
          <form>
              <div className="mb-3">
                <label htmlFor="vehicle_reg_no" className="form-label">
                  Vehicle No
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_reg_no ? 'is-invalid' : ''}`} id="vehicle_reg_no" name="vehicle_reg_no" placeholder="" value={formData.vehicle_reg_no} onChange={handleInputChange}/>
                {formErrors.vehicle_reg_no && <div className="invalid-feedback">{formErrors.vehicle_reg_no}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="vehicle_chassis_no" className="form-label">
                  Chassis Number
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_chassis_no ? 'is-invalid' : ''}`} id="vehicle_chassis_no" name="vehicle_chassis_no" placeholder="" value={formData.vehicle_chassis_no} onChange={handleInputChange}/>
                {formErrors.vehicle_chassis_no && <div className="invalid-feedback">{formErrors.vehicle_chassis_no}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="vehicle_engine_no" className="form-label">
                  Engine Number
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_engine_no ? 'is-invalid' : ''}`} id="vehicle_engine_no" name="vehicle_engine_no" placeholder="" value={formData.vehicle_engine_no} onChange={handleInputChange}/>
                {formErrors.vehicle_engine_no && <div className="invalid-feedback">{formErrors.vehicle_engine_no}</div>}
              </div>

              <div className="mb-3">
                    <label htmlFor="blacklist_type" className="form-label">Vehicle Category Name</label>
                    <select className={`form-control ${formErrors.vehicle_category ? 'is-invalid' : ''}`} id="blacklist_type" name="blacklist_type" onChange={handleInputChange}>
                    <option value="">Select Blacklist Type</option>
                        <option key="Black List" value="Black List">Black List</option>
                        <option key="Total Loss" value="Total Loss">Total Loss</option>
                   </select>
                {formErrors.blacklist_type && <div className="invalid-feedback">{formErrors.blacklist_type}</div>}
            </div>


            </form>
            : 

            <form>
              <div className="mb-3">
                <label htmlFor="blacklist_id" className="form-label">
                  Blacklist Id
                </label>
                <input type="number" className={`form-control ${formErrors.blacklist_id ? 'is-invalid' : ''}`} id="blacklist_id" name="blacklist_id" placeholder="" value={formData.blacklist_id} onChange={handleInputChange} disabled/>
                {formErrors.blacklist_id && <div className="invalid-feedback">{formErrors.blacklist_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="vehicle_reg_no" className="form-label">
                  Vehicle No
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_reg_no ? 'is-invalid' : ''}`} id="vehicle_reg_no" name="vehicle_reg_no" placeholder="" value={formData.vehicle_reg_no} onChange={handleInputChange}/>
                {formErrors.vehicle_reg_no && <div className="invalid-feedback">{formErrors.vehicle_reg_no}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="vehicle_chassis_no" className="form-label">
                  Chassis Number
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_chassis_no ? 'is-invalid' : ''}`} id="vehicle_chassis_no" name="vehicle_chassis_no" placeholder="" value={formData.vehicle_chassis_no} onChange={handleInputChange}/>
                {formErrors.vehicle_chassis_no && <div className="invalid-feedback">{formErrors.vehicle_chassis_no}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="vehicle_engine_no" className="form-label">
                  Engine Number
                </label>
                <input type="text" className={`form-control ${formErrors.vehicle_engine_no ? 'is-invalid' : ''}`} id="vehicle_engine_no" name="vehicle_engine_no" placeholder="" value={formData.vehicle_engine_no} onChange={handleInputChange}/>
                {formErrors.vehicle_engine_no && <div className="invalid-feedback">{formErrors.vehicle_engine_no}</div>}
              </div>

              <div className="mb-3">
                    <label htmlFor="blacklist_type" className="form-label">Vehicle Category Name</label>
                    <select className={`form-control ${formErrors.blacklist_type ? 'is-invalid' : ''}`} id="blacklist_type" name="blacklist_type" value={formData.blacklist_type} onChange={handleInputChange}>
                    <option value="">Select Blacklist Type</option>
                        <option key="Black List" value="Black List">Black List</option>
                        <option key="Total Loss" value="Total Loss">Total Loss</option>
                   </select>
                {formErrors.blacklist_type && <div className="invalid-feedback">{formErrors.blacklist_type}</div>}
            </div>


            </form>
          }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp;  Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddBlacklist}>
            <i class="bi bi-send-fill"></i> &nbsp;  {editingAllBlacklist ? 'Save Changes' : 'Add Blacklist'}
            </Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this blacklist type?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp; Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAllBlacklist}>
            <i class="bi bi-send-fill"></i> &nbsp;  Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )

}

export default AddVehicleBlacklist;