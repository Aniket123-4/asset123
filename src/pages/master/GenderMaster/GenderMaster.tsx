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
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { usePermissionData } from "../../../usePermissionData";
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

export default function GenderMaster() {
  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();

  const [columns, setColumns] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [editId, setEditId] = useState<any>(-1);
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
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );
    //         console.log("data", pathrow);
    //         if (pathrow) {

    //           setPermissionData(pathrow);
    //           // getList();
    //         }
    //       }
    //     }
    //   }
    // }
    getList();
  }, [isLoading]);

  let delete_id = "";
  const accept = () => {
    const collectData = {
      genderID: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Gender/DeleteGender`, { data: collectData })
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
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    // console.log(del_id + " del_id ");
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

  const getList = () => {
    const collectData = {
      "genderID": -1
    };
    try {
      api
        .post(`Gender/GetGenderMaster`, collectData)
        .then((res) => {
          console.log("result" + JSON.stringify(res.data.data));
          const data = res.data.data;
          const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.genderID,
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
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "genderName",
                headerName: t("text.GenderName"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "genderCode",
                headerName: t("text.GenderCode"),
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
    genderName: Yup.string().test(
      "required",
      t("text.reqGenderName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {

      genderID: -1,
      genderName: "",
      genderCode: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.genderID = editId;

      const response = await api.post(
        `Gender/AddUpdateGenderMaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        getList();
        setEditId("-1");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }

    },
  });

  const requiredFields = ["genderName"];


  const routeChangeEdit = (row: any) => {
    formik.setFieldValue("genderName", row.genderName);
    formik.setFieldValue("genderCode", row.genderCode);
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
              // "& .MuiDataGrid-colCell": {
              //   backgroundColor: "#2B4593",
              //   color: "#fff",
              //   fontSize: 18,
              //   fontWeight: 800,
              // },
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
            {t("text.GenderMaster")}
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
                <TranslateTextField
                  label={t("text.EnterGenderName")}
                  value={formik.values.genderName}
                  onChangeText={(text: string) => handleConversionChange('genderName', text)}
                  required={true}
                  lang={lang}
                />
                  {formik.touched.genderName && formik.errors.genderName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {formik.errors.genderName}
                    </div>
                  ) : null}
                </Grid>


                <Grid item xs={5}>
                  <TextField
                    label={<CustomLabel text={t("text.EnterGenderCode")} />}
                    value={formik.values.genderCode}
                    name="genderCode"
                    id="genderCode"
                    placeholder={t("text.EnterGenderCode")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid> 
                <Grid item xs={2}  sx={{m:-1}}>
                  {editId === -1 &&  (
                  //{editId === -1 && permissionData?.isAdd && (
                    <ButtonWithLoader
                      buttonText={t("text.save")}
                      onClickHandler={handleSubmitWrapper}
                      fullWidth={true}
                    />
                  )}

                  {editId !== -1 && (
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
