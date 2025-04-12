
import React, { useState, useEffect } from "react";
import { TextField, Button, Card, Grid, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import api from "../../../utils/Url";

const ChangePassword = () => {
  const { t } = useTranslation();

  // Extract token and username from localStorage
  const username = localStorage.getItem("userid");
  
  const [formData, setFormData] = useState({
    user_id: username,
    password: "",
    saltvc: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, user_id: username }));
  }, [username]);

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!formData.user_id) {
      toast.error("Username is required");
      return;
    }
    if (formData.password !== formData.saltvc) {
      toast.error("Passwords do not match");
      return;
    }
    // if (!token) {
    //   toast.error("Authentication failed! Please log in again.");
    //   return;
    // }

    try {
      const response = await api.post(
        "ChangePassword",
        formData,
        {
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully! Redirecting to login...");
      //  localStorage.clear();
      //  sessionStorage.clear();

        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <Card style={{ padding: "20px", maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        {t("text.ChangePassword")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label={t("text.Username")} name="user_id" fullWidth value={formData.user_id} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("text.NewPassword")}
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("text.ConfirmPassword")}
              name="saltvc"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={formData.saltvc}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {t("text.save")}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Card>
  );
};

export default ChangePassword;

