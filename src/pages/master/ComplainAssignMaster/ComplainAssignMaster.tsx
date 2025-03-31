import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
   Autocomplete,
   Box,
   Divider,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function ComplainAssignMaster() {
   const { i18n, t } = useTranslation();
   const { defaultValues, defaultValuestime } = getISTDate();
   const [columns, setColumns] = useState<any>([]);
   const [rows, setRows] = useState<any>([]);
   const location = useLocation();
   const [isLoading, setIsLoading] = useState(true);
   const [toaster, setToaster] = useState(false);
   const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

   const [permissionData, setPermissionData] = useState<MenuPermission>({
      isAdd: false,
      isEdit: false,
      isPrint: false,
      isDel: false,
   });
   const [lang, setLang] = useState<Language>("en");

   const [empName, setEmpName] = useState("");
   const [complain, setComplain] = useState("");

   const [empData, setEmpData] = useState([
      { empId: -1, label: t("text.EmpName") },
   ]);

   const [compData, setCompData] = useState([
      { value: -1, label: t("text.Complain") },
   ]);


   useEffect(() => {
      getComplaintData();
      getEmpData();
      //getList();
      const timeoutId = setTimeout(() => {
         getList();
      }, 100);
      return () => clearTimeout(timeoutId);
   }, [isLoading]);


   const getEmpData = async () => {
      const collectData = {
         "empid": -1,
         "userId": "",
         "empName": "",
         "empMobileNo": "",
         "empDesignationId": 0,
         "empDeptId": 0,
         "empStateId": 0,
         "empCountryID": 0,
         "empCityId": 0,
         "empPincode": 0,
         "roleId": ""
      };
      const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            empId: data[index]["empid"],
            label: data[index]["empName"],
         });
      }
      setEmpData(arr);
   }

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
         });
      }
      setCompData(arr);
   }



   let delete_id = "";
   const accept = () => {
      const collectData = {
         "id": delete_id
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`ComplainAssign/DeleteComplainAssign`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.mesg);
            } else {
               toast.success(response.data.mesg);
            }
            getList();
         });
   };
   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (del_id: any) => {
      console.log(del_id + " del_id ");
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

   function formatDate(dateString: string) {
      const timestamp = Date.parse(dateString);
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
   }


   const getList = () => {
      const collectData = {
         "id": -1,
         "complainId": -1,
         "empId": -1
      };
      try {
         api
            .post(`ComplainAssign/GetComplainAssign`, collectData)
            .then((res) => {
               //console.log("result" + JSON.stringify(res.data.data));
               const data = res.data.data;
               const arr = data.map((item: any, index: any) => ({
                  ...item,
                  serialNo: index + 1,
                  id: item.id,
                  complainId: item.complainId,
                  //complainName:item.complainName,
                  complainName: compData[compData.findIndex(i => i.value === item.complainId)]?.label
               }));
               setRows(arr);
               setIsLoading(false);
               if (data.length > 0) {
                  const columns: GridColDef[] = [
                     {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 150,

                        renderCell: (params) => {
                           return [
                              <Stack
                                 spacing={1}
                                 direction="row"
                                 sx={{ alignItems: "center", marginTop: "5px" }}
                              >
                                 <EditIcon
                                    style={{
                                       fontSize: "20px",
                                       color: "blue",
                                       cursor: "pointer",
                                    }}
                                    className="cursor-pointer"
                                    onClick={() => routeChangeEdit(params.row)}
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
                        field: "assignDate",
                        headerName: t("text.ComplainDate"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                     },
                     {
                        field: "empName",
                        headerName: t("text.EmpName"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                     },
                     {
                        field: "complainName",
                        headerName: t("text.Complain"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                     },
                  ];
                  setColumns(columns as any);
               }
            });
         // setIsLoading(false);
      } catch (error) {
         console.error("Error fetching data:", error);
         // setIsLoading(false);
      }
   };


   const formik = useFormik({
      initialValues: {
         "id": 0,
         "assignDate": "",
         "complainId": null,
         "empId": null,
         "createdBy": "",
         "updatedBy": "",
         "createdOn": defaultValuestime,
         "updatedOn": defaultValuestime,
         "complainName": "",
         "empName": ""
      },
      validationSchema: Yup.object({
         assignDate: Yup.string()
            .required(t("text.reqAssignDate")),
         empName: Yup.string()
            .required(t("text.reqEmpName")),
         complainName: Yup.string()
            .required(t("text.reqComplain")),
      }),
      onSubmit: async (values) => {
         const response = await api.post(
            `ComplainAssign/AddUpdateComplainAssign`,
            values
         );
         if (response.data.isSuccess) {
            setToaster(false);
            toast.success(response.data.mesg);
            formik.resetForm();
            setEmpName("");
            setComplain("");
            getList();
         } else {
            setToaster(true);
            toast.error(response.data.mesg);
         }

      },
   });

   const requiredFields = ["departmentName"];


   const routeChangeEdit = (row: any) => {
      //console.log("row", compData.findIndex(i => i.value === row.complainId));
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("assignDate", formatDate(row.assignDate));
      formik.setFieldValue("empId", row.empId);
      formik.setFieldValue("complainId", row.complainId);
      formik.setFieldValue("empName", row.empName);
      formik.setFieldValue("complainName", row.complainName);
      setEmpName(row.empName);
      compData.map((i) => {
         if (i.value === row.complainId) {
            setComplain(i.label);
         }
      })
   };


   const handleSubmitWrapper = async () => {
      await formik.handleSubmit();
   };

   const handleConversionChange = (params: any, text: string) => {
      formik.setFieldValue(params, text);
   };


   return (
      <>
         <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
            <Card
               style={{
                  width: "100%",
                  height: "50%",
                  backgroundColor: "#E9FDEE",
                  border: ".5px solid #2B4593 ",
                  marginTop: "5px",
               }}
            >
               <Paper
                  sx={{
                     width: "100%",
                     overflow: "hidden"
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
                           {t("text.AssignComplain")}
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

                  <form onSubmit={formik.handleSubmit}>
                     <Grid item xs={12} container spacing={2}>
                        <Grid item md={3.3} sm={3.3} xs={12}>
                           <TextField
                              label={
                                 <CustomLabel
                                    text={t("text.ComplainDate")}
                                    required={true}
                                 />
                              }
                              type="date"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name="assignDate"
                              id="assignDate"
                              value={formik.values.assignDate}
                              placeholder={t("text.ComplainDate")}
                              onChange={formik.handleChange}
                              InputLabelProps={{ shrink: true }}
                           />
                           {formik.touched.assignDate && formik.errors.assignDate ? (
                              <div style={{ color: "red", margin: "5px" }}>
                                 {formik.errors.assignDate}
                              </div>
                           ) : null}
                        </Grid>
                        <Grid item md={3.3} sm={3.3} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={empData}
                              value={empName}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue);
                                 formik.setFieldValue("empName", newValue?.label);
                                 formik.setFieldValue("empId", newValue?.empId);
                                 setEmpName(newValue?.label);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.EmpName")} required={true} />}
                                    name="empName"
                                    id="empName"
                                    placeholder={t("text.EmpName")}
                                    error={formik.touched.empName && Boolean(formik.errors.empName)}
                                 />
                              )}
                           />
                           {formik.touched.empName && formik.errors.empName ? (
                              <div style={{ color: "red", margin: "5px" }}>
                                 {formik.errors.empName}
                              </div>
                           ) : null}
                        </Grid>

                        <Grid item md={3.4} sm={3.4} xs={12}>
                           <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={compData}
                              value={complain}
                              fullWidth
                              size="small"
                              onChange={(event: any, newValue: any) => {
                                 console.log(newValue);
                                 formik.setFieldValue("complainName", newValue?.label.toString());
                                 formik.setFieldValue("complainId", parseInt(newValue?.value));
                                 setComplain(newValue.label);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.SelectComplain")} required={true} />}
                                    name="complainName"
                                    id="complainName"
                                    placeholder={t("text.SelectComplain")}
                                 />
                              )}
                           />
                           {formik.touched.complainName && formik.errors.complainName ? (
                              <div style={{ color: "red", margin: "5px" }}>
                                 {formik.errors.complainName}
                              </div>
                           ) : null}
                        </Grid>

                        <Grid item xs={2} sx={{ m: -1 }}>
                           <ButtonWithLoader
                              buttonText={t("text.save")}
                              onClickHandler={handleSubmitWrapper}
                              fullWidth={true}
                           />
                        </Grid>
                     </Grid>
                  </form>
                  {/* </Grid> */}
                  <Typography
                     variant="h6"
                     component="div"
                     sx={{ flexGrow: 1 }}
                  ></Typography>
                  {/* </Stack> */}
                  {isLoading ? (
                     <div
                        style={{
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                        }}
                     >
                        <CircularProgress />
                     </div>
                  ) : (
                     <CustomDataGrid
                        isLoading={isLoading}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialPageSize={5}
                     />
                  )}
               </Paper>
            </Card>
         </Grid >
         <ToastApp />
      </>
   );
}
