import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function VehicleRateDiscount_List() {
  const auth_userid = localStorage.getItem("id");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    vehiclerate_id: '',
    vehicle_category: '',
    vehicle_rate: '',
    vehicle_discount: ''
  });
  const [formErrors, setFormErrors] = useState({
    vehiclerate_id: '',
    vehicle_category: '',
    vehicle_rate: '',
    vehicle_discount: ''
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
    vehiclerate_id: '',
    vehicle_category: '',
    vehicle_rate: '',
    vehicle_discount: ''
    });
    setFormErrors({
        vehiclerate_id: '',
        vehicle_category: '',
        vehicle_rate: '',
        vehicle_discount: ''
    });
  };


  const [editingAllVehicleRate, seteditingAllVehicleRate] = useState(null);
  const [deletingAllVehicleRate, setDeletingAllVehicleRate] = useState(null);
  const [AllVehicleRate, setAllVehicleRate] = useState([]); 
  const [AllCategory, setAllCategory] = useState([]); 
  

  useEffect(() => {
    fetchData();
    categoryData();
  }, []);

  const categoryData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/admin/vehiclecategories`);
      setAllCategory(response.data.category);
    } catch (error) {
      console.error('Error fetching All Category list', error);
    }
  };



  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/api/admin/policyvehiclerates');
      setAllVehicleRate(response.data);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data.vehicle_rate,
        columns: [
          { data: 'vehicle_rate_dis_id', title: 'Vehicle Rate Id' },
          { data: 'vehicle_category_name', title: 'Vehicle Category' },
          { data: 'vehicle_rate', title: 'Vehicle Rate' },
          { data: 'vehicle_discount', title: 'Vehicle Discount' },
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
      console.error('Error fetching All VehicleRate list', error);
    }
  };

  const renderActionButtons = (data, type, row) => {
    return (
      '<center>' +
      '<button type="button" class="btn btn-primary btn-sm" onclick="window.handleEdit(' +
      row.vehicle_rate_dis_id + ', \'' + row.vehicle_category_id + '\', \'' + row.vehicle_rate + '\', \'' + row.vehicle_discount +'\', \'' + row.status +'\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.vehicle_rate_dis_id +
      ')"><i class="bi bi-trash"></i> Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (vehicle_rate_dis_id, vehicle_category_id, vehicle_rate, vehicle_discount) => {
    seteditingAllVehicleRate(vehicle_rate_dis_id);
    setFormData({
        vehiclerate_id: vehicle_rate_dis_id,
        vehicle_category_id: vehicle_category_id,
        vehicle_rate: vehicle_rate,
        vehicle_discount: vehicle_discount,
    });
    handleShowModal();
};

window.handleDelete = (vehiclerate_id) => {
    setDeletingAllVehicleRate(vehiclerate_id);
    handleShowDeleteModal();
  };

  const handleDeleteAllVehicleRate = async () => {
    try {
      let response;
        response = await axios.delete(`http://127.0.0.1:8001/api/admin/policyvehiclerates/${deletingAllVehicleRate}`);

    Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting vehiclerate', error);
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

  const handleAddVehicleRate = async () => {
    try {
      const errors = {};

      if (!editingAllVehicleRate) 
      {
      if (!formData.vehicle_category) {
        errors.vehicle_category = 'Vehicle category is required.';
      }
      if (!formData.vehicle_rate) {
        errors.vehicle_rate = 'Vehicle rate amount is required.';
      }
      if (!formData.vehicle_discount) {
        errors.vehicle_discount = 'Vehicle discount is required.';
      }

    }
    else
    {
          if (!formData.vehicle_rate) {
            errors.vehicle_rate = 'Vehicle rate amount is required.';
          }
          if (!formData.vehicle_discount) {
            errors.vehicle_discount = 'Vehicle discount is required.';
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
        vehicle_category: formData.vehicle_category,
        vehicle_rate: formData.vehicle_rate,
        vehicle_discount: formData.vehicle_discount,
    }
    console.log(data);
    let response;
      if (editingAllVehicleRate) {
        response = await axios.put(`http://127.0.0.1:8001/api/admin/policyvehiclerates/${editingAllVehicleRate}`, formData);
      } else {
        response = await axios.post('http://127.0.0.1:8001/api/admin/policyvehiclerates', data);
      }
      Swal.fire({title: 'Success', text: response.data.message, icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('VehicleRate added failed', error);
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
            <h4>Vehicle Rates & Discount List</h4>
            <Button variant="warning" size="sm" onClick={handleShowModal}>
            <i class="bi bi-plus-circle-fill"></i> &nbsp;  Add New Vehicle Rate & Discount
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Vehicle Rate ID</th>
                  <th>Vehicle Category Name</th>
                  <th>Vehicle Rate</th>
                  <th>Vehicle Discount</th>
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
          <Modal.Title>{editingAllVehicleRate ? 'Edit VehicleRates' : 'Add New VehicleRates'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllVehicleRate ?
        <form>
            <div className="mb-3">
                    <label htmlFor="vehicle_category" className="form-label">Vehicle Category Name</label>
                    <select className={`form-control ${formErrors.vehicle_category ? 'is-invalid' : ''}`} id="vehicle_category" name="vehicle_category" onChange={handleInputChange}>
                    <option value="">Select Vehicle Category</option>
                    {AllCategory.map((category) => (
                        <option key={category.vehicle_category_id} value={category.vehicle_category_id}>
                        {category.vehicle_category_name}
                        </option>
                    ))}
                   </select>
                {formErrors.vehicle_category && <div className="invalid-feedback">{formErrors.vehicle_category}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="vehicle_rate" className="form-label">
                Vehicle Rate
              </label>
              <input type="number" className={`form-control ${formErrors.vehicle_rate ? 'is-invalid' : ''}`} id="vehicle_rate" name="vehicle_rate" placeholder="" value={formData.vehicle_rate} onChange={handleInputChange}/>
              {formErrors.vehicle_rate && <div className="invalid-feedback">{formErrors.vehicle_rate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="vehicle_discount" className="form-label">
                Veicle Category Discount
              </label>
              <input type="number" className={`form-control ${formErrors.vehicle_discount ? 'is-invalid' : ''}`} id="vehicle_discount" name="vehicle_discount" placeholder="" value={formData.vehicle_discount} onChange={handleInputChange}/>
              {formErrors.vehicle_discount && <div className="invalid-feedback">{formErrors.vehicle_discount}</div>}
            </div>
          </form>

          
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="vehiclerate_id" className="form-label">
                VehicleRate Id
              </label>
              <input type="text" className={`form-control ${formErrors.vehiclerate_id ? 'is-invalid' : ''}`} id="vehiclerate_id" name="vehiclerate_id" placeholder="" value={formData.vehiclerate_id} onChange={handleInputChange} disabled/>
              {formErrors.vehiclerate_id && <div className="invalid-feedback">{formErrors.vehiclerate_id}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="vehicle_rate" className="form-label">
                Vehicle Rate
              </label>
              <input type="number" className={`form-control ${formErrors.vehicle_rate ? 'is-invalid' : ''}`} id="vehicle_rate" name="vehicle_rate" placeholder="" value={formData.vehicle_rate} onChange={handleInputChange}/>
              {formErrors.vehicle_rate && <div className="invalid-feedback">{formErrors.vehicle_rate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="vehicle_discount" className="form-label">
              Veicle Category Discount
              </label>
              <input type="number" className={`form-control ${formErrors.vehicle_discount ? 'is-invalid' : ''}`} id="vehicle_discount" name="vehicle_discount" placeholder="" value={formData.vehicle_discount} onChange={handleInputChange}/>
              {formErrors.vehicle_discount && <div className="invalid-feedback">{formErrors.vehicle_discount}</div>}
            </div>

            
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
          <i class="bi bi-x-circle-fill"></i>&nbsp;  Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddVehicleRate}>
          <i class="bi bi-send-fill"></i> &nbsp;  {editingAllVehicleRate ? 'Save Changes' : 'Add Vehicle Rate & Discount'}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this vehicle rate & discount record?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
          <i class="bi bi-x-circle-fill"></i>&nbsp; Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteAllVehicleRate}>
          <i class="bi bi-send-fill"></i> &nbsp; Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default VehicleRateDiscount_List;
