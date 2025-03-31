import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
    Box,
    Divider,
    Stack,
    Grid,
    Typography,
    Input,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";
import DataGrids from "../../../utils/Datagrids";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function Taxmaster() {
    const Userid = getId();
    const [editId, setEditId] = useState(0);
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [lang, setLang] = useState<Language>("en");
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });


    const { t } = useTranslation();

    useEffect(() => {

        fetchZonesData();
    }, []);


    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

   

    const routeChangeEdit = (row: any) => {
        console.log(row);
        console.log(dayjs(row.effectiveDate).format("DD-MM-YYYY"))
        formik.setFieldValue("taxId", row.taxId);
        formik.setFieldValue("taxName", row.taxName);
        formik.setFieldValue("taxPercentage", row.taxPercentage);
        formik.setFieldValue("effectiveDate", dayjs(row.effectiveDate).format("YYYY-MM-DD"));
        setEditId(row.id);
    };

    let delete_id = "";

    const accept = () => {
        const collectData = {
            taxId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .post(`UnitMaster/DeleteTaxMaster`,  collectData )
            .then((response) => {
                if (response.data.status === 1) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
                fetchZonesData();
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

    const fetchZonesData = async () => {
        try {
            const collectData = {
                taxId: -1,
            };
            const response = await api.post(`UnitMaster/GetTaxMaster`, collectData);
            const data = response.data.data;
            console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.taxId,
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",

                        headerName: t("text.Action"),
                        width: 150,

                        renderCell: (params) => {
                            return [
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    sx={{ alignItems: "center", marginTop: "5px" }}
                                >

                                    <EditIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => routeChangeEdit(params.row)}
                                    />

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

                                </Stack>,
                            ];
                        },
                    },

                    {
                        field: "serialNo",
                        headerName: t("text.SrNo"),
                        flex: 1,

                    },
                    {
                        field: "taxName",
                        headerName: t("text.taxName"),
                        flex: 1,

                    },
                    {
                        field: "taxPercentage",
                        headerName: t("text.taxPercentage"),
                        flex: 1,

                    },
                    {
                        field: "effectiveDate",
                        headerName: t("text.effectiveDate"),
                        flex: 1,
                        renderCell(params: any) {

                            return dayjs(params.row.effectiveDate).format("DD-MM-YYYY");
                        },

                    },

                ];
                setColumns(columns as any);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));

    const validationSchema = Yup.object({
        taxName: Yup.string().required(t("text.reqTaxName")),
        taxPercentage: Yup.string().required(t("text.reqTaxPercent")),
    });

    const requiredFields = ["taxName"];

    const formik = useFormik({
        initialValues: {
            taxId: 0,
            taxName: "",
            taxPercentage: "",
            effectiveDate: "",
           
           
            createdBy: "admin",
            updatedBy: "admin",
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.taxId = editId;

            console.log("before submitting value check", values);
            const response = await api.post(`UnitMaster/UpsertTaxMaster`, values);
            if (response.data.status === 1) {
                formik.setFieldValue("taxName", "");
                formik.setFieldValue("taxPercentage", "");
                formik.setFieldValue("effectiveDate", "");

                fetchZonesData();
                toast.success(response.data.message);
                setEditId(0);
            } else {
                toast.error(response.data.message);
            }
        },
    });

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    return (
        <>
            <Card
                style={{
                    width: "100%",
                    backgroundColor: "lightgreen",
                    border: ".5px solid #2B4593",
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

                    <Grid item xs={12} container spacing={1}>
                        <Grid item lg={10} md={10} xs={12}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="left"
                            >
                                {t("text.TaxMaster")}
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
                            <Grid xs={12} sm={4} lg={4} item>
                                <TranslateTextField
                                    label={t("text.entertaxName")}
                                    value={formik.values.taxName}
                                    onChangeText={(text: string) => handleConversionChange('taxName', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.taxName && formik.errors.taxName ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.taxName}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entertaxPercentage")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="taxPercentage"
                                    id="taxPercentage"
                                    value={formik.values.taxPercentage}
                                    placeholder={t("text.entertaxPercentage")}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.taxPercentage && formik.errors.taxPercentage ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.taxPercentage}
                                    </div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entereffectiveDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="effectiveDate"
                                    id="effectiveDate"
                                    type="date"
                                    value={formik.values.effectiveDate}
                                    placeholder={t("text.entereffectiveDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />

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
                            rows={zones}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />
                    )}
                </Paper>
            </Card>
            <ToastApp />
        </>
    );
};