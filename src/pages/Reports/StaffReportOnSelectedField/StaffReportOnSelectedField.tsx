import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
   Grid,
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Typography,
   FormControlLabel,
   Checkbox,
   FormControl,
   RadioGroup,
   Radio,
   Autocomplete,
   ListItemText,
   List,
   ListItem,
   ListItemButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import CustomLabel from "../../../CustomLable";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "../../../index.css";
import { getISTDate } from "../../../utils/Constant";


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

const allFields = [
   "Employee Id", "Employee Name", "Date of Birth", "Gender", "Cast",
   "Marital Status", "Wedding Anniversary", "Mobile No.", "Phone No.", "Email-id",
   "Office Email-id", "Employment Category", "Joining Date", "Employee Type", "Confirmation Date",
   "Nationality", "Language Known", "Handicapped", "Father Name", "Cadre",
   "Spouse Name", "Spouse Alive", "Religion", "Status", "Personal E_Mail",
   "Sub Caste Category", "Employee SubType", "Issuing Authority",
   "Personal Mark For Identification", "Mother Name", "Father Alive", "Selection Mode", "Date Of Retirement"
];

export default function StaffReportOnSelectedField() {
   const { defaultValues } = getISTDate();
   const location = useLocation();
   const [zones, setZones] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [visible, setVisible] = useState(false);
   const [isChecked, setIsChecked] = useState(false);

   //multiselectField
   // const [inactiveFields, setInactiveFields] = useState<string[]>(allFields);
   const [activeFields, setActiveFields] = useState<string[]>([]);


   const [option, setOption] = useState([
      { value: "-1", label: "Vehicle Type" },
   ]);

   const [isPrint, setPrint] = useState([]);

   const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

   const [VnoOption, setVnoOption] = useState([
      { value: -1, label: "Select Vehicle No " },
   ]);

   const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
   const [vNO, setVno] = useState("");

   const [vType, setVType] = useState([]);

   const [selDay, setDay] = useState(false);

   const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFormat((event.target as HTMLInputElement).value);
   };

   const formik = useFormik({
      initialValues: {
         genderID: -1,
         "vehicleNo": location.state?.vehicleNo || vNO,
         "complainNo": "",
         "complaintDatefrom": defaultValues,
         "complaintDateTo": defaultValues,
         "status": location.state?.status || "",
         "show": true
      },
      onSubmit: async (values) => {
         // API call or other logic
      },
   });

   const handleDownload = async () => {
      const collectData = {
         "vehicleNo": formik.values.vehicleNo || vNO,
         "complainNo": formik.values.complainNo,
         "complaintDatefrom": formik.values.complaintDatefrom,
         "complaintDateTo": formik.values.complaintDateTo,
         status: formik.values.status,
         show: false,
         exportOption: selectedFormat, // .pdf, .xls, or TabularExc
      };

      try {
         const response = await api.post(`Report/GetvComplainStatusSummaryApi`, collectData);

         if (response.data.status === "Success" && response.data.base64) {
            const base64String = response.data.base64;
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length)
               .fill(0)
               .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);

            let fileType = "";
            let fileName = response.data.fileName || "Report";

            if (selectedFormat === ".pdf") {
               fileType = "application/pdf";
               fileName += ".pdf";
            } else if (selectedFormat === ".xls") {
               fileType = "application/vnd.ms-excel";
               fileName += ".xls";
            } else if (selectedFormat === "TabularExc") {
               fileType = "application/vnd.ms-excel";
               fileName += ".xls";
            }

            const blob = new Blob([byteArray], { type: fileType });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
         } else {
            console.error("Error: No valid data received.");
         }
      } catch (error) {
         console.error("Error downloading file:", error);
      }
   };
   let navigate = useNavigate();
   const { t } = useTranslation();

   useEffect(() => {
      getVehicleNo();
      fetchZonesData();

      if (location.state) {
         formik.setFieldValue("complaintDatefrom", moment("2020-02-01T13:13:51.91").format("YYYY-MM-DD"));
         formik.setFieldValue("complaintDateTo", defaultValues);
         // fetchZonesData();
         // setVisible(true);
      }
   }, []);



   const getVehicleNo = () => {

      api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
         const arr = res?.data?.data.map((item: any) => ({
            label: item.vehicleNo,
            value: item.itemMasterId,
         }));
         setVnoOption(arr);
      });
   };


   let currentDate = new Date();

   currentDate.setDate(currentDate.getDate() - 1);

   let previousDate = currentDate.toISOString();

   const fetchZonesData = async () => {
      try {
         const collectData = {
            "vehicleNo": formik.values.vehicleNo || vNO,
            "complainNo": formik.values.complainNo,
            "complaintDatefrom": formik.values.complaintDatefrom,
            "complaintDateTo": formik.values.complaintDateTo,
            status: formik.values.status,
            "show": true,
            exportOption: "selectedFormat",
         };
         const response = await api.post(
            `Report/GetvComplainStatusSummaryApi`,
            collectData
         );
         const data = response?.data;

         const Print = data.map((item: any, index: any) => ({
            ...item,
         }));
         setPrint(Print);
         const zonesWithIds = data.map((zone: any, index: any) => ({
            ...zone,
            serialNo: index + 1,
            id: index + 1,
         }));
         setZones(zonesWithIds);
         setIsLoading(false);

         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "serialNo",
                  headerName: t("text.SrNo"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here
               },

               {
                  field: "complainNo",
                  headerName: t("text.complainNo"),
                  flex: 1.2,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here
               },
               {
                  field: "complaint",
                  headerName: t("text.complaint"),
                  flex: 1.2,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here
               },
               {
                  field: "vehicleNo",
                  headerName: t("text.vehicleNo12"),
                  flex: 1.2,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here
               },
               {
                  field: "jobCardNo",
                  headerName: t("text.JobCardNo"),
                  flex: 1.2,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here
               },
               {
                  field: "complainStatus",
                  headerName: t("text.complainStatus12"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
                  cellClassName: "wrap-text", // Added here

               },

               {
                  field: "complaintDate",
                  headerName: t("text.complaintDate"),
                  flex: 1.3,
                  cellClassName: "wrap-text", // Added here
                  headerClassName: "MuiDataGrid-colCell",
                  renderCell: (params) => {
                     return moment(params.row.complaintDate).format("DD-MM-YYYY");
                  },
               },

               {
                  field: "updatedOn",
                  headerName: t("text.closingdate"),
                  flex: 1.3,
                  cellClassName: "wrap-text", // Added here
                  headerClassName: "MuiDataGrid-colCell",
                  renderCell: (params) => {
                     return moment(params.row.updatedOn).format("DD-MM-YYYY");
                  },
               },
               {
                  field: "totaldays",
                  headerName: t("text.totaldays"),
                  flex: 1.3,
                  cellClassName: "wrap-text", // Added here
                  headerClassName: "MuiDataGrid-colCell",
               },

            ];
            setColumns(columns as any);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
         // setLoading(false);
      }
   };
   const adjustedColumns = columns.map((column: any) => ({
      ...column,
   }));

   const styles = `
  .wrap-text {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
`;

   document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);




   const handleToggleField = (item: string) => {
      if (activeFields.includes(item)) {
         setActiveFields(activeFields.filter(field => field !== item));
      } else {
         setActiveFields([...activeFields, item]);
      }
   };

   // const renderList = (title: string, items: string[], isInactive: boolean) => (
   //    <Paper sx={{ width: 200, height: 300, overflow: "auto", p: 1 }}>
   //       <Typography variant="subtitle1" align="center" fontWeight="bold">{title}</Typography>
   //       <List>
   //          {items.map((item) => (
   //             <ListItem
   //                key={item}
   //                button
   //                onClick={() => handleToggleField(item)}
   //                selected={!isInactive && activeFields.includes(item)}
   //             >
   //                <ListItemText primary={item} />
   //             </ListItem>
   //          ))}
   //       </List>
   //    </Paper>
   // );

   const renderList = (title: string, items: string[], isInactive: boolean) => (
      <Paper
         sx={{
            width: 250,
            height: 350,
            overflow: "auto",
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
         }}
      >
         <Typography variant="subtitle1" align="center" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
            {title}
         </Typography>
         <List sx={{ maxHeight: 300, overflow: "auto" }}>
            {items.map((item:any) => (
               <ListItemButton
                  key={item}
                  onClick={() => handleToggleField(item)}
                  selected={!isInactive && activeFields.includes(item)}
                  sx={{
                     "&:hover": { backgroundColor: "#e0e0e0" },
                     "&.Mui-selected": { backgroundColor: "#e0e0e0", color: "#000" },
                  }}
               >
                  <ListItemText primary={item} />
               </ListItemButton>
            ))}
         </List>
      </Paper>
   );


   return (
      <>
         <Card
            style={{
               width: "100%",
               // height: "100%",
               backgroundColor: "#E9FDEE",
               // border: ".5px solid #FF7722 ",
               marginTop: "3vh",
            }}
         >
            <Paper
               sx={{
                  width: "100%",
                  overflow: "hidden",
                  "& .MuiDataGrid-colCell": {
                     backgroundColor: `var(--grid-headerBackground)`,
                     color: `var(--grid-headerColor)`,
                     fontSize: 12,
                     fontWeight: 700,
                  },
               }}
               style={{ padding: "10px" }}
            >
               <ConfirmDialog />

               <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "15px" }}
                  align="left"
               >
                  {t("text.StaffReportOnSelectedField")}
               </Typography>
               <Divider />

               <Box height={10} />

               <Grid item xs={12} container spacing={2}>
                  <Grid item xs={12} sm={3} lg={3}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={[1, 2, 3]}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.StaffId")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.StaffId")}
                           />
                        )}
                     />
                  </Grid>

                  <Grid xs={12} md={3} lg={3} item>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={[1, 2, 3]}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.Designation")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.Designation")}
                           />
                        )}
                     />

                  </Grid>

                  <Grid xs={12} md={3} lg={3} item>
                     <TextField
                        label={
                           <CustomLabel
                              text={t("text.fromDate")}
                              required={false}
                           />
                        }
                        type="date"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="fromDate"
                        id="fromDate"
                        //value={formik.values.fromDate}
                        placeholder={t("text.fromDate")}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                     />

                  </Grid>

                  <Grid xs={12} sm={3} md={3} item>
                     <TextField
                        label={
                           <CustomLabel
                              text={t("text.toDate")}
                              required={false}
                           />
                        }
                        type="date"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="toDate"
                        id="toDate"
                        //value={formik.values.toDate}
                        placeholder={t("text.toDate")}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                     />

                  </Grid>

                  <Grid xs={12} sm={12} md={12} item>
                     {/* <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                           <Paper sx={{ width: 200, height: 300, display: "flex", alignItems: "center", justifyContent: "center", p: 1 }}>
                              <Typography variant="h6" align="center">General Information</Typography>
                           </Paper>
                        </Grid>
                        <Grid item>{renderList("Inactive Fields", allFields.filter(field => !activeFields.includes(field)), true)}</Grid>
                        <Grid item>{renderList("Active Fields", activeFields, false)}</Grid>
                     </Grid> */}
                     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, p: 3 }}>
                        {/* <Typography variant="h5" fontWeight="bold" color="primary">Manage Personal Information</Typography> */}
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                           <Grid item>
                              <Paper
                                 sx={{
                                    width: 250,
                                    height: 350,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    backgroundColor: "#fff",
                                    color: "#000",
                                 }}
                              >
                                 <Typography variant="h6" align="center">General Information</Typography>
                              </Paper>
                           </Grid>
                           <Grid item>{renderList("", allFields.filter(field => !activeFields.includes(field)), true)}</Grid>
                           <Grid item>{renderList("", activeFields, false)}</Grid>
                        </Grid>
                     </Box>
                  </Grid>





                  <Grid xs={12} sm={4} md={4} item>
                     <Button
                        type="submit"
                        fullWidth
                        style={{
                           backgroundColor: `var(--header-background)`,
                           color: "white",
                           marginTop: "10px",
                        }}
                        onClick={() => {

                           fetchZonesData();
                           setVisible(true);

                        }}
                        startIcon={<VisibilityIcon />}
                     >
                        {t("text.show")}

                     </Button>
                  </Grid>

                  <Grid xs={12} sm={4} md={4} item>
                     <Button
                        type="button"
                        fullWidth
                        style={{
                           backgroundColor: `#f44336`,
                           color: "white",
                           marginTop: "10px",
                        }}
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                           formik.resetForm();
                           setVisible(false);
                           setSelectedFormat(".pdf");
                           setVno("");
                        }}
                     >
                        {t("text.reset")}

                     </Button>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4}>
                     <Button
                        type="button"
                        fullWidth
                        style={{
                           backgroundColor: "#4caf50",
                           color: "white",
                           marginTop: "10px",
                        }}
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                     >
                        {t("text.download")}

                     </Button>
                  </Grid>
               </Grid>

               <Grid
                  item
                  xs={12}
                  container
                  spacing={2}
                  sx={{ marginTop: "3%", justifyContent: "center" }}
               >
                  {visible && (
                     <Grid item xs={12} sm={12} lg={12}>
                        {isLoading ? (
                           <div className="loader-container">
                              <div className="steering-wheel"></div> {/* Spinner */}
                           </div>
                        ) : (
                           <DataGrid
                              rows={zones}
                              columns={adjustedColumns}
                              rowSpacingType="border"
                              autoHeight
                              // slots={{
                              //   toolbar: GridToolbar,
                              // }}
                              pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                 value: size,
                                 label: `${size}`,
                              }))}
                              initialState={{
                                 pagination: { paginationModel: { pageSize: 5 } },
                              }}
                              slotProps={{
                                 toolbar: {
                                    showQuickFilter: true,
                                 },
                              }}
                              sx={{
                                 border: 0,
                                 "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#42b6f5", // Header background color
                                    color: "white", // Header text color
                                 },
                                 "& .MuiDataGrid-columnHeaderTitle": {
                                    color: "white", // Header title text color
                                 },
                                 "& .MuiDataGrid-cell": {
                                    whiteSpace: "normal", // Ensure text wraps inside the cell
                                    wordWrap: "break-word", // Break words to avoid overflow
                                    overflowWrap: "break-word", // Ensure long words wrap correctly
                                 },
                              }}
                           />
                        )}
                     </Grid>
                  )}
               </Grid>
            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}
