import "./index.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import { faGoogle, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOST_URL from "../utils/Url";
import useLocalStorage from "use-local-storage";
import Typewriter from "../components/common/TypeWriter";
// import Typewriter from "./LoginTypeWriter";
import Divider from "@mui/material/Divider";
import advPics from "../assets/images/headDoc.png";
import logo from "../assets/images/Login.png";
import { Button, CircularProgress, Grid, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { green } from "@mui/material/colors";
import api from "../utils/Url";
import { Box, styled } from "@mui/system";
import LogoImage from "../assets/images/logo.jpg";
import BackgroundImg from "../assets/images/background.jpg";
import { motion } from "framer-motion";



function LoginPage() {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const [menu, setMenus] = useState<any>([]);

  useEffect(() => {
   
  }, []);

  

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const [tokenKey, setTokenKey] = useLocalStorage("name", "");
  let navigate = useNavigate();

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const response = await formik.submitForm(); // Submitting form
  
        if (response.success) {
          const userId = response.userDetails?.userid; // Extracting userid safely
  
          if (userId) {
            localStorage.setItem("userid", userId); // Storing in localStorage
          }
  
          // Store other user details and permissions
          localStorage.setItem("permissions", JSON.stringify(response.menuPermissions));
          localStorage.setItem("userDetails", JSON.stringify(response.userDetails));
          localStorage.setItem("theme", "light-theme");
          localStorage.setItem("userId", response.userDetails.ID); // Store numeric ID as well if needed
  
          // Trigger permissions update event
          window.dispatchEvent(new Event("permissionsUpdated"));
  
          setTimeout(() => {
            navigate(`/home`);
          }, 300);
  
          formik.resetForm();
        } else {
          toast.error("Login Failed! Invalid User or Password");
          setLoading(false);
        }
      } catch (error) {
        console.error("Login Error:", error);
        toast.error("Login Failed! Please try again.");
        setLoading(false);
      }
    }
  };
  
  

  // const handleButtonClick = async () => {
  //   if (!loading) {
  //     setSuccess(false);
  //     setLoading(true);
  //     try {
  //       const response = await formik.submitForm();
  //       if (response.success) {
  //         localStorage.setItem("permissions", JSON.stringify(menu));
  //         localStorage.setItem("theme", "light-theme");
  //         localStorage.setItem("userId", response.data);

  //         setTimeout(() => {
  //           navigate(`/home`);
  //         }, 300);

  //         formik.resetForm();
  //       } else {
  //         toast.error("Login Failed! Invalid User or Password");
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   }
  // };



  const validationSchema = Yup.object({
    userid: Yup.string().required("Username Required"),
    password: Yup.string().required("Password Required"),
  });

  const formik = useFormik({
    initialValues: {
      "userid": "",
      "code": "",
      "password": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `GetLoginDetail`,
        values
      );
      return response.data;
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          padding: "2rem",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <img
          src={LogoImage}
          alt="Logo"
          style={{ width: "60px", marginBottom: "10px" }}
        />
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Asset Management System
        </Typography>

        <form onSubmit={formik.handleSubmit}>

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              background: "rgba(255,255,255,0.5)",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
              },
            }}
            id="userid"
            name="userid"
            value={formik.values.userid}
            onChange={(e) => {
              formik.setFieldValue("userid", e.target.value.toString())
            }}
          />
          {formik.touched.userid && formik.errors.userid && (
            <div style={{ color: "red", marginTop: "-10px", marginBottom: "15px" }}>Username is required</div>
          )}

          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            variant="outlined"
            sx={{
              background: "rgba(255,255,255,0.5)",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
              },
            }}
            id="code"
            name="code"
            value={formik.values.password}
            onChange={(e) => {
              formik.setFieldValue("password", e.target.value.toString())
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red", marginTop: "-10px", marginBottom: "15px" }}>Password is required</div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1,
                background: "#007BFF",
                transition: "0.3s",
                "&:hover": { background: "#0056b3" },
              }}
              onClick={(e) => { handleButtonClick() }}
            >
              LOGIN
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </Box>
  );
}

export default LoginPage;

