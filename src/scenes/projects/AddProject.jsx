import React, { useEffect, useState } from "react";
import Select from 'react-select'
import Multiselect from 'multiselect-react-dropdown';

import {UserAuth} from "../../context/AuthContext"
import { projectsColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps, useField } from 'formik';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { async } from "@firebase/util";

function AddProject({button}) {

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState ("")
  const [developers, setDevs] = useState ()
  const options = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ]

  const [projectManagers, setProjectManagers] = useState ([])
  
  const [title, setTitle] = useState ("")
  const [description, setDescription] = useState ("")

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
  
      setProjectManagers (allPMs)

    })
 
  }, [users_colRef]);
  
  // Get all developers
  const qDev = query(users_colRef, where("role", "==", "Developer"));
  useEffect(() => {
    onSnapshot (qDev, (snapshot) => {
      let allDevelopers = []
      snapshot.docs.forEach (dev => {
        allDevelopers.push (dev.data().full_name)
        
        
      })
  
      setDevs (allDevelopers)

    })
 
  }, [users_colRef]);



  const handleFormSubmit = async (values) => {

    const docAdd = { 
      title: values.title,
      description: values.description,
      projectManager: values.projectManager,
      developers: values.developers,
      priority: values.priority,
     }

    console.log(docAdd);

    await addDoc(projectsColRef, docAdd)
    alert ("Succesfully added!")
  };
  


  return (
    <>
    {currentUser && currentUser.role === "Admin" && developers && 

    <Box m="20px">
    <Header title="CREATE PROJECT" subtitle="Create a New Project" />

    <Formik
      onSubmit={(values, { resetForm }) => {

        handleFormSubmit (values);
        resetForm();
  
  }}
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
        

        <div id="checkbox-group">
          <h2> Developers </h2>
          <div role="group" aria-labelledby="checkbox-group">
              {developers.map(function(name, index){
                    return <label> <Field type="checkbox" name="developers" value={name} /> {name} </label> ;
                  })}
          </div>
        </div>
          

        <div id="checkbox-group">
          <h2> Project Manager </h2>
          <Field as="select" name="projectManager">
              {projectManagers.map(function(projectManager, index){
                    return <option value={projectManager}> {projectManager} </option>;
                  })}
          </Field>
        </div>
          
        
        <div>
            <h2> Priority </h2>
            <Field as="select" name="priority">
             <option value="Low"> Low </option>
             <option value="Medium"> Medium </option>
             <option value="High"> High </option>
           </Field>
        </div>



          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button onClick={handleSubmit} type="submit" variant="contained">
              Create Project
            </Button >
          </Box>
        </form>
      )}
    </Formik>

    {button}

    </Box>
    
    }

    {currentUser && currentUser.role !== "Admin" && developers && 

    <Box m="20px">
    <Header title="No access" subtitle="Only admins can add projects." />

    </Box>

    

    }

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
  priority: "Low",
  developers: [],
  projectManager: ""
};

export default AddProject;