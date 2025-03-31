import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Flowmaster() {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem("ApplicationFlow"));

  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("ApplicationFlow", event.target.value);


  };

  const navigate = useNavigate()

  const handleSubmit = () => {
    console.log("Selected Option:", selectedOption);
    navigate("/home");
    //toast.success("")
    window.location.reload()
    // Add your form submission logic here
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
      <Grid item lg={6} sm={8} xs={12}>
        <Card
          style={{
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593",
            padding: "20px",
          }}
        >
          <Paper sx={{ padding: "20px" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              {t("text.Flowmaster")}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="outsource"
                  control={<Radio sx={{
                    color: "#2B4593",
                    "&.Mui-checked": { color: "#2B4593" },
                  }} />}
                  // label={t("Outsource")}
                  label=   {t("text.Outsource")}
                />

                <FormControlLabel
                  value="inhouseAndOutsource"
                  control={<Radio sx={{
                    color: "#2B4593",
                    "&.Mui-checked": { color: "#2B4593" },
                  }} />}
                  label=   {t("text.InhouseAndOutsource")}
                  // label={t("Inhouse")}
                />
              </RadioGroup>
            </Box>

            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: "#2B4593", color: "#fff" }}
              >
                {t("text.save")}
                {/* {t("Submit")} */}
              </Button>
            </Box>
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
}
