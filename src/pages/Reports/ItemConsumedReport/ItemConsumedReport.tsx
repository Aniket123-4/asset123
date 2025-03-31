
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
import * as Yup from "yup";
import Logo from "../../../assets/images/KanpurLogo.png";
import { getISTDate } from "../../../utils/Constant";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function JobCardStatus() {
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
  const [itemOption, setitemOption] = useState([
    { value: -1, label: "Select Unit" },
  ]);
  const [itmNO, setitmno] = useState("");
  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vNO, setVno] = useState("");

  const [vType, setVType] = useState([]);

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };

  // const downloadTabularExcel = () => {
  //   if (!isPrint || isPrint.length === 0) {
  //     console.error("No data to export to Tabular HTML.");
  //     return;
  //   }

  //   // Prepare headers and rows for HTML table
  //   const headers = ["Item", "Vehicle No", "Jobcard No.", "Indent No.", "Jobcard Date"];
  //   const rows = isPrint.map((item: any) => [

  //     item?.item || "", // Vehicle No
  //     item?.vehicleNo || "", // Driver
  //     item?.jobCardNo || "", // Mobile No
  //     item?.indentNo || "",
  //     moment(item?.jobcardDate).format("DD-MM-YYYY") || "",
  //   ]);

  //   // Create HTML table
  //   let html = `
  //     <html>
  //     <head>
  //       <style>
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           margin: 20px 0;
  //         }
  //         th {
  //           background-color: #f2f2f2;
  //           font-weight: bold;
  //           padding: 8px;
  //           text-align: left;
  //           border: 1px solid #ddd;
  //         }
  //         td {
  //           padding: 8px;
  //           text-align: left;
  //           border: 1px solid #ddd;
  //         }
  //         tr:nth-child(even) {
  //           background-color: #f9f9f9;
  //         }
  //         tr:hover {
  //           background-color: #f1f1f1;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <table>
  //         <thead>
  //           <tr>
  //             ${headers.map((header) => `<th>${header}</th>`).join("")}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${rows
  //       .map(
  //         (row) =>
  //           `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
  //       )
  //       .join("")}
  //         </tbody>
  //       </table>
  //     </body>
  //     </html>
  //   `;

  //   // Create a Blob from the HTML string and trigger the download
  //   const blob = new Blob([html], { type: "text/html" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "Vehicle_data_tabular.html";
  //   link.click();
  // };

  // const downloadExcel = () => {
  //   if (!isPrint || isPrint.length === 0) {
  //     console.error("No data to export to Excel.");
  //     return;
  //   }

  //   const ws = XLSX.utils.json_to_sheet(isPrint);

  //   const headers = Object.keys(isPrint[0]);

  //   headers.forEach((header, index) => {
  //     const cellAddress = `${String.fromCharCode(65 + index)}1`;
  //   });

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "vehicles");

  //   XLSX.writeFile(wb, "Vehicle_data.xlsx");
  // };

  // Function to download PDF
  // const downloadPDF = () => {
  //   if (!isPrint || isPrint.length === 0) {
  //     console.error("No data to export to PDF.");
  //     return;
  //   }

  //   // Initialize jsPDF with 'landscape' orientation
  //   const doc = new jsPDF("landscape"); // This sets the page orientation to landscape
  //   const headerFontSize = 14;
  //   const bodyFontSize = 12;


  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   let yPosition = 15;


  //   const logoWidth = 30;
  //   const logoHeight = 30;
  //   const logoX = 15;
  //   const logoY = yPosition;
  //   doc.addImage(Logo, "PNG", logoX, logoY, logoWidth, logoHeight);


  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(22);
  //   doc.text("KANPUR NAGAR NIGAM", pageWidth / 2, yPosition + 10, { align: "center" });


  //   doc.setFontSize(14);
  //   doc.text("Item Consumed Reports", pageWidth / 2, yPosition + 20, { align: "center" });

  //   yPosition += 40;

  //   const headers = ["Item", "Vehicle No", "Jobcard No.", "Indent No.", "Jobcard Date"];

  //   const columnWidths = [50, 50, 50, 50, 50];

  //   const headerHeight = 8;
  //   const headerY = yPosition;
  //   doc.setFillColor(200, 220, 255);
  //   doc.rect(
  //     14,
  //     headerY,
  //     columnWidths.reduce((a, b) => a + b, 0),
  //     headerHeight,
  //     "F"
  //   );

  //   doc.setFont("helvetica", "bold");
  //   headers.forEach((header, index) => {
  //     doc.text(
  //       header,
  //       14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
  //       yPosition + headerHeight - 2
  //     );
  //   });

  //   const headerBottomMargin = 6;
  //   yPosition += headerHeight + headerBottomMargin;

  //   // Add table rows
  //   doc.setFontSize(bodyFontSize);
  //   doc.setFont("helvetica", "normal");

  //   isPrint.forEach((item: any, rowIndex) => {
  //     const row = [

  //       item?.item || "", // Vehicle No
  //       item?.vehicleNo || "", // Driver
  //       item?.jobCardNo || "", // Mobile No
  //       item?.indentNo || "",
  //       moment(item?.jobcardDate).format("DD-MM-YYYY") || "",
  //     ];

  //     row.forEach((cell, colIndex) => {
  //       const xOffset =
  //         14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
  //       if (cell) {
  //         doc.text(cell.toString(), xOffset, yPosition);
  //       }
  //     });
  //     yPosition += 10;

  //     if (yPosition > 180) {
  //       // Adjust this to your content size for landscape
  //       doc.addPage();
  //       yPosition = 10; // Reset position on new page
  //     }
  //   });

  //   // Save the generated PDF with a filename
  //   doc.save("VehicleTrack_data.pdf");
  // };

  const formik = useFormik({
    initialValues: {
      genderID: -1,
      genderName: "",
      genderCode: "",
      jobCardDatefrom: defaultValues,
      jobCardDateTo: defaultValues,
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
      jobCardNofrom: "",
      jobCardNoTo: "",
      // ComplainDateFrom: "",
      // ComplainDateTo: "",
    },
    validationSchema: Yup.object({

      jobCardDatefrom: Yup.string()
        .required("Jobcard from date required"),
      jobCardDateTo: Yup.string()
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


  // const downloadPDF = async () => {
  //   const collectData = {
  //     jobCardNofrom: formik.values.jobCardNofrom,
  //     jobCardNoTo: formik.values.jobCardNoTo,
  //     vehicleNo: vNO,
  //     item: itmNO,
  //     jobCardDatefrom: formik.values.jobCardDatefrom,
  //     jobCardDateTo: formik.values.jobCardDateTo,
  //     show: false, // Use the show value from formik
  //     exportOption: ".pdf", // Use the selected format for export
  //   };
  //   const response = await api.post(`Report/GetvItemConsumedApi`, collectData);

  //   if (response.data.status === "Success" && response.data.base64) {
  //     const base64String = response.data.base64;

  //     // Decode Base64 string
  //     const byteCharacters = atob(base64String);
  //     const byteNumbers = new Array(byteCharacters.length)
  //       .fill(0)
  //       .map((_, i) => byteCharacters.charCodeAt(i));
  //     const byteArray = new Uint8Array(byteNumbers);

  //     // Convert to Blob
  //     const blob = new Blob([byteArray], { type: "application/pdf" });

  //     // Create Download Link
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = response.data.fileName || "Report.pdf";
  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(link.href);
  //   }
  // }
  // Handle Download Button Click
  const handleDownload = async () => {
    const collectData = {
      jobCardNofrom: formik.values.jobCardNofrom,
      jobCardNoTo: formik.values.jobCardNoTo,
      vehicleNo: vNO,
      item: itmNO,
      jobCardDatefrom: formik.values.jobCardDatefrom,
      jobCardDateTo: formik.values.jobCardDateTo,
      show: false,
      exportOption: selectedFormat, // .pdf, .xls, or TabularExc
    };
  
    try {
      const response = await api.post(`Report/GetvItemConsumedApi`, collectData);
  
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
  //   if (selectedFormat === ".xls") {
  //  //   downloadExcel();
  //   } else if (selectedFormat === ".pdf") {
  //     downloadPDF();
  //   } else if (selectedFormat === "TabularExc") {
  //     //downloadTabularExcel();
  //   }
  // };

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    GetitemData();
    getVehicleNo();
  }, []);



  const getVehicleNo = () => {

    api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.vehicleNo,
        value: item.itemMasterId,
      }));
      setVnoOption(arr);
      GetitemData();
    });
  };
  const GetitemData = async () => {
    const collectData = {
      itemMasterId: -1,
    };
    const response = await api.get(`ItemMaster/GetItemMaster`, {});
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemName"],
        value: data[index]["itemMasterId"],
      });
    };
    setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        jobCardNofrom: formik.values.jobCardNofrom,
        jobCardNoTo: formik.values.jobCardNoTo,
        vehicleNo: vNO,
        item: itmNO,
        jobCardDatefrom: formik.values.jobCardDatefrom,
        jobCardDateTo: formik.values.jobCardDateTo,
        show: true, 
        exportOption: "selectedFormat", 
        
      };

      const response = await api.post(`Report/GetvItemConsumedApi`, collectData);
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
            field: "item",
            headerName: t("text.item"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "vehicleNo",
            headerName: t("text.VehicleNo"),
            flex: 1.4,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "jobCardNo",
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
            field: "indentNo",
            headerName: t("text.indentNo00"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
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
            sx={{ padding: "15px" }}
            align="left"
          >
            {t("text.ItemConsumedReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="jobCardDatefrom"
                name="jobCardDatefrom"
                label={
                  <CustomLabel text={t("text.jobcarddatefrom")} required={true} />
                }
                value={formik.values.jobCardDatefrom}
                placeholder={t("text.jobcarddatefrom")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jobCardDatefrom && Boolean(formik.errors.jobCardDatefrom)}
                helperText={formik.touched.jobCardDatefrom && formik.errors.jobCardDatefrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={4} md={4} item>
              <TextField
                type="date"
                id="jobCardDateTo"
                name="jobCardDateTo"
                label={<CustomLabel text={t("text.jobcarddateto")} required={true} />}
                value={formik.values.jobCardDateTo}
                placeholder={t("text.jobcarddateto")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jobCardDateTo && Boolean(formik.errors.jobCardDateTo)}
                helperText={formik.touched.jobCardDateTo && formik.errors.jobCardDateTo}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={itemOption}
                value={itmNO}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if (!newValue) {
                    return;
                  }

                  setitmno(newValue.label);
                }}

                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.itemconsumedname")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>


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



            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.JobCardNoFrom")} />}
                value={formik.values.jobCardNofrom}
                name="jobCardNofrom"
                id="jobCardNofrom"
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
                value={formik.values.jobCardNoTo}
                name="jobCardNoTo"
                id="jobCardNoTo"
                placeholder={t("text.JobCardNoTo")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

                        jobCardDatefrom: true,
                        jobCardDateTo: true,
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
                  setVisible(false);
                  setSelectedFormat(".pdf");
                  setVno("");
                  setitmno("");
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
                    rows={zones} // Use rows from the processed API response
                    columns={columns} // Use columns defined in fetchZonesData
                    autoHeight
                    pageSizeOptions={[5, 10, 25, 50]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    sx={{
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#42b6f5",
                        color: "white",
                      },
                      "& .MuiDataGrid-cell": {
                        whiteSpace: "normal",
                        wordWrap: "break-word",
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


































// import React, { useEffect, useState } from "react";
// import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
// import axios from "axios";
// import HOST_URL from "../../../utils/Url";
// import Card from "@mui/material/Card";
// import {
//   Grid,
//   Box,
//   Button,
//   Divider,
//   Stack,
//   TextField,
//   Typography,
//   FormControlLabel,
//   Checkbox,
//   FormControl,
//   RadioGroup,
//   Radio,
//   Autocomplete,
//   ListItemText,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import Switch from "@mui/material/Switch";
// import { useNavigate, useLocation } from "react-router-dom";
// import Chip from "@mui/material/Chip";
// import { useTranslation } from "react-i18next";
// import Paper from "@mui/material/Paper";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import CircularProgress from "@mui/material/CircularProgress";
// import api from "../../../utils/Url";
// import { useFormik } from "formik";
// import CustomLabel from "../../../CustomLable";
// import DownloadIcon from "@mui/icons-material/Download";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import moment from "moment";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";
// import * as Yup from "yup";
// import Logo from "../../../assets/images/KanpurLogo.png";
// interface MenuPermission {
//   isAdd: boolean;
//   isEdit: boolean;
//   isPrint: boolean;
//   isDel: boolean;
// }

// export default function JobCardStatus() {
//   const [zones, setZones] = useState([]);
//   const [columns, setColumns] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [visible, setVisible] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   const [option, setOption] = useState([
//     { value: "-1", label: "Vehicle Type" },
//   ]);

//   const [isPrint, setPrint] = useState([]);

//   const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

//   const [VnoOption, setVnoOption] = useState([
//     { value: -1, label: "Select Vehicle No " },
//   ]);
//   const [itemOption, setitemOption] = useState([
//     { value: -1, label: "Select Unit" },
//   ]);
//   const [itmNO, setitmno] = useState("");
//   const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
//   const [vNO, setVno] = useState("");

//   const [vType, setVType] = useState([]);

//   const [selDay, setDay] = useState(false);

//   const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFormat((event.target as HTMLInputElement).value);
//   };

//   const downloadTabularExcel = () => {
//     if (!isPrint || isPrint.length === 0) {
//       console.error("No data to export to Tabular HTML.");
//       return;
//     }

//     // Prepare headers and rows for HTML table
//     const headers = ["Item", "Vehicle No", "Jobcard No.", "Indent No.", "Jobcard Date"];
//     const rows = isPrint.map((item: any) => [

//       item?.item || "", // Vehicle No
//       item?.vehicleNo || "", // Driver
//       item?.jobCardNo || "", // Mobile No
//       item?.indentNo || "",
//       moment(item?.jobcardDate).format("DD-MM-YYYY") || "",
//     ]);

//     // Create HTML table
//     let html = `
//       <html>
//       <head>
//         <style>
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0;
//           }
//           th {
//             background-color: #f2f2f2;
//             font-weight: bold;
//             padding: 8px;
//             text-align: left;
//             border: 1px solid #ddd;
//           }
//           td {
//             padding: 8px;
//             text-align: left;
//             border: 1px solid #ddd;
//           }
//           tr:nth-child(even) {
//             background-color: #f9f9f9;
//           }
//           tr:hover {
//             background-color: #f1f1f1;
//           }
//         </style>
//       </head>
//       <body>
//         <table>
//           <thead>
//             <tr>
//               ${headers.map((header) => `<th>${header}</th>`).join("")}
//             </tr>
//           </thead>
//           <tbody>
//             ${rows
//         .map(
//           (row) =>
//             `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
//         )
//         .join("")}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `;

//     // Create a Blob from the HTML string and trigger the download
//     const blob = new Blob([html], { type: "text/html" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "Vehicle_data_tabular.html";
//     link.click();
//   };

//   const downloadExcel = () => {
//     if (!isPrint || isPrint.length === 0) {
//       console.error("No data to export to Excel.");
//       return;
//     }

//     const ws = XLSX.utils.json_to_sheet(isPrint);

//     const headers = Object.keys(isPrint[0]);

//     headers.forEach((header, index) => {
//       const cellAddress = `${String.fromCharCode(65 + index)}1`;
//     });

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "vehicles");

//     XLSX.writeFile(wb, "Vehicle_data.xlsx");
//   };

//   // Function to download PDF
//   // const downloadPDF = () => {
//   //   if (!isPrint || isPrint.length === 0) {
//   //     console.error("No data to export to PDF.");
//   //     return;
//   //   }

//   //   // Initialize jsPDF with 'landscape' orientation
//   //   const doc = new jsPDF("landscape"); // This sets the page orientation to landscape
//   //   const headerFontSize = 14;
//   //   const bodyFontSize = 12;


//   //   const pageWidth = doc.internal.pageSize.getWidth();
//   //   let yPosition = 15;


//   //   const logoWidth = 30;
//   //   const logoHeight = 30;
//   //   const logoX = 15;
//   //   const logoY = yPosition;
//   //   doc.addImage(Logo, "PNG", logoX, logoY, logoWidth, logoHeight);


//   //   doc.setFont("helvetica", "bold");
//   //   doc.setFontSize(22);
//   //   doc.text("KANPUR NAGAR NIGAM", pageWidth / 2, yPosition + 10, { align: "center" });


//   //   doc.setFontSize(14);
//   //   doc.text("Item Consumed Reports", pageWidth / 2, yPosition + 20, { align: "center" });

//   //   yPosition += 40;

//   //   const headers = ["Item", "Vehicle No", "Jobcard No.", "Indent No.", "Jobcard Date"];

//   //   const columnWidths = [50, 50, 50, 50, 50];

//   //   const headerHeight = 8;
//   //   const headerY = yPosition;
//   //   doc.setFillColor(200, 220, 255);
//   //   doc.rect(
//   //     14,
//   //     headerY,
//   //     columnWidths.reduce((a, b) => a + b, 0),
//   //     headerHeight,
//   //     "F"
//   //   );

//   //   doc.setFont("helvetica", "bold");
//   //   headers.forEach((header, index) => {
//   //     doc.text(
//   //       header,
//   //       14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
//   //       yPosition + headerHeight - 2
//   //     );
//   //   });

//   //   const headerBottomMargin = 6;
//   //   yPosition += headerHeight + headerBottomMargin;

//   //   // Add table rows
//   //   doc.setFontSize(bodyFontSize);
//   //   doc.setFont("helvetica", "normal");

//   //   isPrint.forEach((item: any, rowIndex) => {
//   //     const row = [

//   //       item?.item || "", // Vehicle No
//   //       item?.vehicleNo || "", // Driver
//   //       item?.jobCardNo || "", // Mobile No
//   //       item?.indentNo || "",
//   //       moment(item?.jobcardDate).format("DD-MM-YYYY") || "",
//   //     ];

//   //     row.forEach((cell, colIndex) => {
//   //       const xOffset =
//   //         14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
//   //       if (cell) {
//   //         doc.text(cell.toString(), xOffset, yPosition);
//   //       }
//   //     });
//   //     yPosition += 10;

//   //     if (yPosition > 180) {
//   //       // Adjust this to your content size for landscape
//   //       doc.addPage();
//   //       yPosition = 10; // Reset position on new page
//   //     }
//   //   });

//   //   // Save the generated PDF with a filename
//   //   doc.save("VehicleTrack_data.pdf");
//   // };


//   const downloadPDF: any = (base64String: any, fileName = "document.pdf") => {
//     // Convert Base64 to a Blob
//     const byteCharacters = atob(base64String);
//     const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], { type: "application/pdf" });

//     // Create a download link
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName;

//     // Append and trigger the click event
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   // Handle Download Button Click
//   const handleDownload = () => {
//     if (!formik.values.show) {
//       fetchZonesData(); // This will trigger the report generation and download
//     } else {
//       if (selectedFormat === ".excel") {
//         downloadExcel();
//       } else if (selectedFormat === ".pdf") {
//         downloadPDF();
//       } else if (selectedFormat === ".tabular") {
//         downloadTabularExcel();
//       }
//     }
//   };
//   // const handleDownload = () => {
//   //   if (selectedFormat === "excel") {
//   //     downloadExcel();
//   //   } else if (selectedFormat === "pdf") {
//   //     downloadPDF();
//   //   } else if (selectedFormat === "tabular") {
//   //     downloadTabularExcel();
//   //   }
//   // };

//   let navigate = useNavigate();
//   const { t } = useTranslation();

//   useEffect(() => {
//     GetitemData();
//     getVehicleNo();
//   }, []);



//   const getVehicleNo = () => {

//     api.get(`Master/GetVehicleDetail?ItemMasterId=-1`).then((res) => {
//       const arr = res?.data?.data.map((item: any) => ({
//         label: item.vehicleNo,
//         value: item.itemMasterId,
//       }));
//       setVnoOption(arr);
//       GetitemData();
//     });
//   };
//   const GetitemData = async () => {
//     const collectData = {
//       itemMasterId: -1,
//     };
//     const response = await api.get(`ItemMaster/GetItemMaster`, {});
//     const data = response.data.data;
//     const arr = [];
//     for (let index = 0; index < data.length; index++) {
//       arr.push({
//         label: data[index]["itemName"],
//         value: data[index]["itemMasterId"],
//       });
//     };
//     setitemOption([{ value: -1, label: t("text.selectItem") }, ...arr]);
//   };
//   const fetchZonesData = async () => {
//     try {
//       const collectData = {
//         jobCardNofrom: formik.values.jobCardNofrom,
//         jobCardNoTo: formik.values.jobCardNoTo,
//         vehicleNo: vNO,
//         item: itmNO,
//         jobCardDatefrom: formik.values.jobCardDatefrom,
//         jobCardDateTo: formik.values.jobCardDateTo,
//         show: formik.values.show, // Use the show value from formik
//         exportOption: selectedFormat, // Use the selected format for export
//       };

//       if (formik.values.show) {
//         // If show is true, fetch data to display in the grid
//         const response = await api.post(`Report/GetvItemConsumedApi`, collectData);
//         const data = response?.data;
//         const Print = data.map((item: any, index: any) => ({
//           ...item,
//         }));
//         setPrint(Print);
//         const zonesWithIds = data.map((zone: any, index: any) => ({
//           ...zone,
//           serialNo: index + 1,
//           id: index + 1,
//         }));
//         setZones(zonesWithIds);
//         setIsLoading(false);

//         if (data.length > 0) {
//           const columns: GridColDef[] = [
//             // Define your columns here as before
//           ];
//           setColumns(columns as any);
//         }
//       } else {
//         const response = await api.post(`Report/GetvItemConsumedApi`, collectData);

//         if (response.data.status === "Success" && response.data.base64) {
//           const base64String = response.data.base64;

//           // Decode Base64 string
//           const byteCharacters = atob(base64String);
//           const byteNumbers = new Array(byteCharacters.length)
//             .fill(0)
//             .map((_, i) => byteCharacters.charCodeAt(i));
//           const byteArray = new Uint8Array(byteNumbers);

//           // Convert to Blob
//           const blob = new Blob([byteArray], { type: "application/pdf" });

//           // Create Download Link
//           const link = document.createElement("a");
//           link.href = URL.createObjectURL(blob);
//           link.download = response.data.fileName || "Report.pdf";
//           document.body.appendChild(link);
//           link.click();

//           // Cleanup
//           document.body.removeChild(link);
//           URL.revokeObjectURL(link.href);
//       }
//     }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch data or generate report.");
//     }
//   };
//   // const fetchZonesData = async () => {
//   //   try {
//   //     const collectData = {
//   //       jobCardNofrom: formik.values.jobCardNofrom,
//   //       jobCardNoTo: formik.values.jobCardNoTo,
//   //       vehicleNo: vNO,
//   //       item: itmNO,
//   //       jobCardDatefrom: formik.values.jobCardDatefrom,
//   //       jobCardDateTo: formik.values.jobCardDateTo,
//   //       "show": true,
//   //       "exportOption": ""
//   //     };

//   //     const response = await api.post(`Report/GetvItemConsumedApi`, collectData);
//   //     const data = response?.data;
//   //     const Print = data.map((item: any, index: any) => ({
//   //       ...item,
//   //     }));
//   //     setPrint(Print);
//   //     const zonesWithIds = data.map((zone: any, index: any) => ({
//   //       ...zone,
//   //       serialNo: index + 1,
//   //       id: index + 1,
//   //     }));
//   //     setZones(zonesWithIds);
//   //     setIsLoading(false);

//   //      if (data.length > 0) {
//   //             const columns: GridColDef[] = [
//   //         {
//   //           field: "item",
//   //           headerName: t("text.item"),
//   //           flex: 1,
//   //           headerClassName: "MuiDataGrid-colCell",
//   //           cellClassName: "wrap-text", // Added here
//   //         },
//   //         {
//   //           field: "vehicleNo",
//   //           headerName: t("text.VehicleNo"),
//   //           flex: 1.4,
//   //           cellClassName: "wrap-text", // Added here
//   //           headerClassName: "MuiDataGrid-colCell",
//   //         },
//   //         {
//   //           field: "jobCardNo",
//   //           headerName: t("text.JobCardNo"),
//   //           flex: 1.5,
//   //           // align: "right",
//   //           // headerAlign: "right",
//   //           headerClassName: "MuiDataGrid-colCell",
//   //           cellClassName: "wrap-text", // Added here

//   //         },
//   //         {
//   //           field: "complaintDate",
//   //           headerName: t("text.complaintDate"),
//   //           flex: 1.3,
//   //           headerClassName: "MuiDataGrid-colCell",
//   //           cellClassName: "wrap-text", // Added here
//   //           renderCell: (params) => {
//   //             return moment(params.row.complaintDate).format("DD-MM-YYYY");
//   //           },
//   //         },
//   //         {
//   //           field: "jobcardDate",
//   //           headerName: t("text.JobCardDate"),
//   //           flex: 1.5,
//   //           headerClassName: "MuiDataGrid-colCell",
//   //           cellClassName: "wrap-text", // Added here
//   //           renderCell: (params) => {
//   //             return moment(params.row.jobcardDate).format("DD-MM-YYYY");
//   //           },
//   //         },
//   //         {
//   //           field: "indentNo",
//   //           headerName: t("text.indentNo00"),
//   //           flex: 1,
//   //           headerClassName: "MuiDataGrid-colCell",
//   //           cellClassName: "wrap-text", // Added here
//   //         },

//   //       ];
//   //       setColumns(columns as any);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching data:", error);
//   //     // setLoading(false);
//   //   }
//   // };

//   const adjustedColumns = columns.map((column: any) => ({
//     ...column,
//   }));

//   const styles = `
//   .wrap-text {
//     white-space: normal !important;
//     word-wrap: break-word !important;
//     overflow-wrap: break-word !important;
//   }
// `;

//   document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

//   const formik = useFormik({
//     initialValues: {
//       genderID: -1,
//       genderName: "",
//       genderCode: "",
//       jobCardDatefrom: "",
//       jobCardDateTo: "",
//       days: 0,
//       parentId: 0,
//       startDate: "",
//       endDate: "",
//       daysOnly: false,
//       displayLabel: "",
//       index: 0,
//       jobCardNofrom: "",
//       jobCardNoTo: "",
//       "item": "",
//       "vehicleNo": "",
//       // "jobCardNofrom": "",
//       // "jobCardNoTo": "",
//       // "jobCardDatefrom": "",
//       // "jobCardDateTo": "",

//       show: true, // Default to true to show data in the grid
//       exportOption: selectedFormat,
//       // ComplainDateFrom: "",
//       // ComplainDateTo: "",
//     },
//     validationSchema: Yup.object({

//       jobCardDatefrom: Yup.string()
//         .required("Jobcard from date required"),
//       jobCardDateTo: Yup.string()
//         .required("Jobcard  to date  required"),
//     }),
//     onSubmit: async (values) => {

//     },
//   });

//   return (
//     <>
//       <Card
//         style={{
//           width: "100%",
//           // height: "100%",
//           backgroundColor: "#E9FDEE",
//           // border: ".5px solid #FF7722 ",
//           marginTop: "3vh",
//         }}
//       >
//         <Paper
//           sx={{
//             width: "100%",
//             overflow: "hidden",
//             "& .MuiDataGrid-colCell": {
//               backgroundColor: `var(--grid-headerBackground)`,
//               color: `var(--grid-headerColor)`,
//               fontSize: 17,
//               fontWeight: 900,
//             },
//           }}
//           style={{ padding: "10px" }}
//         >
//           <ConfirmDialog />

//           <Typography
//             gutterBottom
//             variant="h5"
//             component="div"
//             sx={{ padding: "15px" }}
//             align="left"
//           >
//             {t("text.ItemConsumedReport")}
//           </Typography>
//           <Divider />

//           <Box height={10} />

//           <Grid item xs={12} container spacing={2} >
//             <Grid item xs={12} sm={12} lg={12}>
//               <FormControl component="fieldset">
//                 <RadioGroup
//                   row
//                   value={formik.values.show ? "show" : "export"}
//                   onChange={(event) => {
//                     formik.setFieldValue("show", event.target.value === "show");
//                   }}
//                 >
//                   <FormControlLabel value="show" control={<Radio />} label="Show Data" />
//                   <FormControlLabel value="export" control={<Radio />} label="Export Report" />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>
//             <Grid xs={12} sm={4} md={4} item>
//               <TextField
//                 type="date"
//                 id="jobCardDatefrom"
//                 name="jobCardDatefrom"
//                 label={
//                   <CustomLabel text={t("text.FromDate")} required={true} />
//                 }
//                 value={formik.values.jobCardDatefrom}
//                 placeholder={t("text.FromDate")}
//                 size="small"
//                 fullWidth
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.jobCardDatefrom && Boolean(formik.errors.jobCardDatefrom)}
//                 helperText={formik.touched.jobCardDatefrom && formik.errors.jobCardDatefrom}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             {/* To Date Input */}
//             <Grid xs={12} sm={4} md={4} item>
//               <TextField
//                 type="date"
//                 id="jobCardDateTo"
//                 name="jobCardDateTo"
//                 label={<CustomLabel text={t("text.ToDate")} required={true} />}
//                 value={formik.values.jobCardDateTo}
//                 placeholder={t("text.ToDate")}
//                 size="small"
//                 fullWidth
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.jobCardDateTo && Boolean(formik.errors.jobCardDateTo)}
//                 helperText={formik.touched.jobCardDateTo && formik.errors.jobCardDateTo}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={4} lg={4}>
//               <Autocomplete
//                 //multiple
//                 disablePortal
//                 id="combo-box-demo"
//                 options={itemOption}
//                 value={itmNO}
//                 fullWidth
//                 size="small"
//                 onChange={(event: any, newValue: any) => {
//                   if (!newValue) {
//                     return;
//                   }

//                   setitmno(newValue.label);
//                 }}

//                 renderInput={(params: any) => (
//                   <TextField
//                     {...params}
//                     label={
//                       <CustomLabel
//                         text={t("text.itemconsumedname")}
//                         required={false}
//                       />
//                     }
//                   />
//                 )}
//                 popupIcon={null}
//               />
//             </Grid>


//             <Grid item xs={12} sm={4} lg={4}>
//               <Autocomplete
//                 //multiple
//                 disablePortal
//                 id="combo-box-demo"
//                 options={VnoOption}
//                 value={vNO}
//                 fullWidth
//                 size="small"
//                 onChange={(event: any, newValue: any) => {
//                   if (!newValue) {
//                     return;
//                   }

//                   setVno(newValue.label);
//                 }}

//                 renderInput={(params: any) => (
//                   <TextField
//                     {...params}
//                     label={
//                       <CustomLabel
//                         text={t("text.VehicleNos1")}
//                         required={false}
//                       />
//                     }
//                   />
//                 )}
//                 popupIcon={null}
//               />
//             </Grid>



//             <Grid xs={12} md={4} lg={4} item>
//               <TextField
//                 label={<CustomLabel text={t("text.JobCardNoFrom")} />}
//                 value={formik.values.jobCardNofrom}
//                 name="jobCardNofrom"
//                 id="jobCardNofrom"
//                 placeholder={t("text.JobCardNoFrom")}
//                 size="small"
//                 fullWidth
//                 style={{ backgroundColor: "white" }}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               />
//             </Grid>

//             <Grid xs={12} md={4} lg={4} item>
//               <TextField
//                 label={<CustomLabel text={t("text.JobCardNoTo")} />}
//                 value={formik.values.jobCardNoTo}
//                 name="jobCardNoTo"
//                 id="jobCardNoTo"
//                 placeholder={t("text.JobCardNoTo")}
//                 size="small"
//                 fullWidth
//                 style={{ backgroundColor: "white" }}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//               />
//             </Grid>



//             <Grid item xs={12} sm={12} lg={12}>
//               <FormControl component="fieldset">
//                 <RadioGroup
//                   row
//                   value={selectedFormat}
//                   onChange={handleFormatChange}
//                 >
//                   <FormControlLabel
//                     value=".pdf"
//                     control={<Radio />}
//                     label={t("text.pdf")}
//                   />
//                   <FormControlLabel
//                     value=".excel"
//                     control={<Radio />}
//                     label={t("text.excel")}
//                   />
//                   <FormControlLabel
//                     value=".tabular"
//                     control={<Radio />}
//                     label={t("text.tabular")}
//                   />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>

//             <Grid xs={12} sm={4} md={4} item>
//               <Button
//                 type="submit"
//                 fullWidth
//                 style={{
//                   backgroundColor: `var(--header-background)`,
//                   color: "white",
//                   marginTop: "10px",
//                 }}
//                 onClick={() => {
//                   if (formik.values.show) {
//                     formik.validateForm().then((errors) => {
//                       if (Object.keys(errors).length === 0) {
//                         fetchZonesData();
//                         setVisible(true);
//                       } else {
//                         formik.setTouched({
//                           jobCardDatefrom: true,
//                           jobCardDateTo: true,
//                         });
//                         toast.error("Please fill in all required fields.");
//                       }
//                     });
//                   } else {
//                     fetchZonesData(); // This will trigger the report generation and download
//                   }
//                 }}
//                 startIcon={<VisibilityIcon />}
//               >
//                 {formik.values.show ? t("text.show") : t("text.export")}
//               </Button>
//               {/* <Button
//                 type="submit"
//                 fullWidth
//                 style={{
//                   backgroundColor: `var(--header-background)`,
//                   color: "white",
//                   marginTop: "10px",
//                 }}
//                 onClick={() => {
//                   // Trigger validation
//                   formik.validateForm().then((errors) => {
//                     if (Object.keys(errors).length === 0) {
//                       // No validation errors, call API
//                       fetchZonesData();
//                       setVisible(true);
//                     } else {
//                       // Show errors in the form
//                       formik.setTouched({

//                         jobCardDatefrom: true,
//                         jobCardDateTo: true,
//                       });
//                       toast.error("Please fill in all required fields.");
//                     }
//                   });
//                 }}
//                 startIcon={<VisibilityIcon />}
//               >
//                 {t("text.show")}
//               </Button> */}
//             </Grid>

//             <Grid xs={12} sm={4} md={4} item>
//               <Button
//                 type="button"
//                 fullWidth
//                 style={{
//                   backgroundColor: `#f44336`,
//                   color: "white",
//                   marginTop: "10px",
//                 }}
//                 startIcon={<RefreshIcon />}
//                 onClick={() => {
//                   formik.resetForm();
//                   setVisible(false);
//                   setVno("");
//                   setitmno("");
//                 }}
//               >
//                 {t("text.reset")}
//               </Button>
//             </Grid>

//             <Grid item xs={12} sm={4} md={4}>
//               <Button
//                 type="button"
//                 fullWidth
//                 style={{
//                   backgroundColor: "#4caf50",
//                   color: "white",
//                   marginTop: "10px",
//                 }}
//                 startIcon={<DownloadIcon />}
//                 onClick={handleDownload}
//               >
//                 {t("text.download")}
//               </Button>
//             </Grid>
//           </Grid>

//           <Grid
//             item
//             xs={12}
//             container
//             spacing={2}
//             sx={{ marginTop: "3%", justifyContent: "center" }}
//           >
//             {visible && (
//               <Grid item xs={12} sm={12} lg={12}>
//                 {isLoading ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <CircularProgress />
//                   </div>
//                 ) : (
//                   <DataGrid
//                     rows={zones} // Use rows from the processed API response
//                     columns={columns} // Use columns defined in fetchZonesData
//                     autoHeight
//                     pageSizeOptions={[5, 10, 25, 50]}
//                     initialState={{
//                       pagination: { paginationModel: { pageSize: 5 } },
//                     }}
//                     sx={{
//                       "& .MuiDataGrid-columnHeaders": {
//                         backgroundColor: "#42b6f5",
//                         color: "white",
//                       },
//                       "& .MuiDataGrid-cell": {
//                         whiteSpace: "normal",
//                         wordWrap: "break-word",
//                       },
//                     }}
//                   />

//                 )}
//               </Grid>
//             )}
//           </Grid>
//         </Paper>
//       </Card>
//       <ToastApp />
//     </>
//   );
// }


















