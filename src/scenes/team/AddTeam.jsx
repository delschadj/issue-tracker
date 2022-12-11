import React, { useEffect, useState } from "react";
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps, useField } from 'formik';
import Select from 'react-select'
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import { users_colRef } from '../../firebase';
import {UserAuth} from "../../context/AuthContext"

const AddTeam = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState ("")

  const [error, setError] = useState ("")
  const {createUser} = UserAuth();

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

  const handleFormSubmit = async (values) => {

    const docAdd = { 
      full_name: values.full_name,
      email: values.email,
      role: values.role,
     }

    console.log(docAdd);

    await createUser (values.username, values.email, values.password)
    addDoc(users_colRef, docAdd)
    alert ("Succesfully added!")
  };

  const options = [
    { value: 'Developer', label: 'Developer' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Admin', label: 'Admin' }
  ]

  return (
    <Box m="50px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

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
                label="Full name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.full_name}
                name="full_name"
                error={!!touched.full_name && !!errors.full_name}
                helperText={touched.full_name && errors.full_name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="username"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />


              <div>
                <h2> Role </h2>
                <Field as="select" name="role">
                  <option value="Admin"> Admin </option>
                  <option value="Project Manager"> Project Manager </option>
                  <option value="Developer"> Developer </option>
                </Field>
              </div>

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  full_name: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  role: yup.string().required("required"),
});
const initialValues = {
  username: "",
  full_name: "",
  email: "",
  role: "",
};

export default AddTeam;