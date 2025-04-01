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
   FormGroup,
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
import { saveAs } from "file-saver";
import { getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function AssetDynamicReport() {
   const { defaultValues } = getISTDate();
   const location = useLocation();
   const [zones, setZones] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [visible, setVisible] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const { t } = useTranslation();

   const [zoneOption, setZoneOption] = useState([
      { value: -1, label: t("text.SelectZone") },
   ]);
   const [wardOption, setWardOption] = useState([
      { value: -1, label: t("text.SelectWard") },
   ]);
   const [deptOption, setDeptOption] = useState([
      { value: -1, label: t("text.SelectDept") },
   ]);
   const [assetTypeOptions, setAssetTypeOptions] = useState([]);


   const [assetOption, setAssetOption] = useState<any>([]);

   const [checkedItems, setCheckedItems] = useState({
      resourceDetail: false,
      generalInfo: false,
      purchaseDetail: false,
      utilizationLog: false,
      breakDown: false,
      maintenance: false,
      status: false,
      location: false,
      licensing: false,
   });

   const [resourceDetail, setResourceDetail] = useState<any>([]);
   const [generalInfo, setGeneralInfo] = useState<any>([]);
   const [purchaseDetail, setPurchaseDetail] = useState<any>([]);
   const [utilizationLog, setUtilizationLog] = useState<any>([]);
   const [breakDown, setBreakDown] = useState<any>([]);
   const [maintenanceWarranty, setMaintenanceWarranty] = useState<any>([]);
   const [status, setStatus] = useState<any>([]);
   const [assetLocation, setAssetLocation] = useState<any>([]);
   const [licensing, setLicensing] = useState<any>([]);

   const formik = useFormik({
      initialValues: {

      },
      onSubmit: async (values) => {
         // API call or other logic
      },
   });

   const handleShowData = async () => {
      if (checkedItems.resourceDetail) {
         setZones(resourceDetail);
         const columns: GridColDef[] = [
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
            {
               field: "ResourceType",
               headerName: t("text.AssetType"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            }

         ];
         setColumns(columns as any);
      }
      if (checkedItems.generalInfo) {
         setZones(generalInfo)
         const columns: GridColDef[] = [
            {
               field: "UndrProcession",
               headerName: t("text.UnderPossessionOf"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },


            {
               field: "AdministrdBy",
               headerName: t("text.AdministeredBy"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

            {
               field: "Capacity",
               headerName: t("text.Capacity"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
         ];
         setColumns(columns as any);
      }
      if (checkedItems.purchaseDetail) {
         setZones(purchaseDetail);
         const columns: GridColDef[] = [
            {
               field: "BillNo",
               headerName: t("text.BillNo"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "Date",
               headerName: t("text.Date"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

            {
               field: "Amount",
               headerName: t("text.Amount"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "DepValue",
               headerName: t("text.DepreciatedValue"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "Manufacture",
               headerName: t("text.Manufacturer"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "Supplier",
               headerName: t("text.Supplier"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
         ];
         setColumns(columns as any);

      }
      if (checkedItems.utilizationLog) {
         setZones(utilizationLog);
         const columns: GridColDef[] = [
            {
               field: "UserName",
               headerName: t("text.UserName"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "UserType",
               headerName: t("text.UserType"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "FromDate",
               headerName: t("text.fromDate"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "FTime",
               headerName: t("text.fromTime"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "ToDate",
               headerName: t("text.toDate"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "TTime",
               headerName: t("text.toTime"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            }
         ];
         setColumns(columns as any);

      }
      if (checkedItems.breakDown) {
         setZones(breakDown);
         const columns: GridColDef[] = [
            {
               field: "Name",
               headerName: t("text.Name"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },


            {
               field: "BreakDownDate",
               headerName: t("text.Date"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

            {
               field: "ReportedBy",
               headerName: t("text.ReportedBy"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "BreakDownRemark",
               headerName: t("text.RemarkName"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

         ];
         setColumns(columns as any);
      }
      if (checkedItems.maintenance) {
         setZones(maintenanceWarranty);
         const columns: GridColDef[] = [
            {
               field: "MaintenanceDate",
               headerName: t("text.Date"),
               flex: .8,
               headerClassName: "MuiDataGrid-colCell",
            },

            {
               field: "Warrenty",
               headerName: t("text.WarrantyAMC"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",

            },
            {
               field: "WarrentyValue",
               headerName: t("text.Value"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "WarrentyRemark",
               headerName: t("text.Remark"),
               flex: .9,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "VenderName",
               headerName: t("text.VendorName"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

         ];
         setColumns(columns as any);

      }
      if (checkedItems.status) {
         setZones(status);
         const columns: GridColDef[] = [
            { field: "StatusDate", headerName: t("text.Date"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
            { field: "AssetCode", headerName: t("text.AssetCode"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
            { field: "StatusRemark", headerName: t("text.Remark"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
            { field: "name", headerName: t("text.Name"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
            { field: "reportedby", headerName: t("text.ReportedBy"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
            { field: "Status", headerName: t("text.Status"), flex: 1, headerClassName: "MuiDataGrid-colCell", },
         ];
         setColumns(columns as any);
      }
      if (checkedItems.location) {
         setZones(assetLocation);

         const columns: GridColDef[] = [
            {
               field: "Asset_Id",
               headerName: t("text.AssetCode"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },

            {
               field: "Description",
               headerName: t("text.Description"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
         ];
         setColumns(columns as any);

      }
      if (checkedItems.licensing) {
         setZones(licensing);
         const columns: GridColDef[] = [
            {
               field: "VenderName",
               headerName: t("text.VendorName"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",

            },

            {
               field: "Fdate",
               headerName: t("text.fromDate"),
               flex: .8,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "Tdate",
               headerName: t("text.toDate"),
               flex: .8,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "Licensing_Insurance",
               headerName: t("text.Type"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",

            },
            {
               field: "PremiumAmount",
               headerName: t("text.LicensingPremiumAmount"),
               flex: .6,
               headerClassName: "MuiDataGrid-colCell",
            },
         ];
         setColumns(columns as any);

      }
   };
   const handleDownload = async () => {
      if (checkedItems.resourceDetail) {
         exportToExcel(resourceDetail, 'ResourceDetails.xlsx', 'ResourceDetails');
      }
      if (checkedItems.generalInfo) {
         exportToExcel(generalInfo, 'GeneralInformation.xlsx', 'GeneralInformation');
      }
      if (checkedItems.purchaseDetail) {
         exportToExcel(purchaseDetail, 'PurchaseDetail.xlsx', 'PurchaseDetail');
      }
      if (checkedItems.utilizationLog) {
         exportToExcel(utilizationLog, 'UtilizationLog.xlsx', 'UtilizationLog');
      }
      if (checkedItems.breakDown) {
         exportToExcel(breakDown, 'BreakDown.xlsx', 'BreakDown');
      }
      if (checkedItems.maintenance) {
         exportToExcel(maintenanceWarranty, 'MaintenanceWarranty.xlsx', 'MaintenanceWarranty');
      }
      if (checkedItems.status) {
         exportToExcel(status, 'Status.xlsx', 'status');
      }
      if (checkedItems.location) {
         exportToExcel(assetLocation, 'AssetLocation.xlsx', 'AssetLocation');
      }
      if (checkedItems.licensing) {
         exportToExcel(licensing, 'Licensing.xlsx', 'Licensing');
      }
   };
   let navigate = useNavigate();

   useEffect(() => {
      getResourceDetail();
      getGeneralInfo();
      getLicensing();
      getAssetLocation();
      getStatus();
      getMaintenanceWarranty();
      getBreakDown();
      getUtilizationLog();
      getPurchaseDetail();

      getAssetData();
      getZoneData();
      getDeptData();
      getWardData();
      fetchAssetTypes();

      // fetchZonesData();
   }, []);


   const getResourceDetail = async () => {
      const collectData = {
         "Type": 4
      }
      const response = await api.post("ResourceDetail", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.ID,
      }));
      console.log("#####", JSON.stringify(arr));
      setResourceDetail(arr);
   }

   const getGeneralInfo = async () => {
      const collectData = {
         "UserMannualFileContent": "any",
         "MaintenanceFileContent": "any",
         "Type": 4
      }
      const response = await api.post("manageResourceDeGeneralInfo", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.Gen_ID,
      }));
      console.log("#####", JSON.stringify(arr));
      setGeneralInfo(arr);

   }

   const getPurchaseDetail = async () => {
      const collectData = {
         "Type": 4,
         "PurchaseDetailContent": "any",
      }
      const response = await api.post("PurchaseDetail", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.Prchase_ID,
         Date: formatDate(item.Date),
         depon: formatDate(item.depon),
      }));
      console.log("#####", JSON.stringify(arr));
      setPurchaseDetail(arr);
   }

   const getUtilizationLog = async () => {
      const collectData = {
         "Type": 4
      }
      const response = await api.post("manageUtilizationlog", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.UL_ID,
         FromDate: dayjs(item.FromDate).format("YYYY-MM-DD"),
         ToDate: dayjs(item.ToDate).format("YYYY-MM-DD")
      }));
      console.log("#####", JSON.stringify(arr));
      setUtilizationLog(arr);
   }

   const getBreakDown = async () => {
      const collectData = {
         "Type": 4
      }
      const response = await api.post("manageBreakDown", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.BD_ID,
         BreakDownDate: item.BreakDownDate?.split("T")[0] || "", // handle empty case
         ReportedBy: item.ReportedBy,
         BreakDownRemark: item.BreakDownRemark,
         Name: item.Name,
         inst_id: item.inst_id,
         sid: item.sid,
         resid: item.resid,
      }));
      console.log("###breakdown", JSON.stringify(arr));
      setBreakDown(arr);


   }

   const getMaintenanceWarranty = async () => {
      const collectData = {
         "FileContent": "any",
         "Type": 4
      }
      const response = await api.post("MaintenanceWarrenty", collectData);
      const data = response.data.data;
      const arr = data.map((Item: any) => ({
         ...Item,
         id: Item.MW_ID,
         WarrentyTDate: formatDate(Item.WarrentyTDate),
         WarrentyFDate: formatDate(Item.WarrentyFDate),
         MaintenanceDate: formatDate(Item.MaintenanceDate),
      }));
      console.log("#####", JSON.stringify(arr));
      setMaintenanceWarranty(arr);
   }

   const getStatus = async () => {
      const collectData = {
         "Type": 4
      }
      const response = await api.post("manageStatus", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.Status_ID,
         StatusDate: formatDate(item.StatusDate)
      }));
      console.log("#####", JSON.stringify(arr));
      setStatus(arr);

   }

   const getAssetLocation = async () => {
      const collectData = {
         "Type": 4
      }
      const response = await api.post("AssetLocation", collectData);
      const data = response.data.data;
      const arr = data.map((item: any) => ({
         ...item,
         id: item.Id,
      }));
      console.log("#####", JSON.stringify(arr));
      setAssetLocation(arr);

   }

   const getLicensing = async () => {
      const collectData = {
         "Type": 4,
         "FileContent": "any"
      }
      const response = await api.post("Licensing_insuring", collectData);
      const data = response.data.data;
      const arr = data.map((Item: any) => ({
         ...Item,
         id: Item.LI_ID,
         Fdate: formatDate(Item.Fdate),
         Tdate: formatDate(Item.Tdate),
         PremiumDate: formatDate(Item.PremiumDate),
      }));
      console.log("#####", JSON.stringify(arr));
      setLicensing(arr);

   }

   const exportToExcel = (data: any, fileName = "ResourceDetails.xlsx", sheetName: string = 'sheet') => {
      // Convert JSON to Worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a Workbook and Append the Worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Convert to Excel File and Create Blob
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

      // Trigger File Download
      saveAs(blob, fileName);
   };

   function formatDate(dateString: string) {
      const timestamp = Date.parse(dateString);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
   }


   const getAssetData = async () => {
      try {
         const response = await api.post(`ResourceDetail`, { Type: 4 });
         const data = response?.data?.data;
         const arr = data.map((item: any) => ({
            ...item,
            value: item.ID,
            label: `${item.ResourceCode} - ${item.ResourceName}`,
         }));
         setAssetOption(arr);
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   }


   const getZoneData = () => {
      const collectData = {
         "ZoneID": -1,
         "ZoneName": "",
         "ZoneAbbrevation": "",
         "CreatedBy": "",
         "UpdatedBy": "",
         "CreatedOn": "08-03-2024",
         "UpdatedOn": "08-03-2024",
         "inst_id": 0,
         "Type": 4
      };
      api.post(`zone`, collectData).then((res) => {
         const arr: { label: string; value: number }[] = [];
         //console.log("result" + JSON.stringify(res.data.data));
         for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
               label: res.data.data[index]["ZoneName"],
               value: res.data.data[index]["ZoneID"],
            });
         }
         setZoneOption(arr);
      });
   }

   const getDeptData = () => {
      const collectData = {
         "type": 4
      };
      api.post(`department`, collectData).then((res) => {
         const arr: { label: string; value: number }[] = [];
         //console.log("result" + JSON.stringify(res.data.data));
         for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
               label: res.data.data[index]["dept_name"],
               value: res.data.data[index]["dept_id"],
            });
         }
         setDeptOption(arr);
      });
   }

   const getWardData = () => {
      const collectData = {
         "Type": 4
      };
      api.post(`ward`, collectData).then((res) => {
         const arr: { label: string; value: number }[] = [];
         //console.log("result" + JSON.stringify(res.data.data));
         for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
               label: res.data.data[index]["WardName"],
               value: res.data.data[index]["WardNo"],
            });
         }
         setWardOption(arr);
      });
   }

   const fetchAssetTypes = async () => {
      try {
         const response = await api.post("ResourceType", {
            "ID": -1,
            "ResType": "",
            "ResCode": "",
            "inst_id": "",
            "user_id": "",
            "ses_id": "",
            "divisionId": "",
            "ParentId": "",
            "Type": 4
         });

         if (response.data.success && response.data.data.length > 0) {
            const assetMap = new Map();
            const assetList = response.data.data.map((item: any) => {
               assetMap.set(item.ID, item.ResType); // ✅ Map AssetType ID → ResourceType
               return { label: item.ResType, value: item.ID, ResourceTypeCode: item.ResCode };
            });

            setAssetTypeOptions(assetList);

            console.log("Asset Type Map:", assetMap); // ✅ Debugging log
         } else {
            toast.warn("No asset types available.");
            setAssetTypeOptions([]);
         }
      } catch (error) {
         console.error("Error fetching asset types:", error);
         toast.error("Failed to load asset types.");
      }
   };




   let currentDate = new Date();

   currentDate.setDate(currentDate.getDate() - 1);

   let previousDate = currentDate.toISOString();


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



   const handleChange = (event: any) => {
      setCheckedItems({
         ...checkedItems,
         [event.target.name]: event.target.checked,
      });
   };

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
                  {t("text.AssetDynamicReport")}
               </Typography>
               <Divider />

               <Box height={10} />

               <Grid item xs={12} container spacing={2}>
                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assetOption}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.AssetCode")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.AssetCode")}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assetOption}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


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
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assetTypeOptions}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


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

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={deptOption}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.Department")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.Department")}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={zoneOption}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.Zone")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.Zone")}
                           />
                        )}
                     />

                  </Grid>

                  <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={wardOption}

                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log(newValue?.value);


                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.Ward")} required={false} />}
                              name=""
                              id=""
                              placeholder={t("text.Ward")}
                           />
                        )}
                     />

                  </Grid>

                  {/* <Grid item lg={4} md={4} sm={4} xs={12}>
                     <Autocomplete
                        multiple
                        id="multi-select-demo"
                        options={[{ label: "Option 1", value: 1 }, { label: "Option 2", value: 2 }, { label: "Option 3", value: 3 }]}
                        getOptionLabel={(option) => option.label}
                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                           console.log("Selected Values:", newValue.map((item: any) => item.value));
                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label={<CustomLabel text={t("text.Page")} required={false} />}
                              placeholder={t("text.Page")}
                           />
                        )}
                     />

                  </Grid> */}


                  <Grid item lg={12} md={12} sm={12} xs={12}>
                     <FormGroup>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.resourceDetail} onChange={handleChange} name="resourceDetail" />}
                              label="Resource Detail"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.generalInfo} onChange={handleChange} name="generalInfo" />}
                              label="General Information"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.purchaseDetail} onChange={handleChange} name="purchaseDetail" />}
                              label="Purchase Detail"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.utilizationLog} onChange={handleChange} name="utilizationLog" />}
                              label="Utilization Log"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.breakDown} onChange={handleChange} name="breakDown" />}
                              label="Break Down"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.maintenance} onChange={handleChange} name="maintenance" />}
                              label="Maintenance / Warranty"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.status} onChange={handleChange} name="status" />}
                              label="Status"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.location} onChange={handleChange} name="location" />}
                              label="Location"
                           />
                           <FormControlLabel
                              control={<Checkbox checked={checkedItems.licensing} onChange={handleChange} name="licensing" />}
                              label="Licensing / Insurance"
                           />
                        </Stack>
                     </FormGroup>
                  </Grid>




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
                           handleShowData();
                           setVisible(true);
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
                           setVisible(false);

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
                  {visible && (
                     <Grid item xs={12} sm={12} lg={12}>
                        {/* {isLoading ? (
                           <div className="loader-container">
                              <div className="steering-wheel"></div> 
                           </div>
                        ) : ( */}
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
                        {/* )} */}
                     </Grid>
                  )}
               </Grid>
            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}
