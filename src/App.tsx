import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import SignIn from './sign-in/SignIn.tsx';
import SignUp from './sign-up/SignUp.tsx';
import ProjectsPage from './ProjectsPage.tsx';
import TasksPage from './TasksPage.tsx';
import UsersPage from './UsersPage.tsx';
import UserDetailsPage from './UserDetailsPage.tsx';
import ProfilePage from './ProfilePage.tsx'
import { UserProvider } from './context/UserContext';


const App: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Routes>
      <Route path='/' element={<SignUp/>} />
      <Route path='/giris' element={<SignIn />} />

      <Route path="calisanlar/details/:id" element={<>
        <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <UserDetailsPage />
        </div>
        </>} />


      <Route path='/projeler' element={<>
        <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <UserProvider>
          <ProjectsPage />
          </UserProvider>
        </div>
        </>
        } />

        <Route path='/gorevler' element={<>
        <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <TasksPage />
        </div>
        </>
        } />
         
         <Route path='/calisanlar' element={<>
        <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <UsersPage />
        </div>
        </>
        } />

          <Route
            path="/profil"
            element={
              <div className="grid-container">
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

                {/* ───── yalnız profil için ───── */}
                <div className="profile-wrapper">
                  <ProfilePage />
                </div>
              </div>
            }
          />



      <Route path="/home" element={
        <>
        <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <UserProvider>
          <Home />
          </UserProvider>
        </div>
        </>
      } />
    </Routes>
  );
};

export default App;
