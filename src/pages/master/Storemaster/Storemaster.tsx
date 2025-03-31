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
  Autocomplete,
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
import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { getISTDate } from "../../../utils/Constant";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Storemaster() {
  const { t } = useTranslation();
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
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
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectItemType") },
  ]);
  const [taxOptions, setTaxOptions] = useState([
    { value: "-1", label: t("text.SelectTaxId") },
  ]);
  const [itemCategoryOptions, setitemCategoryOptions] = useState([
    { value: "-1", label: t("text.itemCategory") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const { defaultValuestime } = getISTDate();


  useEffect(() => {
    fetchZonesData();
    GetUnitData()
  }, []);
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };
  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(`UnitMaster/GetUnitMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    };
    setUnitOptions(arr);
  };
  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const collectData = {
      id: value.id,
      storeName: value.storeName,
      capacity: value.capacity,
      unit: value.unit,
      supervisor: value.supervisor,
      storeKeeper: value.storeKeeper,
      description: value.description,
      userId: value.userId,
      inst_Id: value.inst_Id,
      uploadDate: value.uploadDate,
      store_type: value.store_type,
      divisionid: value.divisionid,
    };
    console.log("collect Data addUpdate", collectData)
    api.post(`StoreMaster/AddUpdateStoreMaster`, collectData).then((response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        fetchZonesData();
      } else {
        toast.error(response.data.mesg);
      }
    });
  };
  const routeChangeEdit = (row: any) => {
    console.log("check edit", row)
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("storeName", row.storeName);
    formik.setFieldValue("capacity", row.capacity);
    formik.setFieldValue("unit", row.unit);
    formik.setFieldValue("supervisor", row.supervisor);
    formik.setFieldValue("storeKeeper", row.storeKeeper);
    formik.setFieldValue("description", row.description);
    formik.setFieldValue("userId", row.userId);
    formik.setFieldValue("inst_Id", row.inst_Id);
    formik.setFieldValue("uploadDate", dayjs(row.uploadDate).format("YYYY-MM-DD"));
    formik.setFieldValue("store_type", row.store_type);
    formik.setFieldValue("divisionid", row.divisionid);
    setEditId(row.id);
  };
  let delete_id = "";
  const accept = () => {
    const collectData = {
      id: delete_id
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`StoreMaster/DeleteStoreMaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
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
        id: -1,
        unit: -1
      };
      const response = await api.post(`StoreMaster/GetStoreMaster`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);
      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            width: 120,
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
            field: "storeName",
            headerName: t("text.storeName"),
            flex: 1,
          },
          {
            field: "capacity",
            headerName: t("text.capacity"),
            flex: 1,
          },
          {
            field: "unitName",
            headerName: t("text.unit"),
            flex: 1,
          },
          {
            field: "supervisor",
            headerName: t("text.supervisor"),
            flex: 1,
          },
          {
            field: "storeKeeper",
            headerName: t("text.storeKeeper"),
            flex: 1,
          },
          {
            field: "store_type",
            headerName: t("text.store_type"),
            flex: 1,
            renderCell: (params) => {
              return params.value === 0 ? t("text.Indoor") : t("text.Outdoor");
            }
          },

          {
            field: "description",
            headerName: t("text.description"),
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
  const formik = useFormik({
    initialValues: {
      id: -1,
      storeName: "",
      capacity: "",
      unit: 0,
      supervisor: "",
      storeKeeper: "",
      uploadDate: defaultValuestime,
      store_type: -1,
      description: "",
    },
    validationSchema: Yup.object({
      storeName: Yup.string().required(t("text.reqStoreName")),
    }),
    onSubmit: async (values) => {
      const response = await api.post("StoreMaster/AddUpdateStoreMaster", values);
      if (response.data.isSuccess) {
        formik.resetForm();
        fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
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
                {t("text.StoreMaster")}
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
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterStoreName")}
                  value={formik.values.storeName}
                  onChangeText={(text) => handleConversionChange("storeName", text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.storeName && formik.errors.storeName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.storeName}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterCapacity")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="capacity"
                  id="capacity"
                  value={formik.values.capacity}
                  placeholder={t("text.EnterCapacity")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={unitOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("unit", newValue?.value); // Set Formik field value on change
                  }}
                  value={
                    unitOptions.find((opt) => String(opt.value) === String(formik.values.unit)) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.enterunitId")} /> // Ensure label is correctly passed
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterSupervisor")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="supervisor"
                  id="supervisor"
                  value={formik.values.supervisor}
                  placeholder={t("text.EnterSupervisor")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterStoreKeeper")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="storeKeeper"
                  id="storeKeeper"
                  value={formik.values.storeKeeper}
                  placeholder={t("text.EnterStoreKeeper")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>{t("text.Enterstore_type")}</InputLabel>
                  <Select
                    label={t("text.Enterstore_type")}
                    name="store_type"
                    id="store_type"
                    value={formik.values.store_type}
                    onChange={formik.handleChange}
                    displayEmpty
                  >
                    <MenuItem value="-1">
                      {t("text.Selectstore_type")}
                    </MenuItem>
                    <MenuItem value="0">
                      {t("text.Indoor")}
                    </MenuItem>
                    <MenuItem value="1">
                      {t("text.Outdoor")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterDescription")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="description"
                  id="description"
                  value={formik.values.description}
                  placeholder={t("text.EnterDescription")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}></Grid>
              <Grid container item xs={4}>
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
            <CustomDataGrid
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