import React from 'react';

const HR = () => {
  const team = [
    { name: 'Maya Reed', role: 'Operations Lead' },
    { name: 'Jordan Lee', role: 'Inventory Manager' },
    { name: 'Priya Patel', role: 'Customer Success' },
  ];

  return (
    <div className="admin-page">
      <header className="flex-header">
        <h2>HR Dashboard</h2>
      </header>

      <div className="hr-grid">
        <div className="card hr-card">
          <h3>Team Members</h3>
          <ul>
            {team.map((member) => (
              <li key={member.name}>{member.name} — {member.role}</li>
            ))}
          </ul>
        </div>
        <div className="card hr-card">
          <h3>Open Roles</h3>
          <ul>
            <li>Warehouse Supervisor</li>
            <li>Product Specialist</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HR;
