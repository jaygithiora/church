import {
  alpha,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
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
import {
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { FaBan, FaPlus, FaUserShield } from "react-icons/fa";
import { useAuth } from "../../../../services/AuthContext";
import RolesService from "../../../../services/dashboard/users/RolesService";
import { MdClose, MdEdit, MdMoreVert } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

function RolesPage() {
  const { loading, setLoading } = useAuth();
  const [roles, setRoles] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState();
  const [canRegister, setCanRegister] = useState(false);
  const [canRegisterBusiness, setCanRegisterBusiness] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const formRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
  });
  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const getRoles = async () => {
      setLoading(true);
      const rolesData = await RolesService.getRoles(pages);
      if (rolesData) {
        setRoles(rolesData.data);
        setTotalPages(rolesData.last_page);
      }
      setLoading(false);
    };
    getRoles();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshRoles = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => {
    setErrors({ name: "" });
    setShowModal(true);
  };
  const handleEditRole = (role) => {
    console.log("Role", role);
    setId(role.id);
    setName(role.name);
    setCanRegister(role.can_self_register);
    setCanRegisterBusiness(role.can_create_company);
    handleShowModal();
  };

  const handleNewRole = () => {
    setId(0);
    setSelectedRole(null);
    setName("");
    setCanRegister(0);
    setCanRegisterBusiness(0);
    handleShowModal();
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await RolesService.addRole(id, name, canRegister, canRegisterBusiness);
      setLoading(false);
      handleCloseModal();
      refreshRoles();
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };
    if (name.trim()) {
      errorsCopy.name = "";
    } else {
      errorsCopy.name = "Name is required!";
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
  const handleMenuClick = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMenu = () => {
    handleMenuClose();
    handleEditRole(selectedRole);
    handleShowModal();
  };

  const handleViewMenu = () => {
    navigate(`/dashboard/users/roles/view/${selectedRole.id}`);
  };
  return (
    <Container fluid>
      <Row>
        <Col className="p-4" xs={8}>
          <h5 className="pb-3">
            <FaUserShield /> Roles
          </h5>
        </Col>
        <Col className="p-4 text-end" xs={4}>
          <Button color="primary" variant="contained" onClick={handleNewRole}>
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
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Can Register</TableCell>
                  <TableCell>Can Register Business</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell><Chip size="small" color={role.can_self_register==1?'primary':'default'} label={role.can_self_register==1?"YES":"NO"}/></TableCell>
                      <TableCell><Chip size="small" color={role.can_create_company==1?'primary':'default'} label={role.can_create_company==1?"YES":"NO"}/></TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(role.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="menu"
                          aria-controls={
                            openMenu ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openMenu ? "true" : undefined}
                          onClick={(e) => handleMenuClick(e, role)}
                        >
                          <MdMoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    /*<Col xs={12} sm={6} md={4} key={index}>
                      <Card className="mb-3 border">
                        <CardHeader
                          avatar={
                            <Avatar aria-label="user" className="border-dark">
                              <FaUserShield className="text-dark" />
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
                              onClick={(e) => handleMenuClick(e, role)}
                            >
                              <MdMoreVert />
                            </IconButton>
                          }
                          title={role.name}
                          subheader={formatDistanceToNow(
                            new Date(role.created_at),
                            { addSuffix: true }
                          )}
                        ></CardHeader>
                        <CardActions className="border-top">
                          <p>
                            Can Self Register:{" "}
                            {role.can_register == 1 && (
                              <Badge bg="primary">Yes</Badge>
                            )}{" "}
                            {role.can_register == 0 && (
                              <Badge bg="secondary">No</Badge>
                            )}
                          </p>
                        </CardActions>
                      </Card>
                    </Col>*/
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      {!loading ? (
                        <div className="alert text-center">
                          <FaBan /> No <b>Roles</b> yet
                        </div>
                      ) : (
                        <div className="alert text-center">
                          Loading...
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {totalPages > 1 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      {/* Material-UI Pagination Component */}
                      <Pagination
                        count={totalPages}
                        page={pages}
                        onChange={(event, value) => setPages(value)}
                        color="primary"
                        className="d-flex justify-content-center"
                      ></Pagination>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
        {/*Role menu */}

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
          <MenuItem onClick={handleViewMenu}>
            <BsEye /> View
          </MenuItem>
        </Menu>
        {/*End Role Menu*/}
        {/*start modal*/}
        <Dialog fullWidth open={showModal} onClose={handleCloseModal}>
          <DialogTitle>
            Role
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <MdClose />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Form ref={formRef} onSubmit={handleSaveRole}>
              <Form.Group className="mb-4">
                <TextField size="small" fullWidth
                  type="text"
                  placeholder="Role Name"
                  label="Role Name"
                  className={`${errors.name ? "is-invalid" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={
                    selectedRole?.name === "Super Admin" ||
                    selectedRole?.name === "User"
                  }
                  error={!!errors.name} // sets red border
                  helperText={errors.name || ""}
                />
                {/*errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )*/}
              </Form.Group>
                  <Form.Group className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Can Register
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={canRegister}
                        label="Can Register"
                        onChange={(e) => setCanRegister(e.target.value)}
                        size="small"
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Register Business/Company
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={canRegisterBusiness}
                        label="Register Business/Company"
                        onChange={(e) => setCanRegisterBusiness(e.target.value)}
                        size="small"
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Form.Group>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="dark" onClick={handleCloseModal}>
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
        {/*End modal*/}
      </Row>
    </Container>
  );
}

export default RolesPage;
