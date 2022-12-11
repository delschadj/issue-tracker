import React, { useEffect, useState } from "react";
import Select from 'react-select'
import Multiselect from 'multiselect-react-dropdown';

import {UserAuth} from "../../context/AuthContext"
import { projectsColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps } from 'formik';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

function AddProject() {

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState ("")
  const [devs, setDevs] = useState ()
  const options = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ]

  const [projectManager2, setProjectManager2] = useState ([])
  
  const [title, setTitle] = useState ("")
  const [description, setDescription] = useState ("")

  const [projectManager, setProjectManager] = useState ("Hikaru Nakamura")
  const [assignTo, setAssignTo] = useState ([])
  const [priority, setPriority] = useState ("")

  const [error, setError] = useState ("");

  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)

  // Get current user
  useEffect(()=> {
    setMail (user.email)
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", mail));

      const unsubscribe = onSnapshot (q, (snapshot) => {
        const currentUserArray = []
        snapshot.docs.forEach (doc => {
          currentUserArray.push ({ ...doc.data(), id: doc.id})
        });
    
        setCurrentUser (currentUserArray[0])
    
        unsubscribe();
      })
    }

    loadRabbit();
    
  }, [mail]);


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

  // Get all PMs
  const qPM = query(users_colRef, where("role", "==", "Project Manager"));
  useEffect(() => {
    onSnapshot (qPM, (snapshot) => {
      let allPMs = []
      snapshot.docs.forEach (dev => {
        allPMs.push (dev.data().full_name)
        
        
      })
  
      setProjectManager2 (allPMs)

    })
 
  }, [users_colRef]);
  
  // Get all devs
  const qDev = query(users_colRef, where("role", "==", "Developer"));
  useEffect(() => {
    onSnapshot (qDev, (snapshot) => {
      let allDevs = []
      snapshot.docs.forEach (dev => {
        allDevs.push (dev.data().full_name)
        
        
      })
  
      setDevs (allDevs)

    })
 
  }, [users_colRef]);



  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try{
      // Object to paste
      const docAdd = ({ 
        title: title,
        description: description,

        projectManager: projectManager,
        assignTo: assignTo,
        priority: priority,
       })

      // Paste
      alert ("Button!")
      //console.log (addDoc)
      // addDoc(projectsColRef, docAdd)
      alert ("Success!")
    }

    catch (e) {
      console.log (e.message)
    }
  }


  return (
    <>
    {currentUser.role === "Admin" && 

    <Box m="20px">
    <Header title="CREATE PROJECT" subtitle="Create a New User Profile" />

    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={checkoutSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              name="title"
              error={!!touched.title && !!errors.title}
              helperText={touched.title && errors.title}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              name="description"
              error={!!touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ gridColumn: "span 4" }}
            />

        <label>
          <h2> Developers </h2>
          <div>
              <Multiselect
              isObject={false}
              options={devs}
              />
          </div>
        </label>

        <label>
          <h2> Project Managers </h2>
          <div>
              <Multiselect
              isObject={false}
              options={projectManager2}
              
              />
          </div>
        </label>

        <label>
          <h2> Proprity </h2>
          <div>
          <Select options={options} />
          </div>
        </label>

        

          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button onClick={handleSubmit} type="submit" color="secondary" variant="contained">
              Create Project
            </Button >
          </Box>
        </form>
      )}
    </Formik>
    </Box>
    
    }

    {currentUser.role !== "Admin" &&
    <div>
    <h1> Your current projects </h1>  
    </div>}

    </>
      
    
    
  );
}

const checkoutSchema = yup.object().shape({
  title: yup.string().required("required"),
  description: yup.string().required("required"),
  /*email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
  */
});
const initialValues = {
  title: "",
  description: "",
  priority: "",
  developers: [],
  projectManagers: []
};

export default AddProject;
