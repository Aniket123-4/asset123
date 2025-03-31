

import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    Divider, Table,
    MenuItem,
    TextField,
    Typography,
    TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api from "../../../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import DeleteIcon from '@mui/icons-material/Delete';
import { getISTDate } from "../../../utils/Constant";

type Props = {};


const EditRosterGroup = (props: Props) => {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const [lang, setLang] = useState<Language>("en");
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [tableData, setTableData] = useState([{

        "rosGroupChildID": -1,
        "rosGroupID": -1,
        "empId": 0,
        "createdBy": "",
        "updatedBy": "",
        "createdOn": defaultValues,
        "updatedOn": defaultValues
    }]);
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };
    const [zoneOption, setzoneOption] = useState([
        { value: -1, label: t("text.id") },
    ]);

    const [wardOption, setwardOption] = useState([
        { value: -1, label: t("text.id") },
    ]);

    const [empOption, setempOption] = useState([
        { value: "-1", label: t("text.empid") },
    ]);



    useEffect(() => {
        getzoneData();
        getWardData();
        GetempData();
    }, []);


    console.log("🚀 ~ CreateRosterGroup ~ tableData:", tableData)



    const GetempData = async () => {
        const collectData = {
            empid: -1,
            userId: "",
            empName: "",
            empMobileNo: "",
            empDesignationId: -1,
            empDeptId: -1,
            empStateId: -1,
            empCountryID: -1,
            empCityId: -1,
            empPincode: 0,
            roleId: ""
        };
        const response = await api.post(`EmpMaster/GetEmpmaster`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["empName"],
                value: data[index]["empid"],
            });
        }
        setempOption(arr);
    };

    const getzoneData = async () => {
        const collectData = {
            "zoneID": -1,
            "user_ID": ""
        };
        const response = await api.post(`Zone/GetZonemaster`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["zoneName"],
                value: data[index]["zoneID"],
            });
        }
        setzoneOption(arr);
    };
    const getWardData = async () => {
        const collectData = {
            "areaID": -1
        };
        const response = await api.post(`AreaWardMaster/GetAreaWardMaster`, collectData);
        const data = response.data.data;
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["areaName"],
                value: data[index]["areaID"],
            });
        }
        setwardOption(arr);
    };
    const getTransDataById = async (id: any) => {
        const collectData = {
            rosGroupId: id,
        };
        try {
            const result = await api.post(`RosterGroup/GetRosterGroup`, collectData);
            const data = result.data.data;

            if (data.length > 0) {
                const formattedData = data[0]["rosterGroupChild"].map((item: any) => ({
                    rosGroupChildID: item.rosGroupChildID,
                    rosGroupId: item.rosGroupId,
                    empId: item.empId,
                    createdBy: item.createdBy,
                    updatedBy: item.updatedBy,
                    createdOn: item.createdOn,
                    updatedOn: item.updatedOn,
                }));
                setTableData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Call getTransDataById after empOption is populated.
    useEffect(() => {
        if (location.state && empOption.length > 0) {
            getTransDataById(location.state.rosGroupId);
        }
    }, [empOption]);


    // const getTransDataById = async (id: any) => {
    //     const collectData = {
    //         "rosGroupId": id
    //     };
    //     try {
    //         const result = await api.post(`RosterGroup/GetRosterGroup`, collectData);
    //         const data = result.data.data;

    //         console.log("🚀 ~ getTransDataById ~ data:", data);

    //         if (data.length > 0) {
    //             const formattedData = data[0]['rosterGroupChild'].map((item: any, index: number) => ({
    //                 rosGroupChildID: item.rosGroupChildID,
    //                 rosGroupId: item.rosGroupId,
    //                 empId: item.empId, 
    //                 createdBy: item.createdBy,
    //                 updatedBy: item.updatedBy,
    //                 createdOn: item.createdOn,
    //                 updatedOn: item.updatedOn,
    //             }));
    //             setTableData(formattedData);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    const validateRow = (row: any) => {
        //  return row.empId >= 1;
    };

    const formik = useFormik({
        initialValues: {
            "rosGroupId": location.state.rosGroupId,
            "groupName": location.state.groupName,
            "groupDate": defaultValues,
            "zoneId": location.state.zoneId,
            "wardId": location.state.wardId,
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "zoneName": location.state.zoneName,
            "rosterGroupChild": []

        },
        onSubmit: async (values) => {
            const validTableData = tableData;


            const response = await api.post(
                `RosterGroup/AddUpdateRosterGroup`,
                { ...values, rosterGroupChild: validTableData }
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                navigate("/master/RosterGroup");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });

    const back = useNavigate();

    const handleInputChange = (index: any, field: any, value: any) => {
        const newData: any = [...tableData];
        newData[index][field] = field === 'empId' ? parseInt(value, 10) : value; // Convert empId to integer
        setTableData(newData);

        if (newData[index].empId > 0) {
            if (index === tableData.length - 1) {
                addRow();
            }
        }
    };

    const addRow = () => {
        setTableData([...tableData,
        {
            rosGroupChildID: tableData.length + 1,
            "rosGroupID": -1,
            "empId": 0,
            "createdBy": "",
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues
        }
            // { indentID: -1, itemID: -1, id: tableData.length + 1, itemName: '', unit: '', qty: 0, rate: 0, amount: 0 }
        ]);
    };

    const deleteRow = (index: any) => {
        const newData = tableData.filter((_, i) => i !== index);
        setTableData(newData);
    };

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    border: ".5px solid #FF7722",
                    marginTop: "3vh",
                }}
            >
                <CardContent>

                    <Grid item xs={12} container spacing={2} >
                        <Grid item lg={2} md={2} xs={2} marginTop={2}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    backgroundColor: "blue",
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Grid>
                        <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.EditRosterGroup")}
                            </Typography>
                        </Grid>

                        <Grid item lg={3} md={3} xs={3} marginTop={3}>
                            <select
                                className="language-dropdown"
                                value={lang}
                                onChange={(e) => setLang(e.target.value as Language)}
                            >
                                {Languages.map((l: any) => (
                                    <option key={l.value} value={l.value}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </Grid>
                    </Grid>
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="groupName"
                                    name="groupName"
                                    label={<CustomLabel text={t("text.groupName")} required={false} />}
                                    value={formik.values.groupName}
                                    placeholder={t("text.groupName")}
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                //InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="groupDate"
                                    name="groupDate"
                                    label={<CustomLabel text={t("text.groupDate")} required={false} />}
                                    value={formik.values.groupDate}
                                    placeholder={t("text.groupDate")}
                                    size="small"
                                    fullWidth
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={zoneOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("zoneId", newValue?.value);
                                    }}
                                    value={
                                        zoneOption.find(
                                            (opt) => opt.value === formik.values.zoneId
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.zoneId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={wardOption}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("wardId", newValue?.value);
                                    }}
                                    value={
                                        wardOption.find(
                                            (opt) => opt.value === formik.values.wardId
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.wardId")} />}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>





                                {empOption.length > 0 && tableData.length > 0 && (
                                    <Table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid black" }}>
                                        <thead style={{ backgroundColor: '#2196f3', color: '#f5f5f5' }}>
                                            <tr>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px', width: '5%', height: '35px' }}>{t("text.SrNo")}</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{t("text.selectemployee")}</th>
                                                <th style={{ border: '1px solid black', textAlign: 'center' }}>{t("text.Action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, index) => (
                                                <tr key={row.rosGroupChildID} style={{ border: '1px solid black' }}>
                                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{index + 1}</td>




                                                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                        <select
                                                            value={row.empId || ""}
                                                            onChange={(e) => handleInputChange(index, 'empId', e.target.value)}
                                                            style={{ width: '95%', height: '35px' }}
                                                        >
                                                            <option value="">{t("text.selectemployee")}</option>
                                                            {empOption.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>



                                                    <td style={{ border: '1px solid black', textAlign: 'center' }} onClick={() => deleteRow(index)}>
                                                        <DeleteIcon />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    style={{
                                        backgroundColor: `var(--header-background)`,
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                >
                                    {t("text.update")}
                                </Button>
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Button
                                    type="reset"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#F43F5E",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={(e: any) => formik.resetForm()}
                                >
                                    {t("text.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default EditRosterGroup;

