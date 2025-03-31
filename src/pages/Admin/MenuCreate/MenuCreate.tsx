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
import EditIcon from "@mui/icons-material/Edit";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function MenuMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [parentName, setParentName] = useState("");
  const [parentOption, setParentOption] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState(0);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    getList();
    getParentMenuMaster();
  }, [isLoading]);



  const getParentMenuMaster = () => {
    api.post(`Menu/GetMenuMaster`,{
      "menuId": -1
    }).then((res) => {
      console.log("result" + JSON.stringify(res.data.data));
      const data = res.data.data;
      const arr = data.map((item: any, index: any) => ({
        ...item,
        serialNo: index + 1,
        id: item.menuId,
        value: item.menuId,
        label: item.menuName
      }));
      setParentOption(arr);
    })
  }

  let delete_id = "";
  const accept = () => {
    const collectData = {
      menuId: delete_id
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Menu/DeleteMenuMaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        getList();
      });
  };

  const reject = () => {
    // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (row: any) => {
    delete_id = row.menuId;
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
      const collectData = {
        "menuId": -1
      }
      api.post(`Menu/GetMenuMaster`, collectData).then((res) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id: item.menuId,
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
                console.log("Is Edit Allowed:", permissionData?.isEdit);
                return [
                  <Stack
                    spacing={1}
                    direction="row"
                    sx={{ alignItems: "center", marginTop: "5px" }}
                  >
                    {/* {permissionData?.isEdit ? (  */}
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
                     )}  */}
                    {/* {permissionData?.isDel ? (  */}
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
                      )}  */}
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
              field: "menuName",
              headerName: t("text.MenuName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "pageUrl",
              headerName: t("text.PageURL"),
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
    menuName: Yup.string().required(
      t("text.reqMenuName"),
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      "sno": 0,
      "menuId": 0,
      "menuName": "",
      "parentId": 0,
      "pageUrl": "",
      "icon": "",
      "displayNo": 0,
      "isMenu": true,
      "isAdd": true,
      "isEdit": true,
      "isDel": true,
      "isView": true,
      "isPrint": true,
      "isExport": true,
      "isRelease": true,
      "isPost": true,
      "helpedit": "",
      "childId": 0,
      "parentName": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.menuId = editId;

      const response = await api.post(`Menu/AddUpdateMenuMaster`, values);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        formik.setFieldValue("parentName", "")
        getList();
        setEditId(0);
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["countryName"];

  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("menuId", row.menuId);
    formik.setFieldValue("menuName", row.menuName);
    formik.setFieldValue("parentId", row.parentId);
    formik.setFieldValue("pageUrl", row.pageUrl);
    formik.setFieldValue("displayNo", row.displayNo);
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
                  {t("text.MenuCreate")}
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
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    label={<CustomLabel text={t("text.EnterMenuName")} required={true} />}
                    value={formik.values.menuName}
                    placeholder={t("text.EnterMenuName")}
                    size="small"
                    fullWidth
                    name="menuName"
                    id="menuName"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.menuName && formik.errors.menuName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.menuName}
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label={<CustomLabel text={t("text.EnterPageURL")} />}
                    value={formik.values.pageUrl}
                    placeholder={t("text.EnterPageURL")}
                    size="small"
                    fullWidth
                    name="pageUrl"
                    id="pageUrl"
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      formik.setFieldValue("pageUrl", e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label={<CustomLabel text={t("text.DisplayNo")} />}
                    value={formik.values.displayNo}
                    placeholder={t("text.displayNo")}
                    size="small"
                    fullWidth
                    name="displayNo"
                    id="displayNo"
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      formik.setFieldValue("displayNo", parseFloat(e.target.value) || 0);
                    }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={parentOption}
                    value={formik.values?.parentName || parentName}
                    fullWidth
                    size="small"
                    onChange={(event: any, newValue: any) => {
                      formik.setFieldValue("parentId", newValue?.value);
                      formik.setFieldValue("parentName", newValue?.label);
                      setParentName(newValue?.label);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.ParentMenu")} required={false} />}
                        name="parentId"
                        id="parentId"
                        placeholder={t("text.ParentMenu")}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2} sx={{ m: -1 }}>
                  {editId === 0 && (
                    // {editId === -1 && permissionData?.isAdd && (
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
            {/* </Grid> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            {/* </Stack> */}
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

const parentMenuOption = [
  {
    value: 1,
    label: "Master"
  },
  {
    value: 2,
    label: "Admin"
  },
  {
    value: 3,
    label: "Inventory"
  },
  {
    value: 4,
    label: "emailsystem"
  },
  {
    value: 5,
    label: "employeeInfo"
  },
  {
    value: 6,
    label: "vehiclecomplaint"
  },
  {
    value: 7,
    label: "vendorinfo"
  },
  {
    value: 8,
    label: "vehiclemaster"
  },
  {
    value: 9,
    label: "Reports"
  },
  {
    value: 10,
    label: "UserManagement"
  },
  {
    value: 11,
    label: "security"
  },
]
