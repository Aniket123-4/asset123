import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import { getISTDate, getId } from '../../../utils/Constant'
import TranslateTextField from "../../../TranslateTextField";
import ZoneMaster from "../ZoneMaster/ZoneMaster";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function WardMaster() {
  const UserId = getId();
  const { defaultValuestime } = getISTDate();
  const { t } = useTranslation();
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ZoneOption, setZoneOption] = useState<any>([]);
  const [editId, setEditId] = useState(-1);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();

  useEffect(() => {

    //getList();
    getVehicleZone();
  }, []);
  // }, [isLoading]);



  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {

    console.log('checkvalue', value)

    const collectData = {
      WardNo: value.WardNo,
      WardName: value.WardName,
      Zone: null,
      Type: 0,

    };
    api
      .post(`ward`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };

  let delete_id = "";

  // const accept = () => {
  //   api.post("ward", { Type: 2, WardNo: delete_id }) // Delete request
  //     .then((response) => {
  //       if (response.data.success) {
  //         toast.success(response.data.data[0].Msg);
  //         getList(); // Refresh list
  //       } else {
  //         toast.error("Failed to delete ward");
  //       }
  //     });
  // };


  const accept = () => {
    api.post("ward", { Type: 2, WardNo: delete_id })
      .then((response) => {
        if (response.data.success) {
          // Access message directly
          toast.success(response.data.message); // "Department deleted successfully."
          getList(); // Refresh list
        } else {
          toast.error("Failed to delete ward");
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Error deleting ward");
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

  const getList = async () => {
    try {
        const collectData = { Type: 4 };
        
        // Fetch wards
        const response = await api.post(`ward`, collectData);
        const wardData = response.data.data;

        // Fetch zones
        const zoneResponse = await api.post(`zone`, collectData);
        const zoneList = zoneResponse.data.data;

        // Create a mapping of ZoneID to ZoneName
        const zoneMap = new Map(zoneList.map((z: any) => [z.ZoneID, z.ZoneName]));

        // Map wards data and replace ZoneID with ZoneName
        const wardsWithNames = wardData.map((ward: any, index: any) => ({
            ...ward,
            serialNo: index + 1,
            id: ward.WardNo,
            ZoneName: zoneMap.get(ward.Zone) || "Unknown", // Get ZoneName from map
        }));

        setRows(wardsWithNames);
        setIsLoading(false);

        if (wardData.length > 0) {
            const columns: GridColDef[] = [
                {
                    field: "actions",
                    headerName: t("text.Action"),
                    width: 150,
                    renderCell: (params) => (
                        <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
                            <EditIcon
                                style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                                onClick={() => routeChangeEdit(params.row)}
                            />
                            <DeleteIcon
                                style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                                onClick={() => handledeleteClick(params.row.id)}
                            />
                        </Stack>
                    ),
                },
                { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
                { field: "WardName", headerName: t("text.wardName"), flex: 1 },
                { field: "ZoneName", headerName: t("text.zoneName"), flex: 1 }, // Show ZoneName instead of ZoneID
            ];
            setColumns(columns as any);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load ward data.");
    }
};



  const routeChangeEdit = (row: any) => {
    api.post("ward", { Type: 3, WardNo: row.id }) // Fetch ward by ID
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const ward = res.data.data[0];

          formik.setValues({
            Type: 1, // Update request type
            WardNo: ward.WardNo,
            WardName: ward.WardName,
            Zone: ward.Zone,
          });

          // Find the selected zone name from ZoneOption list
          const selectedZone = ZoneOption.find((zone: any) => zone.value === ward.Zone);

          if (selectedZone) {
            formik.setFieldValue("zoneName", selectedZone.label); // Set Zone Name
          }

          setEditId(ward.WardNo); // Set edit mode
        } else {
          toast.error("Ward not found");
        }
      })
      .catch(() => toast.error("Error fetching ward details"));
  };



  const getVehicleZone = async () => {
    try {
      const collectData = {
        Type: 4, // Fetch all zones

      };

      const response = await api.post("zone", collectData);

      if (response.data.success && response.data.data.length > 0) {
        const zoneList = response.data.data.map((zone: any) => ({
          label: zone.ZoneName, // Display ZoneName in dropdown
          value: zone.ZoneID, // Store ZoneID
        }));

        setZoneOption(zoneList);
      } else {
        toast.warn("No zones available.");
        setZoneOption([]);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      toast.error("Failed to load zones.");
    }
    getList();
  };


  const validationSchema = Yup.object({
    zoneID: Yup.string().test(
      'required',
      t('text.reqZoneName'),
      function (value: any) {
        return value && value.trim() !== '';
      }),
    wardName: Yup.string().test(
      'required',
      t('text.reqWard'),
      function (value: any) {
        return value && value.trim() !== '';
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      Type: 1, // Type 1 for Add/Update
      WardNo: 0, // Set in Edit mode
      WardName: "",
      Zone: -1
    },
    validationSchema: Yup.object({
      WardName: Yup.string().required(t("text.reqWard")),
      // WardNo: Yup.number().required(t("text.reqWardNo")),
      // Zone: Yup.number().required(t("text.reqZone")),
    }),
    onSubmit: async (values) => {
      values.WardNo = editId !== -1 ? editId : 0; // If editing, keep existing ID
      values.Type = 1; // Type 2 for update, Type 1 for add

      api.post(`ward`, values)
        .then((response) => {
          if (response.data.success) {
            // ✅ Access message directly
            toast.success(response.data.message); // Shows "WARD DETAILS SAVED SUCCESSFULLY"
            formik.resetForm();
            getList(); // Refresh list
            setEditId(-1); // Reset edit mode
          } else {
            toast.error("Failed to update ward");
          }
        })
        .catch((error) => {
          toast.error("Error: " + error);
        });
    },
  });


  const requiredFields = ["Zone", "WardName"];

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  return (
    <>

      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
          marginTop: "3vh"
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          style={{ padding: "10px", }}
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
                {t("text.wardMaster")}
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

              <Grid xs={5} sm={5} item>
                <Autocomplete
                  disablePortal
                  id="zone-dropdown"
                  options={ZoneOption} // Uses zones fetched from API
                  value={ZoneOption.find((option: any) => Number(option.value) === Number(formik.values.Zone)) || null}

                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("Zone", newValue?.value); // Set Zone ID
                    formik.setFieldValue("zoneName", newValue?.label); // Set Zone Name
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.SelectZoneName")} />} />
                  )}
                />

              </Grid>

              <Grid xs={5} sm={5} item>

                <TranslateTextField
                  label={t("text.enterWardName")}
                  value={formik.values.WardName}
                  onChangeText={(text: string) => handleConversionChange('WardName', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.WardName && formik.errors.WardName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.WardName}
                  </div>
                ) : null}

              </Grid>

              {/* <Grid xs={3.5} sm={3.5} item>
                <TextField
                  type="text"
                  value={formik.values.WardNo}
                  name="WardNo"
                  id="WardNo"
                  label={<CustomLabel text={t("text.enterWardNo")} />}
                  placeholder={t("text.enterWardNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}


              <Grid item xs={2} sx={{ m: -1 }}>


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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <DataGrids
            isLoading={isLoading}
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />

        </Paper>
      </Card>


      <ToastApp />
    </>
  );
}
