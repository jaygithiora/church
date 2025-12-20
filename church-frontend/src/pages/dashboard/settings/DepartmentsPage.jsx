import {
  Alert,
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
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
  useTheme,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
//import { formatDistanceToNow } from "date-fns";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaEdit, FaPlus } from "react-icons/fa";
import { IoDocumentAttachSharp } from "react-icons/io5";
import LoanDocumentSettingsService from "../../../services/dashboard/settings/GenderSettingsService";
import { FcDepartment } from "react-icons/fc";
import DepartmentsService from "../../../services/dashboard/settings/DepartmentsService";
import { formatDistanceToNow } from "date-fns";
import CompanySelectComponent from "../../../components/dashboard/settings/CompanySelectComponent";
import BranchSelectComponent from "../../../components/dashboard/settings/BranchSelectComponent";

function DepartmentsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { loading, setLoading } = useAuth();
  const [reload, setReload] = useState(false);
  const formRef = useRef(null);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDecription] = useState("");
  const [company, setCompany] = useState(null);
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    status: "",
  });

  const [departments, setDepartments] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getDepartments();
  }, [reload, pages]);


  const getDepartments = async () => {
    setLoading(true);
    const departmentsData =
      await DepartmentsService.getDepartments(pages);
    if (departmentsData) {
      //console.log(departmentsData);
      setDepartments(departmentsData.data);
      setTotalPages(departmentsData.last_page);
    }
    setLoading(false);
  };
  // Call this function when new data is added
  const refreshDepartments = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const handleEditDepartment = (department) => {
    setId(department.id);
    setName(department.name);
    setDecription(department.description);
    if (department.company != null)
      setCompany({ value: department.company?.id, label: department.company?.name });
    
    const items = department.branch_departments.map((item) => ({
        value: item.branch.id,
        label: item.branch.name,
      }));
      setBranches(items);
    setStatus(department.status);
    handleClickOpen();
  };
  const handleNewDepartment = () => {
    setId(0);
    setName("");
    setDecription("");
    //setCompany(null);
    setBranches([])
    setStatus("1");
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const branchIds = branches.map(option => option.value)
      const data = await DepartmentsService.addDepartment(
        id,
        name,
        description,
        company?.value,
        branchIds,
        status
      );
      if (data) {
        handleClose();
        refreshDepartments();
      }
      setLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (name) {
      errorsCopy.name = "";
    } else {
      errorsCopy.name = "Name is required";
      valid = false;
    } /*
    if (status) {
      errorsCopy.status = "";
    } else {
      errorsCopy.status = "Status is required";
      valid = false;
    }*/
    setErrors(errorsCopy);
    return valid;
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={9} className="p-3">
          <h5>
            <FcDepartment /> Departments
          </h5>
        </Col>

        <Col sm={3} className="text-end p-3">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewDepartment}
          >
            <FaPlus /> ADD
          </Button>
        </Col>
        <Col sm={12}>
                  <TableContainer
                    component={Paper}
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    })}
                  >
            <Table sx={{ minWidth: 650 }} aria-label="Delivery Settings Table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Branches</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {departments.length > 0 ? (
                  departments.map((department, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th">{index + 1}</TableCell>
                      <TableCell component="th">{department.name}</TableCell>
                      <TableCell component="th">
                        {department.company?.name}
                      </TableCell>
                      <TableCell component="th">
                        {department.branch_departments.length > 0?(department.branch_departments.map((branch, i)=>(<Chip key={i}
                            color="primary"
                            variant="outlined"
                            label={branch.branch.name}
                            size="small"
                            className="me-1"
                          ></Chip>))):"No Branches"}
                      </TableCell>
                      <TableCell component="th">
                        {formatDistanceToNow(new Date(department.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell component="th">
                        {!department.status ? (
                          <Chip
                            size="small"
                            sx={{
                              backgroundColor: isDark ? "#6c757d" : "#dee2e6",
                              color: isDark ? "#fff" : "#000",
                            }}
                            label="Inactive"
                          ></Chip>
                        ) : (
                          <Chip
                            color="primary"
                            label="Active"
                            size="small"
                          ></Chip>
                        )}
                      </TableCell>
                      <TableCell component="th" align="right">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleEditDepartment(department)
                          }
                        >
                          <MdEdit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      {!loading ? (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                        >
                          <Alert icon={<FaBan />} severity="warning">
                            No <b>Departments</b> yet
                          </Alert>
                        </Box>
                      ) : (
                        <div className="text-center">
                          Loading <b>Departments</b>...
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
        {/*
                {departments.length > 0 ? departments.map((department, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <Card className='border h-100'>
                            <CardHeader className='border-bottom' avatar={<Avatar className='border-dark'><MdAddShoppingCart className='text-dark' /></Avatar>}
                                title={department.name} subheader={formatDistanceToNow(new Date(department.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent className='p-0'>

                            </CardContent>
                            <CardActions className='border-top pb-3 pt-3'>
                                {!department.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                {department.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
                            </CardActions>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No <b>delivery settings</b> yet</div>
                </Col>)}*/}
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
        {/*Add Loan Document Modal*/}
        <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>
            <FaEdit /> {id > 0 ? "Edit" : "Add"} Department
          </DialogTitle>
          <DialogContent>
            <Form ref={formRef} onSubmit={handleSaveDepartment}>
              <Row className="mt-3">
                <FormGroup className="col-sm-12 mb-3">
                  <TextField
                    label="Name"
                    size="small"
                    error={errors.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText={errors.name}
                  />
                  {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                </FormGroup>
                <FormGroup className="col-sm-12 mb-3">
                  <TextField
                    size="small"
                    label="Description"
                    error={errors.description}
                    value={description}
                    onChange={(e) => setDecription(e.target.value)}
                    multiline
                    helperText={errors.description}
                  />
                  {/*errors.lastname && <div className='invalid-feedback d-block'>{errors.lastname}</div>*/}
                </FormGroup>
                <FormGroup className="col-sm-12 mb-3">
                  <CompanySelectComponent selectedOption={company} onSelectChange={setCompany}/>
                </FormGroup>
                <FormGroup className="col-sm-12 mb-3">
                  <BranchSelectComponent company={company?.value} selectedOption={branches} onSelectChange={setBranches}/>
                </FormGroup>
                <Form.Group className="col-sm-12 mb-3">
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
        {/*End Loan Document Dialog*/}
      </Row>
    </Container>
  );
}

export default DepartmentsPage;
