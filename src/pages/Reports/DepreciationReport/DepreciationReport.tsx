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


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function DepreciationReport() {
   const { defaultValues } = getISTDate();
   const location = useLocation();
   const [zones, setZones] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);

   const [assetTypeOptions, setAssetTypeOptions] = useState<any>([]);


   const [isPrint, setPrint] = useState([]);

   const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");



   const formik = useFormik({
      initialValues: {
         assetType: "",
         DepriciationRate: ""
      },
      onSubmit: async (values) => {
         fetchZonesData(values.assetType);
         console.log("#####",values)
      },
   });

   const handleDownload = async () => {
      console.log("#####", JSON.stringify(zones));
      const printWindow = window.open("", "_blank");
      const content = `
      <html>
        <head>
          <title>Depreciation Report</title>
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
          <h2>Depreciation Report</h2>
          <table>
            <thead>
              <tr>
                <th>Asset Type</th>
                <th>Asset Type Code</th>
                <th>Depreciation Rate(%)</th>
                <th>Asset Name</th>
                <th>Asset Code</th>
              </tr>
            </thead>
            <tbody>
              ${zones
            .map(
               (row: any) => `
                  <tr>
                    <td>${row.ResourceType}</td>
                    <td>${row.ResourceTypeCode || ""}</td>
                    <td>${row.DepriciationRate || 0}%</td>
                    <td>${row.ResourceName}</td>
                    <td>${row.ResourceCode}</td>
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

   useEffect(() => {
      fetchAssetTypes();
      fetchZonesData("");
   }, []);



   const fetchAssetTypes = async () => {
      try {
         const response = await api.post("ResourceType", {
            "Type": 4
         });

         const data = response.data.data.map((item: any) => {
            return {
               value: item.ID,
               label: item.ResType
            }
         })

         setAssetTypeOptions(data);
      } catch (error) {
         console.error("Error fetching asset types:", error);
         toast.error("Failed to load asset types.");
      }
   };





   let currentDate = new Date();

   currentDate.setDate(currentDate.getDate() - 1);

   let previousDate = currentDate.toISOString();

   const fetchZonesData = async (filterAssetType: string) => {
      try {
         const collectData = {
            "Type": 4
         };
         const response = await api.post(`ResourceDetail`, collectData);
         const data = response.data.data;
         const zonesWithIds = data.map((zone: any, index: any) => ({
            ...zone,
            serialNo: index + 1,
            id: zone.ID,
         }));

         if (filterAssetType === "") {
            setZones(zonesWithIds);
         } else {
            const arr: any = zonesWithIds.filter((e: any) => (e.ResourceType.trim() == filterAssetType.trim()));
            setZones(arr);
         }


         if (data.length > 0) {
            const columns: GridColDef[] = [
               // {
               //    field: "serialNo",
               //    headerName: t("text.SrNo"),
               //    flex: .8,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               // {
               //    field: "",
               //    headerName: "",
               //    flex: .3,
               //    headerClassName: "MuiDataGrid-colCell",
               // },
               {
                  field: "ResourceType",
                  headerName: t("text.AssetType"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "ResourceTypeCode",
                  headerName: t("text.AssetTypeCode"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "DepriciationRate",
                  headerName: t("text.DepreciationRate"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "ResourceCode",
                  headerName: t("text.AssetCode"),
                  flex: 1,
                  headerClassName: "MuiDataGrid-colCell",
               },

               {
                  field: "ResourceName",
                  headerName: t("text.AssetName"),
                  flex: 1,
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
                  {t("text.DepreciationReport")}
               </Typography>
               <Divider />

               <Box height={10} />

               <Grid item xs={12} container spacing={2}>

                  <Grid xs={12} md={5} lg={5} item>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assetTypeOptions}
                        value={formik.values.assetType}
                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.label);
                           formik.setFieldValue("assetType", newValue?.label || "");
                           //fetchZonesData(newValue.label);
                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.AssetType")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.AssetType")}
                           />
                        )}
                     />

                  </Grid>

                  <Grid item xs={12} sm={5} lg={5}>
                     <TextField
                        label={
                           <CustomLabel
                              text={t("text.DepreciatedRate")}
                              required={false}
                           />
                        }
                        type="number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="DepreciatedRate"
                        id="DepreciatedRate"
                        placeholder={t("text.DepreciatedRate")}
                        value={formik.values.DepriciationRate}
                        onChange={(e: any) => {
                           formik.setFieldValue("DepriciationRate", parseInt(e.target.value));
                        }}
                     />

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
                           formik.handleSubmit();
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
                  // spacing={2}
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
         </Card >
         <ToastApp />
      </>
   );
}
