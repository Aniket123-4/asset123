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
import Logo from "../../../assets/images/KanpurLogo.png";
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

export default function VehicleAgeReport() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [CatOption, setCatOption] = useState([
    { value: "-1", label: "Select Category" },
  ]);

  const [itemCat, setItemCat] = useState("");

  const [isPrint, setPrint] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState<any>(".pdf");

  const [VnoOption, setVnoOption] = useState([
    { value: -1, label: "Select Vehicle No " },
  ]);

  const [EmpOption, setEmpOption] = useState([
    { value: -1, label: "Select Employee" },
  ]);
  const [vNO, setVno] = useState("");

  const [IsEmp, setEmployee] = useState("");

  const [selDay, setDay] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat((event.target as HTMLInputElement).value);
  };
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      days: 0,
      parentId: 0,
      startDate: "",
      endDate: "",
      daysOnly: false,
      displayLabel: "",
      index: 0,

      Category: "",
      Employee: "",
      PurchaseYearTo: "",
      PurchaseYearFrom: "",
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

  const handleDownload = async () => {
    const collectData = {
      vehicleNo: vNO,
      empName: IsEmp,
      itemCategory: itemCat,
      purchaseYearfrom: parseInt(formik.values.PurchaseYearFrom),
      purchaseYearTo: parseInt(formik.values.PurchaseYearTo),
      show: false,
      exportOption: selectedFormat, // .pdf, .xls, or TabularExc
    };

    try {
      const response = await api.post(`Report/GetVehicleAgeApi`, collectData);

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

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getCategory();

    getEmp();
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

  const getEmp = () => {
    const collectData = {
      empid: -1,
      userId: "",
    };

    api.post(`Employee/GetEmployee`, collectData).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.empName,
        value: item.empid,
      }));
      setEmpOption(arr);
    });
  };

  const getCategory = () => {
    const collectData = {
      itemCategoryId: -1,
    };

    api.post(`ItemCategory/GetItemCategory`, collectData).then((res) => {
      const arr = res?.data?.data.map((item: any) => ({
        label: item.itemCategory,
        value: item.itemCategoryId,
      }));
      setCatOption(arr);
    });
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        vehicleNo: vNO,
        empName: IsEmp,
        itemCategory: itemCat,
        purchaseYearfrom: parseInt(formik.values.PurchaseYearFrom),
        purchaseYearTo: parseInt(formik.values.PurchaseYearTo),
        show: true,
        exportOption: "selectedFormat",
      };
      const response = await api.post(`Report/GetVehicleAgeApi`, collectData);
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
          // {
          //   field: "serialNo",
          //   headerName: t("text.SrNo"),
          //   flex: 0.5,
          //   headerClassName: "MuiDataGrid-colCell",
          //   cellClassName: "wrap-text", // Added here
          // },
          // {
          //   field: "itemCode",
          //   headerName: t("text.itemCode"),
          //   flex: 1.3,
          //   cellClassName: "wrap-text", // Added here
          //   headerClassName: "MuiDataGrid-colCell",
          //   // renderCell: (params) => {
          //   //   return moment(params.row.trackDate).format("DD-MM-YYYY");
          //   // },
          // },
          {
            field: "vehicleNo",
            headerName: t("text.vehicleNo"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 1.2,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "purchaseYear",
            headerName: t("text.purchaseYear"),
            flex: 1.3,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "age",
            headerName: t("text.age"),
            flex: 0.7,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemType",
            headerName: t("text.itemType"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "itemCategory",
            headerName: t("text.ItemCategory"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",

            cellClassName: "wrap-text", // Added here
          },
          {
            field: "empName",
            headerName: t("text.empName"),
            flex: 1.7,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "empMobileNo",
            headerName: t("text.empMobileNo"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "service",
            headerName: t("text.TotalServices"),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
            cellClassName: "wrap-text", // Added here
          },
          {
            field: "expense",
            headerName: t("text.TotalExpense"),
            flex: 1.5,
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
            {t("text.VehicleAgeReport")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2}>
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
                  setVno(newValue?.label);
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
                label={<CustomLabel text={t("text.PurchaseYearFrom")} />}
                value={formik.values.PurchaseYearFrom}
                name="PurchaseYearFrom"
                id="PurchaseYearFrom"
                placeholder={t("text.PurchaseYearFrom")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid xs={12} md={4} lg={4} item>
              <TextField
                label={<CustomLabel text={t("text.PurchaseYearTo")} />}
                value={formik.values.PurchaseYearTo}
                name="PurchaseYearTo"
                id="PurchaseYearTo"
                placeholder={t("text.PurchaseYearTo")}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={EmpOption}
                value={IsEmp}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  setEmployee(newValue?.label);
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.selectemployee")}
                        required={false}
                      />
                    }
                  />
                )}
                popupIcon={null}
              />
            </Grid>

            {/* To Date Input */}
            <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                //multiple
                disablePortal
                id="combo-box-demo"
                options={CatOption}
                value={itemCat}
                fullWidth
                size="small"
                onChange={(event: any, newValue: any) => {
                  setItemCat(newValue?.label);
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label={
                      <CustomLabel
                        text={t("text.SelectCategory")}
                        required={false}
                      />
                    }
                  />
                )}
                //popupIcon={null}
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
                  setEmployee("");
                  setItemCat("");
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

// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";

// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from "@mui/material/CssBaseline";

// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";

// import {
//   Avatar,

//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Modal,

// } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import call from "../../assets/images/phone-call.png";
// import roles from "../../assets/images/role-model.png";
// import tick from "../../assets/images/check-mark.png";
// import crs from "../../assets/images/cross.png";
// import log from "../../assets/images/profile.png";
// import emails from "../../assets/images/gmail.png";
// import genders from "../../assets/images/symbol.png";
// import dobs from "../../assets/images/timetable.png";
// import id from "../../assets/images/profile1.png";
// import settings from "../../assets/images/settings.png";
// import trans from "../../assets/images/translation.png";
// import logout from "../../assets/images/logout.png";
// import logged from "../../assets/images/permission.png";
// import logo from "../../assets/images/recyclebinLogo.png";
// import loged from "../../assets/images/DrawerLogo.png";
// import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
// import { Home } from "@mui/icons-material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Collapse from "@mui/material/Collapse";

// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import "./Shine.css";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import HomeIcon from "@mui/icons-material/Home";
// import WhatshotIcon from "@mui/icons-material/Whatshot";
// import GrainIcon from "@mui/icons-material/Grain";
// import names from "../../assets/images/id-card (2).png";
// import backgrd from "../../assets/images/backgroundimage.jpg";
// import SearchIcon from "@mui/icons-material/Search";

// import InputBase from "@mui/material/InputBase";

// import InputAdornment from "@mui/material/InputAdornment";
// import {

//   CardContent,

//   // Typography,
// } from "@mui/material";
// import "./ThemeStyle.css";
// import ThemeIcon from "../../assets/images/themes.png";
// import {
//   Brightness5,
//   Brightness4,
//   Waves,
//   WbSunny,
//   Forest,
//   Flag,
// } from "@mui/icons-material";

// import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
// import TreeView from "@mui/x-tree-view/TreeView";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

// import { FaRegFolderOpen } from "react-icons/fa6";
// import DescriptionIcon from '@mui/icons-material/Description';

// import { FaFileLines } from "react-icons/fa6";

// const drawerWidth = 225;

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "95%",
//   height: "85%",
//   bgcolor: "#f5f5f5",
//   border: "1px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 10,
// };

// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(12)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

// function getGreeting() {
//   const hour = new Date().getHours();

//   let greeting;
//   if (hour < 12) {
//     greeting = {
//       text: "Good Morning",
//       color: "#FFFFE0",
//       icon: "🌅", // Sunrise emoji
//     };
//   } else if (hour < 17) {
//     greeting = {
//       text: "Good Afternoon",
//       color: "#FFE4B5",
//       icon: "🌞", // Sun emoji
//     };
//   } else {
//     greeting = {
//       text: "Good Evening",
//       color: "#FFDAB9",
//       icon: "🌜", // Crescent moon emoji
//     };
//   }

//   return greeting;
// }

// export default function MiniDrawer({ items }: any) {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(true);
//   const [menuOpen, setMenuOpen] = React.useState(false);
//   const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
//   const [openlogo, setOpenlogo] = React.useState(true);
//   const [homeColor, setHomeColor] = React.useState("inherit");
//   const { t } = useTranslation();

//   const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);

//   const [expandedItems, setExpandedItems] = React.useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);

//   const [treedata, setTreedata] = React.useState<any>([]);
//   // console.log("data", treedata)
//   const [check, setCheck] = React.useState<any>([]);

//   const [searchValue, setSearchValue] = React.useState("");
//   // const [filteredItems, setFilteredItems] = React.useState([]);
//   const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

//   const themes = [
//     { name: "light-theme", icon: <Brightness5 /> },
//     { name: "dark-theme", icon: <Brightness4 /> },
//     { name: "ocean-theme", icon: <Waves /> },
//     { name: "sunset-theme", icon: <WbSunny /> },
//     { name: "forest-theme", icon: <Forest /> },
//     { name: "bhagwa-theme", icon: <Flag /> },
//   ];

//   const greeting = getGreeting();

//   let navigate = useNavigate();

//   function searchMenuItems(items: any, query: string) {
//     const results = [];

//     for (const menuItem of items) {
//       if (menuItem.name.toLowerCase().includes(query.toLowerCase())) {
//         results.push(menuItem);
//       } else if (menuItem.items && menuItem.items.length > 0) {
//         const matchingSubItems = menuItem.items.filter(
//           (subItem: { name: string }) =>
//             subItem.name.toLowerCase().includes(query.toLowerCase())
//         );
//         if (matchingSubItems.length > 0) {
//           results.push({ ...menuItem, items: matchingSubItems });
//         }
//       }
//     }
//     return results;
//   }

//   interface MenuItem {
//     Icon: any;
//     displayNo: number;
//     id: number;
//     items: MenuItem[];
//     label: string;
//     name: string;
//     path: string;
//   }

//   const handleSearchIconClick = () => {
//     console.log("value", searchValue);
//     const filtered = searchMenuItems(items, searchValue);
//     setFilteredItems(filtered);
//     console.log("filtered", filtered);
//   };

//   const handleNavigation = (path: any) => {
//     console.log("Navigating to:", path);
//     navigate(path);
//   };

//   const handleAutocompleteChange = (event: any, value: any) => {
//     const selectedItem = items.find((item: any) =>
//       item.items.some((subItem: any) => subItem.name === value)
//     );
//     if (selectedItem) {
//       const selectedSubItem = selectedItem.items.find(
//         (subItem: any) => subItem.name === value
//       );
//       if (selectedSubItem) {
//         handleNavigation(selectedSubItem.path);
//       }
//     }
//   };

//   const allMenuNames = items.reduce((acc: any, item: { items: any[] }) => {
//     if (item.items) {
//       return [
//         ...acc,
//         ...item.items.map((subItem: { name: any }) => subItem.name),
//       ];
//     }
//     return acc;
//   }, []);

//   const filteredItemed = allMenuNames.filter((item: string) =>
//     item.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   const handleSearchInputChange = (e: any) => {
//     console.log("first 1", e.target.value);
//     const value = e.target.value;
//     setSearchValue(value);

//     const filtered = searchMenuItems(items, value);
//     setFilteredItems(filtered);
//   };

//   var [date, setDate] = React.useState(new Date());

//   const options: Intl.DateTimeFormatOptions = {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   };

//   const formattedDate = date
//     .toLocaleDateString("en-US", options)
//     .split(" ")
//     .map((part, index) =>
//       index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
//     )
//     .join(" ");

//   React.useEffect(() => {
//     var timer = setInterval(() => setDate(new Date()), 1000);
//     return function cleanup() {
//       clearInterval(timer);
//     };
//   });

//   const handleSubMenuClick = (index: any) => {
//     console.log(index);
//     setSelectedSubMenu(index);
//   };
//   const resetHomeColor = () => {
//     // setHomeColor("inherit");
//     setHomeColor("#FF0000");
//     // setHomeColor("");
//   };

//   const backgroundStyle = {
//     background: "linear-gradient(45deg, #fff, #f0f)",
//     backgroundSize: "400% 400%",
//   };

//   const handleClick = (event: any) => {
//     setAnchorEl(event.currentTarget);
//     setMenuOpen(true);
//     setHomeColor("inherit");
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuOpen(false);
//   };

//   const routeChangeHome = () => {
//     let path = `/home`;
//     navigate(path);
//   };

//   const handleDrawerOpen = () => {
//     setOpen(true);
//     setOpenlogo(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//     setOpenlogo(false);
//   };

//   const Logout = () => {
//     localStorage.removeItem("userdata");
//     navigate("/");
//   };

//   function onClick(e: any, item: any) {
//     // console.log("Main " + item);

//     let path = item.path;
//     if (path == "" || path == null || path == "undefind") {
//       window.alert("Path Not Found ????");
//     } else {
//       navigate(path);
//     }
//   }

//   // var data = JSON.parse(localStorage.getItem("userdata")!);
//   // var menudata = data[0]["userdetail"];
//   // var username =
//   //   menudata[0]["firsT_NAME"] +
//   //   " " +
//   //   menudata[0]["middlE_NAME"] +
//   //   " " +
//   //   menudata[0]["suR_NAME"];
//   const { i18n } = useTranslation();

//   const changeLanguage = (language: any) => {
//     // console.log("check", language);

//     i18n.changeLanguage(language);
//     localStorage.setItem("preferredLanguage", language);
//   };
//   var currentLanguage = localStorage.getItem("preferredLanguage");
//   var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

//   const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
//   const userDetail = userData[0]?.userdetail || [];
//   // console.log(userDetail);

//   const collapsehamndle = (index: any) => {
//     // console.log(index);
//     if (index == collapseIndex) {
//       setCollapseIndex(-1);
//     } else {
//       setCollapseIndex(index);
//     }
//   };
//   // console.log("items", items);

//   const getImageForFirstName = (
//     firsT_NAME: any,
//     middlE_NAME: any,
//     suR_NAME: any
//   ) => {
//     const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
//     const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
//     const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
//     return `${firstLetter}${secondLetter}${thirdLetter}`;
//   };

//   const getGenderText = (gendeR_ID: any) => {
//     switch (gendeR_ID) {
//       case 1:
//         return "Male";
//       case 2:
//         return "Female";
//       case 3:
//         return "Other";
//       default:
//         return "Unknown";
//     }
//   };

//   const handleMyProfileClick = () => {
//     // console.log("My Profile clicked" + profileDrawerOpen);
//     setProfileDrawerOpen(!profileDrawerOpen);
//   };

//   const currentPathname = window.location.pathname;
//   const segments = currentPathname.split("/").filter(Boolean);
//   const isHomePage = segments.length === 0;

//   function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
//     event.preventDefault();
//     // console.info("You clicked a breadcrumb.");
//   }

//   const handleClickhome = () => {
//     let path = `/home`;
//     navigate(path);
//   };

//   function FirstLetters(props: any) {
//     const { text } = props;

//     const words = text.split(" ");

//     // Extract the first letter from each word
//     const firstLetters = words.map((word: any) => word.charAt(0));

//     // Join the first letters back into a string
//     const result = firstLetters.join("");

//     return <div>{result}</div>;
//   }

//   const handleRightClick = (path: any) => (e: any) => {
//     e.preventDefault();
//     window.open(path, "_blank");
//   };

//   const [showThemeMenu, setShowThemeMenu] = React.useState(false);

//   const [selectedTheme, setSelectedTheme] = React.useState(() => {
//     const storedTheme = localStorage.getItem("theme");

//     return storedTheme ? storedTheme : themes[0]["name"];
//   });

//   React.useEffect(() => {
//     console.log(selectedTheme);
//     document.body.className = selectedTheme;

//     localStorage.setItem("theme", selectedTheme);
//   }, [selectedTheme]);

//   const handleThemeChange = (theme: any) => {
//     setSelectedTheme(theme);
//     setShowThemeMenu(false);
//   };

//   const handleCloseSelect = () => {
//     setShowThemeMenu(false);
//   };

//   const headerColor1 = `var(--header-background)`;
//   const drawerStyles = `var(--drawer-background)`;

//   let ID: any = localStorage.getItem("username");
//   ID = ID.replace(/^"(.*)"$/, "$1");
//   const handlePermissionClick = () => {
//     if (ID) {
//       console.log("id check 175", ID);
//       getNode(ID);
//     } else {
//       toast.error("ID not found");
//     }
//     setIsModalOpen(true);
//     console.log("first");
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const getNode = (id: any) => {
//     const collectData = {
//       id: -1,
//       nodeID: -1,
//       titleID: -1,
//       user_Id: id,
//     };
//     api
//       .post(`NewNodeMaster/GetNewNodeMasterHeirarical`, collectData)
//       .then((res: any) => {
//         if (res.data && res.data.data && res.data.data.length > 0) {
//           setTreedata(res.data.data);
//           const allNodeIds = getAllNodeIds(res.data.data);
//           setExpandedItems(allNodeIds);
//         } else {
//           toast.error("Data is null or empty");
//         }
//       });
//   };

//   const getAllNodeIds = (nodes: any[]): string[] => {
//     let ids: string[] = [];

//     const collectIds = (nodes: any[]) => {
//       nodes.forEach((node) => {
//         ids.push(node.id.toString());
//         if (node.childnode) {
//           collectIds(node.childnode);
//         }
//       });
//     };

//     collectIds(nodes);

//     return ids;
//   };

//   const defaultSelectedNodeId = parseInt(localStorage.getItem("id") + "");

//   React.useEffect(() => {
//     // Set default selected node here
//     if (defaultSelectedNodeId) {
//       setCheck([defaultSelectedNodeId]);
//     }

//     const initialExpanded = getAllNodeIds(treedata);
//     setExpandedItems(initialExpanded);
//   }, [defaultSelectedNodeId, treedata]);

//   const [nodeId, setnodeId] = React.useState<any>(0);
//   const [nodeNames, setNodeNames] = React.useState<string>("");

//   // Effect to apply the theme from local storage

//   const handleToggle = (id: number, name: string) => () => {
//     const currentIndex = check.indexOf(id);
//     //const newChecked = [...check];
//     const newChecked = currentIndex === -1 ? [id] : [];
//     //const updatedChecked = currentIndex === -1 ? [id] : [];

//     if (currentIndex === -1) {
//       newChecked.push(id);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     setCheck(newChecked);

//     // setExpandedItems((prevExpanded) =>
//     //   prevExpanded.includes(id.toString())
//     //     ? prevExpanded.filter((item) => item !== id.toString())
//     //     : [...prevExpanded, id.toString()]
//     // );

//     console.log("Checked data:", name);
//     console.log("Checked data:", id);

//     setNodeNames(name);
//     setnodeId(id);
//     // handleSave(id, name);
//   };

//   const handleSave = () => {
//     console.log("handleSave function called");

//     if (nodeId != 0 || nodeNames != "") {
//       localStorage.setItem("id", nodeId);
//       localStorage.setItem("nodeName", nodeNames);
//       console.log("Checked Save:", { nodeId, nodeNames });

//       handleCloseModal();
//     } else {
//       toast.error("Please Retry... Network Issues");
//     }
//   };

//   const renderTree = (nodes: any) => (
//     <TreeItem
//       key={nodes.id}
//       itemId={String(nodes.id)}
//       label={
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <Checkbox
//             checked={check.indexOf(nodes.id) !== -1}
//             // onChange={handleToggle(nodes.id)}

//             onChange={handleToggle(nodes.id, nodes.name)}
//             onClick={(event: any) => event.stopPropagation()}
//           />

//           <div style={{ marginLeft: 8 }}>{nodes.name}</div>
//         </div>
//       }
//       onClick={() => toggleExpansion(nodes.id.toString())}
//     >
//       {Array.isArray(nodes.childnode)
//         ? nodes.childnode.map((node: any) => renderTree(node))
//         : null}
//     </TreeItem>
//   );

//   const toggleExpansion = (nodeId: string) => {
//     if (expandedItems.includes(nodeId)) {
//       setExpandedItems(expandedItems.filter((item) => item !== nodeId));
//     } else {
//       setExpandedItems([...expandedItems, nodeId]);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* <CssBaseline /> */}
//       <AppBar position="fixed" open={open} style={{}}>
//         <Toolbar
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: `var(--header-background1)`,
//             color: `var(--header-color1)`,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-start",
//               alignItems: "center",
//               // paddingTop: "10px",
//               // paddingBottom: "10px",
//             }}
//           >
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={handleDrawerOpen}
//               edge="start"
//               sx={{
//                 // marginRight: 5,
//                 ...(open && { display: "none" }),
//               }}
//             >
//               <MenuIcon fontSize="large" />
//             </IconButton>

//             {!openlogo && <img src={logo} width={60} height={60} />}
//           </div>

//           <div style={{ fontSize: "2.5vw" }}>
//             Vehicle Workshop Management System
//           </div>

//           <IconButton
//             onClick={handleClick}
//             size="small"
//             sx={{ ml: 2 }}
//             aria-controls={open ? "account-menu" : undefined}
//             aria-haspopup="true"
//             aria-expanded={open ? "true" : undefined}
//           >
//             <Avatar sx={{ width: 40, height: 40 }}>
//               {/* {username[0].toUpperCase()} */}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             id="account-menu"
//             open={menuOpen}
//             // onClose={handleClose}
//             onClick={handleClose}
//             PaperProps={{
//               elevation: 0,
//               sx: {
//                 backgroundColor: `var(--menu-background)`,
//                 color: `var(--menu-color)`,
//                 overflow: "auto",
//                 filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//                 paddingRight: "10px",
//                 paddingLeft: "10px",
//                 mt: 1.5,
//                 "& .MuiAvatar-root": {
//                   width: 32,
//                   height: 32,
//                   ml: -0.5,
//                   mr: 1,
//                 },
//                 "&::before": {
//                   content: '""',
//                   display: "block",
//                   position: "absolute",
//                   top: 0,
//                   right: 14,
//                   width: 10,
//                   height: 10,
//                   bgcolor: "background.paper",
//                   transform: "translateY(-50%) rotate(45deg)",
//                   zIndex: 0,
//                 },
//               },
//             }}
//             transformOrigin={{ horizontal: "right", vertical: "top" }}
//             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//           >
//             <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//                 <img src={logged} width={40} height={40} />
//               </ListItemIcon>{" "}
//               {/* {username} */}
//             </MenuItem>
//             {/* <MenuItem > */}
//             <MenuItem onClick={handleMyProfileClick}>
//               <ListItemIcon>
//                 <img src={id} width={30} height={30} />
//               </ListItemIcon>
//               My Profile
//             </MenuItem>

//             <Divider />

//             <MenuItem
//               onClick={() => {
//                 localStorage.getItem("preferredLanguage") == "hi"
//                   ? changeLanguage("en")
//                   : changeLanguage("hi");
//               }}
//             >
//               <ListItemIcon>
//                 <img src={trans} width={30} height={30} />
//               </ListItemIcon>
//               Translate -- {newLanguage}
//             </MenuItem>
//             <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//                 <img src={settings} width={30} height={30} />
//               </ListItemIcon>
//               Settings
//             </MenuItem>

//             <MenuItem onClick={handlePermissionClick}>
//               <ListItemIcon>
//                 <img src={logged} width={40} height={40} alt="Permission" />
//               </ListItemIcon>
//               Permission
//             </MenuItem>

//             <MenuItem onClick={() => setShowThemeMenu(!showThemeMenu)}>
//               <ListItemIcon>
//                 <img src={ThemeIcon} width={30} height={30} />
//               </ListItemIcon>
//               Select Theme
//             </MenuItem>

//             <Divider />
//             <MenuItem onClick={Logout}>
//               <ListItemIcon>
//                 <img src={logout} width={30} height={30} />
//               </ListItemIcon>
//               Logout
//             </MenuItem>
//           </Menu>
//         </Toolbar>

//         <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
//           <DialogTitle>Select a Theme</DialogTitle>
//           <DialogContent>
//             <List>
//               {themes.map((theme) => (
//                 <ListItem
//                   button
//                   key={theme.name}
//                   onClick={() => handleThemeChange(theme.name)}
//                   selected={selectedTheme === theme.name}
//                 >
//                   {theme.icon}
//                   <span style={{ marginLeft: "10px" }}>{theme.name}</span>
//                 </ListItem>
//               ))}
//             </List>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseSelect}>Cancel</Button>
//           </DialogActions>
//         </Dialog>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: headerColor1,
//             borderBottomRightRadius: "15px",
//           }}
//         >
//           <div
//             role="presentation"
//             onClick={handleClicked}
//             // style={{  borderBottomRightRadius: "15px" }}
//           >
//             <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
//               {/* <Link
//                 underline="hover"
//                 sx={{ display: "flex", alignItems: "center" }}
//                 color="inherit"
//                 href="/"
//               >
//                 <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//                 Home
//               </Link> */}
//               <Typography
//                 sx={{
//                   display: "flex",
//                   color: "#fff",
//                   alignItems: "center",
//                 }}
//               >
//                 <Link
//                   underline="hover"
//                   sx={{
//                     display: "flex",
//                     color: "#fff",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                   color="inherit"
//                   onClick={handleClickhome}
//                 >
//                   <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
//                   Home
//                 </Link>
//               </Typography>

//               {/* Render the rest of the breadcrumb path */}
//               {segments.slice(1).map((segment, index) => (
//                 <Typography
//                   key={index}
//                   sx={{
//                     display: "flex",
//                     color: "#fff",
//                     alignItems: "center",
//                   }}
//                 >
//                   {/* {" / "} */}
//                   {index > 0 && " / "}
//                   {index === segments.length - 2 ? (
//                     <span>
//                       {" "}
//                       {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
//                       {segment}
//                     </span>
//                   ) : (
//                     <Link
//                       underline="hover"
//                       sx={{
//                         display: "flex",
//                         color: "#fff",
//                         alignItems: "center",
//                       }}
//                       color="inherit"
//                       href={`/${segments.slice(0, index + 1).join("/")}`}
//                     >
//                       {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
//                       {segment}
//                     </Link>
//                   )}
//                 </Typography>
//               ))}
//             </Breadcrumbs>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: 15,
//               paddingRight: "15px",
//             }}
//           >
//             <p style={{ fontSize: "1.2vw", color: greeting.color }}>
//               {greeting.icon} {greeting.text}
//             </p>
//             <p> Time : {date.toLocaleTimeString()}</p>
//             <p> Date : {formattedDate}</p>
//           </div>
//         </div>
//       </AppBar>

//       <Drawer
//         variant="permanent"
//         open={open}
//         PaperProps={{
//           sx: {
//             backgroundColor: drawerStyles,
//             color: `var(--drawer-color)`,
//           },
//         }}
//       >
//         <DrawerHeader>
//           <>
//             <Stack
//               sx={{ width: "100%", height: "16vh" }}
//               direction="row"
//               justifyContent="center"
//             >
//               {openlogo ? (
//                 <div
//                   style={{
//                     paddingTop: "25px",
//                     paddingBottom: "25px",
//                   }}
//                 >
//                   <img src={loged} width={100} height={100} />
//                 </div>
//               ) : (
//                 <div style={{ padding: 0 }}></div>
//               )}
//             </Stack>

//             <IconButton onClick={handleDrawerClose}>
//               {theme.direction === "rtl" ? (
//                 <ChevronRightIcon />
//               ) : (
//                 <ChevronLeftIcon />
//               )}
//             </IconButton>
//             <br />
//             <br />
//           </>
//         </DrawerHeader>

//         <br />
//         <br />
//         <Divider />
//         {openlogo && (
//           <Paper
//             component="form"
//             sx={{
//               m: "5px 5px",
//               p: "0px 2px",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Autocomplete
//               freeSolo
//               fullWidth
//               size="small"
//               options={items.reduce((acc: any, item: any) => {
//                 if (item.items) {
//                   acc.push(...item.items.map((subItem: any) => subItem.name));
//                 }
//                 return acc;
//               }, [])}
//               onChange={handleAutocompleteChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   //label="Search Menu"
//                   placeholder="Search Menu"
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                   onChange={handleSearchInputChange}
//                 />
//               )}
//             />
//           </Paper>
//         )}
//         <Divider />

//         <React.Fragment>
//       {/* Home List */}
//       <List sx={{ padding: 0 }}>
//         {["Home"].map((text, index) => (
//           <ListItem
//             key={text}
//             disablePadding
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: 0,
//               "&:hover": {
//                 cursor: "pointer",
//                 backgroundColor: "inherit",
//               },
//             }}
//           >
//             <ListItemButton
//               sx={{
//                 justifyContent: open ? "initial" : "center",
//                 px: 4.5,
//                 backgroundColor: "inherit"
//               }}
//               onClick={() => {
//                 routeChangeHome();
//                 resetHomeColor();
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 0,
//                   mr: open ? 1 : "auto",
//                   justifyContent: "center",
//                   color: homeColor,
//                 }}
//               >
//                 <HomeIcon />
//               </ListItemIcon>
//               <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>

//       {/* Dynamic Items List */}
//       <List sx={{ padding: 0 }}>
//         {items.map((text:any, index:any) => (
//           <React.Fragment key={index}>
//             <Divider />
//             <ListItem
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "inherit"
//               }}
//               onClick={() => collapsehamndle(index)}
//             >
//               <ListItem sx={{
//                 justifyContent: open ? "initial" : "center",
//                 paddingLeft: 2,
//                 paddingRight: 0,
//                 paddingTop: 0,
//                 paddingBottom: 0,
//                 cursor: "pointer",
//               }}>
//                 {open ? (
//                   <ListItemIcon sx={{
//                     minWidth: 0,
//                     mr: open ? 1 : "auto",
//                     justifyContent: "center",
//                     color: index === collapseIndex ? "#FF0000" : "inherit",
//                     fontWeight: 600,
//                   }}>
//                     {collapseIndex === index ? <FaRegFolderOpen style={{color:"#42AEEE"}} size={20} />  : <FolderIcon style={{color:"#42AEEE"}} />}
//                   </ListItemIcon>
//                 ) : (
//                   <div
//                     style={{
//                       minWidth: 24,
//                       minHeight: 24,
//                       borderRadius: "50%",
//                       backgroundColor: "lightgray",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       marginRight: 8,
//                       color: index === collapseIndex ? "#FF0000" : "inherit",
//                     }}
//                     title={text.name}
//                   >
//                     {text.name.charAt(0)}
//                   </div>
//                 )}

//                 <ListItemText primary={text.name} sx={{ opacity: open ? 1 : 0 }} />
//               </ListItem>
//               <ListItemIcon sx={{ opacity: open ? 1 : 0, justifyContent: "end" }}>
//                 {/* {collapseIndex === index ? (
//                   <ExpandLessIcon className="sidebar-item-expand-arrow sidebar-item-expand-arrow-expanded" />
//                 ) : (
//                   <ExpandMoreIcon className="sidebar-item-expand-arrow" />
//                 )} */}
//               </ListItemIcon>
//             </ListItem>
//             <Divider />

//             {/* Submenu Items */}
//             {collapseIndex === index && (
//               <List sx={{ paddingLeft: open ? 2 : 0, backgroundColor: "inherit",alignItems:"center",justifyContent:"center" }}>
//                 {items[index].items.map((subText:any, subIndex:any) => (
//                   <List sx={{ pl: 2 ,alignItems:"center",justifyContent:"center" }} key={subIndex}>
//                     <ListItem
//                       sx={{
//                         display: "flex",
//                         justifyContent: "start",
//                         alignItems: "center",
//                         paddingLeft: 2,
//                         paddingRight: 0,
//                         paddingTop: 0,
//                         paddingBottom: 0,
//                         backgroundColor: selectedSubMenu === subIndex ? "#FF7722" : "inherit",
//                         color: selectedSubMenu === subIndex ? "white" : "var(--drawer-color)",
//                         borderRadius: "10px",
//                         cursor: "pointer",
//                         "&:hover": {
//                           backgroundColor: "lightgray",
//                           color: "black",
//                         },
//                       }}
//                       onClick={(e) => {
//                         onClick(e, subText);
//                         handleSubMenuClick(subIndex);
//                       }}
//                     >
//                       {open && (
//                         <span
//                           style={{
//                             fontSize: "1.2rem",
//                             backgroundColor: "inherit",
//                             padding: "6px",
//                             borderRadius: "10px",
//                             color:"#426aee"
//                           }}
//                         >
//                          <FaFileLines />
//                         </span>
//                       )}
//                       {open ? (
//                         <p
//                           style={{
//                             fontWeight: 500,
//                             paddingTop: "3px",
//                             paddingBottom: "3px",
//                             opacity: open ? 1 : 0,
//                           }}
//                         >
//                           {subText.name}
//                         </p>
//                       ) : (
//                         <ListItemIcon
//                           sx={{
//                             minWidth: 0,
//                             mr: open ? 3 : "auto",
//                             justifyContent: "center",
//                             color: open ? "#FF0000" : "inherit",
//                             backgroundColor: selectedSubMenu === subIndex ? "#FF7722" : "inherit",
//                             borderRadius: "25px",
//                             padding: "5px 10px",
//                           }}
//                           title={subText.name}
//                         >
//                           <DescriptionIcon />
//                         </ListItemIcon>
//                       )}
//                     </ListItem>
//                   </List>
//                 ))}
//               </List>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </React.Fragment>
//       </Drawer>
//       {/* <Box  sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//       </Box> */}

//       <Modal open={isModalOpen} onClose={handleCloseModal}>
//         <Box sx={style}>
//           <Typography fontWeight={500} fontSize={20} noWrap align="center">
//             Node Permission
//           </Typography>
//           <div>
//             <Grid xs={12} item>
//               <Box>
//                 <div style={{ height: "400px", overflow: "auto" }}>
//                   <SimpleTreeView expandedItems={expandedItems}>
//                     {Array.isArray(treedata)
//                       ? treedata.map((node: any) => renderTree(node))
//                       : null}
//                   </SimpleTreeView>
//                 </div>
//               </Box>
//             </Grid>
//             <Grid xs={3} item alignItems="center" justifyContent="center">
//               <Button
//                 type="submit"
//                 fullWidth
//                 style={{
//                   backgroundColor: "#059669",
//                   color: "white",
//                   marginTop: "10px",
//                 }}
//                 onClick={(e: any) => handleSave()}
//               >
//                 {t("text.save")}
//               </Button>
//             </Grid>
//           </div>
//         </Box>
//       </Modal>

//       <SwipeableDrawer
//         anchor="left"
//         open={profileDrawerOpen}
//         onClose={() => {
//           setProfileDrawerOpen(false);
//         }}
//         onOpen={() => {}}
//         style={{
//           zIndex: 1300,
//         }}
//       >
//         <Box sx={{ width: drawerWidth }} role="presentation">
//           <IconButton
//             edge="end"
//             onClick={() => setProfileDrawerOpen(false)}
//             aria-label="close"
//             sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <p
//             style={{
//               paddingTop: "5vh",
//               paddingBottom: "5vh",
//               textAlign: "center",
//               backgroundImage:
//                 "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
//               color: "whitesmoke",
//               borderBottomLeftRadius: "10px",
//               borderBottomRightRadius: "10px",
//               fontSize: "20px",
//             }}
//           >
//             User Details
//           </p>
//           {userDetail.map((user: any, index: any) => (
//             <div key={index}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "10px",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     textAlign: "center",
//                     borderRadius: "50%",
//                     height: "90px",
//                     width: "90px",
//                     borderColor:
//                       "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
//                     backgroundColor: "red",
//                     padding: "13px",
//                     paddingTop: "30px",
//                     paddingLeft: "13px",
//                     color: "whitesmoke",
//                     fontSize: "20px",
//                   }}
//                 >
//                   {getImageForFirstName(
//                     user.firsT_NAME,
//                     user.middlE_NAME,
//                     user.suR_NAME
//                   )}
//                 </div>
//               </div>
//               <div style={{ marginLeft: "15px" }}>
//                 {user.logiN_NAME && user.logiN_NAME.trim() !== "" && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 20,
//                     }}
//                   >
//                     <img src={log} width={25} />
//                     {user.logiN_NAME}
//                   </div>
//                 )}
//                 <br />
//                 {user.rolename && user.rolename.trim() !== "" ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 10,
//                     }}
//                   >
//                     <img src={roles} width={25} />
//                     {user.rolename}
//                   </div>
//                 ) : (
//                   ""
//                 )}
//                 <br />
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 20,
//                   }}
//                 >
//                   <img src={names} width={25} />
//                   {user.firsT_NAME} {user.middlE_NAME} {user.suR_NAME}
//                 </div>
//                 <br />
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                   }}
//                 >
//                   {" "}
//                   <img src={dobs} width={22} />{" "}
//                   {dayjs(user.dob).format("YYYY-MM-DD")}
//                 </div>
//                 <br />
//                 {user.gendeR_ID !== 0 ? (
//                   <>
//                     {user.gendeR_ID && getGenderText(user.gendeR_ID) && (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 10,
//                         }}
//                       >
//                         {" "}
//                         <img src={genders} width={22} />{" "}
//                         {getGenderText(user.gendeR_ID)}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   " "
//                 )}

//                 <br />

//                 {user.cuR_MOBILE && user.cuR_MOBILE.trim() !== "" && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 20,
//                     }}
//                   >
//                     <img src={call} width={25} />
//                     {user.cuR_MOBILE}
//                   </div>
//                 )}
//                 <br />

//                 {user.email && user.email.trim() !== "" && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 20,
//                     }}
//                   >
//                     <img src={emails} width={25} />
//                     {user.email}
//                   </div>
//                 )}
//                 <br />

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                   }}
//                 >
//                   Account Status :{" "}
//                   {user.iS_ACTIVE === true ? (
//                     <img src={tick} width={25} />
//                   ) : (
//                     <img src={crs} width={25} />
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Box>
//       </SwipeableDrawer>
//     </Box>
//   );
// }
