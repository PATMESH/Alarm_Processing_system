import React, { useEffect, useState } from 'react';

const NMS = () => {
  const [nmsData, setNmsData] = useState([]);
  const [selectedNMS, setSelectedNMS] = useState(null);
  const [role, setRole] = useState();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newNmsName, setNewNmsName] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/nms/all')
      .then((response) => response.json())
      .then((data) => setNmsData(data))
      .catch((error) => console.error('Error fetching NMS data:', error));
  }, []);

  const handleCardClick = (nms) => {
    setSelectedNMS(nms);
  };

  const handleClosePopup = () => {
    setSelectedNMS(null);
  };

  const handleAddNms = () => {
    setShowAddPopup(true);
  };

  const handleAddNmsSubmit = () => {
    if (!newNmsName) {
      alert("NMS name is required.");
      return;
    }

    fetch('http://localhost:8080/api/nms/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nmsName: newNmsName }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.devices = data.devices || [];
        data.users = data.users || [];
        setNmsData((prevData) => [...prevData, data]);
        setNewNmsName('');
        setShowAddPopup(false);
      })
      .catch((error) => console.error('Error adding NMS:', error));
  };

  return (
    <div className="main-page">
      {role === "Admin" && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <button className="nav-button" onClick={handleAddNms}>
            Add New NMS {"+"}
          </button>
        </div>
      )}
      <h2 className="main-page-title">NMS & Users</h2>
      <div className="employee-cards-container">
        {nmsData.map((nms) => (
          <div
            key={nms.id}
            className="employee-card"
            onClick={() => handleCardClick(nms)}
          >
            <h3 className="employee-name">{nms.nmsName}</h3>
            <div className="employee-department">
              <h4>Devices: {nms.devices ? nms.devices.length : 0}</h4>
            </div>
            <div className="employee-role">
              {nms.users && nms.users.length > 0 ? (
                <h4>Users: {nms.users.length}</h4>
              ) : (
                <h4>Users: No users assigned</h4>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedNMS && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={handleClosePopup}>X</button>
            <h3 className="popup-title">{selectedNMS.nmsName}</h3>
            <div className="popup-section">
              <h4>Devices:</h4>
              {selectedNMS.devices.length === 0 ? (
                <p>No devices</p>
              ) : (
                <ul>
                  {selectedNMS.devices.map((device) => (
                    <li key={device.id}>
                      {device.name} - {device.model}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="popup-section">
              <h4>Users:</h4>
              {selectedNMS.users.length === 0 ? (
                <p>No users</p>
              ) : (
                <ul>
                  {selectedNMS.users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={() => setShowAddPopup(false)}>X</button>
            <h3 className="popup-title">Add New NMS</h3>
            <input
              type="text"
              value={newNmsName}
              onChange={(e) => setNewNmsName(e.target.value)}
              placeholder="Enter NMS Name"
              style={{
                width: '78%',
                padding: '10px',
                margin: '10px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
            <button
              onClick={handleAddNmsSubmit}
              style={{
                width: '16%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NMS;
