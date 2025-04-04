import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import help from "../../assets/images/help.png";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Stack,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import call from "../../assets/images/phone-call.png";
import roles from "../../assets/images/role-model.png";
import tick from "../../assets/images/check-mark.png";
import crs from "../../assets/images/cross.png";
import log from "../../assets/images/profile.png";
import emails from "../../assets/images/gmail.png";
import genders from "../../assets/images/symbol.png";
import dobs from "../../assets/images/timetable.png";
import id from "../../assets/images/profile1.png";
import settings from "../../assets/images/settings.png";
import trans from "../../assets/images/translation.png";
import logout from "../../assets/images/logout.png";
import logged from "../../assets/images/permission.png";
import logo from "../../assets/images/recyclebinLogo.png";
import loged from "../../assets/images/DrawerLogo.png";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { Home } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import Typewriter from "./TypeWriter";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import "./Shine.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import names from "../../assets/images/id-card (2).png";
import backgrd from "../../assets/images/backgroundimage.jpg";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  // Typography,
} from "@mui/material";
import "./ThemeStyle.css";
import ThemeIcon from "../../assets/images/themes.png";
import {
  Brightness5,
  Brightness4,
  Waves,
  WbSunny,
  Forest,
  Flag,
} from "@mui/icons-material";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import TreeView from "@mui/x-tree-view/TreeView";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { FaRegFolderOpen } from "react-icons/fa6";
import DescriptionIcon from "@mui/icons-material/Description";

import { FaFileLines } from "react-icons/fa6";
import { useState } from "react";

const drawerWidth = 225;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "85%",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function getGreeting() {
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = {
      text: "Good Morning",
      color: "#FFFFE0",
      icon: "🌅", // Sunrise emoji
    };
  } else if (hour < 17) {
    greeting = {
      text: "Good Afternoon",
      color: "#FFE4B5",
      icon: "🌞", // Sun emoji
    };
  } else {
    greeting = {
      text: "Good Evening",
      color: "#FFDAB9",
      icon: "🌜", // Crescent moon emoji
    };
  }

  return greeting;
}

export default function MiniDrawer({ items }: any) {
  const [activeMenu, setActiveMenu] = React.useState<number | null>(null);
  const userRole = localStorage.getItem("roles") || "N/A";
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null); // Track the active menu
  const [openlogo, setOpenlogo] = React.useState(true);
  const [homeColor, setHomeColor] = React.useState("inherit");
  const { t } = useTranslation();

  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);

  const [expandedItems, setExpandedItems] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [treedata, setTreedata] = React.useState<any>([]);
  // console.log("data", treedata)
  const [check, setCheck] = React.useState<any>([]);

  const [searchValue, setSearchValue] = React.useState("");
  // const [filteredItems, setFilteredItems] = React.useState([]);
  const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

  const themes = [
    { name: "light-theme", icon: <Brightness5 /> },
    { name: "dark-theme", icon: <Brightness4 /> },
    { name: "ocean-theme", icon: <Waves /> },
    { name: "sunset-theme", icon: <WbSunny /> },
    { name: "forest-theme", icon: <Forest /> },
    { name: "bhagwa-theme", icon: <Flag /> },
  ];

  const greeting = getGreeting();

  let navigate = useNavigate();

  function searchMenuItems(items: any, query: string) {
    const results: any = [];

    for (const menuItem of items) {
      if (menuItem.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(menuItem);
      } else if (menuItem.items && menuItem.items.length > 0) {
        const matchingSubItems = menuItem.items.filter(
          (subItem: { name: string }) =>
            subItem.name.toLowerCase().includes(query.toLowerCase())
        );
        if (matchingSubItems.length > 0) {
          results.push({ ...menuItem, items: matchingSubItems });
        }
      }
    }
    return results;
  }

  interface MenuItem {

    menuId: number; // Unique ID for the menu item
    parentId: number | null; // ID of the parent menu (null for root items)
    menuName: string; // Display name of the menu
    path: string; // URL path for the menu
    children: MenuItem[]; // Nested submenu items (if any)
  }

  const [expandedMenus, setExpandedMenus] = useState<number[]>([]); // Track multiple expanded menus

  const handleClickMenu = (e: any, item: MenuItem) => {
    const menuId = item.menuId;
    setActiveMenu(item.menuId);
    const path = `${item.path}`;

    if (!path) {
      window.alert("Path Not Found");
    } else {
      navigate(path);
      setActiveMenuId(menuId); // Update active menu
    }
  };

  const toggleMenuExpansion = (menuId: number) => {
    // Add or remove the menuId from the expandedMenus array
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderMenuItems = (menuItems: MenuItem[], level = 0) => (
    <List sx={{ paddingLeft: level * 2 }}>
      {menuItems.map((item) => (
        <React.Fragment key={item.menuId}>
          <Divider />
          <ListItem
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor:
                item.menuId === activeMenuId ? "#F0F8FF" : "inherit", // Highlight active menu
              cursor: "pointer",
              paddingLeft: level ? 2 : 0,
              "&:hover": { backgroundColor: "#e0f7fa" }, // Hover effect
            }}
            onClick={(e) => {
              if (!item.children.length) {
                // If there are no children, navigate and set the active menu
                handleClickMenu(e, item);
                setActiveMenuId(item.menuId);
              } else {
                // Expand or collapse the menu
                toggleMenuExpansion(item.menuId);
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                marginLeft: "15%",
                mr: 1,
                justifyContent: "flex-start",
                color:
                  expandedMenus.includes(item.menuId) ||
                    item.menuId === activeMenuId
                    ? "#FF0000"
                    : "inherit", // Highlight icon for active or expanded menus
              }}
            >
              {item.children.length ? (
                expandedMenus.includes(item.menuId) ? (
                  <FaRegFolderOpen style={{ color: "#42AEEE" }} size={20} />
                ) : (
                  <FolderIcon style={{ color: "#42AEEE" }} />
                )
              ) : (
                <DescriptionIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={open ? item.menuName : item.menuName.split(" ").map(word => word[0]).join("")}
              sx={{ textAlign: "start" }}
            />
          </ListItem>
          <Divider />
          {/* Render child menus only when the parent is expanded */}
          {expandedMenus.includes(item.menuId) &&
            item.children.length > 0 &&
            renderMenuItems(item.children, level + 1)}
        </React.Fragment>
      ))}
    </List>
  );

  const handleSearchIconClick = () => {
    console.log("value", searchValue);
    const filtered = searchMenuItems(items, searchValue);
    setFilteredItems(filtered);
    console.log("filtered", filtered);
  };

  const handleNavigation = (path: any) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleAutocompleteChange = (event: any, value: any) => {
    const selectedItem = items.find((item: any) =>
      item.items.some((subItem: any) => subItem.name === value)
    );
    if (selectedItem) {
      const selectedSubItem = selectedItem.items.find(
        (subItem: any) => subItem.name === value
      );
      if (selectedSubItem) {
        handleNavigation(selectedSubItem.path);
      }
    }
  };

  const allMenuNames = items.reduce((acc: any, item: { items: any[] }) => {
    if (item.items) {
      return [
        ...acc,
        ...item.items.map((subItem: { name: any }) => subItem.name),
      ];
    }
    return acc;
  }, []);

  const filteredItemed = allMenuNames.filter((item: string) =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchInputChange = (e: any) => {
    console.log("first 1", e.target.value);
    const value = e.target.value;
    setSearchValue(value);

    const filtered = searchMenuItems(items, value);
    setFilteredItems(filtered);
  };

  var [date, setDate] = React.useState(new Date());

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const handleSubMenuClick = (index: any) => {
    console.log(index);
    setSelectedSubMenu(index);
  };
  const resetHomeColor = () => {
    // setHomeColor("inherit");
    setHomeColor("#FF0000");
    // setHomeColor("");
  };

  const backgroundStyle = {
    background: "linear-gradient(45deg, #fff, #f0f)",
    backgroundSize: "400% 400%",
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setHomeColor("inherit");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const routeChangeHome = () => {
    let path = `/home`;
    navigate(path);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setOpenlogo(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenlogo(false);
  };

  const Logout = () => {
    localStorage.setItem("permissions", "[]");
    localStorage.clear();
    navigate("/");
  };

  function onClick(e: any, item: any) {
    // console.log("Main " + item);

    let path = item.path;
    if (path == "" || path == null || path == "undefind") {
      window.alert("Path Not Found ????");
    } else {
      navigate(path);
    }
  }

  // var data = JSON.parse(localStorage.getItem("userdata")!);
  // var menudata = data[0]["userdetail"];
  // var username =
  //   menudata[0]["firsT_NAME"] +
  //   " " +
  //   menudata[0]["middlE_NAME"] +
  //   " " +
  //   menudata[0]["suR_NAME"];
  const { i18n } = useTranslation();

  const changeLanguage = (language: any) => {
    // console.log("check", language);

    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
  };
  var currentLanguage = localStorage.getItem("preferredLanguage");
  var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

  // const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
  // const userDetail = userData[0]?.userdetail || [];
  // console.log(userDetail);

  const collapsehamndle = (index: any) => {
    // console.log(index);
    if (index == collapseIndex) {
      setCollapseIndex(-1);
    } else {
      setCollapseIndex(index);
    }
  };
  // console.log("items", items);

  const getImageForFirstName = (
    firsT_NAME: any,
    middlE_NAME: any,
    suR_NAME: any
  ) => {
    const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
    const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
    const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
    return `${firstLetter}${secondLetter}${thirdLetter}`;
  };

  const getGenderText = (gendeR_ID: any) => {
    switch (gendeR_ID) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "Unknown";
    }
  };

  const handleMyProfileClick = () => {
    // console.log("My Profile clicked" + profileDrawerOpen);
    setProfileDrawerOpen(!profileDrawerOpen);
  };

  const currentPathname = window.location.pathname;
  const segments = currentPathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;

  function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // console.info("You clicked a breadcrumb.");
  }

  const handleClickhome = () => {
    let path = `/home`;
    navigate(path);
  };

  function FirstLetters(props: any) {
    const { text } = props;

    const words = text.split(" ");


    const firstLetters = words.map((word: any) => word.charAt(0));


    const result = firstLetters.join("");

    return <div>{result}</div>;
  }

  const handleRightClick = (path: any) => (e: any) => {
    e.preventDefault();
    window.open(path, "_blank");
  };

  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  const [selectedTheme, setSelectedTheme] = React.useState(() => {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme ? storedTheme : themes[0]["name"];
  });

  React.useEffect(() => {
    console.log(selectedTheme);
    document.body.className = selectedTheme;

    localStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (theme: any) => {
    setSelectedTheme(theme);
    setShowThemeMenu(false);
  };

  const handleCloseSelect = () => {
    setShowThemeMenu(false);
  };

  const headerColor1 = `var(--header-background)`;
  const drawerStyles = `var(--drawer-background)`;

  // let ID: any = localStorage.getItem("username");
  // ID = ID.replace(/^"(.*)"$/, "$1");
  // const handlePermissionClick = () => {
  //   if (ID) {
  //     console.log("id check 175", ID);
  //     getNode(ID);
  //   } else {
  //     toast.error("ID not found");
  //   }
  //   setIsModalOpen(true);
  //   console.log("first");
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getNode = (id: any) => {
    const collectData = {
      id: -1,
      nodeID: -1,
      titleID: -1,
      user_Id: id,
    };
    api
      .post(`NewNodeMaster/GetNewNodeMasterHeirarical`, collectData)
      .then((res: any) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setTreedata(res.data.data);
          const allNodeIds = getAllNodeIds(res.data.data);
          setExpandedItems(allNodeIds);
        } else {
          toast.error("Data is null or empty");
        }
      });
  };

  const getAllNodeIds = (nodes: any[]): string[] => {
    let ids: string[] = [];

    const collectIds = (nodes: any[]) => {
      nodes.forEach((node) => {
        ids.push(node.id.toString());
        if (node.childnode) {
          collectIds(node.childnode);
        }
      });
    };

    collectIds(nodes);

    return ids;
  };

  const defaultSelectedNodeId = parseInt(localStorage.getItem("id") + "");

  React.useEffect(() => {
    // Set default selected node here
    if (defaultSelectedNodeId) {
      setCheck([defaultSelectedNodeId]);
    }

    const initialExpanded = getAllNodeIds(treedata);
    setExpandedItems(initialExpanded);
  }, [defaultSelectedNodeId, treedata]);

  const [nodeId, setnodeId] = React.useState<any>(0);
  const [nodeNames, setNodeNames] = React.useState<string>("");

  // Effect to apply the theme from local storage

  const handleToggle = (id: number, name: string) => () => {
    const currentIndex = check.indexOf(id);
    //const newChecked = [...check];
    const newChecked = currentIndex === -1 ? [id] : [];
    //const updatedChecked = currentIndex === -1 ? [id] : [];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheck(newChecked);



    console.log("Checked data:", name);
    console.log("Checked data:", id);

    setNodeNames(name);
    setnodeId(id);
    // handleSave(id, name);
  };

  const handleSave = () => {
    console.log("handleSave function called");

    if (nodeId != 0 || nodeNames != "") {
      localStorage.setItem("id", nodeId);
      localStorage.setItem("nodeName", nodeNames);
      console.log("Checked Save:", { nodeId, nodeNames });

      handleCloseModal();
    } else {
      toast.error("Please Retry... Network Issues");
    }
  };

  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      itemId={String(nodes.id)}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={check.indexOf(nodes.id) !== -1}
            // onChange={handleToggle(nodes.id)}

            onChange={handleToggle(nodes.id, nodes.name)}
            onClick={(event: any) => event.stopPropagation()}
          />

          <div style={{ marginLeft: 8 }}>{nodes.name}</div>
        </div>
      }
      onClick={() => toggleExpansion(nodes.id.toString())}
    >
      {Array.isArray(nodes.childnode)
        ? nodes.childnode.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  );

  const toggleExpansion = (nodeId: string) => {
    if (expandedItems.includes(nodeId)) {
      setExpandedItems(expandedItems.filter((item) => item !== nodeId));
    } else {
      setExpandedItems([...expandedItems, nodeId]);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open} style={{}}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `var(--header-background1)`,
            color: `var(--header-color1)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // paddingTop: "10px",
              // paddingBottom: "10px",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                // marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {!openlogo && <img src={logo} width={60} height={60} />}
          </div>
          <div style={{ fontSize: "2.5vw" }}>
            <div style={{ fontFamily: "Georgia, serif" }}>
              <span style={{ fontSize: "3vw", color: "#FFAE35" }}>A</span>
              <span style={{ fontSize: "2.2vw" }}>sset </span>
              <span style={{ fontSize: "3vw", color: "#FFE100" }}>M</span>
              <span style={{ fontSize: "2.2vw" }}>anagement </span>
              <span style={{ fontSize: "3vw", color: "#e69f99" }}>S</span>
              <span style={{ fontSize: "2.2vw" }}>ystem</span>
            </div>
          </div>
          {/* <div style={{ fontSize: "2.5vw" }}>Asset Management System</div> */}

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: `var(--header-background)` }}>
              {(localStorage.getItem("userid") || "").charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            // onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: `var(--menu-background)`,
                color: `var(--menu-color)`,
                overflow: "auto",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                paddingRight: "10px",
                paddingLeft: "10px",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} />
              </ListItemIcon>{" "}
              {/* {username} */}
            </MenuItem>
            {/* <MenuItem > */}
            <MenuItem onClick={handleMyProfileClick}>
              <ListItemIcon>
                <img src={id} width={30} height={30} />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                localStorage.getItem("preferredLanguage") == "hi"
                  ? changeLanguage("en")
                  : changeLanguage("hi");
              }}
            >
              <ListItemIcon>
                <img src={trans} width={30} height={30} />
              </ListItemIcon>
              Translate -- {newLanguage}
            </MenuItem>
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={settings} width={30} height={30} />
              </ListItemIcon>
              Settings
            </MenuItem> */}

            {/* <MenuItem onClick={handlePermissionClick}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} alt="Permission" />
              </ListItemIcon>
              Permission
            </MenuItem> */}

            <MenuItem onClick={() => setShowThemeMenu(!showThemeMenu)}>
              <ListItemIcon>
                <img src={ThemeIcon} width={30} height={30} />
              </ListItemIcon>
              Select Theme
            </MenuItem>

            <MenuItem
              onClick={() => {
                let path = "/admin/HelpDesk";

                navigate(path, { state: { activeMenu } })

              }}
            >
              <ListItemIcon>
                <img src={help} width={30} height={30} alt="Help Desk" />
              </ListItemIcon>
              Help Desk
            </MenuItem>

            <Divider />
            <MenuItem onClick={Logout}>
              <ListItemIcon>
                <img src={logout} width={30} height={30} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
          <DialogTitle>Select a Theme</DialogTitle>
          <DialogContent>
            <List>
              {themes.map((theme) => (
                <ListItemButton
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  selected={selectedTheme === theme.name}
                >
                  {theme.icon}
                  <span style={{ marginLeft: "10px" }}>{theme.name}</span>
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSelect}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: headerColor1,
            borderBottomRightRadius: "15px",
          }}
        >
          <div
            role="presentation"
            onClick={handleClicked}

          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>

              <Typography
                sx={{
                  display: "flex",
                  color: "#fff",
                  alignItems: "center",
                }}
              >
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  color="inherit"
                  onClick={handleClickhome}
                >
                  <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
                  Home
                </Link>
              </Typography>

              {/* Render the rest of the breadcrumb path */}
              {segments.slice(1).map((segment, index) => (
                <Typography
                  key={index}
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                  }}
                >
                  {/* {" / "} */}
                  {index > 0 && " / "}
                  {index === segments.length - 2 ? (
                    <span>
                      {" "}
                      {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </span>
                  ) : (
                    <Link
                      underline="hover"
                      sx={{
                        display: "flex",
                        color: "#fff",
                        alignItems: "center",
                      }}
                      color="inherit"
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                    >
                      {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </Link>
                  )}
                </Typography>
              ))}
            </Breadcrumbs>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              paddingRight: "15px",
            }}
          >
            <p style={{ fontSize: "1.2vw", color: greeting.color }}>
              {greeting.icon} {greeting.text}
            </p>
            <p> Time : {date.toLocaleTimeString()}</p>
            <p> Date : {formattedDate}</p>
          </div>
        </div>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: drawerStyles,
            color: `var(--drawer-color)`,
          },
        }}
      >
        <DrawerHeader>
          <>
            <Stack
              sx={{ width: "100%", height: "16vh" }}
              direction="row"
              justifyContent="center"
            >
              {openlogo ? (
                <div
                  style={{
                    paddingTop: "25px",
                    paddingBottom: "25px",
                  }}
                >
                  <img src={loged} width={100} height={100} />
                </div>
              ) : (
                <div style={{ padding: 0 }}></div>
              )}
            </Stack>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
            <br />
            <br />
          </>
        </DrawerHeader>

        <br />
        <br />
        <Divider />
        {openlogo && (
          <Paper
            component="form"
            sx={{
              m: "5px 5px",
              p: "0px 2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              freeSolo
              fullWidth
              size="small"
              options={items.reduce((acc: any, item: any) => {
                if (item.items) {
                  acc.push(...item.items.map((subItem: any) => subItem.name));
                }
                return acc;
              }, [])}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  //label="Search Menu"
                  placeholder="Search Menu"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchInputChange}
                />
              )}
            />
          </Paper>
        )}
        <Divider />

        <React.Fragment>
          {/* Home List */}
          <List sx={{ padding: 0 }}>
            {["Home"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 0,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "inherit",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    justifyContent: open ? "initial" : "center",
                    px: 4.5,
                    backgroundColor: "inherit",
                  }}
                  onClick={() => {
                    routeChangeHome();
                    resetHomeColor();
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                      color: homeColor,
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Dynamic Items List */}
          {renderMenuItems(items)}
        </React.Fragment>
      </Drawer>
      {/* <Box  sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box> */}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography fontWeight={500} fontSize={20} noWrap align="center">
            Node Permission
          </Typography>
          <div>
            <Grid xs={12} item>
              <Box>
                <div style={{ height: "400px", overflow: "auto" }}>
                  <SimpleTreeView expandedItems={expandedItems}>
                    {Array.isArray(treedata)
                      ? treedata.map((node: any) => renderTree(node))
                      : null}
                  </SimpleTreeView>
                </div>
              </Box>
            </Grid>
            <Grid xs={3} item alignItems="center" justifyContent="center">
              <Button
                type="submit"
                fullWidth
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={(e: any) => handleSave()}
              >
                {t("text.save")}
              </Button>
            </Grid>
          </div>
        </Box>
      </Modal>

      <SwipeableDrawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onOpen={() => { }}
        style={{ zIndex: 1300 }}
      >
        <Box sx={{ width: drawerWidth }} role="presentation">
          <IconButton
            edge="end"
            onClick={() => setProfileDrawerOpen(false)}
            aria-label="close"
            sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <p
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
              textAlign: "center",
              backgroundImage: "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
              color: "whitesmoke",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              fontSize: "20px",
            }}
          >
            User Details
          </p>

          {/* User Avatar Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                bgcolor: `var(--header-background)`,
                //</Box>color: "whitesmoke",
                fontSize: "20px",
              }}
            >
              {JSON.parse(localStorage.getItem("userDetails") || "{}")?.userid?.charAt(0) || "U"}
            </Avatar>
          </Box>

          {/* User Info Section */}
          <Box sx={{ paddingX: 2 }}>
            <Divider />
            <Typography sx={{ fontWeight: "bold", marginTop: 1 }}>User Name:</Typography>
            <Typography>{JSON.parse(localStorage.getItem("userDetails") || "{}")?.userid || "N/A"}</Typography>
            <Divider />
            {/* <Typography sx={{ fontWeight: "bold", marginTop: 1 }}>Email:</Typography>
      <Typography>{"user@example.com"}</Typography>
            <Divider />

            <Typography sx={{ fontWeight: "bold", marginTop: 1 }}>Phone Number:</Typography>
            <Typography>{"+91 9934566778"}</Typography>
            <Divider /> */}
            <Typography sx={{ fontWeight: "bold", marginTop: 1 }}>Role:</Typography>

            <Typography>{userRole}</Typography>
            <Divider />

            <Typography sx={{ fontWeight: "bold", marginTop: 1 }}>Account Status:</Typography>
            <Typography>
              {JSON.parse(localStorage.getItem("userDetails") || "{}")?.iS_ACTIVE
                ? "Inactive ❌ "
                : "Active ✅"}
            </Typography>
            <Divider />
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
