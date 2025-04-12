
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
  FormControlLabel,
  Checkbox,
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

export default function AssetInformation() {
  const { t } = useTranslation();
  const UserId = getId();
  const [isChecked, setIsChecked] = useState(false);

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

  const [isStateCode, setIsStateCode] = useState(true);

  const [zoneOption, setZoneOption] = useState([
    { value: -1, label: t("text.SelectZone") },
  ]);
  const [deptOption, setDeptOption] = useState([
    { value: -1, label: t("text.SelectDept") },
  ]);
  const [wardOption, setWardOption] = useState([
    { value: -1, label: t("text.SelectWard") },
  ]);
  const [assetTypeOptions, setAssetTypeOptions] = useState([]);


  useEffect(() => {
    getZoneData();
    getDeptData();
    getWardData();
    fetchAssetTypes();

    const timeout = setTimeout(() => {
      fetchZonesData();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isLoading]);


  const getZoneData = () => {
    const collectData = {
      "ZoneID": -1,
      "ZoneName": "",
      "ZoneAbbrevation": "",
      "CreatedBy": "",
      "UpdatedBy": "",
      "CreatedOn": "08-03-2024",
      "UpdatedOn": "08-03-2024",
      "inst_id": 0,
      "Type": 4
    };
    api.post(`zone`, collectData).then((res) => {
      const arr: any = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["ZoneName"],
          value: res.data.data[index]["ZoneID"],
        });
      }
      setZoneOption(arr);
    });
  }

  const getDeptData = () => {
    const collectData = {
      "type": 4
    };
    api.post(`department`, collectData).then((res) => {
      const arr: any = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["dept_name"],
          value: res.data.data[index]["dept_id"],
        });
      }
      setDeptOption(arr);
    });
  }

  const getWardData = () => {
    const collectData = {
      "Type": 4
    };
    api.post(`ward`, collectData).then((res) => {
      const arr: any = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["WardName"],
          value: res.data.data[index]["WardNo"],
        });
      }
      setWardOption(arr);
    });
  }

  const fetchAssetTypes = async () => {
    try {
      const response = await api.post("ResourceType", {
        "ID": -1,
        "ResType": "",
        "ResCode": "",
        "inst_id": "",
        "user_id": "",
        "ses_id": "",
        "divisionId": "",
        "ParentId": "",
        "Type": 4
      });

      if (response.data.success && response.data.data.length > 0) {
        const assetMap = new Map();
        const assetList = response.data.data.map((item: any) => {
          assetMap.set(item.ID, item.ResType); // ✅ Map AssetType ID → ResourceType
          return { label: item.ResType, value: item.ID, ResourceTypeCode: item.ResCode };
        });

        setAssetTypeOptions(assetList);

        console.log("Asset Type Map:", assetMap); // ✅ Debugging log
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
      "id": -1,
      "ResourceCode": "",
      "ResourceType": "",
      "ModelNo": "",
      "DepriciationRate": 0,
      "ResourceName": "",
      "ResourceTypeCode": "",
      "SrNo": "",
      "LedgerName": "",
      "LedgerDesc": "",
      "ItemName": "",
      "ItemDesc": "",
      "entrydate": defaultValuestime,
      "flag": "",
      "deptid": 0,
      "wardid": 0,
      "ZoneId": 0,
      "Type": 1
    },
    validationSchema: Yup.object({
      ResourceType: Yup.string()
        .required(t("text.reqAssetType")),
      ResourceName: Yup.string()
        .required(t("text.reqAssetName")),
      ResourceCode: Yup.string()
        .required(t("text.reqasset")),
    }),
    onSubmit: async (values) => {
      values.id = editId;

      const response = await api.post(`ResourceDetail`, values);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchZonesData();
        formik.resetForm();

        setEditId(0);
      } else {
        toast.success(response.data.message);
      }
    },
  });

  const requiredFields = ["stateName", "countryId"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("ResourceCode", row.ResourceCode);
    formik.setFieldValue("ResourceType", row.ResourceType);
    formik.setFieldValue("ModelNo", row.ModelNo);
    formik.setFieldValue("DepriciationRate", row.DepriciationRate);
    formik.setFieldValue("ResourceName", row.ResourceName);
    formik.setFieldValue("ResourceTypeCode", row.ResourceTypeCode);
    formik.setFieldValue("SrNo", row.SrNo);
    formik.setFieldValue("LedgerName", row.LedgerName);
    formik.setFieldValue("LedgerDesc", row.LedgerDesc);
    formik.setFieldValue("ItemName", row.ItemName);
    formik.setFieldValue("ItemDesc", row.ItemDesc);
    formik.setFieldValue("entrydate", row.entrydate);
    formik.setFieldValue("deptid", row.deptid);
    formik.setFieldValue("wardid", row.wardid);
    formik.setFieldValue("ZoneId", row.ZoneId);
    formik.setFieldValue("Type", 2);
    formik.setFieldValue("flag", "I");


    setEditId(row.id);
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      Type: 5,
      flag: "d",
      id: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`ResourceDetail`, collectData)
      .then((response) => {
        if (response.data.success) {
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
      const response = await api.post(`ResourceDetail`, collectData);
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.ID,
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
                  {/* <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row.id);
                    }}
                  /> */}
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
            flex: .5,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "ResourceCode",
            headerName: t("text.ResourceCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "ResourceName",
            headerName: t("text.ResourceName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "ResourceType",
            headerName: t("text.ResourceType"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          }

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
                {t("text.AssetInformation")}
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
                {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  value={
                    option.find(
                      (option: any) => option.value === formik.values.ResourceCode
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("ResourceCode", newValue?.value);
                    formik.setFieldValue("ResourceCode", newValue?.label);

                    // formik.setFieldTouched("zoneID", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetcode")}
                          required={requiredFields.includes("ResourceCode")}
                        />
                      }
                    />
                  )}
                /> */}

                <TextField
                  label={<CustomLabel text={t("text.enterAssetcode")} required={true} />}
                  value={formik.values.ResourceCode}
                  name="ResourceCode"
                  id="ResourceCode"
                  placeholder={t("text.enterAssetcode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ResourceCode && formik.errors.ResourceCode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ResourceCode}
                  </div>
                ) : null}
              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterAssetName")}
                  value={formik.values.ResourceName}
                  onChangeText={(text: string) =>
                    handleConversionChange("ResourceName", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.ResourceName && formik.errors.ResourceName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ResourceName}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={assetTypeOptions}
                  fullWidth
                  size="small"
                  value={
                    formik.values.ResourceType

                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("ResourceType", newValue?.label);
                    formik.setFieldValue("ResourceTypeCode", newValue?.ResourceTypeCode);

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
                {formik.touched.ResourceType && formik.errors.ResourceType ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ResourceType}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterAssetTypeCode")} />}
                  value={formik.values.ResourceTypeCode}
                  name="ResourceTypeCode"
                  id="ResourceTypeCode"
                  placeholder={t("text.EnterAssetTypeCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterModelNo")} />}
                  value={formik.values.ModelNo}
                  name="ModelNo"
                  id="ModelNo"
                  placeholder={t("text.EnterModelNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterSerialNo")} />}
                  value={formik.values.SrNo}
                  name="SrNo"
                  id="SrNo"
                  placeholder={t("text.EnterSerialNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterDepreciatedRate")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="DepriciationRate"
                  id="DepriciationRate"
                  value={formik.values.DepriciationRate}
                  placeholder={t("text.EnterDepreciatedRate")}
                  onChange={(e) => {
                    formik.setFieldValue("DepriciationRate", parseInt(e.target.value || "0"));
                  }}
                />

              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={deptOption}
                  fullWidth
                  size="small"
                  value={
                    deptOption.find(
                      (option: any) => option.value == formik.values.deptid
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);
                    formik.setFieldValue("deptid", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDepartment")}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.deptid && formik.errors.deptid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.deptid}
                  </div>
                ) : null}
              </Grid> */}

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={zoneOption}
                  fullWidth
                  size="small"
                  value={
                    zoneOption.find(
                      (option: any) => option.value == formik.values.ZoneId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("ZoneId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectZone")}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.ZoneId && formik.errors.ZoneId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ZoneId}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={wardOption}
                  fullWidth
                  size="small"
                  value={
                    wardOption.find(
                      (option: any) => option.value === formik.values.wardid
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("wardid", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectWard")}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.wardid && formik.errors.wardid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.wardid}
                  </div>
                ) : null}
              </Grid> */}

              {/* <Grid item lg={3} md={6} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                  }
                  label={t("text.LedgerDetail")}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
              </Grid>
              {isChecked && (<>
                <Grid item xs={12} sm={4} lg={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={option}
                    fullWidth
                    size="small"
                    value={
                      option.find(
                        (option: any) => option.value === formik.values.LedgerName
                      ) || null
                    }
                    onChange={(event, newValue: any) => {
                      console.log(newValue);

                      formik.setFieldValue("LedgerName", newValue?.value);
                      // formik.setFieldValue("LedgerName", newValue?.label);

                      // formik.setFieldTouched("zoneID", true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.SelectledgerName")}
                            required={requiredFields.includes("LedgerName")}
                          />
                        }
                      />
                    )}
                  />
                  {formik.touched.LedgerName && formik.errors.LedgerName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.LedgerName}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={12} sm={8} lg={8}>
                  <TranslateTextField
                    label={t("text.EnterledgerDescription")}
                    value={formik.values.LedgerDesc}
                    onChangeText={(text: string) =>
                      handleConversionChange("LedgerDesc", text)
                    }
                    required={true}
                    lang={lang}
                  />

                  {formik.touched.LedgerDesc && formik.errors.LedgerDesc ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.LedgerDesc}
                    </div>
                  ) : null}
                </Grid>


                <Grid item xs={12} sm={4} lg={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={option}
                    fullWidth
                    size="small"
                    value={
                      option.find(
                        (option: any) => option.value === formik.values.ItemName
                      ) || null
                    }
                    onChange={(event, newValue: any) => {
                      console.log(newValue);

                      // formik.setFieldValue("ItemName", newValue?.value);
                      formik.setFieldValue("ItemName", newValue?.label);

                      // formik.setFieldTouched("zoneID", true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.SelectItemName")}
                            required={requiredFields.includes("ItemName")}
                          />
                        }
                      />
                    )}
                  />
                  {formik.touched.ItemName && formik.errors.ItemName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.ItemName}
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={8} lg={8}>
                  <TranslateTextField
                    label={t("text.EnterItemDescription")}
                    value={formik.values.ItemDesc}
                    onChangeText={(text: string) =>
                      handleConversionChange("ItemDesc", text)
                    }
                    required={true}
                    lang={lang}
                  />

                  {formik.touched.ItemDesc && formik.errors.ItemDesc ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.ItemDesc}
                    </div>
                  ) : null}
                </Grid>
              </>
              )} */}


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
