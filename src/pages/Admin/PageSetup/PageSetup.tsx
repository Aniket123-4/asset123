import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { getId, getISTDate } from "../../../utils/Constant";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";


interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function PageSetup() {
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(0);

    const location = useLocation();


    // console.log('location', location)
    const [isLoading, setIsLoading] = useState(true);
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });



    const [option, setOption] = useState([
        { value: "-1", label: t("text.PageName") },
    ]);


    const Userid = getId();
    const [lang, setLang] = useState<Language>("en");

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");
        if (dataString) {
            const data = JSON.parse(dataString);
            if (data && data.length > 0) {
                const userPermissionData = data[0]?.userPermission;
                if (userPermissionData && userPermissionData.length > 0) {
                    const menudata = userPermissionData[0]?.parentMenu;
                    for (let index = 0; index < menudata.length; index++) {
                        const childMenudata = menudata[index]?.childMenu;
                        const pathrow = childMenudata.find(
                            (x: any) => x.path === location.pathname
                        );
                        console.log("data", pathrow);
                        if (pathrow) {

                            setPermissionData(pathrow);
                        }
                    }
                }
            }
        }
        getList();
    }, [isLoading]);



    useEffect(() => {

        getPageName();

    }, []);


    const handleSwitchChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        value: any
    ) => {
        console.log(value)
        const updatedStatus = event.target.checked ? true : false;
        const collectData = {
            setupId: value.id,
            aspxPageName: value.aspxPageName,
            fieldName: value.fieldName,
            instId: value.instId,
            showHide: updatedStatus

        };
        api
            .post(`Setting/AddUpdatepagesetupData`, collectData)
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                    getList();
                } else {
                    toast.error(response.data.mesg);
                }
            });
    };


    const getPageName = () => {

        api.get(`Setting/GetPageSetupDataall`).then((res) => {
            const arr = [];
            //console.log("result" + JSON.stringify(res.data.data));
            for (let index = 0; index < res.data.data.length; index++) {
                arr.push({
                    label: res.data.data[index]["aspxPageName"],
                    value: res.data.data[index]["setupId"],
                });
            }
            setOption(arr);
        });
    };




    let delete_id = "";
    const accept = () => {
        const collectData = {
            id: delete_id.toString(),
        };
        //console.log("collectData " + JSON.stringify(collectData));
        api
            .post(`Setting/DeletepagesetupData`, collectData)
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                } else {
                    toast.error(response.data.mesg);
                }
                getList();
            });
    };

    const reject = () => {
        // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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

    const getList = () => {

        try {
            api
                .get(`Setting/GetPageSetupData?PageId=-1`)
                .then((res) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.setupId,
                    }));
                    setRows(arr);
                    setIsLoading(false);
                    if (data.length > 0) {
                        const columns: GridColDef[] = [
                            {
                                field: "actions",
                                headerClassName: "MuiDataGrid-colCell",
                                headerName: t("text.Action"),
                                width: 150,

                                renderCell: (params) => {
                                    console.log("Is Edit Allowed:", permissionData?.isEdit);
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
                                            {/* ) : (
                        ""
                      )}
                      {permissionData?.isDel ? ( */}
                                            <DeleteIcon
                                                style={{
                                                    fontSize: "20px",
                                                    color: "red",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    handledeleteClick(params.row.id);
                                                }}
                                            />
                                            {/* ) : (
                        ""
                      )} */}


                                            <Switch
                                                // checked={(params.row.empStatus)}
                                                checked={params.row.showHide === true}
                                                style={{
                                                    color: params.row.showHide === true ? "green" : "red",
                                                }}
                                                onChange={(value: any) =>
                                                    handleSwitchChange(value, params.row)
                                                }
                                                inputProps={{
                                                    "aria-label": "Toggle Switch",
                                                }}
                                            />
                                        </Stack>,
                                    ];
                                },
                            },

                            {
                                field: "serialNo",
                                headerName: t("text.SrNo"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "fieldName",
                                headerName: t("text.FieldName"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },


                            {
                                field: "aspxPageName",
                                headerName: t("text.PageName"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                         

                            {
                                field: "status",
                                headerName: t("text.Status"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                                renderCell: (params) => [
                                    <Stack direction="row" spacing={1}>
                                        {params.row.showHide === true ? (
                                            <Chip
                                                label={t("Active")}
                                                color="success"
                                                style={{ fontSize: "14px" }}
                                            />
                                        ) : (
                                            <Chip
                                                label={("InActive")}
                                                color="error"
                                                style={{ fontSize: "14px" }}
                                            />
                                        )}
                                    </Stack>,
                                ],
                            },

                        ];
                        setColumns(columns as any);
                    }
                });
            // setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            // setIsLoading(false);
        }
    };

 

    const [toaster, setToaster] = useState(false);

    const formik = useFormik({
        initialValues: {
            "setupId": 0,
            "aspxPageName": "",
            "fieldName": "",
            showHide: false,
            instId: 0


        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            //values.setupId = editId;

            const response = await api.post(
                `Setting/AddUpdatepagesetupData`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                formik.resetForm();
                getList();
                setEditId(0);
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }

        },
    });



    const routeChangeEdit = (row: any) => {

        console.log('row', row)
        formik.setFieldValue("aspxPageName", row.aspxPageName);
        formik.setFieldValue("fieldName", row.fieldName);
        formik.setFieldValue("showHide", row.showHide);
        formik.setFieldValue("setupId", row.setupId);




        setEditId(row.id);
    };

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };


    return (
        <>
            <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
                <Card
                    style={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#E9FDEE",
                        border: ".5px solid #2B4593 ",
                        marginTop: "5px",
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
                                    {t("text.PageSetup")}
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
                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={2}>

                                <Grid xs={4} sm={4} item>
                                    <TextField
                                        label={<CustomLabel text={t("text.PageName")} />}
                                        value={formik.values.aspxPageName}
                                        name="aspxPageName"
                                        id="aspxPageName"
                                        placeholder={t("text.PageName")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>


                                <Grid xs={4} sm={4} item>
                                    <TextField
                                        label={<CustomLabel text={t("text.FieldName")} />}
                                        value={formik.values.fieldName}
                                        name="fieldName"
                                        id="fieldName"
                                        placeholder={t("text.FieldName")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>

                                <Grid item lg={2} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formik.values.showHide}
                                                    onChange={formik.handleChange}
                                                    name="showHide"
                                                />
                                            }
                                            label="Is Active"
                                        />
                                    </FormGroup>
                                </Grid>


                                <Grid item xs={2} sx={{ m: -1 }}>




                                    {editId === 0 && (
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
                        {/* </Grid> */}
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        ></Typography>
                        {/* </Stack> */}
                        {isLoading ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CircularProgress />
                            </div>
                        ) : (
                            <DataGrids
                                isLoading={isLoading}
                                rows={rows}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25, 50, 100]}
                                initialPageSize={5}
                            />
                        )}
                    </Paper>
                </Card>
            </Grid>
            <ToastApp />
        </>
    );
}
