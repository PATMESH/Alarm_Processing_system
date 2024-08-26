import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Effects/LoadingSpinner";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faServer, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const UserView = () => {
  const [devicePage, setDevicePage] = useState(false);
  const [devices, setDevices] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [confirmingAlarm, setConfirmingAlarm] = useState(null);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingAlarms, setLoadingAlarms] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState({ value: 'desc', label: 'Newest First' });

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  const sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' }
  ];

  useEffect(() => {
    const nmsIdFromStorage = localStorage.getItem("nms_id");

    fetch("http://localhost:8080/api/devices/all")
      .then((response) => response.json())
      .then((data) => {
        setDevices(data.filter((d) => d.nms.id === parseInt(nmsIdFromStorage)));      
        setLoadingDevices(false);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setLoadingDevices(false);
      });

      fetch("http://localhost:8080/api/alarms/all")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((alarm) => alarm.device.nms.id === parseInt(nmsIdFromStorage) && alarm.status === 'Pending');
        setAlarms(filteredData);
        setFilteredAlarms(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching alarms:", error);
      })
      .finally(() => {
        setLoadingAlarms(false);
      });
  }, []);


  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/alarms/stream");

    const nmsIdFromStorage = localStorage.getItem("nms_id");
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if(data.device.nms.id === parseInt(nmsIdFromStorage)){
          setAlarms((prevAlarms) => [...prevAlarms, data]);
        }
      } catch (error) {
        console.error("Error parsing alarm data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    let result = [...alarms]; 
  
    if (deviceFilter.length > 0) {
      result = result.filter(alarm => 
        deviceFilter.some(device => device.value === alarm.device.name)
      );
    }
  
    if (priorityFilter.length > 0) {
      result = result.filter(alarm => 
        priorityFilter.some(priority => priority.value === alarm.priority)
      );
    }
  
    result.sort((a, b) => {
      const dateA = new Date(a.raisedAt).getTime();
      const dateB = new Date(b.raisedAt).getTime();
  
      return sortOrder.value === "desc"
        ? dateB - dateA 
        : dateA - dateB; 
    });
  
    setFilteredAlarms(result);
  }, [alarms, deviceFilter, priorityFilter, sortOrder]);
  

  const initiateResolveAlarm = (alarmId) => {
    setConfirmingAlarm(alarmId);
  };  

  const confirmResolveAlarm = (alarmId) => {
    if (confirmingAlarm) {
      const employeeId = localStorage.getItem("employeeId");
      setLoadingAlarms(true);
      
      fetch(`http://localhost:8080/api/alarms/resolve/${confirmingAlarm}?userId=${employeeId}`, {
        method: "POST",
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(updatedAlarm => {
          setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== confirmingAlarm));
          setFilteredAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== confirmingAlarm));
        })
        .catch((error) => console.error("Error resolving alarm:", error))
        .finally(() => {
          console.log(`Attempted to resolve alarm with ID: ${confirmingAlarm}`);
          setConfirmingAlarm(null);
          setTimeout(() => {
            setLoadingAlarms(false)
          }, 1500);
        });
    }
  };

  const cancelResolveAlarm = () => {
    setConfirmingAlarm(null);
  };

  const renderAlarmView = () => (
    <div className="user-container">
      <div className="alarm-top">
        <button className="nav-button" onClick={() => setDevicePage(true)}>
          Your Devices <FontAwesomeIcon icon={faServer} />
        </button>
        <h2 className="main-page-title">Alarms</h2>
        <div className="filter-container">
          <div className="filter-group">
            <label><FontAwesomeIcon icon={faServer} /></label>
            <Select
              isMulti
              value={deviceFilter}
              onChange={setDeviceFilter}
              options={devices.map(device => ({ value: device.name, label: device.name }))}
              className="filter-select"
              placeholder="Select devices..."
            />
          </div>
          <div className="filter-group">
            <label><FontAwesomeIcon icon={faExclamationTriangle} /></label>
            <Select
              isMulti
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
              className="filter-select"
              placeholder="Select priorities..."
            />
          </div>
          <div className="filter-group">
            <label><FontAwesomeIcon icon={faSort} /> </label>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              options={sortOptions}
              className="filter-select"
            />
          </div>
        </div>
      </div>
      {loadingAlarms ? (
        <LoadingSpinner />
      ) : (
        <div className="alarm-list">
          {filteredAlarms.length === 0 ? (
            <p className="no-alarms">No alarms available</p>
          ) : (
            filteredAlarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`alarm-card ${alarm.priority.toLowerCase()}`}
              >
                <div className="alarm-header">
                  <h3>{alarm.name}</h3>
                  <span className="priority-badge">{alarm.priority}</span>
                </div>
                <div className="alarm-details">
                  <p>Device: {alarm.device.name}</p>
                  <p>
                    Raised At: {new Date(alarm.raisedAt).toLocaleString()}
                  </p>
                  {alarm.resolvedAt && (
                    <p>
                      Resolved At: {new Date(alarm.resolvedAt).toLocaleString()}
                    </p>
                  )}
                  {alarm.resolvedBy && <p>Resolved By: {alarm.resolvedBy.name}</p>}
                </div>
                {!alarm.resolvedBy && (
                  <button
                  onClick={() => initiateResolveAlarm(alarm.id)}
                    className="resolve-button"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {confirmingAlarm && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <p>Are you sure you want to resolve this alarm?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmResolveAlarm} className="confirm-button">Yes</button>
              <button onClick={cancelResolveAlarm} className="cancel-button">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDeviceView = () => (
    <div className="user-container">
      <button className="nav-button" onClick={() => setDevicePage(false)}>
      <i class="fa-solid fa-arrow-left"></i> Alarms
      </button>
      <h2 className="main-page-title">Your Devices</h2>
      {loadingDevices ? (
        <LoadingSpinner />
      ) : (
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
              <div>
                <h3>{device.name}</h3>
                <p>Model: {device.model}</p>
              </div>
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
      )}
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
    <div className="user-view">
      {devicePage ? renderDeviceView() : renderAlarmView()}
      {selectedDevice && renderDeviceDetailsPopup()}
    </div>
  );
};

export default UserView;