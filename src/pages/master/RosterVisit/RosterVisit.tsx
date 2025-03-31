import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
   Autocomplete,
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import {
   DataGrid,
   GridColDef,
   GridToolbar,
} from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { Language } from "react-transliterate";
import TranslateTextField from "../../../TranslateTextField";
import CustomLabel from "../../../CustomLable";
import { json } from "stream/consumers";
import * as Yup from "yup";
import { setInterval } from "timers/promises";

interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function RosterVisit() {
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [toaster, setToaster] = useState(false);
   const [lang, setLang] = useState<Language>("en");


   const [zoneValue, setZoneValue] = useState("");
   const [zoneOption, setzoneOption] = useState([
      { value: -1, label: t("text.zoneID") },
   ]);

   const [wardValue, setWardValue] = useState("");
   const [wardOption, setWardOption] = useState([
      { value: -1, label: t("text.Ward") },
   ]);

   const [itemValue, setItemValue] = useState("");
   const [itemOption, setItemOption] = useState([
      { value: -1, label: t("text.ItemName") },
   ]);

   const [complain, setComplain] = useState("");
   const [compData, setCompData] = useState([
      { value: -1, label: t("text.Complain"), zone:-1 ,ward:-1},
   ]);

   const [rosterValue, setRosterValue] = useState("");
   const [rosterOption, setRosterOption] = useState([
      { value: -1, label: t("text.SelectRoster") },
   ]);

   useEffect(() => {
      getRosterData();
      getItemData();
      getComplaintData();
      getzoneData();
      getWardData();
      // fetchRosterVisitData();
      const timeoutId = setTimeout(() => {
         fetchRosterVisitData();
      }, 100);
      return () => clearTimeout(timeoutId);
   }, [isLoading]);

   const getzoneData = async () => {
      const collectData = {
         "zoneID": -1,
         "user_ID": "",
      };
      const response = await api.post(`Zone/GetZonemaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["zoneName"],
            value: data[index]["zoneID"],
         });
      }
      setzoneOption(arr);
   };

   const getWardData = async () => {
      const collectData = {
         "areaID": -1
      };
      const response = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["areaName"] + " (" + data[index]["wardNumber"] + ")",
            value: data[index]["wardNumber"],
         });
      }
      setWardOption(arr);
   };

   const getRosterData = async () => {
      const collectData = {
         "rosGroupId": -1
      };
      const response = await api.post(`RosterGroup/GetRosterGroup`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["groupName"],
            value: data[index]["rosGroupId"],
         });
      }
      setRosterOption(arr);
   };

   const getItemData = async () => {
      const collectData = {
         "itemMasterId": -1
      };
      const response = await api.post(`ItemMaster/GetItemMaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["itemName"],
            value: data[index]["itemMasterId"],
         });
      }
      setItemOption(arr);
   };

   const getComplaintData = async () => {
      const collectData = {
         "compId": -1,
         "empId": -1,
         "zoneid": -1,
         "wardid": -1,
         "compTypeId": -1
      };
      const response = await api.post(`ComplaintItem/GetComplaintItem`, collectData);
      const data = response.data.data;
      console.log("getComplaintData", data);
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            value: data[index]["compId"],
            label: data[index]["complaint"],
            zone: data[index]["zoneid"],
            ward: data[index]["wardid"]
         });
      }
      setCompData(arr);
   }

   const formik = useFormik({
      initialValues: {
         "visitId": -1,
         "visitNo": null,
         "zone": null,
         "ward": null,
         "rosterGroupId": null,
         "visitDate": "",
         "complainId": null,
         "itemId": null,
         "itemNo": "",
         "itemStatus": "",
         "warranty": "",
         "description": ""
      },

      validationSchema: Yup.object({
         visitNo: Yup.string()
            .required(t("text.reqVisitNum")),
         visitDate: Yup.string()
            .required(t("text.reqVisitDate")),
         itemStatus: Yup.string()
            .required(t("text.reqItemStatus")),
         warranty: Yup.string()
            .required(t("text.reqWarranty")),
         rosterGroupId: Yup.string()
            .required(t("text.reqRosterGroup")),
         complainId: Yup.string()
            .required(t("text.reqComplain")),
         itemId: Yup.string()
            .required(t("text.reqItemName")),
         itemNo: Yup.string()
            .required(t("text.reqItemNum")),
      }),

      onSubmit: async (values) => {
         const response = await api.post(`RosterVisit/AddUpdateRosterVisit`, values);
         if (response.data.isSuccess) {
            formik.resetForm();
            formik.setFieldValue("visitNo", "");
            // formik.setFieldValue("zone", 0);
            // formik.setFieldValue("ward", 0);
            // formik.setFieldValue("rosterGroupId", 0);
            // formik.setFieldValue("visitDate", "");
            // formik.setFieldValue("complainId", 0);
            // formik.setFieldValue("itemId", 0);
            // formik.setFieldValue("itemNo", "");
            // formik.setFieldValue("itemStatus", "");
            // formik.setFieldValue("warranty", "");
            // formik.setFieldValue("description", "");
            setZoneValue("");
            setWardValue("");
            setRosterValue("");
            setItemValue("");
            setComplain("");
            setToaster(false);
            toast.success(response.data.mesg);
         } else {
            setToaster(true);
            toast.error(response.data.mesg);
         }
         fetchRosterVisitData();
      },
   });

   const handleEdit = (row: any) => {
      console.log(row)
      formik.setFieldValue("visitId", row.visitId);
      formik.setFieldValue("visitNo", parseInt(row.visitNo));
      formik.setFieldValue("zone", row.zone);
      formik.setFieldValue("ward", row.ward);
      formik.setFieldValue("rosterGroupId", row.rosterGroupId);
      formik.setFieldValue("visitDate", row.visitDate);
      formik.setFieldValue("complainId", row.complainId);
      formik.setFieldValue("itemId", row.itemId);
      formik.setFieldValue("itemNo", row.itemNo);
      formik.setFieldValue("itemStatus", row.itemStatus);
      formik.setFieldValue("warranty", row.warranty);
      formik.setFieldValue("description", row.description);
      zoneOption.map((item) => {
         if (item.value === row.zone) {
            setZoneValue(item.label);
         }
      })
      wardOption.map((item) => {
         if (item.value == row.ward) {
            setWardValue(item.label)
         }
      })
      rosterOption.map((item) => {
         if (item.value === row.rosterGroupId) {
            setRosterValue(item.label);
         }
      })
      itemOption.map((item) => {
         if (item.value === row.itemId) {
            setItemValue(item.label);
         }
      })
      compData.map((item) => {
         if (item.value === row.complainId) {
            setComplain(item.label);
         }
      })
   }

   function formatDate(dateString: string) {
      const timestamp = Date.parse(dateString);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
   }

   let delete_id = "";
   const accept = () => {
      const collectData = {
         "visitId": parseInt(delete_id)
      };
      console.log("collectData " + JSON.stringify(collectData));
      api
         .delete(`RosterVisit/DeleteRosterVisit`, { data: collectData })
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.mesg);
            } else {
               toast.error(response.data.mesg);
            }
            fetchRosterVisitData();
         });
   };

   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (del_id: any) => {
      delete_id = del_id;
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
   };


   const fetchRosterVisitData = async () => {
      try {
         const collectData = {
            "visitId": -1,
            "rosterGroupId": -1,
            "complainId": -1,
            "itemId": -1
         };
         const response = await api.post(`RosterVisit/GetRosterVisit`, collectData);
         const data = response.data.data;
         console.log("🚀 ~ fetchRosterVisitData ~ response.data.data:", response.data.data)
         const arr = data.map((item: any, index: any) => ({
            serialNo: index + 1,
            id: item.visitId,
            visitId: item.visitId,
            visitNo: item.visitNo,
            zone: item.zone,
            ward: item.ward,
            rosterGroupId: item.rosterGroupId,
            visitDate: formatDate(item.visitDate),
            complainId: item.complainId,
            itemId: item.itemId,
            itemNo: item.itemNo,
            itemStatus: item.itemStatus,
            warranty: formatDate(item.warranty),
            description: item.description,
            zoneName: zoneOption[zoneOption.findIndex(i => i.value === item.zone)]?.label,
            itemName: itemOption[itemOption.findIndex(i => i.value === item.itemId)]?.label,
            roster: rosterOption[rosterOption.findIndex(i => i.value === item.rosterGroupId)]?.label,
            complain: compData[compData.findIndex(i => i.value === item.complainId)]?.label
         }));
         setItem(arr);
         setIsLoading(false);

         if (data.length > 0) {
            const columns: GridColDef[] = [
               {
                  field: "actions",
                  headerClassName: "MuiDataGrid-colCell",
                  headerName: t("text.Action"),
                  width: 80,

                  renderCell: (params) => {
                     return [
                        <Stack
                           spacing={1}
                           direction="row"
                           sx={{ alignItems: "center", marginTop: "5px" }}
                        >
                           {/* {permissionData?.isEdit ? ( */}
                           <EditIcon
                              style={{
                                 fontSize: "20px",
                                 color: "blue",
                                 cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => handleEdit(params.row)}
                           />
                           <DeleteIcon
                              style={{
                                 fontSize: "20px",
                                 color: "red",
                                 cursor: "pointer",
                              }}
                              onClick={() => {
                                 handledeleteClick(params.row.id);
                              }}
                           />
                        </Stack>,
                     ];
                  },
               },

               {
                  field: "visitNo",
                  headerName: t("text.VisitNumber"),
                  flex: 0.7,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "visitDate",
                  headerName: t("text.VisitDate"),
                  flex: 0.9,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "zoneName",
                  headerName: t("text.Zone"),
                  flex: 0.6,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "ward",
                  headerName: t("text.WardNo"),
                  flex: 0.7,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "roster",
                  headerName: t("text.Roster"),
                  flex: 0.6,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "itemNo",
                  headerName: t("text.ItemNumber"),
                  flex: 0.6,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "itemName",
                  headerName: t("text.ItemName"),
                  flex: 0.9,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "itemStatus",
                  headerName: t("text.ItemStatus"),
                  flex: 0.8,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "complain",
                  headerName: t("text.Complain"),
                  flex: 0.8,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "warranty",
                  headerName: t("text.Warranty"),
                  flex: 0.8,
                  headerClassName: "MuiDataGrid-colCell",
               },
               {
                  field: "description",
                  headerName: t("text.Description"),
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


   return (
      <>
         <Card
            style={{
               width: "100%",
               // height: "100%",
               backgroundColor: "#E9FDEE",
               border: ".5px solid #FF7722 ",
               marginTop: "3vh"
            }}
         >
            <Paper
               sx={{
                  width: "100%",
                  overflow: "hidden",
                  "& .MuiDataGrid-colCell": {
                     backgroundColor: `var(--grid-headerBackground)`,
                     color: `var(--grid-headerColor)`,
                     fontSize: 17,
                     fontWeight: 900
                  },
               }}
               style={{ padding: "10px", }}
            >
               <ConfirmDialog />

               <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
               >
                  {t("text.RosterVisit")}
               </Typography>
               <Divider />

               <Box height={10} />

               <form onSubmit={formik.handleSubmit}>
                  {toaster === false ? "" : <ToastApp />}
                  <Grid item xs={12} container spacing={2}>

                     {/* complain */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={compData}
                           value={complain}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue);
                              formik.setFieldValue("complainId", newValue?.value);
                              formik.setFieldValue("zone",parseInt(newValue?.zone));
                              formik.setFieldValue("ward",parseInt(newValue?.ward));
                              setComplain(newValue.label);
                              zoneOption.map((item) => {
                                 if (item.value === parseInt(newValue?.zone)) {
                                    setZoneValue(item.label);
                                 }
                              });
                              console.log("value",newValue)
                              wardOption.map((item) => {
                                 if (item.value == newValue?.ward) {
                                    setWardValue(item.label)
                                 }
                              })
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectComplain")} required={true} />}
                                 name="complainId"
                                 id="complainId"
                                 placeholder={t("text.SelectComplain")}
                              />
                           )}
                        />
                        {formik.touched.complainId && formik.errors.complainId ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.complainId}
                           </div>
                        ) : null}
                     </Grid>

                     {/* zone */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           disabled={true}
                           id="combo-box-demo"
                           options={zoneOption}
                           value={zoneValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("zone", newValue?.value);
                              setZoneValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.EnterZone")} />}
                                 name="zone"
                                 id="zone"
                                 placeholder={t("text.EnterZone")}
                              />
                           )}
                        />
                        {/* {formik.touched.zone && formik.errors.zone ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.zone}
                           </div>
                        ) : null} */}
                     </Grid>

                     {/* ward */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           disabled={true}
                           id="combo-box-demo"
                           options={wardOption}
                           value={wardValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("ward", parseInt(newValue?.value));
                              setWardValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectWard")} />}
                                 name="ward"
                                 id="ward"
                                 placeholder={t("text.SelectWard")}
                              />
                           )}
                        />
                        {/* {formik.touched.ward && formik.errors.ward ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.ward}
                           </div>
                        ) : null} */}
                     </Grid>

                     {/* visitnumber */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VisitNumber")}
                                 required={true}
                              />
                           }
                           value={formik.values.visitNo}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="visitNo"
                           id="visitNo"
                           placeholder={t("text.VisitNumber")}
                           onChange={(e: any) => {
                              formik.setFieldValue("visitNo", e.target.value ? parseInt(e.target.value) : "");
                              formik.handleChange(e);
                           }}
                           InputLabelProps={{ shrink: true }}
                        />
                        {formik.touched.visitNo && formik.errors.visitNo ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.visitNo}
                           </div>
                        ) : null}
                     </Grid>

                     {/* visitDate */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.VisitDate")}
                                 required={true}
                              />
                           }
                           type="date"
                           value={formik.values.visitDate}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="visitDate"
                           id="visitDate"
                           placeholder={t("text.VisitDate")}
                           onChange={formik.handleChange}
                           InputLabelProps={{ shrink: true }}
                        />
                        {formik.touched.visitDate && formik.errors.visitDate ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.visitDate}
                           </div>
                        ) : null}
                     </Grid>

                     {/* roster */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={rosterOption}
                           value={rosterValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("rosterGroupId", newValue?.value);
                              setRosterValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.SelectRoster")} required={true} />}
                                 name="rosterGroupId"
                                 id="rosterGroupId"
                                 placeholder={t("text.SelectRoster")}
                              />
                           )}
                        />
                        {formik.touched.rosterGroupId && formik.errors.rosterGroupId ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.rosterGroupId}
                           </div>
                        ) : null}
                     </Grid>

                     {/* item name */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={itemOption}
                           value={itemValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("itemId", newValue?.value);
                              setItemValue(newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.ItemName")} required={true} />}
                                 name="itemId"
                                 id="itemId"
                                 placeholder={t("text.ItemName")}
                              />
                           )}
                        />
                        {formik.touched.itemId && formik.errors.itemId ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.itemId}
                           </div>
                        ) : null}
                     </Grid>


                     {/* item number */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.ItemNumber")}
                                 required={true}
                              />
                           }
                           value={formik.values.itemNo}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="itemNo"
                           id="itemNo"
                           placeholder={t("text.ItemNumber")}
                           onChange={formik.handleChange}
                        />
                        {formik.touched.itemNo && formik.errors.itemNo ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.itemNo}
                           </div>
                        ) : null}
                     </Grid>

                     {/* itemstatus */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.ItemStatus")}
                                 required={true}
                              />
                           }
                           value={formik.values.itemStatus}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="itemStatus"
                           id="itemStatus"
                           placeholder={t("text.ItemStatus")}
                           onChange={formik.handleChange}
                        />
                        {formik.touched.itemStatus && formik.errors.itemStatus ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.itemStatus}
                           </div>
                        ) : null}
                     </Grid>


                     {/* warranty */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.WarrantyDate")}
                                 required={true}
                              />
                           }
                           type="date"
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="warranty"
                           id="warranty"
                           value={formik.values.warranty}
                           placeholder={t("text.WarrantyDate")}
                           onChange={formik.handleChange}
                           InputLabelProps={{ shrink: true }}
                        />
                        {formik.touched.warranty && formik.errors.warranty ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.warranty}
                           </div>
                        ) : null}
                     </Grid>

                     {/* desc */}
                     <Grid item xs={12} sm={4} lg={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Description")}
                              />
                           }
                           value={formik.values.description}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="description"
                           id="description"
                           placeholder={t("text.Description")}
                           onChange={formik.handleChange}
                        />
                     </Grid>

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

                     <Grid item lg={6} sm={6} xs={12}>
                        <Button
                           type="reset"
                           fullWidth
                           style={{
                              backgroundColor: "#F43F5E",
                              color: "white",
                              marginTop: "10px",
                           }}
                           onClick={(e: any) => {
                              formik.resetForm();
                              setZoneValue("");
                              setWardValue("");
                              setRosterValue("");
                              setItemValue("");
                              setComplain("");
                              console.log()
                           }}
                        >
                           {t("text.reset")}
                        </Button>
                     </Grid>
                  </Grid>
               </form>

               <DataGrids
                  isLoading={isLoading}
                  rows={item}
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
