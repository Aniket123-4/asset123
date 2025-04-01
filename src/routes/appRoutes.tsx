
import UserPermission from "../pages/Admin/UserPermission/UserPermission";
import MenuCreate from "../pages/Admin/MenuCreate/MenuCreate";
// import MenuMaster from "../pages/master/Menu/MenuMaster";
// import MenuMasterAdd from "../pages/master/Menu/MenuMasterAdd";
// import MenuMasterEdit from "../pages/master/Menu/MenuMasterEdit";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../loginPage/LoginPage";
import { RouteType } from "./config";
import HomeIcon from "@mui/icons-material/Home";
import DashboardPageLayout from "../pages/master/MasterPageLayout";
import DashboardIndex from "../pages/master/MasterPageIndex";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ZoneMaster from "../pages/master/ZoneMaster/ZoneMaster";
import WardMaster from "../pages/master/WardMaster/WardMaster";
import DepartmentMaster from "../pages/master/DepartmentMaster/DepartmentMaster";
import StateMaster from "../pages/master/StateMaster/StateMaster";
import CountryMaster from "../pages/master/CountryMaster/CountryMaster";
import CityMaster from "../pages/master/CityMaster/CityMaster";
import Organization from "../pages/Admin/Organization/Organization";
import Roles from "../pages/Admin/Roles/Roles";


import OrganizationEdit from "../pages/Admin/Organization/OrganizationEdit";
import OrganizationAdd from "../pages/Admin/Organization/OrganizationAdd";


import AssetType from "../pages/AssetManagement/AssetType/AssetType";
import DepreciationRule from "../pages/AssetManagement/DepreciationRule/DepreciationRule";
import AssetInformation from "../pages/AssetDescription/AssetInformation/AssetInformation";
import GeneralInformation from "../pages/AssetDescription/GeneralInformation/GeneralInformation";
import PurchaseDetail from "../pages/AssetDescription/PurchaseDetail/PurchaseDetail";
import Status from "../pages/AssetDescription/Status/Status";
import AssetLocation from "../pages/AssetDescription/AssetLocation/AssetLocation";
import LicensingInsuranceMaster from "../pages/AssetDescription/LicensingInsuranceMaster/LicensingInsuranceMaster";
import AddLicensingInsuranceMaster from "../pages/AssetDescription/LicensingInsuranceMaster/AddLicensingInsuranceMaster";
import EditLicensingInsuranceMaster from "../pages/AssetDescription/LicensingInsuranceMaster/EditLicensingInsuranceMaster";
import MaintainanceWarrantyMaster from "../pages/AssetDescription/MaintainanceWarrantyMaster/MaintainanceWarrantyMaster";
import AddMaintainanceWarrantyMaster from "../pages/AssetDescription/MaintainanceWarrantyMaster/AddMaintainanceWarrantyMaster";
import EditMaintainanceWarrantyMaster from "../pages/AssetDescription/MaintainanceWarrantyMaster/EditMaintainanceWarrantyMaster";
import UtilizationLog from "../pages/AssetDescription/UtilizationLog/UtilizationLog";
import AddUtilizationLog from "../pages/AssetDescription/UtilizationLog/AddUtilizationLog";
import EditUtilizationLog from "../pages/AssetDescription/UtilizationLog/EditUtilizationLog";
import BreakDown from "../pages/AssetDescription/BreakDown/BreakDown";
import AssetDetail from "../pages/AssetManagement/AssetDetail/AssetDetail";
import BulkAssetDetail from "../pages/AssetManagement/BulkAssetDetail/BulkAssetDetail";
import AssetIssueReturn from "../pages/AssetManagement/AssetIssueReturn/AssetIssueReturn";
import EditAssetIssueReturn from "../pages/AssetManagement/AssetIssueReturn/EditAssetIssueReturn";
import CreateAssetIssueReturn from "../pages/AssetManagement/AssetIssueReturn/CreateAssetIssueReturn";
import ChangePassword from "../pages/Admin/ChangePassword/ChangePassword";
import PageSetup from "../pages/Admin/PageSetup/PageSetup";
import HelpCreation from "../pages/Admin/HelpCreation/HelpCreation";
import AssetDynamicReport from "../pages/Reports/AssetDynamicReport/AssetDynamicReport";
import AssetIssueReturnReport from "../pages/Reports/AssetIssueReturnReport/AssetIssueReturnReport";
import ConditionalAssetReport from "../pages/Reports/ConditionalAssetReport/ConditionalAssetReport";
import DepreciationReport from "../pages/Reports/DepreciationReport/DepreciationReport";
import StaffReport from "../pages/Reports/StaffReport/StaffReport";
import StaffReportOnSelectedField from "../pages/Reports/StaffReportOnSelectedField/StaffReportOnSelectedField";
import EmployeeMaster from "../pages/StaffInfo/EmployeeMaster/EmployeeMaster";
import UserCreation from "../pages/Admin/UserCreation/UserCreation";
import LocationMaster from "../pages/master/LocationMaster/LocationMaster";
import AssetGeoLocationReport from "../pages/Reports/AssetGeoLocationReport/AssetGeoLocationReport";
import React from "react";


const appRoutes: RouteType[] = [
  {
    index: true,
    element: <LoginPage />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },



  {
    path: "/admin",
    element: <DashboardPageLayout />,
    state: "Admin",
    sidebarProps: {
      displayText: "Admin",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Admin.index",
      },

      {
        path: "/admin/masters",
        element: <DashboardPageLayout />,
        state: "admin.masters",
        sidebarProps: {
          displayText: "Masters",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "master.index",
          },

          {
            path: "/admin/masters/Zone",
            element: <ZoneMaster />,
            state: "master.ZoneMaster",
            sidebarProps: {
              displayText: "Zone Master",
            },
          },
          {
            path: "/admin/masters/Ward",
            element: <WardMaster />,
            state: "master.WardMaster",
            sidebarProps: {
              displayText: "Ward Master",
            },
          },
          {
            path: "/admin/masters/Department",
            element: <DepartmentMaster />,
            state: "master.DepartmentMaster",
            sidebarProps: {
              displayText: "Department Master",
            },
          },
        
          {
            path: "/admin/masters/City",
            element: <CityMaster />,
            state: "master.CityMaster",
            sidebarProps: {
              displayText: "District",
            },
          },
          {
            path: "/admin/masters/State",
            element: <StateMaster />,
            state: "master.StateMaster",
            sidebarProps: {
              displayText: "State",
            },
          },
          
          {
            path: "/admin/masters/Country",
            element: <CountryMaster />,
            state: "master.CountryMaster",
            sidebarProps: {
              displayText: "Country",
            },
          },
          {
            path: "/admin/masters/location",
            element: <LocationMaster />,
            state: "master.LocationMaster",
            sidebarProps: {
              displayText: "Location Master",
            },
          },

        ],

      },

      {
        path: "/admin/security",
        element: <DashboardPageLayout />,
        state: "admin.masters",
        sidebarProps: {
          displayText: "Masters",
          icon: <DashboardOutlinedIcon />,
        },
        child: [
          {
            index: true,
            element: <DashboardIndex />,
            state: "master.index",
          },
          {
            path: "/admin/security/changepassword",
            element: <ChangePassword />,
            state: "Admin.ChangePassword",
            sidebarProps: {
              displayText: "ChangePassword",
            },
          },
          {
            path: "/admin/security/rolecreation",
            element: <Roles />,
            state: "Admin.Roles",
            sidebarProps: {
              displayText: "Roles",
            },
          },
          {
            path: "/admin/security/permission",
            element: <UserPermission />,
            state: "Admin.security.permission",
            sidebarProps: {
              displayText: "permission",
            },
          },
          {
            path: "/admin/security/usercreation",
            element: <UserCreation />,
            state: "Admin.security.usercreation",
            sidebarProps: {
              displayText: "usercreation",
            },
          },

        ]
      },



      // {
      //   path: "/admin/UserCreation",
      //   element: <UserCreation />,
      //   state: "Admin.UserCreation",
      //   sidebarProps: {
      //     displayText: "UserCreation",
      //   },
      // },
      // {
      //   path: "/admin/PageSetup",
      //   element: <PageSetup />,
      //   state: "Admin.PageSetup",
      //   sidebarProps: {
      //     displayText: "PageSetup",
      //   },
      // },
      // {
      //   path: "/admin/MenuCreate",
      //   element: <MenuCreate />,
      //   state: "Admin.MenuCreate",
      //   sidebarProps: {
      //     displayText: "MenuCreate",
      //   },
      // },
      // {
      //   path: "/admin/HelpCreation",
      //   element: <HelpCreation />,
      //   state: "Admin.HelpCreation",
      //   sidebarProps: {
      //     displayText: "HelpCreation",
      //   },
      // },
      // {
      //   path: "/admin/UserPermission",
      //   element: <UserPermission />,
      //   state: "Admin.userpremission",
      //   sidebarProps: {
      //     displayText: "userpremission",
      //   },
      // },
      // {
      //   path: "/admin/Organization",
      //   element: <Organization />,
      //   state: "Admin.organization",
      //   sidebarProps: {
      //     displayText: "Organization",
      //   },
      // },

      // {
      //   path: "/admin/OrganizationAdd",
      //   element: <OrganizationAdd />,
      //   state: "Admin.OrganizationAdd",
      // },
      // {
      //   path: "/admin/OrganizationEdit",
      //   element: <OrganizationEdit />,
      //   state: "Admin.OrganizationEdit",
      // },
      // {
      //   path: "/admin/Roles",
      //   element: <Roles />,
      //   state: "Admin.Roles",
      //   sidebarProps: {
      //     displayText: "Roles",
      //   },
      // },


    ]
  },



  // asset management start
  {
    path: "/AssetManagement",
    element: <DashboardPageLayout />,
    state: "AssetManagement",
    sidebarProps: {
      displayText: "AssetManagement",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        path: "/AssetManagement/AssetType",
        element: <AssetType />,
        state: "AssetManagement.AssetType",
        sidebarProps: {
          displayText: "AssetType",
        },
      },
      {
        path: "/AssetManagement/DepreciationRule",
        element: <DepreciationRule />,
        state: "AssetManagement.DepreciationRule",
        sidebarProps: {
          displayText: "DepreciationRule",
        },
      },
      {
        path: "/AssetManagement/AssetDetail",
        element: <AssetDetail />,
        state: "AssetManagement.AssetDetail",
        sidebarProps: {
          displayText: "AssetDetail",
        },
      },
      {
        path: "/AssetManagement/BulkAssetDetail",
        element: <BulkAssetDetail />,
        state: "AssetManagement.BulkAssetDetail",
        sidebarProps: {
          displayText: "BulkAssetDetail",
        }
      },

      {
        path: "/AssetManagement/assetissue/return",
        element: <AssetIssueReturn />,
        state: "AssetManagement.AssetIssueReturn",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/assetinformation",
        element: <AssetInformation />,
        state: "AssetManagement.assetinformation",
        sidebarProps: {
          displayText: "Asset Information",
        },
      },
      {
        path: "/AssetManagement/assetlocation",
        element: <AssetLocation />,
        state: "AssetManagement.assetlocation",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/breakdown",
        element: <BreakDown />,
        state: "AssetManagement.breakdown",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/bulkassetdetails",
        element: <BulkAssetDetail />,
        state: "AssetManagement.bulkassetdetails",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/generalinformation",
        element: <GeneralInformation />,
        state: "AssetManagement.generalinformation",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/licensing/insurance",
        element: <LicensingInsuranceMaster />,
        state: "AssetManagement.licensing/insurance",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/maintenance/warranty",
        element: <MaintainanceWarrantyMaster />,
        state: "AssetManagement.maintenance/warranty",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/purchasedetail",
        element: <PurchaseDetail />,
        state: "AssetManagement.purchasedetail",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/status",
        element: <Status />,
        state: "AssetManagement.status",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/utilizationlog",
        element: <UtilizationLog />,
        state: "AssetManagement.utilizationlog",
        sidebarProps: {
          displayText: "AssetIssue/Return",
        },
      },
      {
        path: "/AssetManagement/CreateAssetIssueReturn",
        element: <CreateAssetIssueReturn />,
        state: "AssetManagement.CreateAssetIssueReturn",
      },
      {
        path: "/AssetManagement/EditAssetIssueReturn",
        element: <EditAssetIssueReturn />,
        state: "AssetManagement.EditAssetIssueReturn",
      },


      
    ],
  },


  // asset information start

  // {
  //   path: "/AssetDescription",
  //   element: <DashboardPageLayout />,
  //   state: "AssetDescription",
  //   sidebarProps: {
  //     displayText: "AssetDescription",
  //     icon: <DashboardOutlinedIcon />,
  //   },
  //   child: [
  //     {
  //       path: "/AssetDescription/AssetInformation",
  //       element: <AssetInformation />,
  //       state: "AssetDescription.AssetInformation",
  //       sidebarProps: {
  //         displayText: "AssetInformation",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/GeneralInformation",
  //       element: <GeneralInformation />,
  //       state: "AssetDescription.GeneralInformation",
  //       sidebarProps: {
  //         displayText: "GeneralInformation",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/PurchaseDetail",
  //       element: <PurchaseDetail />,
  //       state: "AssetDescription.PurchaseDetail",
  //       sidebarProps: {
  //         displayText: "PurchaseDetail",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/Status",
  //       element: <Status />,
  //       state: "AssetDescription.Status",
  //       sidebarProps: {
  //         displayText: "Status",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/BreakDown",
  //       element: <BreakDown />,
  //       state: "AssetDescription.BreakDown",
  //       sidebarProps: {
  //         displayText: "BreakDown",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/AssetLocation",
  //       element: <AssetLocation />,
  //       state: "AssetDescription.AssetLocation",
  //       sidebarProps: {
  //         displayText: "AssetLocation",
  //       },
  //     },


  //     {
  //       path: "/AssetDescription/LicensingInsuranceMaster",
  //       element: <LicensingInsuranceMaster />,
  //       state: "AssetDescription.LicensingInsuranceMaster",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/AddLicensingInsuranceMaster",
  //       element: <AddLicensingInsuranceMaster />,
  //       state: "AssetDescription.AddLicensingInsuranceMaster",
  //     },
  //     {
  //       path: "/AssetDescription/EditLicensingInsuranceMaster",
  //       element: <EditLicensingInsuranceMaster />,
  //       state: "AssetDescription.EditLicensingInsuranceMaster",
  //     },
  //     {
  //       path: "/AssetDescription/MaintainanceWarrantyMaster",
  //       element: <MaintainanceWarrantyMaster />,
  //       state: "AssetDescription.MaintainanceWarrantyMaster",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/AddMaintainanceWarrantyMaster",
  //       element: <AddMaintainanceWarrantyMaster />,
  //       state: "AssetDescription.AddMaintainanceWarrantyMaster",
  //     },
  //     {
  //       path: "/AssetDescription/EditMaintainanceWarrantyMaster",
  //       element: <EditMaintainanceWarrantyMaster />,
  //       state: "AssetDescription.EditMaintainanceWarrantyMaster",
  //     },
  //     {
  //       path: "/AssetDescription/UtilizationLog",
  //       element: <UtilizationLog />,
  //       state: "AssetDescription.UtilizationLog",
  //       sidebarProps: {
  //         displayText: "Licensing/Insurance",
  //       },
  //     },
  //     {
  //       path: "/AssetDescription/AddUtilizationLog",
  //       element: <AddUtilizationLog />,
  //       state: "AssetDescription.AddUtilizationLog",
  //     },
  //     {
  //       path: "/AssetDescription/EditUtilizationLog",
  //       element: <EditUtilizationLog />,
  //       state: "AssetDescription.EditUtilizationLog",
  //     },
  //     {
  //       path: "/AssetDescription/DepreciationRule",
  //       element: <DepreciationRule />,
  //       state: "AssetDescription.DepreciationRule",
  //       sidebarProps: {
  //         displayText: "DepreciationRule",
  //       },
  //     },

  //   ],
  // },
  {
    path: "staffinfo.",
    element: <DashboardPageLayout />,
    state: "StaffInfo",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "StaffInfo.index",
      },
      {
        path: "/staffinfo./staff/employeemaster",
        element: <EmployeeMaster />,
        state: "StaffInfo.EmployeeMaster",
        sidebarProps: {
          displayText: "EmployeeMaster",
        }
      },
    ]
  },

  {
    path: "/Reports",
    element: <DashboardPageLayout />,
    state: "Reports",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Reports.index",
      },

      {
        path: "/Reports/AssetDynamicReport",
        element: <AssetDynamicReport />,
        state: "Reports.AssetDynamicReport",
        sidebarProps: {
          displayText: "AssetDynamicReport",
        }
      },
      {
        path: "/Reports/AssetGeoLocationReport",
        element: <AssetGeoLocationReport />,
        state: "Reports.AssetGeoLocationReport",
        sidebarProps: {
          displayText: "AssetGeoLocationReport",
        }
      },
      {
        path: "/Reports/assetissue/returnreport",
        element: <AssetIssueReturnReport />,
        state: "Reports.AssetIssueReturnReport",
        sidebarProps: {
          displayText: "AssetIssueReturnReport",
        }
      },
      {
        path: "/Reports/ConditionalAssetReport",
        element: <ConditionalAssetReport />,
        state: "Reports.ConditionalAssetReport",
        sidebarProps: {
          displayText: "ConditionalAssetReport",
        }
      },
      {
        path: "/Reports/DepreciationReport",
        element: <DepreciationReport />,
        state: "Reports.DepreciationReport",
        sidebarProps: {
          displayText: "DepreciationReport",
        }
      },
      {
        path: "/Reports/StaffReport",
        element: <StaffReport />,
        state: "Reports.StaffReport",
        sidebarProps: {
          displayText: "StaffReport",
        }
      },
      {
        path: "/Reports/StaffReportOnSelectedField",
        element: <StaffReportOnSelectedField />,
        state: "Reports.StaffReportOnSelectedField",
        sidebarProps: {
          displayText: "StaffReportOnSelectedField",
        }
      },
    ],
  },

];


export default appRoutes;

