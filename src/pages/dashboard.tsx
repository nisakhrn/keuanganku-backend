import Sidebar from '../components/Sidebar';
import Link from 'next/link';  // Import Link untuk navigasi

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
        </header>
        <div className="dashboard-content">
          <Link href="/profile">
            <a>Go to Profile</a>  {/* Error: <a> tidak boleh ada di dalam <Link> */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;