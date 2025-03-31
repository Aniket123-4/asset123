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

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function VendorEvaluationReport() {
  const [zones, setZones] = useState([]);
     const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
 const [vehicleTypeValue, setVehicleTypeValue] = useState("");
   const [vehicleTypeOption, setVehicleTypeOption] = useState([
      { value: -1, label: t("text.VehicleType") },
   ]);
  const [option, setOption] = useState([
    { value: "-1", label: "Vehicle Type" },
  ]);

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>("pdf");

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

  const downloadTabularExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Tabular HTML.");
      return;
    }

    // Prepare headers and rows for HTML table
    const headers = [
      "Date",
      "Vehicle No",
      "Driver",
      "Mobile No",
      "Department",
      "Distance(KM)",
      "Running",
      "Idle",
      "Start Time",
      "End Time",
      "Fuel Consumption",
    ];

    const rows = isPrint.map((item: any) => [
      moment(item?.trackDate).format("DD-MM-YYYY") || "", // Vehicle No (formatted date)
      item?.vehicleNo || "", // Vehicle Type
      item?.driverName || "", // Driver
      item?.mobileNo, // Driver Mobile No
      item?.department,
      item?.distanceKM,
      item?.running,
      item?.idle,
      item?.startTime,
      item?.endTime,
      item?.fuelConsumption,
    ]);

    // Create HTML table
    let html = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a Blob from the HTML string and trigger the download
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Vehicle_data_tabular.html";
    link.click();
  };

  const downloadExcel = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to Excel.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(isPrint);

    const headers = Object.keys(isPrint[0]);

    headers.forEach((header, index) => {
      const cellAddress = `${String.fromCharCode(65 + index)}1`;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vehicles");

    XLSX.writeFile(wb, "Vehicle_data.xlsx");
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (!isPrint || isPrint.length === 0) {
      console.error("No data to export to PDF.");
      return;
    }

    // Initialize jsPDF with 'landscape' orientation
    const doc = new jsPDF("landscape"); // This sets the page orientation to landscape
    let yPosition = 10;
    const headerFontSize = 14;
    const bodyFontSize = 12;

    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Data", 14, yPosition);
    yPosition += 10;

    const headers = ["Date", "Vehicle No", "Driver", "Mobile No", "Running"];

    const columnWidths = [50, 50, 70, 50, 50];

    const headerHeight = 8;
    const headerY = yPosition;
    doc.setFillColor(200, 220, 255);
    doc.rect(
      14,
      headerY,
      columnWidths.reduce((a, b) => a + b, 0),
      headerHeight,
      "F"
    );

    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      doc.text(
        header,
        14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        yPosition + headerHeight - 2
      );
    });

    const headerBottomMargin = 6;
    yPosition += headerHeight + headerBottomMargin;

    // Add table rows
    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");

    isPrint.forEach((item: any, rowIndex) => {
      const row = [
        moment(item?.trackDate).format("DD-MM-YYYY") || "",
        item?.vehicleNo || "", // Vehicle No
        item?.driverName || "", // Driver
        item?.mobileNo || "", // Mobile No
        item?.running || "",
      ];

      row.forEach((cell, colIndex) => {
        const xOffset =
          14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        if (cell) {
          doc.text(cell.toString(), xOffset, yPosition);
        }
      });
      yPosition += 10;

      if (yPosition > 180) {
        // Adjust this to your content size for landscape
        doc.addPage();
        yPosition = 10; // Reset position on new page
      }
    });

    // Save the generated PDF with a filename
    doc.save("VehicleTrack_data.pdf");
  };
  // Handle Download Button Click
  const handleDownload = () => {
    if (selectedFormat === "excel") {
      downloadExcel();
    } else if (selectedFormat === "pdf") {
      downloadPDF();
    } else if (selectedFormat === "tabular") {
      downloadTabularExcel();
    }
  };

  let navigate = useNavigate();


  useEffect(() => {
    // getData();
    getPeriod();
    getVehicletypeData();
    getVehicleNo();
  }, []);

  const getPeriod = () => {
    api.get(`Period/GetPeriods?type=Period&daysOnly=false`).then((res) => {
      const arr = res?.data?.map((item: any) => ({
        label: item?.displayLabel,
        value: item?.index,
        startDate: item?.startDate,
        endDate: item?.endDate,
        daysOnly: item?.daysOnly,
        displayLabel: item?.displayLabel,
        index: item?.index,
      }));
      setPeriod(arr);
    });
  };

  const getVehicleNo = () => {

    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVnoOption(arr);
    });
  };
  const getVehicletypeData = async () => {
    const response = await api.get(`Master/GetVehicleType?VehicleTypeId=-1`);
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
       arr.push({
          label: data[index]["vehicleTypename"],
          value: data[index]["vehicleTypeId"],
       });
    }
    setVehicleTypeOption(arr);
 }
 
  let currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - 1);

  let previousDate = currentDate.toISOString();

  const fetchZonesData = async () => {
    try {
      const collectData = {
        Str1: "",
        Str2: isChecked ? "y" : "n",
        Str3: "",
        Str4: "",
        Str5: "",
        Str6: "",
        intvalue1: 0,
        intvalue2: 0,
        intvalue3: 0,
        intvalue4: formik.values.days || 0,
        intnotnullvalue1: 0,
        intnotnullvalue2: 0,
        intnotnullvalue3: 0,
        list1: vNO ? vNO : [],
        listInt1: vType ? vType : [],
        list2: [],
        listInt2: [],
        listInt12: [],
        date1: formik.values.startDate
          ? formik.values.startDate
          : formik.values.fromDate,
        date2: formik.values.endDate
          ? formik.values.endDate
          : formik.values.toDate,
        date3: null,
        date4: null,
        dec1: null,
        dec2: null,
        dec3: null,
        dec4: null,
        Flag: true,
        Data: "",
        Success: false,
        Error: "",
        SelectPerindex: formik.values.index,
        selectedPeriod: {
          index: formik.values.index || 2,
          startDate: formik.values.startDate || previousDate,
          endDate: formik.values.endDate || previousDate,
          daysOnly: formik.values.daysOnly || true,
          displayLabel: formik.values.displayLabel || "Yesterday",
        },
        listPeriod: Period,
        SelectPerindex1: 0,
        selectedPeriod1: {
          index: 0,
          startDate: previousDate,
          endDate: previousDate,
          daysOnly: false,
          displayLabel: "",
        },
        listPeriod1: [],
        Show: true,
        EmpName: "",
        ZoneName: "",
        DepartmentName: "",
        ExportOption: ".pdf",
        All: false,
        ConditionStr1: "Skip Records speed 0 and distance 0",
        ConditionStr2: "",
        Condition1: false,
        Condition2: selDay ? selDay : false,
        ExpOption: [
          {
            ext: ".pdf",
            extname: "Pdf",
          },
          {
            ext: ".xls",
            extname: "Excel",
          },
        ],
        cancel: {
          waitHandle: {
            handle: {},
            safeWaitHandle: {},
          },
        },
      };
      const response = await api.post(
        `VehicleMoving/VehicleMovingTrackStatusdetnew`,
        collectData
      );
      const data = response?.data;

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
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "trackDate",
            headerName: t("text.Date"),
            flex: 1.3,
            cellClassName: "wrap-text", // Added here
            renderCell: (params) => {
              return moment(params.row.trackDate).format("DD-MM-YYYY");
            },
          },
          {
            field: "vehicleNo",
            headerName: t("text.VehicleNo"),
            flex: 1.2,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "driverName",
            headerName: t("text.Driver"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "mobileNo",
            headerName: t("text.MobileNo"),
            flex: 1.3,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "department",
            headerName: t("text.Department"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "distanceKM",
            headerName: t("text.Distance"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            align: 'right',
            headerAlign: 'right',
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "running",
            headerName: t("text.Running"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "idle",
            headerName: t("text.Idle"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "startTime",
            headerName: t("text.StartTime"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "endTime",
            headerName: t("text.EndTime"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "fuelConsumption",
            headerName: t("text.FuelConsumption"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            align: 'right',
            headerAlign: 'right',
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

  const formik = useFormik({
    initialValues: {
      genderID: -1,
      genderName: "",
      genderCode: "",
      fromDate: "",
      toDate: "",
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
    },
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
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.VendorEvaluationReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >
            <Grid item xs={12} sm={4} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => {
                      setIsChecked(e.target.checked);
                    }}
                  />
                }
                label="For All Savings"
              />
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <FormControl component="fieldset">
                   <RadioGroup
                                 row
                                 value={selectedFormat}
                                 onChange={handleFormatChange}
                               >
                                 <FormControlLabel
                                   value="pdf"
                                   control={<Radio />}
                                   label={t("text.pdf")}
                                 />
                                 <FormControlLabel
                                   value="excel"
                                   control={<Radio />}
                                   label={t("text.excel")}
                                 />
                                 <FormControlLabel
                                   value="tabular"
                                   control={<Radio />}
                                   label={t("text.tabular")}
                                 />
                               </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selDay}
                      onChange={(e) => {
                        setDay(e.target.checked);
                      }}
                    />
                  }
                  label="Vehicle Running Less than:"
                />
                <TextField
                  variant="outlined"
                  id="days"
                  name="days"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formik.values.days}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => e.target.select()}
                  style={{ width: "60px" }}
                />
                days
              </Box>
            </Grid>

            <Grid xs={12} sm={4} md={4} item>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[{ value: -1, label: "Custom" }].concat(Period)}
                fullWidth
                size="small"
                onChange={(event, newValue: any) => {
                  // console.log(newValue?.value);

                  if (newValue && newValue.value !== undefined) {
                    if (newValue.value === -1) {
                      formik.setFieldValue("parentId", newValue.value || null);
                    } else {
                      formik.setFieldValue("index", newValue.index || null);
                      formik.setFieldValue(
                        "startDate",
                        newValue.startDate || ""
                      );
                      formik.setFieldValue("endDate", newValue.endDate || "");
                      formik.setFieldValue(
                        "daysOnly",
                        newValue.daysOnly || false
                      );
                      formik.setFieldValue(
                        "displayLabel",
                        newValue.label || ""
                      );
                    }
                  } else {
                    // Handle case when newValue is null or undefined
                    console.error("newValue is null or undefined");
                    // Optionally reset form fields or handle the case here
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel text={t("text.Period")} required={false} />
                    }
                  />
                )}
              />
            </Grid>

            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="fromDate"
                name="fromDate"
                label={
                  <CustomLabel text={t("text.FromDate")} required={false} />
                }
                value={formik.values.fromDate}
                placeholder={t("text.FromDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                disabled={formik.values.parentId !== -1} 
                InputProps={{
                  readOnly: formik.values.parentId !== -1, 
                }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="toDate"
                name="toDate"
                label={<CustomLabel text={t("text.ToDate")} required={false} />}
                value={formik.values.toDate}
                placeholder={t("text.ToDate")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                disabled={formik.values.parentId !== -1}
                InputProps={{
                  readOnly: formik.values.parentId !== -1, 
                }}
              />
            </Grid>
            <Grid item lg={4} sm={4} xs={12}>
                        <Autocomplete
                           disablePortal
                           id="combo-box-demo"
                           options={vehicleTypeOption}
                           value={vehicleTypeValue}
                           fullWidth
                           size="small"
                           onChange={(event: any, newValue: any) => {
                              if (!newValue) {
                                 return;
                              }
                              console.log(newValue?.value);
                              formik.setFieldValue("vehicleTypeId", parseInt(newValue.value));
                              setVehicleTypeValue(newValue?.label);

                           }}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label={<CustomLabel text={t("text.VehicleType")} required={false} />}
                                 name="vehicleTypeId"
                                 id="vehicleTypeId"
                                 placeholder={t("text.VehicleType")}
                              />
                           )}
                        />
                     </Grid>

            {/* <Grid xs={12} sm={4} md={4} item>
              <Autocomplete
                multiple
                disablePortal
                id="combo-box-demo"
                options={option}
                fullWidth
                size="small"
                onChange={(event, newValue: any) => {
                  const selectedVType = newValue.map((item: any) => item.value);
                  setVType(selectedVType);
                }}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    <ListItemText primary={option.label} />
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.VehicleType")}
                        required={false}
                      />
                    }
                  />
                )}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                multiple
                disablePortal
                id="combo-box-demo"
                options={VnoOption}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  const selectedVno = newValue.map((item: any) => item.value);
                  setVno(selectedVno);
                }}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    <ListItemText primary={option.label} />
                  </li>
                )}
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
            </Grid> */}

            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VnoOption}
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

            <Grid xs={12} sm={4} md={4} item></Grid>

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
                  const selectedPeriod = formik.values.fromDate ? formik.values.fromDate : formik.values.index ; 
      
                  if (!selectedPeriod) {
                    
                    alert("Please select a period. or custom date");
                  } else {
                    
                    fetchZonesData();
                    setVisible(true);
                  }
                }}
                startIcon={<VisibilityIcon />}
              >
               {t("text.show")}
              </Button>
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
