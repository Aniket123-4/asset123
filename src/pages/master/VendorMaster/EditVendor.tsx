import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    Modal,
    Box,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../../../assets/images/imagepreview.jpg";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import { getId } from "../../../utils/Constant";
import Languages from "../../../utils/Languages";
import TranslateTextField from "../../../TranslateTextField";
import { Language } from "react-transliterate";
import { getISTDate } from "../../../utils/Constant";

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

type Props = {};

const EditVendor = (props: Props) => {
    let userId = getId();
    const location = useLocation();
    console.log("location",location);

    const { i18n, t } = useTranslation();
    const { defaultValuestime } = getISTDate();

    const [StateOption, setStateOption] = useState<any>([
        { value: "-1", label: t("text.SelectState") },
    ]);
    const [Country, setCountry] = useState<any>([
        { value: "-1", label: t("text.SelectCountry") },
    ]);
    const [City, setCity] = useState<any>([
        { value: "-1", label: t("text.SelectCity") },
    ]);

    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");
    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");


    useEffect(() => {
        getCountry();
    }, []);

    const getState = (countryId: any) => {
        const collectData = {
            stateId: -1,
            countryId: countryId,
        };
        api.post(`State/GetStateMaster`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.stateName,
                value: item.stateId,
            }));
            setStateOption(arr);
        });
    };

    const getCountry = () => {
        const collectData = {
            countryId: -1,
        };
        api.post(`Country/GetCountryMaster`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.countryName,
                value: item.countryId,
            }));
            setCountry(arr);
        });
    };

    const getCity = (stateId: any) => {
        const collectData = {
            cityId: -1,
            stateId: stateId,
        };
        api.post(`M10_District/GetDistrictMaster`, collectData).then((res) => {
            const arr = res.data.data.map((item: any) => ({
                label: item.cityName,
                value: item.cityId,
            }));
            setCity(arr);
        });
    };

    const handlePanClose1 = () => {
        setOpen(false);
    };

    const modalOpenHandle1 = (event: string) => {
        setOpen(true);
        const base64Prefix = "data:image/jpg;base64,"; 
        
        let imageData = '';
        switch(event) {
            case "imageFile":
                imageData = formik.values.imageFile;
                break;
            case "signatureFile":
                imageData = formik.values.signatureFile;
                break;
            case "panFile":
                imageData = formik.values.panFile;
                break;
            case "gstInFile":
                imageData = formik.values.gstInFile;
                break;
            case "tanFile":
                imageData = formik.values.tanFile;
                break;
            case "adharImageFile":
                imageData = formik.values.adharImageFile;
                break;
        }
        
        if (imageData) {
            console.log("imageData",base64Prefix + imageData);
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
        console.log("base64Data",base64Data);
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
    };

    let navigate = useNavigate();



    const validationSchema = Yup.object({
        name: Yup.string().test(
            "required",
            t("text.EmpNameRequired"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        code: Yup.string().test(
            "required",
            t("text.EmpCodeRequired"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        mobileNo: Yup.string().test(
            "required",
            t("text.MobNoRequired"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        panNumber: Yup.string()
            .matches(/^[A-Z]{3}[A-ZHPTCF][A-Z]\d{4}[A-Z]$/, "Invalid PAN format")
            .required(t("text.PanNoRequired")),
        permanentAddress: Yup.string().test(
            "required",
            t("text.PermanentAddressRequired"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        pincode: Yup.string().test(
            "required",
            t("text.PincodeRequired"),
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        addharNo: Yup.string()
            .required(t("text.AdharNoRequired"))
            .test("len", "Aadhaar number must be exactly 12 digits", (val: any) =>
                val ? val.replace(/\D/g, "").length === 12 : true
            ),
    });

    const formik = useFormik({
        initialValues: {
            "venderId": location.state.id,
            "name": location.state.name,
            "code": location.state.code,
            "permanentAddress": location.state.permanentAddress,
            "contactPerson": location.state.contactPerson,
            "mobileNo": location.state.mobileNo,
            "panNumber": location.state.panNumber,
            "addharNo": location.state.addharNo,
            "gstinNo": location.state.gstinNo,
            "stateId": location.state.stateId || null,
            "countryId": location.state.countryId || null,
            "cityId": location.state.cityId || null,
            "pincode": location.state.pincode,
            "createdBy": userId,
            "updatedBy": userId,
            "createdOn": defaultValuestime,
            "updatedOn": defaultValuestime,
            "imageFile": location.state.imageFile,
            "signatureFile": location.state.signatureFile,
            "panFile": location.state.panFile,
            "gstInFile": location.state.gstInFile,
            "tanFile": location.state.tanFile,
            "tanno": location.state.tanno,
            "adharImageFile": location.state.adharImageFile
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            // console.log("Before submission formik values", values);

            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([_, value]) => value !== "")
            );

            // console.log("Before submission formik values", filteredValues);

            // Handle form submission
            try {
                const response = await api.post(
                    `VendorMaster/AddUpdateVendorMaster`,
                    filteredValues
                );
                if (response.data.isSuccess) {
                    setToaster(false);
                    toast.success(response.data.mesg);
                    navigate("/master/VendorMaster");
                } else {
                    toast.error(response.data.mesg);
                }
            } catch (error) {
                setToaster(true);
                console.error("Error:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    const requiredFields = [
        "addharNo",
        "pincode",
        "permanentAddress",
        "panNumber",
        "mobileNo",
        "code",
        "name"
    ];

    const back = useNavigate();

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    border: ".5px solid #00009c",
                    marginTop: "3vh",
                }}
            >
                <CardContent>

                    <Grid item xs={12} container spacing={2}>
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
                        <Grid
                            item
                            lg={7}
                            md={7}
                            xs={7}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.createVendor")}
                            </Typography>
                        </Grid>

                        <Grid item lg={3} md={3} xs={3} marginTop={3}>
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
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>
                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={t("text.vendorName")}
                                    value={formik.values.name}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("name", text)
                                    }
                                    required={true}
                                    lang={lang}
                                />

                                {formik.touched.name && formik.errors.name ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.name)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="code"
                                    name="code"
                                    label={
                                        <CustomLabel
                                            text={t("text.vendorCode")}
                                            required={requiredFields.includes("code")}
                                        />
                                    }
                                    value={formik.values.code}
                                    placeholder={t("text.vendorCode")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: "white",
                                        borderColor:
                                            formik.touched.code && formik.errors.code
                                                ? "red"
                                                : "initial",
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.code && formik.errors.code ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.code)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={t("text.contactPerson")}
                                    value={formik.values.contactPerson}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("contactPerson", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />

                                {formik.touched.contactPerson && formik.errors.contactPerson ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.contactPerson)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={t("text.permanentAddress")}
                                    value={formik.values.permanentAddress}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("permanentAddress", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />

                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="mobileNo"
                                    name="mobileNo"
                                    inputProps={{ maxLength: 10 }}
                                    label={
                                        <CustomLabel
                                            text={t("text.EnterMobileNo")}
                                            required={requiredFields.includes("mobileNo")}
                                        />
                                    }
                                    value={formik.values.mobileNo}
                                    placeholder={t("text.EnterMobileNo")}
                                    // type="number"
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: "white",
                                        borderColor:
                                            formik.touched.mobileNo && formik.errors.mobileNo
                                                ? "red"
                                                : "initial",
                                    }}
                                    onChange={(e: any) => {
                                        let num = e.target.value;
                                        formik.setFieldValue("mobileNo", String(num));
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.mobileNo && formik.errors.mobileNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.mobileNo)}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="panNumber"
                                    name="panNumber"
                                    label={
                                        <CustomLabel
                                            text={t("text.EnterPanNo")}
                                            required={requiredFields.includes("panNumber")}
                                        />
                                    }
                                    value={formik.values.panNumber}
                                    placeholder={t("text.EnterPanNo")}
                                    size="small"
                                    fullWidth
                                    style={{
                                        backgroundColor: "white",
                                        borderColor:
                                            formik.touched.panNumber && formik.errors.panNumber
                                                ? "red"
                                                : "initial",
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.panNumber && formik.errors.panNumber ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.panNumber)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="addharNo"
                                    name="addharNo"
                                    label={
                                        <CustomLabel
                                            text={t("text.adharNumber")}
                                            required={requiredFields.includes("addharNo")}
                                        />
                                    }
                                    value={formik.values.addharNo}
                                    placeholder={t("text.adharNumber")}
                                    size="small"
                                    type="number"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e: any) => {
                                        let num = e.target.value;
                                        formik.setFieldValue("addharNo", String(num));
                                    }}
                                    onBlur={formik.handleBlur}
                                    inputProps={{ maxLength: 12 }}
                                />
                                {formik.touched.addharNo && formik.errors.addharNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.addharNo)}
                                    </div>
                                ) : null}
                            </Grid>
                            
                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="gstinNo"
                                    name="gstinNo"
                                    label={
                                        <CustomLabel
                                            text={t("text.gstin")}
                                            required={requiredFields.includes("gstinNo")}
                                        />
                                    }
                                    value={formik.values.gstinNo}
                                    placeholder={t("text.gstin")}
                                    size="small"
                                    // type="number"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e: any) => {
                                        let num = e.target.value;
                                        formik.setFieldValue("gstinNo", String(num));
                                    }}
                                    onBlur={formik.handleBlur}
                                    // inputProps={{ maxLength: 12 }}
                                />
                                {formik.touched.gstinNo && formik.errors.gstinNo ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.gstinNo)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="tanno"
                                    name="tanno"
                                    label={
                                        <CustomLabel
                                            text={t("text.tanno")}
                                            required={requiredFields.includes("tanno")}
                                        />
                                    }
                                    value={formik.values.tanno}
                                    placeholder={t("text.tanno")}
                                    size="small"
                                    // type="number"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={(e: any) => {
                                        let num = e.target.value;
                                        formik.setFieldValue("tanno", String(num));
                                    }}
                                    onBlur={formik.handleBlur}
                                    // inputProps={{ maxLength: 12 }}
                                />
                                {formik.touched.tanno && formik.errors.tanno ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.tanno)}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={Country}
                                    fullWidth
                                    size="small"
                                    value={Country.find((country:any) => country.value === formik.values.countryId) || null}
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("countryId", newValue?.value);
                                        formik.setFieldTouched("countryId", true);
                                        formik.setFieldTouched("countryId", false);
                                        getState(newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectCountry")}
                                                    required={requiredFields.includes("countryId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.countryId && formik.errors.countryId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.countryId)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={StateOption}
                                    fullWidth
                                    size="small"
                                    value={StateOption.find((state:any) => state.value === formik.values.stateId) || null}
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("stateId", newValue?.value);
                                        formik.setFieldTouched("stateId", true);
                                        formik.setFieldTouched("stateId", false);
                                        getCity(newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectState")}
                                                    required={requiredFields.includes("stateId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.stateId && formik.errors.stateId ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.stateId)}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={City}
                                    fullWidth
                                    size="small"
                                    value={City.find((city:any) => city.value === formik.values.cityId) || null}
                                    onChange={(event, newValue: any) => {
                                        formik.setFieldValue("cityId", newValue?.value);
                                        formik.setFieldTouched("cityId", true);
                                        formik.setFieldTouched("cityId", false);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectCity")}
                                                    required={requiredFields.includes("cityId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="pincode"
                                    name="pincode"
                                    label={
                                        <CustomLabel
                                            text={t("text.pincode")}
                                            required={requiredFields.includes("pincode")}
                                        />
                                    }
                                    value={formik.values.pincode}
                                    placeholder={t("text.pincode")}
                                    inputProps={{ maxLength: 6 }}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    style={{ backgroundColor: "white" }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.pincode && formik.errors.pincode ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {String(formik.errors.pincode)}
                                    </div>
                                ) : null}
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
                                        label={<CustomLabel text={t("text.AttachedImage")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "imageFile")}
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
                                        {formik.values.imageFile == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.imageFile}`}
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
                                            onClick={() => modalOpenHandle1("imageFile")}
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
                                <Modal open={panOpens} onClose={handlePanClose1}>
                                    <Box sx={style}>
                                        {modalImg == "" ? (
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
                                                src={modalImg}
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
                                        label={<CustomLabel text={t("text.AttachedSignature")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "signatureFile")}
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
                                        {formik.values.signatureFile == "" ? (
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
                                                src={`data:image/jpg;base64,${formik.values.signatureFile}`}
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
                                            onClick={() => modalOpenHandle1("signatureFile")}
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
                                        label={<CustomLabel text={t("text.AttachedPan")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "panFile")}
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
                                        {formik.values.panFile == "" ? (
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
                                                // src={formik.values.panFile}
                                                src={`data:image/jpg;base64,${formik.values.panFile}`}
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
                                            onClick={() => modalOpenHandle1("panFile")}
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
                                        label={<CustomLabel text={t("text.AttachedGSTIN")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "gstInFile")}
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
                                        {formik.values.gstInFile == "" ? (
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
                                                // src={formik.values.gstInFile}
                                                src={`data:image/jpg;base64,${formik.values.gstInFile}`}
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
                                            onClick={() => modalOpenHandle1("gstInFile")}
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
                                        label={<CustomLabel text={t("text.AttachedTan")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "tanFile")}
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
                                        {formik.values.tanFile == "" ? (
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
                                                // src={formik.values.tanFile}
                                                src={`data:image/jpg;base64,${formik.values.tanFile}`}
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
                                            onClick={() => modalOpenHandle1("tanFile")}
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
                                        label={<CustomLabel text={t("text.AttachedAadhar")} />}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) => otherDocChangeHandler(e, "adharImageFile")}
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
                                        {formik.values.adharImageFile == "" ? (
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
                                                // src={formik.values.adharImageFile}
                                                src={`data:image/jpg;base64,${formik.values.adharImageFile}`}
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
                                            onClick={() => modalOpenHandle1("adharImageFile")}
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

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        style={{
                                            backgroundColor: "#059669",
                                            color: "white",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {t("text.save")}
                                    </Button>
                                </Grid>
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
                                    onClick={(e) => formik.resetForm()}
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

export default EditVendor;