import React, { useState, useEffect } from 'react';
import ProfilePage from './ProfilePage'; 
import companyLogo from './tejas.png';
import lbtn from './logout.png';
import icon from './icon.png';
import MyDevices from './MyDevices';
import NMS from './NMS';
import AlarmHistory from './AlarmHistory';

const Notification = ({ message }) => (
  <div className="notification">
    <p>{message}</p>
  </div>
);

const MainPage = () => {
  const [currentView, setCurrentView] = useState('Devices');
  const [userName, setUserName] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    window.location.reload();
  };


  return (
    <div className="main-container">
      {showNotification && <Notification message={`Welcome, ${userName}!`} />}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo" >
            <img src={companyLogo} alt="Company Logo" />
          </div>
          <h1 className="nav-heading">Alarm Processing System</h1>
        </div>
        <ul className="nav-links">
          <li
            className={currentView === 'Devices' ? 'active' : ''}
            onClick={() => setCurrentView('Devices')}
          >
            My Devices
          </li>
          <li
            className={currentView === 'History' ? 'active' : ''}
            onClick={() => setCurrentView('History')}
          >
            History
          </li>
          <li
            className={currentView === 'NMS' ? 'active' : ''}
            onClick={() => setCurrentView('NMS')}
          >
            NMS-Users
          </li>
          <li
            className={currentView === 'profile' ? 'active' : ''}
            onClick={()=>setCurrentView("profile")}
            style={{display:'flex',justifyContent:'center',alignContent:'center'}}
          >
            <img src={icon} alt='icon' width={30} style={{backgroundColor:'whitesmoke', borderRadius:'30px'}}></img>
          </li>
          <li className="logout-btn" onClick={handleLogout}>
            <img src={lbtn} alt="Logout" />
          </li>
        </ul>
      </nav>
      <div className="content">
        {currentView === 'Devices' && <MyDevices />}
        {currentView === 'NMS' && <NMS />}
        {currentView === 'History' && <AlarmHistory />}
        {currentView === 'profile' && <ProfilePage />}
      </div>
    </div>
  );
};

export default MainPage;