import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from "../../../utils/Url";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import { getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  height: "90vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  overflowX: "auto",
};

function createData(
  srno: number,
  id: string,
  name: string
  // rolePermission: string
): any {
  return { srno, id, name };
}

function childMenuCreateData(

  RoleID: any,
  MenuID: any,
  MenuName: any,
  Permission: any,
  InsertOp: any,
  UpdateOp: any,
  DeleteOp: any,
  MasterOp: any,
  SlaveOp: any,
  Inst_ID: any,
  Type: any,

): any {
  return {

    RoleID,
    MenuID,
    MenuName,
    Permission,
    InsertOp,
    UpdateOp,
    DeleteOp,
    MasterOp,
    SlaveOp,
    Inst_ID,
    Type,

  };
}

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserPermissionMaster() {

  const [roleOption, setRoleOption] = useState([
    { value: -1, label: "Select Role Name" },
  ]);
  const [empOption, setempOption] = useState([
    { value: -1, label: ("text.empid"), deptId: -1, desgId: -1, deptName: "", desgName: "" },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);
  const [childMenuRecords, setChildMenuRecords] = useState(rows);
  const [enteredrolename, setEnteredrolename] = useState("");
  const [editID, setEditID] = useState("-1");
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const [roleID, setRoleID] = useState<any>(0);
  const [menuItem, setMenuItem] = useState<any>(0);

  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { defaultValues } = getISTDate();



  useEffect(() => {
    getMenu();
    getroleData();
  }, [])

  const getroleData = () => {
    api
      .post(`RoleMaster`, { "Type": 4 })
      .then((res) => {
        const arr = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["RoleName"],
            value: res.data.data[index]["roleID"],
          });
        }
        setRoleOption(arr);
      });
  };

  const getMenu = () => {
    api
      .post(`Menucreation`, { "Type": 4 })
      .then((res) => {
        const arr = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["Title"],
            value: res.data.data[index]["ID"],
          });
        }
        setMenuItem(arr);
      });
  }





  const formik = useFormik({
    initialValues: {
      "data": [
        {
          "RoleID": 0,
          "MenuID": 0,
          "Permission": 0,
          "InsertOp": 0,
          "UpdateOp": 0,
          "DeleteOp": 0,
          "MasterOp": 0,
          "SlaveOp": 0,
          "Inst_ID": 1,
          "Type": 2
        }
      ]
    },

    onSubmit: async (values: any) => {
      values.data = childMenuRecords.map((item: any) => {
          return {
              "RoleID": item.RoleID,
              "MenuID": item.MenuID,
              // Update Permission dynamically based on InsertOp, UpdateOp, DeleteOp, MasterOp, SlaveOp
              "Permission": (item.InsertOp || item.UpdateOp || item.DeleteOp || item.MasterOp || item.SlaveOp) ? 1 : 0,
              "InsertOp": item.InsertOp ? 1 : 0,
              "UpdateOp": item.UpdateOp ? 1 : 0,
              "DeleteOp": item.DeleteOp ? 1 : 0,
              "MasterOp": item.MasterOp ? 1 : 0,
              "SlaveOp": item.SlaveOp ? 1 : 0,
              "Inst_ID": item.Inst_ID,
              "Type": item.Type
          };
      });
  
      const response = await api.post(`MenuPermission`, values);
      if (response.data.status === 1) {
          toast.success(response.data.message);
          navigate("/Admin/UserPermission");
          formik.resetForm();
          getModalList();
          // getList();
      } else {
          toast.success(response.data.message);
      }
  },
  

    // onSubmit: async (values: any) => {
      
    //   values.data = childMenuRecords.map((item: any) => {
    //     return {
    //       "RoleID": item.RoleID,
    //       "MenuID": item.MenuID,
    //       "Permission": item.Permission ? 1:0,
    //       "InsertOp": item.InsertOp ? 1 : 0,
    //       "UpdateOp": item.UpdateOp ? 1 : 0,
    //       "DeleteOp": item.DeleteOp ? 1 : 0,
    //       "MasterOp": item.MasterOp ? 1 : 0,
    //       "SlaveOp": item.SlaveOp ? 1 : 0,
    //       "Inst_ID": item.Inst_ID,
    //       "Type": item.Type
    //     }
    //   });

    //   const response = await api.post(`MenuPermission`, values);
    //   if (response.data.status === 1) {
    //     toast.success(response.data.message);
    //     navigate("/Admin/UserPermission");
    //     formik.resetForm();
    //     getModalList();

    //     // getList();
    //   } else {
    //     toast.success(response.data.message);
    //   }
    // },

  });

  //  const requiredFields = ["roleName"];
  useEffect(() => {
    //getList();
  }, []);



  const getModalUpdateList = async (roleID: any = -1) => {
    await getMenu();
    const collectData = {
      "data": [
        {
          "RoleID": roleID,
          "Type": 3
        }
      ]
    }
    api.post(`MenuPermission`, collectData).then((res) => {

      if (res.data.results[0].data.length === 0) {
        getModalList(roleID);
        return;
      }

      const arr = [];

      for (let index = 0; index < res.data.results[0].data.length; index++) {
        arr.push(
          childMenuCreateData(
            roleID,
            res.data.results[0].data[index]["menuID"],
            res.data.results[0].data[index]["Title"] || menuItem[menuItem.findIndex((e: any) => e.value === res.data.results[0].data[index]["menuID"])]?.label,
           (res.data.results[0].data[index]["permission"]=== 1) ? true : false,
            (res.data.results[0].data[index]["insertOp"] === 1) ? true : false,
            (res.data.results[0].data[index]["updateOp"] === 1) ? true : false,
            (res.data.results[0].data[index]["deleteOp"] === 1) ? true : false,
            (res.data.results[0].data[index]["masterOp"] === 1) ? true : false,
            (res.data.results[0].data[index]["slaveOp"] === 1) ? true : false,
            1,
            2,
          )
        );
      }
      setRows(arr);
      setChildMenuRecords(arr);

    });
  };

  const getModalList = (roleID: any = -1) => {
    const collectData = {
      "Type": 4
    }

    api.post(`Menucreation`, collectData).then((res) => {
      const arr = [];

      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          childMenuCreateData(
            roleID,
            res.data.data[index]["ID"],
            res.data.data[index]["Title"],
            1,
            false,
            false,
            false,
            false,
            false,
            1,
            1,
          )
        );
      }
      setRows(arr);
      setChildMenuRecords(arr);

    });
  };



  let navigate = useNavigate();

  const handleSelectAll = (value: string, evnt: any) => {

    if (value == "InsertOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          InsertOp: evnt,
        }))
      );
    } else if (value == "UpdateOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          UpdateOp: evnt,
        }))
      );
    } else if (value == "DeleteOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          DeleteOp: evnt,
        }))
      );
    } else if (value == "MasterOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          MasterOp: evnt,
        }))
      );
    } else if (value == "SlaveOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          SlaveOp: evnt,
        }))
      );
    }
  };

  const handleCheckboxChange = (id: any, header: string) => {
    if (header == "InsertOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.MenuID === id ? { ...item, InsertOp: !item.InsertOp } : item
        )
      );
    } else if (header == "UpdateOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.MenuID === id ? { ...item, UpdateOp: !item.UpdateOp } : item
        )
      );
    } else if (header == "DeleteOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.MenuID === id ? { ...item, DeleteOp: !item.DeleteOp } : item
        )
      );
    } else if (header == "MasterOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.MenuID === id ? { ...item, MasterOp: !item.MasterOp } : item
        )
      );
    } else if (header == "SlaveOp") {
      setChildMenuRecords((prevData: any) =>
        prevData.map((item: any) =>
          item.MenuID === id ? { ...item, SlaveOp: !item.SlaveOp } : item
        )
      );
    }
  };
  const numberToBoolean = (num: any) => {
    return num !== 0;
  };



  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
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
              fontSize: 17,
              fontWeight: 900,
            },
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.UserPermissionMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">



          </Stack>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>


              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={roleOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);
                    setRoleID(newValue?.value)
                    //getModalList(newValue?.value);
                    getModalUpdateList(newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.role")} />}
                    />
                  )}
                />
              </Grid>



              <Grid item lg={3} sm={3}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: `var(--header-background)`,
                      color: `var(--header-color)`,
                      marginBottom: "10px",
                      marginTop: "3px",
                    }}
                  >
                    {editID == "-1" ? t("text.save") : t("text.update")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={3} sm={3}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginBottom: "10px",
                    marginTop: "3px",
                  }}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid md={12} item>
                <TableContainer sx={{ maxHeight: "65vh" }}>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead style={{ position: "sticky" }}>
                      <tr
                        style={{
                          border: "1px solid black",
                          fontSize: "2.7vh",
                          fontWeight: "500",
                          backgroundColor: `var(--header-background)`,
                          color: `var(--header-color)`,
                          textAlign: "center",
                        }}
                      >
                        <td>{t("text.MenuName")}</td>
                        <td>
                          {t("text.Insert")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.InsertOp
                            )}
                            onChange={(e) =>
                              handleSelectAll("InsertOp", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Update")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.UpdateOp
                            )}
                            onChange={(e) =>
                              handleSelectAll("UpdateOp", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.delete")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.DeleteOp
                            )}
                            onChange={(e) =>
                              handleSelectAll("DeleteOp", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Master")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.MasterOp
                            )}
                            onChange={(e) =>
                              handleSelectAll("MasterOp", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          {t("text.Slave")} <br />
                          <input
                            type="checkbox"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            checked={childMenuRecords.every(
                              (item: any) => item.SlaveOp
                            )}
                            onChange={(e) =>
                              handleSelectAll("SlaveOp", e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    </thead>
                    <tbody style={{ color: "#000000" }}>
                      {childMenuRecords.map(
                        (rows: any, key: string | number) => {
                          console.log(childMenuRecords);
                          return (
                            <>
                              {
                                <tr
                                  style={{
                                    border: "1px solid black",
                                    fontSize: "2.7vh",

                                  }}
                                >

                                  <td style={{ padding: "10px" }}>
                                    {rows.MenuName}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.MenuID,
                                          "InsertOp"
                                        )
                                      }

                                      checked={
                                        childMenuRecords[key]["InsertOp"]
                                          ? true
                                          : false
                                      }
                                      name="InsertOp"
                                      className="InsertOp"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.MenuID,
                                          "UpdateOp"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["UpdateOp"]
                                          ? true
                                          : false
                                      }
                                      name="UpdateOp"
                                      className="UpdateOp"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.MenuID,
                                          "DeleteOp"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["DeleteOp"]
                                          ? true
                                          : false
                                      }
                                      name="DeleteOp"
                                      className="DeleteOp"
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.MenuID,
                                          "MasterOp"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["MasterOp"]
                                          ? true
                                          : false
                                      }
                                      name="MasterOp"
                                      className="MasterOp"
                                    />
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(
                                          rows.MenuID,
                                          "SlaveOp"
                                        )
                                      }
                                      checked={
                                        childMenuRecords[key]["SlaveOp"]
                                          ? true
                                          : false
                                      }
                                      name="SlaveOp"
                                      className="SlaveOp"
                                    />
                                  </td>
                                </tr>
                              }
                            </>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </TableContainer>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Card>


      <ToastApp />
    </>
  );
}

