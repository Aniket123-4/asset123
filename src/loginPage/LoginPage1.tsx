import React, { useState } from "react";
import {
   Grid,
   TextField,
   Button,
   Typography,
   Box,
   InputLabel,
   CircularProgress,
   FormControl,
   FormControlLabel,
   RadioGroup,
   Radio,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/Url"; // Make sure this is your API utility file
import logo from "../assets/images/qq.png";
import "./index.css";
//import LoginImg from "./loginImg.jpg";
import LoginBg from "./tools.jpg";
import LoginImg from "./vehicleService.png";
import { motion } from "framer-motion";
import { t } from "i18next";

const LoginPage1 = () => {
   const [loading, setLoading] = useState(false);
   const [isSignUpMode, setIsSignUpMode] = useState(false);
   const navigate = useNavigate();

   // Handle switching between Sign In and Sign Up modes
   const handleSignUpClick = () => setIsSignUpMode(true);
   const handleSignInClick = () => setIsSignUpMode(false);

   // Validation Schema for Formik (Username and Password are required)
   const validationSchema = Yup.object({
      username: Yup.string().required("Username Required"),
      password: Yup.string().required("Password Required"),
   });

   // const inhouse_outsource =[
   //    {
   //       value :"1" ,label:"outsource"

   //       value :"2" ,label:"inhouse and outsource"
   //    }
   //]
   // Formik hook for form management
   const formik = useFormik({
      initialValues: {
         email: "",
         password: "",
         rememberMe: true,
         username: "",
         id: "",
      },
      validationSchema,
      onSubmit: async (values) => {
         try {
            setLoading(true);
            const response = await api.post("Auth/login", values);

            console.log("values", values);
            // Check if login is successful
            if (response.data.status === 1) {
               localStorage.setItem(
                  "userdata",
                  JSON.stringify([response.data.data])
               );
               localStorage.setItem(
                  "username",
                  JSON.stringify(response.data.data.responseData.username)
               );
               sessionStorage.setItem(
                  "token",
                  JSON.stringify(response.data.data.token)
               );
               navigate("/home");
            } else {
               toast.error(response.data.message);
            }
         } catch (error) {
            toast.error("Login Failed");
         } finally {
            setLoading(false);
         }
      },
   });

   return (
      <Grid container sx={{ justifyContent: "center", alignContent: "center", backgroundImage: `url(${LoginBg})`, backgroundSize: "cover", height: "100vh", opacity: "80%", padding: "5%" }}>
         {/* <Grid item xs={6} sm={6} md={6} sx={{ backgroundImage: `url${LoginImg}`, backgroundSize: "cover", justifyContent: "center", alignContent: "center", }}></Grid> */}
         <motion.div initial="hidden" whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }} style={{ justifyContent: "center", textAlign: "center", padding: "4%", overflow: "hidden", borderRadius: "2rem" }}>
            <Grid item sx={{ justifyContent: "center", alignContent: "center", padding: "4%", textAlign: "center", border: "3px solid black", backgroundColor: "black", opacity: "80%", boxShadow: 24, borderRadius: "2rem" }}>
               <form onSubmit={formik.handleSubmit}>
                  <img
                     src={logo}
                     alt="Logo"
                     style={{ width: "26%", height: "auto" }}
                  />
                  <h3 className="loginh3" style={{ fontSize: "1.6rem", color: "#fff" }}>Vehicle Workshop Management System</h3>
                  <i className="title" style={{ fontSize: "1rem", color: "#fff" }}>"Illuminating Pathways, Ensuring Safety!"</i>
                  <br />
                  <br />
                  <InputLabel sx={{ color: "#fff", textAlign: "start", fontWeight: "1.2rem", marginLeft: "1rem" }}>Username</InputLabel>
                  <TextField
                     fullWidth
                     id="username"
                     name="username"
                     placeholder="Username"
                     value={formik.values.username}
                     onChange={formik.handleChange}
                     onBlur={formik.handleBlur}
                     sx={{ marginBottom: 2, backgroundColor: "#fff", borderRadius: "3rem", color: "#000" }}
                     size="small"
                  />
                  {formik.touched.username && formik.errors.username && (
                     <div style={{ color: "#e7d215", marginTop: "-10px", marginBottom: "15px" }}>Username is required</div>
                  )}
                  <InputLabel sx={{ color: "#fff", textAlign: "start", fontWeight: "1.2rem", marginLeft: "1rem" }}>Password</InputLabel>
                  <TextField
                     fullWidth
                     id="password"
                     name="password"
                     placeholder="Password"
                     type="password"
                     value={formik.values.password}
                     onChange={formik.handleChange}
                     onBlur={formik.handleBlur}
                     sx={{ marginBottom: 2, backgroundColor: "#fff", borderRadius: "3rem", color: "#000" }}
                     size="small"
                  />
                  {formik.touched.password && formik.errors.password && (
                     <div style={{ color: "#e7d215", marginTop: "-10px", marginBottom: "15px" }}>Password is required</div>
                  )}


      

     
      <RadioGroup
    row
    aria-label="type"
    name="type"
    sx={{ borderColor: "#fff" }}
>
    <FormControlLabel
        value="Outsource"
        control={
            <Radio
                sx={{
                    color: "#fff", 
                    "&.Mui-checked": {
                        color: "#fff", 
                    },
                }}
            />
        }
        label={t("text.Outsource")}
        sx={{
            marginTop: "-1%",
            color: "#fff",
        }}
    />
    <FormControlLabel
        value="Inhouse and Outsource"
        control={
            <Radio
                sx={{
                    color: "#fff",
                    "&.Mui-checked": {
                        color: "#fff",
                    },
                }}
            />
        }
        label={t("text.InhouseandOutsource")}
        sx={{ color: "#fff" }}
    />
</RadioGroup>

         
         

                  <Button
                     fullWidth
                     variant="contained"
                     color="secondary"
                     type="submit"
                     disabled={loading}
                     sx={{ marginBottom: 2, borderRadius: "3rem", color: "#fff" }}
                  >
                     {loading ? <CircularProgress size={24} /> : "Login"}
                  </Button>
               </form>
            </Grid>

            
         </motion.div>
      </Grid >
   );
};

export default LoginPage1;
