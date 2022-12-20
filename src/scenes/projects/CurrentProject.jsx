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
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import "../../../src/Modal.css"

import Header from "../../components/Header";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, getDocs, deleteDoc, doc  } from "firebase/firestore";

// Our databases
import { projectsColRef, users_colRef, db } from '../../firebase.js';

const CurrentProject = ({button}) => {
  const [projects, setProjects] = useState ();

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();

  const [selectedProject, setSelectedProject] = useState ({})
  const [order, setOrder] = useState ("ASC")

  const [modal, setModal] = useState(false);

  const toggleModal = (projectID, projectTitle) => {
    setSelectedProject (
      {projectID: projectID,
        projectTitle: projectTitle}
    )

    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  const deleteProject = () => {
    const docRef = doc(db, "projects", selectedProject["projectID"]);

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

  console.log (currentUser && 
    console.log (currentUser["role"])
  )

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
      setSelectedProject (col)
      setOrder ("DSC")

    }

    else {

      setProjects (projects.sort( dynamicSort(col) ));
      setSelectedProject (col)
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
                { selectedProject ===  "title" ? 
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
                  { selectedProject ===  "description" ? 
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
                { selectedProject ===  "projectManager" ? 
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
                { selectedProject ===  "priority" ? 
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

              {(currentUser["role"] === "Admin" || currentUser["role"] === "Project Manager") && 
                <StyledTableCell align="center">
                <p> Done? </p>
              </StyledTableCell>
              }
                

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

                { (currentUser["role"] === "Admin" || currentUser["role"] === "Project Manager") && 
                  <StyledTableCell align="center" onClick={ ()=> {toggleModal (row.id, row.title)}}>
                    <Button variant="outlined"> Delete </Button>
                  </StyledTableCell>
                }
                  
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {button}

        {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2> Delete Project </h2>
            <p>
              Do you want to delete the project: <b>{selectedProject["projectTitle"]}</b> ?
            </p>

            <Button onClick={() => deleteProject ()} variant="contained" startIcon={<DeleteIcon />}>
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

export default CurrentProject;