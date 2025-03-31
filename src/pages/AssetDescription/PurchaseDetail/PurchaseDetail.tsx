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
export default function PurchaseDetail() {

    const { t } = useTranslation();
    const UserId = getId();
    const [isChecked, setIsChecked] = useState(false);
    const CanBeUsedOption = [

        { value: "1", label: "yes" },
        { value: "2", label: "No" },
    ];
    const { defaultValues } = getISTDate();
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
    const [lang, setLang] = useState<Language>("en");
    let navigate = useNavigate();

    const [isStateCode, setIsStateCode] = useState(false);


    const [employeeOptions, setEmployeeOptions] = useState([]);
    useEffect(() => {


        fetchAssetCode();
        fetchZonesData();
        fetchEmployeeDetail();
    }, []);

    const [assetCodeOptions, setAssetCodeOptions] = useState([]);

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
                    return {
                        label: fullName, // for showing in dropdown
                        value: fullName, // store full name
                    };
                });
                setEmployeeOptions(employeeList);
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


            "id_Purchase": 0,
            "BillNo": "",
            "Date": defaultValues,
            "Amount": "",
            "DepValue": "",
            "Manufacture": "",
            "Supplier": "",
            "inst": "0",
            "ses": "0",
            "PurchaseAttachment": "",
            "resid": null,
            "PurchaseDetailContent": "",
            "user_id": 0,
            "depon": defaultValues,
            "divisionid": 0,
            "FileAttachmentNew": "",
            "LastAttachIn": "",
            "Type": 0

        },
        validationSchema: Yup.object({
            BillNo: Yup.string()
                .required(t("text.reqBillNo")),
            Manufacture: Yup.string()
                .required(t("text.reqManufacture")),

            Supplier: Yup.string()
                .required(t("text.reqSupplier")),
            resid: Yup.string()
                .required(t("text.reqasset")),
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                // ✅ Ensure base64 is plain before API
                //  const cleanBase64 = values.PurchaseDetailContent.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');

                const finalValues = {
                    ...values,
                    //PurchaseDetailContent: cleanBase64, // ✅ Send as plain base64
                    //  id_Purchase: editId !== 0 ? parseInt(editId.toString(), 10) : -1,
                    Type: editId !== 0 ? 2 : 1,
                    user_id: UserId,
                };


                console.log("Submitting to API:", finalValues); // Debugging purpose

                const response = await api.post(`PurchaseDetail`, finalValues);

                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchZonesData(); // Refresh the data grid
                    resetForm(); // Reset the form after submission
                    setEditId(0); // Reset edit mode
                    setModalImg(""); // Clear preview image
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Failed to save data.");
            }
        },

    });

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    const handlePanClose = () => {
        setOpen(false);
    };

    const modalOpenHandle = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,";

        let imageData = '';
        switch (event) {
            case "PurchaseDetailContent":
                imageData = formik.values.PurchaseDetailContent;
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

    const routeChangeEdit = async (row: any) => {
        try {
            const response = await api.post("PurchaseDetail", {
                id_Purchase: row.id,
                Type: 3,
                "PurchaseDetailContent": "any",
            });

            if (response.data.success && response.data.data.length > 0) {
                const editData = response.data.data[0];

                formik.setFieldValue("id_Purchase", editData.id_Purchase || 0);
                formik.setFieldValue("BillNo", editData.BillNo || "");
                formik.setFieldValue("Date", editData.Date ? editData.Date.split("T")[0] : "");
                formik.setFieldValue("Amount", editData.Amount || "");
                formik.setFieldValue("DepValue", editData.DepValue || "");
                formik.setFieldValue("Manufacture", editData.Manufacture || "");
                formik.setFieldValue("Supplier", editData.Supplier || "");
                formik.setFieldValue("resid", editData.resid || 0);
                formik.setFieldValue("depon", editData.depon ? editData.depon.split("T")[0] : "");
                formik.setFieldValue("PurchaseDetailContent", bufferToBase64(editData.PurchaseDetailContent));

                formik.setFieldValue("divisionid", editData.divisionid || 0);
                formik.setFieldValue("FileAttachmentNew", editData.FileAttachmentNew || "");
                formik.setFieldValue("LastAttachIn", editData.LastAttachIn || "");

                // ✅ Set PurchaseAttachment as plain base64 (for API submission)
                formik.setFieldValue("PurchaseAttachment", editData.PurchaseAttachment || "");

                // ✅ Set preview image with prefix for display only
                // setModalImg(
                //     editData.PurchaseAttachment
                //         ? `data:image/jpeg;base64,${editData.PurchaseAttachment}`
                //         : ""
                // );

                setEditId(editData.id_Purchase);
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



    function formatDate(dateString: string) {
        const timestamp = Date.parse(dateString);
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    const fetchZonesData = async () => {
        try {
            const collectData = {
                "Type": 4,
                "PurchaseDetailContent": "any",
            };
            const response = await api.post(`PurchaseDetail`, collectData);
            const data = response.data.data;
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.Prchase_ID,
                Date: formatDate(zone.Date),
                depon: formatDate(zone.depon),
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        flex: 0.5,

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
                        field: "BillNo",
                        headerName: t("text.BillNo"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "Date",
                        headerName: t("text.Date"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    // {
                    //     field: "depon",
                    //     headerName: t("text.DepreciationDate"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    {
                        field: "Amount",
                        headerName: t("text.Amount"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "DepValue",
                        headerName: t("text.DepreciatedValue"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "Manufacture",
                        headerName: t("text.Manufacturer"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "Supplier",
                        headerName: t("text.Supplier"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    //   ...(isStateCode ? [

                    // ] : []),
                    //   {
                    //     field: "countryName",
                    //     headerName: t("text.CountryName"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    //   },
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
                                {t("text.PurchaseDetail")}
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
                                        formik.setFieldValue("AssetCode", newValue?.ResourceCode || "");
                                        formik.setFieldValue("resid", newValue?.value || 0); // Store Resource ID
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


                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterBillNo")}
                                    value={formik.values.BillNo}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("BillNo", text)
                                    }
                                    required={true}
                                    lang={lang}
                                />

                                {formik.touched.BillNo && formik.errors.BillNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.BillNo}
                                    </div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.SelectPurchaseDate")}
                                            required={true}
                                        />
                                    }
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="Date"
                                    id="Date"
                                    value={formik.values.Date || ""}
                                    placeholder={t("text.SelectPurchaseDate")}
                                    onChange={(e) => {
                                        formik.setFieldValue("Date", e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                {formik.touched.Date && formik.errors.Date ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Date}
                                    </div>
                                ) : null}
                            </Grid>

                            {/* to date  */}
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.DepreciationasonDate")}
                                            required={true}
                                        />
                                    }
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="depon"
                                    id="depon"
                                    value={formik.values.depon || ""}
                                    placeholder={t("text.DepreciationasonDate")}
                                    onChange={(e) => {
                                        formik.setFieldValue("depon", e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                {formik.touched.depon && formik.errors.depon ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.depon}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterAmount")}
                                    value={formik.values.Amount}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("Amount", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />

                                {/* {formik.touched.Amount && formik.errors.Amount ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Amount}
                                    </div>
                                ) : null} */}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterDepreciatedValue")}
                                    value={formik.values.DepValue}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("DepValue", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />

                                {/* {formik.touched.DepValue && formik.errors.DepValue ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.DepValue}
                                    </div>
                                ) : null} */}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterManufacturer")}
                                    value={formik.values.Manufacture}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("Manufacture", text)
                                    }
                                    required={true}
                                    lang={lang}
                                />

                                {formik.touched.Manufacture && formik.errors.Manufacture ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Manufacture}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="Supplier"
                                    options={employeeOptions}
                                    fullWidth
                                    size="small"
                                    value={
                                        employeeOptions.find((option: any) => option.value === formik.values.Supplier) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("Supplier", newValue?.value || ""); // store name
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectSupplier")}
                                                    required={true}
                                                // required={requiredFields.includes("UndrProcession_27")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.Supplier && formik.errors.Supplier ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Supplier}
                                    </div>
                                ) : null}



                            </Grid>
                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option}
                                    fullWidth
                                    size="small"
                                    value={
                                        option.find(
                                            (option: any) => option.value === formik.values.Supplier
                                        ) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue);

                                        formik.setFieldValue("Supplier", newValue?.value || ""); // store value (correct)


                                        // formik.setFieldTouched("zoneID", true);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectSupplier")}
                                                //  required={requiredFields.includes("Supplier")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.Supplier && formik.errors.Supplier ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.Supplier}
                                    </div>
                                ) : null}
                            </Grid> */}

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
                                        label={<CustomLabel text={t("text.AttachedImage")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => handleFileChange(e, "PurchaseDetailContent")}

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
                                        {formik.values.PurchaseDetailContent === "" ? (
                                            <img src={nopdf} style={{ width: 150, height: 100, border: "1px solid grey", borderRadius: 10 }} />
                                        ) : (
                                            <img
                                                src={`data:image/jpg;base64,${formik.values.PurchaseDetailContent}`} // ✅ Use PurchaseDetailContent
                                                style={{ width: 150, height: 100, border: "1px solid grey", borderRadius: 10, padding: "2px" }}
                                            />
                                        )}


                                        <Typography
                                            onClick={() => modalOpenHandle("PurchaseDetailContent")}

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
                                <Modal open={Opens} onClose={handlePanClose}>
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
                                                {t("text.Attachment")}
                                            </strong>
                                        }
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e: any) => otherDocChangeHandler(e, "PurchaseAttachment")}
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
                                    {formik.values.PurchaseAttachment ? (
                                        <img
                                            src={formik.values.PurchaseAttachment}
                                            alt="Purchase Document Preview"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                border: "1px solid grey",
                                                borderRadius: 10,
                                                padding: "2px",
                                                objectFit: "cover",
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
                                        onClick={() => modalOpenHandle("PurchaseAttachment")}
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


                                <Modal open={panOpens} onClose={handlePanClose}>
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
