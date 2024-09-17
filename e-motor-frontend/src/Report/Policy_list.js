import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net-bs5';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function PolicyList() {
  const [policyList, setPolicyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchPolicyData();
  }, []);

  const fetchPolicyData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/api/admin/policylistreport');
      setPolicyList(response.data.policy_list);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }

      tableRef.current = $('#tableId').DataTable({
        data: response.data.policy_list,
        columns: [
          { data: 'policy_no', title: 'Policy No' },
          { data: 'product', title: 'Product' },
          { data: 'policy_sum_insured', title: 'Sum Insured' },
          { data: 'policy_start_date', title: 'Start Date' },
          { data: 'policy_end_date', title: 'End Date' },
          { data: 'policy_status', title: 'Status' },
        ],
        language: {
          emptyTable: 'No data available in table',
        },
      });
    } catch (error) {
      console.error('Error fetching policy list', error);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(policyList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Policy Data');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'policy_data.xlsx');
  };

  return (
    <div className="background-container">
      <Navbar />
      <div className="container px-4">
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center small">
            <h4>Policy List</h4>
            <Button onClick={downloadExcel} variant="primary">Download Excel</Button>
          </div>
          <div className="card-body">
            <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Policy No</th>
                  <th>Product</th>
                  <th>Sum Insured</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyList;
