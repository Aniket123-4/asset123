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




const PollMasterAdd = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectPollType") },
  ]);



  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");

  const handlePanClose = () => {
    setPanOpen(false);

  };

  const getPollType = () => {
    const collectData = {
      poleTypeId: -1,
    };
    api.post(`PollType/GetPollType`, collectData).then((res) => {
      const arr = [];
      console.log("resultType" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["poleTypeName"],
          value: res.data.data[index]["poleTypeId"],
        });
      }
      setOption(arr);
    });
  };

  useEffect(() => {
    getPollType();

  }, [])

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "poleImg") {
      setModalImg(formik.values.poleImg);
    }
  };


  // const ConvertBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const base64ToByteArray = (base64: string): Uint8Array => {
  //   // Remove the data URL scheme if it exists
  //   const base64String = base64.split(",")[1];

  //   // Decode the Base64 string
  //   const binaryString = window.atob(base64String);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);

  //   // Convert binary string to Uint8Array
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   return bytes;
  // };

  // const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  //   let binary = "";
  //   const len = uint8Array.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(uint8Array[i]);
  //   }
  //   return window.btoa(binary);
  // };

  // const otherDocChangeHandler = async (event: any, params: string) => {
  //   console.log("Image file change detected");

  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const fileNameParts = file.name.split(".");
  //     const fileExtension =
  //       fileNameParts[fileNameParts.length - 1].toLowerCase();

  //     if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
  //       alert(
  //         "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
  //       );
  //       event.target.value = null;
  //       return;
  //     }

  //     try {
  //       const base64Data = (await ConvertBase64(file)) as string;
  //       console.log("Base64 image data:", base64Data);

  //       // Convert Base64 to Uint8Array
  //       const byteArray = base64ToByteArray(base64Data);
  //       console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

  //       // Convert Uint8Array to base64 string
  //       const base64String = uint8ArrayToBase64(byteArray);
  //       console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

  //       // Set value in Formik
  //       formik.setFieldValue(params, base64String);


  //     } catch (error) {
  //       console.error("Error converting image file to Base64:", error);
  //     }
  //   }
  // };

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
      poleId: -1,
      poleName: "",
      poleTypeId: null,
      poleImg: "",
      hight: "",
      wight: "",
      thickness: "",
      poleColor: "",
      underGroundPoleHight: "",
      num_Of_Light_Attach: "",
      currentStatus: "",
      createdBy: "",
      updatedBy: "",
      createdOn: new Date().toISOString().slice(0, 10),
      updatedOn: new Date().toISOString().slice(0, 10),
    },

    validationSchema: Yup.object({
      poleName: Yup.string().required(t("text.reqPollName")),
      poleTypeId: Yup.string().required(t("text.reqPollType")),

    }),

    onSubmit: async (values) => {
      const response = await api.post(
        `PoleMaster/AddUpdatePoleMaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/master/PollMaster");
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
                  id="poleName"
                  name="poleName"
                  label={
                    <CustomLabel text={t("text.poleName")} required={true} />
                  }
                  value={formik.values.poleName}
                  placeholder={t("text.poleName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.poleName && formik.errors.poleName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.poleName}
                  </div>
                ) : null}
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

                    formik.setFieldValue("poleTypeId", newValue?.value);
                      formik.setFieldValue("poleTypeId", newValue?.label);
                    // formik.setFieldTouched("zoneID", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectPollType")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.poleTypeId && formik.errors.poleTypeId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.poleTypeId}
                  </div>
                ) : null}

              </Grid>



              <Grid item lg={4} xs={12}>
                <TextField
                  id="hight"
                  name="hight"
                  label={
                    <CustomLabel text={t("text.Hight")} required={false} />
                  }
                  value={formik.values.hight}
                  placeholder={t("text.Hight")}
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
                  id="thickness"
                  name="thickness"
                  label={
                    <CustomLabel text={t("text.Thickness")} required={false} />
                  }
                  value={formik.values.thickness}
                  placeholder={t("text.Thickness")}
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
                  id="poleColor"
                  name="poleColor"
                  label={
                    <CustomLabel text={t("text.poleColor")} required={false} />
                  }
                  value={formik.values.poleColor}
                  placeholder={t("text.poleColor")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  type="underGroundPoleHight"
                  id="underGroundPoleHight"
                  name="underGroundPoleHight"
                  label={
                    <CustomLabel
                      text={t("text.underGroundPoleHight")}
                      required={false}
                    />
                  }
                  value={formik.values.underGroundPoleHight}
                  placeholder={t("text.underGroundPoleHight")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="num_Of_Light_Attach"
                  name="num_Of_Light_Attach"
                  label={
                    <CustomLabel
                      text={t("text.numOfLightAttach")}
                      required={false}
                    />
                  }
                  value={formik.values.num_Of_Light_Attach}
                  placeholder={t("text.numOfLightAttach")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
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
                    label={<CustomLabel text={t("text.poleImg")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "poleImg")}
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
                    {formik.values.poleImg == "" ? (
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
                        src={formik.values.poleImg}
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
                      onClick={() => modalOpenHandle("poleImg")}
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

export default PollMasterAdd;
