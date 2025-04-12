
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

   const [menuItems, setMenuItems] = useState<any>([]);

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
      let menu: any = JSON.parse(localStorage.getItem("permissions") || "[]");
      setMenuItems(menu.map(((item: any) => {
         return {
            value: item.MenuId,
            label: item.MenuTitle,
         }
      })));


   }, []);



   const fetchMenucreationByMenuid = async (menuId: any, menuName: any) => {
      const collectdata = {
         "Type": 4,
         "PageTitleId": menuId,
      }
      const response = await api.post("HelpCreation", collectdata);
      const data = response.data.data[0];
      if (response.data.success) {
         if (response.data.data.length <= 0) {
            setEditId(0);
            formik.setFieldValue("pagename", menuName);
            formik.setFieldValue("PageTitleId", menuId);
            formik.setFieldValue("Type", 1);
            formik.setFieldValue("frontDesign", "");
         } else {
            formik.setFieldValue("Id", data.Id);
            formik.setFieldValue("formatName", data.formatName);
            formik.setFieldValue("height", data.height);
            formik.setFieldValue("width", data.width);
            formik.setFieldValue("roundedCorner", data.roundedCorner);
            formik.setFieldValue("variableBackSide", data.variableBackSide);
            formik.setFieldValue("frontDesign", data.frontDesign);
            formik.setFieldValue("backDesign", data.backDesign);
            formik.setFieldValue("pagename", data.pagename);
            formik.setFieldValue("PageTitleId", data.PageTitleId);
            formik.setFieldValue("Type", 2);
            setEditId(data.Id);
         }

      }

   }


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
         PageTitleId: null,
         Type: 1
      },

      validationSchema: Yup.object({
         PageTitleId: Yup.number().required(t("text.PagetitleRequired")),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post("HelpCreation", values);

            if (response.data.success) {
               toast.success(response.data.message);
               setEditId(0);
               formik.resetForm();
            } else {
               toast.error("Failed to save/update data");
            }
         } catch (error) {
            toast.error("Error: " + error);
         }
      }
   });


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
                           options={menuItems}
                           value={menuItems.find((option: any) => option.value == formik.values.PageTitleId) || null}
                           fullWidth
                           size="small"
                           onChange={(event, newValue: any) => {
                              fetchMenucreationByMenuid(newValue?.value, newValue?.label);
                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.PageTitle")} required={true} />}
                              />
                           )}
                        />

                        {formik.touched.PageTitleId && formik.errors.PageTitleId ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {formik.errors.PageTitleId}
                           </div>
                        ) : null}

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