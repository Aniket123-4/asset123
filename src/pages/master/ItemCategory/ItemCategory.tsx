import React, { useEffect, useState } from "react";
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
  Autocomplete,
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
import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";
import { getISTDate } from "../../../utils/Constant";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ItemCategory() {
  const { t } = useTranslation();
  const Userid = getId();
  const [editId, setEditId] = useState(0);
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
  const [itemCategoryOptions, setitemCategoryOptions] = useState([
    { value: "-1", label: t("text.itemCategory") },
  ]);

  const [taxOptions, setTaxOptions] = useState([
    { value: "-1", label: t("text.SelectTax") },
  ]);
  const { defaultValuestime } = getISTDate();

  useEffect(() => {
    GetitemCategoryData();
    fetchZonesData();
    GetTaxData();
  }, []);

  const GetitemCategoryData = async () => {
    const collectData = {
      itemCategoryId: -1,
    };
    const response = await api.post(
      `ItemCategory/GetItemCategory`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["itemCategory"],
        value: data[index]["itemCategoryId"],
      });
    }
    setitemCategoryOptions(arr);
  };


  const GetTaxData = async () => {
    const collectData = {
      taxId: -1,
    };
    const response = await api.post(
      `UnitMaster/GetTaxMaster`,
      collectData
    );
    const data = response?.data?.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxName"],
        value: data[index]["taxId"],

        taxPercentage: data[index]["taxPercentage"],
      });
    }
    setTaxOptions(arr);
  };


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const routeChangeEdit = (row: any) => {
    console.log("check edit", row);
    formik.setFieldValue("itemCategoryId", row.itemCategoryId);
    formik.setFieldValue("itemCategory", row.itemCategory);
    formik.setFieldValue("itemCategoryAbbre", row.itemCategoryAbbre);
    formik.setFieldValue("parentId", row.parentId);
    formik.setFieldValue("taxId", row.taxId);
    formik.setFieldValue("createdBy", row.createdBy);
    formik.setFieldValue("updatedBy", row.updatedBy);
    formik.setFieldValue(
      "createdOn",
      dayjs(row.createdOn).format("YYYY-MM-DD")
    );
    formik.setFieldValue(
      "updatedOn",
      dayjs(row.updatedOn).format("YYYY-MM-DD")
    );

    setEditId(row.itemCategoryId);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      itemCategoryId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`ItemCategory/DeleteItemCategory`, collectData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
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
      const collectData = {
        itemCategoryId: -1,
      };
      const response = await api.post(
        `ItemCategory/GetItemCategory`,
        collectData
      );
      const data = response.data.data;
      console.log(
        "🚀 ~ fetchZonesData ~ response.data.data:",
        response.data.data
      );
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.itemCategoryId,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            width: 120,
            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => handledeleteClick(params.row.itemCategoryId)}
                  />
                </Stack>,
              ];
            },
          },
          {
            field: "parentId",
            headerName: t("text.parentId"),
            flex: 1,
            renderCell: (params) => {
              // Find the parent category name based on the ID
              const parentCategory = itemCategoryOptions.find(
                (option) => option.value === params.row.parentId
              );
              return parentCategory ? parentCategory.label : "--";
            },
          },
          {
            field: "itemCategory",
            headerName: t("text.itemCategory"),
            flex: 1,
          },
          {
            field: "itemCategoryAbbre",
            headerName: t("text.itemCategoryAbbre"),
            flex: 1,
          },
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

  const formik = useFormik({
    initialValues: {
      itemCategoryId: 0,
      itemCategory: "",
      itemCategoryAbbre: "",
      parentId: 0,
      taxId: -1,
      createdBy: "admin",
      updatedBy: "admin",
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      taxname: "",
      taxPercentage: 0,
    },

    validationSchema: Yup.object({
      itemCategory: Yup.string().required(t("text.reqItemCategory")),
    }),

    onSubmit: async (values) => {
      const response = await api.post(
        "ItemCategory/UpsertItemCategory",
        values
      );
      if (response.data.status === 1) {
        formik.resetForm();
        fetchZonesData();
        toast.success(response.data.message);
        setEditId(0);
      } else {
        toast.error(response.data.message);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

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
                {t("text.ItemCategory")}
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
          <form onSubmit={formik.handleSubmit}>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={itemCategoryOptions}
                  value={
                    itemCategoryOptions.find(
                      (option: any) => option.value === formik.values.parentId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("parentId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterparentId")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOptions}
                  value={
                    taxOptions.find(
                      (option: any) => option.value === formik.values.taxId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("taxId", newValue?.value);

                    formik.setFieldValue("taxName", newValue?.label);
                    formik.setFieldValue("taxPercentage", newValue?.taxPercentage);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectTax")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TranslateTextField
                  label={t("text.EnteritemCategory")}
                  value={formik.values.itemCategory}
                  onChangeText={(text) =>
                    handleConversionChange("itemCategory", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.itemCategory && formik.errors.itemCategory ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.itemCategory}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnteritemCategoryAbbre")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="itemCategoryAbbre"
                  id="itemCategoryAbbre"
                  value={formik.values.itemCategoryAbbre}
                  placeholder={t("text.EnteritemCategoryAbbre")}
                  onChange={formik.handleChange}
                />
              </Grid>

             

              <Grid
                container
                item
                xs={4}
                justifyContent="center"
                alignItems="center"
              >
                {editId === 0 && (
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}

                {editId !== 0 && (
                  <ButtonWithLoader
                    buttonText={t("text.update")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}
              </Grid>
            </Grid>
          </form>

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
            <DataGrids
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
