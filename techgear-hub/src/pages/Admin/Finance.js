import React from 'react';

const Finance = () => {
  const report = [
    { label: 'Revenue', value: '$85,000' },
    { label: 'Expenses', value: '$42,000' },
    { label: 'Net Profit', value: '$43,000' },
    { label: 'Profit Margin', value: '50%' },
  ];

  return (
    <div className="admin-page">
      <header className="flex-header">
        <h2>Financial Summary</h2>
      </header>

      <div className="finance-grid">
        {report.map((item) => (
          <div key={item.label} className="card finance-card">
            <h4>{item.label}</h4>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="report-card">
        <h3>Monthly Forecast</h3>
        <p>Forecast indicates growing demand in accessories and steady margin improvement over the next quarter.</p>
      </div>
    </div>
  );
};

export default Finance;
