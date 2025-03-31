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

export default function VendorItemDetail() {
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

  const [VendorOption, setVendorOption] = useState([
    { value: -1, label: "Select Vendor " },
  ]);


  const [ItemOption, setItemOps] = useState([
    { value: -1, label: "Select Item" },
  ]);


  const [Period, setPeriod] = useState([{ value: -1, label: "Select Period" }]);
  const [vend, setVendor] = useState("");

  const [isItem, setItem] = useState("");

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
      mrnDatefrom: defaultValues,
      mrnDateTo: defaultValues,
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,
    },

     validationSchema: Yup.object({
      mrnDateTo: Yup.string()
            .required("Mrn To date required"),
            mrnDatefrom: Yup.string()
            .required("Mrn from date required"),
        
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
      vendor: vend,
      itemName: isItem,
      mrnDatefrom: formik.values.mrnDatefrom,
      mrnDateTo: formik.values.mrnDateTo,
      show: false,
      exportOption: selectedFormat, // .pdf, .xls, or TabularExc
    };
  
    try {
      const response = await api.post(`Report/GetVendorItemApi`, collectData);
  
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


  // Handle Download Button Click
 
  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    
    getItem();

    getVendor();
  }, []);

  const getItem = () => {
    api.get(`ItemMaster/GetItemMaster?ItemMasterId=-1`).then((res) => {
      const arr = res?.data?.data?.map((item: any) => ({
        label: item?.itemName,
        value: item?.itemMasterId,
       
      }));
      setItemOps(arr);
    });
  };

  const getVendor = () => {
    const collectData = {
      "venderId": -1,
      "countryId": 0,
      "stateId": 0,
      "cityId": 0
    };
    api.post(`Master/GetVendorMaster`, collectData).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.name,
        value: item.venderId,
      }));
      setVendorOption(arr);
    });
  };

 
  

  const fetchZonesData = async () => {
    try {
      const collectData = {
        vendor: vend,
        itemName: isItem,
        mrnDatefrom: formik.values.mrnDatefrom,
        mrnDateTo: formik.values.mrnDateTo,
        show: true, 
        exportOption: "selectedFormat", 
      };
      const response = await api.post(`Report/GetVendorItemApi`, collectData);
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
            flex: 0.8,
           headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "mrnNo",
            headerName: t("text.mrnNo"),
            flex: 1,
            cellClassName: "wrap-text", // Added here
            headerClassName: "MuiDataGrid-colCell",

          },
          {
            field: "itemName",
            headerName: t("text.ItemName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "quantity",
            headerName: t("text.Quantity"),
            flex: 1,

            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "rate",
            headerName: t("text.Rate"),
            flex: 1,
            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "netAmount",
            headerName: t("text.NetAmount"),
            flex: 1,
            // align: "right",
            // headerAlign: "right",
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "vendor",
            headerName: t("text.Vendor"),
            flex: 1.7,
           headerClassName: "MuiDataGrid-colCell",

            cellClassName: "wrap-text", // Added here
          },
          {
            field: "mrnDate",
            headerName: t("text.mrnDate"),
            flex: 1,
            renderCell: (params) => {
              return moment(params.row.mrnDate).format("DD-MM-YYYY");
            },
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
              fontSize: 12,
              fontWeight: 700,
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
            {t("text.VendorItemDetail")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2} >
            <Grid item xs={12} sm={3} lg={3}>
              <Autocomplete
               // multiple
                disablePortal
                id="combo-box-demo"
                options={ItemOption}
                value={isItem}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if(!newValue)
                  {
                    return;
                  }
                    
                  
                  setItem(newValue.label);
                }}
               // disableCloseOnSelect
               
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel text={t("text.SelectItem")} required={false} />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            <Grid item xs={12} sm={3} lg={3}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={VendorOption}
                value={vend}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  if(!newValue)
                  {
                    return;
                  }
                 
                  setVendor(newValue.label);
                }}
               
               
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel text={t("text.SelectVendor")} required={false} />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            <Grid xs={12} sm={3} md={3} item>
              <TextField
                type="date"
                id="mrnDatefrom"
                name="mrnDatefrom"
                label={
                  <CustomLabel text={t("text.mrnDatefrom")} required={true} />
                }
                value={formik.values.mrnDatefrom}
                placeholder={t("text.mrnDatefrom")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mrnDatefrom && Boolean(formik.errors.mrnDatefrom)}
                helperText={formik.touched.mrnDatefrom && formik.errors.mrnDatefrom}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* To Date Input */}
            <Grid xs={12} sm={3} md={3} item>
              <TextField
                type="date"
                id="mrnDateTo"
                name="mrnDateTo"
                label={<CustomLabel text={t("text.mrnDateTo")} required={true} />}
                value={formik.values.mrnDateTo}
                placeholder={t("text.mrnDateTo")}
                size="small"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mrnDateTo && Boolean(formik.errors.mrnDateTo)}
                helperText={formik.touched.mrnDateTo && formik.errors.mrnDateTo}
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
                        mrnDateTo: true,
                        mrnDatefrom: true,
                      
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
                  setSelectedFormat(".pdf");
                  setVisible(false);
                  setItem("");
                  setVendor("");
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
