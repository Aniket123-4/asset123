import "./index.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
// import advPics from "../assets/images/headDoc.png";
// import logo from "../assets/images/Login.png";
import { Button, CircularProgress, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menu, setMenus] = useState<any>([]);

  const navigate = useNavigate();

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
  // let navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const response = await formik.submitForm();
  
        if (response.success) {
          const userId = response.userDetails?.userid;
  
          if (userId) {
            localStorage.setItem("userid", userId);
          }

          const UserCreationResponse =await api.post("UserCreation", { Id:0});
          if (UserCreationResponse.data.success) {
            const userCreationData = UserCreationResponse.data.data;
            localStorage.setItem("userCreation", JSON.stringify(userCreationData));
          } else {
            console.error("Failed to fetch user creation data");
          }
  
          // Get role name from RoleMaster API
          const roleResponse = await api.post("RoleMaster", {    "Type": 4 });
          if (roleResponse.data.success) {
            const roles = roleResponse.data.data;
            const userRoleId = parseInt(response.userDetails.roles);
            const userRole = roles.find((role: any) => role.roleID === userRoleId);
            
            // Store role name instead of ID
            if (userRole) {
              localStorage.setItem("roles", (userRole.RoleName));
            } else {
              console.warn("Role not found, storing ID instead");
              localStorage.setItem("roles", (response.userDetails.roles));
            }
          }
  
          // Store other user details
          localStorage.setItem("permissions", JSON.stringify(response.menuPermissions));
          localStorage.setItem("userDetails", JSON.stringify(response.userDetails));
          localStorage.setItem("theme", "light-theme");
          localStorage.setItem("userId", response.userDetails.ID);
  
          window.dispatchEvent(new Event("permissionsUpdated"));
  
          setTimeout(() => {
            navigate(`/home`);
          }, 300);
  
          formik.resetForm();
        } else {
          // toast.error("Login Failed! Invalid User or Password");
          setLoading(false);
        }
      } catch (error) {
        console.error("Login Error:", error);
        toast.error("Login Failed! Please try again.");
        setLoading(false);
      }
    }
  };
  

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
  type={showPassword ? "text" : "password"}
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
  id="password"
  name="password"
  value={formik.values.password}
  onChange={(e) => {
    formik.setFieldValue("password", e.target.value.toString());
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={togglePasswordVisibility} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red", marginTop: "-10px", marginBottom: "15px" }}>Password is required</div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
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



// import React from "react";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   TextField, 
//   Button, 
//   IconButton, 
//   InputAdornment, 
//   Typography,
//   Box,
//   Fade
// } from "@mui/material";
// import { 
//   Visibility, 
//   VisibilityOff, 
//   Login as LoginIcon 
// } from "@mui/icons-material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { toast, ToastContainer } from "react-toastify";
// import api from "../utils/Url";
// import HOST_URL from "../utils/Url";
// import useLocalStorage from "use-local-storage";
// import styled from "@emotion/styled";
// import LogoImage from "../assets/images/logo.jpg";
// import BackgroundImg from "../assets/images/background.jpg";

// const GlassContainer = styled(motion.div)`
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(12px);
//   border-radius: 20px;
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   padding: 2.5rem;
//   width: 100%;
//   max-width: 420px;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//   position: relative;
//   overflow: hidden;
// `;

// const FloatingLabel = styled(motion.div)`
//   position: absolute;
//   left: 15px;
//   top: -10px;
//   font-size: 0.8rem;
//   background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
//   -webkit-background-clip: text;
//   background-clip: text;
//   color: transparent;
//   padding: 0 5px;
// `;

// const GradientButton = styled(Button)`
//   background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
//   color: white;
//   border-radius: 10px;
//   padding: 12px 24px;
//   font-weight: 600;
//   text-transform: none;
//   transition: all 0.3s ease;
//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
//   }
// `;

// function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     userid: Yup.string().required("Username is required"),
//     password: Yup.string().required("Password is required"),
//   });

//   const formik = useFormik({
//     initialValues: { userid: "", code: "", password: "" },
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         const response = await api.post(`GetLoginDetail`, values);
//         if (response.data.success) {
//           // ... existing success handling ...
//           setTimeout(() => navigate(`/home`), 500);
//         }
//       } catch (error) {
//         toast.error("Login failed. Please check your credentials.");
//       }
//       setIsLoading(false);
//     },
//   });

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: `linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05)), url(${BackgroundImg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         padding: 2,
//       }}
//     >
//       <ToastContainer position="top-center" autoClose={3000} />

//       <GlassContainer
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Box sx={{ textAlign: "center", mb: 4 }}>
//           <motion.img
//             src={LogoImage}
//             alt="Logo"
//             style={{ width: 80, marginBottom: 16 }}
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, loop: Infinity, ease: "linear" }}
//           />
//           <Typography
//             variant="h4"
//             component="h1"
//             sx={{
//               fontWeight: 700,
//               background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
//               WebkitBackgroundClip: "text",
//               backgroundClip: "text",
//               color: "transparent",
//               mb: 1,
//             }}
//           >
//             Asset Management
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Secure Access to Your Digital Assets
//           </Typography>
//         </Box>

//         <form onSubmit={formik.handleSubmit}>
//           <Box sx={{ position: "relative", mb: 3 }}>
//             <FloatingLabel
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               Username
//             </FloatingLabel>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Enter your username"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "10px",
//                   "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//                   "&:hover fieldset": { borderColor: "#2196f3" },
//                 },
//               }}
//               {...formik.getFieldProps("userid")}
//               error={formik.touched.userid && Boolean(formik.errors.userid)}
//               helperText={formik.touched.userid && formik.errors.userid}
//             />
//           </Box>

//           <Box sx={{ position: "relative", mb: 3 }}>
//             <FloatingLabel
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               Password
//             </FloatingLabel>
//             <TextField
//               fullWidth
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "10px",
//                   "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//                   "&:hover fieldset": { borderColor: "#2196f3" },
//                 },
//               }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                       sx={{ color: "#2196f3" }}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               {...formik.getFieldProps("password")}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//             />
//           </Box>

//           <GradientButton
//             fullWidth
//             type="submit"
//             disabled={isLoading}
//             sx={{ mt: 2 }}
//           >
//             <AnimatePresence mode="wait">
//               {isLoading ? (
//                 <motion.div
//                   key="loading"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <CircularProgress size={20} sx={{ color: 'white' }} />
//                     Authenticating...
//                   </span>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="login"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
//                 >
//                   <LoginIcon sx={{ fontSize: 20 }} />
//                   Sign In
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </GradientButton>

//           <Typography
//             variant="body2"
//             sx={{
//               mt: 3,
//               textAlign: "center",
//               color: "text.secondary",
//               cursor: "pointer",
//               "&:hover": { color: "#2196f3" },
//             }}
//           >
//             Forgot Password?
//           </Typography>
//         </form>

//         <Fade in timeout={2000}>
//           <Typography
//             variant="caption"
//             sx={{
//               position: "absolute",
//               bottom: 16,
//               left: 0,
//               right: 0,
//               textAlign: "center",
//               color: "rgba(255,255,255,0.6)",
//             }}
//           >
//             © {new Date().getFullYear()} Asset Management System
//           </Typography>
//         </Fade>
//       </GlassContainer>
//     </Box>
//   );
// }

// export default LoginPage;