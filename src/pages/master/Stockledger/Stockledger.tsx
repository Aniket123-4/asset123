import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
// import CustomDataGrids from "../../../utils/CustomDataGrids";
import CustomDataGrid from "../../../utils/CustomDatagrid";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Stockledger() {
  const Userid = getId();
  let navigate = useNavigate();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { t } = useTranslation();

  useEffect(() => {
    fetchZonesData();
  }, []);

  const routeChangeEdit = (row: any) => {
    console.log(row);
    let path = `/master/EditStockledger`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/master/CreateStockledger`;
    navigate(path);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
        EntryNo: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`StockLedger/DeleteStockLedger`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchZonesData();
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
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

  const fetchZonesData = async () => {
    try {
        const response = await api.post(`StockLedger/GetStockLedger`, {}, { headers: { EntryNo: -1 } });
        const data = response.data.data;
        console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
        const zonesWithIds = data.map((zone: any, index: any) => ({
            ...zone,
            serialNo: index + 1,
            id: zone.entryNo,
        }));
        setZones(zonesWithIds);
        setIsLoading(false);

        if (data.length > 0) {
            const columns: GridColDef[] = [
                {
                    field: "actions",
                    // headerClassName: "MuiDataGrid-colCell",
                    headerName: t("text.Action"),
                    width: 120,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {/* {permissionData?.isEdit ? ( */}
                  {/* <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  /> */}
                  {/* ) : (
                    ""
                  )}
                  {permissionData?.isDel ? ( */}
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
                  {/* ) : (
                    ""
                  )} */}
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
          },
          {
            field: "entryNo",
            headerName: t("entryNo"),
            flex: 1,

        },
        {
            field: "batchNo",
            headerName: t("text.batchNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "itemId",
            headerName: t("text.itemId"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
        },
        // {
        //     field: "unitID",
        //     headerName: t("text.unitID"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        {
            field: "rate",
            headerName: t("text.rate"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
        },
        {
            field: "inQty",
            headerName: t("text.inQty"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
        },
        // {
        //     field: "outQty",
        //     headerName: t("text.outQty"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "voucherId",
        //     headerName: t("text.voucherId"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "stockBinId",
        //     headerName: t("text.stockBinId"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",

        // },
        // {
        //     field: "voucherType",
        //     headerName: t("text.voucherType"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "voucherDate",
        //     headerName: t("text.voucherDate"),
        //     flex: 1,
        //     renderCell(params:any) {
        //         // {console.log(params)}
        //         return dayjs(params.row.voucherDate).format("DD-MM-YYYY");
        //     },
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "expiryDate",
        //     headerName: t("text.expiryDate"),
        //     flex: 1,
        //     renderCell(params:any) {
        //         // {console.log(params)}
        //         return dayjs(params.row.expiryDate).format("DD-MM-YYYY");
        //     },

        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "companyId",
        //     headerName: t("text.companyId"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        // {
        //     field: "gstRate",
        //     headerName: t("text.gstRate"),
        //     flex: 1,
        //     // headerClassName: "MuiDataGrid-colCell",
        // },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
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

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.StockLedger")}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
              {/* {permissionData?.isAdd == true ? ( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
                style={{backgroundColor:`var(--header-background)`}}
              >
                {t("text.add")}
              </Button>
              {/* ) : (
                ""
              )} */}

              {/* {permissionData?.isPrint == true ? (
                <Button
                  variant="contained"
                  endIcon={<PrintIcon />}
                  size="large"
                >
                  {t("text.print")}
                </Button>
              ) : (
                ""
              )} */}
            </Stack>

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
            <CustomDataGrid
              isLoading={isLoading}
              rows={zones}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          )}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
