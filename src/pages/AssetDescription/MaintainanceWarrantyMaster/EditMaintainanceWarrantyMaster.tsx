


import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider, Table,
  MenuItem,
  TextField,
  Typography,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  AutocompleteRenderInputParams,
  FormControl,
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
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import { Pending } from "@mui/icons-material";

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


const EditMaintainanceWarrantyMaster = (props: Props) => {

  const location = useLocation();
  let navigate = useNavigate();
  const requiredFields = ["stateName", "countryId"];
  const { t } = useTranslation();
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);


  const WarrentyOption = [

    { value: "Warranty", label: "Warranty" },
    { value: "AMC", label: "AMC" },
    { value: "Guarantee", label: "Guarantee" },
    { value: "Repair", label: "Repair" },
  ];
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();

  const [itemValue, setItemValue] = useState();
  const [vendorValue, setVendorValue] = useState();
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), empId: -1, empName: "" },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);
  const [assetCodeOptions, setAssetCodeOptions] = useState([]);

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    // getVehicleDetails();
    // getVendorData();
    fetchAssets();
    fetchEmployeeDetail();
  }, []);

  const fetchEmployeeDetail = async () => {
    try {
      const response = await api.post("EmployeeDetail", {
        "Emp_id_1": -1,
        "EmpImage_38": "any",
        "empsign": "any",
        "EmployeeThumb": "any",
        "ThumbTemplate": "any",
        "ThumbTemplate2": "any",
        "EmployeeThumb2": "any",
        "ThumbTemplate3": "any",
        "ThumbTemplate4": "any",
        "Type": 4
      });

      if (response.data.success && response.data.data.length > 0) {
        const employeeList = response.data.data.map((emp: any) => {
          const fullName = `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname}`.replace(/\s+/g, ' ').trim();
          return {
            label: fullName, // for showing in dropdown
            value: fullName, // store full name
          };
        });
        setEmployeeOptions(employeeList);
      } else {
        toast.warn("No employee data found.");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details.");
    }
  };

  const bufferToBase64 = (bufferObj: any) => {
    if (!bufferObj) return "";

    if (!bufferObj.data || !Array.isArray(bufferObj.data) || bufferObj.data.length === 0) {
      console.warn("Invalid or empty buffer object provided.");
      return "";
    }

    try {
      const uint8Array: any = new Uint8Array(bufferObj.data);
      const base64String = btoa(String.fromCharCode(...uint8Array));
      return base64String;
    } catch (error) {
      console.error("Error converting buffer to Base64:", error);
      return "";
    }
  };


  const handleFileChange = (event: any, fieldName: string) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg'].includes(fileExtension || '')) {
      alert("Only .jpg image file is allowed to be uploaded.");
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64String = e.target?.result as string;
      const base64Data = base64String.split(',')[1]; // Extract Base64 part without prefix
      formik.setFieldValue(fieldName, base64Data); // Store clean base64
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file); // Read file as Data URL
  };

  const handlePanClose1 = () => {
    setOpen(false);
  };

  const modalOpenHandle1 = (event: string) => {
    setOpen(true);
    const base64Prefix = "data:image/jpg;base64,";

    let imageData = '';
    switch (event) {
      case "FileContent":
        imageData = formik.values.FileContent;
        break;

    }

    if (imageData) {
      console.log("imageData", base64Prefix + imageData);
      setImg(base64Prefix + imageData);
    } else {
      setImg('');
    }
  };

  const otherDocChangeHandler = (event: any, params: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg'].includes(fileExtension || '')) {
      alert("Only .jpg image file is allowed to be uploaded.");
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64String = e.target?.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      formik.setFieldValue(params, base64Data);
      console.log(`File '${file.name}' loaded as base64 string`);
      console.log("base64Data", base64Data);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const fetchAssets = async () => {
    try {
      const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
      if (response.data.success) {
        setAssetCodeOptions(
          response.data.data.map((item: any) => ({
            label: `${item.ResourceCode} (${item.ResourceName})`, // Display ResourceCode - ResourceName
            value: item.ID, // ID used as resid
          }))
        );
      } else {
        toast.warn("No assets found.");
      }
    } catch (error) {
      toast.error("Failed to load assets.");
    }
  };

  const formik = useFormik({
    initialValues: {
      id_MW: location.state?.id_MW || 0,
      MaintenanceDate: location.state?.MaintenanceDate || defaultValues,
      Warrenty: location.state?.Warrenty || "",
      WarrentyFDate: location.state?.WarrentyFDate || defaultValues,
      WarrentyTDate: location.state?.WarrentyTDate || defaultValues,
      WarrentyValue: location.state?.WarrentyValue || "",
      WarrentyRemark: location.state?.WarrentyRemark || "",
      VenderName: location.state?.VenderName || "",
      inst: location.state?.inst || "",
      ses: location.state?.ses || "",
      resid: location.state?.resid || 0,
      Attachment: location.state?.Attachment || "",
      FileContent: bufferToBase64(location.state?.FileContent) || "",
      user_id: location.state?.user_id || 0,
      divisionid: location.state?.divisionid || 0,
      FileAttachmentNew: location.state?.FileAttachmentNew || "",
      LastAttachIn: location.state?.LastAttachIn || "",
      Type: 2 // Always fixed as 1



    },

    // validationSchema: Yup.object({
    //   itemId: Yup.string()
    //     .required(t("text.reqVehNum")),
    //   vendorId: Yup.string()
    //     .required(t("text.reqVendorName")),

    // }),



    onSubmit: async (values) => {
      if (values.FileContent == null || values.FileContent == "") {
        values.FileContent = "any";
      }
      const response = await api.post(`MaintenanceWarrenty`, values);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/AssetDescription/MaintainanceWarrantyMaster")
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });



  // const handlePanClose = () => {
  //   setPanOpen(false);
  // };

  // const modalOpenHandle = (event: string) => {
  //   setPanOpen(true);
  //   const base64Prefix = "data:image/jpeg;base64,";

  //   let imageData = '';
  //   switch (event) {
  //     case "FileContent":
  //       imageData = formik.values.FileContent;
  //       break;
  //     default:
  //       imageData = '';
  //   }
  //   if (imageData) {
  //     const imgSrc = imageData.startsWith(base64Prefix) ? imageData : base64Prefix + imageData;
  //     console.log("imageData", imgSrc);
  //     setImg(imgSrc);
  //   } else {
  //     setImg('');
  //   }
  // };

  // const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   // Validate file type (only allow images)
  //   const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //   if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
  //     alert("Only .jpg, .jpeg, or .png image files are allowed.");
  //     event.target.value = ''; // Clear input field
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const base64String = reader.result as string;

  //     // Use regex to remove the base64 prefix dynamically
  //     const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

  //     if (base64Content) {
  //       formik.setFieldValue(params, base64Content); // Store the stripped base64 string
  //     } else {
  //       alert("Error processing image data.");
  //     }
  //   };

  //   reader.onerror = () => {
  //     alert("Error reading file. Please try again.");
  //   };

  //   reader.readAsDataURL(file);
  // };

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

          <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.EditMaintainanceWarranty")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>

                <Autocomplete
                  disablePortal
                  id="asset-code-dropdown"
                  options={assetCodeOptions}
                  fullWidth
                  size="small"
                  value={assetCodeOptions.find((option: any) => option.value === (formik.values.resid)) || null} // FIXED matching
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("resid", newValue?.value || ""); // Set resid internally
                  }}
                  renderInput={(params) => (
                    <TextField
                    {...params}
                    label={
                        <CustomLabel
                            text={t("text.SelectAssetcode")}
                            required={true}
                        />
                    }

                />
                  )}
                />
              </Grid>


              {/* effective data */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="MaintenanceDate"
                  id="MaintenanceDate"
                  value={formik.values.MaintenanceDate}
                  placeholder={t("text.SelectDate")}
                  onChange={(e) => {
                    formik.setFieldValue("MaintenanceDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.effDate && formik.errors.effDate && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.effDate}</div>
                )} */}
              </Grid>
              {/* Vehicle Number */}

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="can-be-used-dropdown"
                  options={WarrentyOption}
                  fullWidth
                  size="small"
                  value={
                    WarrentyOption.find((option: any) => option.value === formik.values.Warrenty) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("Warrenty", newValue?.value || ""); // store value
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectWarrantyAMC")} required={false} />}
                    />
                  )}
                />

              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={WarrentyOption}
                  value={formik.values.Warrenty}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("Warrenty", parseInt(newValue?.value));
                    formik.setFieldValue("Warrenty", newValue?.label);
                    // formik.setFieldValue("empId", parseInt(newValue?.empId));
                    // formik.setFieldValue("empName", newValue?.empName);
                    setItemValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectWarrantyAMC")} required={true} />}
                      name="Warrenty"
                      id="Warrenty"
                      placeholder={t("text.SelectWarrantyAMC")}
                    />
                  )}
                />
                {formik.touched.Warrenty && formik.errors.Warrenty && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.Warrenty}</div>
                )}
              </Grid> */}







              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectfromDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="WarrentyFDate"
                  id="WarrentyFDate"
                  value={formik.values.WarrentyFDate}
                  placeholder={t("text.SelectfromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("fromDate", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.fromDate && formik.errors.fromDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.fromDate}
                  </div>
                ) : null} */}

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelecttoDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="WarrentyTDate"
                  id="WarrentyTDate"
                  value={formik.values.WarrentyTDate}
                  placeholder={t("text.SelecttoDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.toDate && formik.errors.toDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.toDate}
                  </div>
                ) : null} */}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterValue")}
                  value={formik.values.WarrentyValue}
                  onChangeText={(text: string) => formik.setFieldValue("WarrentyValue", text)}
                  required={false}
                  lang={lang}
                />

              </Grid>
              {/* remark */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterRemark")}
                  value={formik.values.WarrentyRemark}
                  onChangeText={(text: string) => formik.setFieldValue("WarrentyRemark", text)}
                  required={false}
                  lang={lang}
                />

              </Grid>
              {/* Vendor */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="VenderName"
                  options={employeeOptions}
                  fullWidth
                  size="small"
                  value={
                    employeeOptions.find((option: any) => option.value === formik.values.VenderName) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("VenderName", newValue?.value || ""); // store name
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectVendor")}
                        // required={requiredFields.includes("UndrProcession_27")}
                        />
                      }
                    />
                  )}
                />



              </Grid>

              <Grid item lg={8} sm={8} xs={12}></Grid>


              {/* attachment */}
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
                    label={<CustomLabel text={t("text.MaintenanceManualAttachment")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => handleFileChange(e, "FileContent")}
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
                    {formik.values.FileContent === "" ? (
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
                        src={`data:image/jpg;base64,${formik.values.FileContent}`}
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
                      onClick={() => modalOpenHandle1("FileContent")}
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
                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
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
                        src={Img}
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



              {/* Submit Button */}
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.update")}
                </Button>
              </Grid>

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm();
                  }}
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

export default EditMaintainanceWarrantyMaster;




