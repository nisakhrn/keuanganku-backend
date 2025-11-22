// src/pages/profile.tsx
import Sidebar from '../components/Sidebar';

const Profile = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Profil Pengguna</h1>
        </header>
        <div className="dashboard-content">
          <form>
            <div className="form-group">
              <label>Nama</label>
              <input type="text" name="name" defaultValue="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" defaultValue="john.doe@example.com" disabled />
            </div>
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input type="text" name="phone" defaultValue="08123456789" required />
            </div>
            <button type="submit" className="submit-button">Simpan Perubahan</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;