import React from 'react';

const Dashboard = () => {
    // Mock Data for ERP Logic
    const stats = {
        totalOrders: 245,
        totalRevenue: 85000,
        totalExpenses: 42000, // For Net Profit calculation
        totalProducts: 120,
        lowStockItems: 8
    };

    const grossProfit = stats.totalRevenue - stats.totalExpenses;

    return (
        <div className="admin-page">
            <header><h2>Dashboard Overview</h2></header>
            
            <div className="stats-grid">
                <div className="card">
                    <h4>Total Revenue</h4>
                    <p className="val">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="card profit">
                    <h4>Total Profit ✅</h4>
                    <p className="val">${grossProfit.toLocaleString()}</p>
                </div>
                <div className="card">
                    <h4>Active Orders</h4>
                    <p className="val">{stats.totalOrders}</p>
                </div>
                <div className="card alert">
                    <h4>Low Stock Alerts</h4>
                    <p className="val">{stats.lowStockItems}</p>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-placeholder">Sales Graph (Placeholder)</div>
                <div className="chart-placeholder">Profit Graph (Placeholder)</div>
            </div>
        </div>
    );
};

export default Dashboard;