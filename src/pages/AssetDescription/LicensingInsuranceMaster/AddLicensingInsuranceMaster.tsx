import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider, Table,
  MenuItem,
  TextField,
  Typography,
  TextareaAutosize,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  AutocompleteRenderInputParams,
  FormControl,
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getId, getISTDate } from "../../../utils/Constant";
import dayjs from "dayjs";
import TranslateTextField from "../../../TranslateTextField";
import nopdf from "../../../assets/images/imagepreview.jpg";

type Props = {};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const AddLicensingInsuranceMaster = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const requiredFields = ["stateName", "countryId"];
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const userId = getId();
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [itemValue, setItemValue] = useState();
  const [vendorValue, setVendorValue] = useState();
  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo") },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);

  const [assetCodeOptions, setAssetCodeOptions] = useState([]);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    // getVehicleDetails();
    // getVendorData();
    fetchAssets();
    fetchEmployeeDetail();
  }, []);



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
            label: fullName, // for showing in dropdown
            value: fullName, // store full name
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

  const fetchAssets = async () => {
    try {
      const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
      if (response.data.success) {
        setAssetCodeOptions(
          response.data.data.map((item: any) => ({
            label: `${item.ResourceCode}  (${item.ResourceName})`, // Display ResourceCode - ResourceName
            value: item.ID, // ID used as resid
          }))
        );
      } else {
        toast.warn("No assets found.");
      }
    } catch (error) {
      toast.error("Failed to load assets.");
    }
  };
  const formik = useFormik({
    initialValues: {

      "id_Lic": "-1",
      "VenderNameLic": "",
      "FdateLic": defaultValues,
      "TdateLic": defaultValues,
      "AmountLic": 0,
      "AttachmentLic": "",
      "NarrationLic": "",
      "PremiumDate": defaultValues,
      "PremiumAmount": null,
      "LicInsur": "licensing",
      "inst": "",
      "ses": "",
      "resid": null,
      "FileContent": "",
      "user_id": 0,
      "divisionid": 0,
      "FileAttachmentNew": "",
      "LastAttachIn": "",
      "Type": 1

    },

    validationSchema: Yup.object({
      // itemId: Yup.string()
      //   .required(t("text.reqVehNum")),
      VenderNameLic: Yup.string()
        .required(t("text.reqVendorName")),
      // fromDate: Yup.string()
      //   .required(t("text.reqFromDate")),
      PremiumAmount: Yup.string()
        .required(t("text.reqAmountLic")),
      resid: Yup.string()
        .required(t("text.reqasset")),
    }),


    onSubmit: async (values) => {
      const response = await api.post("Licensing_insuring", values); // Update with actual API
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/AssetDescription/LicensingInsuranceMaster"); // Redirect to list page
      } else {
        toast.error(response.data.message);
      }
    },
  });


  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: string) => {
    setPanOpen(true);
    const base64Prefix = "data:image/jpeg;base64,";

    let imageData = '';
    switch (event) {
      case "FileContent":
        imageData = formik.values.FileContent;
        break;
      default:
        imageData = '';
    }
    if (imageData) {
      const imgSrc = imageData.startsWith(base64Prefix) ? imageData : base64Prefix + imageData;
      console.log("imageData", imgSrc);
      setImg(imgSrc);
    } else {
      setImg('');
    }
  };

  const otherDocChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, params: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (only allow images)
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      alert("Only .jpg, .jpeg, or .png image files are allowed.");
      event.target.value = ''; // Clear input field
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;

      // Use regex to remove the base64 prefix dynamically
      const base64Content = base64String.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");

      if (base64Content) {
        formik.setFieldValue(params, base64Content); // Store the stripped base64 string
      } else {
        alert("Error processing image data.");
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    reader.readAsDataURL(file);
  };


  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>

          <Grid item xs={12} container spacing={2} >
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
                {t("text.AddLicensingInsurance")}
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
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid container spacing={2}>

              {/* RadioButton */}
              <Grid item xs={12} sm={12} lg={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="type"
                    name="LicInsur" // Correct name as per Formik field
                    value={formik.values.LicInsur}
                    onChange={(event) => formik.setFieldValue("LicInsur", event.target.value)}
                  >
                    <div style={{ display: "flex" }}>
                      <FormControlLabel value="licensing" control={<Radio />} label={t("text.Licensiing")} />
                      <FormControlLabel value="insurance" control={<Radio />} label={t("text.Insurance")} />
                    </div>
                  </RadioGroup>


                  {/* <RadioGroup
                                                          row
                                                          aria-label="type"
                                                          name="type"
                                                          value={formik.values.repairable}
                                                          onChange={(event) => formik.setFieldValue("repairable", event.target.value)}
                                                      >
                                                          <FormControlLabel
                                                              value="Y"
                                                              control={<Radio color="primary" />}
                                                              label={t("text.Yes")}
                  
                                                          />
                                                          <FormControlLabel
                                                              value="N"
                                                              control={<Radio color="primary" />}
                                                              label={t("text.No")}
                                                          />
                                                      </RadioGroup> */}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>

                <Autocomplete
                  disablePortal
                  id="asset-code-dropdown"
                  options={assetCodeOptions}
                  fullWidth
                  size="small"
                  value={assetCodeOptions.find((option: any) => option.value === (formik.values.resid)) || null} // FIXED matching
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("resid", newValue?.value || ""); // Set resid internally
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectAssetcode")}
                          required={true}
                        />
                      }

                    />
                  )}
                />

                {formik.touched.resid && formik.errors.resid ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.resid}
                  </div>
                ) : null}
              </Grid>


              {/* Vendor */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="VenderNameLic"
                  options={employeeOptions}
                  fullWidth
                  size="small"
                  value={
                    employeeOptions.find((option: any) => option.value === formik.values.VenderNameLic) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("VenderNameLic", newValue?.value || ""); // store name
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectVendor")}
                          required={true}
                        // required={requiredFields.includes("UndrProcession_27")}
                        />
                      }
                    />
                  )}
                />
                 {formik.touched.VenderNameLic && formik.errors.VenderNameLic ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.VenderNameLic}
                                    </div>
                                ) : null}



              </Grid>


              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectfromDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="FdateLic"
                  id="FdateLic"
                  value={formik.values.FdateLic}
                  placeholder={t("text.SelectfromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("FdateLic", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.FdateLic && formik.errors.FdateLic ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.FdateLic}
                  </div>
                ) : null}

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelecttoDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="TdateLic"
                  id="TdateLic"
                  value={formik.values.TdateLic}
                  placeholder={t("text.SelecttoDate")}
                  onChange={(e) => {
                    formik.setFieldValue("TdateLic", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.TdateLic && formik.errors.TdateLic ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.TdateLic}
                  </div>
                ) : null}
              </Grid>



              {/* narration */}
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnterNarration")}
                  value={formik.values.NarrationLic}
                  onChangeText={(text: string) => formik.setFieldValue("NarrationLic", text)}
                  required={false}
                  lang={lang}
                />

              </Grid>
              {/* effective data */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectLicensingDate")}
                      required={true}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="PremiumDate"
                  id="PremiumDate"
                  value={formik.values.PremiumDate}
                  placeholder={t("text.SelectLicensingDate")}
                  onChange={(e) => {
                    formik.setFieldValue("PremiumDate", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.PremiumDate && formik.errors.PremiumDate ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.PremiumDate}
                  </div>
                ) : null}
              </Grid>


              {/* amount */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterLicensingAmount")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="PremiumAmount"
                  id="PremiumAmount"
                  value={formik.values.PremiumAmount}
                  placeholder={t("text.EnterLicensingAmount")}
                  onChange={(e) => {
                    formik.setFieldValue("PremiumAmount", parseInt(e.target.value));
                  }}
                />
                {formik.touched.PremiumAmount && formik.errors.PremiumAmount ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.PremiumAmount}
                  </div>
                ) : null}

              </Grid>
              <Grid item lg={8} sm={8} xs={12}></Grid>


              {/* attachment */}
              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.Attachment")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e: any) => otherDocChangeHandler(e, "FileContent")}
                  />
                </Grid>

                <Grid xs={12} md={4} sm={4} item></Grid>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.FileContent ? (
                    <img
                      src={
                        /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.FileContent)
                          ? formik.values.FileContent
                          : `data:image/jpeg;base64,${formik.values.FileContent}`
                      }
                      alt="Complaint Document Preview"
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                        objectFit: "cover",  // Ensures proper scaling
                      }}
                    />
                  ) : (
                    <img
                      src={nopdf}
                      alt="No document available"
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  )}

                  <Typography
                    onClick={() => modalOpenHandle("FileContent")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                      padding: "20px",
                    }}
                    role="button"
                    aria-label="Preview Document"
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>


                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {Img ? (
                      <img
                        src={Img}
                        alt="Preview"
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <Typography>No Image to Preview</Typography>
                    )}
                  </Box>
                </Modal>
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
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>

            </Grid>

          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default AddLicensingInsuranceMaster;