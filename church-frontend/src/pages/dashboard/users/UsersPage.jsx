import {
  alpha,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Badge, Col, Container, Form, Image, Row } from "react-bootstrap";
import { FaBan, FaUserPlus, FaUsers, FaUserShield } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import UsersService from "../../../services/dashboard/users/UsersService";
import RolesSelectComponent from "../../../components/dashboard/users/RolesSelectComponent";
import { formatDistanceToNow } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BsEnvelope, BsEye, BsPhone, BsShieldLock } from "react-icons/bs";
import { MdClose, MdEdit } from "react-icons/md";
import { MuiTelInput } from "mui-tel-input";

function UsersPage() {
  const { loading, setLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(0);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("1");
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const [selectedTag, setSelectedTag] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const formRef = useRef(null);
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
  });
  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const usersData = await UsersService.getUsers(pages);
      if (usersData) {
        setUsers(usersData.data);
        setTotalPages(usersData.last_page);
      }
      setLoading(false);
    };
    getUsers();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshUsers = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEditUser = (user) => {
    setId(user.id);
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
    setPhone(user.phone);
    setSelectedRole({ value: user.roles[0].id, label: user.roles[0].name });
    if (user.user_tag != null) {
      setSelectedTag({ value: user.user_tag.id, label: user.user_tag.name });
    } else {
      setSelectedTag(null);
    }
    setStatus(user.status);
  };

  const handleNewUser = () => {
    setId(0);
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhone("");
    setStatus("1");
    setSelectedRole(null);
    setSelectedTag(null);
    handleClickOpen();
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await UsersService.addUser(
        id,
        firstname,
        lastname,
        email,
        phone,
        selectedRole.value,
        status,
        selectedTag?.value
      );
      setLoading(false);
      //handleCloseModal();
      refreshUsers();
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (firstname.trim()) {
      errorsCopy.firstname = "";
    } else {
      errorsCopy.firstname = "First Name is required!";
      valid = false;
    }
    if (lastname.trim()) {
      errorsCopy.lastname = "";
    } else {
      errorsCopy.lastname = "Last Name is required!";
      valid = false;
    }
    if (phone.trim()) {
      if (phone.length >= 5) {
        errorsCopy.phone = "";
      } else {
        errorsCopy.phone = "Phone Number should be 5 or more digits!";
        valid = false;
      }
    } else {
      errorsCopy.phone = "Phone Number is required!";
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.email = "";
    } else {
      errorsCopy.email = "Email is required!";
      valid = false;
    }
    if (selectedRole != null) {
      errorsCopy.role = "";
    } else {
      errorsCopy.role = "Role is required";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  };

  {
    /* roles menu*/
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMenu = () => {
    handleMenuClose();
    handleEditUser(selectedUser);
    handleClickOpen();
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={9} className="p-3">
          <h5>
            <FaUsers /> Users
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" onClick={handleNewUser}>
            <FaPlus /> Add
          </Button>
        </Col>
        <Col sm={12}>
          <TableContainer
            component={Paper}
            sx={(theme) => ({
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
            })}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      {/*<Col sm={6} md={4} className="p-3" key={index}>
              <Card className="h-100">
                <CardHeader
                  className="border-bottom"
                  avatar={
                    <Avatar aria-label="user" className="border-0">
                      <Image
                        src={
                          user?.image != null
                            ? user.image
                            : "/assets/young-man-avatar.svg"
                        }
                        roundedCircle
                      />
                    </Avatar>
                  }
                  action={
                    <IconButton
                      aria-label="menu"
                      aria-controls={
                        openMenu ? "demo-positioned-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={(e) => handleMenuClick(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={user.firstname + " " + user.lastname}
                  subheader={formatDistanceToNow(new Date(user.created_at), {
                    addSuffix: true,
                  })}
                ></CardHeader>
                <CardContent>
                  <p>
                    <BsEnvelope /> {user.email}
                  </p>
                  <Divider />
                  <p>
                    <BsPhone /> {user.phone}
                  </p>
                  <Divider />
                  <p>
                    <FaUserShield /> {user.roles[0].name}
                  </p>
                  {user.user_tag != null && (
                    <>
                      <Divider />
                      <Badge>{user.user_tag.name}</Badge>
                    </>
                  )}
                </CardContent>
              </Card>
            </Col>*/}
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                user?.image != null
                                  ? user?.image
                                  : "/assets/young-man-avatar.svg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {user?.firstname} ({user?.lastname})
                              </>
                            }
                            secondary={user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(user.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Chip 
                        size="small"
                          label={user.roles[0].name}
                          avatar={
                            <Avatar>
                              <BsShieldLock />
                            </Avatar>
                          }
                          color="success"
                        ></Chip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="menu"
                          aria-controls={
                            openMenu ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openMenu ? "true" : undefined}
                          onClick={(e) => handleMenuClick(e, user)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {!loading ? (
                        <p className="text-center">
                          <FaBan /> No Users yet
                        </p>
                      ) : (
                        <p className="text-center">Loading...</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
        <Col xs={12}>
          {/* Material-UI Pagination Component */}
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={pages}
              onChange={(event, value) => setPages(value)}
              color="primary"
              className="d-flex justify-content-center mt-3"
            ></Pagination>
          )}
          {/*User Menu*/}
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleEditMenu}>
              <MdEdit /> Edit
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <BsEye /> View
            </MenuItem>
          </Menu>
          {/*End Users Menu*/}
          {/*Add User Modal*/}
          <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
            <DialogTitle>
              <FaUserPlus /> Add User
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <MdClose/>
            </IconButton>
            </DialogTitle>
            <DialogContent>
              <Form ref={formRef} onSubmit={handleSaveUser}>
                <Row className="mt-3">
                  <FormGroup className="col-sm-6 mb-3">
                    <TextField
                      label="First Name"
                      size="small"
                      error={errors.firstname}
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      helperText={errors.firstname}
                    />
                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                  </FormGroup>
                  <FormGroup className="col-sm-6 mb-3">
                    <TextField
                      size="small"
                      label="Last Name"
                      error={errors.lastname}
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      helperText={errors.lastname}
                    />
                    {/*errors.lastname && <div className='invalid-feedback d-block'>{errors.lastname}</div>*/}
                  </FormGroup>
                </Row>

                <FormGroup className="mb-3">
                  <MuiTelInput
                    label="Phone Number"
                    error={errors.phone}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    helperText={errors.phone}
                    defaultCountry="KE"
                    size="small"
                    fullWidth
                  />
                  {/*errors.phone && <div className='invalid-feedback d-block'>{errors.phone}</div>*/}
                </FormGroup>

                <FormGroup className="mb-3">
                  <TextField
                    size="small"
                    label="Email Address"
                    error={errors.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText={errors.email}
                  />
                  {/*errors.email && <div className='invalid-feedback d-block'>{errors.email}</div>*/}
                </FormGroup>
                <Row>
                  <Form.Group className="col-sm-6 mb-2">
                    <RolesSelectComponent
                      selectedOption={selectedRole}
                      onSelectChange={setSelectedRole}
                    />
                    {errors.role && (
                      <div className="invalid-feedback d-block">
                        {errors.role}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="col-sm-6 mb-2">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                        size="small"
                      >
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={0}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Form.Group>
                </Row>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="dark" onClick={handleClose}>
                Close
              </Button>
              &nbsp;
              <Button
                disabled={loading}
                variant="contained"
                color="primary"
                onClick={() => formRef.current.requestSubmit()}
              >
                {loading && (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                &nbsp;Save Changes
              </Button>
            </DialogActions>
          </Dialog>
          {/*End user dialog*/}
        </Col>
      </Row>
    </Container>
  );
}

export default UsersPage;
