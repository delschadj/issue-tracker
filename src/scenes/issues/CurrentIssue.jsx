import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

// Our databases
import { issuesColRef } from '../../firebase.js';
import { addDoc, onSnapshot } from "firebase/firestore";

const CurrentIssue = ({button}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [issues, setIssues] = useState ();

  // Get all issues
  useEffect(() => {
    onSnapshot (issuesColRef, (snapshot) => {
      let allUsers = []
      snapshot.docs.forEach (user => {
        allUsers.push ({ ...user.data(), id: user.id})
      })
  
      setIssues (allUsers)
  
    })

    
  }, [issuesColRef]);

  console.log (issues)

  const columns = [
    
    {
      field: "project",
      headerName: "Project",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "assignTo",
      headerName: "Assigned To",
      flex: 2,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: ({ row: { priority } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              priority === "High"
                ? colors.redAccent[600]
                : priority === "Medium"
                ? colors.greenAccent[600]
                : colors.greenAccent[600]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[0]} sx={{ ml: "5px" }}>
              {priority}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="50px">
      <Header title="ISSUES" subtitle="Manage all current issues" />
      <Box
        m="40px 0 0 0"
        height="50vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={issues !== undefined && issues} columns={columns} />
      </Box>
      {button}
    </Box>
  );
};

export default CurrentIssue;