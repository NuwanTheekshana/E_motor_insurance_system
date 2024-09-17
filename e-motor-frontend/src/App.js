import logo from './logo.svg';
import './App.css';
import Page404 from './Error/Page404'; 
import PrivateRoute from './PrivateRoute';
import Login from './Authentication/Login';
import Home from './Home';
import Users from './Users/UserList';

import VehicleCategory from './Vehicle/add_vehicle_category';
import VehicleUsage from './Vehicle/add_vehicle_usage';
import VehicleFuelType from './Vehicle/add_fuel_type';

import Policy_Covers from './Policy Covers/add_policy_covers';
import Vehicle_Rate_Discount from './Policy Covers/add_vehicle_rate_dis';

import VehicleBlacklist from './blacklist/totalloss_blacklist_vehicle';
import BlacklistCustomers from './blacklist/blacklist_customers';

import PolicyListReport from './Report/Policy_list';



import Main from './Front/main';
import Vehicleinfo from './Front/VehicleInfo';
import BuyInsurancePlan from './Front/BuyInsurancePlan';
import CustomerInfo from './Front/CustomerInfo';
import UploadDocument from './Front/UploadDocuments';
import Validatingpage from './Front/Validatingpage';
import PaymentGateway from './Front/PaymentGateway';
import VerifyPayment from './Front/VerifyPayment';
import Success from './Front/Success';
import CheckPolicy from './Front/checkpolicy';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* error page */}
      <Route path="*" element={<Page404 />} />

      <Route exact path="/" element={<Main />} />
      <Route exact path="/vehicleinfo" element={<Vehicleinfo />} />
      <Route exact path="/buyinsuranceplan" element={<BuyInsurancePlan />} />
      <Route exact path="/customerinfo" element={<CustomerInfo />} />
      <Route exact path="/uploaddocument" element={<UploadDocument />} />
      <Route exact path="/validatingpage" element={<Validatingpage />} />
      <Route exact path="/paymentgateway" element={<PaymentGateway />} />
      <Route exact path="/verifypayment" element={<VerifyPayment />} />
      <Route exact path="/checkpolicy/:id" element={<CheckPolicy />} />

      <Route exact path="/success" element={<Success />} />
      
      
        <Route exact path="/admin" element={<Login />} />

        {/* PrivateRoute if user session authenticated */}
        <Route path="/admin/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/admin/users" element={<PrivateRoute element={<Users />} />} />

        <Route path="/admin/vehiclecategory" element={<PrivateRoute element={<VehicleCategory />} />} />
        <Route path="/admin/vehicleusage" element={<PrivateRoute element={<VehicleUsage />} />} />
        <Route path="/admin/vehiclefueltype" element={<PrivateRoute element={<VehicleFuelType />} />} />


        <Route path="/admin/add_policy_covers" element={<PrivateRoute element={<Policy_Covers />} />} />
        <Route path="/admin/vehicle_rate_discount" element={<PrivateRoute element={<Vehicle_Rate_Discount />} />} />

        <Route path="/admin/vehicleblacklist" element={<PrivateRoute element={<VehicleBlacklist />} />} />
        <Route path="/admin/blacklistcustomers" element={<PrivateRoute element={<BlacklistCustomers />} />} />

        <Route path="/admin/policylistreport" element={<PrivateRoute element={<PolicyListReport />} />} />
        
      </Routes>
    </Router>
  );
}

export default App;
