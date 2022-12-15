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

// Our databases
import { projectsColRef } from '../../firebase.js';
import { addDoc, onSnapshot } from "firebase/firestore";

const CurrentProject = () => {
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

  // Sorting algorithm
  function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    
    if (order === "ASC") {
      return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }

    else {
      return function (b,a) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
}

  // Sorting
  const sorting = (col) => {
    if (order === "ASC") {

      setProjects (projects.sort( dynamicSort(col) ));
      setCurrentlySelected (col)
      setOrder ("DSC")

    }

    else {

      setProjects (projects.sort( dynamicSort(col) ));
      setCurrentlySelected (col)
      setOrder ("ASC")

    }
  }


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
                    {order === "ASC" ? 
                    <>
                      <b>Description</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Description</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
                  </> 
                  : 
                  <p>Description</p> }

                  </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("projectManager")}} align="center">
                { currentlySelected ===  "projectManager" ? 
                  <>  
                    {order === "ASC" ? 
                    <>
                      <b>Project Manager</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Project Manager</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
                  </> 
                  : 
                  <p>Project Manager</p> }
                </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("priority")}} align="center">
                { currentlySelected ===  "priority" ? 
                  <>
                    {order === "ASC" ? 
                    <>
                      <b>Priority</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Priority</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
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
  );
};

export default CurrentProject;