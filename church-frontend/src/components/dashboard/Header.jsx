import React from 'react'
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdMenuOpen, MdOutlineShoppingCart } from 'react-icons/md';
import { MdOutlineMenu } from 'react-icons/md';
import { Button } from '@mui/material';
import SearchBox from './SearchBox';
import { MdDarkMode } from 'react-icons/md';
import { MdOutlineLightMode } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import { IoIosArrowDown } from "react-icons/io";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { BsShieldLock } from 'react-icons/bs';
import { CiSettings } from 'react-icons/ci';


function Header() {
  {/*My Profile Menu */ }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
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
    <>
      <Navbar className="navbar navbar-light bg-light border-bottom fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to='/' className="navbar-brand"><img src='/assets/logos/logo-small.png' className='logo' /> Hifadhi</Navbar.Brand>
          <Navbar.Collapse>
            <Nav className='me-auto d-flex align-items-center'>
              <Nav.Link><Button className='rounded-circle'><MdMenuOpen /></Button></Nav.Link>
              <Nav.Link className='d-none d-md-block'><SearchBox /></Nav.Link>
            </Nav>
            <Nav className='ms-auto d-flex align-items-center'>
              <Nav.Link><Button className='rounded-circle'><MdOutlineLightMode /></Button></Nav.Link>
              <Nav.Link><Button className='rounded-circle'><MdOutlineShoppingCart />{/*<Badge bg='primary'>9</Badge>*/}</Button></Nav.Link>
              <Nav.Link><Button className='rounded-circle'><IoMailOutline /></Button></Nav.Link>
              <Nav.Link><Button className='rounded-circle' onClick={handleNotificationClick}><FaRegBell /></Button></Nav.Link>
              <Button className='user-avatar d-flex align-items-center' onClick={handleProfileClick}>
                <div className='avatar rounded-circle'>
                  <img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' class='img-fluid rounded-circle' />
                </div>
                <div class='user-info ps-2 small d-none d-sm-block'>
                  <b>James Githiora</b><br />
                  {/*<p class='text-muted m-0'>jaygithiora@gmail.com</p>*/}
                </div>
              </Button>
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
                <MenuItem onClick={handleProfileClose}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  My Account
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  <ListItemIcon>
                    <BsShieldLock fontSize="small" />
                  </ListItemIcon>
                  Reset Password
                </MenuItem>
                <MenuItem onClick={handleProfileClose} className='text-danger'>
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
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose} className='border-bottom'>
                  <Avatar><img src='https://mironcoder-hotash.netlify.app/images/avatar/01.webp' className='img-fluid rounded-circle' /></Avatar>
                  <div className='dropdownInfo p-0'>
                    <h4 className='p-0'><b>James</b> has added a new photo and its smoking hoooot...<br/>
                    <span className='p-0 text-sky'>few seconds ago</span></h4>
                  </div>
                </MenuItem>
                </div>
                <MenuItem className='text-center'>
                <button className='w-100 btn btn-info'>View All Notifications</button>
                </MenuItem>
              </Menu>
              {/* End Notifications dropdown*/}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header;