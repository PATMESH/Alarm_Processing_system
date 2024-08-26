import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../Effects/LoadingSpinner';

const AdminView = () => {
  const [devicePage, setDevicePage] = useState(false);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [nmsList, setNmsList] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedNmsId, setSelectedNmsId] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDevices(setDevices);
    fetchUsers(setUsers);
    fetchNmsList(setNmsList);
    

    setTimeout(()=>{
    setLoading(false);
    },1000)
  }, []);


  const fetchDevices = (setDevices) => {
    return fetch("http://localhost:8080/api/devices/all")
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error("Error fetching devices:", error));
  };
  
  const fetchUsers = (setUsers) => {
    return fetch("http://localhost:8080/api/users/all")
      .then((response) => response.json())
      .then((data) => setUsers(data.filter(d => d.role === 'User')))
      .catch((error) => console.error("Error fetching users:", error));
  };
  
  const fetchNmsList = (setNmsList) => {
    return fetch("http://localhost:8080/api/nms/all")
      .then((response) => response.json())
      .then((data) => setNmsList(data))
      .catch((error) => console.error("Error fetching NMS:", error));
  };

  const handleAddClick = (isDevice) => {
    setIsAddingDevice(isDevice);
    setShowAddPopup(true);
  };

  const handleAddSubmit = () => {
    const url = isAddingDevice
      ? "http://localhost:8080/api/devices/add"
      : "http://localhost:8080/api/users/add";

    const data = isAddingDevice
      ? {
          name: document.getElementById("name-input").value,
          model: document.getElementById("model-input").value,
          nms: {
            id: selectedNmsId,
          },
        }
      : {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
          phone: document.getElementById("phone-input").value,
          role: document.getElementById("role-input").value,
          nms: {
            id: selectedNmsId,
            nmsName: nmsList.find((nms) => nms.id === selectedNmsId).nmsName,
            devices: [],
            users: [],
          },
        };
        console.log(data);
        

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        setShowAddPopup(false);
        setSelectedNmsId(null);
        fetchDevices();
        fetchUsers();
      })
      .catch((error) => console.error("Error adding:", error));
  };

  const renderUserView = () => (
    <div className="user-container">
      <div className="navigation-admin">
        <button className="nav-button" onClick={() => setDevicePage(true)}>
          Your Devices {">"}
        </button>
        <button className="nav-button" onClick={() => handleAddClick(false)}>
          Add {"+"}
        </button>
      </div>
      <h2 className="main-page-title">Users</h2>
      <div className="user-list">
        {users.length === 0 ? (
          <p>No Users available</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDeviceView = () => (
    <div className="user-container">
      <div className="navigation-admin">
        <button className="nav-button" onClick={() => setDevicePage(false)}>
          {"<"} Users
        </button>
        <button className="nav-button" onClick={() => handleAddClick(true)}>
          Add {"+"}
        </button>
      </div>
      <h2 className="main-page-title">All Devices</h2>
      <div className="device-list">
        {devices.length === 0 ? (
          <p>No devices available</p>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className="device-card"
              onClick={() => setSelectedDevice(device)}
              style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}
            >
              <div style={{width:'35%'}}>
                <h3>{device.name}</h3>
                <p>Model: {device.model}</p>
              </div>
              <p>{device.nms.nmsName}</p>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '5px',
                  backgroundColor:'violet',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'darkviolet'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'violet'}
              >
                <i className="fa fa-info-circle" style={{fontSize:'16px'}}></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDeviceDetailsPopup = () => (
    <div className="popup-overlay">
      <div className="device-popup">
          <div className="popup-content">
            <h3>{selectedDevice.name} Details</h3>
            <p>Model: {selectedDevice.model}</p>
            <p>Total Alarms: {selectedDevice.alarms.length}</p>
            <p>Pending Alarms: {selectedDevice.alarms.filter(alarm => alarm.status === "Pending").length}</p>
            <p>Resolved Alarms: {selectedDevice.alarms.filter(alarm => alarm.status === "Resolved").length}</p>
            <p>Critical Alarms: {selectedDevice.alarms.filter(alarm => alarm.priority === "Critical").length}</p>
            <p>High Alarms: {selectedDevice.alarms.filter(alarm => alarm.priority === "High").length}</p>
            <p>Medium Alarms: {selectedDevice.alarms.filter(alarm => alarm.priority === "Medium").length}</p>
            <p>Low Alarms: {selectedDevice.alarms.filter(alarm => alarm.priority === "Low").length}</p>
            <button onClick={() => setSelectedDevice(null)} className="close-button">X</button>
          </div>
        </div>
    </div>
  );

  return (
    <div className="admin-view">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {devicePage ? renderDeviceView() : renderUserView()}
          {showAddPopup && (
            <div className="popup-overlay">
              <div className="add-popup">
                <div className="add-popup-content">
                  <h3>{isAddingDevice ? "Add Device" : "Add User"}</h3>
                  <input
                    id="name-input"
                    type="text"
                    placeholder={isAddingDevice ? "Device Name" : "User Name"}
                  />
                  {isAddingDevice ? (
                    <input id="model-input" type="text" placeholder="Model" />
                  ) : (
                    <>
                      <input id="email-input" type="email" placeholder="Email" />
                      <input id="password-input" type="password" placeholder="Password" />
                      <input id="phone-input" type="text" placeholder="Phone" />
                      <input id="role-input" type="text" placeholder="Role" />
                    </>
                  )}
                  <select
                    id="nms-select"
                    onChange={(e) => setSelectedNmsId(parseInt(e.target.value))}
                  >
                    <option value="">Select NMS</option>
                    {nmsList.map((nms) => (
                      <option key={nms.id} value={nms.id}>
                        {nms.nmsName}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAddSubmit} className="submit-button">
                    Submit
                  </button>
                  <button onClick={() => setShowAddPopup(false)} className="close-button">
                    X
                  </button>
                </div>
              </div>
            </div>
          )}
          {selectedDevice && renderDeviceDetailsPopup()}
        </>
      )}
    </div>
  );
};

export default AdminView;
