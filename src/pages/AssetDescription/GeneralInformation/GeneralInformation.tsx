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
export default function GeneralInformation() {
    const { t } = useTranslation();
    const UserId = getId();
    const [isChecked, setIsChecked] = useState(false);
    const [assetCodeOptions, setAssetCodeOptions] = useState([]);
    const CanBeUsedOption = [

        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    const { defaultValuestime } = getISTDate();
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [editId, setEditId] = useState(0);
    const [option, setOption] = useState([
        { value: "-1", label: t("text.SelectCountryName") },
    ]);
    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const [reportedByType, setReportedByType] = useState(""); // To store selected reportedby value
    const [studentList, setStudentList] = useState([]); // Student dropdown options
    const [staffList, setStaffList] = useState([]); // Staff dropdown options
    const [visitorList, setVisitorList] = useState([]); // Visitor dropdown options
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [lang, setLang] = useState<Language>("en");
    let navigate = useNavigate();

    const [isStateCode, setIsStateCode] = useState(false);



    useEffect(() => {
        fetchZonesData();
        fetchAssetCode();
        fetchEmployeeDetail();
    }, []);

    const bufferToBase64 = (bufferObj: any) => {
        if (!bufferObj) return "";

        if (!bufferObj.data || !Array.isArray(bufferObj.data) || bufferObj.data.length === 0) {
            console.warn("Invalid or empty buffer object provided.");
            return "";
        }

        try {
            const uint8Array: any = new Uint8Array(bufferObj.data);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            return base64String;
        } catch (error) {
            console.error("Error converting buffer to Base64:", error);
            return "";
        }
    };


    const handleFileChange = (event: any, fieldName: string) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg'].includes(fileExtension || '')) {
            alert("Only .jpg image file is allowed to be uploaded.");
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const base64String = e.target?.result as string;
            const base64Data = base64String.split(',')[1]; // Extract Base64 part without prefix
            formik.setFieldValue(fieldName, base64Data); // Store clean base64
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file); // Read file as Data URL
    };

    const fetchEmployeeDetail = async () => {
        try {
            const response = await api.post("EmployeeDetail", {
                "Emp_id_1": -1,
                "EmpImage_38": "any",
                "empsign": "any",
                "EmployeeThumb": "any",
                "ThumbTemplate": "any",
                "ThumbTemplate2": "any",
                "EmployeeThumb2": "any",
                "ThumbTemplate3": "any",
                "ThumbTemplate4": "any",
                "Type": 4
            });

            if (response.data.success && response.data.data.length > 0) {
                const employeeList = response.data.data.map((emp: any) => {
                    const fullName = `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname}`.replace(/\s+/g, ' ').trim();
                    const fullDisplay = `${fullName} (${emp.Emp_Personal_code})`; // 👈 Add code in bracket
                    return {
                        label: fullDisplay, // What will be shown in dropdown
                        value: fullDisplay  // What will be stored in formik
                    };
                });
                setEmployeeOptions(employeeList); // Set for Autocomplete
            } else {
                toast.warn("No employee data found.");
            }
        } catch (error) {
            console.error("Error fetching employee details:", error);
            toast.error("Failed to fetch employee details.");
        }
    };

    const fetchAssetCode = async () => {
        try {
            const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
            if (response.data.success && response.data.data.length > 0) {
                const assetList = response.data.data.map((item: any) => ({
                    label: `${item.ResourceName} (${item.ResourceCode})`, // Display Name + Code
                    value: item.ID, // Resource ID (for resid)
                    ResourceCode: item.ResourceCode, // Optional if needed elsewhere
                    ResourceName: item.ResourceName // Optional if needed elsewhere
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




    // const validationSchema = Yup.object({
    //     countryId: Yup.string().test(
    //         "required",
    //         t("text.reqcountryName"),
    //         function (value: any) {
    //             return value && value.trim() !== "";
    //         }
    //     ),
    //     stateName: Yup.string().test(
    //         "required",
    //         t("text.reqstateName"),
    //         function (value: any) {
    //             return value && value.trim() !== "";
    //         }
    //     ),
    // });

    const formik = useFormik({
        initialValues: {
            id_GenInfo: "-1",
            Issued_25: "",
            Capacity_26: "",
            UndrProcession_27: "",
            AdministrdBy_28: "",
            status: "",
            UserMannualAttach: "",
            MaintenanceAttach: "",
            inst: "1",
            ses: "",
            resid: null,
            "UserMannualFileContent": "",
            "MaintenanceFileContent": "",
            repairable: "",
            user_id: 1,
            divisionid: 1,
            "UserManualAttachnew": "dg",
            "MaintenanceAttachnew": "dfg",
            LastAttachIn: "",
            CurrEval: "",
            MarketVal: "",
            currEvdate: "",
            marketvdate: "",
            usepurpose: "",
            constructpercentage: "",
            developedby: "",
            areasqft: 0,
            Unit: "",
            assetcat: 0,
            Buliding: "",
            Flour: "",
            Room: "",
            Type: 1,
        },
        validationSchema: Yup.object({
            // itemId: Yup.string()
            //   .required(t("text.reqVehNum")),
            AdministrdBy_28: Yup.string()
                .required(t("text.reqAdministrdBy_28")),
            Issued_25: Yup.string()
                .required(t("text.reqIssued_25")),
            UndrProcession_27: Yup.string()
                .required(t("text.reqUndrProcession_27")),
            resid: Yup.string()
                .required(t("text.reqasset")),
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                const finalValues = {
                    ...values,
                    Capacity_26: parseInt(values.Capacity_26 as string, 10) || 0, // Convert to int
                    Type: editId !== 0 ? 2 : 1, // 2 for update, 1 for insert
                };

                console.log("Submitting to API: ", finalValues);

                const response = await api.post('manageResourceDeGeneralInfo', finalValues);

                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchZonesData();
                    resetForm();
                    setEditId(0); // Reset to insert mode
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to save data.');
            }
        },



    });

    // const requiredFields = ["stateName", "countryId"];

    const routeChangeEdit = async (row: any) => {
        try {
            const response = await api.post("manageResourceDeGeneralInfo", {
                id_GenInfo: row.id, // Correctly passing ID
                Type: 3, // Fetch specific record
                "UserMannualFileContent": "any",
                "MaintenanceFileContent": "any",
            });

            if (response.data.success && response.data.data.length > 0) {
                const editData = response.data.data[0]; // First record

                // Correct field mapping based on API response
                formik.setFieldValue("id_GenInfo", editData.Gen_ID);
                formik.setFieldValue("Capacity_26", editData.Capacity?.toString() || ""); // Handle null with empty string
                formik.setFieldValue("UndrProcession_27", editData.UndrProcession || ""); // Name as string
                formik.setFieldValue("AdministrdBy_28", editData.AdministrdBy || ""); // Name as string
                formik.setFieldValue("repairable", editData.repairable || "");
                formik.setFieldValue("resid", editData.resid || 0);
                formik.setFieldValue("UserMannualAttach", editData.UserMannualAttach || "");
                formik.setFieldValue("MaintenanceAttach", editData.MaintenanceAttach || "");
                formik.setFieldValue("UserManualAttachnew", editData.UserManualAttachnew || "");
                formik.setFieldValue("MaintenanceAttachnew", editData.MaintenanceAttachnew || "");
                formik.setFieldValue("MaintenanceFileContent", bufferToBase64(editData.MaintenanceFileContent) || "");
                formik.setFieldValue("UserMannualFileContent", bufferToBase64(editData.UserMannualFileContent) || "");
                formik.setFieldValue("Issued_25", editData.Issued || "");
                formik.setFieldValue("divisionid", editData.divisionid || 0);
                formik.setFieldValue("LastAttachIn", editData.LastAttachIn || "");
                formik.setFieldValue("CurrEval", editData.CurrEval || "");
                formik.setFieldValue("MarketVal", editData.MarketVal || "");
                formik.setFieldValue("currEvdate", editData.currEvdate || "");
                formik.setFieldValue("marketvdate", editData.marketvdate || "");
                formik.setFieldValue("constructpercentage", editData.constructpercentage || "");
                formik.setFieldValue("developedby", editData.developedby || "");
                formik.setFieldValue("areasqft", editData.areasqft || 0);
                formik.setFieldValue("Unit", editData.Unit || "");
                formik.setFieldValue("assetcat", editData.assetcat || 0);
                formik.setFieldValue("Buliding", editData.Buliding || "");
                formik.setFieldValue("Flour", editData.Flour || "");
                formik.setFieldValue("Room", editData.Room || "");

                setEditId(editData.Gen_ID); // Set edit mode
                console.log("image" + formik.values.MaintenanceFileContent)
            } else {
                toast.warn("No data found for editing.");
            }
        } catch (error) {
            console.error("Failed to fetch data for editing:", error);
            toast.error("Failed to fetch data for editing.");
        }
    };



    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    const handlePanClose1 = () => {
        setOpen(false);
    };

    const modalOpenHandle1 = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,";

        let imageData = '';
        switch (event) {
            case "MaintenanceFileContent":
                imageData = formik.values.MaintenanceFileContent;
                break;
            case "UserMannualFileContent":
                imageData = formik.values.UserMannualFileContent;
                break;
        }

        if (imageData) {
            console.log("imageData", base64Prefix + imageData);
            setImg(base64Prefix + imageData);
        } else {
            setImg('');
        }
    };

    const otherDocChangeHandler = (event: any, params: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg'].includes(fileExtension || '')) {
            alert("Only .jpg image file is allowed to be uploaded.");
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const base64String = e.target?.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = base64String.split(',')[1];
            formik.setFieldValue(params, base64Data);
            console.log(`File '${file.name}' loaded as base64 string`);
            console.log("base64Data", base64Data);
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
    };

    const fetchZonesData = async () => {
        try {
            const collectData = {
                "UserMannualFileContent": "any",
                "MaintenanceFileContent": "any",

                "Type": 4
            };
            const response = await api.post(`manageResourceDeGeneralInfo`, collectData);
            const data = response.data.data;
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.Gen_ID,
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 150,

                        renderCell: (params) => {
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

                                </Stack>,
                            ];
                        },
                    },


                    {
                        field: "UndrProcession",
                        headerName: t("text.UnderPossessionOf"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    //   ...(isStateCode ? [
                    {
                        field: "AdministrdBy",
                        headerName: t("text.AdministeredBy"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    // ] : []),
                    {
                        field: "Capacity",
                        headerName: t("text.Capacity"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                ];
                setColumns(columns as any);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // setLoading(false);
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
                                {t("text.GeneralInformation")}
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
                                    value={
                                        assetCodeOptions.find((option: any) => option.value === formik.values.resid) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        console.log("Selected Value: ", newValue);
                                        formik.setFieldValue("resid", newValue?.value || 0); // Store ID as resid
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
                                {formik.touched.resid && formik.errors.resid ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.resid}
                                    </div>
                                ) : null}


                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="can-be-used-dropdown"
                                    options={CanBeUsedOption}
                                    fullWidth
                                    size="small"
                                    value={
                                        CanBeUsedOption.find((option: any) => option.value === formik.values.Issued_25) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("Issued_25", newValue?.value || ""); // store value
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.CanBeissued")} required={true} />}
                                        />
                                    )}
                                />
                                {formik.touched.Issued_25 && formik.errors.Issued_25 ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Issued_25}
                                    </div>
                                ) : null}

                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterCapacity")}
                                    value={formik.values.Capacity_26.toString()} // keep as string for input
                                    onChangeText={(text: any) =>
                                        formik.setFieldValue("Capacity_26", text) // store as string
                                    }
                                    required={false}
                                    lang={lang}
                                />



                                {/* {formik.touched.Capacity_26 && formik.errors.Capacity_26 ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Capacity_26}
                                    </div>
                                ) : null} */}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="under-possession-dropdown"
                                    options={employeeOptions}
                                    fullWidth
                                    size="small"
                                    value={
                                        employeeOptions.find((option: any) => option.value === formik.values.UndrProcession_27) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("UndrProcession_27", newValue?.value || ""); // store name
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.UnderPossessionOf")}
                                                    required={true}

                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.UndrProcession_27 && formik.errors.UndrProcession_27 ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.UndrProcession_27}
                                    </div>
                                ) : null}



                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="administered-by-dropdown"
                                    options={employeeOptions}
                                    fullWidth
                                    size="small"
                                    value={
                                        employeeOptions.find((option: any) => option.value === formik.values.AdministrdBy_28) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("AdministrdBy_28", newValue?.value || ""); // store name
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.AdministeredBy")}
                                                    required={true}
                                                //required={requiredFields.includes("countryName")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.AdministrdBy_28 && formik.errors.AdministrdBy_28 ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.AdministrdBy_28}
                                    </div>
                                ) : null}


                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>




                                <FormControl component="fieldset">

                                    <FormLabel component="legend" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                                        {t("text.Reparable")}
                                    </FormLabel>


                                    <RadioGroup
                                        row
                                        aria-label="type"
                                        name="type"
                                        value={formik.values.repairable}
                                        onChange={(event) => formik.setFieldValue("repairable", event.target.value)}
                                    >
                                        <FormControlLabel
                                            value="Y"
                                            control={<Radio color="primary" />}
                                            label={t("text.Yes")}

                                        />
                                        <FormControlLabel
                                            value="N"
                                            control={<Radio color="primary" />}
                                            label={t("text.No")}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>


                            <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={<CustomLabel text={t("text.MaintenanceManualAttachment")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => handleFileChange(e, "MaintenanceFileContent")}
                                    />

                                </Grid>
                                <Grid xs={12} md={4} sm={4} item></Grid>

                                <Grid xs={12} md={4} sm={4} item>
                                    <Grid
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        {formik.values.MaintenanceFileContent === "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`data:image/jpg;base64,${formik.values.MaintenanceFileContent}`}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        )}

                                        <Typography
                                            onClick={() => modalOpenHandle1("MaintenanceFileContent")}
                                            style={{
                                                textDecorationColor: "blue",
                                                textDecorationLine: "underline",
                                                color: "blue",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {t("text.Preview")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Modal open={Opens} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                alt="preview image"
                                                src={Img}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Modal>
                            </Grid>



                            <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={<CustomLabel text={t("text.UserManualAttachment")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "UserMannualFileContent")}
                                    />
                                </Grid>
                                <Grid xs={12} md={4} sm={4} item></Grid>

                                <Grid xs={12} md={4} sm={4} item>
                                    <Grid
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        {formik.values.UserMannualFileContent == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`data:image/jpg;base64,${formik.values.UserMannualFileContent}`}
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        )}
                                        <Typography
                                            onClick={() => modalOpenHandle1("UserMannualFileContent")}
                                            style={{
                                                textDecorationColor: "blue",
                                                textDecorationLine: "underline",
                                                color: "blue",
                                                fontSize: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {t("text.Preview")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Modal open={Opens} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img == "" ? (
                                            <img
                                                src={nopdf}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                alt="preview image"
                                                src={Img}
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Modal>
                            </Grid>


                            {/* <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={
                                            <strong style={{ color: "#000" }}>
                                                {t("text.UserManualAttachment")}
                                            </strong>
                                        }
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => otherDocChangeHandler(e, "attachment")}
                                    />
                                </Grid>

                                <Grid xs={12} md={4} sm={4} item></Grid>
                                <Grid
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        margin: "10px",
                                    }}
                                >
                                    {formik.values.UserMannualFileContent ? (
                                        <img
                                            src={
                                                /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.UserMannualFileContent)
                                                    ? formik.values.UserMannualFileContent
                                                    : `data:image/jpeg;base64,${formik.values.UserMannualFileContent}`
                                            }
                                            alt=" Document Preview"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                                padding: "2px",
                                                objectFit: "cover",  // Ensures proper scaling
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={nopdf}
                                            alt="No document available"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                            }}
                                        />
                                    )}

                                    <Typography
                                        onClick={() => modalOpenHandle1("attachment")}
                                        style={{
                                            textDecorationColor: "blue",
                                            textDecorationLine: "underline",
                                            color: "blue",
                                            fontSize: "15px",
                                            cursor: "pointer",
                                            padding: "20px",
                                        }}
                                        role="button"
                                        aria-label="Preview Document"
                                    >
                                        {t("text.Preview")}
                                    </Typography>
                                </Grid>


                                <Modal open={panOpens} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img ? (
                                            <img
                                                src={Img}
                                                alt="Preview"
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <Typography>No Image to Preview</Typography>
                                        )}
                                    </Box>
                                </Modal>
                            </Grid> */}
                            {/* <Grid container spacing={1} item>
                                <Grid
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    item
                                    style={{ marginBottom: "30px", marginTop: "30px" }}
                                >
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        InputLabelProps={{ shrink: true }}
                                        label={
                                            <strong style={{ color: "#000" }}>
                                                {t("text.MaintenanceManualAttachment")}
                                            </strong>
                                        }
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => otherDocChangeHandler(e, "attachment")}
                                    />
                                </Grid>

                                <Grid xs={12} md={4} sm={4} item></Grid>
                                <Grid
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        margin: "10px",
                                    }}
                                >
                                    {formik.values.MaintenanceFileContent ? (
                                        <img
                                            src={
                                                /^(data:image\/(jpeg|jpg|png);base64,)/.test(formik.values.MaintenanceFileContent)
                                                    ? formik.values.MaintenanceFileContent
                                                    : `data:image/jpeg;base64,${formik.values.MaintenanceFileContent}`
                                            }
                                            alt="Document Preview"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                                padding: "2px",
                                                objectFit: "cover",  // Ensures proper scaling
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={nopdf}
                                            alt="No document available"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                            }}
                                        />
                                    )}

                                    <Typography
                                        onClick={() => modalOpenHandle1("attachment")}
                                        style={{
                                            textDecorationColor: "blue",
                                            textDecorationLine: "underline",
                                            color: "blue",
                                            fontSize: "15px",
                                            cursor: "pointer",
                                            padding: "20px",
                                        }}
                                        role="button"
                                        aria-label="Preview Document"
                                    >
                                        {t("text.Preview")}
                                    </Typography>
                                </Grid>


                                <Modal open={panOpens} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {Img ? (
                                            <img
                                                src={Img}
                                                alt="Preview"
                                                style={{
                                                    width: "170vh",
                                                    height: "75vh",
                                                    borderRadius: 10,
                                                }}
                                            />
                                        ) : (
                                            <Typography>No Image to Preview</Typography>
                                        )}
                                    </Box>
                                </Modal>
                            </Grid> */}

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
