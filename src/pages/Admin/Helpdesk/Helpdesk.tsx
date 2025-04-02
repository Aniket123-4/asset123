import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import { useLocation } from "react-router-dom";
import React from "react";

export default function HelpDesk() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [PageName, setPageName] = useState<string>("");
  const [PageDesk, setPageDesk] = useState<string>("");
  const location =  useLocation();

  useEffect(() => {
    console.log("@@@@@@",location.state.activeMenu)
    fetchHelpDeskData();
  }, []);

  const fetchHelpDeskData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`HelpCreation`, { Type: 4 ,PageTitleId: location.state.activeMenu }); // need to replace
      if (response.data && response.data.data.length > 0) {
        setPageName(response.data.data[0]["Page_Name"]);
        setPageDesk(response.data.data[0]["frontDesign"]); 
      } else {
        toast.warn("No content found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Help Desk data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginTop: "3vh" }}>
      <ToastApp />
      <Grid item lg={8} sm={10} xs={12}>
        <Card
          sx={{
            backgroundColor: "#E9FDEE",
            border: "1px solid #2B4593",
            padding: "20px",
            borderRadius: 2,
          }}
        >
          <Paper sx={{ padding: "20px", borderRadius: 2 }}>
          
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              {t("text.HelpDesk")}
            </Typography>
            <Divider sx={{ margin: "20px 0" }} />

       
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress />
              </Box>
            ) : PageName && PageDesk ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography fontWeight="600" fontSize={20}>
                    Page Name: <i>{PageName}</i>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Content:
                    <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography fontWeight="530" fontSize={24} textAlign="center">
                No content available.
              </Typography>
            )}
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
}
