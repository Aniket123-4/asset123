import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Languages from "../../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function AssetType() {
  const { t } = useTranslation();
  const UserId = getId();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(0);
  const [option, setOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [lang, setLang] = useState<Language>("en");
  let navigate = useNavigate();

  const [isStateCode, setIsStateCode] = useState(false);

  // const getPageSetupData = async () => {
  //   await api.get(`Setting/GetPageSetupDataall`).then((res) => {
  //     const data = res.data.data;
  //     data.map((e: any, index: number) => {
  //       if (e.setupId === 4 && e.showHide) {
  //         setIsStateCode(true);
  //       } else if (e.setupId === 4 && !e.showHide) {
  //         setIsStateCode(false);
  //       } else {
  //         setIsStateCode(true);
  //       }
  //     })
  //   });
  //   //return response;
  // }

  useEffect(() => {
    fetchResourceTypes();
  }, []); // ✅ Only fetch once when the component mounts




  const formik = useFormik({
    initialValues: {
      "ID": -1,
      "ResType": "",
      "ResCode": "",
      "inst_id": 1,
      "user_id": "1",
      "ses_id": 1,
      "divisionId": 1,
      "ParentId": 1,
      "Type": 1
    },
    validationSchema: Yup.object({
      ResType: Yup.string().required(t("text.reqResourceType")),
      ResCode: Yup.string().required(t("text.reqResourceCode")),
    }),
    onSubmit: async (values) => {

      api.post("ResourceType", values)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            formik.resetForm();
            setEditId(0); // Reset edit mode
            fetchResourceTypes(); // Refresh the list after adding
          } else {
            toast.error("Failed to add resource type");
          }
        })
        .catch((error) => {
          toast.error("Error: " + error);
        });
    },
  });


  const [parentTypeOptions, setParentTypeOptions] = useState([]); // ✅ State for dropdown options
  const requiredFields = ["stateName", "countryId"];

  const routeChangeEdit = (row: any) => {
    api.post("ResourceType", { Type: 3, ID: row.ID }) // Fetch resource type by ID
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const resource = res.data.data[0];

          formik.setValues({
            "ID": resource.ID,
            "ResType": resource.ResType,
            "ResCode": resource.ResCode,
            "inst_id": resource.inst_id,
            "user_id": String(resource.user_id),
            "ses_id": resource.ses_id,
            "divisionId": resource.divisionId,
            "ParentId": resource.ParentId,
            "Type": 2
          });

          setEditId(resource.ID); // Set edit mode
        } else {
          toast.error("Resource type not found");
        }
      })
      .catch(() => toast.error("Error fetching resource type details"));
  };


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    api.post("ResourceType", { Type: 5, ID: delete_id }) // Delete request
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          fetchResourceTypes(); // Refresh list
        } else {
          toast.error("Failed to delete resource type");
        }
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



  //       setZones(resourceList); // ✅ Store data in state
  //       setIsLoading(false); // ✅ Stop loading

  //     } else {
  //       toast.warn("No resource types available.");
  //       setZones([]); // ✅ Ensure state updates
  //       setIsLoading(false); // ✅ Stop loading
  //     }
  //   } catch (error) {
  //     console.error("Error fetching resource types:", error);
  //     toast.error("Failed to load resource types.");
  //     setIsLoading(false); // ✅ Stop loading on error
  //   }
  // };




  const fetchResourceTypes = async () => {
    setIsLoading(true); // ✅ Start loading before the request

    try {
      const collectData = {
        "ID": -1,
        "ResType": "",
        "ResCode": "",
        "inst_id": "",
        "user_id": "",
        "ses_id": "",
        "divisionId": "",
        "ParentId": "",
        "Type": 4
      };

      const response = await api.post("ResourceType", collectData);

      if (response.data.success && response.data.data.length > 0) {
        const resourceList = response.data.data.map((item: any, index: number) => ({
          ...item,
          serialNo: index + 1,
          id: item.ID, // Use ID from response
          ResType: item.ResType, // Store ResourceType for dropdown
          ParentId: item.ParentId, // Include ParentId for filtering
        }));

        setZones(resourceList); // ✅ Store data in state

        // ✅ Populate Parent Type Dropdown (Only items with valid ParentId)
        const dropdownOptions = resourceList
          .filter((item: any) => item.ParentId !== null) // ✅ Only valid ParentId
          .map((item: any) => ({
            label: item.ResType, // ✅ Show ResourceType in dropdown
            value: item.ID, // ✅ Store ID for selection
          }));

        setParentTypeOptions(dropdownOptions); // ✅ Store in state for dropdown

        // ✅ Define columns correctly
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            width: 150,
            renderCell: (params) => (
              <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
                <EditIcon
                  style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                  onClick={() => routeChangeEdit(params.row)}
                />
                <DeleteIcon
                  style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                  onClick={() => handledeleteClick(params.row.id)}
                />
              </Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "ResType", headerName: t("text.ResourceType"), flex: 1 }, // ✅ Fixed column name
          { field: "ResCode", headerName: t("text.ResourceCode"), flex: 1 }, // ✅ Fixed column name
        ];

        setColumns(columns as any); // ✅ Store columns in state
      } else {
        toast.warn("No resource types available.");
        setZones([]); // ✅ Clear list if empty
        setParentTypeOptions([]); // ✅ Clear dropdown options
      }
    } catch (error) {
      console.error("Error fetching resource types:", error);
      toast.error("Failed to load resource types.");
    } finally {
      setIsLoading(false); // ✅ Stop loading in all cases (success or error)
    }
  };



  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #2B4593 ",
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

          <Grid item xs={12} container spacing={2}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.AssetType")}
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

          <Stack direction="row" spacing={2} classes="my-2 mb-2"></Stack>

          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={3}>


              <Grid item xs={3.5} sm={3.5}>
                <TranslateTextField
                  label={t("text.EnterAssetTypeName")}
                  value={formik.values.ResType}
                  onChangeText={(text: string) =>
                    handleConversionChange("ResType", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.ResType && formik.errors.ResType ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ResType}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={3.5} sm={3.5} item>
                <TextField
                  label={<CustomLabel text={t("text.EnterAssetTypeCode")} required={true} />}
                  value={formik.values.ResCode}
                  name="ResCode"
                  id="ResCode"
                  placeholder={t("text.EnterAssetTypeCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ResCode && formik.errors.ResCode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.ResCode}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={3} sm={3} item>
                <Autocomplete
                  disablePortal
                  id="parent-type-dropdown"
                  options={parentTypeOptions} // ✅ Uses fetched ResourceType options
                  fullWidth
                  size="small"
                  value={
                    parentTypeOptions.find((option: any) => option.value === formik.values.ParentId) || null
                  }
                  onChange={(event: any, newValue: any) => {
                    formik.setFieldValue("ParentId", newValue?.value); // ✅ Set ParentId
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectParentType")} />}
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

          <DataGrids
            isLoading={isLoading}
            rows={zones} // ✅ Make sure `zones` is getting updated
            columns={columns} // ✅ Ensure `columns` exist
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />

        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
