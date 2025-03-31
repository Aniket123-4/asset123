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
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function StateMaster() {
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(0);
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

  useEffect(() => {

    fetchZonesData();
    getCountryName();
  }, [isLoading]);

  const getCountryName = async () => {
    try {
      const collectData = { Type: 4 };
      const response = await api.post(`CountryMaster`, collectData);

      if (response.data.success) {
        const countryList = response.data.data.map((item: any) => ({
          label: item.CountryName,  // ✅ Correct label
          value: item.country_id,  // ✅ Correct value
        }));
        setOption(countryList);
      } else {
        toast.warn("No country data available.");
      }
    } catch (error) {
      console.error("❌ Error fetching countries:", error);
      toast.error("Failed to load country data.");
    }
  };


  const validationSchema = Yup.object({
    country_id: Yup.string().test(
      "required",
      t("text.reqCountryName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    state_name: Yup.string().test(
      "required",
      t("text.reqstateName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      state_id: -1,  // -1 indicates a new entry
      state_name: "",
      state_shortname: "",
      user_id: 1,
      inst_ID_9: 1,
      country_id: null,
      allowedto: "",
      Type: 1  // Default is 1 (Add)
    }, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const finalValues = {
        Type: editId === 0 ? 1 : 2, // ✅ If editId is 0, it's an add operation (Type 1); otherwise, update (Type 2)
        state_id: editId !== 0 ? editId : -1, // ✅ If updating, send actual ID; otherwise, send -1
        state_name: values.state_name,
        state_shortname: values.state_shortname,
        user_id: 1,
        inst_ID_9: 1,
        country_id: values.country_id,
        allowedto: "",
      };

      api.post("StateMaster", finalValues)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message || "State saved successfully");
            formik.resetForm();
            fetchZonesData();  // Refresh list
            setEditId(0);  // ✅ Reset edit mode
          } else {
            toast.error("Error saving State details");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error: " + error.message);
        });
    },
  });


  // const requiredFields = ["country_id", "state_name"];

  const routeChangeEdit = (row: any) => {
    const requestData = {

      "state_id": row.id,
      "state_name": "",
      "state_shortname": "",
      "user_id": 1,
      "inst_ID_9": 1,
      "country_id": null,
      "allowedto": "",
      "Type": 3
    };

    api
      .post("StateMaster", requestData)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const dept = res.data.data[0];

          formik.setValues({
            Type: 2, // For update
            state_id: dept.state_id,
            state_name: dept.state_name,
            state_shortname: dept.state_shortname,
            "user_id": 1,
            "inst_ID_9": 1,
            "country_id":dept.country_id,
            "allowedto": "",
          });

          setEditId(dept.state_id); // Set edit mode
        } else {
          toast.error("state_name not found");
        }
      })
      .catch(() => toast.error("Error fetching state_name details"));
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };





  const fetchZonesData = async () => {
    try {
      const collectData = { Type: 4 };
      
      // Fetch states
      const response = await api.post(`StateMaster`, collectData);
      const statesData = response.data.data;
  
      // Fetch countries
      const countryResponse = await api.post(`CountryMaster`, collectData);
      const countryList = countryResponse.data.data;
  
      // Create a mapping of country_id to country name
      const countryMap = new Map(countryList.map((c: any) => [c.country_id, c.CountryName]));
  
      // Map states data and replace country_id with country_name
      const zonesWithIds = statesData.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.state_id,
        country_name: countryMap.get(zone.country_id) || "Unknown", // Get country name from map
      }));
  
      setZones(zonesWithIds);
      setIsLoading(false);
  
      if (statesData.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,
            renderCell: (params) => (
              <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
                <EditIcon
                  style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                  className="cursor-pointer"
                  onClick={() => routeChangeEdit(params.row)}
                />
              </Stack>
            ),
          },
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "state_name",
            headerName: t("text.StateName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "state_shortname",
            headerName: t("text.StateCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "country_name", // Show country name instead of ID
            headerName: t("text.CountryName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };
  

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

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
                {t("text.StateMaster")}
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
              <Grid xs={3} sm={3} item>
                <Autocomplete
                  disablePortal
                  id="country-dropdown"
                  options={option}
                  fullWidth
                  size="small"
                  value={option.find((opt) => opt.value === formik.values.country_id) || null} // ✅ Find correct option
                  onChange={(event, newValue) => {
                    if (newValue) {
                      formik.setFieldValue("country_id", newValue.value); // ✅ Store the ID
                      formik.setFieldValue("CountryName", newValue.label); // ✅ Store the name
                    }
                  }}
                  getOptionLabel={(option) => option.label} // ✅ Display country name
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectCountryName")} required />}
                    />
                  )}
                />

                {formik.touched.country_id && formik.errors.country_id ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.country_id}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={3.5} sm={3.5}>
                <TranslateTextField
                  label={t("text.EnterStateName")}
                  value={formik.values.state_name}
                  onChangeText={(text: string) =>
                    handleConversionChange("state_name", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.state_name && formik.errors.state_name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.state_name}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={3.5} sm={3.5} item>
                <TextField
                  label={<CustomLabel text={t("text.EnterStateCode")} />}
                  value={formik.values.state_shortname}
                  name="state_shortname"
                  id="state_shortname"
                  placeholder={t("text.EnterStateCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
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

          <DataGrids
            isLoading={isLoading}
            rows={zones}
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
