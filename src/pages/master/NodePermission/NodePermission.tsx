import {
  Button,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Table
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import ToastApp from "../../../ToastApp";
import { AddCircle } from "@mui/icons-material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import Box from "@mui/material/Box";

type Props = {};

const NodePermission = (props: Props) => {

  const { t } = useTranslation();

  const [NodeOption, setNodeOption] = useState<any>([
    { value: "-1", label: "Select Node" },
  ]);
  const [UserOption, setUserOption] = useState([
    { value: "-1", label: t("text.SelectUser") },
  ]);
  const [nodeData, setNodeData] = useState<any>([]);

  const [nodeDataed, setNodeDataed] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [nodePermission, setNodePermission] = useState<any>([]);
  const [isChecked, setIsChecked] = useState(false);

  const [treedata, setTreedata] = useState<any>([]);
  console.log("data", treedata)

  let navigate = useNavigate();

  useEffect(() => {
    getUser();

    getNode();
  }, []);

  const getNodePermissionData = async (id: any) => {
    const collectData = {
      userId: id
    };
    const res = await api.post(`NodePermission/GetNodePermission`, collectData);
    console.log("check", res.data.data);
    const responseData = res.data.data;
    if (responseData) {
      const newCheckedNodeIds = responseData.map((item: any) => item.nodeId);
      setCheck(newCheckedNodeIds);

      ///get user data set for node permission check 
      const arr1 = [];
      for (var i = 0; i < responseData.length; i++)
        arr1.push({
          id: i + 1,
          nodeId: responseData[i]["nodeId"] || "",
          nodeName: responseData[i]["nodeName"] || "",
          isChecked: newCheckedNodeIds.includes(responseData[i]["nodeId"])
        })
      // setNodePermission(arr1)
    } else {
      setCheckedNodeIds([]);
      setNodePermission([]);
    }
  };

  const getUser = () => {
    const collectData = {
      useR_ID: "-1",
    };
    api.post(`Auth/GetUSER`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.firsT_NAME,
        value: item.useR_ID,
      }));
      setUserOption(arr);
    });
  };

  const getNode = () => {
    const collectData = {
      id: -1,
      nodeID: -1,
      titleID: -1,
    };
    api.post(`NewNodeMaster/GetNewNodeMasterHeirarical`, collectData).then((res) => {
      // console.log("get Node", res.data.data)
      const arrtableData = [];
      for (let index = 0; index < res?.data?.data.length; index++) {
        arrtableData.push({
          id: index + 1,
          nodeId: res.data.data[index]["nodeId"] || "",
          nodeName: res.data.data[index]["name"] || "",
        })
        // setNodePermission(arrtableData);
      }

      if (res.data.data.length > 0) {
        setTreedata(res.data.data);
      }
    });
  };

  const [check, setCheck] = useState<any>([]);

  const handleToggle = (id: number) => () => {
    const currentIndex = check.indexOf(id);
    const newChecked = [...check];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheck(newChecked);
  };

  console.log("Checked value", check)


  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      itemId={String(nodes.id)}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={check.indexOf(nodes.id) !== -1}
            onChange={handleToggle(nodes.id)}
            onClick={(event: any) => event.stopPropagation()}
          />

          <div style={{ marginLeft: 8 }}>{nodes.name}</div>
        </div>
      }
    >
      {Array.isArray(nodes.childnode)
        ? nodes.childnode.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  );

  const back = useNavigate();




  const [checkedNodeIds, setCheckedNodeIds] = useState<any>([]);


  const handleChange = (row: any, isChecked: any) => {
    console.log('Row:', row);
    console.log('isChecked:', isChecked);

    // Update the isChecked property of the row
    const updatedRow = { ...row, isChecked: isChecked };
    console.log('Updated Row:', updatedRow);

    // Update the row in the state
    const updatedNodePermission = nodePermission.map((item: any) =>
      item.id === row.id ? updatedRow : item
    );
    console.log('Updated Node Permission:', updatedNodePermission);
    setNodePermission(updatedNodePermission);

    if (isChecked) {
      // If checkbox is checked, add the nodeId to checkedNodeIds
      console.log('Checkbox is checked. Adding nodeId to checkedNodeIds:', row.id);
      setCheckedNodeIds((prevCheckedNodeIds: any) => [
        ...prevCheckedNodeIds,
        row.id
      ]);

      // Update the nodeData state
      const updatedNodeData = [
        ...nodeData,
        { nodeId: row.id }
      ];
      console.log('Updated Node Data:', updatedNodeData);
      setNodeData(updatedNodeData);
    } else {
      // If checkbox is unchecked, remove the nodeId from checkedNodeIds
      console.log('Checkbox is unchecked. Removing nodeId from checkedNodeIds:', row.id);
      setCheckedNodeIds((prevCheckedNodeIds: any[]) =>
        prevCheckedNodeIds.filter((id: any) => id !== row.id)
      );

      const updatedNodeData = nodeData.filter((node: { nodeId: any }) => node.nodeId !== String(row.id));


      console.log('Updated Node Data:', updatedNodeData);
      setNodeData(updatedNodeData);
    }
  };

  const validationSchema = Yup.object({
    userId: Yup.string().test(
      "required",

      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      id: -1,
      nodeID: -1,
      userId:"",
      "name": "",
      "titleID": -1,
      subNode: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const arr: any = [];

for (let index = 0; index < check.length; index++) {
  const element = check[index];
  if (check[index] > 0) {
    arr.push({
      id: check[index],
    });
  }
}

const arrOfStringIndexes = arr.map((value: any) => ({
  nodeId: value.id.toString()
}));
values.subNode = arrOfStringIndexes;
      console.log("checked data", arrOfStringIndexes)
      console.log("Submitting values", values);
      const response = await api.post(
        `NodePermission/AddUpdateNodePermission`,
        values
      );
      try {
        toast.success(response.data.mesg);
        formik.resetForm();
        setNodeData([]);
        // window.location.reload(); 
        // navigate("/master/NodePermission");
      } catch (error) {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["userId"];

  const addRow = () => {

    const newRow = {
      id: nodePermission.length + 1,
      nodeId: 0,
      nodeName: ""
    };
    setNodePermission((prevTableData: any) => {
      const updatedTableData = [...prevTableData, newRow];
      console.log(newRow);
      return updatedTableData;
    });

  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #00009c",
          margin: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.NodePermission")}
          </Typography>
          <Divider />
          <br />

          <form onSubmit={formik.handleSubmit}>
            <ToastApp />
            <Grid container spacing={1}>
              <Grid item sm={12} md={12} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={UserOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    if (newValue) {
                      formik.setFieldValue("userId", newValue?.value);
                      getNodePermissionData(newValue?.value);
                    } else {
                      formik.setFieldValue("userId", "");
                    }
                    formik.setFieldTouched("userId", true);
                    formik.setFieldTouched("userId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectUser")} {""}
                          {requiredFields.includes("userId") && (
                            <span
                              style={{
                                color: formik.values.userId ? "green" : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />

                {formik.touched.userId && formik.errors.userId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.userId}
                  </div>
                ) : null}
              </Grid>

             
              {/* <Grid container xs={12} spacing={2} sx={{ marginTop: "5px" }}>
                <Grid xs={12} sm={12} item>
                  <Table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid black",
                      marginLeft: "10px",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#2196f3",
                        color: "#f5f5f5",
                      }}
                    >
                      <tr>

                        <th
                          style={{
                            borderLeft: "1px solid black",
                            paddingBlock: "10",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                          }}
                        >
                          {t("text.Action")}
                        </th>

                        <th
                          style={{
                            borderLeft: "1px solid black",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                          }}
                        >
                          {t("text.NodeName")}
                        </th>

                      </tr>
                    </thead>
                    <tbody style={{ border: "1px solid black" }}>
                      {nodePermission?.map(
                        (row: any, index: any) => (
                          <tr
                            key={row.id}
                            style={{ border: "1px solid black" }}
                          >
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              <input type="checkbox"
                                // onChange={(e)=>handleChange(row.id)}
                                onChange={(e) => handleChange(row, e.target.checked)}
                                checked={row.isChecked}
                              />
                            </td>


                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              {row.nodeName}
                             
                            </td>




                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </Grid>
              </Grid> */}

              <Grid xs={12} item>
                <Box>
                  <div style={{ height: "300px", overflow: "auto" }}>
                    <SimpleTreeView
                    >
                      {Array.isArray(treedata)
                        ? treedata.map((node: any) => renderTree(node))
                        : null}
                    </SimpleTreeView>
                  </div>
                </Box>
              </Grid>
              <Grid xs={12} item>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#059669",
                      margin: "1%",
                    }}

                  //onClick={(e:any) =>AddNodeItem()}
                  >
                    {t("text.save")}
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default NodePermission;



// import * as React from "react";
// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Divider,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import SearchIcon from "@mui/icons-material/Search";
// import Swal from "sweetalert2";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import PrintIcon from "@mui/icons-material/Print";
// import axios from "axios";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import api from '../../../utils/Url';
// import { useNavigate, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import ToastApp from "../../../ToastApp";
// import {
//   DataGrid,
//   GridColDef,
//   GridToolbar,
// } from "@mui/x-data-grid";
// import Switch from "@mui/material/Switch";
// import Chip from "@mui/material/Chip";
// import CircularProgress from "@mui/material/CircularProgress";

// interface MenuPermission {
//   isAdd: boolean;
//   isEdit: boolean;
//   isPrint: boolean;
//   isDel: boolean;
// }

// export default function NodePermission() {
//   const [dept, setDept] = useState([]);
//   const [columns, setColumns] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const location = useLocation();
//   const [permissionData, setPermissionData] = useState<MenuPermission>({
//     isAdd: false,
//     isEdit: false,
//     isPrint: false,
//     isDel: false,
//   });

//   let navigate = useNavigate();
//   const { t } = useTranslation();

//   useEffect(() => {
//     // const dataString = localStorage.getItem("userdata");
//     //   if (dataString) {
//     //     const data = JSON.parse(dataString);
//     //     if (data && data.length > 0) {
//     //       const userPermissionData = data[0]?.userPermission;
//     //       if (userPermissionData && userPermissionData.length > 0) {
//     //         const menudata = userPermissionData[0]?.parentMenu;
//     //         for (let index = 0; index < menudata.length; index++) {
//     //           const childMenudata = menudata[index]?.childMenu;
//     //           const pathrow = childMenudata.find(
//     //             (x: any) => x.path === location.pathname
//     //           );
//     //           console.log("data", pathrow);
//     //           if (pathrow) {
//     //             setPermissionData(pathrow);
//     // fetchZonesData();
//     //         }
//     //       }
//     //     }
//     //   }
//     // }
//     fetchZonesData();
//   },[]);
//   // [isLoading]


//   const routeChangeEdit = (row: any) => {
//     console.log("row " + row);

//     let path = `/master/NodePermissionEdit`;
//     navigate(path, {
//       state: row,
//     });
//   };

//   const routeChangeAdd = () => {
//     let path = `/master/NodePermissionAdd`;
//     navigate(path);
//   };

//   let delete_id = "";

//   const accept = () => {
//     const collectData = {
//         userId: delete_id,
//       user_ID: 0,
//     };
//     console.log("collectData " + JSON.stringify(collectData));
//     api
//       .delete(`NodePermission/DeleteNodePermission`, {data:collectData})
//       .then((response) => {
//         if (response.data.isSuccess) {
//           toast.success(response.data.mesg);
//         } else {
//           toast.error(response.data.mesg);
//         }
//         fetchZonesData();
//       });
//   };

//   const reject = () => {
//     // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
//     toast.warn("Rejected: You have rejected", { autoClose: 3000 });
//   };

//   const handledeleteClick = (del_id: any) => {
//     // console.log(del_id + " del_id ");
//     delete_id = del_id;
//     confirmDialog({
//       message: "Do you want to delete this record ?",
//       header: "Delete Confirmation",
//       icon: "pi pi-info-circle",
//       acceptClassName: "p=-button-danger",
//       accept,
//       reject,
//     });
//   };

//   const fetchZonesData = async () => {
//     try {
//       const collectData = {
//         "userId": "-1",

//       };
//       const response = await api.post(
//          `NodePermission/GetNodePermission`,
//         collectData
//       );
//       const data = response.data.data;
//       const deptWithIds = data.map((dept: any, index: any) => ({
//         ...dept,
//         serialNo: index + 1,
//         id: dept.userId,
//       }));
//       setDept(deptWithIds);
//       setIsLoading(false);

//       if (data.length > 0) {
//         const columns: GridColDef[] = [
//           {
//             field: "actions",
//             headerClassName: "MuiDataGrid-colCell",
//             headerName: t("text.Action"),
//             width: 150,

//             renderCell: (params) => {
//               return [
//                 <Stack
//                   spacing={1}
//                   direction="row"
//                   sx={{ alignItems: "center", marginTop: "5px" }}
//                 >
//                   {/* {permissionData?.isEdit ? ( */}
//                   <EditIcon
//                     style={{
//                       fontSize: "20px",
//                       color: "blue",
//                       cursor: "pointer",
//                     }}
//                     className="cursor-pointer"
//                     onClick={() => routeChangeEdit(params.row)}
//                   />
//                   {/* ) : ( */}
//                   {/* "" */}
//                   {/* )} */}
//                   {/* {permissionData?.isDel ? ( */}
//                   <DeleteIcon
//                     style={{
//                       fontSize: "20px",
//                       color: "red",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       handledeleteClick(params.row.id);
//                     }}
//                   />
//                   {/* ) : (
//                     ""
//                   )} */}
//                   {/* <Switch
//                     checked={Boolean(params.row.isActive)}
//                     style={{
//                       color: params.row.isActive ? "green" : "#FE0000",
//                     }}
//                     onChange={(value: any) =>
//                       handleSwitchChange(value, params.row)
//                     }
//                     inputProps={{
//                       "aria-label": "Toggle Switch",
//                     }}
//                   /> */}
//                 </Stack>,
//               ];
//             },
//           },

//           {
//             field: "serialNo",
//             headerName: t("text.SrNo"),
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },
//           {
//             field: "nodeName",
//             headerName: "Node Name",
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },

//           {
//             field: "location",
//             headerName: "Location",
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },

//           {
//             field: "nodeId",
//             headerName: "Node ID",
//             flex: 1,
//             headerClassName: "MuiDataGrid-colCell",
//           },

//           // {
//           //   field: "isActive",
//           //   headerName: t("text.Status"),
//           //   flex: 1,
//           //   headerClassName: "MuiDataGrid-colCell",
//           //   renderCell: (params) => [
//           //     <Stack direction="row" spacing={1}>
//           //       {params.row.isActive ? (
//           //         <Chip
//           //           label={t("text.Active")}
//           //           color="success"
//           //           style={{ fontSize: "14px" }}
//           //         />
//           //       ) : (
//           //         <Chip
//           //           label={t("text.InActive")}
//           //           color="error"
//           //           style={{ fontSize: "14px" }}
//           //         />
//           //       )}
//           //     </Stack>,
//           //   ],
//           // },
//         ];
//         setColumns(columns as any);
//       }

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       // setLoading(false);
//     }
//   };

//   const adjustedColumns = columns.map((column: any) => ({
//     ...column,
//   }));


//   return (
//     <>
//       <Card
//         style={{
//           width: "100%",
//           // height: "100%",
//           backgroundColor: "#E9FDEE",
//           border: ".5px solid #FF7722 ",
//           marginTop: "3vh"
//         }}
//       >
//         <Paper
//           sx={{
//             width: "100%",
//             overflow: "hidden",
//             "& .MuiDataGrid-colCell": {
//               backgroundColor: "#f0ad4e",
//               color: "#000",
//               fontSize: 17,
//               fontWeight: 900
//             },
//           }}
//           style={{ padding: "10px", }}
//         >
//           <ConfirmDialog />

//           <Typography
//             gutterBottom
//             variant="h5"
//             component="div"
//             sx={{ padding: "20px" }}
//             align="left"
//           >
//             Node Permission
//           </Typography>
//           <Divider />

//           <Box height={10} />

//           <Stack direction="row" spacing={2} classes="my-2 mb-2">
//             {/* {permissionData?.isAdd == true && ( */}
//             <Button
//               onClick={routeChangeAdd}
//               variant="contained"
//               endIcon={<AddCircleIcon />}
//               size="large"
//             >
//               {t("text.add")}
//             </Button>
//             {/* ) } */}

//             {/* {permissionData?.isPrint == true ? (
//               <Button variant="contained" endIcon={<PrintIcon />} size="large">
//                 {t("text.print")}
//               </Button>
//             ) : (
//               ""
//             )} */}
//           </Stack>

//           {isLoading ? (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <CircularProgress />
//             </div>
//           ) : (
//             <Box>
//               <br />
//               <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
//                 <DataGrid
//                   rows={dept}
//                   columns={adjustedColumns}
//                   autoHeight
//                   slots={{
//                     toolbar: GridToolbar,
//                   }}
//                   rowSpacingType="border"
//                   pagination={true}
//                   pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
//                     value: size,
//                     label: `${size}`,
//                   }))}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 5 } },
//                   }}
//                   slotProps={{
//                     toolbar: {
//                       showQuickFilter: true,
//                     },
//                   }}
//                 />
//               </div>

//             </Box>)}
//         </Paper>
//       </Card>
//       <ToastApp />

//     </>
//   );
// }


{/* <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={NodeOption}
                                  fullWidth
                                  size="small"
                                  multiple
                                  disableCloseOnSelect
                                  getOptionLabel={(option: any) => option.label}
                                  renderOption={(props, option: any, { selected }) => (
                                      <li {...props}>
                                          <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                          {option.label}
                                      </li>
                                  )}
                                  // onChange={(event, newValue) => {
                                  //     console.log("check click", newValue);
                                  //     if (newValue.includes(NodeOption[0])) {
                                  //         // Select All option selected
                                  //         // formik.setFieldValue("nodeId", "all");
                                  //         setNodeData("all");
                                  //     } else {
                                  //         setNodeData(newValue.map((option: any) => option.value));
                                  //     }
                                  //     // formik.setFieldTouched("nodeId", true);
                                  // }}

                                  onChange={(event, newValue) => {
                                      if (newValue.includes(NodeOption[0])) {
                                          // Select All option selected
                                          setNodeData([{ nodeId: "all" }]);
                                      } else {
                                          // Regular options selected
                                          setNodeData(newValue.map((option: any) => ({ nodeId: option.value })));
                                      }
                                  }}
                                  renderInput={(params) => (
                                      <TextField
                                          {...params}
                                          label={
                                              <span>
                                                  Select Node{" "}
                                                  {requiredFields.includes("nodeId") && (
                                                      <span
                                                          style={{
                                                              color: formik.values.nodeId ? "green" : "red",
                                                          }}
                                                      >
                                                          *
                                                      </span>
                                                  )}
                                              </span>
                                          }
                                      />
                                  )}
                              /> */}