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
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import "../../../src/Modal.css"

import Header from "../../components/Header";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, getDocs, deleteDoc, doc  } from "firebase/firestore";

// Our database
import { users_colRef, issuesColRef, db } from '../../firebase.js';

const CurrentIssue = ({button}) => {
  const [issues, setIssues] = useState ();

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();

  const [currentlySelected, setCurrentlySelected] = useState ("")
  const [order, setOrder] = useState ("ASC")

  const [modal, setModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState ({})

  const toggleModal = (issueID, issueDescription) => {
    setSelectedIssue (
      {issueID: issueID,
      issueDescription: issueDescription}
    )
    
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  const deleteIssue = () => {
    const docRef = doc(db, "issues", selectedIssue["issueID"]);

      deleteDoc(docRef)
      .then(() => {
          console.log("Entire Document has been deleted successfully.")
      })
      .catch(error => {
          console.log(error);
      })
  }

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
    if (currentUser["role"] === "Developer"  && currentUser !== undefined && issues !== undefined)
      {
        setIssues ([])
        for (let i = 0; i < issues.length; i++)
        {
          const checkVariable = issues[i].assignTo
          const substring = currentUser["full_name"]; 

          const match = checkVariable.find(element => {
            if (element.includes(substring)) {
              setIssues (current => [...current, issues[i]]);
            }
          });

        }
      }
  }, [currentUser]);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

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

    // If assignTo is checked -> Sort by number of elements
    if (col === "assignTo") {

      if (order === "ASC") {
        const sorted = [...issues].sort ((a,b) =>
        a[col].length > a[col].length ? 1 : -1 )
        setIssues (sorted)
      }

      else {
        const sorted = [...issues].sort ((a,b) =>
        a[col].length < a[col].length ? 1 : -1 )
        setIssues (sorted)
      }

      setCurrentlySelected (col)
      setOrder ("DSC")

    }

    // Every other field
    else {

      setIssues (issues.sort( dynamicSort(col) ));
      setCurrentlySelected (col)

      if (order === "ASC") {
        setOrder ("DSC")
      }
      
      else {
        setOrder ("ASC")
      }

    }
    
  }

  
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
                <StyledTableCell onClick={ ()=> {sorting ("project")}}>
                { currentlySelected ===  "project" ? 
                  <>
                    {order === "ASC" ? 
                    <>
                      <b>Project</b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b>Project</b>
                      <ArrowDropDownIcon/>
                    </> 
                    }

                  </> 
                  : 
                  <p>Project</p> }
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

                <StyledTableCell onClick={ ()=> {sorting ("assignTo")}} align="center">
                { currentlySelected ===  "assignTo" ? 
                  <>  
                    {order === "ASC" ? 
                    <>
                      <b> Assigned To </b>
                      <ArrowDropUpIcon/>
                    </>  
                      : 
                    <>
                      <b> Assigned To </b>
                      <ArrowDropDownIcon/>
                    </> 
                    }
                  </> 
                  : 
                  <p> Assigned To </p> }
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

                <StyledTableCell align="center">
                  <p> Done? </p>
                </StyledTableCell>

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

                  <StyledTableCell align="center" onClick={ ()=> {toggleModal (row.id, row.description)}}>
                  <Button variant="outlined"> Delete </Button>
                  </StyledTableCell>

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

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2> Delete Issue </h2>
            <p>
              Do you want to delete the issue: <b>{selectedIssue["issueDescription"]}</b> ?
            </p>

            <Button onClick={() => deleteIssue ()} variant="contained" startIcon={<DeleteIcon />}>
              Delete
            </Button>

            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}

    </Box>
  );
};

export default CurrentIssue;