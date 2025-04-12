import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import nopdf from "../../../assets/images/imagepreview.jpg";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";
import { format } from "path";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
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
export default function Status() {
  const [reportedByType, setReportedByType] = useState(""); // To store selected reportedby value
  const [studentList, setStudentList] = useState([]); // Student dropdown options
  const [staffList, setStaffList] = useState([]); // Staff dropdown options
  const [visitorList, setVisitorList] = useState([]); // Visitor dropdown options

  const { t } = useTranslation();
  const UserId = getId();
  const [isChecked, setIsChecked] = useState(false);
  const CanBeUsedOption = [

    { value: "Working", label: "Working" },
    { value: "Rejected", label: "Rejected" },
    { value: "WrittenOff", label: "Written Off" },
    { value: "Lost", label: "Lost" },
    { value: "UnderRepair", label: "Under Repair" },
    { value: "UnderBreakDown", label: "Under Break Down" },
    { value: "NotInUse", label: "Not In Use" },

  ];
  const reportoption = [
    { value: "student", label: "Student" },
    { value: "staff", label: "Staff" },
    { value: "visitors", label: "Visitors" }
  ]

  const { defaultValues } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(0);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [assetCodeOptions, setAssetCodeOptions] = useState<any>([]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const [lang, setLang] = useState<Language>("en");
  let navigate = useNavigate();

  const [isStateCode, setIsStateCode] = useState(false);

  // const getPageSetupData = async () => {
  //     await api.get(`Setting/GetPageSetupDataall`).then((res) => {
  //         const data = res.data.data;
  //         data.map((e: any, index: number) => {
  //             if (e.setupId === 4 && e.showHide) {
  //                 setIsStateCode(true);
  //             } else if (e.setupId === 4 && !e.showHide) {
  //                 setIsStateCode(false);
  //             } else {
  //                 setIsStateCode(true);
  //             }
  //         })
  //     });
  //     //return response;
  // }

  useEffect(() => {
    // getPageSetupData();
    fetchAssetCode();
    fetchStatusData();
  }, [isLoading]);

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

  const fetchAssetCode = async () => {
    try {
      const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
      if (response.data.success && response.data.data.length > 0) {
        const assetList = response.data.data.map((item: any) => ({
          label: `${item.ResourceCode} (${item.ResourceName || item.ResType || ""})`, // Use whichever exists
          value: item.ID, // Resource ID
          ResourceCode: item.ResourceCode,
          ResourceName: item.ResourceName || item.ResType || "", // Safeguard for naming mismatch
          Status_ID: item.Status_ID, // In case you need
        }));

        setAssetCodeOptions(assetList);
      } else {
        toast.warn("No resource details found.");
      }
    } catch (error) {
      console.error("Failed to fetch ResourceDetail", error);
      toast.error("Failed to load asset codes.");
    }
  };



  // const validationSchema = Yup.object({
  //   countryId: Yup.string().test(
  //     "required",
  //     t("text.reqcountryName"),
  //     function (value: any) {
  //       return value && value.trim() !== "";
  //     }
  //   ),
  //   stateName: Yup.string().test(
  //     "required",
  //     t("text.reqstateName"),
  //     function (value: any) {
  //       return value && value.trim() !== "";
  //     }
  //   ),
  // });

  const formik = useFormik({
    initialValues: {
      id_St: 0,
      StatusDate: defaultValues,
      Status: "",
      StatusRemark: "",
      inst: "0",
      ses: "0",
      resid: null,
      name: "",
      reportedby: "",
      user_id: 1,
      AssetCode: null,
      divisionid: 0,
      Type: 0
    },
    validationSchema: Yup.object({

      Status: Yup.string()
        .required(t("text.reqStatus")),
      reportedby: Yup.string()
        .required(t("text.reqreportedby")),

      resid: Yup.string()
        .required(t("text.reqasset")),
    }),
    onSubmit: async (values) => {
      const finalValues = {
        id_St: editId !== 0 ? editId : 0,
        StatusDate: values.StatusDate,
        Status: values.Status, // You can set this from status selection
        StatusRemark: values.StatusRemark,
        inst: "1", // Change as per need
        ses: "2024-25", // Change as per need
        resid: 2, // Example, dynamic if needed
        name: values.name,
        reportedby: values.reportedby,
        user_id: 1,
        AssetCode: values.AssetCode,
        divisionid: 1, // Or value if you want
        Type: editId !== 0 ? 2 : 1 // ✅ Type 1 for Add, 2 for Update
      };

      console.log("Final Payload to Send:", finalValues);

      api.post("manageStatus", finalValues) // 🔑 Change API endpoint if different
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message); // Direct message access
            formik.resetForm(); // Reset form
            fetchStatusData(); // Refresh list
            setEditId(0); // Reset edit mode
          } else {
            toast.error("Failed to save status");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error: " + error.message);
        });
    },
  });


  // const requiredFields = ["stateName", "countryId"];

  const routeChangeEdit = (row: any) => {
    const requestData = {
      id_St: row.id, // ID to fetch
      Type: 3 // Get by ID
    };

    api.post("manageStatus", requestData)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const status = res.data.data[0];

          formik.setValues({
            id_St: status.Status_ID,
            StatusDate: formatDate(status.StatusDate),
            Status: status.Status,
            StatusRemark: status.StatusRemark,
            inst: status.inst_id,
            ses: "2024-25",
            resid: status.resid,
            name: status.name,
            reportedby: status.reportedby,
            user_id: status.user_id,
            AssetCode: status.AssetCode,
            divisionid: status.divisionid,
            Type: 2 // For Update
          });

          setEditId(status.Status_ID); // Set edit mode
        } else {
          toast.error("Status not found");
        }
      })
      .catch(() => toast.error("Error fetching status details"));
  };


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  function formatDate(dateString: string) {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const fetchStatusData = async () => {
    try {
      const collectData = {
        Status_ID: -1, // To get all data
        Type: 4 // Type 4 for fetching all
      };

      const response = await api.post("manageStatus", collectData);
      const data = response.data.data;

      // Prepare rows with serial number
      const statusRows = data.map((item: any, index: number) => ({
        ...item,
        serialNo: index + 1,
        id: item.Status_ID, // Important for row identification
        StatusDate: formatDate(item.StatusDate)
        ,
      }));

      setZones(statusRows); // Set data rows
      setIsLoading(false);

      // ✅ Define columns dynamically or statically
      const columns: GridColDef[] = [
        {
          field: "actions",
          headerName: t("text.Action"),
          flex: 0.5,
          renderCell: (params) => (
            <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
              <EditIcon
                style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                onClick={() => routeChangeEdit(params.row)} // Edit handler
              />

            </Stack>
          ),
        },
        // { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
        { field: "StatusDate", headerName: t("text.Date"), flex: 1 },
        { field: "AssetCode", headerName: t("text.AssetCode"), flex: 1 },
        { field: "StatusRemark", headerName: t("text.Remark"), flex: 1 },
        { field: "name", headerName: t("text.Name"), flex: 1 },
        { field: "reportedby", headerName: t("text.ReportedBy"), flex: 1 },
        { field: "Status", headerName: t("text.Status"), flex: 1 }, // You can also add Status as column
      ];

      setColumns(columns); // Set columns dynamically
    } catch (error) {
      console.error("Error fetching status data:", error);
      toast.error("Error fetching status data");
    }
  };


  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.Status")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2"></Stack>

          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="asset-code-dropdown"
                  options={assetCodeOptions}
                  fullWidth
                  size="small"
                  // value={
                  //   assetCodeOptions.find((option: any) => option.ResourceCode == formik.values.AssetCode) || null
                  // }
                  value={formik.values.AssetCode}
                  onChange={(event, newValue: any) => {
                    console.log("Selected Value: ", newValue);
                    formik.setFieldValue("AssetCode", newValue?.ResourceCode || "");
                    formik.setFieldValue("resid", newValue?.value || 0); // Resource ID
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectAssetcode")}
                        required={true}
                      />}
                    />
                  )}
                />
                {formik.touched.resid && formik.errors.resid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.resid}
                  </div>
                ) : null}

              </Grid>







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
                  name="StatusDate"
                  id="StatusDate"
                  value={formik.values.StatusDate}
                  placeholder={t("text.SelectDate")}
                  onChange={(e) => {
                    formik.setFieldValue("StatusDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.StatusDate && formik.errors.StatusDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.StatusDate}
                  </div>
                ) : null}

              </Grid>


              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={CanBeUsedOption}
                  value={formik.values.Status}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("Status", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectStatus")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.Status && formik.errors.Status ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.Status}
                  </div>
                ) : null}
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterRemark")}
                  value={formik.values.StatusRemark}
                  onChangeText={(text: string) =>
                    handleConversionChange("StatusRemark", text)
                  }
                  required={false}
                  lang={lang}
                />

                {formik.touched.StatusRemark && formik.errors.StatusRemark ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.StatusRemark}
                  </div>
                ) : null}
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                               

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
                                    value={{ label: formik.values.reportedby, value: formik.values.reportedby }}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("reportedby", newValue?.value || "");
                                        setReportedByType(newValue?.value || ""); // To handle conditional dropdown

                                        // Fetch Employee Detail for Student/Staff
                                        if (newValue?.value === "Student" || newValue?.value === "Staff") {
                                            fetchEmployeeDetail(newValue.value);
                                        } else if (newValue?.value === "Visitor") {
                                            getVisitorList();
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.ReportedBy")} required={false} />}
                                        />
                                    )}
                                />


                            </Grid> */}



              {/* <Grid item xs={12} sm={4} lg={4}>
                                {(reportedByType === "Student" || reportedByType === "Staff") && (
                                    <Autocomplete
                                        disablePortal
                                        id={`${reportedByType.toLowerCase()}-dropdown`}
                                        options={reportedByType === "Student" ? studentList : staffList}
                                        fullWidth
                                        size="small"
                                        value={(reportedByType === "Student" ? studentList : staffList).find(
                                            (option: any) => option.label === formik.values.name // FIND by label (name)
                                        ) || null}
                                        onChange={(event, newValue: any) => {
                                            formik.setFieldValue("name", newValue?.label || ""); // Store internally
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={`Select ${reportedByType}`} required={false} />} />
                                        )}
                                    />
                                )}
                            </Grid> */}

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
                  value={{ label: formik.values.reportedby, value: formik.values.reportedby }}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("reportedby", newValue?.value || "");
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
                    <TextField {...params} label={<CustomLabel text={t("text.ReportedBy")} required={true} />} />
                  )}
                />
                {formik.touched.reportedby && formik.errors.reportedby ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.reportedby}
                  </div>
                ) : null}




              </Grid>





              <Grid item xs={12} sm={4} lg={4}>
                {(reportedByType === "Staff" || formik.values.reportedby === "Staff") && (
                  <Autocomplete
                    disablePortal
                    id={`${reportedByType.toLowerCase()}-dropdown`}
                    options={reportedByType === "Staff" ? staffList : staffList}
                    fullWidth
                    size="small"
                    // value={(reportedByType === "Staff" ? staffList : staffList).find(
                    //   (option: any) => option.label == formik.values.name
                    // ) || null}
                    value={formik.values.name}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("name", newValue?.label || ""); // Store name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text={`Select Staff`} required={false} />} />
                    )}
                  />
                )}
                {(reportedByType === "Student" || formik.values.reportedby === "Student") && (
                  <Autocomplete
                    disablePortal
                    id="student-dropdown"
                    options={studentList}
                    fullWidth
                    size="small"
                    // value={studentList.find((option: any) => option.label == formik.values.name) || null}
                    value={formik.values.name}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("name", newValue?.label || ""); // Store student name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Student" required={false} />} />
                    )}
                  />
                )}


                {/* ✅ Add visitor section here */}
                {(reportedByType === "Visitor" || formik.values.reportedby === "Visitor") && (
                  <Autocomplete
                    disablePortal
                    id="visitor-dropdown"
                    options={visitorList}
                    fullWidth
                    size="small"
                    // value={visitorList.find((option: any) => option.label == formik.values.name) || null}
                    value={formik.values.name}
                    onChange={(event, newValue: any) => {
                      formik.setFieldValue("name", newValue?.label || ""); // Store visitor name
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<CustomLabel text="Select Visitor" required={false} />} />
                    )}
                  />
                )}





              </Grid>


              <Grid item xs={2} sx={{ m: -1 }}>


                {editId === 0 && (
                  // {editId === -1 && permissionData?.isAdd && (
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}

                {editId !== 0 && (
                  <ButtonWithLoader
                    buttonText={t("text.update")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}
              </Grid>
            </Grid>
          </form>

          <DataGrids
            isLoading={isLoading}
            rows={zones}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}

function moment(StatusDate: any) {
  throw new Error("Function not implemented.");
}

