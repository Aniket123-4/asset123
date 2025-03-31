import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
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
import { GridColDef } from "@mui/x-data-grid";
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

export default function DepartmentMaster() {
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
    
    getList();
  }, []);
  // }, [isLoading]);

  let delete_id = "";

  const accept = () => {
    api.post("department", { type: 5, dept_id: delete_id })
      .then((response) => {
        if (response.data.success) {
          // Access message directly
          toast.success(response.data.message); // "Department deleted successfully."
          getList(); // Refresh list
        } else {
          toast.error("Failed to delete department");
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Error deleting department");
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
  const getList = () => {
    setIsLoading(true);
  
    const collectData = {
      type: 4, // Fetch all data
      dept_id: -1,
      dept_name: "",
      dept_shortname: "",
      session_year: "",
      user_id: "admin",
      inst_ID: 1,
      stream: 1,
      session: "2024-25",
      allowedto: ""
    };
  
    try {
      api
        .post(`department`, collectData)
        .then((res) => {
          console.log("result" + JSON.stringify(res.data.data));
          const data = res.data.data;
          const arr = data.map((item: any, index: number) => ({
            ...item,
            serialNo: index + 1,
            id: item.dept_id,
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
                    </Stack>,
                  ];
                },
              },
              {
                field: "serialNo",
                headerName: t("text.SrNo"),
                flex: 1,
             // headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "dept_name",
                headerName: t("text.deptName"),
                flex: 1,
           //   headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "dept_shortname",
                headerName: t("text.deptshortname"),
                flex: 1,
              //headerClassName: "MuiDataGrid-colCell",
              },
            
            ];
            setColumns(columns as any);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching department data");
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  
  
  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const validationSchema = Yup.object({
    dept_name: Yup.string().test(
      "required",
      t("text.reqdeptName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });
  const [toaster, setToaster] = useState(false);


  const formik = useFormik({
    initialValues: {
      type: 1,
      dept_id: -1,
      dept_name: "",
      dept_shortname: "",
      session_year: "2024-25",
      user_id: "as",
      inst_ID: 1,
      stream: 1,
      session: "2024-25",
      allowedto: "1"
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const finalValues = {
        type: editId === -1 ? 1 : 2, // 1 for Add, 2 for Update
        dept_id: editId !== -1 ? editId : -1, // Set ID for update, -1 for add
        dept_name: values.dept_name,
        dept_shortname: values.dept_shortname,
        session_year: "2024-2025", // Or dynamic value if needed
        user_id: "as", // Dynamic if you have login
        inst_ID: 1,
        stream: 1,
        session: "2024-2025",
        allowedto: "1"
      };
    
      console.log("Final values for API:", finalValues); // For debug
    
      // API call
      api
        .post("department", finalValues)
        .then((response) => {
          console.log(response.data); // Check API response
          if (response.data.success) {
            if (response.data.message) {
              toast.success(response.data.message); // Show success message
            } else {
              toast.success("Department details saved successfully");
            }
            formik.resetForm();
            getList(); // Refresh list
            setEditId(-1); // Reset form to Add mode
          } else {
            toast.error("Error saving department details");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error: " + error.message);
        });
    },
    
    
  });
  
 

  const requiredFields = ["dept_name"];




  const routeChangeEdit = (row: any) => {
    const requestData = {
      type: 3,
      dept_id: row.id,
      dept_name: "",
      dept_shortname: "",
      session_year: "",
      user_id: "",
      inst_ID: 0,
      stream: 0,
      session: "",
      allowedto: ""
    };
  
    api
      .post("department", requestData)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const dept = res.data.data[0];
  
          formik.setValues({
            type: 2, // For update
            dept_id: dept.dept_id,
            dept_name: dept.dept_name,
            dept_shortname: dept.dept_shortname,
            session_year: dept.session_year,
            user_id: dept.user_id,
            inst_ID: dept.inst_ID,
            stream: dept.stream,
            session: dept.session,
            allowedto: dept.allowedto,
          });
  
          setEditId(dept.dept_id); // Set edit mode
        } else {
          toast.error("Department not found");
        }
      })
      .catch(() => toast.error("Error fetching department details"));
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
            backgroundColor: "lightgreen",
            border: ".5px solid #2B4593 ",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden"
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />

            <Grid item xs={12} container spacing={2}>
            <Grid item lg={8} md={8} xs={12}>
            <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.deptMaster")}
          </Typography>
            </Grid>

            <Grid item lg={4} md={4} xs={12} marginTop={2}>
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
                  label={t("text.enterdeptName")}
                  value={formik.values.dept_name}
                  onChangeText={(text: string) => handleConversionChange('dept_name', text)}
                  required={true}
                  lang={lang}
                />
                  {formik.touched.dept_name && formik.errors.dept_name ? (
                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.dept_name}</div>
                  ) : null}
                </Grid>


                <Grid item xs={5}>
                  <TextField
                    id="dept_shortname"
                    name="dept_shortname"
                    label={<CustomLabel text={t("text.enterdeptSHORTNAME")} />}
                    value={formik.values.dept_shortname}
                    placeholder={t("text.enterdeptSHORTNAME")}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={2}  sx={{m:-1}}>
                  {editId === -1 && (
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
