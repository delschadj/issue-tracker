import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from "../../components/Header";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import CancelIcon from '@mui/icons-material/Cancel';

// Our databases
import { projectsColRef } from '../../firebase.js';
import { addDoc, onSnapshot } from "firebase/firestore";

const CurrentProject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState ();

  const [currentlySelected, setCurrentlySelected] = useState ("")
  const [order, setOrder] = useState ("ASC")

  // Get all projects
  useEffect(() => {
    onSnapshot (projectsColRef, (snapshot) => {
      let allUsers = []
      snapshot.docs.forEach (user => {
        allUsers.push ({ ...user.data(), id: user.id})
      })
  
      setProjects (allUsers)
  
    })

    
  }, [projectsColRef]);

  const sorting = (col) => {
    if (order === "ASC") {
      console.log (col + order)

      const sorted = [...projects].sort ((a,b) =>
      a[col].toLowerCase() > a[col].toLowerCase() ? 1 : -1 )
      setProjects (sorted)
      setCurrentlySelected (col)

      setOrder ("DSC")
    }

    else {
      console.log (col + order)

      const sorted = [...projects].sort ((a,b) =>
      a[col].toLowerCase() < a[col].toLowerCase() ? 1 : -1 )
      setProjects (sorted)
      setCurrentlySelected (col)

      setOrder ("ASC")
    }
  }

  const columns = [
    
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "projectManager",
      headerName: "Project Manager",
      flex: 1,
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


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  

  return (
    <Box m="50px">
      <Header title="PROJECTS" subtitle="All current projects" />
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={ ()=> {sorting ("title")}}>
                { currentlySelected ===  "title" ? 
                  <>
                    {order === "ASC" ? 
                    <>
                      <b>Title</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Title</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }

                  </> 
                  : 
                  <p>Title</p> }
                </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("description")}} align="center">
                  { currentlySelected ===  "description" ? 
                  <>
                    <b>Description</b>
                  </> 
                  : 
                  <p>Description</p> }

                  </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("projectManager")}} align="center">
                { currentlySelected ===  "projectManager" ? 
                  <>  
                    <b>Project Manager</b>
                  </> 
                  : 
                  <p>Project Manager</p> }
                </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("priority")}} align="center">
                { currentlySelected ===  "priority" ? 
                  <>
                    <b>Priority</b>
                  </> 
                  : 
                  <p>Priority</p> }
                </StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {projects && projects.map((row) => (
                <StyledTableRow key={row.title}>
                  <StyledTableCell component="th" scope="row">
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.description}</StyledTableCell>
                  <StyledTableCell align="center">{row.projectManager}</StyledTableCell>
                  <StyledTableCell align="center">{row.priority}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        
      </Box>
    </Box>
  );
};

export default CurrentProject;