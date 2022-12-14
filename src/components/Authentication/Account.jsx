import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { users_colRef, db } from '../../firebase';
import { getDocs, query, where, updateDoc, getDoc, doc } from "firebase/firestore";

import { Box, Button, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps, useField } from 'formik';
import Select from 'react-select'
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const AddIssue = ({button}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();
  const [full_name, setFullName] = useState ("")
  const [username, setUsername] = useState ("")
  const [role, setRole] = useState ("")
  const [docID, setDocID] = useState ()

  // Get current user once
  useEffect(()=> {
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", user.email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setCurrentUser (doc.data())
        setDocID (doc.id)
      });
    }

    loadRabbit();
    
  }, [user]);

  useEffect (() => {
    setFullName (currentUser["full_name"])
    setUsername (currentUser["username"])
    setRole (currentUser["role"])
  }, );
  
  const initialValues = {
    full_name: full_name,
    username: username,
    email: user.email,
    role: role
  };




  const handleLogout = async () => {
    try {
      await logout()
      navigate ("/login")
    }
    catch (e) {
      console.log (e.message)
    }
  }

  console.log (docID)

  const handleFormSubmit = async (values) => {

    const docAdd = { 
      full_name: values.full_name,
      username: values.username,
     }

    console.log(docAdd);


    // db.collection("app/users/" + uid + "/notifications")...
    // db.collection("app").document("users").collection(uid).document("notifications")

    const userRef = doc(db, "users", docID);

    await updateDoc(userRef, {
      full_name: values.full_name,
      username: values.username,
      email: values.email,
    });
    window.location.reload(false)
  };

  


  return (
    <>
    {full_name &&
    <Box m="50px">
    <Header title="ACCOUNT" subtitle="View / Edit your account information" />

    <Formik
      onSubmit={(values, { resetForm }) => {

        handleFormSubmit (values);
        resetForm();
  
  }}
      initialValues={initialValues}
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
              label="Full Name"
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
              type="text"
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
              disabled={handleSubmit}
              fullWidth
              variant="filled"
              type="text"
              label="Email"
              onBlur={handleBlur}
              value={values.email}
              name="email"
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              disabled={handleSubmit}
              fullWidth
              variant="filled"
              type="text"
              label="Role"
              onBlur={handleBlur}
              value={values.role}
              name="role"
              error={!!touched.role && !!errors.role}
              helperText={touched.role && errors.role}
              sx={{ gridColumn: "span 4" }}
            />

            <p> You can´t change your email or Role </p>

          </Box>
          <Box display="flex" justifyContent="center" mt="60px">
            <Button onClick={handleSubmit} type="submit" variant="contained">
              Update profile
            </Button >
          </Box>
        </form>
      )}
    </Formik>

      {button}

      <button onClick={handleLogout} className='border px-6 py-2 my-4'> Logout </button>
    </Box>
    }

    </>
      
    
    
  );
}



export default AddIssue;