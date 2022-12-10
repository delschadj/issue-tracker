import React, { useEffect, useState } from "react";
import Multiselect from 'multiselect-react-dropdown';

import {UserAuth} from "../../context/AuthContext"
import { projectsColRef ,issuesColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import Select from 'react-select'
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const AddIssue = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [devs, setDevs] = useState ()
  const options = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ]
  const [projects, setProjects] = useState ()
  

  const [title, setTitle] = useState ("")
  const [description, setDescription] = useState ("")
  const [project, setProject] = useState ([])
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

  // Get all projects
  useEffect(() => {
    onSnapshot (projectsColRef, (snapshot) => {
      let allProjects = []
      snapshot.docs.forEach (project => {
        allProjects.push ({value: project.data()["title"] , label: project.data()["title"]})
      })
  
      setProjects (allProjects)
  
    })
    
  }, [projectsColRef]);


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try{
      // Object to paste
      const docAdd = ({ 
        description: description,
        assignTo: assignTo,
        priority: priority,
       })

      // Paste
      console.log (docAdd)
    }

    catch (e) {
      console.log (e.message)
    }
  }


  return (
    <>
    

    <Box m="20px">
    <Header title="CREATE ISSUE" subtitle="Create a New issue/ticket" />

    <Formik
      onSubmit={handleSubmit}
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
              label="Description"
              onBlur={handleBlur}
              onChange={(e) => setDescription(e.target.value)}
              value={values.description}
              name="description"
              error={!!touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ gridColumn: "span 4" }}
            />

        <label>
          <h2> Project </h2>
          <div>
            <Select 
              options={projects} 
            />
          </div>
        </label>

        <label>
          <h2> Assign to </h2>
          <div>
              <Multiselect
              isObject={false}
              options={devs}
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              />
          </div>
        </label>

        <label>
          <h2> Priority </h2>
          <div>
            <Select 
              options={options}
            />
          </div>
        </label>

        

          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Create Project
            </Button>
          </Box>
        </form>
      )}
    </Formik>
    </Box>

    </>
      
    
    
  );
}

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default AddIssue;