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
import { getId } from "../../../utils/Constant";
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

export default function Unitmaster() {
  const Userid = getId();
  const [editId, setEditId] = useState(0);
  const [zones, setZones] = useState([]);
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
    // 
    fetchZonesData();
  }, []);


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };


  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("unitId", row.unitId); // Ensure no space after "unitId"
    formik.setFieldValue("unitName", row.unitName);
    formik.setFieldValue("unitShortname", row.unitShortname);
    formik.setFieldValue("isActive", row.isActive);
    setEditId(row.unitId); // Set the unitId to edit
  };
  


  let delete_id = "";

  const accept = () => {
    const collectData = {
      unitId: delete_id
    };

    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`UnitMaster/DeleteUnitMaster`, collectData )
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchZonesData();
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

  const fetchZonesData = async () => {
    try {
      const collectData = {
        unitId: -1
      };
      const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.unitId,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
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
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
          
          },
          {
            field: "unitName",
            headerName: t("text.unitName"),
            flex: 1,
           
          },
          {
            field: "unitShortname",
            headerName: t("text.unitShortname"),
            flex: 1,
           
          },
         
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const validationSchema = Yup.object({
    unitName: Yup.string().required(t("text.reqUnitName")),
  });



  const requiredFields = ["unitName"];

  const formik = useFormik({
    initialValues: {
      unitId: 0,
      unitName: "",
      unitShortname: "",
      createdBy: "admin",
      updatedBy: "admin",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let endpoint = "UnitMaster/UpsertUnitMaster";
      if (editId !== 0) {
        // Perform update
        values.unitId = editId; // Ensure the correct unitId is being sent for update
      }
  
      const response = await api.post(endpoint, values);
      if (response.data.status === 1) {
        formik.resetForm();
        fetchZonesData();
        toast.success(response.data.message);
        setEditId(0); // Reset the edit mode
      } else {
        toast.error(response.data.message);
      }
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
                {t("text.UnitMaster")}
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
                  label={t("text.enterunitName")}
                  value={formik.values.unitName}
                  onChangeText={(text: string) => handleConversionChange('unitName', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.unitName && formik.errors.unitName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.unitName}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={5} lg={5}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterunitShortname")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="unitShortname"
                  id="unitShortname"
                  value={formik.values.unitShortname}
                  placeholder={t("text.enterunitShortname")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={2} sx={{ m: -1 }}>
  {editId === 0 ? (
    <ButtonWithLoader
      buttonText={t("text.save")}
      onClickHandler={handleSubmitWrapper}
      fullWidth={true}
    />
  ) : (
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
              rows={zones}
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
};