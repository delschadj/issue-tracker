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

import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, getDocs } from "firebase/firestore";

// Our database
import { users_colRef, issuesColRef } from '../../firebase.js';
import { deepCopy } from "@firebase/util";

const CurrentIssue = ({button}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [issues, setIssues] = useState ();
  const [issuesDeveloper, setIssuesDeveloper] = useState ([]);

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();
  const [mail, setMail] = useState(user.email);

  // Get current user once
  useEffect(()=> {
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", user.email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setCurrentUser (doc.data())
        
      });
    }

    loadRabbit();
    
  }, [user]);

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

  useEffect(() => {
    if (currentUser["role"]  && currentUser !== undefined && issues !== undefined)
      {
        setIssues ([])
        for (let i = 0; i < issues.length; i++)
        {
          const checkVariable = issues[i].assignTo
          const substring = currentUser["full_name"]; 

          const match = checkVariable.find(element => {
            if (element.includes(substring)) {
              setIssues (current => [...current, issues[i]]);
              console.log ("Found!")
            }
          });

        }
      }
  }, [currentUser]); // Only re-run the effect if count changes

  
  

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
      <Header title="ISSUES" subtitle="Manage all current issues" />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center">Assigned To</StyledTableCell>
                <StyledTableCell align="center">Priority</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUser && (currentUser.role === "Admin" || currentUser.role === "Project Manager") && 
              
              issues.length > 0 && issues.map((row) => (
                <StyledTableRow key={row.project}>
                  <StyledTableCell component="th" scope="row">
                    {row.project}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.description}</StyledTableCell>
                  <StyledTableCell align="center">{row.assignTo + " "}</StyledTableCell>
                  <StyledTableCell align="center">{row.priority}</StyledTableCell>
                </StyledTableRow>
              ))

              }

              {currentUser && currentUser.role === "Developer" && 
              
              issues && 

              issues.map((row) => (
                <StyledTableRow key={row.project}>
                  <StyledTableCell component="th" scope="row">
                    {row.project}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.description}</StyledTableCell>
                  <StyledTableCell align="center">{row.assignTo + " "}</StyledTableCell>
                  <StyledTableCell align="center">{row.priority}</StyledTableCell>
                </StyledTableRow>
              ))

              }
            </TableBody>
          </Table>
        </TableContainer>
      {button}
    </Box>
  );
};

export default CurrentIssue;