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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
import { getId, getISTDate } from "../../../utils/Constant";
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

export default function BulkAssetDetail() {
  const { t } = useTranslation();
  const UserId = getId();
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

  const [assetTypeOptions, setAssetTypeOptions] = useState([]);

  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);

  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    fetchAssetTypes();
    getLocation();
    const timeout = setTimeout(() => {
      fetchZonesData();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isLoading]);


  const getLocation = async () => {
    const collectData = {
      Type: 4, // Fetch all zones

    };

    const response = await api.post("ward", collectData);

    if (response.data.success && response.data.data.length > 0) {
      const zoneList = response.data.data.map((zone: any) => ({
        label: zone.WardName,
        value: zone.WardNo
      }));
      setLocations(zoneList);
    } else {
      toast.warn("No zones available.");
      setLocations([]);
    }
  }

  const getAssetCode = () => {
    const arr: any = [];
    for (let i = 0; i < formik.values.totalqty; i++) {
      arr.push(`${formik.values.itemcode}0` + i);
    }
    setAssets(arr);
  }


  const fetchAssetTypes = async () => {
    try {
      const response = await api.post("ResourceType", {
        "Type": 4
      });

      if (response.data.success && response.data.data.length > 0) {
        const assetList = response.data.data.map((item: any) => {
          return { label: item.ResType, value: item.ID, ResourceTypeCode: item.ResCode };
        });

        setAssetTypeOptions(assetList);
      } else {
        toast.warn("No asset types available.");
        setAssetTypeOptions([]);
      }
    } catch (error) {
      console.error("Error fetching asset types:", error);
      toast.error("Failed to load asset types.");
    }
  };




  const formik = useFormik({
    initialValues: {
      "id": "-1",
      "assettypeid": "",
      "itemname": "",
      "itemcode": "",
      "totalqty": 0,
      "resids": "",
      "date": "2025-03-17",
      "inst_id": 0,
      "session": 0,
      "Type": 1
    },
    validationSchema: Yup.object({
      assettypeid: Yup.string().required(t("text.reqResourceType")),
    }),

    onSubmit: async (values) => {
      values.id = editId.toString();

      const response = await api.post(`BulkAssetDetails`, values);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchZonesData();
        formik.resetForm();
        setEditId(0);
      } else {
        toast.error(response.data.message);
      }
    },
  });


  const routeChangeEdit = (row: any) => {

    setEditId(row.id);
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      stateId: parseInt(delete_id),
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`StateMaster/DeleteState`, collectData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
          fetchZonesData();
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

  const fetchZonesData = async () => {
    try {
      const collectData = {
        "Type": 4
      };
      const response = await api.post(`manageBulkAsset`, collectData);
      const data = response.data.data;
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
            field: "resourcecode",
            headerName: t("text.AssetCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          //   ...(isStateCode ? [
          {
            field: "resourcename",
            headerName: t("text.AssetName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          // ] : []),
          {
            field: "countryName",
            headerName: t("text.DepreciatedRate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "fromDate",
            headerName: t("text.fromDate"),
            flex: .8,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "todate",
            headerName: t("text.toDate"),
            flex: .8,
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
                {t("text.BulkAssetDetail")}
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
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={assetTypeOptions}
                  fullWidth
                  size="small"
                  value={
                    assetTypeOptions.find(
                      (option: any) => option.value == formik.values.assettypeid
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("assettypeid", newValue?.value);

                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetType")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.assettypeid && formik.errors.assettypeid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.assettypeid}
                  </div>
                ) : null}

              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterAssetName")}
                  value={formik.values.itemname}
                  onChangeText={(text: string) =>
                    handleConversionChange("itemname", text)
                  }
                  lang={lang}
                />


              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterAssetcodeprefix")}

                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemcode"
                  id="itemcode"
                  value={formik.values.itemcode}
                  placeholder={t("text.EnterAssetcodeprefix")}
                  onChange={(e) => {
                    formik.setFieldValue("itemcode", e.target.value);
                  }}
                />


              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterTotalQuantity")}

                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="totalqty"
                  id="totalqty"
                  value={formik.values.totalqty}
                  placeholder={t("text.EnterTotalQuantity")}
                  onChange={(e) => {
                    formik.setFieldValue("totalqty", parseInt(e.target.value));
                    setIsVisible(true);
                    getAssetCode();
                  }}
                />


              </Grid>


              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectDate")}

                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="date"
                  id="date"
                  value={formik.values.date}
                  placeholder={t("text.SelectDate")}
                  onChange={(e) => {
                    formik.setFieldValue("date", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
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

          {/* <DataGrids
            isLoading={isLoading}
            rows={zones}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          /> */}
          {isVisible ? (
            <Grid item xs={12} sm={12} lg={12} sx={{ marginTop: "20px", margin: "10px" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: "#004466" }}>
                    <TableRow>
                      <TableCell style={{ color: "white", fontWeight: "bold" }}>Each Asset’s Code</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold", minWidth: "20rem" }}>Location</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold" }}>Model No.</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold" }}>Serial No.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset}</TableCell>
                        <TableCell sx={{ minWidth: "10rem" }}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={locations}
                            fullWidth
                            size="small"
                            onChange={(event, newValue: any) => {
                              console.log(newValue);

                              formik.setFieldValue("assettypeid", newValue?.value);

                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                              // label={
                              //   <CustomLabel
                              //     text={t("text.SelectAssetType")}
                              //   />
                              // }
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            name=""
                            id=""
                            //value={formik.values.totalqty}
                            onChange={(e) => {
                              // formik.setFieldValue("totalqty", parseInt(e.target.value));
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            fullWidth
                            size="small"
                            name=""
                            id=""
                            //value={formik.values.totalqty}
                            onChange={(e) => {
                              // formik.setFieldValue("totalqty", parseInt(e.target.value));
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : ""}

        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
