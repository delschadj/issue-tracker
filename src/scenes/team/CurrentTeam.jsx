import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// Our databases
import { users_colRef } from '../../firebase.js';
import { addDoc, onSnapshot } from "firebase/firestore";

const Team = ({button}) => {
  const [users, setUsers] = useState ();

  const [currentlySelected, setCurrentlySelected] = useState ("")
  const [order, setOrder] = useState ("ASC")

  // Get all users
  useEffect(() => {
    onSnapshot (users_colRef, (snapshot) => {
      let allUsers = []
      snapshot.docs.forEach (user => {
        allUsers.push ({ ...user.data(), id: user.id})
      })
  
      setUsers (allUsers)
    })
    
  }, [users_colRef]);

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

      setUsers (users.sort( dynamicSort(col) ));
      setCurrentlySelected (col)
      setOrder ("DSC")
      
    }

    else {

      setUsers (users.sort( dynamicSort(col) ))
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
      <Header title="TEAM" subtitle="Team Members" />
      
         <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">

          <TableHead>
              <TableRow>
                <StyledTableCell onClick={ ()=> {sorting ("full_name")}}>
                { currentlySelected ===  "full_name" ? 
                  <>
                    {order === "ASC" ? 
                    <>
                      <b>Full name</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Full name</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }

                  </> 
                  : 
                  <p>Full name</p> }
                </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("email")}} align="center">
                  { currentlySelected ===  "email" ? 
                  <>
                    {order === "ASC" ? 
                    <>
                      <b>Email</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Email</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
                  </> 
                  : 
                  <p>Email</p> }

                  </StyledTableCell>

                <StyledTableCell onClick={ ()=> {sorting ("role")}} align="center">
                { currentlySelected ===  "role" ? 
                  <>  
                    {order === "ASC" ? 
                    <>
                      <b>Role</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Role</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
                  </> 
                  : 
                  <b>Role</b> }
                </StyledTableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {users && users.map((row) => (
                <StyledTableRow key={row.full_name}>
                  <StyledTableCell component="th" scope="row">
                    {row.full_name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.role}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {button}

    </Box>
  );
};

export default Team;