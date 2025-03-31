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


const EmployeeMaster = () => {
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

         try {
            if (values.EmpImage_38 == null || values.EmpImage_38 == "") {
               values.EmpImage_38 = "any";
            }
            if (values.empsign == null || values.empsign == "") {
               values.empsign = "any";
            }
            const response = await api.post(
               `EmployeeDetail`,
               values
            );
            if (response.data.success) {
               setToaster(false);
               toast.success(response.data.message);
               formik.resetForm();
               setEditId(-1);
               getEmpData();
               //navigate("/employeeInfo/Employee");
            } else {
               toast.error(response.data.message);
            }
         } catch (error) {
            setToaster(true);
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
         }
      },
   });

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

   let delete_id = "";
   const accept = () => {
      api
         .post(`EmployeeDetail`,
            {
               "Emp_id_1": delete_id,
               "EmpImage_38": "any",
               "empsign": "any",
               "EmployeeThumb": "any",
               "ThumbTemplate": "any",
               "ThumbTemplate2": "any",
               "EmployeeThumb2": "any",
               "ThumbTemplate3": "any",
               "ThumbTemplate4": "any",
               "Type": 5
            }
         )
         .then((response) => {
            if (response.data.success) {
               toast.success(response.data.message);
            } else {
               toast.error(response.data.message);
            }
            getEmpData();
            formik.resetForm();
            setempCodeSearch("");
            setEditId(-1);
         });
   };

   const reject = () => {
      // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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
                        {t("text.EmployeeInfo")}
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
                                    setEditId(-1)
                                    return;
                                 }
                                 console.log(newValue?.value);
                                 handleEditData(newValue.Emp_id);
                                 setempCodeSearch(newValue.label);

                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label={<CustomLabel text={t("text.SearchEmpForEdit")} required={false} />}
                                    name=""
                                    id=""
                                    placeholder={t("text.SearchEmpForEdit")}
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
                              value={countryOption.find((e:any)=>e.value == formik.values.Nationality_25)}
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
                        {/* {editId === -1 && permissionData?.isAdd && ( */}
                        {editId === -1 && (
                           <ButtonWithLoader
                              buttonText={t("text.save")}
                              onClickHandler={handleSubmitWrapper}
                              fullWidth={true}
                           />
                        )}

                        {editId !== -1 && (
                           <ButtonWithLoader
                              buttonText={t("text.update")}
                              onClickHandler={handleSubmitWrapper}
                              fullWidth={true}
                           />
                        )}
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

                     <Grid item lg={4} sm={4} xs={12}>
                        {editId !== -1 && (
                           <Button
                              type="button"
                              fullWidth
                              style={{
                                 backgroundColor: "#F43F5E",
                                 color: "white",
                                 marginTop: "10px",
                              }}
                              onClick={() => {
                                 handledeleteClick(formik.values.Emp_id_1);
                              }}
                           >
                              {t("text.delete")}
                           </Button>
                        )}
                     </Grid>


                     {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                    label={<CustomLabel text={t("text.EmployeeCode")} required={false} />}
                                    name=""
                                    id=""
                                    placeholder={t("text.EmployeeCode")}
                                 />
                              )}
                           />

                        </Grid>
                     </Grid>
                     <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Accordion
                           sx={{
                              border: "1px solid #E0E0E0",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                              borderRadius: "12px",
                              backgroundColor: "#FAFAFA",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": { boxShadow: "0px 6px 14px rgba(0,0,0,0.12)" },
                              "&:before": { display: "none" },
                              "&.Mui-expanded": { margin: "14px 0" }
                           }}
                        >
                           <AccordionSummary
                              expandIcon={<ArrowDropDownIcon sx={{ color: "#1976d2", fontSize: "2rem" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                 backgroundColor: "#fff",
                                 fontWeight: "bold",
                                 fontSize: "1.1rem",
                                 padding: "8px 12px",
                                 borderBottom: "1px solid #E0E0E0",
                                 "&:hover": { backgroundColor: "#F0F0F0" }
                              }}
                           >
                              <Typography component="span">{t("text.PersonalDetails")}</Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{ padding: "20px" }}>
                              <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
                                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}>
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
                                             label={<CustomLabel text={t("text.Title")} required={false} />}
                                             name=""
                                             id=""
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
                                       name="FirstName"
                                       id="FirstName"
                                       //value={formik.values.FirstName}
                                       placeholder={t("text.FirstName")}
                                    //onChange={formik.handleChange}
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
                                       name="MiddleName"
                                       id="MiddleName"
                                       //value={formik.values.MiddleName}
                                       placeholder={t("text.MiddleName")}
                                    //onChange={formik.handleChange}
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
                                       name="LastName"
                                       id="LastName"
                                       //value={formik.values.LastName}
                                       placeholder={t("text.LastName")}
                                    //onChange={formik.handleChange}
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
                                       name="FatherName"
                                       id="FatherName"
                                       //value={formik.values.FatherName}
                                       placeholder={t("text.FatherName")}
                                    //onChange={formik.handleChange}
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
                                       name="MotherName"
                                       id="MotherName"
                                       //value={formik.values.MotherName}
                                       placeholder={t("text.MotherName")}
                                    //onChange={formik.handleChange}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
                                    <Autocomplete
                                       disablePortal
                                       id="combo-box-demo"
                                       options={["Male", "Female"]}

                                       fullWidth
                                       size="small"
                                       onChange={(event: any, newValue: any) => {
                                          console.log(newValue?.value);


                                       }}
                                       renderInput={(params) => (
                                          <TextField
                                             {...params}
                                             label={<CustomLabel text={t("text.Gender")} required={false} />}
                                             name=""
                                             id=""
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
                                       name="DOB"
                                       id="DOB"
                                       //value={formik.values.DOB}
                                       placeholder={t("text.DOB")}
                                       //onChange={formik.handleChange}
                                       InputLabelProps={{ shrink: true }}
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
                                       name="MobileNo"
                                       id="MobileNo"
                                       //value={formik.values.MobileNo}
                                       placeholder={t("text.MobileNo")}
                                    //onChange={formik.handleChange}                                       
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.Nationality")} required={false} />}
                                             name=""
                                             id=""
                                             placeholder={t("text.Nationality")}
                                          />
                                       )}
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
                                       name="EmergencyContactNo"
                                       id="EmergencyContactNo"
                                       //value={formik.values.EmergencyContactNo}
                                       placeholder={t("text.EmergencyContactNo")}
                                    //onChange={formik.handleChange}                                       
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
                                       name="PersonalEmail"
                                       id="PersonalEmail"
                                       //value={formik.values.PersonalEmail}
                                       placeholder={t("text.PersonalEmail")}
                                    //onChange={formik.handleChange}                                       
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                 </Grid>

                              </Grid>
                           </AccordionDetails>
                        </Accordion>
                        <Accordion
                           sx={{
                              border: "1px solid #E0E0E0",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                              borderRadius: "12px",
                              backgroundColor: "#FAFAFA",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": { boxShadow: "0px 6px 14px rgba(0,0,0,0.12)" },
                              "&:before": { display: "none" },
                              "&.Mui-expanded": { margin: "14px 0" }
                           }}
                        >
                           <AccordionSummary
                              expandIcon={<ArrowDropDownIcon sx={{ color: "#1976d2", fontSize: "2rem" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                 backgroundColor: "#fff",
                                 fontWeight: "bold",
                                 fontSize: "1.1rem",
                                 padding: "8px 12px",
                                 borderBottom: "1px solid #E0E0E0",
                                 "&:hover": { backgroundColor: "#F0F0F0" }
                              }}
                           >
                              <Typography component="span">{t("text.CurrentAddress")}</Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{ padding: "20px" }}>
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
                                       name="Address"
                                       id="Address"
                                       //value={formik.values.Address}
                                       placeholder={t("text.Address")}
                                    //onChange={formik.handleChange}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.Country")} required={false} />}
                                             name=""
                                             id=""
                                             placeholder={t("text.Country")}
                                          />
                                       )}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.State")} required={false} />}
                                             name=""
                                             id=""
                                             placeholder={t("text.State")}
                                          />
                                       )}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.City")} required={false} />}
                                             name=""
                                             id=""
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
                                       name="Pincode"
                                       id="Pincode"
                                       //value={formik.values.Pincode}
                                       placeholder={t("text.Pincode")}
                                    //onChange={formik.handleChange}
                                    />
                                 </Grid>
                              </Grid>
                           </AccordionDetails>
                        </Accordion>
                        <Accordion
                           sx={{
                              border: "1px solid #E0E0E0",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                              borderRadius: "12px",
                              backgroundColor: "#FAFAFA",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": { boxShadow: "0px 6px 14px rgba(0,0,0,0.12)" },
                              "&:before": { display: "none" },
                              "&.Mui-expanded": { margin: "14px 0" }
                           }}
                        >
                           <AccordionSummary
                              expandIcon={<ArrowDropDownIcon sx={{ color: "#1976d2", fontSize: "2rem" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                 backgroundColor: "#fff",
                                 fontWeight: "bold",
                                 fontSize: "1.1rem",
                                 padding: "8px 12px",
                                 borderBottom: "1px solid #E0E0E0",
                                 "&:hover": { backgroundColor: "#F0F0F0" }
                              }}
                           >
                              <Typography component="span">{t("text.PermanentAddress")}</Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{ padding: "20px" }}>
                              <Grid item lg={12} md={12} sm={12} xs={12} container spacing={2}>
                                 <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FormControlLabel
                                       label={t("text.sameAsCurrentAddress")}
                                       control={
                                          <Checkbox
                                             value=""
                                             // checked={}
                                             // onChange={}
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
                                       name="Address"
                                       id="Address"
                                       //value={formik.values.Address}
                                       placeholder={t("text.Address")}
                                    //onChange={formik.handleChange}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.Country")} required={false} />}
                                             name=""
                                             id=""
                                             placeholder={t("text.Country")}
                                          />
                                       )}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.State")} required={false} />}
                                             name=""
                                             id=""
                                             placeholder={t("text.State")}
                                          />
                                       )}
                                    />
                                 </Grid>
                                 <Grid item lg={4} md={4} sm={4} xs={12}>
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
                                             label={<CustomLabel text={t("text.City")} required={false} />}
                                             name=""
                                             id=""
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
                                       name="Pincode"
                                       id="Pincode"
                                       //value={formik.values.Pincode}
                                       placeholder={t("text.Pincode")}
                                    //onChange={formik.handleChange}
                                    />
                                 </Grid>
                              </Grid>
                           </AccordionDetails>
                        </Accordion>

                        <Accordion
                           sx={{
                              border: "1px solid #E0E0E0",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                              borderRadius: "12px",
                              backgroundColor: "#FAFAFA",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": { boxShadow: "0px 6px 14px rgba(0,0,0,0.12)" },
                              "&:before": { display: "none" },
                              "&.Mui-expanded": { margin: "14px 0" }
                           }}
                        >
                           <AccordionSummary
                              expandIcon={<ArrowDropDownIcon sx={{ color: "#1976d2", fontSize: "2rem" }} />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                 backgroundColor: "#fff",
                                 fontWeight: "bold",
                                 fontSize: "1.1rem",
                                 padding: "8px 12px",
                                 borderBottom: "1px solid #E0E0E0",
                                 "&:hover": { backgroundColor: "#F0F0F0" }
                              }}
                           >
                              <Typography component="span">{t("text.UploadDocuments")}</Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{ padding: "20px" }}>
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
                                          onChange={(e) => otherDocChangeHandler(e, "imageFile")}
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
                                          {formik.values.imageFile == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.imageFile}`}
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
                                             onClick={() => modalOpenHandle1("imageFile")}
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
                                          onChange={(e) => otherDocChangeHandler(e, "signatureFile")}
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
                                          {formik.values.signatureFile == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.signatureFile}`}
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
                                             onClick={() => modalOpenHandle1("signatureFile")}
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
                           </AccordionDetails>
                        </Accordion>
                     </Grid> */}
                  </Grid>
               </form>
            </CardContent>
         </div>
      </div>
   );
};

export default EmployeeMaster;


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