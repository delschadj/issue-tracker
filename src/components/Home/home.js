import React, { useEffect, useState } from "react";

import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FlagIcon from '@mui/icons-material/Flag';
import BugReportIcon from '@mui/icons-material/BugReport';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import StatBox from "../Graphs/StatBox";
import BarChart from "../Graphs/BarChart";

import Header from "../../components/Header";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { getDocs, query, where, onSnapshot } from "firebase/firestore";
import { projectsColRef, issuesColRef } from '../../firebase.js';

function Home() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [projects, setProjects] = useState ();
  const [issues, setIssues] = useState ();
  const [users, setUsers] = useState ();

  const [devCount, setDevCount] = useState (0);
  const [projectManagerCount, setProjectManagerCount] = useState (0);

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth()

  // Get current user once
  useEffect(()=> {
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", user.email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setCurrentUser (doc.data())
      });
    }

    loadRabbit();
    
  }, [user]);

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


    // Get all users
    useEffect(() => {
      onSnapshot (users_colRef, (snapshot) => {
        let allUsers = []
        snapshot.docs.forEach (user => {
          allUsers.push ({ ...user.data(), id: user.id})
        })
    
        setUsers (allUsers)




        var devCount = 0;
        var projectManagerCount = 0;

        for (var i = 0; i < allUsers.length; i++) {
          if (allUsers[i]["role"] === "Developer")
          {
            devCount += 1;
          }

          else if (allUsers[i]["role"] === "Project Manager")
          {
            projectManagerCount += 1;
          }
        }


        setDevCount (devCount)
        setProjectManagerCount (projectManagerCount)


      })
      
    }, [users_colRef]);


  return (
    

    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>



      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projects && projects.length}
            subtitle="Projects"
            progress="0.75"
            increase="+14%"
            icon={
              <FlagIcon
                sx={{ color: "black", fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={issues && issues.length}
            subtitle="Issues"
            progress="0.75"
            increase="+14%"
            icon={
              <BugReportIcon
                sx={{ color: "black", fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={devCount}
            subtitle="Developers"
            progress="0.75"
            increase="+14%"
            icon={
              <PersonIcon
                sx={{ color: "black", fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 4 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectManagerCount}
            subtitle="Project Managers"
            progress="0.75"
            increase="+14%"
            icon={
              <ManageAccountsIcon
                sx={{ color: "black", fontSize: "26px" }}
              />
            }
          />
        </Box>










        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Projects by Priority
          </Typography>
          <Box height="400px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Issues by Priority
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>


        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>





      </Box>





          








    </Box>
      

      
      


  );
}

export default Home;