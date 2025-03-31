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

export default function LocationMaster() {
    const { t } = useTranslation();
    const UserId = getId();
    const { defaultValuestime } = getISTDate();
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [editId, setEditId] = useState(0);
    const [assetTypeOptions, setAssetTypeOptions] = useState<any>([]); // ✅ Store AssetType dropdown options
    const [assetTypeMap, setAssetTypeMap] = useState(new Map()); // ✅ Store AssetType ID → ResourceType mapping
    const [LocationMasters, setLocationMasters] = useState([]); // ✅ Store depreciation rules

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
        fetchLocationMaster();

    }, []);


    // const fetchAssetTypes = async () => {
    //     try {
    //         const response = await api.post("ResourceType", {
    //             ID: -1,
    //             ResType: "",
    //             ResCode: "",
    //             inst_id: "",
    //             user_id: "",
    //             ses_id: "",
    //             divisionId: "",
    //             ParentId: "",
    //             Type: 4,
    //         });

    //         if (response.data.success) {
    //             const assetData = response.data.data;
    //             const assetMap = new Map();

    //             const assetList = assetData.map((item: any) => {
    //                 assetMap.set(item.ID, item.ResType); // ✅ Map AssetType ID → ResourceType
    //                 return { ...item, label: item.ResType, value: item.ID };
    //             });

    //             setAssetTypeOptions(assetList); // Directly setting data
    //             setAssetTypeMap(assetMap);

    //             console.log("✅ Asset Type Map Loaded:", assetMap);
    //         } else {
    //             toast.warn("No asset types available.");
    //             setAssetTypeOptions([]);
    //             setAssetTypeMap(new Map());
    //         }
    //     } catch (error) {
    //         console.error("❌ Error fetching asset types:", error);
    //         toast.error("Failed to load asset types.");
    //     }

    //     // Fetch depreciation rules after a short delay
    //     const timeout = setTimeout(fetchLocationMaster, 1000);

    //     return () => clearTimeout(timeout);
    // };




    const formik = useFormik({
        initialValues: {

            "LocId": 0,
            "LocName": "",
            "LocAbb": "",
            "ParentLoc": 0,
            "Lattitude": 0,
            "Longitude": 0,
            "CreateDate": defaultValuestime,
            "Type": 1

        },
        validationSchema: Yup.object({
            LocName: Yup.string().required(t("text.reqLocName")),
            //  RatePer: Yup.number().required(t("text.reqDepreciationRate")),
        }),
        onSubmit: async (values) => {
            const requestData = {
                ...values,

                Type: values.LocId !== 0 ? 2 : 1, // Type 2 for update, 1 for add
            };

            api.post("LocationMaster", requestData)
                .then((response) => {
                    if (response.data.success) {
                        toast.success(response.data.message);
                        setEditId(0); // ✅ Reset edit ID after submission
                        formik.resetForm();
                        fetchLocationMaster(); // Refresh list after adding/updating
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
        api.post("LocationMaster", {
            LocId: row.id,
            "LocName": "",
            "LocAbb": "",
            "ParentLoc": 0,
            "Lattitude": 0,
            "Longitude": 0,
            "CreateDate": defaultValuestime,
            "Type": 5,
        })
            .then((res) => {
                if (res.data.success && res.data.data.length > 0) {
                    const rule = res.data.data[0];

                    formik.setValues({
                        LocId: rule.LocId,
                        LocName: rule.LocName,
                        LocAbb: rule.LocAbb,
                        CreateDate: rule.CreateDate.split("T")[0],
                        ParentLoc: rule.ParentLoc,
                        Lattitude: rule.Lattitude,
                        Longitude: rule.Longitude,
                        Type: 2, // ✅ Keep Type 1 for updating
                    });

                    setEditId(rule.DID); // ✅ Enable edit mode
                } else {
                    toast.error("location not found");
                }
            })
            .catch(() => toast.error("Error fetching location details"));
    };




    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    let delete_id = "";

    const accept = () => {
        api.post("LocationMaster", { Type: 4, LocId: delete_id }) // Delete request
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchLocationMaster(); // Refresh list
                } else {
                    toast.error("Failed to delete location rule");
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


    const fetchLocationMaster = async () => {
        setIsLoading(true);

        try {
            const collectData = { Type: 3 }; // Ensure correct API parameter
            const response = await api.post("LocationMaster", collectData);

            if (response.data.success && response.data.data.length > 0) { // Fix: Access `data` property correctly
                const locationList = response.data.data.map((item: any, index: number) => ({
                    serialNo: index + 1,
                    id: item.LocId,
                    LocName: item.LocName,  // ✅ Display correct location name
                    LocAbb: item.LocAbb,
                    Lattitude: item.Lattitude,
                    Longitude: item.Longitude
                }));

                setLocationMasters(locationList);

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
                    { field: "LocName", headerName: t("text.LocName"), flex: 1 },
                    { field: "LocAbb", headerName: t("text.LocAbb"), flex: 1 },
                    { field: "Lattitude", headerName: t("text.Lattitude"), flex: 1 },
                    { field: "Longitude", headerName: t("text.Longitude"), flex: 1 }
                ];

                setColumns(columns);
            } else {
                toast.warn("No locations available.");
                setLocationMasters([]);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Failed to load locations.");
        } finally {
            setIsLoading(false);
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
                                {t("text.LocationMaster")}
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
                                <TranslateTextField
                                    label={t("text.enterLocationName")}
                                    value={formik.values.LocName}
                                    onChangeText={(text: string) => handleConversionChange('LocName', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.LocName && formik.errors.LocName ? (
                                    <div style={{ color: "red", margin: "5px" }}>{formik.errors.LocName}</div>
                                ) : null}
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    id="LocAbb"
                                    name="LocAbb"
                                    label={<CustomLabel text={t("text.enterLocationSHORTNAME")} />}
                                    value={formik.values.LocAbb}
                                    placeholder={t("text.enterLocationSHORTNAME")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    id="Lattitude"
                                    name="Lattitude"
                                    label={<CustomLabel text={t("text.enterlattitude")} />}
                                    value={formik.values.Lattitude}
                                    placeholder={t("text.enterlattitude")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    id="Longitude"
                                    name="Longitude"
                                    label={<CustomLabel text={t("text.enterlongitude")} />}
                                    value={formik.values.Longitude}
                                    placeholder={t("text.enterlongitude")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                        rows={LocationMasters} // ✅ Use correct state variable
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
