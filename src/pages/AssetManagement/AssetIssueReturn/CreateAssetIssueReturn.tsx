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

const CreateAssetIssueReturn = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const requiredFields = ["stateName", "countryId"];
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();

  const [reportedByType, setReportedByType] = useState<any>(""); // To store selected reportedby value
  const [studentList, setStudentList] = useState<any>([]); // Student dropdown options
  const [staffList, setStaffList] = useState<any>([]); // Staff dropdown options
  const [visitorList, setVisitorList] = useState<any>([]); // Visitor dropdown options


  const [assetDetailOption, setAssetDetailOption] = useState([]);

  const [option, setoption] = useState([]);

  useEffect(() => {
    fetchAssetDetails();
  }, []);


  const fetchAssetDetails = async () => {
    try {
      const response = await api.post("ResourceDetail", {
        "Type": 4
      });
      if (response.data.success && response.data.data.length > 0) {
        const arr: any = [];
        response.data.data.map((item: any) => {
          arr.push({
            value: item.ResourceCode,
            label: `${item.ResourceCode} - ${item.ResourceName}`,
            assetCode: item.ResourceCode,
            assetName: item.ResourceName,
            assetTypeName: item.ResourceType,
            assetTypeCode: item.ResourceTypeCode
          })
        })

        setAssetDetailOption(arr);
      } else {
        toast.warn("No asset types available.");
        setAssetDetailOption([]);
      }
    } catch (error) {
      console.error("Error fetching asset types:", error);
      toast.error("Failed to load asset types.");
    }
  };

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
          label: `${emp.Emp_Personal_code}- ${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname}`.replace(/\s+/g, ' ').trim(),
          name: `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname}`.replace(/\s+/g, ' ').trim(),
          code: emp.Emp_Personal_code,
          value: emp.Emp_id
        }));

        // Set list according to type
        setStaffList(employeeList);
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
          name: `${student.first_name} ${student.lname}`.replace(/\s+/g, ' ').trim(),
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
        name:`${item.F_name} ${item.M_name} ${item.L_name}`.replace(/\s+/g, ' ').trim()
      }));
      setVisitorList(visitors);
    }
  };


  const formik = useFormik({
    initialValues: {
      "resCode": "",
      "resname": "",
      "ResTypeCode": "",
      "ResType": "",
      "status": "issue",
      "membertype": "",
      "resid": 0,
      "empid": 0,
      "empname": "",
      "cat": "",
      "dept": "",
      "issuedate": defaultValues,
      "returndate": defaultValues,
      "transactionid": 0,
      "flag": "N",
      "remark": "",
      "Inst_Id": 1,
      "Type": 1
    },

    validationSchema: Yup.object({
      resCode: Yup.number().required(t("text.reqResourceCode")),

    }),

    onSubmit: async (values) => {

      const response = await api.post(`ResourceIssueReturn`, values);
      if (response.data.success) {
        toast.success(response.data.message || "Added Successful");
        navigate("/AssetManagement/AssetIssueReturn")
      } else {
        setToaster(true);
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
                {t("text.CreateAssetIssueReturn")}
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

              {/* RadioButton */}
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl>
                  <RadioGroup
                    aria-label="status"
                    name="status"
                    value={formik.values.status}
                    onChange={(event) => formik.setFieldValue("status", event.target.value)}
                  >
                    <div style={{ display: "flex" }}>
                      <FormControlLabel value="issue" control={<Radio />} label={t("text.issue")} />
                      <FormControlLabel value="return" control={<Radio />} label={t("text.return")} />
                      <FormControlLabel value="reissue" control={<Radio />} label={t("text.reissue")} />
                    </div>
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={assetDetailOption}
                  fullWidth
                  size="small"
                  value={formik.values.resCode}
                  onChange={(event, newValue: any) => {
                    if (!newValue) return;
                    console.log(newValue);

                    formik.setFieldValue("resCode", newValue?.assetCode);
                    formik.setFieldValue("resname", newValue?.assetName);
                    formik.setFieldValue("ResTypeCode", newValue?.assetTypeCode);
                    formik.setFieldValue("ResType", newValue?.assetTypeName);


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
                {formik.touched.resCode && formik.errors.resCode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.resCode}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={assetDetailOption}
                  fullWidth
                  size="small"
                  value={formik.values.resname}
                  onChange={(event, newValue: any) => {
                    console.log(newValue);


                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetName")}
                        />
                      }
                    />
                  )}
                />
                {/* {formik.touched.countryId && formik.errors.countryId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryId}
                  </div>
                ) : null} */}
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={assetDetailOption}
                  disabled={true}
                  fullWidth
                  size="small"
                  value={formik.values.ResTypeCode}
                  onChange={(event, newValue: any) => {
                    console.log(newValue);


                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetTypecode")}

                        />
                      }
                    />
                  )}
                />
                {/* {formik.touched.countryId && formik.errors.countryId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryId}
                  </div>
                ) : null} */}
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  disabled={true}
                  size="small"
                  value={formik.values.ResType}
                  onChange={(event, newValue: any) => {
                    console.log(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetType")}
                        />
                      }
                    />
                  )}
                />
                {/* {formik.touched.countryId && formik.errors.countryId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryId}
                  </div>
                ) : null} */}
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                {/* <Autocomplete
                  disablePortal
                  id="reportedby-dropdown"
                  options={[
                    { label: "Student", value: "Student" },
                    { label: "Staff", value: "Staff" },
                    { label: "Visitor", value: "Visitor" }
                  ]}
                  fullWidth
                  size="small"
                  value={{ label: formik.values.membertype, value: formik.values.membertype }}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("membertype", newValue?.value || "");
                    setReportedByType(newValue?.value || "");

                    if (newValue?.value === "Student" || newValue?.value === "Staff") {
                      fetchEmployeeDetail(newValue.value);
                    } else if (newValue?.value === "Visitor") {
                      // getVisitorList();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectPersonType")} required={false} />}
                    />
                  )}
                /> */}
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
                  value={{ label: formik.values.membertype, value: formik.values.membertype }}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("membertype", newValue?.value || "");
                    setReportedByType(newValue?.value || ""); // Update state

                    if (newValue?.value === "Student") {
                      getStudentList(); // ✅ Fetch students
                    } else if (newValue?.value === "Staff") {
                      fetchEmployeeDetail("Staff"); // Fetch staff list
                    } else if (newValue?.value === "Visitor") {
                      getVisitorList(); // Fetch visitors
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.SelectPersonType")} required={false} />} />
                  )}
                />

              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                {(reportedByType === "Staff") && (
                  <Autocomplete
                    disablePortal
                    id={`${reportedByType.toLowerCase()}-dropdown`}
                    options={reportedByType === "Staff" ? staffList : staffList}
                    fullWidth
                    size="small"
                    value={formik.values.empname}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("empname", newValue?.name || ""); // Store name
                      formik.setFieldValue("empId", newValue?.value || ""); 
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text={`Select ${reportedByType}`} required={false} />} />
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
                    value={formik.values.empname}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("empname", newValue?.name || ""); // Store student name
                      formik.setFieldValue("empId", newValue?.value || ""); 
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Student" required={false} />} />
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
                    value={formik.values.empname}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("empname", newValue?.name || ""); // Store visitor name
                      formik.setFieldValue("empId", newValue?.value || ""); 
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Visitor" required={false} />} />
                    )}
                  />
                )}

              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectissueDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="issuedate"
                  id="issuedate"
                  value={formik.values.issuedate}
                  placeholder={t("text.SelectissueDate")}
                  onChange={(e) => {
                    formik.setFieldValue("issuedate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.fromDate && formik.errors.fromDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.fromDate}
                  </div>
                ) : null} */}

              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectreturnDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="returndate"
                  id="returndate"
                  value={formik.values.returndate}
                  placeholder={t("text.SelectreturnDate")}
                  onChange={(e) => {
                    formik.setFieldValue("returndate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.todate && formik.errors.todate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.todate}
                  </div>
                ) : null} */}
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  value={
                    option.find(
                      (option: any) => option.value === formik.values.countryId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("countryId", newValue?.value);
                    formik.setFieldValue("countryName", newValue?.label);

                    // formik.setFieldTouched("zoneID", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectStudentName")}
                          required={requiredFields.includes("countryName")}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.countryId && formik.errors.countryId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.countryId}
                  </div>
                ) : null}
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                {/* {(reportedByType === "Student" || reportedByType === "Staff") && (
                  <Autocomplete
                    disablePortal
                    id={`${reportedByType.toLowerCase()}-dropdown`}
                    options={reportedByType === "Student" ? studentList : staffList}
                    fullWidth
                    size="small"
                    value={formik.values.empname}
                    // value={(reportedByType === "Student" ? studentList : staffList).find(
                    //   (option: any) => option.label === formik.values.empname // FIND by label (name)
                    // ) || null}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("empname", newValue?.name || ""); // Store internally
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text={`Select ${reportedByType} Name`} required={false} />} />
                    )}
                  />
                )} */}

                {/* {reportedByType === "Student" && (
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.StudentName")}
                        required={true}
                      />
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="fromDate"
                    id="fromDate"
                    //value={formik.values.fromDate}
                    placeholder={t("text.StudentName")}
                    onChange={(e) => {
                      formik.setFieldValue("fromDate", e.target.value);
                    }}
                  />
                )}

                {reportedByType === "Staff" && (
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.StaffName")}
                        required={true}
                      />
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="fromDate"
                    id="fromDate"
                    //value={formik.values.fromDate}
                    placeholder={t("text.StaffName")}
                    onChange={(e) => {
                      formik.setFieldValue("StaffName", e.target.value);
                    }}
                  />
                )}

                {reportedByType === "Visitor" && (
                  <TextField
                    label={
                      <CustomLabel
                        text={t("text.VisitorName")}
                        required={true}
                      />
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="fromDate"
                    id="fromDate"
                    //value={formik.values.fromDate}
                    placeholder={t("text.VisitorName")}
                    onChange={(e) => {
                      formik.setFieldValue("fromDate", e.target.value);
                    }}
                  />
                )} */}

              </Grid>





              <Grid item xs={12} sm={12} lg={12}>
                <TranslateTextField
                  label={t("text.EnterRemark")}
                  value={formik.values.remark}
                  onChangeText={(text: string) => formik.setFieldValue("remark", text)}
                  required={false}
                  lang={lang}
                />

              </Grid>


              <Grid item lg={12} sm={12} xs={12}></Grid>
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
                  {t("text.save")}
                </Button>
              </Grid>


              {/* Submit Button */}
              {/* <Grid item lg={3} sm={3} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.issue")}
                </Button>
              </Grid> */}
              {/* <Grid item lg={3} sm={3} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.reissue")}
                </Button>
              </Grid>
              <Grid item lg={3} sm={3} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.return")}
                </Button>
              </Grid> */}

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

export default CreateAssetIssueReturn;