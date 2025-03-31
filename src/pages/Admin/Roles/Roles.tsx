

import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
// import CustomDataGrids from "../../../utils/CustomDataGrids";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Roles() {
  const Userid = getId();
  const [editId, setEditId] = useState(0);
  const [Roles, setRoles] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { t } = useTranslation();

  useEffect(() => {

    fetchRolesData();
  }, []);
  // }, [isLoading]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };



  const routeChangeEdit = (row: any) => {
    api
      .post("RoleMaster", { Type: 3, roleID: row.id }) // Get by ID
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const role = res.data.data[0];

          formik.setValues({
            Type: 2, // Update
            roleID: role.roleID,
            RoleName: role.RoleName,
            inst_id: role.inst_id,
            roleType: role.roleType,

          });

          setEditId(role.roleID); // Set edit mode
        } else {
          toast.error("role not found");
        }
      })
      .catch(() => toast.error("Error fetching role details"));
  };


  let delete_id = "";

  const accept = () => {
    api
      .post("RoleMaster", { Type: 2, roleID: delete_id }) // Delete request
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.data[0].message);
          fetchRolesData(); // Refresh list
        } else {
          toast.error("Failed to delete role");
        }
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

  const fetchRolesData = async () => {
    try {
      const todayDate = new Date().toLocaleDateString("en-GB").split('/').join('-'); // "08-03-2024" format

      const collectData = {

        Type: 4 // Capital 'T'
      };

      const response = await api.post(`RoleMaster`, collectData);
      const data = response.data.data;

      console.log("🚀 ~ fetchRolesData ~ response.data.data:", response.data.data);

      const RolesWithIds = data.map((role: any, index: number) => ({
        ...role,
        serialNo: index + 1,
        id: role.roleID, 
        roleType: role.roleType === "A" ? "Admin" : "Normal", // Convert roleType value
      }));


      setRoles(RolesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [

          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,
            renderCell: (params) => {
              console.log("Is Edit Allowed:", permissionData?.isEdit);
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
                  {/* <DeleteIcon
                                  style={{
                                    fontSize: "20px",
                                    color: "red",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handledeleteClick(params.row.id);
                                  }}
                                /> */}
                </Stack>,
              ];
            },
          },

          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "RoleName", headerName: t("text.RoleName"), flex: 1 },
          { field: "roleType", headerName: t("text.roleType"), flex: 1 },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching role data");
    }
  };



  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const validationSchema = Yup.object({
    RoleName: Yup.string().test(
      "required",
      t("text.reqRoleName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });


  const requiredFields = ["RoleName"];
  const { defaultValuestime } = getISTDate();

  const formik = useFormik({
    initialValues: {
      roleID: -1,
      RoleName: "",
      inst_id: 1,
      roleType: "N",
      Type: 1, // Default is Type 1 for adding new role
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const finalValues = {
        roleID: editId !== 0 ? editId : -1, // Use editId for updates
        RoleName: values.RoleName,
        roleType: values.roleType,
        inst_id: 1,
        Type: editId !== 0 ? 2 : 1, // ✅ If editId is set, use Type 2 (update), else Type 1 (create)
      };

      api
        .post(`RoleMaster`, finalValues)
        .then((response) => {
          if (response.data.success) {
            if (response.data.message) {
              toast.success(response.data.message); // ✅ Show success message
            } else {
              toast.success("Role updated successfully");
            }

            formik.resetForm();
            fetchRolesData(); // Refresh list
            setEditId(0); // Reset edit mode
          } else {
            toast.error("Failed to save role");
          }
        })
        .catch((error) => {
          toast.error("Error: " + error.message);
        });
    },
  });



  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            // backgroundColor:"lightseagreen"
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.RoleMaster")}
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
              <Grid xs={12} sm={5} lg={5} item>
                <TranslateTextField
                  label={t("text.enterRoleName")}
                  value={formik.values.RoleName}
                  onChangeText={(text: string) =>
                    handleConversionChange("RoleName", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.RoleName && formik.errors.RoleName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.RoleName}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>



                <Box display="flex" alignItems="center">
                  <FormLabel component="legend" sx={{ fontWeight: "bold", mr: 2 }}>
                    {t("text.roleType")}
                  </FormLabel>

                  <RadioGroup
                    row
                    aria-label="type"
                    name="type"
                    value={formik.values.roleType}
                    onChange={(event) => formik.setFieldValue("roleType", event.target.value)}
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio color="primary" />}
                      label={t("text.Admin")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio color="primary" />}
                      label={t("text.Normal")}
                    />
                  </RadioGroup>
                </Box>

              </Grid>



              <Grid item xs={2} sx={{ m: -1 }}>
                {editId === 0 && (
                  // {editId === -1 && permissionData?.isAdd && (
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
            <DataGrids
              isLoading={isLoading}
              rows={Roles}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          )}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}



