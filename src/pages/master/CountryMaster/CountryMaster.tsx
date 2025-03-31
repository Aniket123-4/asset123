import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
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
export default function CountryMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(-1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {

    getList();
  }, [isLoading]);




  const getList = () => {
    const collectData = {
      "Type": 4
    };
    try {
      api.post(`CountryMaster`, collectData).then((res) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.country_id,
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
                console.log("Is Edit Allowed:", permissionData?.isEdit);
                return [
                  <Stack
                    spacing={1}
                    direction="row"
                    sx={{ alignItems: "center", marginTop: "5px" }}
                  >
                    {/* {permissionData?.isEdit ? (  */}
                    <EditIcon
                      style={{
                        fontSize: "20px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      className="cursor-pointer"
                      onClick={() => routeChangeEdit(params.row)}
                    />

                  </Stack>,
                ];
              },
            },

            {
              field: "serialNo",
              headerName: t("text.SrNo"),
              flex: 1,
             // headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "CountryName",
              headerName: t("text.CountryName"),
              flex: 1,
             // headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "CountryCode",
              headerName: t("text.CountryCode"),
              flex: 1,
             // headerClassName: "MuiDataGrid-colCell",
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
  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const validationSchema = Yup.object({
    CountryName: Yup.string().test(
      "required",
      t("text.reqCountryName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {

      "country_id": -1,
      "CountryName": "",
      "CountryCode": "",
      "user_id": 1,
      "instID": 1,
      "Type": 1
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const finalValues = {
        Type: editId === -1 ? 1 : 2, // 1 for Add, 2 for Update
        country_id: editId !== -1 ? editId : -1, // Set ID for update, -1 for add
        CountryName: values.CountryName,
        CountryCode: values.CountryCode,
        "user_id": 1,
        "instID": 1
        
      };
    

      api
      .post("CountryMaster", finalValues)
      .then((response) => {
        console.log(response.data); // Check API response
        if (response.data.success) {
          if (response.data.message) {
            toast.success(response.data.message); // Show success message
          } else {
            toast.success("CountryMaster details saved successfully");
          }
          formik.resetForm();
          getList(); // Refresh list
          setEditId(-1); // Reset form to Add mode
        } else {
          toast.error("Error saving CountryMaster details");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error: " + error.message);
      });
  },
  
  
});

  const requiredFields = ["CountryName"];
  const routeChangeEdit = (row: any) => {
    const requestData = {

      "country_id": row.id,
      "CountryName": "",
      "CountryCode": "",
      "user_id": 1,
      "instID": 1,
      "Type": 3
    };

    api
      .post("CountryMaster", requestData)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const dept = res.data.data[0];

          formik.setValues({
            Type: 2, // For update
            country_id: dept.country_id,
            CountryName: dept.CountryName,
            CountryCode: dept.CountryCode,
            user_id: 1,
            instID: 1,
          });

          setEditId(dept.country_id); // Set edit mode
        } else {
          toast.error("CountryName not found");
        }
      })
      .catch(() => toast.error("Error fetching CountryName details"));
  };
  // const routeChangeEdit = (row: any) => {
  //   formik.setFieldValue("CountryName", row.CountryName);
  //   formik.setFieldValue("CountryCode", row.CountryCode);
  //   setEditId(row.id);
  // };

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
            backgroundColor: "lightgreen",
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
              <Grid item lg={8} md={8} xs={12}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.CountryMaster")}
                </Typography>
              </Grid>

              <Grid item lg={4} md={4} xs={12} marginTop={2}>
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
                <Grid item xs={5}>
                  <TranslateTextField
                    label={t("text.EnterCountryName")}
                    value={formik.values.CountryName}
                    onChangeText={(text: string) =>
                      handleConversionChange("CountryName", text)
                    }
                    required={true}
                    lang={lang}
                  />

                  {formik.touched.CountryName && formik.errors.CountryName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.CountryName}
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label={<CustomLabel text={t("text.EnterCountryCode")} />}
                    value={formik.values.CountryCode}
                    placeholder={t("text.EnterCountryCode")}
                    size="small"
                    fullWidth
                    name="CountryCode"
                    id="CountryCode"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={2} sx={{ m: -1 }}>
                  {editId === -1 && (
                    //{editId === -1 && permissionData?.isAdd && (
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
            {/* </Grid> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            {/* </Stack> */}
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
