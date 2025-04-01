// import {
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Typography,
//   Divider,
// } from "@mui/material";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import React, { useState, useEffect, useTransition } from "react";
// import axios from "axios";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import HOST_URL from "../../../utils/Url";
// import Autocomplete from "@mui/material/Autocomplete";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {useTranslation} from "react-i18next";
// import api from "../../../utils/Url";
// type Props = {};

// const MenuMasterEdit = (props: Props) => {
//   const location = useLocation();
//   // console.log('location', location.state)

//   const [option, setOption] = useState([{ value: "-1", label: "Select Menu" }]);
//   const { i18n, t } = useTranslation();
//   let navigate = useNavigate();

//   const getMenuName = () => {
//     api.post( `Menu/GetParentMenuMaster`).then((res) => {
//       const arr = [];
//       // console.log("result" + JSON.stringify(res.data.data));
//       for (let index = 0; index < res.data.data.length; index++) {
//         arr.push({
//           label: res.data.data[index]["menuName"],
//           value: res.data.data[index]["menuId"],
//         });
//       }
//       setOption(arr);
//     });
//   };

//   useEffect(() => {
//     getMenuName();
//   }, []);

//   const back = useNavigate();

//   const validationSchema = Yup.object({
//     menuName:
//     Yup.string().test(
//       'required', // Unique name for the test
//       t('text.reqMenuName'),// Translation for "*Menu Name is required"
//       function (value:any) {
//         return value && value.trim() !== ''; // Your validation logic here
//       }  ),

//   });


//   const formik = useFormik({
//     initialValues: {
//       menuId: location.state.id,
//       menuName: location.state.menuName,
//       parentId: location.state.parentId,
//       pageUrl: location.state.pageUrl,
//       icon: location.state.icon,
//       displayNo: location.state.displayNo,
//       isMenu: location.state.isMenu,
//       isAdd: location.state.isAdd,
//       isEdit: location.state.isEdit,
//       isDel: location.state.isDel,
//       isView: location.state.isView,
//       isPrint: location.state.isPrint,
//       isExport: location.state.isExport,
//       isRelease: location.state.isRelease,
//       isPost: location.state.isPost,
//       childId: location.state.childId,
//       parentName: location.state.parentName,
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       const response = await api.post(
//         `Menu/AddUpdateMenuMaster`,
//         values
//         );
//   try {
//         // console.log("API Response:", response.data);
//         alert(response.data.mesg);
//         navigate("/master/MenuMaster");
//       } catch (error) {
//         alert(response.data.mesg);
//       }
//     },
//   });

//   const requiredFields = ["menuName"];

//   return (
//     <div>
//       <div
//         style={{
//           padding: "-5px 5px",
//           backgroundColor: "#ffffff",
//           borderRadius: "5px",
//           marginTop: "5px",
//           border: ".5px solid #FF7722",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h5"
//             textAlign="center"
//             style={{ fontSize: "18px", fontWeight: 500 }}
//           >
//          {t("text.EditMenuMaster")}
//           </Typography>

//           <Grid item sm={4} xs={12}>
//             <Typography style={{ marginTop: "-75px" }}>
//               <Button
//                 type="submit"
//                 onClick={() => back(-1)}
//                 variant="contained"
//                 style={{
//                   marginBottom: 15,
//                   marginTop: "45px",
//                   backgroundColor: "blue",
//                   width: 20,
//                 }}
//               >
//                 <ArrowBackSharpIcon />
//               </Button>
//             </Typography>
//           </Grid>
//           <Divider />
//           <br />
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={1}>
//               <Grid xs={12} sm={4} item>
//                 <TextField
//                   type="text"
//                   name="menuName"
//                   id="menuName"
//                   label={
//                     <span>
//                          {t("text.EnterMenuName")}{" "}
//                       {requiredFields.includes("menuName") && (
//                         <span
//                           style={{
//                             color: formik.values.menuName ? "green" : "red",
//                           }}
//                         >
//                           *
//                         </span>
//                       )}
//                     </span>
//                   }
//                   value={formik.values.menuName}
//                   placeholder=   {t("text.EnterMenuName")}
//                   size="small"
//                   fullWidth
//                   style={{
//                     backgroundColor: "white",
//                     borderColor:
//                       formik.touched.menuName && formik.errors.menuName
//                         ? "red"
//                         : "initial",
//                   }}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//                 {formik.touched.menuName && formik.errors.menuName ? (
//                   <div style={{ color: "red", margin: "5px" }}>
//                     {String(formik.errors.menuName)}
//                   </div>
//                 ) : null}
//               </Grid>

//               <Grid xs={12} sm={4} item>
//                 <TextField
//                   type="text"
//                   name="pageUrl"
//                   id="pageUrl"
//                   label={<span>{t("text.EnterPageURL")}</span>}
//                   value={formik.values.pageUrl}
//                   placeholder={t("text.EnterPageURL")}
//                   size="small"
//                   fullWidth
//                   style={{
//                     backgroundColor: "white",
//                     borderColor:
//                       formik.touched.pageUrl && formik.errors.pageUrl
//                         ? "red"
//                         : "initial",
//                   }}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </Grid>

//               <Grid xs={12} sm={4} item>
//                 <TextField
//                   type="text"
//                   name="icon"
//                   id="icon"
//                   label={<span>{t("text.EnterIcon")}</span>}
//                   value={formik.values.icon}
//                   placeholder=  {t("text.EnterIcon")}
//                   size="small"
//                   fullWidth
//                   style={{
//                     backgroundColor: "white",
//                     borderColor:
//                       formik.touched.icon && formik.errors.icon
//                         ? "red"
//                         : "initial",
//                   }}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </Grid>
//               <Grid xs={12} sm={4} item>
//                 <Autocomplete
//                   disablePortal
//                   id="combo-box-demo"
//                   options={option}
//                   fullWidth
//                   value={
//                     option.find(
//                       (opt) => opt.value === formik.values.parentId
//                     ) || null
//                   }
//                   size="small"
//                   onChange={(event, newValue) => {
//                     // console.log(newValue?.value);
//                     formik.setFieldValue("parentName", newValue?.label);
//                     formik.setFieldValue("parentId", newValue?.value);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label={<span>
//                       {t("text.selectParentMenuName")} </span>}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid xs={12} sm={4} item>
//                <TextField
//                   type="text"
//                   name="displayNo"
//                   id="displayNo"
//                   label={
//                     <span>
//                       {t("text.EnterdisplayNo")}
//                     </span>
//                   }
//                   value={formik.values.displayNo}
//                   placeholder= {t("text.EnterdisplayNo")}
//                   size="small"
//                   fullWidth
//                   style={{ backgroundColor: "white", borderColor: formik.touched.displayNo && formik.errors.displayNo ? 'red' : 'initial', }}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
               
//               </Grid>
//               <Grid xs={12} item>
//                 <div style={{ justifyContent: "space-between", flex: 2 }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     style={{
//                       width: "48%",
//                       backgroundColor: "#059669",
//                       margin: "1%",
//                     }}
//                   >
//                  {t("text.save")}
//                   </Button>
//                   <Button
//                     type="reset"
//                     variant="contained"
//                     style={{
//                       width: "48%",
//                       backgroundColor: "#F43F5E",
//                       margin: "1%",
//                     }}
//                     onClick={() => formik.resetForm()}
//                   >
//                    {t("text.reset")}
//                   </Button>
//                 </div>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </div>
//     </div>
//   );
// };

// export default MenuMasterEdit;
