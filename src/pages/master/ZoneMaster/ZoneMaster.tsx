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

export default function ZoneMaster() {
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
    
    fetchZonesData();
  }, []);
  // }, [isLoading]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  // const routeChangeEdit = (row: any) => {
  //   console.log(row);
  //   formik.setFieldValue("zoneID", row.zoneID);
  //   formik.setFieldValue("zoneName", row.zoneName);
  //   formik.setFieldValue("zoneAbbrevation", row.zoneAbbrevation);
  //   formik.setFieldValue("isActive", row.isActive);
  //   setEditId(row.id);
  // };

  const routeChangeEdit = (row: any) => {
    api
      .post("zone", { Type: 3, ZoneID: row.id }) // Get by ID
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const zone = res.data.data[0];
  
          formik.setValues({
            Type: 2, // Update
            ZoneID: zone.ZoneID,
            ZoneName: zone.ZoneName,
            ZoneAbbrevation: zone.ZoneAbbrevation,
            CreatedBy: zone.CreatedBy,
            UpdatedBy: zone.UpdatedBy,
            CreatedOn: zone.CreatedOn,
            UpdatedOn: new Date().toISOString(),
            inst_id: zone.inst_id
          });
  
          setEditId(zone.ZoneID); // Set edit mode
        } else {
          toast.error("Zone not found");
        }
      })
      .catch(() => toast.error("Error fetching zone details"));
  };
  

  let delete_id = "";

  const accept = () => {
    api
      .post("zone", { Type: 2, ZoneID: delete_id }) // Delete request
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.data[0].message);
          fetchZonesData(); // Refresh list
        } else {
          toast.error("Failed to delete zone");
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

  const fetchZonesData = async () => {
    try {
      const todayDate = new Date().toLocaleDateString("en-GB").split('/').join('-'); // "08-03-2024" format
  
      const collectData = {
  
        Type: 4 // Capital 'T'
      };
  
      const response = await api.post(`zone`, collectData);
      const data = response.data.data;
  
      console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data);
  
      const zonesWithIds = data.map((zone: any, index: number) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.ZoneID,
      }));
  
      setZones(zonesWithIds);
      setIsLoading(false);
  
      if (data.length > 0) {
        const columns: GridColDef[] = [
          // {
          //   field: "actions",
          //   headerName: t("text.Action"),
          //   width: 150,
          //   renderCell: (params) => {
          //     return [
          //       <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
          //         {/* <EditIcon
          //           style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
          //           className="cursor-pointer"
          //           onClick={() => routeChangeEdit(params.row)}
          //         /> */}
          //       </Stack>,
          //     ];
          //   },
          // },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "ZoneName", headerName: t("text.zoneName"), flex: 1 },
          { field: "ZoneAbbrevation", headerName: t("text.zoneCode"), flex: 1 },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching zone data");
    }
  };
  
  

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const validationSchema = Yup.object({
    ZoneName: Yup.string().test(
      "required",
      t("text.reqZoneName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });


  const requiredFields = ["ZoneName"];
    const { defaultValuestime } = getISTDate();

    const formik = useFormik({
      initialValues: {
        Type: 1, // 1 = Add / Update
        ZoneID: 0, // Will be set when updating
        ZoneName: "",
        ZoneAbbrevation: "",
        CreatedBy: "",
        UpdatedBy: "",
        CreatedOn:defaultValuestime,
        UpdatedOn: defaultValuestime,
        inst_id: 1
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        // const todayDate = new Date().toLocaleDateString("en-GB").split('/').join('-');
      
        const finalValues = {
          ZoneID: editId !== 0 ? editId : -1,
          ZoneName: values.ZoneName,
          ZoneAbbrevation: values.ZoneAbbrevation,
          CreatedBy: "admin",
          UpdatedBy: "admin",
          CreatedOn: defaultValuestime,
          UpdatedOn: defaultValuestime,
          inst_id: 1,
          Type: 1 // Capital 'T'
        };
      
        api
          .post(`zone`, finalValues)
          .then((response) => {
            if (response.data.success) {
              if (response.data.data && response.data.data.length > 0) {
                toast.success(response.data.data[0].message); // If message is inside data array
              } else if (response.data.message) {
                toast.success(response.data.message); // If message is at root level
              } else {
                toast.success("Zone saved successfully"); // Default message
              }
      
              formik.resetForm();
              fetchZonesData(); // Refresh list
              setEditId(0); // Reset edit mode
            } else {
              toast.error("Failed to save zone");
            }
          })
          .catch((error) => {
            toast.error("Error: " + error.message); // .message to show error reason
          });
      },
      
      
      
      // onSubmit: async (values) => {
      //   values.ZoneID = editId !== 0 ? editId : -1; // Set ID for update
    
      //   api
      //     .post(`zone`, values)
      //     .then((response) => {
      //       if (response.data.success) {
      //         toast.success(response.data.data[0].message);
      //         formik.resetForm();
      //         fetchZonesData(); // Refresh list
      //         setEditId(0); // Reset edit mode
      //       } else {
      //         toast.error("Failed to update zone");
      //       }
      //     })
      //     .catch((error) => {
      //       toast.error("Error: " + error);
      //     });
      // },
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
                {t("text.zoneMaster")}
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
                  label={t("text.enterZoneName")}
                  value={formik.values.ZoneName}
                  onChangeText={(text: string) =>
                    handleConversionChange("ZoneName", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.ZoneName && formik.errors.ZoneName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ZoneName}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={5} lg={5}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterZoneCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="ZoneAbbrevation"
                  id="ZoneAbbrevation"
                  value={formik.values.ZoneAbbrevation}
                  placeholder={t("text.enterZoneCode")}
                  onChange={formik.handleChange}
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
}
