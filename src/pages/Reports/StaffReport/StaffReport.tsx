// import React, { useEffect, useState } from "react";
// import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
// import axios from "axios";
// import HOST_URL from "../../../utils/Url";
// import Card from "@mui/material/Card";
// import {
//    Grid,
//    Box,
//    Button,
//    Divider,
//    Stack,
//    TextField,
//    Typography,
//    FormControlLabel,
//    Checkbox,
//    FormControl,
//    RadioGroup,
//    Radio,
//    Autocomplete,
//    ListItemText,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import Switch from "@mui/material/Switch";
// import { useNavigate, useLocation } from "react-router-dom";
// import Chip from "@mui/material/Chip";
// import { useTranslation } from "react-i18next";
// import Paper from "@mui/material/Paper";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import CircularProgress from "@mui/material/CircularProgress";
// import api from "../../../utils/Url";
// import { useFormik } from "formik";
// import CustomLabel from "../../../CustomLable";
// import DownloadIcon from "@mui/icons-material/Download";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import moment from "moment";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";
// import "../../../index.css";
// import { getISTDate } from "../../../utils/Constant";
// import Logo from "../../../assets/images/KanpurLogo.png";

// interface MenuPermission {
//    isAdd: boolean;
//    isEdit: boolean;
//    isPrint: boolean;
//    isDel: boolean;
// }

// export default function StaffReport() {
//    const { defaultValues } = getISTDate();
//    const location = useLocation();
//    const [zones, setZones] = useState([]);
//    const [columns, setColumns] = useState<any>([]);
//    const [isLoading, setIsLoading] = useState(true);
//    const [visible, setVisible] = useState(false);
//    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//    const [selectAll, setSelectAll] = useState<boolean>(false);

//    const [isChecked, setIsChecked] = useState(false);

//    const [option, setOption] = useState([
//       { value: "-1", label: "Vehicle Type" },
//    ]);

//    const [isPrint, setPrint] = useState([]);

//    const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

//    const [VnoOption, setVnoOption] = useState([
//       { value: -1, label: "Select Vehicle No " },
//    ]);

//    const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
//    const [vNO, setVno] = useState("");

//    const [vType, setVType] = useState([]);

//    const [selDay, setDay] = useState(false);

//    const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       setSelectedFormat((event.target as HTMLInputElement).value);
//    };

//    const formik = useFormik({
//       initialValues: {
//          genderID: -1,
//          "vehicleNo": location.state?.vehicleNo || vNO,
//          "complainNo": "",
//          "complaintDatefrom": defaultValues,
//          "complaintDateTo": defaultValues,
//          "status": location.state?.status || "",
//          "show": true
//       },
//       onSubmit: async (values) => {
//          // API call or other logic
//       },
//    });

//    const handleDownload = async () => {
//       const collectData = {
//          "vehicleNo": formik.values.vehicleNo || vNO,
//          "complainNo": formik.values.complainNo,
//          "complaintDatefrom": formik.values.complaintDatefrom,
//          "complaintDateTo": formik.values.complaintDateTo,
//          status: formik.values.status,
//          show: false,
//          exportOption: selectedFormat, // .pdf, .xls, or TabularExc
//       };

//       try {
//          const response = await api.post(`Report/GetvComplainStatusSummaryApi`, collectData);

//          if (response.data.status === "Success" && response.data.base64) {
//             const base64String = response.data.base64;
//             const byteCharacters = atob(base64String);
//             const byteNumbers = new Array(byteCharacters.length)
//                .fill(0)
//                .map((_, i) => byteCharacters.charCodeAt(i));
//             const byteArray = new Uint8Array(byteNumbers);

//             let fileType = "";
//             let fileName = response.data.fileName || "Report";

//             if (selectedFormat === ".pdf") {
//                fileType = "application/pdf";
//                fileName += ".pdf";
//             } else if (selectedFormat === ".xls") {
//                fileType = "application/vnd.ms-excel";
//                fileName += ".xls";
//             } else if (selectedFormat === "TabularExc") {
//                fileType = "application/vnd.ms-excel";
//                fileName += ".xls";
//             }

//             const blob = new Blob([byteArray], { type: fileType });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = fileName;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//          } else {
//             console.error("Error: No valid data received.");
//          }
//       } catch (error) {
//          console.error("Error downloading file:", error);
//       }
//    };
//    let navigate = useNavigate();
//    const { t } = useTranslation();

//    useEffect(() => {
//       getVehicleNo();
//       fetchZonesData();

//       if (location.state) {
//          formik.setFieldValue("complaintDatefrom", moment("2020-02-01T13:13:51.91").format("YYYY-MM-DD"));
//          formik.setFieldValue("complaintDateTo", defaultValues);
//          // fetchZonesData();
//          // setVisible(true);
//       }
//    }, []);



//    const getVehicleNo = () => {

//       api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
//          const arr = res?.data?.data.map((item: any) => ({
//             label: item.vehicleNo,
//             value: item.itemMasterId,
//          }));
//          setVnoOption(arr);
//       });
//    };


//    let currentDate = new Date();

//    currentDate.setDate(currentDate.getDate() - 1);

//    let previousDate = currentDate.toISOString();

//    const fetchZonesData = async () => {
//       try {
//          const collectData = {
//             "vehicleNo": formik.values.vehicleNo || vNO,
//             "complainNo": formik.values.complainNo,
//             "complaintDatefrom": formik.values.complaintDatefrom,
//             "complaintDateTo": formik.values.complaintDateTo,
//             status: formik.values.status,
//             "show": true,
//             exportOption: "selectedFormat",
//          };
//          const response = await api.post(
//             `Report/GetvComplainStatusSummaryApi`,
//             collectData
//          );
//          const data = response?.data;

//          const Print = data.map((item: any, index: any) => ({
//             ...item,
//          }));
//          setPrint(Print);
//          const zonesWithIds = data.map((zone: any, index: any) => ({
//             ...zone,
//             serialNo: index + 1,
//             id: index + 1,
//          }));
//          setZones(zonesWithIds);
//          setIsLoading(false);

//          if (data.length > 0) {
//             const columns: GridColDef[] = [
//                {
//                   field: "serialNo",
//                   headerName: t("text.SrNo"),
//                   flex: 1,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here
//                },

//                {
//                   field: "complainNo",
//                   headerName: t("text.complainNo"),
//                   flex: 1.2,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here
//                },
//                {
//                   field: "complaint",
//                   headerName: t("text.complaint"),
//                   flex: 1.2,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here
//                },
//                {
//                   field: "vehicleNo",
//                   headerName: t("text.vehicleNo12"),
//                   flex: 1.2,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here
//                },
//                {
//                   field: "jobCardNo",
//                   headerName: t("text.JobCardNo"),
//                   flex: 1.2,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here
//                },
//                {
//                   field: "complainStatus",
//                   headerName: t("text.complainStatus12"),
//                   flex: 1,
//                   headerClassName: "MuiDataGrid-colCell",
//                   cellClassName: "wrap-text", // Added here

//                },

//                {
//                   field: "complaintDate",
//                   headerName: t("text.complaintDate"),
//                   flex: 1.3,
//                   cellClassName: "wrap-text", // Added here
//                   headerClassName: "MuiDataGrid-colCell",
//                   renderCell: (params) => {
//                      return moment(params.row.complaintDate).format("DD-MM-YYYY");
//                   },
//                },

//                {
//                   field: "updatedOn",
//                   headerName: t("text.closingdate"),
//                   flex: 1.3,
//                   cellClassName: "wrap-text", // Added here
//                   headerClassName: "MuiDataGrid-colCell",
//                   renderCell: (params) => {
//                      return moment(params.row.updatedOn).format("DD-MM-YYYY");
//                   },
//                },
//                {
//                   field: "totaldays",
//                   headerName: t("text.totaldays"),
//                   flex: 1.3,
//                   cellClassName: "wrap-text", // Added here
//                   headerClassName: "MuiDataGrid-colCell",
//                },

//             ];
//             setColumns(columns as any);
//          }
//       } catch (error) {
//          console.error("Error fetching data:", error);
//          // setLoading(false);
//       }
//    };
//    const adjustedColumns = columns.map((column: any) => ({
//       ...column,
//    }));

//    const styles = `
//   .wrap-text {
//     white-space: normal !important;
//     word-wrap: break-word !important;
//     overflow-wrap: break-word !important;
//   }
// `;

//    document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);


//    const categories = [
//       "Employee Information",
//       "Employee CurrentStatus",
//       "Employee qualification",
//       "Employee Skill",
//       "Employee Insurance",
//       "Employee Account",
//       "Employee Family",
//       "Employee Health",
//    ];


//    const handleCategoryChange = (category: string) => {
//       setSelectedCategories((prev) =>
//          prev.includes(category)
//             ? prev.filter((item) => item !== category)
//             : [...prev, category]
//       );
//    };

//    const handleSelectAll = () => {
//       if (selectAll) {
//          setSelectedCategories([]);
//       } else {
//          setSelectedCategories([...categories]);
//       }
//       setSelectAll(!selectAll);
//    };


//    return (
//       <>
//          <Card
//             style={{
//                width: "100%",
//                // height: "100%",
//                backgroundColor: "#E9FDEE",
//                // border: ".5px solid #FF7722 ",
//                marginTop: "3vh",
//             }}
//          >
//             <Paper
//                sx={{
//                   width: "100%",
//                   overflow: "hidden",
//                   "& .MuiDataGrid-colCell": {
//                      backgroundColor: `var(--grid-headerBackground)`,
//                      color: `var(--grid-headerColor)`,
//                      fontSize: 12,
//                      fontWeight: 700,
//                   },
//                }}
//                style={{ padding: "10px" }}
//             >
//                <ConfirmDialog />

//                <Typography
//                   gutterBottom
//                   variant="h5"
//                   component="div"
//                   sx={{ padding: "15px" }}
//                   align="left"
//                >
//                   {t("text.StaffReport")}
//                </Typography>
//                <Divider />

//                <Box height={10} />

//                <Grid item xs={12} container spacing={2}>

//                   {/* <Grid xs={12} md={5} lg={5} item>
//                      <Autocomplete
//                         disablePortal
//                         id="combo-box-demo"
//                         options={[1, 2, 3]}

//                         fullWidth
//                         size="small"
//                         onChange={(event: any, newValue: any) => {
//                            console.log(newValue?.value);


//                         }}
//                         renderInput={(params) => (
//                            <TextField
//                               {...params}
//                               label={<CustomLabel text={t("text.PermissionLevel")} required={false} />}
//                               name=""
//                               id=""
//                               placeholder={t("text.PermissionLevel")}
//                            />
//                         )}
//                      />
//                   </Grid> */}


//                   <Grid xs={12} md={5} lg={5} item>
//                      <Autocomplete
//                         disablePortal
//                         id="combo-box-demo"
//                         options={[1, 2, 3]}

//                         fullWidth
//                         size="small"
//                         onChange={(event: any, newValue: any) => {
//                            console.log(newValue?.value);


//                         }}
//                         renderInput={(params) => (
//                            <TextField
//                               {...params}
//                               label={<CustomLabel text={t("text.EmployeeCode")} required={false} />}
//                               name=""
//                               id=""
//                               placeholder={t("text.EmployeeCode")}
//                            />
//                         )}
//                      />

//                   </Grid>

//                   <Grid item xs={12}>
//                      <FormControlLabel
//                         control={<Checkbox checked={selectAll} onChange={handleSelectAll} />}
//                         label={t("text.selectAll")}
//                      />
//                      {categories.map((category) => (
//                         <FormControlLabel
//                            key={category}
//                            control={
//                               <Checkbox
//                                  checked={selectedCategories.includes(category)}
//                                  onChange={() => handleCategoryChange(category)}
//                               />
//                            }
//                            label={t(`text.${category.replace(/ /g, "")}`)}
//                         />
//                      ))}
//                   </Grid>



//                   <Grid xs={12} sm={4} md={4} item>
//                      <Button
//                         type="submit"
//                         fullWidth
//                         style={{
//                            backgroundColor: `var(--header-background)`,
//                            color: "white",
//                            marginTop: "10px",
//                         }}
//                         onClick={() => {

//                            fetchZonesData();
//                            setVisible(true);

//                         }}
//                         startIcon={<VisibilityIcon />}
//                      >
//                         {t("text.show")}

//                      </Button>
//                   </Grid>

//                   <Grid xs={12} sm={4} md={4} item>
//                      <Button
//                         type="button"
//                         fullWidth
//                         style={{
//                            backgroundColor: `#f44336`,
//                            color: "white",
//                            marginTop: "10px",
//                         }}
//                         startIcon={<RefreshIcon />}
//                         onClick={() => {
//                            formik.resetForm();
//                            setVisible(false);
//                            setSelectedFormat(".pdf");
//                            setVno("");
//                         }}
//                      >
//                         {t("text.reset")}

//                      </Button>
//                   </Grid>

//                   <Grid item xs={12} sm={4} md={4}>
//                      <Button
//                         type="button"
//                         fullWidth
//                         style={{
//                            backgroundColor: "#4caf50",
//                            color: "white",
//                            marginTop: "10px",
//                         }}
//                         startIcon={<DownloadIcon />}
//                         onClick={handleDownload}
//                      >
//                         {t("text.download")}

//                      </Button>
//                   </Grid>
//                </Grid>

//                <Grid
//                   item
//                   xs={12}
//                   container
//                   spacing={2}
//                   sx={{ marginTop: "3%", justifyContent: "center" }}
//                >
//                   {visible && (
//                      <Grid item xs={12} sm={12} lg={12}>
//                         {isLoading ? (
//                            <div className="loader-container">
//                               <div className="steering-wheel"></div> {/* Spinner */}
//                            </div>
//                         ) : (
//                            <DataGrid
//                               rows={zones}
//                               columns={adjustedColumns}
//                               rowSpacingType="border"
//                               autoHeight
//                               // slots={{
//                               //   toolbar: GridToolbar,
//                               // }}
//                               pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
//                                  value: size,
//                                  label: `${size}`,
//                               }))}
//                               initialState={{
//                                  pagination: { paginationModel: { pageSize: 5 } },
//                               }}
//                               slotProps={{
//                                  toolbar: {
//                                     showQuickFilter: true,
//                                  },
//                               }}
//                               sx={{
//                                  border: 0,
//                                  "& .MuiDataGrid-columnHeaders": {
//                                     backgroundColor: "#42b6f5", // Header background color
//                                     color: "white", // Header text color
//                                  },
//                                  "& .MuiDataGrid-columnHeaderTitle": {
//                                     color: "white", // Header title text color
//                                  },
//                                  "& .MuiDataGrid-cell": {
//                                     whiteSpace: "normal", // Ensure text wraps inside the cell
//                                     wordWrap: "break-word", // Break words to avoid overflow
//                                     overflowWrap: "break-word", // Ensure long words wrap correctly
//                                  },
//                               }}
//                            />
//                         )}
//                      </Grid>
//                   )}
//                </Grid>
//             </Paper>
//          </Card>
//          <ToastApp />
//       </>
//    );
// }


import {
   Button,
   CardContent,
   Grid,
   TextField,
   Typography,
   Divider,
   Autocomplete,
   Modal,
   Box,
   RadioGroup,
   FormControlLabel,
   Radio,
   IconButton,
   InputAdornment,
   FormControl,
   FormLabel,
   Checkbox,
   ListItemText,
   Popover,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../utils/Url";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { ColorLens as ColorLensIcon } from "@mui/icons-material";
// import { SketchPicker } from "react-color";
import CustomLabel from "../../../CustomLable";
import nopdf from "../../../assets/images/imagepreview.jpg";
import { getISTDate, getId, getdivisionId, getinstId } from "../../../utils/Constant";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import dayjs from "dayjs";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";


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


const StaffReport = () => {
   const { t } = useTranslation();
   const userid = getId();
   const [lang, setLang] = useState<Language>("en");
   const [toaster, setToaster] = useState(false);
   let navigate = useNavigate();
   const { defaultValuestime } = getISTDate();
   const [editId, setEditId] = useState(-1);
   const [panOpens, setPanOpen] = React.useState(false);
   const [modalImg, setModalImg] = useState("");
   const [Opens, setOpen] = React.useState(false);
   const [Img, setImg] = useState("");

   const [empCodeSearch, setempCodeSearch] = useState("");
   const [empData, setEmpData] = useState<any>([]);
   const [countryOption, setCountryOption] = useState<any>([
      { value: -1, label: t("text.SelectCountry") },
   ]);
   const [cityOption, setCityOption] = useState<any>([
      { value: -1, label: t("text.SelectCity") },
   ]);
   const [stateOption, setStateOption] = useState<any>([
      { value: -1, label: t("text.SelectState") },
   ]);
   const [casteCategoryOption, setCasteCategoryOption] = useState<any>([
      { value: -1, label: t("text.SelectCategory") },
   ]);
   const [empTypeOption, setEmpTypeOption] = useState<any>([
      { value: -1, label: t("text.SelectEmpType") },
   ]);

   useEffect(() => {
      getEmpData();
      getCountry();
      getState();
      getCity();
      getEmpType();
      getCategory();
   }, []);

   function bufferToBase64(bufferObj: any) {
      // If parameter is null or undefined, return "any"
      if (!bufferObj) {
         return "";
      }

      // Check if bufferObj contains valid data
      if (!bufferObj.data || !Array.isArray(bufferObj.data) || bufferObj.data.length === 0) {
         console.warn("Invalid or empty buffer object provided.");
         return "any"; // Return "any" instead of an empty string
      }

      try {
         // Convert array to Uint8Array
         const uint8Array: any = new Uint8Array(bufferObj.data);

         // Convert Uint8Array to Base64
         const base64String = btoa(String.fromCharCode(...uint8Array));

         return base64String;
      } catch (error) {
         console.error("Error converting buffer to Base64:", error);
         return "any"; // Return "any" in case of failure
      }
   }

   const getEmpData = async () => {
      try {
         const collectData = {
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
         }
         const response = await api.post(`EmployeeDetail`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  ...item,
                  value: item.Emp_id,
                  label: `${item.Emp_Personal_code} - ${item.Emp_firstname} ${item?.Emp_middlename || ""} ${item?.Emp_lastname || ""}`
               });
            });
            setEmpData(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }

   const getCountry = async () => {
      try {
         const collectData = {
            "Type": 4
         }
         const response = await api.post(`CountryMaster`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  value: item.country_id,
                  label: item.CountryName
               });
            });
            setCountryOption(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }

   const getState = async () => {
      try {
         const collectData = {
            "Type": 4
         }
         const response = await api.post(`StateMaster`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  value: item.state_id,
                  label: item.state_name
               });
            });
            setStateOption(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }

   const getCity = async () => {
      try {
         const collectData = {
            "Type": 4
         }
         const response = await api.post(`City`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  value: item.city_id,
                  label: item.city_name
               });
            });
            setCityOption(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }

   const getCategory = async () => {
      try {
         const collectData = {
            "Type": 4
         }
         const response = await api.post(`EmpCasteCategory`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  value: item.cat_id,
                  label: item.cat_name
               });
            });
            setCasteCategoryOption(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }

   const getEmpType = async () => {
      try {
         const collectData = {
            "Type": 4
         }
         const response = await api.post(`EmpType`, collectData);
         if (response.data.success) {
            const arr: any[] = [];
            response.data.data.map((item: any) => {
               arr.push({
                  value: item.emp_type_id,
                  label: item.emp_type_name
               });
            });
            setEmpTypeOption(arr);
         } else {
            toast.error(response.data.message);
         }
      }
      catch (error) {
         toast.error("An error occurred. Please try again.");
      }
   }



   const handleEditData = async (empId: number) => {
      const collectData = {
         "Emp_id_1": empId,
         "EmpImage_38": "any",
         "empsign": "any",
         "EmployeeThumb": "any",
         "ThumbTemplate": "any",
         "ThumbTemplate2": "any",
         "EmployeeThumb2": "any",
         "ThumbTemplate3": "any",
         "ThumbTemplate4": "any",
         "Type": 3
      }
      const response = await api.post(`EmployeeDetail`, collectData);
      const data = response.data.data[0];
      formik.setValues({
         "Emp_id_1": data.Emp_id,
         "Emp_Personal_code_2": data.Emp_Personal_code,
         "Emp_firstname_3": data.Emp_firstname,
         "Emp_middlename_4": data.Emp_middlename,
         "Emp_lastname_5": data.Emp_lastname,
         "Curr_Address_6": data.Curr_Address,
         "Curr_city_id_7": data.Curr_city_id,
         "Curr_Pin_8": data.Curr_Pin,
         "Curr_state_id_9": data.Curr_state_id,
         "Per_Address_10": data.Per_Address,
         "Per_city_id_11": data.Per_city_id,
         "Per_Pin_12": data.Per_Pin,
         "Per_state_id_13": data.Per_state_id,
         "Per_Phone_No_14": data.Per_Phone_No,
         "Mobile_no_15": data.Mobile_no,
         "Emergeny_Contact_no_16": data.Emergeny_Contact_no,
         "Personal_email_18": data.Personal_email,
         "Language_Known_19": data.Language_Known,
         "DateofBirth_20": dayjs(data.DateofBirth || defaultValuestime).format("YYYY-MM-DD"),
         "Gender_21": data.Gender,
         "Marital_Status_23": data.Marital_Status,
         "Nationality_25": data.Nationality,
         "Handicapped_26": data.Handicapped,
         "session_year_27": data.session_year,
         "User_id_28": data.User_id,
         "inst_ID_29": data.inst_ID,
         "title_30": data.title,
         "CCountry_31": data.CCountry,
         "PCountry_32": data.PCountry,
         "EmpCategory_id_33": data.EmpCategory_id,
         "EmpType_id_34": data.EmpType_id,
         "JoiningDate_35": dayjs(data.JoiningDate || defaultValuestime).format("YYYY-MM-DD"),
         "ConfirmationDate_36": dayjs(data.ConfirmationDate || defaultValuestime).format("YYYY-MM-DD"),
         "Overtime_37": data.Overtime,
         "EmpImage_38": bufferToBase64(data.EmpImage),
         "flag_38": "",
         "Emp_sta": data.Emp_sta,
         "print_status": data.print_status,
         "image_stauts": data.image_status,
         "empsign": bufferToBase64(data.membersign),
         "fathername": data.father_name,
         "IssuingAuthority": data.IssuingAuthority,
         "PersonalMarkIdent": data.PersonalMarkIdent,
         "emp_subtype": data.emp_subtype,
         "EmployeeThumb": "any",
         "ThumbTemplate": "any",
         "ThumbTemplate2": "any",
         "IsThumb": "",
         "EmployeeThumb2": "any",
         "ThumbTemplate3": "any",
         "ThumbTemplate4": "any",
         "IsThumb2": "",
         "ip": "",
         "actions": "",
         "entrydate": dayjs(data.entrydata || defaultValuestime).format("YYYY-MM-DD"),
         "motherName": data.motherName,
         "Type": 2
      })
      setEditId(empId);
   }


   const formik = useFormik({
      initialValues: {
         "Emp_id_1": 0,
         "Emp_Personal_code_2": "",
         "Emp_firstname_3": "",
         "Emp_middlename_4": "",
         "Emp_lastname_5": "",
         "Curr_Address_6": "",
         "Curr_city_id_7": 0,
         "Curr_Pin_8": "",
         "Curr_state_id_9": 0,
         "Per_Address_10": "",
         "Per_city_id_11": 0,
         "Per_Pin_12": "",
         "Per_state_id_13": 0,
         "Per_Phone_No_14": "",
         "Mobile_no_15": "",
         "Emergeny_Contact_no_16": "",
         "Personal_email_18": "",
         "Language_Known_19": "",
         "DateofBirth_20": defaultValuestime,
         "Gender_21": "",
         "Marital_Status_23": "",
         "Nationality_25": 0,
         "Handicapped_26": "",
         "session_year_27": "",
         "User_id_28": "",
         "inst_ID_29": 1,
         "title_30": 0,
         "CCountry_31": 0,
         "PCountry_32": 0,
         "EmpCategory_id_33": 0,
         "EmpType_id_34": 0,
         "JoiningDate_35": defaultValuestime,
         "ConfirmationDate_36": defaultValuestime,
         "Overtime_37": "",
         "EmpImage_38": "",
         "flag_38": "",
         "Emp_sta": "",
         "print_status": "",
         "image_stauts": "",
         "empsign": "",
         "fathername": "",
         "IssuingAuthority": "",
         "PersonalMarkIdent": "",
         "emp_subtype": "",
         "EmployeeThumb": "any",
         "ThumbTemplate": "any",
         "ThumbTemplate2": "any",
         "IsThumb": "",
         "EmployeeThumb2": "any",
         "ThumbTemplate3": "any",
         "ThumbTemplate4": "any",
         "IsThumb2": "",
         "ip": "",
         "actions": "",
         "entrydate": defaultValuestime,
         "motherName": "",
         "Type": 1
      },


      onSubmit: async (values) => {

         // try {
         //    if (values.EmpImage_38 == null || values.EmpImage_38 == "") {
         //       values.EmpImage_38 = "any";
         //    }
         //    if (values.empsign == null || values.empsign == "") {
         //       values.empsign = "any";
         //    }
         //    const response = await api.post(
         //       `EmployeeDetail`,
         //       values
         //    );
         //    if (response.data.success) {
         //       setToaster(false);
         //       toast.success(response.data.message);
         //       formik.resetForm();
         //       setEditId(-1);
         //       getEmpData();
         //       //navigate("/employeeInfo/Employee");
         //    } else {
         //       toast.error(response.data.message);
         //    }
         // } catch (error) {
         //    setToaster(true);
         //    console.error("Error:", error);
         //    toast.error("An error occurred. Please try again.");
         // }
      },
   });

   const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      const { values } = formik;

      const content = `
        <html>
         <head>
            <title>Employee Report</title>
            <style>
               body { 
                     font-family: Arial, sans-serif; 
                     padding: 10px; 
               }
               .container { 
                     width: 80%; 
                     margin: auto; 
                     background: white; 
                     border: 1px solid #ddd; 
                     padding: 20px; 
                     box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                     border-radius: 10px;
                     background-color: #f8f9fa;
                     border: 3px solid #007bff; /* Page Border */
               }
               .title { 
                     font-size: 26px; 
                     font-weight: bold; 
                     text-align: center; 
                     margin-bottom: 20px; 
                     text-transform: uppercase;
                     color: #333;
               }
               .header {
                     display: flex;
                     justify-content: center; 
                     align-items: center;
                     border-bottom: 2px solid #007bff;
                     padding-bottom: 10px;
                     margin-bottom: 20px;
               }
               .profile {
                     text-align: right;
               }
               .profile img {
                     width: 140px;
                     height: 160px;
                     border-radius: 0;
                     border: 2px solid #007bff;
                     object-fit: cover;
               }
               .section-title { 
                     font-size: 20px; 
                     font-weight: bold; 
                     margin-top: 20px; 
                     border-bottom: 2px solid #007bff; 
                     padding-bottom: 5px;
                     color: #007bff;
                     text-align: center;
               }
               .content { 
                     display: flex; 
                     justify-content: space-between; 
               }
               .left, .right { 
                     width: 48%; 
               }
               .field {
                     margin: 8px 0; 
                     font-size: 16px;
                     display: flex;
                     justify-content: space-between;
                     padding: 6px;
                     border-bottom: 1px dashed #ccc;
               }
               .field b {
                     width: 40%; 
                     color: #555;
               }
               .field span {
                     width: 55%;
                     font-weight: 500;
                     color: #333;
               }
            </style>
         </head>
         <body>
            <div class="container">
               
               <!-- Header  -->
               <div class="header">
                     <div class="title">Employee Report</div>
               </div>

               <!-- Employee Information -->
               <div class="section-title">Employee Information</div>
               <div class="content">
                     <div class="left">
                        <div class="field"><b>Employee Code:</b> <span>${values.Emp_id_1}</span></div>
                        <div class="field"><b>Employee Name:</b> <span>${values.Emp_firstname_3} ${values.Emp_lastname_5}</span></div>
                        <div class="field"><b>Date of Birth:</b> <span>${values.DateofBirth_20}</span></div>
                        <div class="field"><b>Marital Status:</b> <span>${values.Marital_Status_23}</span></div>
                        <div class="field"><b>Gender:</b> <span>${values.Gender_21}</span></div>
                        <div class="field"><b>Current Address:</b> <span>${values.Curr_Address_6}</span></div>
                        <div class="field"><b>Pin Code:</b> <span>${values.Curr_Pin_8}</span></div>
                        <div class="field"><b>Mobile:</b> <span>${values.Mobile_no_15}</span></div>
                        <div class="field"><b>Emergency Contact:</b> <span>${values.Emergeny_Contact_no_16}</span></div>
                        <div class="field"><b>Nationality:</b> <span>${values.Nationality_25}</span></div>
                        <div class="field"><b>Handicapped:</b> <span>${values.Handicapped_26}</span></div>
                        <div class="field"><b>Language Known:</b> <span>${values.Language_Known_19}</span></div>
                        <div class="field"><b>Date of Joining:</b> <span>${values.JoiningDate_35}</span></div>
                        <div class="field"><b>Confirmation Date:</b> <span>${values.ConfirmationDate_36}</span></div>
                     </div>
                     <div class="right">
                        <div class="field">
                           <b>Employee Image:</b> 
                           <span>
                                 <div class="profile" style="margin-right:10px">
                                    <img src="data:image/jpg;base64,${values.EmpImage_38}" alt="Profile Image">
                                 </div>
                           </span>
                        </div>
                        <div class="field"><b>Permanent Address:</b> <span>${values.Per_Address_10}</span></div>
                        <div class="field"><b>Pin Code:</b> <span>${values.Per_Pin_12}</span></div>
                        <div class="field"><b>Personal E-mail:</b> <span>${values.Personal_email_18}</span></div>
                     </div>
               </div>
            </div>

            <script>
               window.onload = function() {
                     window.print();
               };
            </script>
         </body>
         </html>
      `;

      console.log("image","data:image/jpg;base64,${values.EmpImage_38}")
      if (printWindow) {
         printWindow.document.write(content);
         printWindow.document.close();
      } else {
         console.error("Failed to open print window.");
      }
   };

   const handleSubmitWrapper = async () => {
      await formik.handleSubmit();
   };


   const handlePanClose1 = () => {
      setOpen(false);
   };

   const modalOpenHandle1 = (event: string) => {
      setOpen(true);
      const base64Prefix = "data:image/jpg;base64,";

      let imageData = '';
      switch (event) {
         case "EmpImage_38":
            imageData = formik.values.EmpImage_38;
            break;
         case "empsign":
            imageData = formik.values.empsign;
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


   const back = useNavigate();

   return (
      <div>
         <div
            style={{
               padding: "-5px 5px",
               backgroundColor: "#ffffff",
               borderRadius: "5px",
               marginTop: "5px",
               border: ".5px solid #2B4593",
            }}
         >
            <CardContent>
               <Grid item xs={12} container spacing={2}>
                  {/* <Grid item lg={2} md={2} xs={2} marginTop={2}>
                     <Button
                        type="submit"
                        onClick={() => back(-1)}
                        variant="contained"
                        style={{
                           backgroundColor: `var(--grid-headerBackground)`,
                           color: `var(--grid-headerColor)`,
                        }}
                     >
                        <ArrowBackSharpIcon />
                     </Button>
                  </Grid> */}
                  <Grid
                     item
                     lg={10}
                     md={10}
                     xs={10}
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ padding: "20px" }}
                        align="center"
                     >
                        {t("text.StaffReport")}
                     </Typography>
                  </Grid>

                  <Grid item lg={2} md={2} xs={2} marginTop={3}>
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
               <br />
               <ConfirmDialog />
               <ToastContainer />
               <form
                  onSubmit={formik.handleSubmit}
               >
                  {toaster === false ? "" : <ToastApp />}
                  <Grid item xs={12} container spacing={2}>
                     <Grid item lg={12} md={12} sm={12} xs={12} alignItems="end">
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={empData}
                              value={empCodeSearch}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 if (!newValue) {
                                    formik.resetForm();
                                    return;
                                 }
                                 console.log(newValue?.value);
                                 handleEditData(newValue.Emp_id);
                                 setempCodeSearch(newValue.label);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.SearchEmp")} required={false} />}
                                    name=""
                                    id=""
                                    placeholder={t("text.SearchEmp")}
                                 />
                              )}
                           />

                        </Grid>
                     </Grid>

                     <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
                        <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={titleOption}
                              value={titleOption[titleOption.findIndex((e: any) => e.value === formik.values.title_30)]?.label}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("title_30", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Title")} required={false} />}
                                    name="title_30"
                                    id="title_30"
                                    placeholder={t("text.Title")}
                                 />
                              )}
                           />

                        </Grid>
                        <Grid item lg={3.5} md={3.5} sm={3.5} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.FirstName")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Emp_firstname_3"
                              id="Emp_firstname_3"
                              value={formik.values.Emp_firstname_3}
                              placeholder={t("text.FirstName")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={3.5} md={3.5} sm={3.5} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.MiddleName")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Emp_middlename_4"
                              id="Emp_middlename_4"
                              value={formik.values.Emp_middlename_4}
                              placeholder={t("text.MiddleName")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={3.5} md={3.5} sm={3.5} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.LastName")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Emp_lastname_5"
                              id="Emp_lastname_5"
                              value={formik.values.Emp_lastname_5}
                              placeholder={t("text.LastName")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.EmployeeCode")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Emp_Personal_code_2"
                              id="Emp_Personal_code_2"
                              value={formik.values.Emp_Personal_code_2}
                              placeholder={t("text.EmployeeCode")}
                              onChange={(e) => {
                                 formik.setFieldValue("Emp_Personal_code_2", e.target.value.toString());
                              }}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.FatherName")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="fathername"
                              id="fathername"
                              value={formik.values.fathername}
                              placeholder={t("text.FatherName")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.MotherName")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="motherName"
                              id="motherName"
                              value={formik.values.motherName}
                              placeholder={t("text.MotherName")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Male", "Female"]}
                              value={formik.values.Gender_21}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Gender_21", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Gender")} required={false} />}
                                    name="Gender_21"
                                    id="Gender_21"
                                    placeholder={t("text.Gender")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.DOB")}
                                    required={false}
                                 />
                              }
                              type="date"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="DateofBirth_20"
                              id="DateofBirth_20"
                              value={formik.values.DateofBirth_20}
                              placeholder={t("text.DOB")}
                              onChange={formik.handleChange}
                              InputLabelProps={{ shrink: true }}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={countryOption}
                              value={countryOption.find((e: any) => e.value == formik.values.Nationality_25)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Nationality_25", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Nationality")} required={false} />}
                                    name="Nationality_25"
                                    id="Nationality_25"
                                    placeholder={t("text.Nationality")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Single", "Married"]}
                              value={formik.values.Marital_Status_23}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Marital_Status_23", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.MaritalStatus")} required={false} />}
                                    name="Marital_Status_23"
                                    id="Marital_Status_23"
                                    placeholder={t("text.MaritalStatus")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Yes", "No"]}
                              value={formik.values.Handicapped_26}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Handicapped_26", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Handicapped")} required={false} />}
                                    name="Handicapped_26"
                                    id="Handicapped_26"
                                    placeholder={t("text.Handicapped")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.LanguagesKnown")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Language_Known_19"
                              id="Language_Known_19"
                              value={formik.values.Language_Known_19}
                              placeholder={t("text.LanguagesKnown")}
                              onChange={formik.handleChange}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={casteCategoryOption}
                              value={casteCategoryOption.find((e: any) => e.value === formik.values.EmpCategory_id_33)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("EmpCategory_id_33", newValue.value);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.CasteCategory")} required={false} />}
                                    name="EmpCategory_id_33"
                                    id="EmpCategory_id_33"
                                    placeholder={t("text.CasteCategory")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={empTypeOption}
                              value={empTypeOption.find((e: any) => e.value === formik.values.EmpType_id_34)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("EmpType_id_34", newValue.value);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.EmployeeType")} required={false} />}
                                    name="EmpType_id_34"
                                    id="EmpType_id_34"
                                    placeholder={t("text.EmployeeType")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.JoiningDate")}
                                    required={false}
                                 />
                              }
                              type="date"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="JoiningDate_35"
                              id="JoiningDate_35"
                              value={formik.values.JoiningDate_35}
                              placeholder={t("text.JoiningDate")}
                              onChange={formik.handleChange}
                              InputLabelProps={{ shrink: true }}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Active", "Inactive"]}
                              value={formik.values.Emp_sta}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Emp_sta", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Status")} required={false} />}
                                    name="Emp_sta"
                                    id="Emp_sta"
                                    placeholder={t("text.Status")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.ConfirmationDate")}
                                    required={false}
                                 />
                              }
                              type="date"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="ConfirmationDate_36"
                              id="ConfirmationDate_36"
                              value={formik.values.ConfirmationDate_36}
                              placeholder={t("text.ConfirmationDate")}
                              onChange={formik.handleChange}
                              InputLabelProps={{ shrink: true }}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Y", "N"]}
                              value={formik.values.Overtime_37}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Overtime_37", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Overtime")} required={false} />}
                                    name="Overtime_37"
                                    id="Overtime_37"
                                    placeholder={t("text.Overtime")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={["Y", "N"]}
                              value={formik.values.IssuingAuthority}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("IssuingAuthority", newValue);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.IssuingAuthority")} required={false} />}
                                    name="IssuingAuthority"
                                    id="IssuingAuthority"
                                    placeholder={t("text.IssuingAuthority")}
                                 />
                              )}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.PersonalIdentificationMark")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="PersonalMarkIdent"
                              id="PersonalMarkIdent"
                              value={formik.values.PersonalMarkIdent}
                              placeholder={t("text.PersonalIdentificationMark")}
                              onChange={formik.handleChange}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.MobileNo")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Mobile_no_15"
                              id="Mobile_no_15"
                              value={formik.values.Mobile_no_15}
                              placeholder={t("text.MobileNo")}
                              onChange={formik.handleChange}
                           />
                        </Grid>

                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.EmergencyContactNo")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Emergeny_Contact_no_16"
                              id="Emergeny_Contact_no_16"
                              value={formik.values.Emergeny_Contact_no_16}
                              placeholder={t("text.EmergencyContactNo")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.PersonalEmail")}
                                    required={false}
                                 />
                              }
                              type="email"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Personal_email_18"
                              id="Personal_email_18"
                              value={formik.values.Personal_email_18}
                              placeholder={t("text.PersonalEmail")}
                              onChange={formik.handleChange}
                           />
                        </Grid>


                        {/* <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.OfficeEmail")}
                                    required={false}
                                 />
                              }
                              type="email"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="OfficeEmail"
                              id="OfficeEmail"
                              //value={formik.values.OfficeEmail}
                              placeholder={t("text.OfficeEmail")}
                           //onChange={formik.handleChange}                                       
                           />
                        </Grid> */}



                     </Grid>

                     <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.Address")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Curr_Address_6"
                              id="Curr_Address_6"
                              value={formik.values.Curr_Address_6}
                              placeholder={t("text.Address")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={countryOption}
                              value={countryOption.find((e: any) => e.value === formik.values.CCountry_31)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("CCountry_31", newValue.value);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Country")} required={false} />}
                                    name="CCountry_31"
                                    id="CCountry_31"
                                    placeholder={t("text.Country")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={stateOption}
                              value={stateOption.find((e: any) => e.value === formik.values.Curr_state_id_9)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Curr_state_id_9", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.State")} required={false} />}
                                    name="Curr_state_id_9"
                                    id="Curr_state_id_9"
                                    placeholder={t("text.State")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={cityOption}
                              value={cityOption.find((e: any) => e.value === formik.values.Curr_city_id_7)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Curr_city_id_7", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.City")} required={false} />}
                                    name="Curr_city_id_7"
                                    id="Curr_city_id_7"
                                    placeholder={t("text.City")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.Pincode")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Curr_Pin_8"
                              id="Curr_Pin_8"
                              value={formik.values.Curr_Pin_8}
                              placeholder={t("text.Pincode")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                     </Grid>

                     <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                           <FormControlLabel
                              label={t("text.sameAsCurrentAddress")}
                              control={
                                 <Checkbox
                                    value=""
                                    // checked={}
                                    onChange={() => {
                                       formik.setFieldValue("Per_Address_10", formik.values.Curr_Address_6);
                                       formik.setFieldValue("PCountry_32", formik.values.CCountry_31);
                                       formik.setFieldValue("Per_state_id_13", formik.values.Curr_state_id_9);
                                       formik.setFieldValue("Per_city_id_11", formik.values.Curr_city_id_7);
                                       formik.setFieldValue("Per_Pin_12", formik.values.Curr_Pin_8);
                                    }}
                                    color="primary"
                                 />
                              }
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.Address")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Per_Address_10"
                              id="Per_Address_10"
                              value={formik.values.Per_Address_10}
                              placeholder={t("text.Address")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={countryOption}
                              value={countryOption.find((e: any) => e.value === formik.values.PCountry_32)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("PCountry_32", newValue.value);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.Country")} required={false} />}
                                    name="PCountry_32"
                                    id="PCountry_32"
                                    placeholder={t("text.Country")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={stateOption}
                              value={stateOption.find((e: any) => e.value === formik.values.Per_state_id_13)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Per_state_id_13", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.State")} required={false} />}
                                    name="Per_state_id_13"
                                    id="Per_state_id_13"
                                    placeholder={t("text.State")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={cityOption}
                              value={cityOption.find((e: any) => e.value === formik.values.Per_city_id_11)}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue?.value);
                                 formik.setFieldValue("Per_city_id_11", newValue.value);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.City")} required={false} />}
                                    name="Per_city_id_11"
                                    id="Per_city_id_11"
                                    placeholder={t("text.City")}
                                 />
                              )}
                           />
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.Pincode")}
                                    required={false}
                                 />
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="Per_Pin_12"
                              id="Per_Pin_12"
                              value={formik.values.Per_Pin_12}
                              placeholder={t("text.Pincode")}
                              onChange={formik.handleChange}
                           />
                        </Grid>
                     </Grid>

                     <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
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
                                 label={<CustomLabel text={t("text.AttachedImage")} />}
                                 size="small"
                                 fullWidth
                                 style={{ backgroundColor: "white" }}
                                 onChange={(e) => otherDocChangeHandler(e, "EmpImage_38")}
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
                                 {formik.values.EmpImage_38 == "" ? (
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
                                       src={`data:image/jpg;base64,${formik.values.EmpImage_38}`}
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
                                    onClick={() => modalOpenHandle1("EmpImage_38")}
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
                           <Modal open={panOpens} onClose={handlePanClose1}>
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
                                 label={<CustomLabel text={t("text.AttachedSignature")} />}
                                 size="small"
                                 fullWidth
                                 style={{ backgroundColor: "white" }}
                                 onChange={(e) => otherDocChangeHandler(e, "empsign")}
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
                                 {formik.values.empsign == "" ? (
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
                                       src={`data:image/jpg;base64,${formik.values.empsign}`}
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
                                    onClick={() => modalOpenHandle1("empsign")}
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
                     </Grid>

                     <Grid item lg={4} sm={4} xs={12}>
                        <Button
                           type="button"
                           fullWidth
                           style={{
                              backgroundColor: "blue",
                              color: "white",
                              marginTop: "10px",
                           }}
                           onClick={() => {
                              handlePrint()
                           }}
                        >
                           {t("text.print")}
                        </Button>
                     </Grid>



                     <Grid item lg={4} sm={4} xs={12}>
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

export default StaffReport;


const titleOption = [
   { label: "Mr.", value: 1 },
   { label: "Mrs.", value: 2 },
   { label: "Miss", value: 3 },
   { label: "Dr.", value: 4 },
   { label: "Prof.", value: 5 },
   { label: "Er.", value: 6 },
   { label: "Smt.", value: 7 },
   { label: "Shri.", value: 8 },
]
