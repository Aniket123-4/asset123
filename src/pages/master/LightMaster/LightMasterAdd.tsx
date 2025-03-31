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
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import nopdf from "../../../assets/images/nopdf.png";

type Props = {};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const LightMasterAdd = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectLightType") },
  ]);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const getLightType = () => {
    const collectData = {
        lightTypeId: -1,
    };
    api.post(`PollType/GetPollType`, collectData).then((res) => {
      const arr = [];
      console.log("resultType" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["lightTypeName"],
          value: res.data.data[index]["lightTypeId"],
        });
      }
      setOption(arr);
    });
  };

  useEffect(() => {
    getLightType();
  }, []);

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "lightImg") {
      setModalImg(formik.values.lightImg);
    }
  };

  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    console.log("check");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg,png) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {
      lightId: -1,
      lightName: "",
      lightTypeId: 0,
      lightImg: "",
      watt: "",
      volt: "",
      wire: "",
      wight: "",
      color: "",
      lightColor: "",
      powerSource: "",
      partNumber: "",
      itemDimention: "",
      itemASIN: "",
      genericName: "",
      manufacture: "",
      countryOfOrigen: "",
      supplier: "",
      warr_Garr_period: "",
      currentStatus: "",

      createdBy: "",
      updatedBy: "",
      createdOn: new Date().toISOString().slice(0, 10),
      updatedOn: new Date().toISOString().slice(0, 10),
    },

    onSubmit: async (values) => {
      const response = await api.post(`PoleMaster/AddUpdatePoleMaster`, values);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/LightMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  // const requiredFields = ["dept_name"];

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
            {t("text.CreatePollMaster")}
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
                  id="lightName"
                  name="lightName"
                  label={
                    <CustomLabel text={t("text.LightName")} required={false} />
                  }
                  value={formik.values.lightName}
                  placeholder={t("text.LightName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={4} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  // value={
                  //   option.find(
                  //     (option: any) => option.value === formik.values.countryId
                  //   ) || null
                  // }
                  onChange={(event, newValue) => {
                    console.log(newValue);

                    formik.setFieldValue("lightTypeId", newValue?.value);
                    //formik.setFieldValue("poleTypeId", newValue?.label);
                    
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectLightType")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="watt"
                  name="watt"
                  label={
                    <CustomLabel text={t("text.watt")} required={false} />
                  }
                  value={formik.values.watt}
                  placeholder={t("text.watt")}
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
                  label={
                    <CustomLabel text={t("text.volt")} required={false} />
                  }
                  value={formik.values.volt}
                  placeholder={t("text.volt")}
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
                  label={
                    <CustomLabel text={t("text.wire")} required={false} />
                  }
                  value={formik.values.wire}
                  placeholder={t("text.wire")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="wight"
                  name="wight"
                  label={
                    <CustomLabel text={t("text.wight")} required={false} />
                  }
                  value={formik.values.wight}
                  placeholder={t("text.wight")}
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
                  type="color"
                  label={
                    <CustomLabel text={t("text.color")} required={false} />
                  }
                  value={formik.values.color}
                  placeholder={t("text.color")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  type="color"
                  id="lightColor"
                  name="lightColor"
                  label={
                    <CustomLabel text={t("text.lightColor")} required={false} />
                  }
                  value={formik.values.lightColor}
                  placeholder={t("text.lightColor")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  
                  id="powerSource"
                  name="powerSource"
                  label={
                    <CustomLabel
                      text={t("text.powerSource")}
                      required={false}
                    />
                  }
                  value={formik.values.powerSource}
                  placeholder={t("text.powerSource")}
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
                    <CustomLabel
                      text={t("text.partNumber")}
                      required={false}
                    />
                  }
                  value={formik.values.partNumber}
                  placeholder={t("text.partNumber")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  id="itemDimention"
                  name="itemDimention"
                  label={
                    <CustomLabel text={t("text.itemDimention")} required={false} />
                  }
                  value={formik.values.itemDimention}
                  placeholder={t("text.itemDimention")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="itemASIN"
                  name="itemASIN"
                  label={
                    <CustomLabel text={t("text.itemASIN")} required={false} />
                  }
                  value={formik.values.itemASIN}
                  placeholder={t("text.itemASIN")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="genericName"
                  name="genericName"
                  label={
                    <CustomLabel text={t("text.genericName")} required={false} />
                  }
                  value={formik.values.genericName}
                  placeholder={t("text.genericName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="manufacture"
                  name="manufacture"
                  label={
                    <CustomLabel text={t("text.manufacture")} required={false} />
                  }
                  value={formik.values.manufacture}
                  placeholder={t("text.manufacture")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="countryOfOrigen"
                  name="countryOfOrigen"
                  label={
                    <CustomLabel text={t("text.countryOfOrigen")} required={false} />
                  }
                  value={formik.values.countryOfOrigen}
                  placeholder={t("text.countryOfOrigen")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>


              <Grid item lg={4} xs={12}>
                <TextField
                  id="supplier"
                  name="supplier"
                  label={
                    <CustomLabel text={t("text.supplier")} required={false} />
                  }
                  value={formik.values.supplier}
                  placeholder={t("text.supplier")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="warr_Garr_period"
                  name="warr_Garr_period"
                  label={
                    <CustomLabel text={t("text.warrGarrperiod")} required={false} />
                  }
                  value={formik.values.warr_Garr_period}
                  placeholder={t("text.warrGarrperiod")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="currentStatus"
                  name="currentStatus"
                  label={
                    <CustomLabel
                      text={t("text.currentStatus")}
                      required={false}
                    />
                  }
                  value={formik.values.currentStatus}
                  placeholder={t("text.currentStatus")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={<CustomLabel text={t("text.lightImg")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "lightImg")}
                  />
                </Grid>
                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.lightImg == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={formik.values.lightImg}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle("lightImg")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>
                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={2}>
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

export default LightMasterAdd;
