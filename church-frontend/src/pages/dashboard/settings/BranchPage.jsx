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
import { FaBan, FaPlus } from "react-icons/fa";
import { IoDocumentAttachSharp } from "react-icons/io5";
import { GiPayMoney } from "react-icons/gi";
import BranchesService from "../../../services/dashboard/settings/GenderSettingsService";
import { FaBuildingShield } from "react-icons/fa6";
import CompanySelectComponent from "../../../components/dashboard/settings/CompanySelectComponent";
import { formatDistanceToNow } from "date-fns";
import { Autocomplete } from "@react-google-maps/api";

function BranchPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { loading, setLoading } = useAuth();
  const [reload, setReload] = useState(false);
  const formRef = useRef(null);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState(null);
  const [location, setLocation] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    company: "",
    location: "",
    status: "",
  });

  const [branches, setBranches] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      //setName(place.address_components[1].long_name);
      //console.log('Place:', place);
      //setLocation(place.address_components[0].long_name);
      setLocation(inputRef.current.value);
      setLongitude(place.geometry?.location?.lng());
      setLatitude(place.geometry?.location?.lat());
    }
  };
  useEffect(() => {
    getBranches();
  }, [reload, pages]);

  const getBranches = async () => {
    setLoading(true);
    const branchesData =
      await BranchesService.getBranches(pages);
    if (branchesData) {
      //console.log(branchesData);
      setBranches(branchesData.data);
      setTotalPages(branchesData.last_page);
    }
    setLoading(false);
  };
  // Call this function when new data is added
  const refreshBranches = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const handleEditBranch = (branch) => {
    setId(branch.id);
    setName(branch.name);
    setDescription(branch.description);
    setCompany({ value: branch.company?.id, label: branch.company?.name });
    setLongitude(branch?.longitude);
    setLatitude(branch?.latitude);
    setLocation(branch?.location);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = branch?.location;
      }
    }, 100);
    handleClickOpen();
  };
  const handleNewBranch = () => {
    setId(0);
    setName("");
    setDescription("");
    setStatus("1");
    setCompany(null);
    setLongitude("");
    setLatitude("");
    setLocation("");
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const data = await BranchesService.addBranch(
        id,
        name,
        company?.value,
        description,
        location,
        longitude,
        latitude,
        status
      );
      if (data) {
        handleClose();
        refreshBranches();
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
      errorsCopy.name = "Branch Name is required";
      valid = false;
    }
    if (location) {
      errorsCopy.location = "";
    } else {
      errorsCopy.location = "Location is required";
      valid = false;
    }
    if (company != null) {
      errorsCopy.company = "";
    } else {
      errorsCopy.company = "Company is required";
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
            <FaBuildingShield /> Branches
          </h5>
        </Col>

        <Col sm={3} className="text-end p-3">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewBranch}
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
            <Table sx={{ minWidth: 650 }} aria-label="Branches Table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {branches.length > 0 ? (
                  branches.map((branch, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th">{index + 1}</TableCell>
                      <TableCell component="th">{branch.name}</TableCell>
                      <TableCell component="th">
                        {branch.company.name}
                      </TableCell>
                      <TableCell component="th">
                        {branch.location}
                      </TableCell>
                      <TableCell component="th">
                        {branch.user.firstname} {branch.user.lastname}
                      </TableCell>
                      <TableCell component="th">
                        {formatDistanceToNow(new Date(branch.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell component="th">
                        {!branch.status ? (
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
                            handleEditBranch(branch)
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
                            No <b>Branches</b> yet
                          </Alert>
                        </Box>
                      ) : (
                        <div className="text-center">
                          Loading <b>Branches</b>...
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
                {branches.length > 0 ? branches.map((loan_document, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <Card className='border h-100'>
                            <CardHeader className='border-bottom' avatar={<Avatar className='border-dark'><MdAddShoppingCart className='text-dark' /></Avatar>}
                                title={loan_document.name} subheader={formatDistanceToNow(new Date(loan_document.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent className='p-0'>

                            </CardContent>
                            <CardActions className='border-top pb-3 pt-3'>
                                {!loan_document.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                {loan_document.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
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
            <FaBuildingShield /> {id > 0 ? "Edit" : "Add"} Appointment Settings
          </DialogTitle>
          <DialogContent>
            <Form ref={formRef} onSubmit={handleSaveBranch}>
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
                <Form.Group className="col-sm-12 mb-3">
                  <CompanySelectComponent selectedOption={company} onSelectChange={setCompany} />
                </Form.Group>

                <div className='form-group mb-3'>
                  <Autocomplete options={{
                    componentRestrictions: { country: 'ke' }, strictBounds: true
                  }} onLoad={(autocomplete) => autocompleteRef.current = autocomplete} onPlaceChanged={onPlaceChanged}>
                    <TextField fullWidth type='text' inputRef={inputRef} label="Physical Location"
                      size='small'
                      error={errors.location}
                      helperText={errors.location}
                    />
                  </Autocomplete>
                  {errors.location && <div className='invalid-feedback d-block'>{errors.location}</div>}
                </div>
                <FormGroup className="col-sm-12 mb-3">
                  <TextField
                    label="Description"
                    size="small"
                    multiline
                    error={errors.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    helperText={errors.description}
                  />
                  {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
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

export default BranchPage;
