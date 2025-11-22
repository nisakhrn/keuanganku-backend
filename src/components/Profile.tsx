// src/components/Profile.tsx
const Profile = () => {
  return (
    <div className="profile-container">
      <h2>Profil Pengguna</h2>
      <form>
        <input type="text" placeholder="Nama Lengkap" />
        <input type="email" placeholder="Email" disabled />
        <input type="text" placeholder="Nomor Telepon" />
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default Profile;