import * as React from "react";
import { createTheme, alpha, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  //useNavigation,
} from "react-router-dom";
import "../Dashboard.css";
import {
  MdAccessAlarm,
  MdAddShoppingCart,
  MdAdminPanelSettings,
  MdArticle,
  MdDashboard,
  MdEmail,
  MdInventory,
  MdOutlineAttachMoney,
  MdOutlinePayments,
  MdPayment,
  MdPerson,
  MdShop,
} from "react-icons/md";
import {
  FaAmbulance,
  FaBell,
  FaBible,
  FaCalendarDay,
  FaCog,
  FaGenderless,
  FaGetPocket,
  FaHandHolding,
  FaHandHoldingHeart,
  FaPeopleArrows,
  FaPills,
  FaUserAlt,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";
import { FaBoxesPacking, FaChildren, FaCommentSms, FaHandsHoldingChild, FaHandsPraying, FaPeopleGroup, FaUserDoctor } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import DashboardToolbar from "../components/dashboard/DashboardToolbar";
import { useAuth } from "../services/AuthContext";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import {
  Backdrop,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Paper,
} from "@mui/material";
import { PiMicrophoneDuotone, PiMicrophoneStageDuotone, PiNotificationFill} from "react-icons/pi";
import { useMemo } from "react";
import { GoCommentDiscussion } from "react-icons/go";

const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  }, {
    segment: "dashboard/diary",
    title: "Diary",
    icon: <FaCalendarDay />,
    pattern: "dashboard/diary{/:segment}*",
  },{
    segment: "dashboard/order-of-services",
    title: "Order Of Services",
    icon: <PiMicrophoneStageDuotone />,
    pattern: "dashboard/order-of-services{/:segment}*",
  },{
    segment: "dashboard/people",
    title: "People",
    icon: <FaPeopleArrows />,
    pattern: "dashboard/people{/:segment}*",
    children: [{
      segment: "list",
      title: "People",
      icon: <FaPeopleArrows />,
      pattern: "list{/:segment}*",
    }, {
      segment: "members",
      title: "Members",
      icon: <FaPeopleGroup />,
      pattern: "members{/:segment}*",
    },]
  },
  {
    segment: "dashboard/notices",
    title: "Notices",
    icon: <FaBell />,
    pattern: "dashboard/notices{/:segment}*",
  },
  {
    segment: "dashboard/events",
    title: "Events",
    icon: <PiNotificationFill />,
    pattern: "dashboard/events{/:segment}*",
    children: [{
      segment: "list",
      title: "Events",
      icon: <PiNotificationFill />,
      pattern: "list{/:segment}*",
    }, {
      segment: "attendance",
      title: "Attendance",
      icon: <FaCalendarDay />,
      pattern: "attendance{/:segment}*",
    },]
  },
  {
    segment: "dashboard/children",
    title: "Children",
    icon: <FaChildren />,
    pattern: "dashboard/children{/:segment}*",
    children: [{
      segment: "all",
      title: "Children",
      icon: <FaChildren />,
      pattern: "all{/:segment}*",

    }, {
      segment: "events",
      title: "Events",
      icon: <FaCalendarDay />,
      pattern: "events{/:segment}*",
    }, {
      segment: "checkin",
      title: "Check In",
      icon: <FaHandsHoldingChild />,
      pattern: "checkin{/:segment}*",
    }]
  },
  {
    segment: "dashboard/spiritual",
    title: "Spiritual",
    icon: <FaBible />,
    pattern: "dashboard/spiritual{/:segment}*",
    /*permission: "View Products",*/
    children: [
      {
        segment: "sermons",
        title: "Sermons",
        icon: <FaBible />,
        pattern: "sermons{/:segment}*",
        /*permission: "View Products",*/
      },
      {
        segment: "prayers",
        title: "Prayers",
        icon: <FaHandsPraying />,
        pattern: "prayers{/:segment}*",
        //permission: "View Product Promotions",
      },
      {
        segment: "testimonials",
        title: "Testimonials",
        icon: <FaHandHoldingHeart />,
        pattern: "testimonials{/:segment}*",
        //permission: "View Product Promotions",
      },
    ],
  },
  {
    segment: "dashboard/communication",
    title: "Communication",
    icon: <GoCommentDiscussion />,
    pattern: "dashboard/communication{/:segment}*",
    /*permission: "View Products",*/
    children: [
      {
        segment: "emails",
        title: "Emails",
        icon: <MdEmail />,
        pattern: "emails{/:segment}*",
        /*permission: "View Products",*/
      },
      {
        segment: "sms",
        title: "SMS",
        icon: <FaCommentSms />,
        pattern: "sms{/:segment}*",
        /*permission: "View Products",*/
      },
      {
        segment: "schedules",
        title: "Scheduled Messages",
        icon: <MdAccessAlarm />,
        pattern: "schedules{/:segment}*",
        /*permission: "View Products",*/
      },
    ],
  },

  {
    segment: "dashboard/articles",
    title: "Articles",
    icon: <MdArticle />,
    /*permission: "View Products",*/
    pattern: "dashboard/articles{/:segment}*",
  },

  {
    segment: "dashboard/settings",
    title: "Settings",
    icon: <FaCog />,
    permission: "View Settings",
    pattern: "dashboard/settings{/:segment}*",
    children: [
      {
        segment: "payment_modes",
        title: "Payment Modes",
        icon: <MdPayment />,
        pattern: "payment_modes{/:segment}*",
      },
      {
        segment: "fund_sources",
        title: "Fund Sources",
        icon: <MdOutlinePayments />,
        pattern: "fund_sources{/:segment}*",
      },
      {
        segment: "genders",
        title: "Genders",
        icon: <FaGenderless />,
        pattern: "genders{/:segment}*",
      },
      {
        segment: "age-groups",
        title: "Age Groups",
        icon: <FaGetPocket />,
        pattern: "age-groups{/:segment}*",
      },
    ],
  },
  {
    segment: "dashboard/users",
    title: "Users",
    icon: <FaUsers />,
    permission: "View Users",
    pattern: "dashboard/users{/:segment}*",
    children: [
      {
        segment: "all",
        title: "All Users",
        icon: <FiUsers />,
        permission: "View Users",
        pattern: "all{/:segment}*",
      },
      {
        segment: "roles",
        title: "Roles",
        icon: <MdAdminPanelSettings />,
        permission: "View Roles",
        pattern: "roles{/:segment}*",
      },
    ],
  },

  {
    segment: "dashboard/profile",
    title: "Profile",
    icon: <FaUserAlt />,
  },
];

const demoTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.5), // 80% opacity
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          border: "none",
          backdropFilter: "blur(10px)", // optional: glass effect
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(8px)",
        }),
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.15) // lighter alpha in dark mode
            : alpha(theme.palette.background.paper, 0.8), // stronger alpha in light mode
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.15) // lighter alpha in dark mode
            : alpha(theme.palette.background.paper, 0.8), // stronger alpha in light mode
      }),
    },
  },

  typography: {
    fontFamily: "Outfit, serif !important",
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const AuthLayout = () => {
  const { loading, isAuthenticated, isVerified, permissions } = useAuth();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);
  const theme = useTheme();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  /*
  if (!isVerified) {
    return <Navigate to="/verify/phone" replace />;
  }*/
  // Sync the bottom nav with the current route
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const filterNavigation = (navigation, userPermissions) => {
    return navigation.reduce((filtered, item) => {
      // Check if this item requires a permission and if the user has it
      const hasPermission =
        !item.permission || userPermissions.includes(item.permission);

      // If the item has children, filter them too
      let children = [];
      if (item.children && item.children.length > 0) {
        children = filterNavigation(item.children, userPermissions);
      }

      if (hasPermission && children.length > 0) {
        filtered.push({
          ...item,
          children,
        });
      } else if (hasPermission) {
        filtered.push({
          ...item,
          //.children,
        });
      }
      return filtered;
    }, []);
  };
  const filteredNav = filterNavigation(NAVIGATION, permissions);

  const logoSrc = useMemo(() => {
    console.log(theme.palette.mode);
    return theme.palette.mode === 'dark'
      ? '/assets/logos/logo.png'
      : '/assets/logos/logo.png';
  }, [theme.palette.mode]);

  return (
    // preview-start
    <ReactRouterAppProvider
      navigation={filteredNav}
      branding={{
        logo: (
          <img
            src={logoSrc}
            alt="MediMeet"
          />
        ),
        title: "medimeet",
        homeUrl: "/dashboard",
      }}
      theme={demoTheme}
    >
      {loading && (
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1000,
          })}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <DashboardLayout
        slots={{ toolbarActions: DashboardToolbar }}
      /*sidebarExpandedWidth={280}*/
      >
        {/*<GlobalLoaderComponent/>*/}
        <Outlet />
        <div className="mt-5"></div>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
          className="d-block d-sm-none"
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              LinkComponent={Link}
              to="dashboard"
              value="/dashboard"
              label="Dashboard"
              icon={<MdDashboard />}
            />
            <BottomNavigationAction
              LinkComponent={Link}
              to="dashboard/shop"
              value="/dashboard/shop"
              label="Shop"
              icon={<MdShop />}
            />
            <BottomNavigationAction
              LinkComponent={Link}
              to="dashboard/orders"
              value="/dashboard/orders"
              label="Orders"
              icon={<MdAddShoppingCart />}
            />
            {/*<BottomNavigationAction label='Deliveries' icon={<MdMyLocation />} />*/}
            <BottomNavigationAction
              LinkComponent={Link}
              to="dashboard/profile"
              value="/dashboard/profile"
              label="Profile"
              icon={<MdPerson />}
            />
          </BottomNavigation>
        </Paper>
      </DashboardLayout>
    </ReactRouterAppProvider>
    // preview-end
  );
};

export default AuthLayout;
