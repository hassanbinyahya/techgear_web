import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import Dashboard from '../pages/Admin/Dashboard';
import AdminProducts from '../pages/Admin/Products';
import Orders from '../pages/Admin/Orders';
import Inventory from '../pages/Admin/Inventory';
import ManageProducts from '../pages/Admin/ManageProducts';
import Finance from '../pages/Admin/Finance';
import HR from '../pages/Admin/HR';
import AddProduct from '../pages/Admin/AddProduct';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="manage-products" element={<ManageProducts />} />
                <Route path="finance" element={<Finance />} />
                <Route path="hr" element={<HR />} />
                <Route path="add-product" element={<AddProduct />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;