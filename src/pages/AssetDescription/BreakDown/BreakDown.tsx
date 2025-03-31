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
export default function BreakDown() {
    const { t } = useTranslation();
    const UserId = getId();
    const [isChecked, setIsChecked] = useState(false);
    const CanBeUsedOption = [

        { value: "1", label: "yes" },
        { value: "2", label: "No" },
    ];
    const [reportedByType, setReportedByType] = useState(""); // To store selected reportedby value
    const [studentList, setStudentList] = useState([]); // Student dropdown options
    const [staffList, setStaffList] = useState([]); // Staff dropdown options
    const [visitorList, setVisitorList] = useState([]); // Visitor dropdown options

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
    const [assetCodeOptions, setAssetCodeOptions] = useState([]);
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const [lang, setLang] = useState<Language>("en");
    let navigate = useNavigate();
    const { defaultValues } = getISTDate();
    const [isStateCode, setIsStateCode] = useState(false);



    useEffect(() => {
        getBreakDownList();
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await api.post("ResourceDetail", { Type: 4, Status_ID: -1 });
            if (response.data.success) {
                setAssetCodeOptions(
                    response.data.data.map((item: any) => ({
                        label: `${item.ResourceCode} (${item.ResourceName})`, // Display ResourceCode - ResourceName
                        value: item.ID, // ID used as resid
                    }))
                );
            } else {
                toast.warn("No assets found.");
            }
        } catch (error) {
            toast.error("Failed to load assets.");
        }
    };


    const fetchEmployeeDetail = async (type: any) => {
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
                // Prepare dropdown list with employee names
                const employeeList = response.data.data.map((emp: any) => ({
                    label: `${emp.Emp_firstname} ${emp.Emp_middlename} ${emp.Emp_lastname} (${emp.Emp_Personal_code})`.replace(/\s+/g, ' ').trim(),
                    value: emp.Emp_id
                }));

                // Set list according to type
                // if (type === "Student") {
                //     setStudentList(employeeList);
                // } else
                if (type === "Staff") {
                    setStaffList(employeeList);
                }
            } else {
                toast.warn("No employee data found.");
            }
        } catch (error) {
            console.error("Error fetching employee detail:", error);
            toast.error("Failed to fetch employee details.");
        }
    };

    const getStudentList = async () => {
        try {
            const response = await api.post("Student_Details"); // API call without parameters

            if (response.data.success) {
                // Map response to dropdown format
                const students: any = Object.values(response.data.data).map((student: any) => ({
                    label: `${student.first_name} ${student.lname} (${student.Enrollment})`, // Display full name + Enrollment
                    value: student.Scholar_id, // Store Scholar ID
                }));

                setStudentList(students); // Set student dropdown options
            } else {
                toast.warn("No student data found.");
            }
        } catch (error) {
            console.error("Error fetching student details:", error);
            toast.error("Failed to fetch student details.");
        }
    };



    const getVisitorList = async () => {
        const response = await api.post("Visitor_information", { img1: "any", Type: 4 });
        if (response.data.success) {
            const visitors = response.data.data.map((item: any) => ({
                label: `${item.F_name} ${item.M_name} ${item.L_name}`.replace(/\s+/g, ' ').trim(),
                value: item.Visitor_id,
            }));
            setVisitorList(visitors);
        }
    };



    const validationSchema = Yup.object({
        BreakDownRemark: Yup.string().test(
            "required",
            t("text.reqremark"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        resid: Yup.string().test(
            "required",
            t("text.reqasset"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        ReportedBy: Yup.string().test(
            "required",
            t("text.reqreportedby"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });
    const requiredFields = ["ReportedBy", "resid", "BreakDownRemark", "BDdate"];
    // const requiredFields = ["resid"];
    // const requiredFields = ["BreakDownRemark"];
    // const requiredFields = ["BDdate"];
    const formik = useFormik({
        initialValues: {
            "BDdate": defaultValues,
            "id_BD": "",
            "ReportedBy": "",
            "BreakDownRemark": "",
            "BreakDownName": "",
            "inst": "",
            "ses": "",
            "resid": "",
            "Type": 0
        },
        validationSchema: validationSchema,
        // validationSchema: Yup.object({
        //     BDdate: Yup.string().required(t("text.SelectDate")),

        // }),
        onSubmit: async (values) => {
            const collectData = {
                BDdate: values.BDdate,
                id_BD: editId === 0 ? "-1" : editId.toString(), // "-1" for add, else ID for update
                ReportedBy: values.ReportedBy,
                BreakDownRemark: values.BreakDownRemark,
                BreakDownName: values.BreakDownName,
                inst: values.inst,
                ses: values.ses,
                resid: values.resid,
                Type: editId === 0 ? 1 : 2 // Dynamic Type
            };

            try {
                const response = await api.post("manageBreakDown", collectData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    getBreakDownList(); // Refresh list
                    formik.resetForm(); // Clear form
                    setEditId(0);       // Reset edit mode
                    setReportedByType(""); // Clear ReportedBy type
                } else {
                    toast.error("Failed to save Breakdown details.");
                }
            } catch (error) {
                console.error("Error saving Breakdown:", error);
                toast.error("Error while saving Breakdown.");
            }
        }

    });


    // const requiredFields = ["stateName", "countryId"];

    const routeChangeEdit = (row: any) => {
        formik.setValues({
            BDdate: row.BreakDownDate,
            id_BD: row.id,
            ReportedBy: row.ReportedBy,
            BreakDownRemark: row.BreakDownRemark,
            BreakDownName: row.Name, // internal
            inst: row.inst_id?.toString() || "",
            ses: row.sid?.toString() || "",
            resid: row.resid?.toString() || "", // string for formik
            Type: 2,
        });

        setReportedByType(row.ReportedBy); // To show correct dropdown

        // Load dropdowns dynamically
        if (row.ReportedBy === "Student" || row.ReportedBy === "Staff") {
            fetchEmployeeDetail(row.ReportedBy); // Fetch employee list
        } else if (row.ReportedBy === "Visitor") {
            getVisitorList(); // For visitor
        }

        setEditId(row.id); // Set edit mode
    };



    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };
    const getBreakDownList = async () => {
        const collectData = {
            Type: 4,
        };

        setIsLoading(true); // Start loader

        try {
            const response = await api.post("manageBreakDown", collectData);
            console.log("API Response:", response); // Debug log to check

            if (response?.data?.success && Array.isArray(response.data.data)) {
                const breakdownData = response.data.data.map((item: any, index: number) => ({
                    id: item.BD_ID,
                    serialNo: index + 1,
                    BreakDownDate: item.BreakDownDate?.split("T")[0] || "", // handle empty case
                    ReportedBy: item.ReportedBy,
                    BreakDownRemark: item.BreakDownRemark,
                    Name: item.Name,
                    inst_id: item.inst_id,
                    sid: item.sid,
                    resid: item.resid,
                }));

                setZones(breakdownData); // Set data rows safely

                // Set columns only once or dynamically if needed
                const breakDownColumns: GridColDef[] = [
                    {
                        field: 'actions',
                        headerName: t("text.Action"),
                        flex: 0.5,
                        renderCell: (params) => (
                            <Stack spacing={1} direction="row" sx={{ alignItems: "center", marginTop: "5px" }}>
                                <EditIcon
                                    style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                                    onClick={() => routeChangeEdit(params.row)} // Edit handler
                                />

                            </Stack>
                        ),
                    },
                    {
                        field: "Name",
                        headerName: t("text.Name"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                    //   ...(isStateCode ? [
                    {
                        field: "BreakDownDate",
                        headerName: t("text.Date"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    // ] : []),
                    {
                        field: "ReportedBy",
                        headerName: t("text.ReportedBy"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "BreakDownRemark",
                        headerName: t("text.RemarkName"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    // { field: 'serialNo', headerName: 'Sr No', flex:0.5},
                    // { field: 'Name', headerName: 'Name', flex: 1 },
                    // { field: 'BreakDownDate', headerName: 'Date', flex: 0.6 },
                    // { field: 'ReportedBy', headerName: 'Reported By', flex: 0.7 },
                    // { field: 'BreakDownRemark', headerName: 'Remark', flex: 0.7 },

                ];
                setColumns(breakDownColumns); // Set column data

            } else {
                toast.info("No breakdown data found.");
                setZones([]); // Clear data grid
            }

        } catch (error) {
            console.error("Error fetching breakdown data:", error);
            toast.error("Error fetching breakdown data.");
            setZones([]); // Ensure data grid is empty on error
        } finally {
            setIsLoading(false); // Stop loader
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
                                {t("text.BreakDown")}
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
                                    value={assetCodeOptions.find((option: any) => option.value === parseInt(formik.values.resid)) || null} // FIXED matching
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("resid", newValue?.value || ""); // Set resid internally
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectAssetcode")}
                                                    required={true}
                                                />
                                            }

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
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.SelectDate")}
                                            required={true}
                                        />
                                    }
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="BDdate"
                                    id="BDdate"
                                    value={formik.values.BDdate}
                                    placeholder={t("text.SelectDate")}
                                    onChange={(e) => {
                                        formik.setFieldValue("BDdate", e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                {formik.touched.BDdate && formik.errors.BDdate ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.BDdate}
                                    </div>
                                ) : null}

                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.EnterRemark")}
                                    value={formik.values.BreakDownRemark}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("BreakDownRemark", text)
                                    }
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.BreakDownRemark && formik.errors.BreakDownRemark ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.BreakDownRemark}
                                    </div>
                                ) : null}


                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>


                                <Autocomplete
                                    disablePortal
                                    id="reportedby-dropdown"
                                    options={[
                                        { label: "Student", value: "Student" },
                                        { label: "Staff", value: "Staff" },
                                        { label: "Visitor", value: "Visitor" }
                                    ]}
                                    fullWidth
                                    size="small"
                                    value={{ label: formik.values.ReportedBy, value: formik.values.ReportedBy }}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("ReportedBy", newValue?.value || "");
                                        setReportedByType(newValue?.value || ""); // Update state

                                        if (newValue?.value === "Student") {
                                            getStudentList(); // ✅ Fetch students
                                        } else if (newValue?.value === "Staff") {
                                            fetchEmployeeDetail("Staff"); // Fetch staff list
                                        } else if (newValue?.value === "Visitor") {
                                            getVisitorList(); // Fetch visitors
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t("text.ReportedBy")} required={true} />} />
                                    )}
                                />
                                {formik.touched.ReportedBy && formik.errors.ReportedBy ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.ReportedBy}
                                    </div>
                                ) : null}



                            </Grid>



                            <Grid item xs={12} sm={4} lg={4}>
                                {(reportedByType === "Staff") && (
                                    <Autocomplete
                                        disablePortal
                                        id={`${reportedByType.toLowerCase()}-dropdown`}
                                        options={reportedByType === "Staff" ? staffList : staffList}
                                        fullWidth
                                        size="small"
                                        value={(reportedByType === "Staff" ? staffList : staffList).find(
                                            (option: any) => option.label === formik.values.BreakDownName
                                        ) || null}
                                        onChange={(event, newValue: any) => {
                                            formik.setFieldValue("BreakDownName", newValue?.label || ""); // Store name
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text={`Select ${reportedByType}`} required={false} />} />
                                        )}
                                    />
                                )}
                                {reportedByType === "Student" && (
                                    <Autocomplete
                                        disablePortal
                                        id="student-dropdown"
                                        options={studentList}
                                        fullWidth
                                        size="small"
                                        value={studentList.find((option: any) => option.label === formik.values.BreakDownName) || null}
                                        onChange={(event, newValue: any) => {
                                            formik.setFieldValue("BreakDownName", newValue?.label || ""); // Store student name
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text="Select Student" required={false} />} />
                                        )}
                                    />
                                )}


                                {/* ✅ Add visitor section here */}
                                {reportedByType === "Visitor" && (
                                    <Autocomplete
                                        disablePortal
                                        id="visitor-dropdown"
                                        options={visitorList}
                                        fullWidth
                                        size="small"
                                        value={visitorList.find((option: any) => option.label === formik.values.BreakDownName) || null}
                                        onChange={(event, newValue: any) => {
                                            formik.setFieldValue("BreakDownName", newValue?.label || ""); // Store visitor name
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={<CustomLabel text="Select Visitor" required={false} />} />
                                        )}
                                    />
                                )}





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
