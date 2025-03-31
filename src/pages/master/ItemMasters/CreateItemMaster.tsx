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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
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
// import CustomDataGrids from "../../../utils/CustomDataGrids";
import CustomDataGrid from "../../../utils/CustomDatagrid";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function CreateItemmaster() {
  const { t } = useTranslation();
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [option, setOption] = useState<any>([]);
  const [taxOptions, setTaxOptions] = useState<any>([]);
  const [employeeOptions, setemployeeOptions] = useState<any>([]);
  const [itemCategoryOptions, setitemCategoryOptions] = useState<any>([]);
  const [unitOptions, setUnitOptions] = useState<any>([]);
  const [itemgroupOptions, setitemgroupOptions] = useState<any>([]);

  useEffect(() => {
    GetitemCategoryData();
    GetEmployeeData();
    // fetchZonesData();
    GetItemTypeData();
    GetTaxData();
    GetUnitData();
    GetItemGroupData();
  }, []);
  // }, [isLoading]);  SelectEmployeeName

  const GetEmployeeData = async () => {
    const collectData = {
      "empid": -1,
      "userId": "",
      "empName": "",
      "empMobileNo": "",
      "empDesignationId": -1,
      "empDeptId": -1,
      "empStateId": -1,
      "empCountryID": -1,
      "empCityId": -1,
      "empPincode": 0,
      "roleId": ""
    };
    const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["empName"],
        value: data[index]["empid"],
      });
    }
    setemployeeOptions([{ value: "-1", label: t("text.SelectEmployeeName") }, ...arr]);
  }
  const GetItemGroupData = async () => {
    const collectData = {
      groupid: -1,
    };
    const response = await api.post(`ItemGroup/GetItemGroup`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["group_name"],
        value: data[index]["groupid"],
      });
    }
    setitemgroupOptions([{ value: "-1", label: t("text.selectGroup") }, ...arr]);
  };

  const GetItemTypeData = async () => {
    const collectData = {
      itemTypeMasterId: -1,
    };
    const response = await api.post(`ItemType/GetItemTypeMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemType"],
        value: data[index]["itemTypeMasterId"],
      });
    }
    setOption([{ value: "-1", label: t("text.selectitemTypeId") }, ...arr]);
  };


  const GetitemCategoryData = async () => {
    const collectData = {
      itemCategoryId: -1,
    };
    const response = await api.post(`ItemCategory/GetItemCategoryMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemCategory"],
        value: data[index]["itemCategoryId"],
      });
    }
    setitemCategoryOptions([{ value: "-1", label: t("text.selectItemCategory") }, ...arr]);
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };


  const GetTaxData = async () => {
    const collectData = {
      taxId: -1,
    };
    const response = await api.post(`TaxMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxName"],
        value: data[index]["taxId"],
      });
    }
    setTaxOptions([{ value: "-1", label: t("text.tax") }, ...arr]);
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
    }
    setUnitOptions([{ value: "-1", label: t("text.selectUnit") }, ...arr]);
  };




  const validationSchema = Yup.object().shape({
    itemName: Yup.string()
      .required(t("text.itemNameRequired"))
      .min(2, t("text.itemNameMin"))
      .max(100, t("text.itemNameMax")),
  });

  const formik = useFormik({
    initialValues: {
      itemMasterId: -1,
      itemName: "",
      itemCode: "",
      itemCategoryId: "",
      itemFlag: "",
      itemTypeId: "",
      empId: "0",
      taxId: "",
      purchaseYear: "2024",
      unitId: "",
      // modelNo: "",
      serialNo: "",
      vehicleNo: "",
      // chesisNo: "",
      qcApplicable: true,
      hsnCode: "",
      itemWeight: "",
      depreciationRate: "",
      createdBy: Userid,
      updatedBy: Userid,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      itemGroupId: "",
      watt: "",
      volt: "",
      wire: "",
      wight: "",
      itemColor: "",
      itemImg: "",
      powerSource: "",
      genericName: "",
      manufacture: "",
      itemDimention: "",
      underGroundPoleHight: "",
      num_Of_Light_Attach: "",
      currentStatus: "",
      countryOfOrigen: "",
      qc: true
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post("ItemMaster/AddUpdateItemMaster", values);
      if (response.data.isSuccess) {
        formik.resetForm();
        // fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const back = useNavigate();

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

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.createitemMaster")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
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
            {/* <Grid container spacing={2}> */}
            {/* First Row */}
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.enteritemName")}
                  value={formik.values.itemName}
                  onChangeText={(text) => handleConversionChange("itemName", text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.itemName && formik.errors.itemName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.itemName}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemCode"
                  id="itemCode"
                  value={formik.values.itemCode}
                  placeholder={t("text.enteritemCode")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemgroupOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemGroupId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectGroup")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemCategoryOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemCategoryId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectItemCategory")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemTypeId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectitemTypeId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>


              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={employeeOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue:any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("empId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectEmployeeName")}
                        />
                      }
                    />
                  )}
                />

              </Grid> */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={unitOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("unitId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.selectUnit")}
                        />
                      }
                    />
                  )}
                />
              </Grid>



              {/* <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemCategoryOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("itemCategoryId", newValue?.value);
                  }}
                  value={
                    itemCategoryOptions.find(
                      (opt) => opt.value === formik.values.itemCategoryId
                    ) || null
                  }
                  // value={}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.itemCategory")}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}


              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterpurchaseYear")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="purchaseYear"
                  id="purchaseYear"
                  value={formik.values.purchaseYear}
                  placeholder={t("text.enterpurchaseYear")}
                  onChange={formik.handleChange}
                />
              </Grid> */}


              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterserialNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="serialNo"
                  id="serialNo"
                  value={formik.values.serialNo}
                  placeholder={t("text.enterserialNo")}
                  onChange={(e: any) => formik.setFieldValue("serialNo", e.target.value.toString())}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entervehicleNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="vehicleNo"
                  id="vehicleNo"
                  value={formik.values.vehicleNo}
                  placeholder={t("text.entervehicleNo")}
                  onChange={formik.handleChange}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterhsnCode")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="hsnCode"
                  id="hsnCode"
                  value={formik.values.hsnCode}
                  placeholder={t("text.enterhsnCode")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemWeight")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemWeight"
                  id="itemWeight"
                  value={formik.values.itemWeight}
                  placeholder={t("text.enteritemWeight")}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterweight")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="wight"
                  id="wight"
                  value={formik.values.wight}
                  placeholder={t("text.enterweight")}
                  onChange={formik.handleChange}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterdepreciationRate")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="depreciationRate"
                  id="depreciationRate"
                  value={formik.values.depreciationRate}
                  placeholder={t("text.enterdepreciationRate")}
                  onChange={(e) => formik.setFieldValue("depreciationRate", Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("taxId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.tax")}
                        />
                      }
                    />
                  )}
                />
              </Grid>






              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterwatt")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="watt"
                  id="watt"
                  value={formik.values.watt}
                  placeholder={t("text.enterwatt")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entervolt")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="volt"
                  id="volt"
                  value={formik.values.volt}
                  placeholder={t("text.entervolt")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterwire")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="wire"
                  id="wire"
                  value={formik.values.wire}
                  placeholder={t("text.enterwire")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemColor")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemColor"
                  id="itemColor"
                  value={formik.values.itemColor}
                  placeholder={t("text.enteritemColor")}
                  onChange={formik.handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemImg")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemImg"
                  id="itemImg"
                  value={formik.values.itemImg}
                  placeholder={t("text.enteritemImg")}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterpowerSource")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="powerSource"
                  id="powerSource"
                  value={formik.values.powerSource}
                  placeholder={t("text.enterpowerSource")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entergenericName")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="genericName"
                  id="genericName"
                  value={formik.values.genericName}
                  placeholder={t("text.entergenericName")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entermanufacture")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="manufacture"
                  id="manufacture"
                  value={formik.values.manufacture}
                  placeholder={t("text.entermanufacture")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enteritemDimention")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemDimention"
                  id="itemDimention"
                  value={formik.values.itemDimention}
                  placeholder={t("text.enteritemDimention")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enterunderGroundPoleHight")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="underGroundPoleHight"
                  id="underGroundPoleHight"
                  value={formik.values.underGroundPoleHight}
                  placeholder={t("text.enterunderGroundPoleHight")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.enternum_Of_Light_Attach")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="num_Of_Light_Attach"
                  id="num_Of_Light_Attach"
                  value={formik.values.num_Of_Light_Attach}
                  placeholder={t("text.enternum_Of_Light_Attach")}
                  onChange={formik.handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entercurrentStatus")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="currentStatus"
                  id="currentStatus"
                  value={formik.values.currentStatus}
                  placeholder={t("text.entercurrentStatus")}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.entercountryOfOrigen")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="countryOfOrigen"
                  id="countryOfOrigen"
                  value={formik.values.countryOfOrigen}
                  placeholder={t("text.entercountryOfOrigen")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item sm={8} md={8} lg={8}>

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

          {/* {isLoading ? (
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
          )} */}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
};