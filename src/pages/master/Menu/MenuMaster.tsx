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
  Box,
  Button,
  Divider,
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
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import CircularProgress from "@mui/material/CircularProgress";
import {useTranslation} from "react-i18next";
import api from "../../../utils/Url";
// interface Column {
//   id: "srno" | "menuName" | "pageUrl" | "icon" |
//   //  "displayNo" |
//     // "isMenu" |
//      "isAdd" | "isEdit" | "isDel" | "isView" | "isPrint" | "isExport" | "isRelease" | "isPost" | "parentId";
//   label: string;
//   minWidth?: number;
//   format?: (value: number) => string;
// }

// interface Data {
//     srno: number,
//     id: string,
//     menuName: string,
//     pageUrl: string,
//     icon: string,
//     // displayNo: number,
//     // isMenu: boolean,
//     isAdd: boolean,
//     isEdit: boolean,
//     isDel: boolean,
//     isView: boolean,
//     isPrint: boolean,
//     isExport: boolean,
//     isRelease: boolean,
//     isPost: boolean,
//     parentId:number
// }

function createData(
  srno: number,
  id: string,
  menuName: string,
  parentId:number,
  parentName:string,
  pageUrl: string,
  icon: string,
 displayNo: number,
  // isMenu: boolean,
  isAdd: boolean,
  isEdit: boolean,
  isDel: boolean,
  isView: boolean,
  isPrint: boolean,
  isExport: boolean,
  isRelease: boolean,
  isPost: boolean,
 
): any {
  return {
    srno,id,menuName,pageUrl,icon,
    displayNo,
    // isMenu,
    isAdd,isEdit,isDel,isView,isPrint,isExport,isRelease,isPost,parentId, parentName
  };
}

export default function MenuMaster() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);
  const [isLoading, setIsLoading] = useState(true);
  const [menupermisiondata, setMenupermisiondata] = useState<any>();

const{i18n,t}=useTranslation();
  const location = useLocation();

  //Search Filter

  function handleFilter(event: any) {
    const newRows = rows.filter((rowss: { brandname: string }) => {
      return rowss.brandname
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setRecords(newRows);
    setPage(0);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Delete Action Option

  const deleteUser = () => {
    Swal.fire({
      title: "Are you sure ?",
      text: "You won't be able to revert this !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        // console.log("Use clicked ok");
      } else {
        // console.log("Use Clicked Cancel");
      }
    });
  };

  let delete_id = "";
  useEffect(() => {
    getList();
    var data = JSON.parse(localStorage.getItem("userdata")!);
    var menudata = data[0]["userPermission"][0]["parentMenu"];
    for (let index = 0; index < menudata.length; index++) {
      var childMenudata = menudata[index]["childMenu"];
      var sas = childMenudata.find((x: any) => x.path == location.pathname);
      if (sas != "undefined") {
        setMenupermisiondata(sas);
        break;
      }
    }
  }, []);

  const getList = () => {
    const collectData = {
      menuId:-1
    };
    
    api
      .post(
        `Menu/GetMenuMaster`, collectData
      )
      .then((res) => {
        const arr = [];
        // console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push(
            createData(
              index + 1,
              res.data.data[index]["menuId"],
              res.data.data[index]["menuName"],
              res.data.data[index]["parentId"],
              res.data.data[index]["parentName"],
              res.data.data[index]["pageUrl"],
              res.data.data[index]["icon"],
              res.data.data[index]["displayNo"],
              // res.data.data[index]["isMenu"],
              res.data.data[index]["isAdd"],
              res.data.data[index]["isEdit"],
              res.data.data[index]["isDel"],
              res.data.data[index]["isView"],
              res.data.data[index]["isPrint"],
              res.data.data[index]["isExport"],
              res.data.data[index]["isRelease"],
              res.data.data[index]["isPost"],
            )
          );
        }
        // console.log(arr);
        setRows(arr);
        setRecords(arr);
        // console.log(records);
        setIsLoading(false);

      });
  };

  const accept = () => {
    const collectData = {
      BrandId: delete_id,
      Type: 2,
      brandname: "",
      brandCode: "",
      brandshortname: "",
    };
    // console.log(collectData);
    api
      .post( `Vehicle/SaveBrand`, collectData)
      .then((res) => {
        // console.log(res.data);
        // console.log("data2222" + res.data.isSuccess);
        if (res.data.isSuccess) {
          alert(res.data.msg);
          getList();
        } else {
          alert(res.data.msg);
        }
      });
  };

  const reject = () => {
    //toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    // console.log(del_id);
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
  const findArrayElementByTitle = (array: any[], title: any) => {
    return array.find((element) => {
      return element.id === title;
    });
  };

  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/master/MenuMasterEdit`;
    navigate(path, {
      state: row,
    });
  };

  /// NEXT PAGE

  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/master/MenuMasterAdd`;
    navigate(path);
  };

  return (
    <div>
      <Grid item lg={6} sm={6} xs={12}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid green ",
          }}
        >
          <Paper
            sx={{ width: "100%", overflow: "hidden" }}
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
             {t("text.MenuMaster")}
            </Typography>
            <Divider />

            {/* Search and ADD buttone Start */}
            <Box height={10} />
            <Stack direction="row" spacing={2} classes="my-2 mb-2">
           {/* {menupermisiondata?.isAdd == true ?( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
              >
                {t("text.add")}
              </Button> {/*):""} */ }
              {menupermisiondata?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />}>
                 {t("text.print")}
              </Button>):""}
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              ></Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <SearchIcon />
                <TextField
                  id="standard-search"
                  label={t("text.search")}
                  type="search"
                  variant="standard"
                  onChange={handleFilter}
                />
              </Box>
            </Stack>

            {/* Search END */}

            {isLoading ? (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <CircularProgress/>
              </div>
            ) : (
              <Box>
                <br></br>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: 100,
                        backgroundColor: "lightblue",
                        borderTopLeftRadius: "10px",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                      {t("text.Action")}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: 100,
                        backgroundColor: "lightblue",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                      {t("text.SrNo")}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: 100,
                        backgroundColor: "lightblue",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                       {t("text.ParentName")}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: 100,
                        backgroundColor: "lightblue",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                      {t("text.MenuName")}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        minWidth: 100,
                        backgroundColor: "lightblue",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                 {t("text.PageURL")}
                    </TableCell>

                    <TableCell align="left" style={{minWidth: 140, backgroundColor: "lightblue", fontWeight: "800", fontSize: "13px", borderTopRightRadius: "10px"}}>
                    {t("text.Icon")}
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {records
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(
                      (row: {
                        srno:
                        any;
                        id:
                        any;
                          menuName:
                          any;
                          parentName:
                          any;
                        pageUrl:
                        any;
                        icon:
                        any;
                        displayNo:
                        any;
                        isMenu:
                        any;
                      }) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            // key={row.brandname}
                          >
                            <TableCell align="left">
                              <Stack spacing={2} direction="row">
                                <EditIcon
                                  style={{
                                    fontSize: "20px",
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                  className="cursor-pointer"
                                  onClick={() => routeChangeEdit(row)}
                                />
                                <DeleteIcon
                                  style={{
                                    fontSize: "20px",
                                    color: "darkred",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handledeleteClick(row.id);
                                  }}
                                />
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{row.srno}</TableCell>
                            <TableCell align="left">{row.parentName}</TableCell>
                            <TableCell align="left">{row.menuName}</TableCell>
                            <TableCell align="left">{row.pageUrl}</TableCell>
                            <TableCell align="left">{row.icon}</TableCell>
                            {/* <TableCell align="left">{row.displayNo}</TableCell>
                            <TableCell align="left">{row.isMenu}</TableCell> */}
                          </TableRow>
                        );
                      }
                    )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Box>)}
          </Paper>
        </Card>
      </Grid>
    </div>
  );
}
