import React, { useState } from 'react'
import { Col, Container,Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MdDoorbell, MdOutlineShoppingCart } from 'react-icons/md';
import { Button, IconButton, Stack, Tooltip} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { BsShieldLock } from 'react-icons/bs';
import { useAuth } from '../../services/AuthContext';
import { Account, ThemeSwitcher } from '@toolpad/core';
import { FaBell } from 'react-icons/fa';


function DashboardToolbar() {
  const { logout, setLoading, user, cart,setIsAuthenticated } = useAuth();
  
  const navigator = useNavigate();
  {/*My Profile Menu */ }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    setLoading(true);
    const loggedOut = await logout();
    if(loggedOut){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      setLoading(false);
      setIsAuthenticated(false);
      navigator("/login");
    }else{
    setLoading(false);
    }
  }

  {/*My Notifications Menu */ }
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const openNotification = Boolean(notificationAnchorEl);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {/*<Nav.Link className='rounded-circle p-2'><MdOutlineLightMode /></Nav.Link>*/}
      <IconButton LinkComponent={Link} to='/dashboard/cart'><FaBell size={25} />
        {cart.length > 0 &&<span className="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-primary">
          {cart.length}
          <span className="visually-hidden">Cart Items</span>
        </span>}
      </IconButton>
      <ThemeSwitcher/>
      {/*<Button className='rounded-circle p-2 text-dark'><IoMailOutline />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          9
          <span className="visually-hidden">unread messages</span>
        </span></Button>
      <Button className='rounded-circle p-2' onClick={handleNotificationClick}><FaRegBell /><span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        3
        <span className="visually-hidden">Notifications</span>
      </span></Button>*/}
      <Account/>
      <Tooltip title="Open Profile">
      <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
        <Avatar variant='rounded' src={user?.image != null ? user?.image : '/assets/avatar.jpeg'}/>
      </IconButton>
      </Tooltip>
      {/*Profile Dropdown*/}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileClose}
        onClick={handleProfileClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={(e)=>{navigator("/dashboard/profile")}}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          My Account
        </MenuItem>
        <MenuItem onClick={handleLogout} className='text-danger'>
          <ListItemIcon>
            <Logout fontSize="small" className='text-danger' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {/* End profile dropdown*/}

      {/*Notifications Dropdown*/}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notification-menu"
        open={openNotification}
        onClose={handleNotificationClose}
        onClick={handleNotificationClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'scroll',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className='dropdown_list scroll'>
          <MenuItem className='border-bottom'>
            <Container fluid>
              <Row>
                <Col>
                  <b>Notifications (12)</b>
                </Col>
                {/*<Col xs='2' className='text-end pe-2'><CiSettings /></Col>*/}
              </Row>
            </Container>
          </MenuItem>
          {/*<Divider />*/}
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose} className='border-bottom'>
            <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
            <div className='dropdownInfo p-0'>
              <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br />
                <span className='p-0 text-sky'>few seconds ago</span></h4>
            </div>
          </MenuItem>
        </div>
        <MenuItem className='text-center'>
          <button className='w-100 btn btn-info'>View All Notifications</button>
        </MenuItem>
      </Menu>
      {/* End Notifications dropdown*/}
    </Stack>
  )
}

export default DashboardToolbar;