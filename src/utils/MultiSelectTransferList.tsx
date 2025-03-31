import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { t } from "i18next";

const categories = ["General Information"];
const details = [
  "Employee Id",
  "Employee Name",
  "Date of Birth",
  "Gender",
  "Cast",
  "Marital Status",
  "Wedding Anniversary",
  "Mobile No.",
  "Phone No.",
  "Email-id",
  "Office Email-id",
  "Employment Category",
  "Joining Date",
  "Employee Type",
  "Confirmation Date",
  "Nationality",
  "Languages Known",
];

const MultiSelectTransferList: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableDetails, setAvailableDetails] = useState<string[]>(details);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);

  const moveItems = (
    from: string[],
    setFrom: React.Dispatch<React.SetStateAction<string[]>>,
    to: string[],
    setTo: React.Dispatch<React.SetStateAction<string[]>>,
    items: string[]
  ) => {
    setFrom(from.filter((item) => !items.includes(item)));
    setTo([...to, ...items]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">{t("text.select")}</Typography>
      {categories.map((category) => (
        <FormControlLabel
          key={category}
          control={
            <Checkbox
              checked={selectedCategories.includes(category)}
              onChange={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((item) => item !== category)
                    : [...prev, category]
                )
              }
            />
          }
          label={t(`text.${category.replace(/ /g, "-")}`)}
        />
      ))}

      <Grid container spacing={2} mt={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: 200, overflow: "auto" }}>
            <Typography variant="subtitle1">{t("text.selected-categories")}</Typography>
            <List>
              {selectedCategories.map((category) => (
                <ListItem key={category}>
                  <ListItemText primary={t(`text.${category.replace(/ /g, "-")}`)} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: 200, overflow: "auto" }}>
            <Typography variant="subtitle1">{t("text.available-details")}</Typography>
            <List>
              {availableDetails.map((detail) => (
                <ListItem
                  key={detail}
                  button
                  onClick={() =>
                    moveItems(
                      availableDetails,
                      setAvailableDetails,
                      selectedDetails,
                      setSelectedDetails,
                      [detail]
                    )
                  }
                >
                  <ListItemText primary={t(`text.${detail.replace(/ /g, "-")}`)} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: 200, overflow: "auto" }}>
            <Typography variant="subtitle1">{t("text.selected-details")}</Typography>
            <List>
              {selectedDetails.map((detail) => (
                <ListItem
                  key={detail}
                  button
                  onClick={() =>
                    moveItems(
                      selectedDetails,
                      setSelectedDetails,
                      availableDetails,
                      setAvailableDetails,
                      [detail]
                    )
                  }
                >
                  <ListItemText primary={t(`text.${detail.replace(/ /g, "-")}`)} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultiSelectTransferList;
