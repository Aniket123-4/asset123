import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate, getId } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Jurisdiction() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();
  const userId = getId();
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(0);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  // const [lang, setLang] = useState<Language>("en");
  const [NodeOption, setNodeOption] = useState([
    { value: "-1", label: t("text.SelectNode") },
  ]);

  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const getNode = () => {
    api.get(`Auth/GetAllNodes`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.nodeName,
        value: item.nodeId,
      }));
      setNodeOption(arr);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    getNode();
  }, []);

  let delete_id = "";

  let locat = "";
  let display = "";
  let parent = "";
  let node = "";
  const accept = () => {
    const collectData = {
      nodeId: delete_id,

      nodeName: node,
      parentId: parent,
      displayNo: display,
      location: locat,
    };
    // console.log("collectData " + JSON.stringify(collectData));
    api.post(`Auth/DeleteNode`, collectData).then((response) => {
      if (response.data.status === 1) {
        toast.success(response.data.message);
        getList();
      } else {
        toast.error(response.data.message);
      }
    });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del: any) => {
    // console.log(del_id + " del_id ");
    delete_id = del.id;
    locat = del.location;
    parent = del.parentId;
    display = del.displayNo;
    node = del.nodeName;

    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const getList = () => {
    try {
      api.get(`Auth/GetAllNodes`).then((res) => {
        // console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.nodeId,
        }));
        setRows(arr);
        setIsLoading(false);
        if (data.length > 0) {
          const columns: GridColDef[] = [
            {
              field: "actions",
              headerClassName: "MuiDataGrid-colCell",
              headerName: t("text.Action"),
              width: 150,

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
                    {/* ) : (
                      ""
                    )} */}
                    {/* {permissionData?.isDel ? ( */}
                    <DeleteIcon
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handledeleteClick(params.row);
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
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "nodeName",
              headerName: "Node ",
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "location",
              headerName: "Location",
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
          ];
          setColumns(columns as any);
        }
      });
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    parentId: Yup.string().test(
      "required",
      "Parent Required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
     
      nodeId: 0,
      nodeName: "",
      parentId: 0,
      displayNo: 0,
      location: "",
      
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.nodeId = editId;
      // console.log("check", values);

      const response = await api.post(`Auth/UpsertNode`, values);
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        formik.resetForm();
        getList();
        setEditId(0);
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });

  const requiredFields = ["nodeId"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("nodeId", row.nodeId);
    formik.setFieldValue("nodeName", row.nodeName);
    formik.setFieldValue("location", row.location);

    formik.setFieldValue("parentId", row.parentId);

    setEditId(row.id);
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: "#00009C",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
              },
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={10} md={10} xs={12}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.JurisdictionMaster")}
                </Typography>
              </Grid>

              <Grid item lg={2} md={2} xs={12} marginTop={2}>
                <select
                  className="language-dropdown"
                  // value={lang}
                  // onChange={(e) => setLang(e.target.value as Language)}
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
              <Grid item xs={12} container spacing={3}>
                <Grid xs={5} sm={5} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={NodeOption}
                    value={
                      NodeOption.find(
                        (option: any) => option.value === formik.values.nodeId
                      ) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue?.value);

                      formik.setFieldValue("nodeId", newValue?.value);
                      formik.setFieldValue("nodeName", newValue?.label);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.SelectNode")}
                            required={requiredFields.includes("nodeId")}
                          />
                        }
                      />
                    )}
                  />

                  {formik.touched.nodeId && formik.errors.nodeId ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.nodeId}
                    </div>
                  ) : null}
                </Grid>

                <Grid xs={12} lg={4} item>
                  <TextField
                    label={<CustomLabel text={t("text.Location")} />}
                    value={formik.values.location}
                    name="location"
                    id="location"
                    placeholder={t("text.Location")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>

                <Grid item xs={2} sx={{ m: -1 }}>
                  {editId === 0 &&  (
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
              <CustomDataGrid
                isLoading={isLoading}
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialPageSize={5}
              />
            )}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
