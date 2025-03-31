import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Grid,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  Autocomplete,
  ListItemText,
} from "@mui/material";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import CustomLabel from "../../../CustomLable";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import Logo from "../../../assets/images/KanpurLogo.png";
import { getISTDate } from "../../../utils/Constant";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function JobCardStatus() {
  const StatusOption = [
    // { value: "-1", label: "select Option" },
    { value: "Complete", label: "Complete" },
    { value: "InProgress", label: "InProgress" },
    { value: "JobWork", label: "JobWork" },
  ];
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const {defaultValues} = getISTDate();

  const [option, setOption] = useState([
    { value: "-1", label: "Vehicle Type" },
  ]);

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vNO, setVno] = useState("");
  const [sNO, setsno] = useState("");

  const [vType, setVType] = useState([]);

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };
  const formik = useFormik({
    initialValues: {
      genderID: -1,
      genderName: "",
      genderCode: "",
      jobcarddatefrom: defaultValues,
      jobcarddateto: defaultValues,
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
      JobCardNoFrom: "",
      JobCardNoTo: "",
      complaintfrom: defaultValues,
      complaintTo: defaultValues,
    },

    validationSchema: Yup.object({
      complaintTo: Yup.string()
        .required("Complaint To date required"),
      complaintfrom: Yup.string()
        .required("Complaint from date required"),
      jobcarddatefrom: Yup.string()
        .required("Jobcard from date required"),
      jobcarddateto: Yup.string()
        .required("Jobcard  to date  required"),
    }),
    onSubmit: async (values) => {
      //   const response = await api.post(
      //     `Gender/AddUpdateGenderMaster`,
      //     values
      //   );
      //   try {
      //     setToaster(false);
      //     toast.success(response.data.mesg);
      //     navigate("/master/GenderMaster");
      //   } catch (error) {
      //     setToaster(true);
      //     toast.error(response.data.mesg);
      //   }
    },
  });
  const handleDownload = async () => {
    const collectData = {
        jobcardNofrom: formik.values.JobCardNoFrom,
        jobcardNoto: formik.values.JobCardNoTo,
        vehicleNo: vNO,
        status: sNO,
        complaintfrom: formik.values.complaintfrom,
        complaintTo: formik.values.complaintTo,
        jobcarddatefrom: formik.values.jobcarddatefrom,
        jobcarddateto: formik.values.jobcarddateto,
      show: false,
      exportOption: selectedFormat, // .pdf, .xls, or TabularExc
    };
  
    try {
      const response = await api.post(`Report/GetJobcardstatusApi`, collectData);
  
      if (response.data.status === "Success" && response.data.base64) {
        const base64String = response.data.base64;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
  
        let fileType = "";
        let fileName = response.data.fileName || "Report";
  
        if (selectedFormat === ".pdf") {
          fileType = "application/pdf";
          fileName += ".pdf";
        } else if (selectedFormat === ".xls") {
          fileType = "application/vnd.ms-excel";
          fileName += ".xls";
        } else if (selectedFormat === "TabularExc") {
          fileType = "application/vnd.ms-excel";
          fileName += ".xls";
        }
  
        const blob = new Blob([byteArray], { type: fileType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } else {
        console.error("Error: No valid data received.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
 
  // const handleDownload = () => {
  //   if (selectedFormat === "excel") {
  //     downloadExcel();
  //   } else if (selectedFormat === "pdf") {
  //     downloadPDF();
  //   } else if (selectedFormat === "tabular") {
  //     downloadTabularExcel();
  //   }
  // };

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {

    getVehicleNo();
  }, []);



  const getVehicleNo = () => {

    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVnoOption(arr);
    });
  };



  const fetchZonesData = async () => {
    try {
      const collectData = {
        jobcardNofrom: formik.values.JobCardNoFrom,
        jobcardNoto: formik.values.JobCardNoTo,
        vehicleNo: vNO,
        status: sNO,
        complaintfrom: formik.values.complaintfrom,
        complaintTo: formik.values.complaintTo,
        jobcarddatefrom: formik.values.jobcarddatefrom,
        jobcarddateto: formik.values.jobcarddateto,
        exportOption: "selectedFormat", 
        show:true
      };
      const response = await api.post(
        `Report/GetJobcardstatusApi`,
        collectData
      );
      const data = response?.data.data;

      const Print = data.map((item: any, index: any) => ({
        ...item,
      }));
      setPrint(Print);
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: index + 1,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "vehicleNo",
            headerName: t("text.VehicleNo"),
            flex: 1.4,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "jobcardNo",
            headerName: t("text.JobCardNo"),
            flex: 1.5,
            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "complaintDate",
            headerName: t("text.complaintDate"),
            flex: 1.3,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "compAppdt",
            headerName: t("text.complaintApprovalDate"),
            flex: 2,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "jobcardDate",
            headerName: t("text.JobCardDate"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.jobcardDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "status",
            headerName: t("text.Status"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "days",
            headerName: t("text.Days"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            // align: "right",
            // headerAlign: "right",
            cellClassName: "wrap-text", // Added here
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

  const styles = `
  .wrap-text {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
`;

  document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

 

  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          // border: ".5px solid #FF7722 ",
          marginTop: "3vh",
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
              fontWeight: 900,
            },
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "10px" }}
            align="left"
          >
            {t("text.JobCardStatus")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >
            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VnoOption}
                value={vNO}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if (!newValue) {
                    return;
                  }

                  setVno(newValue.label);
                }}

                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.VehicleNos1")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            <Grid item lg={4} xs={12}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={StatusOption}
                value={sNO}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if (!newValue) {
                    return;
                  }
                  console.log(newValue?.value);
                  setsno(newValue.label);
                  //formik.setFieldValue("status", newValue?.value.toString());
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


            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.JobCardNoFrom")} />}
                value={formik.values.JobCardNoFrom}
                name="JobCardNoFrom"
                id="JobCardNoFrom"
                placeholder={t("text.JobCardNoFrom")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.JobCardNoTo")} />}
                value={formik.values.JobCardNoTo}
                name="JobCardNoTo"
                id="JobCardNoTo"
                placeholder={t("text.JobCardNoTo")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="complaintfrom"
                name="complaintfrom"
                label={
                  <CustomLabel text={t("text.ComplainDateFrom")} required={true} />
                }
                value={formik.values.complaintfrom}
                placeholder={t("text.ComplainDateFrom")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complaintfrom && Boolean(formik.errors.complaintfrom)}
                helperText={formik.touched.complaintfrom && formik.errors.complaintfrom}
                InputLabelProps={{ shrink: true }}
              />

            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="complaintTo"
                name="complaintTo"
                label={
                  <CustomLabel
                    text={t("text.ComplainDateTo")}
                    required={true}
                  />
                }
                value={formik.values.complaintTo}
                placeholder={t("text.ComplainDateTo")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complaintTo && Boolean(formik.errors.complaintTo)}
                helperText={formik.touched.complaintTo && formik.errors.complaintTo}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="jobcarddatefrom"
                name="jobcarddatefrom"
                label={
                  <CustomLabel text={t("text.jobcarddatefrom")} required={true} />
                }
                value={formik.values.jobcarddatefrom}
                placeholder={t("text.jobcarddatefrom")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jobcarddatefrom && Boolean(formik.errors.jobcarddatefrom)}
                helperText={formik.touched.jobcarddatefrom && formik.errors.jobcarddatefrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="jobcarddateto"
                name="jobcarddateto"
                label={<CustomLabel text={t("text.jobcarddateto")} required={true} />}
                value={formik.values.jobcarddateto}
                placeholder={t("text.jobcarddateto")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jobcarddateto && Boolean(formik.errors.jobcarddateto)}
                helperText={formik.touched.jobcarddateto && formik.errors.jobcarddateto}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

             <Grid item xs={12} sm={12} lg={12}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={selectedFormat}
                              onChange={handleFormatChange}
                            >
                              <FormControlLabel
                                value=".pdf"
                                control={<Radio />}
                                label={t("text.pdf")}
                              />
                              <FormControlLabel
                                value=".xls"
                                control={<Radio />}
                                label={t("text.excel")}
                              />
                              <FormControlLabel
                                value="TabularExc"
                                control={<Radio />}
                                label={t("text.tabular")}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

            <Grid xs={12} sm={4} md={4} item>

              <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: `var(--header-background)`,
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={() => {
                  // Trigger validation
                  formik.validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      // No validation errors, call API
                      fetchZonesData();
                      setVisible(true);
                    } else {
                      // Show errors in the form
                      formik.setTouched({
                        complaintfrom: true,
                        complaintTo: true,
                        jobcarddatefrom: true,
                        jobcarddateto: true,
                      });
                      toast.error("Please fill in all required fields.");
                    }
                  });
                }}
                startIcon={<VisibilityIcon />}
              >
                {t("text.show")}
              </Button>

              {/* <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: `var(--header-background)`,
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={() => {
                  // const selectedPeriod = formik.values.fromDate
                  //   ? formik.values.fromDate
                  //   : formik.values.index;

                  // if (!selectedPeriod) {
                  //   alert("Please select a period. or custom date");
                  // } else {
                  fetchZonesData();
                  setVisible(true);
                  // }
                }}
                startIcon={<VisibilityIcon />}
              >
                Show
              </Button> */}
            </Grid>

            <Grid xs={12} sm={4} md={4} item>
              <Button
                type="button"
                fullWidth
                style={{
                  backgroundColor: `#f44336`,
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<RefreshIcon />}
                onClick={() => {
                  formik.resetForm();
                  setSelectedFormat(".pdf");
                  setsno("");
                  setVno("");
                  setVisible(false);
                }}
              >
                {t("text.reset")}
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Button
                type="button"
                fullWidth
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                {t("text.download")}
              </Button>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            container
            spacing={2}
            sx={{ marginTop: "3%", justifyContent: "center" }}
          >
            {visible && (
              <Grid item xs={12} sm={12} lg={12}>
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
                  <DataGrid
                    rows={zones}
                    columns={adjustedColumns}
                    rowSpacingType="border"
                    autoHeight
                    // slots={{
                    //   toolbar: GridToolbar,
                    // }}
                    pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                      value: size,
                      label: `${size}`,
                    }))}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    sx={{
                      border: 0,
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#42b6f5", // Header background color
                        color: "white", // Header text color
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "white", // Header title text color
                      },
                      "& .MuiDataGrid-cell": {
                        whiteSpace: "normal", // Ensure text wraps inside the cell
                        wordWrap: "break-word", // Break words to avoid overflow
                        overflowWrap: "break-word", // Ensure long words wrap correctly
                      },
                    }}
                  />
                )}
              </Grid>
            )}
          </Grid>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
