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
    FormControlLabel,
    Checkbox,
    FormControl,
    RadioGroup,
    Radio,
    FormLabel,
    Modal,
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
import nopdf from "../../../assets/images/imagepreview.jpg";
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
const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "180vh",
    height: "85vh",
    bgcolor: "#f5f5f5",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
};
export default function AssetLocation() {
    const { t } = useTranslation();
    const UserId = getId();
    const { defaultValues } = getISTDate();

    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [editId, setEditId] = useState(0);

    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [assetCodeOptions, setAssetCodeOptions] = useState([]);
    const [Img, setImg] = useState("");
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const [lang, setLang] = useState<Language>("en");
    let navigate = useNavigate();
    const [locationOption, setlocationOption] = useState([
        { value: -1, label: t("text.SelectDept") },
    ]);
    const [isStateCode, setIsStateCode] = useState(false);
    // const option = [
    //     { label: "BD1-Rm1-Furniture", value: "1" },
    //     { label: "BD1-Rm2-Alm1-Shl1", value: "2" },
    //     { label: "FL1-Rm1-Alm1-Shl1", value: "3" },
    //     { label: "FL2-Rm2-Alm1-Shl1", value: "4" },
    //     { label: "FL2-Rm2-Alm1-Shl2", value: "5" },
    //     { label: "Rm1-Alm1-Shl1-AP1", value: "6" },
    //     { label: "Rm1-Alm1-Shl2-AP1", value: "7" },
    //   ];




    useEffect(() => {
        getlocationData();
        fetchAssetCode();

        const timeout = setTimeout(() => {
            //getPageSetupData();
            fetchZonesData();
        }, 100);
        return () => clearTimeout(timeout);
    }, [isLoading]);


    const fetchAssetCode = async () => {
        try {
            const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
            if (response.data.success && response.data.data.length > 0) {
                const assetList = response.data.data.map((item: any) => ({
                    label: `${item.ResourceCode} (${item.ResourceName || item.ResType || ""})`, // Use whichever exists
                    value: item.ID, // Resource ID
                    ResourceCode: item.ResourceCode,
                    ResourceName: item.ResourceName || item.ResType || "", // Safeguard for naming mismatch
                    Status_ID: item.Status_ID, // In case you need
                }));

                setAssetCodeOptions(assetList);
            } else {
                toast.warn("No resource details found.");
            }
        } catch (error) {
            console.error("Failed to fetch ResourceDetail", error);
            toast.error("Failed to load asset codes.");
        }
    };


    const getlocationData = () => {
        const collectData = {
            "Type": 3
        };
        api.post(`LocationMaster`, collectData).then((res) => {
            const arr: any = [];
            //console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["LocName"],
                    value: res.data.data[index]["LocId"],
                });
            }
            setlocationOption(arr);
        });
    }

   

    const formik = useFormik({
        initialValues: {
            Id: -1,                     // -1 for add, record Id for edit
            Asset_Id: "",
            Location_Id: "",
            Description: "",
            Asset_Type: "",
            Location_Date: defaultValues,
            Inst_Id: "1",               // Fixed or as per context
            User_Id: "UserId",            // From getId()
            divisionid: 1,              // Fixed
            Type: 1                    // 1 for Add, 2 for Update
        },
        // validationSchema: validationSchema,

        validationSchema: Yup.object({

            Location_Id: Yup.string()
                .required(t("text.reqLocation_Id")),
            Asset_Id: Yup.string()
                .required(t("text.reqasset")),
        }),
        onSubmit: async (values) => {
            values.Type = editId === 0 ? 1 : 2; // Dynamically decide Add or Update
            const response = await api.post(`AssetLocation`, values);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchZonesData(); // Reload data
                formik.resetForm(); // Clear form
                setEditId(0);       // Reset edit state
            } else {
                toast.error(response.data.message);
            }
        }
    });



    const requiredFields = ["stateName", "countryId"];

    const routeChangeEdit = async (row: any) => {
        try {
            const response = await api.post("AssetLocation", {
                Id: row.Id, // ID to fetch
                Asset_Id: "",
                Location_Id: "",
                Description: "",
                Asset_Type: "",
                Location_Date: defaultValues,
                Inst_Id: "",
                User_Id: "",
                divisionid: "",
                Type: 3 // Retrieve by ID
            });

            if (response.data.success && response.data.data.length > 0) {
                const data = response.data.data[0]; // First object

                formik.setValues({
                    Id: data.Id, // set ID for update
                    Asset_Id: data.Asset_Id,
                    Location_Id: data.Location_Id,
                    Description: data.Description,
                    Asset_Type: data.Asset_Type,
                    Location_Date: data.Location_Date.split('T')[0], // format to YYYY-MM-DD for date input
                    Inst_Id: data.Inst_Id?.toString() || "1",
                    User_Id: "UserId",
                    divisionid: data.divisionid || 1,
                    Type: 2 // Ready for update
                });

                setEditId(data.Id); // Set edit ID

            } else {
                toast.error("Failed to fetch record for editing.");
            }
        } catch (error) {
            console.error("Error fetching record by ID:", error);
            toast.error("Error fetching data.");
        }
    };



    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    const fetchZonesData = async () => {
        try {
            // Fetch AssetLocation data
            const assetResponse = await api.post(`AssetLocation`, {
                Id: "",
                Asset_Id: "",
                Location_Id: "",
                Description: "",
                Asset_Type: "",
                Location_Date: defaultValues,
                Inst_Id: "",
                User_Id: "",
                divisionid: "",
                Type: 4
            });

            const assetData = assetResponse.data.data;

            // Fetch ResourceDetail data
            const resourceResponse = await api.post(`ResourceDetail`, { Type: 4 });
            const resourceData = resourceResponse.data.data;

            // Create a mapping of Asset_Id to formatted ResourceCode
            const resourceMap = new Map(
                resourceData.map((r: any) => [
                    r.ID,
                    `${r.ResourceCode} (${r.ResourceName || r.ResType || ""})`
                ])
            );

            // Map AssetLocation data and replace Asset_Id with formatted ResourceCode
            const assetsWithNames = assetData.map((asset: any, index: any) => ({
                ...asset,
                serialNo: index + 1,
                id: asset.Id,
                AssetCode: resourceMap.get(parseInt(asset.Asset_Id)) || "Unknown", // Get formatted AssetCode from map
            }));

            setZones(assetsWithNames);
            setIsLoading(false);

            if (assetData.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 150,
                        renderCell: (params) => (
                            <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
                                <EditIcon
                                    style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                                    onClick={() => routeChangeEdit(params.row)}
                                />
                            </Stack>
                        ),
                    },
                    { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
                    { field: "AssetCode", headerName: t("text.AssetCode"), flex: 1 }, // Updated to show formatted AssetCode
                    { field: "Description", headerName: t("text.Description"), flex: 1 },
                ];
                setColumns(columns as any);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching Asset data.");
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
                                {t("text.AssetLocation")}
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
                                    id="asset-code-dropdown"
                                    options={assetCodeOptions}
                                    fullWidth
                                    size="small"
                                    value={assetCodeOptions.find((option: any) => option.value === parseInt(formik.values.Asset_Id)) || null}
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("Asset_Id", newValue?.value || "");
                                        formik.setFieldValue("Asset_Type", newValue?.Status_ID || ""); // Optional if required
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectAssetcode")}
                                                required={true}
                                            />}
                                        />
                                    )}
                                />
                                {formik.touched.Asset_Id && formik.errors.Asset_Id ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Asset_Id}
                                    </div>
                                ) : null}


                            </Grid>



                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={<CustomLabel text={t("text.SelectDate")} required={true} />}
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="Location_Date"
                                    value={formik.values.Location_Date}
                                    onChange={(e) => formik.setFieldValue("Location_Date", e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />




                            </Grid>





                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="location-dropdown"
                                    options={locationOption}
                                    fullWidth
                                    size="small"
                                    value={locationOption.find((o: any) => o.value == formik.values.Location_Id) || null}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("Location_Id", newValue?.value || "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.SelectLocationforAsset")} required={true} />}
                                        />
                                    )}
                                />
                                {formik.touched.Location_Id && formik.errors.Location_Id ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Location_Id}
                                    </div>
                                ) : null}


                            </Grid>

                            <Grid item xs={12} sm={12} lg={12}>
                                <TranslateTextField
                                    label={t("text.EnterDescription")}
                                    value={formik.values.Description}
                                    onChangeText={(text) => formik.setFieldValue("Description", text)}
                                    required={false}
                                    lang={lang}
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
                        rows={zones}
                        columns={adjustedColumns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialPageSize={5}
                    />
                </Paper>
            </Card>
            <ToastApp />
        </>
    );
}
