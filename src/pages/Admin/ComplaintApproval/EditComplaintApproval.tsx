import {
   Autocomplete,
   Button,
   Card,
   CardContent,
   Grid,
   Divider,
   Table,
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
import React, { useEffect, useState, useRef } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReactQuill from "react-quill";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatStrikethrough } from "@mui/icons-material";

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

const EditComplaintApproval = (props: Props) => {
   const location = useLocation(); // Access the passed data
   let navigate = useNavigate();
   const { t } = useTranslation();
   const [lang, setLang] = useState<Language>("en");
   const { defaultValues } = getISTDate();
   const [toaster, setToaster] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
   const userId = getId();

   const [vehicleOption, setVehicleOption] = useState([
      { value: -1, label: t("text.VehicleNo"), name: "", empId: "" },
   ]);
   const [empOption, setEmpOption] = useState([
      { value: -1, label: t("text.EmpName"), department: "", designation: "" },
   ]);
   const [deptOption, setDeptOption] = useState([
      { value: -1, label: t("text.Department") },
   ]);
   const [designationOption, setDesignationOption] = useState([
      { value: -1, label: t("text.Designation") },
   ]);
   const inputRef = useRef<HTMLButtonElement>(null);

   const [vehicleName, setVehicleName] = useState("");

   const [aprEmpDesignation1, setaprEmpDesignation1] = useState("");
   const [aprEmpDesignation2, setaprEmpDesignation2] = useState("");
   const [aprEmpDesignation3, setaprEmpDesignation3] = useState("");
   const [aprEmpDesignation4, setaprEmpDesignation4] = useState("");
   const [aprDept1, setaprEmpDept1] = useState("");
   const [aprDept2, setaprEmpDept2] = useState("");
   const [aprDept3, setaprEmpDept3] = useState("");
   const [aprDept4, setaprEmpDept4] = useState("");

   const [complaintData, setComplaintData] = useState([
      {
         sno: 0,
         compId: 0,
         itemID: 0,
         complaintType: "",
         complaintDoc: "",
         empId: 0,
         approveEmp4: 0,
         approveEmp3: 0,
         approveEmp2: 0,
         approveEmp1: 0,
         complaint: "",
         complaintNo: "",
         createdBy: "",
         updatedBy: "",
         status: "pending",
         currentReading: 0,
         createdOn: defaultValues,
         complaintDate: defaultValues,
         updatedOn: defaultValues,
         compAppdt: defaultValues,
         jobCardNo: "",
         file: "",
         fileOldName: "",
         vehicleNo: "",
         vehicleName: "",
         empName: "",
      },
   ]);

   const [panOpens, setPanOpen] = React.useState(false);
   const [modalImg, setModalImg] = useState("");
   const [Opens, setOpen] = React.useState(false);
   const [Img, setImg] = useState("");

   useEffect(() => {
      getVehicleDetails();
      getDeptData();
      getDesignationData();
      getEmpData();
      //getComplaintData();
      fetchImage(location.state?.compId || formik.values.compId);

      console.log("location", location.state)
      const timeoutId = setTimeout(() => {
         if (inputRef.current) {
            inputRef.current.click(); // Programmatically click the button
         }
         if (formik.values.approveEmp1 > 0) {
            setaprEmpDept1(empOption.find(e => e.value == location.state.approveEmp1)?.department || "")
            setaprEmpDept2(empOption.find(e => e.value == location.state.approveEmp2)?.department || "")
            setaprEmpDept3(empOption.find(e => e.value == location.state.approveEmp3)?.department || "")
            setaprEmpDept4(empOption.find(e => e.value == location.state.approveEmp4)?.department || "")
            setaprEmpDesignation1(empOption.find(e => e.value == location.state.approveEmp1)?.designation || "")
            setaprEmpDesignation2(empOption.find(e => e.value == location.state.approveEmp2)?.designation || "")
            setaprEmpDesignation3(empOption.find(e => e.value == location.state.approveEmp3)?.designation || "")
            setaprEmpDesignation4(empOption.find(e => e.value == location.state.approveEmp4)?.designation || "")
         }
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [setaprEmpDept1]);

   const getLabelById = (option: any, id: any) => {
      const obj = option.find((item: any) => item.value === id);
      return obj ? obj.label : "";
   };

   const getVehicleDetails = async () => {
      const response = await api.get(`Master/GetVehicleDetail?ItemMasterId=-1`);
      const data = response.data.data;
      const arr = data.map((Item: any, index: any) => ({
         value: Item.itemMasterId,
         label: Item.vehicleNo,
         name: Item.itemName,
         empId: Item.empId,
      }));
      setVehicleOption(arr);
   };

   const getEmpData = async () => {
      const collectData = {
         empid: -1,
         userId: "",
      };
      const response = await api.post(`Employee/GetEmployee`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["empName"],
            value: data[index]["empid"],
            department: data[index]["departmentName"],
            designation: data[index]["designationName"],
         });
      }
      setEmpOption(arr);
   };

   const getComplaintData = async () => {
      const collectData = {
         "compId": -1,
         "empId": -1
      };
      const response = await api.post(`Master/GetComplaint`, collectData);
      const data = response.data.data;
      const arr = data.map((Item: any, index: any) => ({
         ...Item,
      }));
      setComplaintData(arr);
   };

   const getDeptData = async () => {
      const collectData = {
         departmentId: -1,
      };
      const response = await api.post(`Department/GetDepartment`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["departmentName"],
            value: data[index]["departmentId"],
         });
      }
      setDeptOption(arr);
   };

   const getDesignationData = async () => {
      const collectData = {
         designationId: -1,
      };
      const response = await api.post(`Department/GetDesignation`, collectData);
      const data = response.data.data;
      const arr = [];
      for (let index = 0; index < data.length; index++) {
         arr.push({
            label: data[index]["designationName"],
            value: data[index]["designationId"],
         });
      }
      setDesignationOption(arr);
   };

   const fetchImage = async (compId: any = location.state?.compId || 0) => {
      const collectData = {
         "compId": compId,
         "empId": -1
      };
      const response = await api.post(
         `Master/GetComplaint`,
         collectData
      );
      const data = response.data.data;
      formik.setFieldValue("complaintDoc", data[0].complaintDoc.replace(/^(data:image\/\w+;base64,)/, ""));
   }

   function convertToYYYYMMDD(dateString: any) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
   }

   const formik = useFormik({
      initialValues: {
         sno: location.state?.sno || 0,
         compId: parseInt(location.state?.complaintNo) - 1 || 0,
         itemID: location.state?.itemID,
         complaintType: location.state?.complaintType,
         complaintDoc: "",
         empId: location.state?.empId,
         approveEmp4: 0,
         approveEmp3: 0,
         approveEmp2: 0,
         approveEmp1: 0,
         complaint: location.state?.complaint,
         complaintNo: (location.state?.complaintNo),
         createdBy: location.state?.createdBy,
         updatedBy: userId,
         status: "inprogress",
         currentReading: location.state?.currentReading,
         createdOn: location.state?.createdOn,
         complaintDate: dayjs(location.state?.complaintDate).format("YYYY-MM-DD"),
         updatedOn: location.state?.updatedOn,
         compAppdt: location.state?.compAppdt || "",
         jobCardNo: location.state?.jobCardNo || location.state?.complaintNo || "",
         file: location.state?.file || "",
         fileOldName: location.state?.fileOldName || "",
         vehicleNo: location.state?.vehicleNo || "",
         vehicleName: location.state?.vehicleName,
         empName: location.state?.empName,

         //...location.state,
      },
      validationSchema: Yup.object({
         itemID: Yup.string()
            .required(t("text.reqVehNum")),
         complaintDate: Yup.string()
            .required("Complain date is required"),
         complaint: Yup.string()
            .required(t("text.reqComplain")),
      }),
      // onSubmit: async (values) => {
      //    try {
      //       //values.complaintDoc = values.complaintDoc.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");
      //       const response = await api.post(`Master/UpsertComplaint`, values);
      //       if (response.data.status === 1) {
      //          toast.success(response.data.message);
      //          navigate("/vehiclemanagement/vehiclecomplaints/ComplaintApproval")
      //          if (localStorage.getItem("ApplicationFlow") === "outsource") {
      //             setIsVisible(true);
      //          } else {
      //             setIsVisible(false);
      //          }
      //       } else {
      //          toast.error(response.data.message);
      //          setToaster(true);
      //       }
      //    } catch (error) {
      //       toast.error(
      //          "An error occurred while submitting the form. Please try again."
      //       );
      //    }
      // },
      onSubmit: async (values) => {
         try {
            const response = await api.post(`Master/UpsertComplaint`, values);
            if (response.data.status === 1) {
               toast.success("Complaint Approved Successfully"); 
               navigate("/vehiclemanagement/vehiclecomplaints/ComplaintApproval");
               if (localStorage.getItem("ApplicationFlow") === "outsource") {
                  setIsVisible(true);
               } else {
                  setIsVisible(false);
               }
            } else {
               toast.error(response.data.message); 
               setToaster(true);
            }
         } catch (error) {
            toast.error(
               "An error occurred while submitting the form. Please try again."
            );
         }
      },
      
   });

   const handlePanClose = () => {
      setPanOpen(false);
   };

   const modalOpenHandle = (event: string) => {
      setPanOpen(true);
      const base64Prefix = "data:image/jpeg;base64,";

      let imageData = '';
      switch (event) {
         case "complaintDoc":
            imageData = formik.values.complaintDoc;
            break;
         default:
            imageData = '';
      }
      if (imageData) {
         const imgSrc = imageData.startsWith(base64Prefix) ? imageData : base64Prefix + imageData;
         console.log("imageData", imgSrc);
         setImg(imgSrc);
      } else {
         setImg('');
      }
   };


   const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type (only allow images)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
         alert("Only .jpg, .jpeg, or .png image files are allowed.");
         event.target.value = ''; // Clear input field
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         const base64String = reader.result as string;

         // Use regex to remove the base64 prefix dynamically
         const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

         if (base64Content) {
            formik.setFieldValue(params, base64Content); // Store the stripped base64 string
         } else {
            alert("Error processing image data.");
         }
      };

      reader.onerror = () => {
         alert("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
   };


   // const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
   //    const file = event.target.files?.[0];
   //    if (!file) return;

   //    const fileExtension = file.name.split('.').pop()?.toLowerCase();
   //    if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
   //       alert("Only .jpg, .jpeg, or .png image files are allowed.");
   //       event.target.value = '';
   //       return;
   //    }

   //    const reader = new FileReader();
   //    reader.onload = () => {
   //       const base64String = reader.result as string;
   //       formik.setFieldValue(params, base64String); // Store the complete base64 string with the prefix.
   //    };
   //    reader.onerror = () => {
   //       alert("Error reading file. Please try again.");
   //    };
   //    reader.readAsDataURL(file);
   // };


   // const handlePanClose = () => {
   //    setPanOpen(false);
   // };
   // const modalOpenHandle = (event: any) => {
   //    setPanOpen(true);
   //    if (event === "file") {
   //       setModalImg(formik.values.file);
   //    }
   // };
   // const ConvertBase64 = (file: File): Promise<string> => {
   //    return new Promise((resolve, reject) => {
   //       const reader = new FileReader();
   //       reader.readAsDataURL(file);
   //       reader.onload = () => resolve(reader.result as string);
   //       reader.onerror = (error) => reject(error);
   //    });
   // };

   // const base64ToByteArray = (base64: string): Uint8Array => {
   //    // Remove the data URL scheme if it exists
   //    const base64String = base64.split(",")[1];

   //    // Decode the Base64 string
   //    const binaryString = window.atob(base64String);
   //    const len = binaryString.length;
   //    const bytes = new Uint8Array(len);

   //    // Convert binary string to Uint8Array
   //    for (let i = 0; i < len; i++) {
   //       bytes[i] = binaryString.charCodeAt(i);
   //    }

   //    return bytes;
   // };

   // const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
   //    let binary = "";
   //    const len = uint8Array.byteLength;
   //    for (let i = 0; i < len; i++) {
   //       binary += String.fromCharCode(uint8Array[i]);
   //    }
   //    return window.btoa(binary);
   // };

   // const otherDocChangeHandler = async (event: any, params: string) => {
   //    console.log("Image file change detected");

   //    if (event.target.files && event.target.files[0]) {
   //       const file = event.target.files[0];
   //       const fileNameParts = file.name.split(".");
   //       const fileExtension =
   //          fileNameParts[fileNameParts.length - 1].toLowerCase();

   //       if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
   //          alert(
   //             "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
   //          );
   //          event.target.value = null;
   //          return;
   //       }

   //       try {
   //          const base64Data = (await ConvertBase64(file)) as string;
   //          console.log("Base64 image data:", base64Data);

   //          // Convert Base64 to Uint8Array
   //          const byteArray = base64ToByteArray(base64Data);
   //          console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

   //          // Convert Uint8Array to base64 string
   //          const base64String = uint8ArrayToBase64(byteArray);
   //          console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

   //          // Set value in Formik
   //          formik.setFieldValue(params, base64String);

   //          let outputCheck = "data:image/png;base64," + formik.values.file;
   //          console.log(outputCheck);
   //       } catch (error) {
   //          console.error("Error converting image file to Base64:", error);
   //       }
   //    }
   // };



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
               <Grid item xs={12} container spacing={2}>
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
                  <Grid
                     item
                     lg={7}
                     md={7}
                     xs={7}
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
                        {t("text.ComplaintApproval")}
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
               {/* <ToastContainer /> */}
               <form onSubmit={formik.handleSubmit}>
                  {toaster === false ? "" : <ToastApp />}
                  <Grid container spacing={2}>
                     {/* VehicleNumber */}
                     <Grid item xs={12} md={4} sm={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={vehicleOption.filter((e) => {
                              for (let i = 0; i < complaintData.length; i++) {
                                 if (e.value == complaintData[i].itemID) {
                                    return e;
                                 }
                              }
                           })}
                           value={formik.values.vehicleNo}
                           fullWidth
                           size="small"
                           disabled
                           sx={{ color: "#000" }}
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 formik.setFieldValue("itemID", "");
                                 formik.setFieldValue("vehicleNo", "");
                              } else {
                                 formik.setFieldValue("itemID", newValue?.value);
                                 formik.setFieldValue("vehicleNo", newValue?.label);
                                 formik.setFieldValue("empId", newValue?.empId);
                                 formik.setFieldValue(
                                    "sno",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].sno
                                 );
                                 formik.setFieldValue(
                                    "compId",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].compId
                                 );
                                 formik.setFieldValue(
                                    "complaintType",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].complaintType
                                 );
                                 // formik.setFieldValue(
                                 //    "complaintDoc",
                                 //    complaintData[
                                 //       complaintData.findIndex(
                                 //          (x) => x.itemID == newValue?.value
                                 //       )
                                 //    ].complaintDoc
                                 // );
                                 formik.setFieldValue(
                                    "empId",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].empId
                                 );
                                 formik.setFieldValue(
                                    "complaint",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].complaint
                                 );
                                 formik.setFieldValue(
                                    "complaintNo",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].complaintNo
                                 );
                                 formik.setFieldValue(
                                    "createdBy",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].createdBy
                                 );
                                 formik.setFieldValue(
                                    "updatedBy",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].updatedBy
                                 );
                                 formik.setFieldValue(
                                    "currentReading",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].currentReading
                                 );
                                 formik.setFieldValue(
                                    "createdOn",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].createdOn
                                 );
                                 formik.setFieldValue(
                                    "complaintDate",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].complaintDate
                                 );
                                 formik.setFieldValue(
                                    "updatedOn",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].updatedOn
                                 );
                                 formik.setFieldValue(
                                    "jobCardNo",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ]?.jobCardNo ||
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].complaintNo
                                 );
                                 formik.setFieldValue(
                                    "file",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ]?.file || ""
                                 );
                                 formik.setFieldValue(
                                    "fileOldName",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ]?.fileOldName || ""
                                 );
                                 formik.setFieldValue(
                                    "vehicleName",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].vehicleName
                                 );
                                 formik.setFieldValue(
                                    "empName",
                                    complaintData[
                                       complaintData.findIndex(
                                          (x) => x.itemID == newValue?.value
                                       )
                                    ].empName
                                 );
                              }
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={
                                    <CustomLabel
                                       text={t("text.SelectVehicleNum")}
                                       required={true}
                                    />
                                 }
                                 name="vehicleNo"
                                 id="vehicleNo"
                                 placeholder={t("text.SelectVehicleNum")}
                              />
                           )}
                        />
                        {!formik.values.vehicleNo && formik.touched.vehicleNo && formik.errors.vehicleNo && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.vehicleNo.toString()}</div>
                        )}
                     </Grid>

                     {/* Vehicle name */}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={<CustomLabel text={t("text.VehicleName")} />}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="vehicleName"
                           id="vehicleName"
                           //  value={vehicleName}
                           value={formik.values.vehicleName}
                           placeholder={t("text.VehicleName")}
                           onChange={formik.handleChange}
                           InputLabelProps={{ shrink: true }}
                           inputProps={{ readOnly: true }}
                        />
                     </Grid>

                     {/* UnderControlOf */}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={<CustomLabel text={t("text.UnderControlOf")} />}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="empName"
                           id="empName"
                           value={formik.values.empName}
                           placeholder={t("text.UnderControlOf")}
                           onChange={formik.handleChange}
                           InputLabelProps={{ shrink: true }}
                           inputProps={{ readOnly: true }}
                        />

                        {/* <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={formik.values.empName}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("empId", newValue?.value);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.UnderControlOf")} required={true} />}
                                 name="empId"
                                 id="empId"
                                 placeholder={t("text.UnderControlOf")}
                              />
                           )}
                        /> */}
                     </Grid>

                     {/* ComplaintNo */}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={<CustomLabel text={t("text.ComplaintNo")} />}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="complaintNo"
                           id="complaintNo"
                           value={formik.values.complaintNo}
                           placeholder={t("text.ComplaintNo")}
                           onChange={(e) => {
                              formik.setFieldValue("complaintNo", e.target.value);
                           }}
                           InputLabelProps={{ shrink: true }}
                           inputProps={{ readOnly: true }}
                        />
                     </Grid>

                     {/* approve Date */}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={<CustomLabel text={t("text.ComplainApproveDate")} />}
                           type="date"
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="compAppdt"
                           id="compAppdt"
                           value={dayjs(formik.values.compAppdt).format("YYYY-MM-DD")}
                           placeholder={t("text.Date")}
                           onChange={(e) => {
                              formik.setFieldValue("compAppdt", e.target.value);
                           }}
                           InputLabelProps={{ shrink: true }}
                        />
                        {!formik.values.compAppdt && formik.touched.compAppdt && formik.errors.compAppdt && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.compAppdt.toString()}</div>
                        )}
                     </Grid>

                     {/* CurrentReadingKM */}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={<CustomLabel text={t("text.EnterReadingKM")} />}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="currentReading"
                           id="currentReading"
                           value={formik.values.currentReading}
                           placeholder={t("text.EnterReadingKM")}
                           onChange={(e) => {
                              formik.setFieldValue("currentReading", e.target.value);
                           }}
                           InputLabelProps={{ shrink: true }}
                           inputProps={{ readOnly: true }}
                        />
                     </Grid>

                     {/* Approve 1 */}
                     <Grid item xs={12} md={4} sm={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={getLabelById(empOption, formik.values.approveEmp1)}
                           //disabled={true}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("approveEmp1", newValue?.value);
                              setaprEmpDept1(newValue?.department);
                              setaprEmpDesignation1(newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={
                                    <CustomLabel
                                       text={t("text.ApproveEmployee") + " 1"}
                                       required={false}
                                    />
                                 }
                                 name="approveEmp1"
                                 id="approveEmp1"
                                 placeholder={t("text.ApproveEmployee") + " 1"}
                              />
                           )}
                        />
                     </Grid>
                     {/* Department 1*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                              //required={true}
                              />
                           }
                           //  disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprDept1"
                           id="aprDept1"
                           value={aprDept1}
                           placeholder={t("text.Department")}
                           onChange={formik.handleChange}
                        />
                     </Grid>
                     {/* Designation 1*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                              //required={true}
                              />
                           }
                           //disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprEmpDesignation1"
                           id="aprEmpDesignation1"
                           value={aprEmpDesignation1}
                           placeholder={t("text.Designation")}
                           onChange={formik.handleChange}
                        />
                     </Grid>

                     {/* Approve 2 */}
                     <Grid item xs={12} md={4} sm={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={getLabelById(empOption, formik.values.approveEmp2)}
                           // disabled={true}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("approveEmp2", newValue?.value);
                              setaprEmpDept2(newValue?.department);
                              setaprEmpDesignation2(newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={
                                    <CustomLabel
                                       text={t("text.ApproveEmployee") + " 2"}
                                       required={false}
                                    />
                                 }
                                 name="approveEmp2"
                                 id="approveEmp2"
                                 placeholder={t("text.ApproveEmployee") + " 2"}
                              />
                           )}
                        />
                     </Grid>
                     {/* Department 2*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                              //required={true}
                              />
                           }
                           // disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprDept2"
                           id="aprDept2"
                           value={aprDept2}
                           placeholder={t("text.Department")}
                           onChange={formik.handleChange}
                        />
                     </Grid>
                     {/* Designation 2*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                              //required={true}
                              />
                           }
                           // disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprEmpDesignation2"
                           id="aprEmpDesignation2"
                           value={aprEmpDesignation2}
                           placeholder={t("text.Designation")}
                           onChange={formik.handleChange}
                        />
                     </Grid>

                     {/* Approve 3 */}
                     <Grid item xs={12} md={4} sm={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={getLabelById(empOption, formik.values.approveEmp3)}
                           // disabled={true}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("approveEmp3", newValue?.value);
                              setaprEmpDept3(newValue?.department);
                              setaprEmpDesignation3(newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={
                                    <CustomLabel
                                       text={t("text.ApproveEmployee") + " 3"}
                                       required={false}
                                    />
                                 }
                                 name="approveEmp3"
                                 id="approveEmp3"
                                 placeholder={t("text.ApproveEmployee") + " 3"}
                              />
                           )}
                        />
                     </Grid>
                     {/* Department 3*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                              //required={true}
                              />
                           }
                           //  disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprDept3"
                           id="aprDept3"
                           value={aprDept3}
                           placeholder={t("text.Department")}
                           onChange={formik.handleChange}
                        />
                     </Grid>
                     {/* Designation 3*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                              //required={true}
                              />
                           }
                           // disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprEmpDesignation3"
                           id="aprEmpDesignation3"
                           value={aprEmpDesignation3}
                           placeholder={t("text.Designation")}
                           onChange={formik.handleChange}
                        />
                     </Grid>

                     {/* Approve 4 */}
                     <Grid item xs={12} md={4} sm={4}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={empOption}
                           value={getLabelById(empOption, formik.values.approveEmp4)}
                           //disabled={true}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              console.log(newValue?.value);
                              formik.setFieldValue("approveEmp4", newValue?.value);
                              setaprEmpDept4(newValue?.department);
                              setaprEmpDesignation4(newValue?.designation);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={
                                    <CustomLabel
                                       text={t("text.ApproveEmployee") + " 4"}
                                       required={false}
                                    />
                                 }
                                 name="approveEmp4"
                                 id="approveEmp4"
                                 placeholder={t("text.ApproveEmployee") + " 4"}
                              />
                           )}
                        />
                     </Grid>
                     {/* Department 4*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Department")}
                              //required={true}
                              />
                           }
                           // disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprDept4"
                           id="aprDept4"
                           value={aprDept4}
                           placeholder={t("text.Department")}
                           onChange={formik.handleChange}
                        />
                     </Grid>
                     {/* Designation 4*/}
                     <Grid item xs={12} md={4} sm={4}>
                        <TextField
                           label={
                              <CustomLabel
                                 text={t("text.Designation")}
                              //required={true}
                              />
                           }
                           //   disabled={true}
                           variant="outlined"
                           fullWidth
                           size="small"
                           name="aprEmpDesignation4"
                           id="aprEmpDesignation4"
                           value={aprEmpDesignation4}
                           placeholder={t("text.Designation")}
                           onChange={formik.handleChange}
                        />
                     </Grid>

                     <Grid item xs={12} md={12} sm={12}>
                        <div>
                           {/* <CustomLabel text={t("text.Complaint")} /> */}
                           <textarea
                              name="complaint"
                              id="complaint"
                              value={formik.values.complaint}
                              placeholder={t("text.enterComplaint")}
                              onChange={(e) => {
                                 formik.setFieldValue("complaint", e.target.value);
                              }}
                              style={{
                                 width: "100%",
                                 height: "100px",
                                 padding: "10px",
                                 boxSizing: "border-box",
                                 borderRadius: "4px",
                                 border: "1px solid #ccc",
                                 fontSize: "14px",
                              }}
                           />
                        </div>
                        {!formik.values.complaint && formik.touched.complaint && formik.errors.complaint && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.complaint.toString()}</div>
                        )}
                     </Grid>
                     {/* <Grid item lg={12} md={12} xs={12} marginTop={2}>
                        <ReactQuill
                           id="complaint"
                           theme="snow"
                           value={formik.values.complaint}
                           onChange={(content) =>
                              formik.setFieldValue("complaint", content)
                           }
                           onBlur={() => formik.setFieldTouched("complaint", true)}
                           modules={modules}
                           formats={formats}
                           //  style={{ backgroundColor: "white", minHeight: "200px" }}
                           placeholder="Enter your complaint here"
                        />
                        {!formik.values.complaint && formik.touched.complaint && formik.errors.complaint && (
                           <div style={{ color: "red", margin: "5px" }}>{formik.errors.complaint.toString()}</div>
                        )}
                     </Grid> */}

                     {/* attachment */}
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
                              label={
                                 <strong style={{ color: "#000" }}>
                                    {t("text.AttachedImage")}
                                 </strong>
                              }
                              size="small"
                              fullWidth
                              style={{ backgroundColor: "white" }}
                              onChange={(e: any) => otherDocChangeHandler(e, "complaintDoc")}
                           />
                        </Grid>

                        <Grid xs={12} md={4} sm={4} item></Grid>
                        <Grid
                           style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "10px",
                           }}
                        >
                           {formik.values.complaintDoc ? (
                              <img
                                 src={
                                    formik.values.complaintDoc.startsWith("data:image")
                                       ? formik.values.complaintDoc
                                       : `data:image/jpeg;base64,${formik.values.complaintDoc}`
                                 }
                                 alt="Preview"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                    padding: "2px",
                                 }}
                              />
                           ) : (
                              <img
                                 src={nopdf}
                                 alt="No document"
                                 style={{
                                    width: 150,
                                    height: 100,
                                    border: "1px solid grey",
                                    borderRadius: 10,
                                 }}
                              />
                           )}
                           <Typography
                              onClick={() => modalOpenHandle("complaintDoc")}
                              style={{
                                 textDecorationColor: "blue",
                                 textDecorationLine: "underline",
                                 color: "blue",
                                 fontSize: "15px",
                                 cursor: "pointer",
                                 padding: "20px",
                              }}
                           >
                              {t("text.Preview")}
                           </Typography>
                        </Grid>

                        <Modal open={panOpens} onClose={handlePanClose}>
                           <Box sx={style}>
                              {Img ? (
                                 <img
                                    src={Img}
                                    alt="Preview"
                                    style={{
                                       width: "170vh",
                                       height: "75vh",
                                       borderRadius: 10,
                                    }}
                                 />
                              ) : (
                                 <Typography>No Image to Preview</Typography>
                              )}
                           </Box>
                        </Modal>
                     </Grid>


                     {/* Submit Button */}
                     <Grid item lg={6} sm={6} xs={12}>
                        {location.state.isView ? "" : (
                           <Button
                              type="submit"
                              fullWidth
                              style={{
                                 backgroundColor: `var(--header-background)`,
                                 color: "white",
                                 marginTop: "10px",
                              }}
                           >
                              {t("text.update")}
                           </Button>
                        )}
                     </Grid>

                     {/* Reset Button */}
                     <Grid item lg={6} sm={6} xs={12}>
                        {location.state.isView ? "" : (
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
                        )}
                     </Grid>

                     <Button
                        ref={inputRef}
                        onClick={(e) => {
                           setTimeout(() => {
                              //fetchImage(location.state?.compId || formik.values.compId);
                              formik.setFieldValue("approveEmp1", location.state?.approveEmp1 || 0);
                              formik.setFieldValue("approveEmp2", location.state?.approveEmp2 || 0);
                              formik.setFieldValue("approveEmp3", location.state?.approveEmp3 || 0);
                              formik.setFieldValue("approveEmp4", location.state?.approveEmp4 || 0);
                           }, 300);
                        }}
                        sx={{ display: "none" }}
                        variant="contained"
                        color="secondary"
                     >
                     </Button>

                     {isVisible && (
                        <Grid item lg={6} sm={6} xs={12}>
                           <Button
                              type="button"
                              style={{
                                 backgroundColor: "#0000ff",
                                 color: "white",
                                 marginTop: "10px",
                                 padding: "8px 16px",
                                 fontSize: "16px",
                                 borderRadius: "8px",
                                 width: "100px",
                              }}
                              onClick={() => {
                                 if (localStorage.getItem("ApplicationFlow") == "outsource") {
                                    navigate("/vehiclemanagement/vehiclecomplaints/AddJobCard", {
                                       state: {
                                          ...formik.values, department: empOption.find(e => e.value == formik.values.empId)?.department,
                                          designation: empOption.find(e => e.value == formik.values.empId)?.designation
                                       }
                                    });
                                 }
                                 else {
                                    navigate("/vehiclemanagement/vehiclecomplaints/AddJobCard", {
                                       state: {
                                          ...formik.values, department: empOption.find(e => e.value == formik.values.empId)?.department,
                                          designation: empOption.find(e => e.value == formik.values.empId)?.designation
                                       }
                                    });
                                 }
                                 // navigate("/vehiclecomplaint/AddJobCard", {
                                 //    state: {
                                 //       ...formik.values, department: empOption.find(e => e.value == formik.values.empId)?.department,
                                 //       designation: empOption.find(e => e.value == formik.values.empId)?.designation
                                 //    },
                                 // });
                              }}
                           >
                              {t("text.Next")}
                              <ArrowForwardIcon />
                           </Button>
                        </Grid>
                     )}
                  </Grid>
               </form>
            </CardContent>
         </div>
      </div >
   );
};
const modules = {
   toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "formula"],
      ["clean"],
   ],
};

const formats = [
   "header",
   "font",
   "size",
   "bold",
   "italic",
   "underline",
   "strike",
   "color",
   "background",
   "script",
   "list",
   "bullet",
   "indent",
   "align",
   "link",
   "image",
   "video",
   "formula",
   "code-block",
];
export default EditComplaintApproval;
