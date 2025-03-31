import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import DataGrids from "../../../utils/Datagrids";
import dayjs from "dayjs";
import { getISTDate } from "../../../utils/Constant";
import moment from "moment";


interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function LicensingInsuranceMaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const { defaultValues } = getISTDate();

  let navigate = useNavigate();
  const { t } = useTranslation();

  const [vehicleOption, setVehicleOption] = useState([
    { value: -1, label: t("text.VehicleNo") },
  ]);
  const [vendorOption, setVendorOption] = useState([
    { value: -1, label: t("text.VendorName") },
  ]);

  useEffect(() => {
  
    fetchLicencingData();
  }, [isLoading]);




  // const getVendorData = async () => {
  //   const collectData = {
  //     "venderId": -1,
  //     "countryId": -1,
  //     "stateId": -1,
  //     "cityId": -1
  //   };
  //   const response = await api.post(`Master/GetVendorMaster`, collectData);
  //   const data = response.data.data;
  //   //console.log("Vendor data==>  ",data);
  //   const arr = [];
  //   for (let index = 0; index < data.length; index++) {
  //     arr.push({
  //       label: data[index]["name"],
  //       value: data[index]["venderId"],
  //     });
  //   }
  //   setVendorOption(arr);
  // };




  // const routeChangeEdit = (row: any) => {
  //   console.log("row " + row);

  //  let path = `/AssetDescription/EditLicensingInsuranceMaster`;
  //   navigate(path, {
  //     state: row,
  //   });
  // };

  const routeChangeEdit = (row: any) => {
    console.log("row ", row);
    let path = `/AssetDescription/EditLicensingInsuranceMaster`;
  
    // Correctly map MW_ID to id_MW
    navigate(path, {
      state: { ...row, id_Lic: row.LI_ID }
    });
  };

  const routeChangeAdd = () => {
    let path = `/AssetDescription/AddLicensingInsuranceMaster`;
    navigate(path);
  };

  let delete_id = "";
  const accept = () => {
    api
      .post(`Master/DeleteLicensing?id=${delete_id}`)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchLicencingData();
      });
  };

  const reject = () => {
    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    console.log(del_id + " del_id ");
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };


  function formatDate(dateString: string) {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }



  const fetchLicencingData = async () => {
    try {
      const collectData = {
        "Type": 4,
        FileContent:"any"
      };
      const response = await api.post(
        `Licensing_insuring`,
        collectData
      );
      const data = response.data.data;
      const IndentWithIds = data.map((Item: any, index: any) => ({
        ...Item,
        serialNo: index + 1,
        id: Item.LI_ID,
        Fdate: formatDate(Item.Fdate),
        Tdate: formatDate(Item.Tdate),
        PremiumDate: formatDate(Item.PremiumDate),
        //effectiveDate: formatDate(Item.effectiveDate),
        //vehicleNo: vehicleOption[vehicleOption.findIndex(e => e.value == Item.itemId)].label
      }));
      setItem(IndentWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 90,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {/* {permissionData?.isEdit ? ( */}
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row.id);
                    }}
                  />
                  <VisibilityIcon
                    style={{
                      fontSize: "20px",
                      color: "grey",
                      cursor: "pointer",
                    }}
                    onClick={() => routeChangeEdit({ ...params.row, isView: true })}
                  />
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: .3,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "VenderName",
            headerName: t("text.VendorName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",

          },

          {
            field: "Fdate",
            headerName: t("text.fromDate"),
            flex: .8,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "Tdate",
            headerName: t("text.toDate"),
            flex: .8,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "Licensing_Insurance",
            headerName: t("text.Type"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",

          },
         
          // {
          //   field: "narration",
          //   headerName: t("text.Narration"),
          //   flex: .9,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
          // {
          //   field: "effectiveDate",
          //   headerName: t("text.Date"),
          //   flex: .8,
          //   headerClassName: "MuiDataGrid-colCell",
          // },
          {
            field: "PremiumAmount",
            headerName: t("text.LicensingPremiumAmount"),
            flex: .6,
            headerClassName: "MuiDataGrid-colCell",
          },
          // {
          //   field: "attachment",
          //   headerName: t("text.Attachment"),
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },

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


  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh"
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
              fontWeight: 900
            },
          }}
          style={{ padding: "10px", }}
        >
          <ConfirmDialog />
          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.LicensingInsurance")}
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

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true && ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button>
            {/* ) } */}

          </Stack>

          <DataGrids
            isLoading={isLoading}
            rows={item}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card>
      <ToastApp />

    </>
  );
}