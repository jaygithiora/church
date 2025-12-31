import React from "react";
import { NavLink, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { BsCalendar2Event } from "react-icons/bs";
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import { useThemeMode } from "../services/ThemeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const drawerWidth = 240;
//const navItems = ['Home', 'People', 'Notices', 'Events', 'Spiritual', 'Gallery', 'Articles', 'Shop', 'Donate'];

const GuestLayout = (props) => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const { toggleTheme } = useThemeMode();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CHURCH
      </Typography>
      <Divider />
      <List>
        {/*navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))*/}
      </List>
    </Box>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  const location = useLocation();
  /*if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }*/
  // Only redirect if user is on login or register page and is authenticated
  //const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAuthPage =
    location.pathname === "/login" || location.pathname.startsWith("/register");

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (<>
  
  {!isAuthPage&&<Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar component="nav" elevation={0}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, /*display: { xs: 'none', sm: 'block' } */ }}
        >
          <span>CHURCH</span>
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {/*navItems.map((item) => (
            <Button key={item}>
              {item}
            </Button>
          ))*/}
          <Button className="m-1" component={Link} to="/">Home</Button>
          <Button className="m-1" component={Link} to="/">Contact Us</Button>
          <Button className="m-1" component={Link} to="/login">Login</Button>
          <Button className="m-2" component={Link} to="/register" variant="outlined" color="primary">Register</Button>
          <IconButton onClick={toggleTheme}>
            {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    <nav>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </nav>
    <Toolbar />
  </Box>}
    {/* Guest Navbar */}
    {/*!isAuthPage && <Navbar expand="lg" className="navbar-dark fixed-top shadow-sm">
      <Container className="mt-2 mb-2">
        <Navbar.Brand as={Link} to="/"><img src='/assets/logos/logo.png' style={{ maxWidth: '50px' }} /> medimeet</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to='/' className={({ isActive }) => (isActive ? 'active' : '')}>Home</Nav.Link>
            <Nav.Link as={NavLink} to='/specialists' className={({ isActive }) => (isActive ? "active" : "")}>Specialists</Nav.Link>
            <Nav.Link as={NavLink} to='/ambulances' className={({ isActive }) => (isActive ? 'active' : '')}>Ambulances</Nav.Link>
            {!isAuthenticated && <>
              <Nav.Link as={NavLink} to='/login' className={({ isActive }) => (isActive ? 'active' : '')}>Login</Nav.Link>
              <Nav.Link as={NavLink} to='/register' className={({ isActive }) => (isActive ? 'active' : '')}>Register</Nav.Link></>}
          </Nav>
          {!isAuthenticated &&
            <Nav className="ms-auto">
              <Nav.Link as={Link} to='/specialists'><span className="btn btn-white btn-pill ps-3 pe-3"><BsCalendar2Event /> &nbsp;Book Appointment</span></Nav.Link>

            </Nav>}
          {isAuthenticated &&
            <Nav className="ms-auto">
              <Nav.Link as={Link} to='/dashboard'><span className="btn btn-white btn-pill ps-3 pe-3">Dashboard <FaArrowRight /></span></Nav.Link>
            </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar>*/}

    {/*<GlobalLoaderComponent/>*/}
    {/* Render guest pages */}
    <Outlet />
    {!isAuthPage && <Container fluid className="bg-dark">
      <Row>
        <Col className="text-center text-white p-3">All rights Reserved</Col>
      </Row>
    </Container>}
  </>);
};


GuestLayout.propType = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default GuestLayout;