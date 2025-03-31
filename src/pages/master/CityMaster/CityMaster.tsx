import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function FileMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(0);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectStateName") },
  ]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {

    getList();
    getStateZone();
  }, [isLoading, location.pathname]);

  const getStateZone = async () => {
    try {
      const collectData = {
        Type: 4

      };
      const response = await api.post(`StateMaster`, collectData);
      if (response.data.success) {
        const StateList = response.data.data.map((item: any) => ({
          label: item.state_name,
          value: item.state_id,
        }));


        setOption(StateList);
      }
      else {
        toast.warn("No state data");

      }

    } catch (error) {
      toast.error("failed to load state data")
    }

  };
  let delete_id = "";

  const accept = () => {
    const collectData = {
      city_id: delete_id, Type: 5
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`City`, collectData)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          getList();
        } else {
          toast.error(response.data.message);
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

  const getList = () => {
    const collectData = {
      "Type": 4

    };
    try {
      api.post(`City`, collectData).then((res) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.city_id,
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
                    {/* {permissionData?.isEdit ? ( */}
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={() => routeChangeEdit(params.row)}
                    />
                    {/* ) : (
                      ""
                    )} */}
                    {/* {permissionData?.isDel ? ( */}
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
                    {/* ) : (
                      ""
                    )} */}
                  </Stack>,
                ];
              },
            },

            {
              field: "serialNo",
              headerName: t("text.SrNo"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "state_id",
              headerName: t("text.StateName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "city_name",
              headerName: t("text.CityName"),
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

  const validationSchema = Yup.object({
    state_id: Yup.string().test(
      "required",
      t("text.reqstateName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    city_name: Yup.string().test(
      "required",
      t("text.reqCityname"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {


      "city_id": -1,
      "city_name": "",
      "city_shortname": "",
      "state_id": null,
      "user_id": 1,
      "inst_ID": 1,
      "allowedto": "",
      "Type": 1

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const finalValues = {
        Type: editId === 0 ? 1 : 2, // ✅ If editId is 0, it's an add operation (Type 1); otherwise, update (Type 2)
        city_id: editId !== 0 ? editId : -1, // ✅ If updating, send actual ID; otherwise, send -1
        city_name: values.city_name,
        city_shortname: values.city_shortname,
        state_id: values.state_id,
        "user_id": 1,
        "inst_ID": 1,
        "allowedto": "",
      };
      //  values.city_id = editId;
      // console.log("check", values);

      api.post(
        `City`,
        finalValues
      )
      .then((response) => {
        if (response.data.success) {
           toast.success(response.data.message || "city saved successfully");
                      formik.resetForm();
                      getList();  // Refresh list
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
          
   
  // const requiredFields = ["stateId"];

  // const routeChangeEdit = (row: any) => {
  //   formik.setFieldValue("stateId", row.stateId);
  //   formik.setFieldValue("cityName", row.cityName);
  //   formik.setFieldValue("stateName", row.stateName);

  //   setEditId(row.id);
  // };


  const routeChangeEdit = (row: any) => {
    const requestData = {

      // "state_id": row.id,
      // "state_name": "",
      // "state_shortname": "",
      // "user_id": 1,
      // "inst_ID_9": 1,
      // "country_id": null,
      // "allowedto": "",
      // "Type": 3



      "city_id": row.id,
      "city_name": "",
      "city_shortname": "",
      "state_id": null,
      "user_id": 1,
      "inst_ID": 1,
      "allowedto": "",
      "Type": 3
    };

    api
      .post("City", requestData)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const dept = res.data.data[0];

          formik.setValues({
            Type: 2, // For update
            city_id: dept.city_id,
            city_name: dept.city_name,
            city_shortname: dept.city_shortname,
            "state_id": dept.state_id,
            "user_id": 1,
            "inst_ID": 1,
            "allowedto": "",
          });

          setEditId(dept.city_id); // Set edit mode
        } else {
          toast.error("city_id not found");
        }
      })
      .catch(() => toast.error("Error fetching city_id details"));
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
                  {t("text.CityMaster")}
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
              <Grid item xs={12} container spacing={3}>
                <Grid item xs={12} sm={4} lg={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={option}
                    fullWidth
                    size="small"
                    onChange={(event, newValue) => {
                      // console.log(newValue?.value);
                      formik.setFieldValue("state_id", newValue?.value);
                      formik.setFieldValue("state_name", newValue?.label);
                    }}
                    value={
                      option.find(
                        (opt: any) => opt.value === formik.values.state_id
                      ) || null
                    }
                    // value={}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.SelectStateName")}
                            required={true}
                          />
                        }
                      />
                    )}
                  />
                  {formik.touched.state_id && formik.errors.state_id ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.state_id}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={12} sm={4} lg={4}>
                  <TranslateTextField
                    label={t("text.EnterCityName")}
                    value={formik.values.city_name}
                    onChangeText={(text: string) =>
                      handleConversionChange("city_name", text)
                    }
                    required={true}
                    lang={lang}
                  />
                  {formik.touched.city_name && formik.errors.city_name ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.city_name}
                    </div>
                  ) : null}
                </Grid>


                <Grid item xs={12} sm={4} lg={4}>
                  <TranslateTextField
                    label={t("text.EnterCityShortName")}
                    value={formik.values.city_shortname}
                    onChangeText={(text: string) =>
                      handleConversionChange("city_shortname", text)
                    }
                    required={false}
                    lang={lang}
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
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialPageSize={5}
              />
            )}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
