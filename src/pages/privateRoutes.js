import DashboardCom from "../components/DashboardComponents/DashboardCom";

const userRolesJson = localStorage.getItem("userRoles");
const role = userRolesJson ? JSON.parse(userRolesJson) : {};
const allowedlab = Object.keys(role).includes("technologist");

const ValidateRoute = (currentPath) => {
  console.log("allowedlab", allowedlab);

  let LaboratoryAdmin = [
    "/dashboard",
    "/boostedstories",
    "/stories",
    "/customcommunity",
    "/officialcommunity",
    "/boostedevents",
    "/events",
    "/boostedpost",
    "/allpost",
  ];

  const userRole = localStorage.getItem("userRole") ?? "";
  let allowedRoutes = [];

  if (allowedlab) {
    allowedRoutes = [...allowedRoutes, ...LaboratoryAdmin];
  } else {
    allowedRoutes = [];
  }

  const validate =
    userRole === "superAdmin" ? true : allowedRoutes.includes(currentPath);
  console.log("allowedRoutes", allowedRoutes);
  return validate ? currentPath : "";
};

const ValidUI = (validation) => {
  return role;
};

const DefultRoute = () => {
  console.log("ValidUI()", ValidUI());
  let route = ValidUI();
  switch (route) {
    case "HospitalAdmin":
    case "superAdmin":
    case "LaboratoryAdmin":
    case "PharmacyAdmin":
    case "Doctor":
    case "MedicalEquipmentAdmin":
    case "XrayAdmin":
      return <DashboardCom />;
    default:
      return <DashboardCom />;
  }
};

export { ValidateRoute, ValidUI, DefultRoute };
