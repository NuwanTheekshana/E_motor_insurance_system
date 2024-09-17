import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function BlacklistCustomers() {
    const auth_userid = localStorage.getItem("id");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        blacklist_cus_id: '',
        nic: '',
        name: '',
    });
    const [formErrors, setFormErrors] = useState({
        blacklist_cus_id: '',
        nic: '',
        name: '',
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        blacklist_cus_id: '',
        nic: '',
        name: '',
      });
      setFormErrors({
        blacklist_cus_id: '',
        nic: '',
        name: '',
      });
    };
  
    const [editingAllBlacklistCustomers, seteditingAllBlacklistCustomers] = useState(null);
    const [deletingAllBlacklistCustomers, setDeletingAllBlacklistCustomers] = useState(null);
    const [AllBlacklistCustomers, setAllBlacklistCustomers] = useState([]); 
    
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const tableRef = useRef(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/admin/blacklistcustomers');
        setAllBlacklistCustomers(response.data);
  
        if ($.fn.DataTable.isDataTable('#tableId')) {
          tableRef.current.DataTable().destroy();
        }
        tableRef.current = $('#tableId').DataTable({
          data: response.data.blacklist_customers,
          columns: [
            { data: 'blacklist_cus_id', title: 'Blacklist Customer Id' },
            { data: 'NIC', title: 'NIC' },
            { data: 'name', title: 'Customer Name' },
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
        console.error('Error fetching all blacklist customers list', error);
      }
    };
  
    const renderActionButtons = (data, type, row) => {
      return (
        '<center>' +
        '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
        row.blacklist_cus_id + ', \'' + row.NIC + '\', \'' + row.name + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
        '&nbsp;' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
        row.blacklist_cus_id +
        ')"><i class="bi bi-trash"></i> Delete</button>' +
        '</center>'
      );
    };

    window.handleEdit = (blacklist_cus_id, nic, name) => {
      seteditingAllBlacklistCustomers(blacklist_cus_id);
      setFormData({
        blacklist_cus_id: blacklist_cus_id,
        nic: nic,
        name: name,
      });
      handleShowModal();
  };
  
  window.handleDelete = (blacklist_cus_id) => {
      setDeletingAllBlacklistCustomers(blacklist_cus_id);
      handleShowDeleteModal();
    };
  
    const handleDeleteAllBlacklistCustomers = async () => {
      try {
        let response;
        response = await axios.delete(`http://127.0.0.1:8001/api/admin/blacklistcustomers/${deletingAllBlacklistCustomers}`);

      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseDeleteModal();
      } catch (error) {
      console.error('Error deleting blacklist customers', error.message);
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

    const handleAddBlacklistCustomers = async () => {
      try {
        const errors = {};
        if (!editingAllBlacklistCustomers) 
          {

        if (!formData.name) {
          errors.nic = 'Blacklist customers name is required.';
        }
        if (!formData.nic) {
          errors.name = 'Blacklist customer nic is required.';
        }
      }
      else
      {
        if (!formData.name) {
            errors.nic = 'Blacklist customers name is required.';
          }
          if (!formData.nic) {
            errors.name = 'Blacklist customer nic is required.';
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
                name: formData.name,
                nic: formData.nic,
                user_id: auth_userid,
           }

           let response;
        if (editingAllBlacklistCustomers) {
          response = await axios.put(`http://127.0.0.1:8001/api/admin/blacklistcustomers/${editingAllBlacklistCustomers}`, formData);
        } else {
          response = await axios.post('http://127.0.0.1:8001/api/admin/blacklistcustomers', data);
        }

        Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        handleCloseModal();
        
      } catch (error) {
        console.error('BlacklistCustomers added failed', error.message);
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
              <h4>Blacklist Customers List</h4>
              <Button variant="warning" size="sm" onClick={handleShowModal}>
              <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New BlacklistCustomers
              </Button>
            </div>
            <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>BlacklistCustomers ID</th>
                    <th>BlacklistCustomers Name</th>
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
            <Modal.Title>{editingAllBlacklistCustomers ? 'Edit BlacklistCustomers Type' : 'Add Vehicle BlacklistCustomers'} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {!editingAllBlacklistCustomers ?
          <form>
              <div className="mb-3">
                <label htmlFor="nic" className="form-label">
                  Blacklist Customers NIC
                </label>
                <input type="text" className={`form-control ${formErrors.nic ? 'is-invalid' : ''}`} id="nic" name="nic" placeholder="" value={formData.nic} onChange={handleInputChange}/>
                {formErrors.nic && <div className="invalid-feedback">{formErrors.nic}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Blacklist Customers Name
                </label>
                <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} id="name" name="name" placeholder="" value={formData.name} onChange={handleInputChange}/>
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

            </form>
            : 

            <form>
              <div className="mb-3">
                <label htmlFor="blacklist_cus_id" className="form-label">
                  Blacklist Customers Id
                </label>
                <input type="number" className={`form-control ${formErrors.blacklist_cus_id ? 'is-invalid' : ''}`} id="blacklist_cus_id" name="blacklist_cus_id" placeholder="" value={formData.blacklist_cus_id} onChange={handleInputChange} disabled/>
                {formErrors.blacklist_cus_id && <div className="invalid-feedback">{formErrors.blacklist_cus_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="nic" className="form-label">
                  Blacklist Customers NIC
                </label>
                <input type="text" className={`form-control ${formErrors.nic ? 'is-invalid' : ''}`} id="nic" name="nic" placeholder="" value={formData.nic} onChange={handleInputChange}/>
                {formErrors.nic && <div className="invalid-feedback">{formErrors.nic}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Blacklist Customers Name
                </label>
                <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} id="name" name="name" placeholder="" value={formData.name} onChange={handleInputChange}/>
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

            </form>
          }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp;  Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddBlacklistCustomers}>
            <i class="bi bi-send-fill"></i> &nbsp;  {editingAllBlacklistCustomers ? 'Save Changes' : 'Add BlacklistCustomers'}
            </Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this blacklist customers?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp;  Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAllBlacklistCustomers}>
            <i class="bi bi-send-fill"></i> &nbsp;  Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )

}

export default BlacklistCustomers;