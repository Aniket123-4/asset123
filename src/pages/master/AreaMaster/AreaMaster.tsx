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
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import {
  GridColDef,
} from "@mui/x-data-grid";
import DataGrids from "../../../utils/Datagrids";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import * as Yup from "yup";
// import ZoneMaster from "../../Emailsystem/Emailsetting/Emailsettingmaster";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
export default function AreaMaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>("en");

  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);

  const [zoneValue, setZoneValue] = useState("");
  const [zoneOption, setzoneOption] = useState([
    { value: -1, label: t("text.zoneID") },
  ]);


  useEffect(() => {
    fetchAreaWardData();
    getzoneData();
  }, [isLoading]);

  const getzoneData = async () => {
    const collectData = {
      "zoneID": -1,
      "user_ID": "",
    };
    const response = await api.post(`Zone/GetZonemaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["zoneName"],
        value: data[index]["zoneID"],
      });
    }
    setzoneOption(arr);
  };


  const formik = useFormik({
    initialValues:
    {
      "activeClass": "",
      "all": true,
      "showExisting": true,
      "isSuccess": true,
      "message": "",
      "eScarp": true,
      "eScarpPrevValue": "",
      "css": "",
      "areaID": 0,
      "areaName": "",
      "wardNumber": "",
      "zoneID": null,
      "createdBy": "",
      "updatedBy": "",
      "createdOn": "2024-11-26T12:10:58.696Z",
      "updatedOn": "2024-11-26T12:10:58.696Z",
      "zoneMaster": {
        "zoneID": null,
        "zoneName": "",
        "zoneAbbrevation": "",
        "createdBy": "",
        "updatedBy": "",
        "createdOn": "2024-11-26T12:10:58.696Z",
        "updatedOn": "2024-11-26T12:10:58.696Z",
        "srno": 0,
        "checked": true
      },
      "srno": 0
    },

    validationSchema: Yup.object({
      areaName: Yup.string()
        .required(t("text.reqAreaname")),
      wardNumber: Yup.string()
        .required(t("text.reqWardNum")),
      zoneID: Yup.string()
        .required(t("text.reqZoneName"))
    }),

    onSubmit: async (values) => {
      try {
        const response = await api.post(`AreaWardMaster/AddUpdateAreaWardMaster`, values);
        if (response.data.status === 1) {
          formik.setFieldValue("areaName", "");
          formik.setFieldValue("wardNumber", "");
          formik.setFieldValue("zoneMater.zoneName", "");
          setZoneValue("");
          setToaster(false);
          toast.success(response.data.message);
        } else {
          setToaster(true);
          toast.error(response.data.message);
        }
        fetchAreaWardData();

      } catch (error) {
        setToaster(true);
        toast.error("An error occurred while saving. Please try again.");
        console.error("API Error:", error);
      }
    },
  });

  const handleEdit = (row: any) => {
    console.log("row:--", row);
    formik.setFieldValue("areaID", row.areaID);
    formik.setFieldValue("areaName", row.areaName);
    formik.setFieldValue("wardNumber", row.wardNumber);
    formik.setFieldValue("zoneMaster.zoneID", row.zoneMaster.zoneID);
    formik.setFieldValue("zoneMaster.zoneName", row.zoneMaster.zoneName);
    setZoneValue(row.zoneMaster.zoneName);
  }


  let delete_id = "";
  const accept = () => {
    const collectData = {
      "areaID": delete_id
    }
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`AreaWardMaster/DeleteAreaWardMaster`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.message);
        } else {
          toast.success(response.data.message);
        }
        fetchAreaWardData();
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




  const fetchAreaWardData = async () => {
    try {
      const collectData = {
        "areaID": -1
      };
      const response = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchAreaWardData ~ response.data.data:", response.data.data)
      const AreaWardIds = data.map((area: any, index: any) => ({
        ...area,
        serialNo: index + 1,
        id: area.areaID,
        zoneName: area.zoneMaster.zoneName,
      }));
      setItem(AreaWardIds);
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
          {
            field: "areaName",
            headerName: t("text.AreaName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "wardNumber",
            headerName: t("text.WardNumber"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "zoneName",
            headerName: t("text.Zone"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      //setLoading(false);
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
            {t("text.AreaWard")}
          </Typography>
          <Divider />
          <Box height={10} />

          <form onSubmit={formik.handleSubmit}>
            {toaster && <ToastApp />}
            <Grid container spacing={2}>

              {/* Zone Selection Autocomplete */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={zoneOption}
                  value={zoneValue}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("zoneID", newValue?.value.toString());
                    setZoneValue(newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.EnterZone")} required={true}/>}
                      name="zoneMaster.zoneID"
                      id="zoneMaster.zoneID"
                      placeholder={t("text.EnterZone")}
                      error={formik.touched.zoneMaster?.zoneID && Boolean(formik.errors.zoneMaster?.zoneID)}
                      helperText={formik.touched.zoneMaster?.zoneID && formik.errors.zoneMaster?.zoneID}
                    />
                  )}
                />
                {formik.touched.zoneID && formik.errors.zoneID && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.zoneID}</div>
                )}
              </Grid>


              {/* Ward Number Input */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterWardNumber")} required={true} />}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="wardNumber"
                  id="wardNumber"
                  value={formik.values.wardNumber}
                  placeholder={t("text.EnterWardNumber")}
                  onChange={formik.handleChange}
                />
                {formik.touched.wardNumber && formik.errors.wardNumber && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.wardNumber}</div>
                )}
              </Grid>

              {/* Area Name Input */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterAreaName")}
                  value={formik.values.areaName}
                  onChangeText={(text) => formik.setFieldValue("areaName", text)}
                  required
                  lang={lang}
                />
                {formik.touched.areaName && formik.errors.areaName && (
                  <div style={{ color: "red", margin: "5px" }}>{formik.errors.areaName}</div>
                )}
              </Grid>


              {/* Submit Button */}
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

              {/* Reset Button */}
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    formik.resetForm();
                    setZoneValue("");
                  }}
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
