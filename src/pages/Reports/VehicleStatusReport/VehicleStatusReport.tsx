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
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import Logo from "../../../assets/images/KanpurLogo.png";
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
import * as Yup from "yup";
import { getISTDate } from "../../../utils/Constant";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VehicleStatusReport() {
  const { defaultValues } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [option, setOption] = useState([
    { value: "-1", label: "Vehicle Type" },
  ]);

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vNO, setVno] = useState([]);

  const [vType, setVType] = useState([]);

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };

  const formik = useFormik({
    initialValues: {
      genderID: -1,
      complaintDateFrom: defaultValues,
      complaintDateTo: defaultValues,
    },
    validationSchema: Yup.object({
      complaintDateTo: Yup.string().required("Complaint To date required"),
      complaintDateFrom: Yup.string().required("Complaint from date required"),
    }),
    onSubmit: async (values) => { },
  });

  // const handleDownload = async () => {
  //   const collectData = {
  //   "complaintDateFrom": formik.values.complaintDateFrom,
  //       "complaintDateTo": formik.values.complaintDateTo,
  //       "status": "detail",
  //     show: false,
  //     exportOption: selectedFormat, // .pdf, .xls, or TabularExc
  //   };

  //   try {
  //     const response = await api.post(`Report/GetVehicleStatusApi`, collectData);

  //     if (response.data.status === "Success" && response.data.base64) {
  //       const base64String = response.data.base64;
  //       const byteCharacters = atob(base64String);
  //       const byteNumbers = new Array(byteCharacters.length)
  //         .fill(0)
  //         .map((_, i) => byteCharacters.charCodeAt(i));
  //       const byteArray = new Uint8Array(byteNumbers);

  //       let fileType = "";
  //       let fileName = response.data.fileName || "Report";

  //       if (selectedFormat === ".pdf") {
  //         fileType = "application/pdf";
  //         fileName += ".pdf";
  //       } else if (selectedFormat === ".xls") {
  //         fileType = "application/vnd.ms-excel";
  //         fileName += ".xls";
  //       } else if (selectedFormat === "TabularExc") {
  //         fileType = "application/vnd.ms-excel";
  //         fileName += ".xls";
  //       }

  //       const blob = new Blob([byteArray], { type: fileType });
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = fileName;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       URL.revokeObjectURL(link.href);
  //     } else {
  //       console.error("Error: No valid data received.");
  //     }
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };

  const handleDownload = async (status: "detail" | "summary") => {
    const collectData = {
      complaintDateFrom: formik.values.complaintDateFrom,
      complaintDateTo: formik.values.complaintDateTo,
      show: false,
      status: status,
      exportOption: selectedFormat,
    };

    try {
      const response = await api.post(
        `Report/GetVehicleStatusApi`,
        collectData
      );
      if (response.data.status === "Success" && response.data.base64) {
        const base64String = response.data.base64;
        const byteCharacters = atob(base64String);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);

        let fileType = "";
        let fileName = response.data.fileName || "Report";

        if (selectedFormat === ".pdf") {
          fileType = "application/pdf";
          fileName += ".pdf";
        } else if (selectedFormat === ".xls") {
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
  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { }, []);

  const fetchZonesData = async () => {
    try {
      const collectData = {
        complaintDateFrom: formik.values.complaintDateFrom,
        complaintDateTo: formik.values.complaintDateTo,
        show: true,
        status: "detail",
        exportOption: "selectedFormat",
      };
      const response = await api.post(
        `Report/GetVehicleStatusApi`,
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
          //   flex: 0.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          {
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",
            minWidth: 120,
          },
          {
            field: "complaintDate",
            headerName: t("text.complaintDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
            minWidth: 140,
          },
          {
            field: "complainStatus",
            headerName: t("text.complainStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 140,
          },
          {
            field: "jobCardNo",
            headerName: t("text.JobCardNum"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 120,
          },
          {
            field: "jobCardDate",
            headerName: t("text.JobCardDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
            minWidth: 120,
          },
          {
            field: "challanDate",
            headerName: t("text.ChallanDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
            minWidth: 120,
          },
          {
            field: "challanRcvDate",
            headerName: t("text.ChallanRcvDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
            minWidth: 140,
          },

          {
            field: "challanStatus",
            headerName: t("text.ChallanStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 120,
          },

          {
            field: "jobcardStatus",
            headerName: t("text.jobcardStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 120,
          },
          {
            field: "indentDate",
            headerName: t("text.IndentDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.complaintDate).format("DD-MM-YYYY");
            },
            minWidth: 120,
          },
          {
            field: "indentStatus",
            headerName: t("text.IndentStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 120,
          },
          {
            field: "currentStatus",
            headerName: t("text.CurrentStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
            minWidth: 120,
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
              fontSize: 15,
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
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.VehicleStatusReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2}>
            <Grid xs={12} sm={6} md={6} item>
              <TextField
                type="date"
                id="complaintDateFrom"
                name="complaintDateFrom"
                label={
                  <CustomLabel
                    text={t("text.complaintDateFrom")}
                    required={true}
                  />
                }
                value={formik.values.complaintDateFrom}
                placeholder={t("text.complaintDateFrom")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.complaintDateFrom &&
                  Boolean(formik.errors.complaintDateFrom)
                }
                helperText={
                  formik.touched.complaintDateFrom &&
                  formik.errors.complaintDateFrom
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={6} md={6} item>
              <TextField
                type="date"
                id="complaintDateTo"
                name="complaintDateTo"
                label={
                  <CustomLabel
                    text={t("text.complaintDateTo")}
                    required={true}
                  />
                }
                value={formik.values.complaintDateTo}
                placeholder={t("text.complaintDateTo")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.complaintDateTo &&
                  Boolean(formik.errors.complaintDateTo)
                }
                helperText={
                  formik.touched.complaintDateTo &&
                  formik.errors.complaintDateTo
                }
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
                  {/* <FormControlLabel
                                        value="TabularExc"
                                        control={<Radio />}
                                        label={t("text.tabular")}
                                      /> */}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={3} md={3} item>
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
                        complaintDateFrom: true,
                        complaintDateTo: true,
                      });
                      toast.error("Please fill in all required fields.");
                    }
                  });
                }}
                startIcon={<VisibilityIcon />}
              >
                {t("text.show")}
              </Button>
            </Grid>
            <Grid xs={12} sm={3} md={3} item>
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
                  setVisible(false);
                }}
              >
                {t("text.reset")}
              </Button>
            </Grid>

            <Grid item xs={12} sm={3} md={3}>
              <Button
                fullWidth
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload("detail")}
              >
                {t("text.download")}
              </Button>
            </Grid>

            <Grid item xs={12} sm={3} md={3}>
              <Button
                fullWidth
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  marginTop: "10px",
                }}
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload("summary")}
              >
                {t("text.downloadSummary")}
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
