import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddVehicleCategory() {
    const auth_userid = localStorage.getItem("id");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        category_id: '',
        category_name: '',
    });
    const [formErrors, setFormErrors] = useState({
        category_id: '',
        category_name: '',
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({
        category_id: '',
        category_name: '',
      });
      setFormErrors({
        category_id: '',
        category_name: '',
      });
    };
  
  
    const [editingAllCategory, seteditingAllCategory] = useState(null);
    const [deletingAllCatrgory, setDeletingAllCategory] = useState(null);
    const [AllCatrgory, setAllCatrgory] = useState([]); 
    
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const tableRef = useRef(null);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/admin/vehiclecategories');
        setAllCatrgory(response.data);
  
        if ($.fn.DataTable.isDataTable('#tableId')) {
          tableRef.current.DataTable().destroy();
        }
        tableRef.current = $('#tableId').DataTable({
          data: response.data.category,
          columns: [
            { data: 'vehicle_category_id', title: 'Category Id' },
            { data: 'vehicle_category_name', title: 'Category Name' },
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
        console.error('Error fetching All Category list', error);
      }
    };
  
    const renderActionButtons = (data, type, row) => {
      return (
        '<center>' +
        '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
        row.vehicle_category_id + ', \'' + row.vehicle_category_name + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
        '&nbsp;' +
        '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
        row.vehicle_category_id +
        ')"><i class="bi bi-trash"></i> Delete</button>' +
        '</center>'
      );
    };

    window.handleEdit = (vehicle_category_id, vehicle_category_name) => {
      seteditingAllCategory(vehicle_category_id);
      setFormData({
        category_id: vehicle_category_id,
        category_name: vehicle_category_name,
      });
      handleShowModal();
  };
  
  window.handleDelete = (vehicle_category_id) => {
      setDeletingAllCategory(vehicle_category_id);
      handleShowDeleteModal();
    };
  
    const handleDeleteAllCatrgory = async () => {
      try {
        let response;
        response =  await axios.delete(`http://127.0.0.1:8001/api/admin/vehiclecategories/${deletingAllCatrgory}`);
      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseDeleteModal();
      } catch (error) {
      console.error('Error deleting category', error);
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
  
    const handleAddCategory = async () => {
      try {
        const errors = {};

        if (!editingAllCategory) 
        {

          if (!formData.category_id) {
            errors.category_id = 'Category id is required.';
          }
          if (!formData.category_name) {
            errors.category_name = 'Category name is required.';
          }
        }
        else
        {
          if (!formData.category_name) {
            errors.category_name = 'Category name is required.';
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
                category_id: formData.category_id,
                category_name: formData.category_name,
                user_id: auth_userid,
           }
           let response;
           if (editingAllCategory) {
            response = await axios.put(`http://127.0.0.1:8001/api/admin/vehiclecategories/${editingAllCategory}`, formData);
          } else {
            response = await axios.post('http://127.0.0.1:8001/api/admin/vehiclecategories', data);
          }

          Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
              window.scrollTo({top: 0,behavior: 'smooth'});
            }
          });
          handleCloseModal();
        
      } catch (error) {
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
              <h4>Vehicle Category List</h4>
              <Button variant="warning" size="sm" onClick={handleShowModal}>
              <i class="bi bi-plus-circle-fill"></i> &nbsp; Add New Category
              </Button>
            </div>
            <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Category ID</th>
                    <th>Category Name</th>
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
            <Modal.Title>{editingAllCategory ? 'Edit Vehicle Category' : 'Add Vehicle Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {!editingAllCategory ?
          <form>
              <div className="mb-3">
                <label htmlFor="category_id" className="form-label">
                  Category Id
                </label>
                <input type="text" className={`form-control ${formErrors.category_id ? 'is-invalid' : ''}`} id="category_id" name="category_id" placeholder="" value={formData.category_id} onChange={handleInputChange}/>
                {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="category_name" className="form-label">
                  Category Name
                </label>
                <input type="text" className={`form-control ${formErrors.category_name ? 'is-invalid' : ''}`} id="category_name" name="category_name" placeholder="" value={formData.category_name} onChange={handleInputChange}/>
                {formErrors.category_name && <div className="invalid-feedback">{formErrors.category_name}</div>}
              </div>

            </form>

            : 

            <form>
              <div className="mb-3">
                <label htmlFor="category_id" className="form-label">
                  Category Id
                </label>
                <input type="text" className={`form-control ${formErrors.category_id ? 'is-invalid' : ''}`} id="category_id" name="category_id" placeholder="" value={formData.category_id} onChange={handleInputChange} disabled/>
                {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="category_name" className="form-label">
                  Category Name
                </label>
                <input type="text" className={`form-control ${formErrors.category_name ? 'is-invalid' : ''}`} id="category_name" name="category_name" placeholder="" value={formData.category_name} onChange={handleInputChange}/>
                {formErrors.category_name && <div className="invalid-feedback">{formErrors.category_name}</div>}
              </div>

            </form>
          }

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp; Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCategory}>
            <i class="bi bi-send-fill"></i> &nbsp; {editingAllCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this Category?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            <i class="bi bi-x-circle-fill"></i>&nbsp; Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAllCatrgory}>
            <i class="bi bi-send-fill"></i> &nbsp; Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )

}

export default AddVehicleCategory;