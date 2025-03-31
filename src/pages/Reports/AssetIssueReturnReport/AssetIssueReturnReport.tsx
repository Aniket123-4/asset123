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
import Logo from "../../../assets/images/KanpurLogo.png";

interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function AssetIssueReturnReport() {
   const { defaultValues } = getISTDate();
   const location = useLocation();
   const [zones, setZones] = useState([]);
   const [columns, setColumns] = useState<any>([]);

   const [reportType, setReportType] = useState("both");

   function getThreeMonthsBack(dateStr: string) {
      const date = new Date(dateStr);
      date.setMonth(date.getMonth() - 3);

      return date.toISOString().split("T")[0]; // Returns in YYYY-MM-DD format
   }


   const formik = useFormik({
      initialValues: {
         assetname: "",
         assetCode: "",
         reportAbout: "",
         displayOrder: "",
         fromDate: getThreeMonthsBack(defaultValues),
         toDate: defaultValues,
      },
      onSubmit: async (values) => {
         fetchZonesData(values.assetname);
      },
   });

   const handleDownload = async () => {
      const printWindow = window.open("", "_blank");
      const content = `
           <html>
             <head>
               <title>Issue Return Report</title>
               <style>
                  body { font-family: Arial, sans-serif; }
                  h2 { text-align: center; margin-bottom: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid black; padding: 8px; text-align: left; }
                  th { background-color: #0d3b5c; color: white; }
                  tr:nth-child(even) { background-color: #f8f8f8; }
               </style>
             </head>
             <body>
               <h2>Issue Return Report</h2>
               <table>
                 <thead>
                   <tr>
                     <th>Asset Code</th>
                     <th>Asset Name</th>
                     <th>Employee Name</th>
                     <th>Status</th>
                     <th>Issue Date</th>
                     <th>Return Date</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${zones
            .map(
               (row: any) => `
                       <tr>
                         <td>${row.rescode}</td>
                         <td>${row.resname}</td>
                         <td>${row.empname}</td>
                         <td>${row.status}</td>
                         <td>${row.issuedate}</td>
                         <td>${row.returndate}</td>
                       </tr>
                     `
            )
            .join("")}
                 </tbody>
               </table>
               <script>window.print();</script>
             </body>
           </html>
         `;

      if (printWindow) {
         printWindow.document.write(content);
         printWindow.document.close();
      } else {
         console.error("Failed to open print window.");
      }

   };

   let navigate = useNavigate();
   const { t } = useTranslation();

   const [assetDetailOption, setAssetDetailOption] = useState([]);

   useEffect(() => {
      fetchAssetDetails();
      fetchZonesData();

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

   let currentDate = new Date();

   currentDate.setDate(currentDate.getDate() - 1);

   let previousDate = currentDate.toISOString();

   // const fetchZonesData = async (filterAssetType: string = "") => {
   //    try {
   //       const collectData = {
   //          "Type": 4
   //       };
   //       const response = await api.post(
   //          `ResourceIssueReturn`,
   //          collectData
   //       );
   //       const data = response.data.data;
   //       const zonesWithIds = data.map((zone: any, index: any) => ({
   //          ...zone,
   //          serialNo: index + 1,
   //          id: index,
   //          returndate: moment(zone.returndate).format("YYYY-MM-DD"),
   //          issuedate: moment(zone.issuedate).format("YYYY-MM-DD"),
   //       }));

   //       if (filterAssetType === "") {
   //          setZones(zonesWithIds);
   //          console.log("####", JSON.stringify(zonesWithIds));
   //       } else {
   //          const arr: any = zonesWithIds.filter((e: any) => (e.resname.trim() === formik.values.assetname.trim()));
   //          console.log("#######", arr);
   //          setZones(arr);
   //       }


   //       if (data.length > 0) {
   //          const columns: GridColDef[] = [
   //             // {
   //             //    field: "",
   //             //    headerName: "",
   //             //    flex: 0.3,
   //             //    headerClassName: "MuiDataGrid-colCell",
   //             // },
   //             {
   //                field: "rescode",
   //                headerName: t("text.AssetCode"),
   //                flex: 1,
   //                headerClassName: "MuiDataGrid-colCell",
   //             },
   //             {
   //                field: "resname",
   //                headerName: t("text.AssetName"),
   //                flex: 1,
   //                headerClassName: "MuiDataGrid-colCell",
   //             },
   //             {
   //                field: "empname",
   //                headerName: t("text.EmpName"),
   //                flex: 1.2,
   //                headerClassName: "MuiDataGrid-colCell",
   //             },
   //             {
   //                field: "status",
   //                headerName: t("text.Status"),
   //                flex: .8,
   //                headerClassName: "MuiDataGrid-colCell",

   //             },

   //             {
   //                field: "issuedate",
   //                headerName: t("text.issuedate"),
   //                flex: 1,
   //                headerClassName: "MuiDataGrid-colCell",
   //             },
   //             {
   //                field: "returndate",
   //                headerName: t("text.returndate"),
   //                flex: 1,
   //                headerClassName: "MuiDataGrid-colCell",
   //             },


   //          ];
   //          setColumns(columns as any);
   //       }
   //    } catch (error) {
   //       console.error("Error fetching data:", error);
   //       // setLoading(false);
   //    }
   // };


   const fetchZonesData = async (filterAssetType: string = "") => {
      try {
         const collectData = {
            "Type": 4
         };
         const response = await api.post(
            `ResourceIssueReturn`,
            collectData
         );
         const data = response.data.data;

         console.log("API Data:", data); // Debugging: Log API data

         // If no reportType is selected, show all data
         let filteredData = data;

         if (reportType === "issue") {
            filteredData = data.filter((item: any) => item.status.toLowerCase() === "issue");
         } else if (reportType === "return") {
            filteredData = data.filter((item: any) => item.status.toLowerCase() === "return");
         }

         console.log("Filtered by Report Type:", filteredData);

         // Apply Asset Type filter only if it's provided
         if (filterAssetType) {
            filteredData = filteredData.filter((item: any) =>
               item.resname?.trim().toLowerCase() === filterAssetType.trim().toLowerCase()
            );
         }

         console.log("Filtered by Asset Name:", filteredData);

         // Apply Date Range filter only if both dates are selected
         if (formik.values.fromDate && formik.values.toDate) {
            filteredData = filteredData.filter((item: any) => {
               const issueDate = new Date(item.issuedate);
               const fromDate = new Date(formik.values.fromDate);
               const toDate = new Date(formik.values.toDate);
               return issueDate >= fromDate && issueDate <= toDate;
            });
         }

         console.log("Filtered by Date Range:", filteredData);

         // Format dates and add serial numbers
         const zonesWithIds = filteredData.map((zone: any, index: any) => ({
            ...zone,
            serialNo: index + 1,
            id: index,
            returndate: moment(zone.returndate).format("YYYY-MM-DD"),
            issuedate: moment(zone.issuedate).format("YYYY-MM-DD"),
         }));

         setZones(zonesWithIds);

         // Set columns if data exists
         if (filteredData.length > 0) {
            const columns: GridColDef[] = [
               { field: "rescode", headerName: t("text.AssetCode"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
               { field: "resname", headerName: t("text.AssetName"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
               { field: "empname", headerName: t("text.EmpName"), flex: 1.2, headerClassName: "MuiDataGrid-colCell" },
               { field: "status", headerName: t("text.Status"), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
               { field: "issuedate", headerName: t("text.issuedate"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
               { field: "returndate", headerName: t("text.returndate"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
            ];
            setColumns(columns);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
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
                  {t("text.AssetIssueReturnReport")}
               </Typography>
               <Divider />

               <Box height={10} />

               <Grid item xs={12} container spacing={2}>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assetDetailOption}
                        value={formik.values.assetname}
                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           if (!newValue) return;
                           console.log(newValue?.value);
                           formik.setFieldValue("assetname", newValue.assetName);
                           formik.setFieldValue("assetCode", newValue.assetCode);
                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.AssetName")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.AssetName")}
                           />
                        )}
                     />

                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <TextField
                        label={
                           <CustomLabel
                              text={t("text.AssetCode")}
                              required={false}
                           />
                        }
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="AssetCode"
                        id="AssetCode"
                        value={formik.values.assetCode}
                        placeholder={t("text.AssetCode")}
                        onChange={formik.handleChange}
                        InputLabelProps={{ shrink: true }}
                     />

                  </Grid>

                  {/* <Grid item lg={4} md={4} sm={4} xs={12}>
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
                              label={<CustomLabel text={t("text.PersonType")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.PersonType")}
                           />
                        )}
                     />
                  </Grid> */}

                  {/* <Grid item lg={4} md={4} sm={4} xs={12}>
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
                              label={<CustomLabel text={t("text.Staff")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.Staff")}
                           />
                        )}
                     />
                  </Grid> */}

                  <Grid item lg={4} md={4} sm={4} xs={12}>
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
                        value={formik.values.fromDate}
                        placeholder={t("text.fromDate")}
                        onChange={(e) => {
                           formik.setFieldValue("fromDate", e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                     />

                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
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
                        value={formik.values.toDate}
                        placeholder={t("text.toDate")}
                        onChange={(e) => {
                           formik.setFieldValue("toDate", e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                     />

                  </Grid>

                  <Grid item xs={12} sm={12} lg={12}>
                     <FormControl component="fieldset">
                        <Typography variant="h6" color="initial" sx={{ fontSize: "1.1rem", fontStyle: "bold" }}>{t("text.SelectReportAboutResource")}</Typography>
                        <RadioGroup
                           row
                           value={reportType}
                           onChange={(event) => setReportType(event.target.value)}
                        >
                           <FormControlLabel value="issue" control={<Radio />} label={t("text.AssetIssueReport")} />
                           <FormControlLabel value="return" control={<Radio />} label={t("text.AssetReturnReport")} />
                           <FormControlLabel value="both" control={<Radio />} label={t("text.Both")} />
                        </RadioGroup>
                     </FormControl>
                  </Grid>

                  {/* <Grid item xs={12} sm={12} lg={12}>
                     <FormControl component="fieldset">
                        <Typography variant="h6" color="initial" sx={{ fontSize: "1.1rem", fontStyle: "bold" }}>{t("text.DisplayOrder")}</Typography>
                        <RadioGroup
                           row
                           // value={formik.values.status}
                           onChange={(event) => {

                           }}
                        >
                           <FormControlLabel value="DataWise" control={<Radio />} label={t("text.DataWise")} />
                           <FormControlLabel value="EmployeeWise" control={<Radio />} label={t("text.EmployeeWise")} />
                           <FormControlLabel value="ProductWise" control={<Radio />} label={t("text.ProductWise")} />
                        </RadioGroup>
                     </FormControl>
                  </Grid> */}



                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Button
                        type="submit"
                        fullWidth
                        style={{
                           backgroundColor: `var(--header-background)`,
                           color: "white",
                           marginTop: "10px",
                        }}
                        onClick={() => {
                           formik.handleSubmit()
                        }}
                        startIcon={<VisibilityIcon />}
                     >
                        {t("text.show")}

                     </Button>
                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
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
                           setReportType("both");
                        }}
                     >
                        {t("text.reset")}

                     </Button>
                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
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
               </Grid>
            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}
