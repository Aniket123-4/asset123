import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // for insurance or related to fuel
import ListAltIcon from "@mui/icons-material/ListAlt"; // for registration or documents
import SettingsIcon from "@mui/icons-material/Settings"; // for services
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull"; // for scrap or vehicle condition
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts/PieChart";
import api from "../../utils/Url";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import ProgressBar from "@ramonak/react-progress-bar";
import BuildIcon from "@mui/icons-material/Build";
import { motion, useSpring } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { table } from "console";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import dayjs from "dayjs";
import CustomLabel from "../../CustomLable";
import { getId, getISTDate } from "../../utils/Constant";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "120%",
  bgcolor: "#f5f5f5",
  border: "0.1em solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10%",
};
const containerStyle = {
  width: "100%",
  height: "100%",
};
interface Department {
  dept_id: number;
  dept_name: string;
  session_year: string;
}
export default function HomePage() {

  const { t } = useTranslation();
  const UserId = getId();
  const { defaultValuestime } = getISTDate();
  let navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [value, setValue] = useState<any>(
    parseInt(localStorage.getItem("dash") || "0", 10)
  );
  const [isShow, setIsShow] = useState(true);
  const [isShow2, setIsShow2] = useState<any>(false);
  const [getTop, setGetTop] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const [outOfStock, setOutOfStock] = useState(20);
  const [toExpire, setToExpire] = useState(10);
  const [isVisible, setVisible] = useState(false);

  const [isPrint, setPrint] = useState([]);
  const [isPrint1, setPrint1] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(true);

  const [ItemIssueOption, setItemIssueOption] = useState<any>([]);
  const [GeoLocationOption, setGeoLocationOption] = useState<any>([]);

  const [columns, setColumns] = useState<GridColDef[]>([]);

  const [assetDetails, setAssetDetails] = useState<any>([]);
  const [locationData, setLocationData] = useState<any>([]);

  useEffect(() => { }, [getTop]);

  useEffect(() => {
    fetchAssetDetails();
    fetchLocation();
    getItemIssueData();
  }, []);


  const fetchAssetDetails = async () => {
    try {
      const response = await api.post("ResourceDetail", {
        Type: 4,
      });

      const data = response.data.data.map((item: any) => {
        return {
          ...item,
        };
      });

      setAssetDetails(data);
    } catch (error) {
      console.error("Error fetching asset types:", error);
      toast.error("Failed to load asset types.");
    }
  };


  const fetchLocation = async () => {
    try {
      const response = await api.post("LocationMaster", {
        Type: 3,
      });

      const data = response.data.data.map((item: any) => {
        return {
          ...item,
        };
      });

      setLocationData(data);
    } catch (error) {
      console.error("Error fetching asset types:", error);
      toast.error("Failed to load asset types.");
    }
  };


  const getItemIssueData = async () => {
    try {
      const response = await api.post(`ResourceIssueReturn`, { "Type": 4 });
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: index,
        serialNo: index + 1,
        issuedate: dayjs(item.issuedate).format("DD-MM-YYYY"),
      }));
      setItemIssueOption(processedData);
      setIsLoading(false);
      setIsShow2(false);
      setIsShow(true);
      setSearchTerm("");
      setSearchTerm1("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: .5 },
          { field: "rescode", headerName: t("text.Code"), flex: 1 },
          { field: "resname", headerName: t("text.Asset"), flex: 1 },
          { field: "ResType", headerName: t("text.Type"), flex: 1 },
          { field: "empname", headerName: t("text.EmpName"), flex: 1 },
          { field: "issuedate", headerName: t("text.IssueDate"), flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGeoLocationData = async () => {
    try {
      const response = await api.post(`AssetLocation`, { "Type": 4 });
      const data = response.data.data;
      console.log("Fetched Data:", data);
      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.Id,
        serialNo: index + 1,
        ResourceCode: assetDetails[
          assetDetails.findIndex((e: any) => e.ID === parseInt(item.Asset_Id))
        ]?.ResourceCode,
        ResourceName: assetDetails[
          assetDetails.findIndex((e: any) => e.ID === parseInt(item.Asset_Id))
        ]?.ResourceName,
        ResourceType: item.Asset_Type,
        assetLocation: locationData[
          locationData.findIndex(
            (e: any) => e.LocId === parseInt(item.Location_Id)
          )
        ]?.LocName,
      }));
      setGeoLocationOption(processedData);
      setIsLoading1(false);
      setIsShow2(true);
      setIsShow(false);
      setSearchTerm("");
      setSearchTerm1("");
      if (data.length > 0) {
        const dynamicColumns: GridColDef[] = [
          {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Stack
                spacing={1}
                direction="row"
                sx={{ alignItems: "center", marginTop: "1%" }}
              ></Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: .5 },
          { field: "ResourceCode", headerName: t("text.ResourceCode"), flex: 1 },
          { field: "ResourceName", headerName: t("text.ResourceName"), flex: 1 },
          { field: "ResourceType", headerName: t("text.ResourceType"), flex: 1 },
          { field: "assetLocation", headerName: t("text.LocationName"), flex: 1 },
        ];
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const getGeoLocationData = async () => {
  //   try {
  //     const response = await api.post(`ResourceDetail`, { "Type": 4 });
  //     const data = response.data.data;
  //     console.log("Fetched Data:", data);
  //     const processedData = data.map((item: any, index: number) => ({
  //       ...item,
  //       id: item.ID,
  //       serialNo: index + 1,
  //     }));
  //     setGeoLocationOption(processedData);
  //     setIsLoading1(false);
  //     setIsShow2(true);
  //     setIsShow(false);
  //     setSearchTerm("");
  //     setSearchTerm1("");
  //     if (data.length > 0) {
  //       const dynamicColumns: GridColDef[] = [
  //         {
  //           field: "actions",
  //           headerName: "Actions",
  //           flex: 1,
  //           renderCell: (params) => (
  //             <Stack
  //               spacing={1}
  //               direction="row"
  //               sx={{ alignItems: "center", marginTop: "1%" }}
  //             ></Stack>
  //           ),
  //         },
  //         { field: "serialNo", headerName: t("text.SrNo"), flex: .5 },
  //         { field: "ResourceCode", headerName: t("text.ResourceCode"), flex: 1 },
  //         { field: "ResourceName", headerName: t("text.ResourceName"), flex: 1 },
  //         { field: "ResourceType", headerName: t("text.ResourceType"), flex: 1 },
  //         { field: "ZoneId", headerName: t("text.LocationName"), flex: 1 },
  //       ];
  //       setColumns(dynamicColumns);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const items = [
    {
      id: 0,
      text: t("text.ITEMISSUED"),
      icon: <ElectricBoltIcon sx={{ color: "blue" }} />,
      onClick: () => handleClick(0),
    },
    {
      id: 1,
      text: t("text.GEOLOCATION"),
      icon: <LocationOnIcon sx={{ color: "red" }} />,
      onClick: () => handleClick(1),
    },
  ];

  const handleClick = (id: any) => {
    setSelectedCardId(id);
    if (id === 0) {
      getItemIssueData();
      setIsShow(true);
      setIsShow2(false);
      setSearchTerm("");
      setSearchTerm1("");
    } else if (id === 1) {
      getGeoLocationData();
      setIsShow(false);
      setIsShow2(true);
      setSearchTerm("");
      setSearchTerm1("");
    }
  };

  const filteredRows = React.useMemo(() => {
    return ItemIssueOption.filter((row: any) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [ItemIssueOption, columns, searchTerm]);

  const filteredRows1 = React.useMemo(() => {
    return GeoLocationOption.filter((row: any) =>
      columns.some((column) =>
        String(row[column.field] || "")
          .toLowerCase()
          .includes(searchTerm1.toLowerCase())
      )
    );
  }, [GeoLocationOption, columns, searchTerm1]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const content = `
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h2 { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #0d3b5c; color: white; }
              tr:nth-child(even) { background-color: #f8f8f8; }
            </style>
          </head>
          <body>
            <h2>Item Issued</h2>
            <table>
              <thead>
                <tr>
                  <th>SNo</th>
                  <th>Code</th>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>EmpName</th>
                  <th>IssueDate</th>
                </tr>
              </thead>
              <tbody>
                ${(getTop ? filteredRows.slice(0, 10) : filteredRows)
        .map(
          (row: any) => `
                    <tr>
                      <td>${row.serialNo}</td>
                      <td>${row.rescode || ""}</td>
                      <td>${row.resname || ""}</td>
                      <td>${row.ResType || ""}</td>
                      <td>${row.empname || ""}</td>
                      <td>${row.issuedate}</td>
                    </tr>
                  `
        )
        .join("")}
              </tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `;

    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
    } else {
      console.error("Failed to open print window.");
    }
  };



  const handlePrint1 = () => {
    // console.log("#######", JSON.stringify(filteredRows1))
    const printWindow = window.open("", "_blank");
    const content = `
      <html>
        <head>
          <title>Geo Location Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #0d3b5c; color: white; }
            tr:nth-child(even) { background-color: #f8f8f8; }
          </style>
        </head>
        <body>
          <h2>Geo Location</h2>
          <table>
            <thead>
              <tr>
                <th>SNo</th>
                <th>Resource Code</th>
                <th>Resource Name</th>
                <th>Resource Type</th>
                <th>Location Name</th>
              </tr>
            </thead>
            <tbody>
              ${(getTop ? filteredRows1.slice(0, 10) : filteredRows1)
        .map(
          (row: any) => `
                  <tr>
                    <td>${row.serialNo}</td>
                    <td>${row.ResourceCode || ""}</td>
                    <td>${row.ResourceName || ""}</td>
                    <td>${row.ResourceType || ""}</td>
                    <td>${row.assetLocation || ""}</td>
                  </tr>
                `
        )
        .join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
    } else {
      console.error("Failed to open print window.");
    }

  };

  const handleClose2 = () => {
    setVisible(false);
  };

  return (
    <Box sx={{ marginTop: "1%", padding: "1%" }}>
      <Grid container spacing={2} sx={{ padding: "1%" }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={item.id}>
            <Card
              onClick={item.onClick}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2%",
                backgroundColor: "#fff",
                border: `2px solid ${selectedCardId === item.id ? "#3498db" : "#e0e0e0"}`,
                borderRadius: "8px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                borderLeft: `4px solid ${["blue", "red", "green", "orange", "purple", "teal"][item.id % 6]}`,
                transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                  borderColor: "#3498db",
                },
              }}
            >
              <Box sx={{ fontSize: "2rem", transition: "color 0.3s", "&:hover": { color: "#3498db" } }}>
                {item.icon}
              </Box>
              <CardContent sx={{ padding: "4px", textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", fontSize: "0.85rem", color: "black", transition: "color 0.3s", "&:hover": { color: "#3498db" } }}
                >
                  {item.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          // <Grid item xs={12} sm={6} md={6} lg={6} key={item.id}>
          //   <Card
          //     onClick={item.onClick}
          //     sx={{
          //       height: "100%",
          //       display: "flex",
          //       flexDirection: "column",
          //       justifyContent: "center",
          //       alignItems: "center",
          //       padding: "2%",
          //       backgroundColor: "#fff",
          //       border: `2px solid ${selectedCardId === item.id ? "#3498db" : "#e0e0e0"}`,
          //       borderRadius: "12px",
          //       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
          //       borderLeft: `5px solid ${["#007bff", "#dc3545", "#28a745", "#fd7e14", "#6f42c1", "#20c997"][item.id % 6]}`,
          //       transition: "all 0.3s ease-in-out",
          //       cursor: "pointer",
          //       "&:hover": {
          //         transform: "scale(1.06) rotate(1deg)",
          //         boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
          //         borderColor: "#3498db",
          //       },
          //     }}
          //   >
          //     {/* Icon Section */}
          //     <Box
          //       sx={{
          //         fontSize: "2rem",
          //         transition: "color 0.3s ease-in-out",
          //         color: "#555",
          //         "&:hover": { color: "#3498db" },
          //       }}
          //     >
          //       {item.icon}
          //     </Box>

          //     {/* Text Content */}
          //     <CardContent sx={{ padding: "6px", textAlign: "center" }}>
          //       <Typography
          //         variant="body2"
          //         sx={{
          //           fontWeight: "bold",
          //           fontSize: "0.9rem",
          //           color: "#333",
          //           transition: "color 0.3s ease-in-out",
          //           "&:hover": { color: "#3498db" },
          //         }}
          //       >
          //         {item.text}
          //       </Typography>
          //     </CardContent>
          //   </Card>
          // </Grid>

        ))}
      </Grid>

      {value === 0 && (
        <Box sx={{ marginTop: "2%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <motion.div initial="hidden" whileHover={{ scale: 1.01 }}>
                <Accordion expanded={true}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon sx={{ color: "white" }} />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{
                      backgroundColor: `var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`,
                      "&:hover": {
                        backgroundColor: `var(--grid-headerBackground)`,
                        opacity: 0.9,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        flex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {isShow ? t("text.ITEMISSUED") : t("text.GEOLOCATION")}
                      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {/* <TextField
                          placeholder={t("text.Search")}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: `var(--grid-headerBackground)` }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            backgroundColor: "#f1f1f1",
                            borderRadius: "20px",
                            width: "150px",
                            "& .MuiOutlinedInput-root": {
                              fontSize: "0.8rem",
                              padding: "4px 8px",
                              "& fieldset": {
                                borderColor: `var(--grid-headerBackground)`,
                              },
                              "&:hover fieldset": {
                                borderColor: `var(--grid-headerBackground)`,
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: `var(--grid-headerBackground)`,
                              },
                            },
                          }}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        /> */}
                        <IconButton
                          onClick={isShow ? handlePrint : handlePrint1}
                          sx={{ color: "white", "&:hover": { color: "#3498db" } }}
                        >
                          <PrintIcon fontSize="large" />
                        </IconButton>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={getTop}
                              onChange={(e) => setGetTop(e.target.checked)}
                              sx={{
                                color: "white",
                                "&.Mui-checked": { color: "white" },
                                "&:hover": { color: "#3498db" },
                              }}
                            />
                          }
                          label={
                            <Typography component="span" sx={{ color: "white", "&:hover": { color: "#3498db" } }}>
                              {t("text.top10")}
                            </Typography>
                          }
                        />
                      </Box>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: "white",
                      height: "50vh",
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                      },
                    }}
                  >
                    {isShow && (
                      <DataGrid
                        rows={getTop ? filteredRows.slice(0, 10) : filteredRows}
                        columns={[
                          { field: "serialNo", headerName: t("text.SrNo"), flex: .5 },
                          { field: "rescode", headerName: t("text.Code"), flex: 1 },
                          { field: "resname", headerName: t("text.Asset"), flex: 1 },
                          { field: "ResType", headerName: t("text.Type"), flex: 1 },
                          { field: "empname", headerName: t("text.EmpName"), flex: 1 },
                          { field: "issuedate", headerName: t("text.IssueDate"), flex: 1 },
                        ]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{ toolbar: { showQuickFilter: true } }}
                        sx={{
                          border: 0,
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: `var(--grid-headerBackground)`,
                            color: `var(--grid-headerColor)`,
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          },
                          "& .MuiDataGrid-columnHeaderTitle": { color: "white" },
                          "& .MuiDataGrid-cell": {
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          },
                          height: 400,
                          overflowY: "auto",
                        }}
                      />
                    )}
                    {isShow2 && (
                      <DataGrid
                        rows={getTop ? filteredRows1.slice(0, 10) : filteredRows1}
                        columns={[
                          { field: "serialNo", headerName: t("text.SrNo"), flex: .5 },
                          { field: "ResourceCode", headerName: t("text.ResourceCode"), flex: 1 },
                          { field: "ResourceName", headerName: t("text.ResourceName"), flex: 1 },
                          { field: "ResourceType", headerName: t("text.ResourceType"), flex: 1 },
                          { field: "assetLocation", headerName: t("text.LocationName"), flex: 1 },
                        ]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{ toolbar: { showQuickFilter: true } }}
                        sx={{
                          border: 0,
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: `var(--grid-headerBackground)`,
                            color: `var(--grid-headerColor)`,
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          },
                          "& .MuiDataGrid-columnHeaderTitle": { color: "white" },
                          "& .MuiDataGrid-cell": {
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          },
                          height: 400,
                          overflowY: "auto",
                        }}
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>

            {/* Alert Section */}
            {/* <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, bgcolor: "white", borderRadius: "8px" }}>
                <Typography variant="h6" color="error" gutterBottom>
                  {t("text.alert")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {t("text.Itemoutofstock")} {outOfStock}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={outOfStock}
                      sx={{ height: 8, borderRadius: 4, bgcolor: "#ddd", mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {t("text.Itemstobeexpired")} {toExpire}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={toExpire}
                      sx={{ height: 8, borderRadius: 4, bgcolor: "#ddd", mt: 1 }}
                      color="success"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid> */}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
