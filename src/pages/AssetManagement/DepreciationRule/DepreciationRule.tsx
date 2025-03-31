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

export default function DepreciationRule() {
  const { t } = useTranslation();
  const UserId = getId();
  const { defaultValuestime } = getISTDate();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [editId, setEditId] = useState(0);
  const [assetTypeOptions, setAssetTypeOptions] = useState<any>([]); // ✅ Store AssetType dropdown options
  const [assetTypeMap, setAssetTypeMap] = useState(new Map()); // ✅ Store AssetType ID → ResourceType mapping
  const [depreciationRules, setDepreciationRules] = useState([]); // ✅ Store depreciation rules

  // const [assetTypeOptions, setAssetTypeOptions] = useState([]); // Store AssetType dropdown options
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



  useEffect(() => {
    fetchAssetTypes(); // Fetch Asset Types for dropdown

    // const timeout = setTimeout(() => {
    //   fetchDepreciationRules(); // Fetch depreciation rules
    // }, 500);
    // return () => clearTimeout(timeout);
  }, []);


  const fetchAssetTypes = async () => {
    try {
      const response = await api.post("ResourceType", {
        ID: -1,
        ResType: "",
        ResCode: "",
        inst_id: "",
        user_id: "",
        ses_id: "",
        divisionId: "",
        ParentId: "",
        Type: 4,
      });
  
      if (response.data.success) {
        const assetData = response.data.data;
        const assetMap = new Map();
  
        const assetList = assetData.map((item: any) => {
          assetMap.set(item.ID, item.ResType); // ✅ Map AssetType ID → ResourceType
          return {...item, label: item.ResType, value: item.ID };
        });
  
        setAssetTypeOptions(assetList); // Directly setting data
        setAssetTypeMap(assetMap);
  
        console.log("✅ Asset Type Map Loaded:", assetMap);
      } else {
        toast.warn("No asset types available.");
        setAssetTypeOptions([]);
        setAssetTypeMap(new Map());
      }
    } catch (error) {
      console.error("❌ Error fetching asset types:", error);
      toast.error("Failed to load asset types.");
    }
  
    // Fetch depreciation rules after a short delay
    const timeout = setTimeout(fetchDepreciationRules, 1000);
  
    return () => clearTimeout(timeout);
  };
  



  const formik = useFormik({
    initialValues: {
      DID: 0,
      AssetType: null,
      RatePer: null,
      Datefrom: defaultValuestime,
      Dateto: defaultValuestime,
      userid: 0, // Ensure user_id is a string
      Inst_Id: 0,
      Type: 1, // Type 1 for adding/updating
    },
    validationSchema: Yup.object({
      AssetType: Yup.number().required(t("text.reqResourceType")),
      RatePer: Yup.number().required(t("text.reqDepreciationRate")),
    }),
    onSubmit: async (values) => {
      const requestData = {
        ...values,
        userid: (values.userid), // Ensure user_id is always a string
        Type: values.DID !== 0 ? 2 : 1, // Type 2 for update, 1 for add
      };

      api.post("manageDepreciationRule", requestData)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            setEditId(0); // ✅ Reset edit ID after submission
            formik.resetForm();
            fetchDepreciationRules(); // Refresh list after adding/updating
          } else {
            toast.error("Failed to update depreciation rule");
          }
        })
        .catch((error) => {
          toast.error("Error: " + error);
        });
    },
  });





  const routeChangeEdit = (row: any) => {
    api.post("manageDepreciationRule", {
      DID: row.id, // ✅ ID of the selected depreciation rule
      AssetType: 0, // ✅ Default (will be updated later)
      RatePer: 0, // ✅ Default (will be updated later)
      Datefrom: defaultValuestime, // ✅ Use formatted default date
      Dateto: defaultValuestime, // ✅ Use formatted default date
      userid: 0, // ✅ Default
      Inst_Id: 0, // ✅ Default
      Type: 3, // ✅ Type 3 for fetching data
    })
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const rule = res.data.data[0];

          formik.setValues({
            DID: rule.DID,
            AssetType: rule.AssetType,
            RatePer: rule.RatePer,
            Datefrom: rule.Datefrom.split("T")[0], // ✅ Format date properly
            Dateto: rule.Dateto.split("T")[0], // ✅ Format date properly
            userid: rule.userid,
            Inst_Id: rule.Inst_Id,
            Type: 1, // ✅ Keep Type 1 for updating
          });

          setEditId(rule.DID); // ✅ Enable edit mode
        } else {
          toast.error("Depreciation rule not found");
        }
      })
      .catch(() => toast.error("Error fetching depreciation rule details"));
  };




  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  let delete_id = "";

  const accept = () => {
    api.post("manageDepreciationRule", { Type: 5, DID: delete_id }) // Delete request
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          fetchDepreciationRules(); // Refresh list
        } else {
          toast.error("Failed to delete depreciation rule");
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
  const fetchDepreciationRules = async () => {
    setIsLoading(true);

    try {
        const collectData = { Type: 4 };

        // Fetch Depreciation Rules
        const depreciationResponse = await api.post("manageDepreciationRule", collectData);
        const depreciationData = depreciationResponse.data.data || [];

        // Fetch Resource Types
        const resourceResponse = await api.post("ResourceType", collectData);
        const resourceData = resourceResponse.data.data || [];

        // Create a mapping of AssetType (ID) to ResType (Name)
        const resourceMap = new Map(resourceData.map((res: any) => [res.ID, res.ResType]));

        // Map Depreciation Rules & Replace AssetType with ResType
        const formattedData = depreciationData.map((item: any, index: number) => ({
            ...item,
            serialNo: index + 1,
            id: item.DID,
            ResType: resourceMap.get(item.AssetType) || "Unknown" ,// Map ID to Name
            Datefrom: new Date(item.Datefrom).toLocaleDateString(), // ✅ Format date
            Dateto: new Date(item.Dateto).toLocaleDateString(), // ✅ Format date
        }));

        setDepreciationRules(formattedData);
        setIsLoading(false);

        if (formattedData.length > 0) {
            const columns: GridColDef[] = [
                { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
                { field: "ResType", headerName: t("text.ResourceType"), flex: 1 }, // ✅ Show ResType
                { field: "RatePer", headerName: t("text.DepreciatedRate"), flex: 1 },
                { field: "Datefrom", headerName: t("text.DateFrom"), flex: 1 },
                { field: "Dateto", headerName: t("text.DateTo"), flex: 1 }
            ];
            setColumns(columns);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
        setIsLoading(false);
    }
};


  
  // const fetchDepreciationRules = async () => {
  //   setIsLoading(true); // ✅ Start loading

  //   try {
  //     const collectData = {
  //       DID: -1, // Fetch all depreciation rules
  //       AssetType: 0,
  //       RatePer: 0,
  //       Datefrom: defaultValuestime,
  //       Dateto: defaultValuestime,
  //       userid: 0,
  //       Inst_Id: 0,
  //       Type: 4, // ✅ Type 4 for fetching all records
  //     };

  //     const response = await api.post("manageDepreciationRule", collectData);

  //     if (response.data.success && response.data.data.length > 0) {
  //       const depreciationList = response.data.data.map((item: any, index: number) => ({
  //         serialNo: index + 1, // ✅ Add serial number
  //         id: item.DID, // ✅ Use DID as unique ID
  //         AssetType: item.AssetType, // ✅ Ensure AssetType is mapped correctly
  //         RatePer: item.RatePer,
          // Datefrom: new Date(item.Datefrom).toLocaleDateString(), // ✅ Format date
          // Dateto: new Date(item.Dateto).toLocaleDateString(), // ✅ Format date
  //         AssetTypeName: assetTypeOptions[assetTypeOptions.findIndex((e: any) => e.ID == item.AssetType)]?.ResType || ""
  //       }));

  //       setDepreciationRules(depreciationList); // ✅ Store fetched data in state

  //       // ✅ Define columns correctly
  //       const columns: GridColDef[] = [
  //         {
  //           field: "actions",
  //           headerName: t("text.Action"),
  //           width: 150,
  //           renderCell: (params) => (
  //             <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
  //               <EditIcon
  //                 style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
  //                 onClick={() => routeChangeEdit(params.row)}
  //               />
  //               {/* <DeleteIcon
  //                 style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
  //                 onClick={() => handledeleteClick(params.row.id)}
  //               /> */}
  //             </Stack>
  //           ),
  //         },
  //         { field: "serialNo", headerName: t("text.SrNo"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
  //         // { field: "AssetTypeName", headerName: t("text.ResourceType"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
  //         // {
  //         //   field: "AssetType",
  //         //   headerName: t("text.ResourceType"), // ✅ Show ResourceType instead of AssetType ID
  //         //   flex: 1,
  //         //   valueGetter: (params) => {
  //         //     console.log("Row Data:", params.row); // ✅ Debugging log to check AssetType values
  //         //     console.log("Mapping Lookup:", assetTypeMap.get(params.row.AssetType)); // ✅ Debugging log for mapping
  //         //     return assetTypeMap.get(params.row.AssetType) || "Not Found"; // ✅ Prevents "Unknown"
  //         //   },// ✅ Convert ID to name
  //         //   headerClassName: "MuiDataGrid-colCell",
  //         // },
  //         { field: "RatePer", headerName: t("text.DepreciatedRate"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
  //         { field: "Datefrom", headerName: t("text.fromDate"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
  //         { field: "Dateto", headerName: t("text.toDate"), flex: 1, headerClassName: "MuiDataGrid-colCell" },

  //       ];


  //       setColumns(columns as any); // ✅ Store columns in state
  //     }
  //     else {
  //       toast.warn("No depreciation rules available.");
  //       setDepreciationRules([]); // ✅ Clear list if empty
  //     }
  //   } catch (error) {
  //     console.error("Error fetching depreciation rules:", error);
  //     toast.error("Failed to load depreciation rules.");
  //   } finally {
  //     setIsLoading(false); // ✅ Stop loading in all cases (success or error)
  //   }
  // };

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
                {t("text.DepreciationRule")}
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
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="asset-type-dropdown"
                  options={assetTypeOptions} // ✅ Uses fetched AssetType options
                  fullWidth
                  size="small"
                  value={
                    assetTypeOptions.find((option: any) => option.value === formik.values.AssetType) || null
                  }
                  onChange={(event, newValue: any) => {
                    if (newValue) {
                      formik.setFieldValue("AssetType", newValue.value); // ✅ Store AssetType ID
                    }
                  }}
                  getOptionLabel={(option) => {
                    // ✅ Show ResourceType name in dropdown
                    return assetTypeMap.get(option.value) || `Asset Type ${option.value}`;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectAssetType")} required={true}/>}
                    />
                  )}
                />
                {formik.touched.AssetType && formik.errors.AssetType ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.AssetType}
                  </div>
                ) : null}

              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.EnterDepreciatedRate")}
                      required={true}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="RatePer"
                  id="RatePer"
                  value={formik.values.RatePer}
                  placeholder={t("text.EnterDepreciatedRate")}
                  onChange={(e) => {
                    formik.setFieldValue("RatePer", parseInt(e.target.value));
                  }}
                />
                {formik.touched.RatePer && formik.errors.RatePer ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.RatePer}
                  </div>
                ) : null}


              </Grid>


              {/* from Date */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelectfromDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="Datefrom"
                  id="Datefrom"
                  value={formik.values.Datefrom}
                  placeholder={t("text.SelectfromDate")}
                  onChange={(e) => {
                    formik.setFieldValue("Datefrom", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.Datefrom && formik.errors.Datefrom ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.Datefrom}
                  </div>
                ) : null} */}

              </Grid>

              {/* to date  */}
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.SelecttoDate")}
                      required={false}
                    />
                  }
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="Dateto"
                  id="Dateto"
                  value={formik.values.Dateto}
                  placeholder={t("text.SelecttoDate")}
                  onChange={(e) => {
                    formik.setFieldValue("Dateto", e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* {formik.touched.Dateto && formik.errors.Dateto ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.Dateto}
                  </div>
                ) : null} */}
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
            rows={depreciationRules} // ✅ Use correct state variable
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />

        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
