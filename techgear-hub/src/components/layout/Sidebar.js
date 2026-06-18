import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const menu = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Products', path: '/admin/products', icon: '📦' },
        { name: 'Inventory', path: '/admin/inventory', icon: '📉' },
        { name: 'Orders', path: '/admin/orders', icon: '🛒' },
        { name: 'Finance', path: '/admin/finance', icon: '💰' },
        { name: 'Employees', path: '/admin/hr', icon: '👨‍💼' },
        { name: 'Reports', path: '/admin/reports', icon: '📈' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">TECHGEAR HUB</div>
            <nav>
                {menu.map(item => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="text">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;