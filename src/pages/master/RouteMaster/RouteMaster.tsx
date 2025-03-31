import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { Language } from "react-transliterate";
import TranslateTextField from "../../../TranslateTextField";
import CustomLabel from "../../../CustomLable";
import { json } from "stream/consumers";
import * as Yup from "yup";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function RouteMaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");


  useEffect(() => {
    fetchRouteDetailData();
  }, [isLoading]);


  const formik = useFormik({
    initialValues: {
      "activeClass": "",
      "all": true,
      "showExisting": true,
      "isSuccess": true,
      "message": "",
      "srno": 0,
      "eScarp": true,
      "eScarpPrevValue": "",
      "css": "",
      "routeID": 0,
      "routeName": "",
      "description": "",
      "routeDate": "",
      "createdBy": "",
      "updatedBy": "",
      "createdOn": "2024-11-27T04:40:15.028Z",
      "updatedOn": "2024-11-27T04:40:15.028Z",
      "time": "00:00:00",
      "interval": 0
    },

    validationSchema: Yup.object({
      routeName: Yup.string()
        .required(t("text.reqRouteName")),
      routeDate: Yup.string()
        .required(t("text.reqRouteDate")),
    }),


    onSubmit: async (values) => {
      const response = await api.post(`Route/UpsertRoute`, values);
      if (response.data.status === 1) {
        formik.setFieldValue("routeName", "");
        formik.setFieldValue("description", "");
        formik.setFieldValue("routeDate", "");
        setToaster(false);
        toast.success(response.data.message);
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
      fetchRouteDetailData();
    },
  });

  const handleEdit = (row: any) => {
    formik.setFieldValue("routeID", row.routeID);
    formik.setFieldValue("routeName", row.routeName);
    formik.setFieldValue("description", row.description);
    formik.setFieldValue("routeDate", row.routeDate);
  }


  function formatDate(dateString: string) {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  let delete_id = "";
  const accept = () => {
    const collectData = {
      routeID: parseInt(delete_id)
    };
    api
      .delete(`Route/DeleteRoute`, {
        data: collectData,
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchRouteDetailData();
      })
      .catch((error) => {
        console.error("Error deleting route:", error);
        toast.error("Failed to delete the route. Please try again.");
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    console.log(del_id + " del_id ");
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


  const fetchRouteDetailData = async () => {
    try {
      const collectData = {
        "routeID": -1
      };
      const response = await api.post(`Route/GetRoute`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchRouteDetailData ~ response.data.data:", response.data.data)
      const RouteWithIds = data.map((route: any, index: any) => ({
        ...route,
        serialNo: index + 1,
        id: route.routeID,
        routeDate: formatDate(route.routeDate)
      }));
      setItem(RouteWithIds);
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
                    onClick={() => handleEdit(params.row)}
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

          // {
          //   field: "srno",
          //   headerName: t("text.SrNo"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
          {
            field: "routeName",
            headerName: t("text.RouteName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "description",
            headerName: t("text.RouteDesc"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "routeDate",
            headerName: t("text.RouteDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },


        ];
        setColumns(columns as any);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));


  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh"
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            "& .MuiDataGrid-colCell": {
              backgroundColor: `var(--grid-headerBackground)`,
              color: `var(--grid-headerColor)`,
              fontSize: 17,
              fontWeight: 900
            },
          }}
          style={{ padding: "10px", }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.RouteDetail")}
          </Typography>
          <Divider />

          <Box height={10} />

          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterRouteName")}
                  value={formik.values.routeName}
                  onChangeText={(text: string) => formik.setFieldValue("routeName", text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.routeName && formik.errors.routeName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.routeName}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterRouteDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="routeDate"
                  id="routeDate"
                  value={formik.values.routeDate}
                  placeholder={t("text.EnterRouteDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.routeDate && formik.errors.routeDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.routeDate}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterRouteDesc")}
                  value={formik.values.description}
                  onChangeText={(text: string) => formik.setFieldValue("description", text)}
                  lang={lang}
                />
              </Grid>


              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.save")}
                </Button>
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e: any) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>

          <DataGrids
            isLoading={isLoading}
            rows={item}
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
