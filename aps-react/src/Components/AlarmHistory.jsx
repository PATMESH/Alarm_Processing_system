import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const AlarmHistory = () => {
  const [resolvedAlarms, setResolvedAlarms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/alarms/all")
      .then(response => response.json())
      .then(data => setResolvedAlarms(data.filter(d => d.status === 'Resolved')))
      .catch(error => console.error('Error fetching resolved alarms:', error));
  }, []);

  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];

  const priorityCellRenderer = (params) => {
    const priorityColors = {
      Critical: '#FF4136',
      High: '#FF851B',
      Medium: '#FFDC00',
      Low: '#2ECC40'
    };

    return (
      <PriorityCell style={{ color: priorityColors[params.value] }}>
        {params.value}
      </PriorityCell>
    );
  };

  const columnDefs = [
    { headerName: 'Alarm Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Device', field: 'device.name', sortable: true, filter: true },
    { 
      headerName: 'Priority', 
      field: 'priority', 
      sortable: true, 
      filter: true,
      cellRenderer: priorityCellRenderer,
      comparator: (valueA, valueB) => priorityOrder.indexOf(valueA) - priorityOrder.indexOf(valueB)
    },
    { 
      headerName: 'Raised At', 
      field: 'raisedAt', 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { 
      headerName: 'Resolved At', 
      field: 'resolvedAt', 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { headerName: 'Resolved By', field: 'resolvedBy.name', sortable: true, filter: true },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const downloadExcel = () => {
    fetch('http://localhost:8080/api/alarms/download', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resolved_alarms.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => console.error('Error downloading Excel:', error));
  };

  return (
    <AlarmHistoryWrapper>
      <AlarmHistoryTitle>Resolved Alarms History</AlarmHistoryTitle>
      <DownloadButton onClick={downloadExcel}>
        <FontAwesomeIcon icon={faFileExcel} /> Download Excel
      </DownloadButton>
      <GridWrapper className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={resolvedAlarms}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
        />
      </GridWrapper>
    </AlarmHistoryWrapper>
  );
};

const AlarmHistoryWrapper = styled.div`
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AlarmHistoryTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

const GridWrapper = styled.div`
  height: 500px;
  width: 100%;
  margin-top: 20px;
`;

const DownloadButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2ecc71;
  }

  svg {
    margin-right: 8px;
  }
`;

const PriorityCell = styled.div`
  padding: 5px 10px;
  border-radius: 12px;
  text-align: center;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;

export default AlarmHistory;