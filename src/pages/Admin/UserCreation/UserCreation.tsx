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
  FormControl,
  Radio,
  RadioGroup,
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
interface EmployeeData {
  Emp_id: number;
  Emp_firstname: string;
  Emp_middlename: string;
  Emp_lastname: string;
  Curr_Address: string;
  Personal_email: string;
  Mobile_no: string;
}
export default function UserCreation() {
  const { t } = useTranslation();
  const UserId = getId();
  const [isChecked, setIsChecked] = useState(false);

  const { defaultValues } = getISTDate();
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
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [RoleOptions, setRoleOptions] = useState([
    { value: -1, label: t("text.SelectRole") },
  ]);

  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const StatusOption = [

    { value: "Y", label: "Active" },
    { value: "N", label: "Sleep" },


  ];
  const majorGroupOptions = [
    { value: 1, label: "Admin" },
    { value: 2, label: "Student" },
    { value: 3, label: "Staff" },
    { value: 4, label: "Visitor" },
  ];

  useEffect(() => {
    getRoleData();
    fetchAssetTypes();
    fetchEmployeeDetail();
    const timeout = setTimeout(() => {
      //fetchZonesData();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const fetchEmployeeDetail = async () => {
    try {
      const response = await api.post("EmployeeDetail", {
        "Emp_id_1": -1,
        "EmpImage_38": "any",
        "empsign": "any",
        "EmployeeThumb": "any",
        "ThumbTemplate": "any",
        "ThumbTemplate2": "any",
        "EmployeeThumb2": "any",
        "ThumbTemplate3": "any",
        "ThumbTemplate4": "any",
        "Type": 4
      });

      if (response.data.success && response.data.data.length > 0) {
        const employeeList = response.data.data.map((emp: any) => {
          const fullName = `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname}`.replace(/\s+/g, ' ').trim();
          return {
            label: `${fullName} (${emp.Emp_Personal_code})`, // ✅ Show full name & code in dropdown
            value: emp.Emp_id, // ✅ Store Emp_id instead of Emp_Personal_code
            details: emp, // ✅ Store full employee details
          };
        });

        setEmployeeOptions(employeeList);
      } else {
        toast.warn("No employee data found.");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details.");
    }
  };



  const getRoleData = () => {
    const collectData = {
      "Type": 4
    };
    api.post(`RoleMaster`, collectData).then((res) => {
      const arr: { label: string; value: any }[] = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["RoleName"],
          value: res.data.data[index]["roleID"],
        });
      }
      setRoleOptions(arr);
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
      id: -1, // Default ID for new entry
      usertype: "y",
      userid: "",
      password: "",
      ins_id: 1,
      SaltVc: "",
      status: "y",
      Emp_id: "",
      ipAddress: "193",
      fromDate: defaultValues,
      toDate: defaultValues,
      MGCId: 1,
      MultiRoles: "", // Explicitly define the type
      Code: "",
      multiInstitute: "",
      parentuserid: 34,
      ReportPermission: "yes",
    },

    validationSchema: Yup.object({
      Emp_id: Yup.string().required(t("text.reqEmpName")),
      userid: Yup.string().required(t("text.requserid")),
      password: Yup.string().required(t("text.reqpassword")),
    }),

    onSubmit: async (values) => {
      // ✅ Filter only the required fields for API submission
      const payload = {
        id: values.id,
        usertype: values.usertype,
        userid: values.userid,
        password: values.password,
        ins_id: values.ins_id,
        SaltVc: values.password, // ✅ Ensure SaltVc uses the password value
        status: values.status,
        Emp_id: values.Emp_id,
        ipAddress: values.ipAddress,
        fromDate: values.fromDate,
        toDate: values.toDate,
        MGCId: values.MGCId,
        MultiRoles: values.MultiRoles,
        Code: values.Code,
        multiInstitute: values.multiInstitute,
        parentuserid: values.parentuserid,
        ReportPermission: values.ReportPermission,
      };

      console.log("Final Payload Sent to API:", payload); // Debugging ✅

      try {
        const response = await api.post(`UserCreation`, payload);
        if (response.data.success) {
          toast.success(response.data.message);
          formik.resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Error submitting form.");
      }
    },
  });




  const requiredFields = ["password", "userid", "Emp_id"];



  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };



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
                {t("text.UserCreation")}
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
                  size="small"
                  fullWidth
                  options={employeeOptions}
                  getOptionLabel={(option: any) => option.label}
                  onChange={(event, selectedEmployee) => {
                    if (selectedEmployee) {
                      const empData = selectedEmployee.details;
                      setEmployeeData(empData); // ✅ Store for UI updates

                      // ✅ Store only Emp_id in Formik
                      formik.setFieldValue("Emp_id", selectedEmployee.value);
                    } else {
                      setEmployeeData(null);
                      formik.setFieldValue("Emp_id", "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params}   label={<CustomLabel text={t("text.SelectEmployee")} />} variant="outlined" fullWidth />
                  )}
                />
              </Grid>


              {/* First Name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.FirstName")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Emp_firstname || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.MiddleName")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Emp_middlename || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.LastName")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Emp_lastname || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={8} lg={8}>
                <TextField
                  label={<CustomLabel text={t("text.Address")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Curr_Address || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.Email")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Personal_email || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.PhoneNo")} />}
                  size="small"
                  fullWidth
                  value={employeeData?.Mobile_no || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={majorGroupOptions
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("MGCId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectMajorGroup")}
                          required={false}
                        />
                      }
                    />
                  )}
                />


              </Grid>




              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StatusOption
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("status", newValue?.value.toString());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectStatus")}
                          required={false}
                        />
                      }
                    />
                  )}
                />

              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.Enterusername")}
                  value={formik.values.userid}
                  onChangeText={(text: string) =>
                    handleConversionChange("userid", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.userid && formik.errors.userid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.userid}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterPassword")}
                  value={formik.values.password}
                  onChangeText={(text: string) =>
                    handleConversionChange("password", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.password}
                  </div>
                ) : null}
              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  id="MultipleRoles-dropdown"
                  options={RoleOptions}
                  fullWidth
                  size="small"
                  value={RoleOptions.filter((option: any) =>
                    formik.values.MultiRoles.split(",").includes(option.value.toString())
                  )}
                  onChange={(event, newValues: any) => {
                    const selectedRoles = newValues.map((role: any) => role.value).join(",");
                    formik.setFieldValue("MultiRoles", selectedRoles);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.MultipleRoles")} required={false} />}
                    />
                  )}
                />
              </Grid>



              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectfromDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="fromDate"
                  id="fromDate"
                  value={formik.values.fromDate}
                  placeholder={t("text.SelectfromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("fromDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelecttoDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="toDate"
                  id="toDate"
                  value={formik.values.toDate}
                  placeholder={t("text.SelecttoDate")}
                  onChange={(e) => {
                    formik.setFieldValue("toDate", e.target.value);
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
          {/* 
          <DataGrids
            isLoading={isLoading}
            rows={zones}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          /> */}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
