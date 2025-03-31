import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";

type Props = {};

const LightTypeAdd = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {
      lightId: -1,
      waitege: "",
      volt: "",
      wire: "",
      color: "",
      weight: "",
      lightColor: "",
      powerSource: "",
      partNumber: "",
      photo: "",
    },

    onSubmit: async (values) => {
      const response = await api.post(
         `Department/AddUpdateDepartmentmaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/DepartmentMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  

  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreateLightType")}
          </Typography>

          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: `var(--header-background)`,
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="waitege"
                  name="waitege"
                  label={
                    <CustomLabel text={t("text.Waitege")} required={false} />
                  }
                  value={formik.values.volt}
                  placeholder={t("text.Waitege")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="volt"
                  name="volt"
                  label={<CustomLabel text={t("text.Volt")} required={false} />}
                  value={formik.values.volt}
                  placeholder={t("text.Volt")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="wire"
                  name="wire"
                  label={<CustomLabel text={t("text.Wire")} required={false} />}
                  value={formik.values.wire}
                  placeholder={t("text.Wire")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="color"
                  name="color"
                  label={
                    <CustomLabel text={t("text.Color")} required={false} />
                  }
                  value={formik.values.color}
                  placeholder={t("text.Color")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="weight"
                  name="weight"
                  label={
                    <CustomLabel text={t("text.Weight")} required={false} />
                  }
                  value={formik.values.weight}
                  placeholder={t("text.Weight")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="lightColor"
                  name="lightColor"
                  label={
                    <CustomLabel text={t("text.LightColor")} required={false} />
                  }
                  value={formik.values.lightColor}
                  placeholder={t("text.LightColor")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  type="date"
                  id="powerSource"
                  name="powerSource"
                  label={
                    <CustomLabel
                      text={t("text.PowerSource")}
                      required={false}
                    />
                  }
                  value={formik.values.powerSource}
                  placeholder={t("text.PowerSource")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="partNumber"
                  name="partNumber"
                  label={
                    <CustomLabel text={t("text.PartNumber")} required={false} />
                  }
                  value={formik.values.partNumber}
                  placeholder={t("text.PartNumber")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e: any) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default LightTypeAdd;
