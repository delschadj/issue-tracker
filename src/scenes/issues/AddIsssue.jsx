import React, { useEffect, useState } from "react";
import Multiselect from 'multiselect-react-dropdown';

import {UserAuth} from "../../context/AuthContext"
import { projectsColRef ,issuesColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps, useField } from 'formik';
import Select from 'react-select'
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const AddIssue = ({button}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState ("")
  const [developers, setDevs] = useState ()
  const [projects, setProjects] = useState ()
  const options = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ]

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

  // Get all projects
  useEffect(() => {
    onSnapshot (projectsColRef, (snapshot) => {
      let allProjects = []
      snapshot.docs.forEach (project => {
        allProjects.push (project.data().title)
        
        
      })
  
      setProjects (allProjects)

    })
 
  }, [projectsColRef]);



  const handleFormSubmit = async (values) => {

    const docAdd = { 
      description: values.description,
      project: values.project,
      assignTo: values.assignTo,
      priority: values.priority,
     }

    console.log(docAdd);

    await addDoc(issuesColRef, docAdd)
    alert ("Succesfully added!")
  };


  return (
    <Box m="50px">
      <Header title="CREATE ISSUE" subtitle="Create a New Issue/Ticket" />

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
                <h2> Project </h2>
                <Field as="select" name="project">
                    {projects && projects.map(function(project, index){
                          return <option value={project}> {project} </option>;
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

              <div id="checkbox-group">
                <h2> Assign To </h2>
                <div role="group" aria-labelledby="checkbox-group">
                    {developers && developers.map(function(name, index){
                          return <label> <Field type="checkbox" name="assignTo" value={name} /> {name} </label> ;
                        })}
                </div>
              </div>

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" variant="contained">
                Add Issue
              </Button>
            </Box>
          </form>
        )}
      </Formik>

    {button}

    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  description: yup.string().required("required"),
  project: yup.string().required("required"),
  priority: yup.string().required("required"),
});
const initialValues = {
  description: "",
  project: "",
  assignTo: "",
  priority: "Low",
};

export default AddIssue;