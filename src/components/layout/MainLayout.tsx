// import { Outlet } from "react-router-dom";
// import { Box, Toolbar } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import { useLocation } from "react-router-dom";
// import FolderIcon from "@mui/icons-material/Folder";
// import { useNavigate } from "react-router-dom";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// const colorConfigs = {
//   sidebar: {
//     bg: "#233044",
//     color: "#eeeeee",
//     hoverBg: "#1e293a",
//     activeBg: "#1e253a",
//   },
//   topbar: {
//     bg: "#fff",
//     color: "#000",
//   },
//   mainBg: `url(${backgroundimage})`,
// };

// const MainLayout = () => {
//   const location = useLocation();
//   var menuarray = [];
//   let navigate = useNavigate();

//   // if (localStorage.getItem("userdata") == null) {
//   //   navigate("/");
//   // } else {
//   //   const items2 = JSON.parse(localStorage.getItem("userdata")!);
//   //   if (items2.length > 0) {
//   //     const items1 = [
//   //       {
//   //         menuName: "Master",
//   //         path: "",
//   //         menuId: 1,
//   //         displayNo: 1,
//   //         childMenu: [
//   //           {
//   //             menuId: 1,
//   //             menuName: "Zone Master",
//   //             path: "/master/ZoneMaster",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 2,
//   //             menuName: "Department Master",
//   //             path: "/master/DepartmentMaster",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 3,
//   //             menuName: "Ward Master",
//   //             path: "/master/WardMaster",
//   //             displayNo: 0,
//   //           },
//   //         ],
//   //       },



//   //       //Asset management menu
//   //       {
//   //         menuName: "Asset Management",
//   //         path: "",
//   //         menuId: 1,
//   //         displayNo: 1,
//   //         childMenu: [

//   //           {
//   //             menuId: 1,
//   //             menuName: "Asset Type",
//   //             path: "/AssetManagement/AssetType",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 2,
//   //             menuName: "Depreciation Rule",
//   //             path: "/AssetManagement/DepreciationRule",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 3,
//   //             menuName: "Asset Detail",
//   //             path: "/AssetManagement/AssetDetail",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 3,
//   //             menuName: "Asset Issue/Return",
//   //             path: "/AssetManagement/AssetIssueReturn",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 4,
//   //             menuName: "Bulk Asset Detail",
//   //             path: "/AssetManagement/BulkAssetDetail",
//   //             displayNo: 0,
//   //           }
//   //         ],
//   //       },


//   //       //AssetDescription menu 
//   //       {
//   //         menuName: "Asset Description",
//   //         path: "",
//   //         menuId: 1,
//   //         displayNo: 1,
//   //         childMenu: [

//   //           {
//   //             menuId: 1,
//   //             menuName: "Asset Information",
//   //             path: "/AssetDescription/AssetInformation",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "General Information",
//   //             path: "/AssetDescription/GeneralInformation",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Purchase Detail",
//   //             path: "/AssetDescription/PurchaseDetail",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Status",
//   //             path: "/AssetDescription/Status",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Asset Location",
//   //             path: "/AssetDescription/AssetLocation",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Maintenance/Warranty",
//   //             path: "/AssetDescription/MaintainanceWarrantyMaster",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Licensing/Insurance",
//   //             path: "/AssetDescription/LicensingInsuranceMaster",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Utilization Log",
//   //             path: "/AssetDescription/UtilizationLog",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Break Down",
//   //             path: "/AssetDescription/BreakDown",
//   //             displayNo: 0,
//   //           },

//   //         ],
//   //       },









//   //       {
//   //         menuName: "Reports",
//   //         path: "",
//   //         menuId: 9,
//   //         displayNo: 1,
//   //         childMenu: [
//   //           {
//   //             menuId: 1,
//   //             menuName: "Asset Dynamic Report",
//   //             path: "/Reports/AssetDynamicReport",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 2,
//   //             menuName: "Asset Issue/Return Report",
//   //             path: "/Reports/AssetIssueReturnReport",
//   //             displayNo: 0,
//   //           },
//   //           // {
//   //           //   menuId: 3,
//   //           //   menuName: "Conditional Asset Report",
//   //           //   path: "/Reports/ConditionalAssetReport",
//   //           //   displayNo: 0,
//   //           // },
//   //           {
//   //             menuId: 4,
//   //             menuName: "Depreciation Report",
//   //             path: "/Reports/DepreciationReport",
//   //             displayNo: 0,
//   //           },
//   //           {
//   //             menuId: 5,
//   //             menuName: "Staff Report",
//   //             path: "/Reports/StaffReport",
//   //             displayNo: 0,
//   //           },
//   //           // {
//   //           //   menuId: 6,
//   //           //   menuName: "Staff Report On Selected Field",
//   //           //   path: "/Reports/StaffReportOnSelectedField",
//   //           //   displayNo: 0,
//   //           // },



//   //         ],
//   //       },


//   //       {
//   //         menuName: "Staff Information",
//   //         path: "",
//   //         menuId: 9,
//   //         displayNo: 1,
//   //         childMenu: [
//   //           {
//   //             menuId: 1,
//   //             menuName: "Staff/Employee Master",
//   //             path: "/StaffInfo/EmployeeMaster",
//   //             displayNo: 0,
//   //           },
//   //         ]
//   //       },





//   //       {
//   //         menuName: "Admin",
//   //         path: "",
//   //         menuId: 10,
//   //         displayNo: 1,
//   //         childMenu: [

//   //           // {
//   //           //   menuId: 2,
//   //           //   menuName: "Page Setup",
//   //           //   path: "/Admin/PageSetup",
//   //           //   displayNo: 0,
//   //           // },


//   //           // {
//   //           //   menuId: 3,
//   //           //   menuName: "Menu Create",
//   //           //   path: "/Admin/MenuCreate",
//   //           //   displayNo: 0,
//   //           // },
//   //           {
//   //             menuId: 4,
//   //             menuName: "HelpCreation",
//   //             path: "/Admin/HelpCreation",
//   //             displayNo: 0,
//   //           },
//   //           // {
//   //           //   menuId: 5,
//   //           //   menuName: "User Creation",
//   //           //   path: "/Admin/UserCreation",
//   //           //   displayNo: 0,
//   //           // },
//   //           {
//   //             menuId: 6,
//   //             menuName: "Role Creation",
//   //             path: "/Admin/Roles",
//   //             displayNo: 0,
//   //           },
//   //           // {
//   //           //   menuId: 7,
//   //           //   menuName: "Assign User to Employee",
//   //           //   path: "/Admin/AssignUserToEmployee",
//   //           //   displayNo: 0,
//   //           // },
//   //           {
//   //             menuId: 8,
//   //             menuName: "User Permission",
//   //             path: "/Admin/UserPermission",
//   //             displayNo: 0,
//   //           },
//   //           // {
//   //           //   menuId: 6,
//   //           //   menuName: "Organisation",
//   //           //   path: "/Admin/Organization",
//   //           //   displayNo: 0,
//   //           // },
//   //           {
//   //             menuId: 1,
//   //             menuName: "Change Password",
//   //             path: "/Admin/ChangePassword",
//   //             displayNo: 0,
//   //           },



//   //         ],
//   //       },



//   //     ];

//   //     //const items1 = items2[0]["userPermission"][0]["parentMenu"];
//   //     //{id: 1, name: 'Master', label: 'Master', displayNo: 1, path: '', …}

//   //     for (let index = 0; index < items1.length; index++) {
//   //       const element = items1[index];

//   //       var childmenuarray = [];
//   //       var childMenu = items1[index]["childMenu"];

//   //       for (let index2 = 0; index2 < childMenu.length; index2++) {
//   //         childmenuarray.push({
//   //           id: childMenu[index2]["menuId"],
//   //           name: childMenu[index2]["menuName"],
//   //           label: childMenu[index2]["menuName"],
//   //           path: childMenu[index2]["path"],
//   //           displayNo: childMenu[index2]["displayNo"],
//   //           Icon: TouchAppIcon,
//   //           onClick,
//   //         });
//   //       }
//   //       menuarray.push({
//   //         id: items1[index]["menuId"],
//   //         name: items1[index]["menuName"],
//   //         label: items1[index]["menuName"],
//   //         displayNo: items1[index]["displayNo"],
//   //         path: "",
//   //         Icon: FolderIcon,
//   //         items: childmenuarray.sort(
//   //           (a: any, b: any) => a.displayNo - b.displayNo
//   //         ),
//   //       });
//   //     }
//   //   } else {
//   //     navigate("/");
//   //   }
//   // }

//   const items1 = [
//     {
//       menuName: "Master",
//       path: "",
//       menuId: 1,
//       displayNo: 1,
//       childMenu: [
//         {
//           menuId: 1,
//           menuName: "Zone Master",
//           path: "/master/ZoneMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 2,
//           menuName: "Department Master",
//           path: "/master/DepartmentMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 3,
//           menuName: "Ward Master",
//           path: "/master/WardMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 4,
//           menuName: "Location Master",
//           path: "/master/LocationMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 4,
//           menuName: "Country Master",
//           path: "/master/CountryMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 5,
//           menuName: "State Master",
//           path: "/master/StateMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 5,
//           menuName: "City Master",
//           path: "/master/CityMaster",
//           displayNo: 0,
//         },

//       ],
//     },



//     //Asset management menu
//     {
//       menuName: "Asset Management",
//       path: "",
//       menuId: 1,
//       displayNo: 1,
//       childMenu: [

//         {
//           menuId: 1,
//           menuName: "Asset Type",
//           path: "/AssetManagement/AssetType",
//           displayNo: 0,
//         },
//         {
//           menuId: 2,
//           menuName: "Depreciation Rule",
//           path: "/AssetManagement/DepreciationRule",
//           displayNo: 0,
//         },
//         {
//           menuId: 3,
//           menuName: "Asset Detail",
//           path: "/AssetManagement/AssetDetail",
//           displayNo: 0,
//         },
//         {
//           menuId: 3,
//           menuName: "Asset Issue/Return",
//           path: "/AssetManagement/AssetIssueReturn",
//           displayNo: 0,
//         },
//         {
//           menuId: 4,
//           menuName: "Bulk Asset Detail",
//           path: "/AssetManagement/BulkAssetDetail",
//           displayNo: 0,
//         }
//       ],
//     },


//     //AssetDescription menu 
//     {
//       menuName: "Asset Description",
//       path: "",
//       menuId: 1,
//       displayNo: 1,
//       childMenu: [

//         {
//           menuId: 1,
//           menuName: "Asset Information",
//           path: "/AssetDescription/AssetInformation",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "General Information",
//           path: "/AssetDescription/GeneralInformation",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Purchase Detail",
//           path: "/AssetDescription/PurchaseDetail",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Status",
//           path: "/AssetDescription/Status",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Asset Location",
//           path: "/AssetDescription/AssetLocation",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Maintenance/Warranty",
//           path: "/AssetDescription/MaintainanceWarrantyMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Licensing/Insurance",
//           path: "/AssetDescription/LicensingInsuranceMaster",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Utilization Log",
//           path: "/AssetDescription/UtilizationLog",
//           displayNo: 0,
//         },
//         {
//           menuId: 1,
//           menuName: "Break Down",
//           path: "/AssetDescription/BreakDown",
//           displayNo: 0,
//         },

//       ],
//     },









//     {
//       menuName: "Reports",
//       path: "",
//       menuId: 9,
//       displayNo: 1,
//       childMenu: [
//         {
//           menuId: 1,
//           menuName: "Asset Dynamic Report",
//           path: "/Reports/AssetDynamicReport",
//           displayNo: 0,
//         },
//         {
//           menuId: 2,
//           menuName: "Asset Issue/Return Report",
//           path: "/Reports/AssetIssueReturnReport",
//           displayNo: 0,
//         },
//         // {
//         //   menuId: 3,
//         //   menuName: "Conditional Asset Report",
//         //   path: "/Reports/ConditionalAssetReport",
//         //   displayNo: 0,
//         // },
//         {
//           menuId: 4,
//           menuName: "Depreciation Report",
//           path: "/Reports/DepreciationReport",
//           displayNo: 0,
//         },
//         {
//           menuId: 5,
//           menuName: "Staff Report",
//           path: "/Reports/StaffReport",
//           displayNo: 0,
//         },
//         {
//           menuId: 5,
//           menuName: "Asset Geo Location",
//           path: "/Reports/AssetGeoLocationReport",
//           displayNo: 0,
//         },
//         // {
//         //   menuId: 6,
//         //   menuName: "Staff Report On Selected Field",
//         //   path: "/Reports/StaffReportOnSelectedField",
//         //   displayNo: 0,
//         // },



//       ],
//     },


//     {
//       menuName: "Staff Information",
//       path: "",
//       menuId: 9,
//       displayNo: 1,
//       childMenu: [
//         {
//           menuId: 1,
//           menuName: "Staff/Employee Master",
//           path: "/StaffInfo/EmployeeMaster",
//           displayNo: 0,
//         },
//       ]
//     },





//     {
//       menuName: "Admin",
//       path: "",
//       menuId: 10,
//       displayNo: 1,
//       childMenu: [

//         // {
//         //   menuId: 2,
//         //   menuName: "Page Setup",
//         //   path: "/Admin/PageSetup",
//         //   displayNo: 0,
//         // },


//         // {
//         //   menuId: 3,
//         //   menuName: "Menu Create",
//         //   path: "/Admin/MenuCreate",
//         //   displayNo: 0,
//         // },
//         {
//           menuId: 4,
//           menuName: "HelpCreation",
//           path: "/Admin/HelpCreation",
//           displayNo: 0,
//         },
//         // {
//         //   menuId: 5,
//         //   menuName: "User Creation",
//         //   path: "/Admin/UserCreation",
//         //   displayNo: 0,
//         // },
//         {
//           menuId: 6,
//           menuName: "Role Creation",
//           path: "/Admin/Roles",
//           displayNo: 0,
//         },
//         // {
//         //   menuId: 7,
//         //   menuName: "Assign User to Employee",
//         //   path: "/Admin/AssignUserToEmployee",
//         //   displayNo: 0,
//         // },
//         // {
//         //   menuId: 8,
//         //   menuName: "User Permission",
//         //   path: "/Admin/UserPermission",
//         //   displayNo: 0,
//         // },
//         // {
//         //   menuId: 6,
//         //   menuName: "Organisation",
//         //   path: "/Admin/Organization",
//         //   displayNo: 0,
//         // },
//         {
//           menuId: 1,
//           menuName: "Change Password",
//           path: "/Admin/ChangePassword",
//           displayNo: 0,
//         },



//       ],
//     },



//   ];

//   //const items1 = items2[0]["userPermission"][0]["parentMenu"];
//   //{id: 1, name: 'Master', label: 'Master', displayNo: 1, path: '', …}

//   for (let index = 0; index < items1.length; index++) {
//     const element = items1[index];

//     var childmenuarray = [];
//     var childMenu = items1[index]["childMenu"];

//     for (let index2 = 0; index2 < childMenu.length; index2++) {
//       childmenuarray.push({
//         id: childMenu[index2]["menuId"],
//         name: childMenu[index2]["menuName"],
//         label: childMenu[index2]["menuName"],
//         path: childMenu[index2]["path"],
//         displayNo: childMenu[index2]["displayNo"],
//         Icon: TouchAppIcon,
//         onClick,
//       });
//     }
//     menuarray.push({
//       id: items1[index]["menuId"],
//       name: items1[index]["menuName"],
//       label: items1[index]["menuName"],
//       displayNo: items1[index]["displayNo"],
//       path: "",
//       Icon: FolderIcon,
//       items: childmenuarray.sort(
//         (a: any, b: any) => a.displayNo - b.displayNo
//       ),
//     });
//   }

//   const items = menuarray.sort((a, b) => a.displayNo - b.displayNo);

//   function onClick(e: any, item: any) {
//     console.log("Main " + item);

//     let path = item.path;
//     if (path == "" || path == null || path == "undefind") {
//       window.alert("Path Not Found ????");
//     } else {
//       navigate(path);
//     }
//   }
//   return (
//     <div>
//       {location.pathname == "/" ? (
//         <Outlet />
//       ) : (
//         <div>
//           <Box sx={{ display: "flex" }}>
//             <Sidebar items={items} />

//             <Box
//               // component="main"
//               sx={{
//                 flexGrow: 1,
//                 px: 5,
//                 py: 3,
//                 width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                 // width:"100vh",
//                 minHeight: "100vh",
//                 backgroundColor: `var( --main-background)`,
//                 backgroundImage: `var(--background-image)`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 // backgroundImage: "url('../../assets/images/backgroundimage.jpg')"
//               }}
//             >
//               <Toolbar />
//               <Outlet />
//             </Box>
//           </Box>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;







//////////////////////////////////////////////////



// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Box, IconButton, Toolbar, Typography } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// import { useEffect, useState } from "react";
// import "../common/ThemeStyle.css";
// import ChatIcon from "@mui/icons-material/Chat";
// import ChatBotIcon from "../../assets/images/chatBot1.png";

// const MainLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState<any>([]);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isChatBotOpen, setIsChatBotOpen] = useState(false);


//   const fetchMenu = () => {
//     // Example response data
//     const menuResponse = JSON.parse(localStorage.getItem("permissions") || "")

//     // ✅ Step 1: Build Menu Hierarchy
//     const buildMenuHierarchy = (menuData: any) => {
//       const menuMap = new Map();

//       // Store all items in a map
//       menuData.forEach((menu: any) => {
//         menuMap.set(menu.OrdNo, {
//           ...menu,
//           children: [],
//           path: "",
//         });
//       });

//       let rootMenus: any = [];

//       // Assign children to their parents
//       menuMap.forEach((menu) => {
//         if (menu.ParentID === null) {
//           rootMenus.push(menu);
//         } else {
//           const parent = menuMap.get(menu.ParentID);
//           if (parent) {
//             parent.children.push(menu);
//           }
//         }
//       });

//       // ✅ Step 2: Sort parent menus by `OrdNo`
//       rootMenus.sort((a: any, b: any) => a.OrdNo - b.OrdNo);

//       // ✅ Step 3: Sort children menus alphabetically by Title
//       const sortChildren = (menus: any) => {
//         menus.forEach((menu: any) => {
//           if (menu.children.length > 0) {
//             menu.children.sort((a: any, b: any) => a.Title.localeCompare(b.Title));
//             sortChildren(menu.children); // Recursively sort children
//           }
//         });
//       };

//       sortChildren(rootMenus);

//       // ✅ Step 4: Generate Paths for Each Menu Item
//       const generatePaths = (menus: any, parentPath = "") => {
//         menus.forEach((menu: any) => {
//           menu.path = `${parentPath}/${menu.Title.replace(/\s+/g, "").toLowerCase()}`;
//           if (menu.children.length > 0) {
//             generatePaths(menu.children, menu.path);
//           }
//         });
//       };

//       generatePaths(rootMenus);

//       return rootMenus;
//     };

//     // Build menu hierarchy
//     const menuHierarchy = buildMenuHierarchy(menuResponse);

//     // ✅ Example: Set menu hierarchy in state (replace with your own state handler)
//     console.log("Menu Hierarchy:", menuHierarchy);
//     setMenuItems(menuHierarchy); // Replace with your state setter
//   };




//   useEffect(() => {
//     fetchMenu(); // Initial fetch

//     // ✅ Listen for permission updates from login
//     const updateMenu = () => fetchMenu();
//     window.addEventListener("permissionsUpdated", updateMenu);

//     return () => window.removeEventListener("permissionsUpdated", updateMenu);
//   }, []);

//   const handleMenuClick = (e: any, item: any) => {
//     const menuId = item.menuId;
//     const menuName = item.menuName;
//     const path = `${item.path}?appId=${menuId}&Appname=${menuName}.aspx`;

//     if (!path) {
//       window.alert("Path Not Found");
//     } else {
//       sessionStorage.setItem("menuId", menuId);
//       sessionStorage.setItem("menuName", menuName);
//       navigate(path);
//     }
//   };

//   return (
//     <div>
//       {location.pathname === "/" ? (
//         <Outlet />
//       ) : (
//         <div>
//           <Box sx={{ display: "flex" }}>
//             <Sidebar items={menuItems} onClick={handleMenuClick} />
//             <Box
//               sx={{
//                 flexGrow: 1,
//                 px: 5,
//                 py: 3,
//                 width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                 minHeight: "100vh",
//                 backgroundColor: `var(--main-background)`,
//                 backgroundImage: `var(--background-image)`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             >
//               <Toolbar />
//               <Outlet />

//             </Box>
//           </Box>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;







/////////////////////////////////////////////////////////////////////////




// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Box, IconButton, Toolbar, Typography } from "@mui/material";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import FolderIcon from "@mui/icons-material/Folder";
// import TouchAppIcon from "@mui/icons-material/TouchApp";
// import backgroundimage from "../../assets/images/backgroundimage.jpg";
// import { useEffect, useState } from "react";
// import "../common/ThemeStyle.css";


// const MainLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState<any>([]);


//   const fetchMenu = () => {
//     const response = JSON.parse(localStorage.getItem("permissions") || "[]");

//     const buildMenuHierarchy = (permissions: any[]) => {
//       const menuMap = new Map<number, any>();

//       // Step 1: Create a menu map for ID-based access
//       permissions.forEach((item) => {
//         menuMap.set(item.ID, {
//           menuId: item.ID,
//           parentId: item.ParentID,
//           menuName: item.Title,
//           path: "",
//           children: [],
//           ordNo: item.OrdNo,
//         });
//       });

//       let rootMenus: any[] = [];

//       // Step 2: Assign children to their respective parents
//       menuMap.forEach((menu) => {
//         if (menu.parentId === null) {
//           rootMenus.push(menu);
//         } else {
//           const parentMenu = menuMap.get(menu.parentId);
//           if (parentMenu) {
//             parentMenu.children.push(menu);
//           }
//         }
//       });

//       // Step 3: Sort menus by OrdNo and sort children alphabetically
//       rootMenus.sort((a, b) => a.ordNo - b.ordNo);

//       const sortChildren = (menus: any[]) => {
//         menus.forEach((menu) => {
//           if (menu.children.length > 0) {
//             menu.children.sort((a: any, b: any) => a.menuName.localeCompare(b.menuName));
//             sortChildren(menu.children);
//           }
//         });
//       };

//       sortChildren(rootMenus);

//       // Step 4: Generate paths recursively
//       const generatePaths = (menus: any[], parentPath = "") => {
//         menus.forEach((menu) => {
//           menu.path = `${parentPath}/${menu.menuName.replace(/\s+/g, "").toLowerCase()}`;
//           if (menu.children.length > 0) {
//             generatePaths(menu.children, menu.path);
//           }
//         });
//       };

//       generatePaths(rootMenus);

//       return rootMenus;
//     };

//     setMenuItems(buildMenuHierarchy(response));
//   };

//   useEffect(() => {
//     fetchMenu(); // Initial fetch
//     console.log("########", JSON.stringify(menuItems));
//     console.log("########", (menuItems));

//     // Listen for permission updates from login
//     const updateMenu = () => fetchMenu();
//     window.addEventListener("permissionsUpdated", updateMenu);

//     return () => window.removeEventListener("permissionsUpdated", updateMenu);
//   }, []);

//   const handleMenuClick = (e: any, item: any) => {
//     const menuId = item.menuId;
//     const menuName = item.menuName;
//     const path = `${item.path}?appId=${menuId}&Appname=${menuName}.aspx`;

//     if (!path) {
//       window.alert("Path Not Found");
//     } else {
//       sessionStorage.setItem("menuId", menuId);
//       sessionStorage.setItem("menuName", menuName);
//       navigate(path);
//     }
//   };


//   return (
//     <div>
//       {location.pathname === "/" ? (
//         <Outlet />
//       ) : (
//         <div>
//           <Box sx={{ display: "flex" }}>
//             <Sidebar items={menuItems} onClick={handleMenuClick} />
//             <Box
//               sx={{
//                 flexGrow: 1,
//                 px: 5,
//                 py: 3,
//                 width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//                 minHeight: "100vh",
//                 backgroundColor: `var(--main-background)`,
//                 backgroundImage: `var(--background-image)`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             >
//               <Toolbar />
//               <Outlet />
//             </Box>
//           </Box>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;




import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import { useEffect, useState } from "react";
import "../common/ThemeStyle.css";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Fetch menu from localStorage and build menu hierarchy
  const fetchMenu = () => {
    const response = JSON.parse(localStorage.getItem("permissions") || "[]");
    const buildMenuHierarchy = (permissions: any[]) => {
      const menuMap = new Map<number, any>();
    
      permissions.forEach((item) => {
        menuMap.set(item.MenuId, {
          menuId: item.MenuId,
          parentId: item.ParentId,
          menuName: item.MenuTitle,
          path: "",
          children: [],
          hasAccess: item.Permission === 1,
          operations: {
            insert: item.InsertOperation === 1,
            update: item.UpdateOperation === 1,
            delete: item.DeleteOperation === 1
          }
        });
      });
    
      let rootMenus: any[] = [];
    
      menuMap.forEach((menu) => {
        if (!menu.hasAccess) return;
        
        if (menu.parentId === null) {
          rootMenus.push(menu);
        } else {
          const parent = menuMap.get(menu.parentId);
          if (parent && parent.hasAccess) {
            parent.children.push(menu);
          }
        }
      });
    
      // Sort root menus by MenuLevel (if available) or alphabetically
      rootMenus.sort((a, b) => 
        a.MenuLevel - b.MenuLevel || 
        a.menuName.localeCompare(b.menuName)
      );
    
      // Sort children and generate paths
      const processMenu = (menus: any[], parentPath = "") => {
        return menus
          .filter(menu => menu.hasAccess)
          .sort((a, b) => a.menuName.localeCompare(b.menuName))
          .map(menu => {
            const path = `${parentPath}/${menu.menuName.replace(/\s+/g, "").toLowerCase()}`;
            return {
              ...menu,
              path,
              children: processMenu(menu.children, path)
            };
          });
      };
    
      return processMenu(rootMenus);
    };
    // const buildMenuHierarchy = (permissions: any[]) => {
    //   const menuMap = new Map<number, any>();

    //   // Step 1: Create a menu map for ID-based access
    //   permissions.forEach((item) => {
    //     menuMap.set(item.ID, {
    //       menuId: item.ID,
    //       parentId: item.ParentID,
    //       menuName: item.Title,
    //       path: "",
    //       children: [],
    //       ordNo: item.OrdNo,
    //     });
    //   });

    //   let rootMenus: any[] = [];

    //   // Step 2: Assign children to their respective parents
    //   menuMap.forEach((menu) => {
    //     if (menu.parentId === null) {
    //       rootMenus.push(menu);
    //     } else {
    //       const parentMenu = menuMap.get(menu.parentId);
    //       if (parentMenu) {
    //         parentMenu.children.push(menu);
    //       }
    //     }
    //   });

    //   // Step 3: Sort menus by OrdNo and sort children alphabetically
    //   rootMenus.sort((a, b) => a.ordNo - b.ordNo);

    //   const sortChildren = (menus: any[]) => {
    //     menus.forEach((menu) => {
    //       if (menu.children.length > 0) {
    //         menu.children.sort((a: any, b: any) => a.menuName.localeCompare(b.menuName));
    //         sortChildren(menu.children);
    //       }
    //     });
    //   };

    //   sortChildren(rootMenus);

    //   // Step 4: Generate paths recursively
    //   const generatePaths = (menus: any[], parentPath = "") => {
    //     menus.forEach((menu) => {
    //       menu.path = `${parentPath}/${menu.menuName.replace(/\s+/g, "").toLowerCase()}`;
    //       if (menu.children.length > 0) {
    //         generatePaths(menu.children, menu.path);
    //       }
    //     });
    //   };

    //   generatePaths(rootMenus);

    //   return rootMenus;
    // };

    setMenuItems(buildMenuHierarchy(response));
  };

  useEffect(() => {
    // Initial fetch of menu items
    fetchMenu();

    // Listen for permission updates from login
    const updateMenu = () => fetchMenu();
    window.addEventListener("permissionsUpdated", updateMenu);

    return () => window.removeEventListener("permissionsUpdated", updateMenu);
  }, []); // Removed `menuItems` dependency to prevent unnecessary re-renders

  const handleMenuClick = (e: any, item: any) => {
    const menuId = item.menuId;
    const menuName = item.menuName;
    const path = `${item.path}?appId=${menuId}&Appname=${menuName}.aspx`;

    if (!path) {
      window.alert("Path Not Found");
    } else {
      sessionStorage.setItem("menuId", menuId);
      sessionStorage.setItem("menuName", menuName);
      navigate(path);
    }
  };

  return (
    <div>
      {location.pathname === "/" ? (
        <Outlet />
      ) : (
        <div>
          <Box sx={{ display: "flex" }}>
            {/* Render Sidebar only after menuItems are loaded */}
            {menuItems.length > 0 && <Sidebar items={menuItems} onClick={handleMenuClick} />}
            <Box
              sx={{
                flexGrow: 1,
                px: 5,
                py: 3,
                width: `calc(100% - ${sizeConfigs.sidebar.width})`,
                minHeight: "100vh",
                backgroundColor: `var(--main-background)`,
                backgroundImage: `var(--background-image)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Toolbar />
              <Outlet />
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default MainLayout;









