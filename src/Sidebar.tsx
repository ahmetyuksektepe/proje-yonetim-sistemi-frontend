import React from 'react';
import {
  BsGrid1X2Fill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
} from 'react-icons/bs';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Oturumu sil
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    // İsteğe bağlı: axios header'dan token'ı da silebilirsin
    delete axios.defaults.headers.common['Authorization'];
    // Giriş sayfasına yönlendir
    navigate('/giris');
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsMenuButtonWideFill className="icon_header" /> Proje Yönetim Sistemi
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <NavLink to="/home">
            <BsGrid1X2Fill className="icon" /> Ana Menü
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/projeler">
            <BsFillGrid3X3GapFill className="icon" /> Projeler
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/gorevler">
            <BsListCheck className="icon" /> Görevler
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/calisanlar">
            <BsPeopleFill className="icon" /> Çalışanlar
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/profil">
            <AccountBoxIcon className="icon" /> Profilim
          </NavLink>
        </li>
        
        <li className="sidebar-list-item">
          <button onClick={handleLogout} style={{ all: 'unset', cursor: 'pointer' }}>
            <LogoutIcon className="icon" /> Çıkış
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
