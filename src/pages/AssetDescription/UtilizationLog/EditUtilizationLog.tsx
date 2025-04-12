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

const EditUtilizationLog = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const requiredFields = ["stateName", "countryId"];
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();

  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo"), name: "" },
  ]);
  const [empOption, setEmpOption] = useState([
    { value: -1, label: t("text.EmpName") },
  ]);
  const [reportedByType, setReportedByType] = useState(""); // To store selected reportedby value
  const [studentList, setStudentList] = useState([]); // Student dropdown options
  const [staffList, setStaffList] = useState([]); // Staff dropdown options
  const [visitorList, setVisitorList] = useState([]); // Visitor dropdown options

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const location = useLocation();
  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "imageFile") {
      setModalImg("formik.values.imageFile");
    }
  };
  const [assetCodeOptions, setAssetCodeOptions] = useState([]);

  // useEffect(() => {
  //   // getVehicleDetails();
  //   // getEmpData();
  //   fetchAssets();
  // }, []);
  useEffect(() => {
    if (location.state?.UserType) {
      setReportedByType(location.state.UserType); // Set reportedByType
    }

    // Fetch dropdown data if needed
    if (location.state?.UserType === "Student") {
      getStudentList();
    } else if (location.state?.UserType === "Staff") {
      fetchEmployeeDetail("Staff");
    } else if (location.state?.UserType === "Visitor") {
      getVisitorList();
    }
    fetchAssets();
  }, [location.state]);


  const fetchEmployeeDetail = async (type: any) => {
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
        // Prepare dropdown list with employee names
        const employeeList = response.data.data.map((emp: any) => ({
          label: `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname} (${emp.Emp_Personal_code})`.replace(/\s+/g, ' ').trim(),
          value: emp.Emp_id
        }));

        // Set list according to type
        // if (type === "Student") {
        //     setStudentList(employeeList);
        // } else
        if (type === "Staff") {
          setStaffList(employeeList);
        }
      } else {
        toast.warn("No employee data found.");
      }
    } catch (error) {
      console.error("Error fetching employee detail:", error);
      toast.error("Failed to fetch employee details.");
    }
  };

  const getStudentList = async () => {
    try {
      const response = await api.post("Student_Details"); // API call without parameters

      if (response.data.success) {
        // Map response to dropdown format
        const students: any = Object.values(response.data.data).map((student: any) => ({
          label: `${student.first_name} ${student.lname} (${student.Enrollment})`, // Display full name + Enrollment
          value: student.Scholar_id, // Store Scholar ID
        }));

        setStudentList(students); // Set student dropdown options
      } else {
        toast.warn("No student data found.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to fetch student details.");
    }
  };



  const getVisitorList = async () => {
    const response = await api.post("Visitor_information", { img1: "any", Type: 4 });
    if (response.data.success) {
      const visitors = response.data.data.map((item: any) => ({
        label: `${item.F_name} ${item.M_name} ${item.L_name}`.replace(/\s+/g, ' ').trim(),
        value: item.Visitor_id,
      }));
      setVisitorList(visitors);
    }
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






  const formatTime = (date: any) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };





  const formik = useFormik({
    initialValues: {
      UL_ID: location.state?.UL_ID || "",            // from location.state or empty string
      UserType: location.state?.UserType || "",      // from location.state or empty string
      UserName: location.state?.UserName || "",      // from location.state or empty string
      FromDate: location.state?.FromDate || defaultValues, // from location.state or default date
      ToDate: location.state?.ToDate || defaultValues,     // from location.state or default date
      FTime: location.state?.FTime || "",            // from location.state or empty string
      TTime: location.state?.TTime || "",            // from location.state or empty string
      Remark: location.state?.Remark || "",          // from location.state or empty string
      inst: location.state?.inst || "",              // from location.state or empty string
      ses: location.state?.ses || "",                // from location.state or empty string
      resid: location.state?.resid || 0,             // from location.state or default 0
      user_id: location.state?.user_id || 0,         // from location.state or default 1
      Type: 2                                     // Always fixed as 1
    },

    validationSchema: Yup.object({
      resid: Yup.number().required(t("text.SelectAsset")),
      UserType: Yup.string().required(t("text.UserType")),
    }),
    onSubmit: async (values) => {
      const response = await api.post("manageUtilizationlog", values); // Update with actual API
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/AssetDescription/UtilizationLog"); // Redirect to list page
      } else {
        toast.error(response.data.message);
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
                {t("text.EditUtilizationLog")}
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

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="reportedby-dropdown"
                  options={[
                    { label: "Student", value: "Student" },
                    { label: "Staff", value: "Staff" },
                    { label: "Visitor", value: "Visitor" }
                  ]}
                  fullWidth
                  size="small"
                  value={{ label: formik.values.UserType, value: formik.values.UserType }}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("UserType", newValue?.value || "");
                    setReportedByType(newValue?.value || ""); // Set state to handle conditional rendering

                    // Fetch relevant data based on ReportedBy
                    if (newValue?.value === "Student") {
                      getStudentList(); // ✅ Fetch students
                    } else if (newValue?.value === "Staff") {
                      fetchEmployeeDetail("Staff"); // Fetch staff list
                    } else if (newValue?.value === "Visitor") {
                      getVisitorList(); // Fetch visitors
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.ReportedBy")} required={false} />}
                    />
                  )}
                />



              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                {(reportedByType === "Staff") && (
                  <Autocomplete
                    disablePortal
                    id={`${reportedByType.toLowerCase()}-dropdown`}
                    options={reportedByType === "Staff" ? studentList : staffList}
                    fullWidth
                    size="small"
                    value={(reportedByType === "Staff" ? studentList : staffList).find(
                      (option: any) => option.label === formik.values.UserName
                    ) || null}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("UserName", newValue?.label || ""); // Store name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text={`Select ${reportedByType}`} required={false} />} />
                    )}
                  />
                )}

                {/* ✅ Add visitor section here */}
                {reportedByType === "Visitor" && (
                  <Autocomplete
                    disablePortal
                    id="visitor-dropdown"
                    options={visitorList}
                    fullWidth
                    size="small"
                    value={visitorList.find((option: any) => option.label === formik.values.UserName) || null}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("UserName", newValue?.label || ""); // Store visitor name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Visitor" required={false} />} />
                    )}
                  />
                )}

                {reportedByType === "Student" && (
                  <Autocomplete
                    disablePortal
                    id="student-dropdown"
                    options={studentList}
                    fullWidth
                    size="small"
                    value={studentList.find((option: any) => option.label === formik.values.UserName) || null}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("UserName", newValue?.label || ""); // Store visitor name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Student" required={false} />} />
                    )}
                  />
                )}




              </Grid>








              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectfromDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="FromDate"
                  id="FromDate"
                  value={formik.values.FromDate}
                  placeholder={t("text.SelectfromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("FromDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />


              </Grid>
              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelecttoDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="ToDate"
                  id="ToDate"
                  value={formik.values.ToDate}
                  placeholder={t("text.SelecttoDate")}
                  onChange={(e) => {
                    formik.setFieldValue("ToDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>
              {/* from time */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectFromtime")}
                      required={false}
                    />
                  }
                  type="time"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="FTime"
                  id="FTime"
                  value={formik.values.FTime}
                  placeholder={t("text.SelectFromtime")}
                  onChange={(e) => {
                    formik.setFieldValue("FTime", e.target.value + ":00");
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>


              {/* to time */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectTotime")}
                      required={false}
                    />
                  }
                  type="time"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="TTime"
                  id="TTime"
                  value={formik.values.TTime}
                  placeholder={t("text.SelectTotime")}
                  onChange={(e) => {
                    formik.setFieldValue("TTime", e.target.value + ":00");
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.routeDate && formik.errors.routeDate ? (
                   <div style={{ color: "red", margin: "5px" }}>
                     {formik.errors.routeDate}
                   </div>
                 ) : null} */}

              </Grid>


              {/* remark */}
              <Grid item xs={12} sm={4} lg={4}>


                <TextField
                  label={t("text.EnterRemark")}
                  value={formik.values.Remark}
                  onChange={(event) => formik.setFieldValue("Remark", event.target.value)}
                  fullWidth
                  variant="outlined"

                  size="small"

                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


              <Grid item lg={8} sm={8} xs={12}></Grid>





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

export default EditUtilizationLog;