import React, { useEffect, useState } from "react";

import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { data } from "../Graphs/data"

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FlagIcon from '@mui/icons-material/Flag';
import BugReportIcon from '@mui/icons-material/BugReport';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import StatBox from "../Graphs/StatBox";
import MyBarChart from "../Graphs/MyBarChart";
import MyPieChart from "../Graphs/MyPieChart";

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

  const [projectsCount, setProjectsCount] = useState (
    {
      low: 0,
      medium: 0,
      high: 0,
    });
  const [issuesCount, setIssuesCount] = useState ([0, 0, 0]);

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

    useEffect(() => {
      if (projects && issues) {

        let lowCountProjects = 0;
        let mediumCountProjects = 0;
        let highCountProjects = 0;

        let lowCountIssues = 0;
        let mediumCountIssues = 0;
        let highCountIssues = 0;

        // Project counting
        for (var i = 0; i < projects.length; i++) { 
  
          if (projects[i].priority == "Low") {
            lowCountProjects++;
          }

          else if (projects[i].priority == "Medium") {
            mediumCountProjects++;
          }

          else if (projects[i].priority == "High") {
            highCountProjects++;
          }
        }

        // Issues counting
        for (var i = 0; i < issues.length; i++) { 
  
          if (issues[i].priority == "Low") {
            lowCountIssues++;
          }

          else if (issues[i].priority == "Medium") {
            mediumCountIssues++;
          }

          else if (issues[i].priority == "High") {
            highCountIssues++;
          }
        }
    
        setProjectsCount({
            low: lowCountProjects,
            medium: mediumCountProjects,
            high: highCountProjects,
        });

        setIssuesCount({
          low: lowCountIssues,
          medium: mediumCountIssues,
          high: highCountIssues,
      });
      }

    }, [projects && issues]);

    


  console.log (issuesCount["low"])
  
  

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
          <MyBarChart counts={projectsCount} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Issues by Priority
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
            height="300px"
          >
            <MyPieChart counts={issuesCount} size="125" />

            <Typography
              variant="h5"
              color={colors.redAccent[500]}
              sx={{ mt: "15px" }}
            >
              <b> {issuesCount["high"]} issue/s needs urgent action. </b>
            </Typography>
            <Typography>You can see all high priority issues on the <b>right side</b>.</Typography>
          </Box>
        </Box>

        {issues && 
         <Box
         gridColumn="span 4"
         gridRow="span 3"
         backgroundColor={colors.primary[400]}
         overflow="auto"
       >
         <Box
           display="flex"
           justifyContent="space-between"
           alignItems="center"
           borderBottom={`4px solid ${colors.primary[500]}`}
           colors={colors.grey[100]}
           p="15px"
         >
           <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
             High Priority Issues
           </Typography>
         </Box>
         { issues.filter(obj => obj.priority.includes("High")).map(obj => (
           <Box
             key={`${obj.description}`}
             display="flex"
             justifyContent="space-between"
             alignItems="center"
             borderBottom={`4px solid ${colors.primary[500]}`}
             p="15px"
           >
             <Box>
               <Typography
                 color={colors.greenAccent[500]}
                 variant="h5"
                 fontWeight="600"
               >
                 {obj.description}
               </Typography>
               <Typography color={colors.grey[100]}>
                 {obj.project}
               </Typography>
             </Box>
             <Box color={colors.grey[100]}>{obj.priority}</Box>
           </Box>
         ))}
       </Box>
        }
       


      </Box>





    </Box>
      

      
      


  );
}

export default Home;