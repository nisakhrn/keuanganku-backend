// src/components/Dashboard.tsx
import { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Mengimpor Sidebar

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-summary">
        <div className="card">
          <h3>Pemasukan</h3>
          <p>Rp 5,000,000</p>
        </div>
        <div className="card">
          <h3>Pengeluaran</h3>
          <p>Rp 3,000,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;