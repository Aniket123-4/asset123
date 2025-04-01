
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
   Box,
   Button,
   Divider,
   Stack,
   TextField,
   Grid,
   Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";
import ReactQuill from "react-quill";


interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function HelpCreation() {
   const { t } = useTranslation();
   const UserId = getId();
   const { defaultValuestime } = getISTDate();
   const [zones, setZones] = useState([]);
   const [columns, setColumns] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(true);
   const location = useLocation();
   const [editId, setEditId] = useState(0);
   const [MenuTypeOptions, setMenuTypeOptions] = useState<any>([]);
   const [MenuTypeMap, setMenuTypeMap] = useState(new Map());
   const [HelpCreations, setHelpCreations] = useState([]);


   const [option, setOption] = useState([
      { value: "-1", label: t("text.SelectCountryName") },
   ]);
   const [permissionData, setPermissionData] = useState<MenuPermission>({
      isAdd: false,
      isEdit: false,
      isPrint: false,
      isDel: false,
   });
   const [lang, setLang] = useState<Language>("en");
   let navigate = useNavigate();

   const [isStateCode, setIsStateCode] = useState(false);



   useEffect(() => {
      fetchMenucreation();
   }, []);


   const fetchMenucreation = async () => {
      try {
         const [menuResponse, helpResponse] = await Promise.all([
            api.post("Menucreation", { Type: 4 }),
            api.post("HelpCreation", { Type: 3 })
         ]);

         let menuData: any[] = [];

         // Process Menu Data
         if (menuResponse.data.success) {
            menuData = menuResponse.data.data;

            const MenuList = menuData.map((item: any) => ({
               label: item.Title.trim(),       // Menu display text
               value: item.ID,                // Use actual ID instead of ParentID
               isParent: item.ParentID === null, // Flag for parent items
               originalData: item            // Keep original data for reference
            }));
            setMenuTypeOptions(MenuList);
         }

         // Process Help Creations
         if (helpResponse.data.success) {
            const DocsWithIds = helpResponse.data.data.map((doc: any) => {
               const matchingMenuItem = menuData.find((menu: any) => menu.Title.trim() === doc.Page_Name?.trim());
               const computedPageTitleId = matchingMenuItem ? findRootParentId(matchingMenuItem.ID, menuData) : null;

               return {
                  ...doc,
                  Page_Name: doc.Page_Name?.trim(), // Clean page names
                  PageTitleId: computedPageTitleId, // Set PageTitleId using hierarchy
                  id: doc.Id,
                  serialNo: doc.Id
               };
            });

            setHelpCreations(DocsWithIds);
         }

         setIsLoading(false);
      } catch (error) {
         console.error("Data fetch error:", error);
         toast.error(t("error.data_load_failed"));
         setIsLoading(false);
      }
   };

   const findRootParentId = (menuId: number, menuData: any[]): number => {
      const menuItem = menuData.find((item: any) => item.ID === menuId);
      if (!menuItem || menuItem.ParentID === null) return menuId;
      return findRootParentId(menuItem.ParentID, menuData);
   };

   const formik = useFormik({
      initialValues: {
         Id: -1,
         formatName: "",
         height: 0,
         width: 0,
         roundedCorner: "",
         variableBackSide: "",
         frontDesign: "",
         backDesign: "",
         pagename: "",
         PageTitleId: 0,
         Type: 1
      },

       onSubmit : async (values) => {
         try {
           const requestData = {
             ...values,
             PageTitleId: values.PageTitleId === -1 ? findRootParentId(values.PageTitleId, MenuTypeOptions) : values.PageTitleId,
             Type: values.Id !== -1 ? 2 : 1
           };
       
           const response = await api.post("HelpCreation", requestData);
       
           if (response.data.success) {
             toast.success(response.data.message);
             setEditId(0);
             formik.resetForm();
       
             // Refresh Menu & Help Data
             fetchMenucreation();  
           } else {
             toast.error("Failed to save/update data");
           }
         } catch (error) {
           toast.error("Error: " + error);
         }
       }
       
  
   });
   const routeChangeEdit = (row: any) => {
      api.post("HelpCreation", {

         "Id": row.id,
         "formatName": "",
         "height": 0,
         "width": 0,
         "roundedCorner": "",
         "variableBackSide": "",
         "frontDesign": "",
         "backDesign": "",
         "pagename": "",
         "PageTitleId": 0,
         "Type": 2

      })
         .then((res) => {
            if (res.data.success && res.data.data.length > 0) {
               const rule = res.data.data[0];

               formik.setValues({
                  Id: rule.Id,
                  formatName: rule.formatName,
                  height: rule.height,
                  width: rule.width,
                  roundedCorner: rule.roundedCorner,
                  variableBackSide: rule.variableBackSide,
                  frontDesign: rule.frontDesign,
                  backDesign: rule.backDesign,
                  pagename: rule.Page_Name,
                  PageTitleId: rule.PageTitleId,
                  Type: 2,
               });

               setEditId(rule.Id);
            } else {
               toast.error("help not found");
            }
         })
         .catch(() => toast.error("Error fetching help details"));
   };




   const handleConversionChange = (text: string) => {
      formik.setFieldValue("frontDesign", text);
   };

 

   const handleSubmitWrapper = async () => {
      await formik.handleSubmit();
   };

   return (
      <>
         <Card
            style={{
               width: "100%",
               backgroundColor: "#E9FDEE",
               border: ".5px solid #2B4593 ",
               marginTop: "3vh",
            }}
         >
            <Paper
               sx={{
                  width: "100%",
                  overflow: "hidden",
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
                        {t("text.HelpCreation")}
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

               <Stack direction="row" spacing={2} classes="my-2 mb-2"></Stack>

               <form onSubmit={formik.handleSubmit}>
                  <Grid item xs={12} container spacing={3}>
                     <Grid item xs={12} sm={4} lg={4}>

                     
                     <Autocomplete
  disablePortal
  id="Menu-type-dropdown"
  options={MenuTypeOptions} // Include all menu items
  fullWidth
  size="small"
  value={
    MenuTypeOptions.find((option: any) => option.label === formik.values.pagename) || null
  }
  onChange={(event, newValue) => {
    if (newValue) {
      // Find the corresponding help data
      const matchedHelp:any = HelpCreations.find((help: any) => help.PageTitleId === newValue.value);

      formik.setValues({
        ...formik.values,
        PageTitleId: newValue.value, // Assign actual ID
        pagename: newValue.label,
        frontDesign: matchedHelp ? matchedHelp.frontDesign : "", // Auto-update frontDesign if help exists
      });
    }
  }}
  getOptionLabel={(option) => {
    // Display full hierarchy (e.g., "Parent > Child > Subchild")
    const parent = MenuTypeOptions.find((item: any) => item.value === option.ParentID);
    const grandParent = parent ? MenuTypeOptions.find((item: any) => item.value === parent.ParentID) : null;

    if (grandParent) return `${grandParent.label} > ${parent?.label} > ${option.label}`;
    if (parent) return `${parent.label} > ${option.label}`;
    return option.label;
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={<CustomLabel text={t("text.PageTitle")} required={true} />}
    />
  )}
/>




                     </Grid>

                     <Grid item xs={12} sm={12}>
                        <ReactQuill
                           value={formik.values.frontDesign || ""}
                           onChange={(content) => formik.setFieldValue("frontDesign", content)}
                           modules={modules}
                           formats={formats}
                        />
                     </Grid>





                     <Grid item xs={2} sx={{ m: -1 }}>


                        {editId === 0 && (

                           <ButtonWithLoader
                              buttonText={t("text.save")}
                              onClickHandler={handleSubmitWrapper}
                              fullWidth={true}
                           />
                        )}

                        {editId !== 0 && (
                           <ButtonWithLoader
                              buttonText={t("text.update")}
                              onClickHandler={handleSubmitWrapper}
                              fullWidth={true}
                           />
                        )}
                     </Grid>
                  </Grid>
               </form>

               

            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}

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
