import React, { useEffect, useState } from "react";

const AlarmStream = () => {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/alarms/stream");
    
    eventSource.onmessage = (event) => {
      try {
        const alarmData = JSON.parse(event.data);
        setAlarms((prevAlarms) => [...prevAlarms, alarmData]);
        console.log(alarmData);
      } catch (error) {
        console.error("Error parsing alarm data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Alarms</h2>
      <ul>
        {alarms.map((alarm, index) => (
          <li key={index}>
            <strong>{alarm.name}</strong> - Priority: {alarm.priority}, 
            Device: {alarm.device.name}, 
            Status: {alarm.status}, 
            Raised At: {new Date(alarm.raisedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlarmStream;