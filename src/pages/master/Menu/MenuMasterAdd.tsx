import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../../../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";
import api from "../../../utils/Url";
type Props = {};

const MenuMasterAdd = (props: Props) => {

  const [option, setOption] = useState([{ value: "-1", label: "Select Menu" }]);

  let navigate = useNavigate();

  const getMenuName = () => {
    api.post( `Menu/GetParentMenuMaster`).then((res) => {
      const arr = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["menuName"],
          value: res.data.data[index]["menuId"],
        });
      }
      setOption(arr);
    });
  };

  const back = useNavigate();
  const{t}=useTranslation();
  const validationSchema = Yup.object({
    menuName:
    Yup.string().test(
      'required', // Unique name for the test
      t('text.reqMenuName'),// Translation for "*Menu Name is required"
      function (value:any) {
        return value && value.trim() !== ''; // Your validation logic here
      }  ),

  });

  const formik = useFormik({
    initialValues: {
      menuId: -1,
      menuName: "",
      parentId: 0,
      pageUrl: "",
      icon: "",
      displayNo: 0,
      isMenu: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      isView: false,
      isPrint: false,
      isExport: false,
      isRelease: false,
      isPost: false,
      childId: 0,
      parentName: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      
      const response = await api.post(
         `Menu/AddUpdateMenuMaster`,
        values
        );
  try {
        // console.log("API Response:", response.data);
        alert(response.data.mesg);
        navigate("/master/MenuMaster");
      } catch (error) {
        alert(response.data.mesg);
      }
    },
  });

  const requiredFields = ["menuName"];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #ff7722",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
          {t("text.CreateMenuMaster")}
          </Typography>
          <Grid xs={4} sm={12} item>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />
        
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
            <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  name="menuName"
                  id="menuName"
                  label={
                    <span>
                        {t("text.EnterMenuName")}{requiredFields.includes('menuName') && (
                        <span style={{ color: formik.values.menuName ? 'green' : 'red' }}>*</span>
                      )}
                    </span>
                  }
                  value={formik.values.menuName}
                  placeholder={t("text.EnterMenuName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.menuName && formik.errors.menuName ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.menuName && formik.errors.menuName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.menuName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
              <TextField
                  type="text"
                  name="pageUrl"
                  id="pageUrl"
                  label={
                    <span>
                       {t("text.EnterPageURL")}
                    </span>
                  }
                  value={formik.values.pageUrl}
                  placeholder= {t("text.EnterPageURL")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.pageUrl && formik.errors.pageUrl ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
              </Grid>

              <Grid xs={12} sm={4} item>
               <TextField
                  type="text"
                  name="icon"
                  id="icon"
                  label={
                    <span>
                      {t("text.EnterIcon")}
                    </span>
                  }
                  value={formik.values.icon}
                  placeholder= {t("text.EnterIcon")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.icon && formik.errors.icon ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </Grid>
              <Grid xs={12} sm={4} item>
                
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  onOpen={() => {
                    getMenuName();
                  }}
                 
                  size="small"
                  onChange={(event, newValue) => {
                    // console.log(newValue?.value);
                    formik.setFieldValue("parentName", newValue?.label);
                    formik.setFieldValue("parentId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={
                      <span>
                         {t("text.selectParentMenuName")} 
                      </span>
                    } />
                  )}
                />

              </Grid>
              <Grid xs={12} sm={4} item>
               <TextField
                  type="text"
                  name="displayNo"
                  id="displayNo"
                  label={
                    <span>
                      {t("text.EnterdisplayNo")}
                    </span>
                  }
                  value={formik.values.displayNo}
                  placeholder= {t("text.EnterdisplayNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white", borderColor: formik.touched.displayNo && formik.errors.displayNo ? 'red' : 'initial', }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </Grid>
             

              <Grid xs={12} item>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#059669",
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                 {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default MenuMasterAdd;
