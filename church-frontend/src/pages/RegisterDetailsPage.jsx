import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../services/AuthContext";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import {
  FaAirbnb,
  FaCheckCircle,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { Autocomplete } from "@react-google-maps/api";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import IndexService from "../services/dashboard/IndexService";
import FacilityTypesSelectComponent from "../components/FacilityTypesSelectComponent";



function RegisterDetailsPage() {
  const [steps, setSteps] = useState([
  { label: "Personal Details" },
  { label: "Business Information" },
]);

  const { loading, register, setLoading, isAuthenticated } =
    useAuth();
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: id,

    business_name: "",
    business_description: "",
    location: "",
    longitude: "",
    latitude: "",
    facility_types: "",

    terms_and_conditions: false
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",

    business_name: "",
    business_description: "",
    location: "",
    longitude: "",
    latitude: "",
    facility_types: "",

    terms_and_conditions: "",
  });

  useEffect(() => {
    getRole();
  }, [id]);

  const getRole = async () => {
    setLoading(true);
    const roleData =
      await IndexService.getRole(id);
    if (roleData) {
      //console.log("Role",roleData);
      setRole(roleData);
      if (!roleData.can_create_company) {
        /*if (steps.length > 1) {
          steps.pop();
        }*/

      // remove Business Information step
      setSteps((prev) => prev.filter((_, i) => i === 0));
      }
    }
    setLoading(false);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      //setName(place.address_components[1].long_name);
      //console.log('Place:', place);
      //setLocation(place.address_components[0].long_name);
      setFormData({
        ...formData,
        location:
          inputRef.current?.value ?? place.address_components[0].long_name,
        longitude: place.geometry?.location?.lng(),
        latitude: place.geometry?.location?.lat(),
      });
      setErrors({ ...errors, location: "" });
    }
  };

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  const navigator = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep === 1 && inputRef.current && formData.location) {
      const timeout = setTimeout(() => {
        inputRef.current.value = formData.location;
      }, 100); // give Google time to init
      return () => clearTimeout(timeout);
    }
  }, [activeStep, formData.location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const response = await register(formData, enqueueSnackbar);
      if (response) {

        if (isAuthenticated) {
          navigator("/dashboard");
        } else {
          navigator("/login");
        }
      }
      setLoading(false);
      /*if (isAuthenticated) {
        if (isVerified) {
          navigator("/dashboard");
        } else {
          navigator("/verify/email");
        }
      }*/
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };
    //check step 1
    if (activeStep === 0) {
      if (formData.firstname.trim()) {
        errorsCopy.firstname = "";
      } else {
        errorsCopy.firstname = "First Name is required!";
        valid = false;
        enqueueSnackbar(errorsCopy.firstname, { variant: "error" });
      }
      if (formData.lastname.trim()) {
        errorsCopy.lastname = "";
      } else {
        errorsCopy.lastname = "Last Name is required!";
        valid = false;
        enqueueSnackbar(errorsCopy.lastname, { variant: "error" });
      }

      if (formData.email.trim()) {
        if (!isValidEmail(formData.email)) {
          errorsCopy.email = "Email is not valid!";
          valid = false;
          enqueueSnackbar(errorsCopy.email, { variant: "error" });
        } else {
          errorsCopy.email = "";
        }
      } else {
        errorsCopy.email = "Email is required!";
        valid = false;
        enqueueSnackbar(errorsCopy.email, { variant: "error" });
      }

      if (formData.phone.length >= 5) {
        errorsCopy.phone = "";
      } else {
        errorsCopy.phone = "Phone Number too short!";
        valid = false;
        enqueueSnackbar(errorsCopy.phone, { variant: "error" });
      }
      if (formData.password.trim()) {
        if (formData.password === formData.password_confirmation) {
          errorsCopy.password = "";
        } else {
          errorsCopy.password = "Passwords do not match!";
          valid = false;
          enqueueSnackbar(errorsCopy.password, { variant: "error" });
        }
      } else {
        errorsCopy.password = "Password is required!";
        valid = false;
        enqueueSnackbar(errorsCopy.password, { variant: "error" });
      }
      if (formData.terms_and_conditions) {
        errorsCopy.terms_and_conditions = "";
      } else {
        errorsCopy.terms_and_conditions = "Please Accept terms and conditions!";
        valid = false;
        enqueueSnackbar(errorsCopy.terms_and_conditions, { variant: "error" });
      }
    }
    //check step 2
    if (role?.can_create_company) {
      if (activeStep === 1) {
        if (formData.business_name.trim()) {
          errorsCopy.business_name = "";
        } else {
          errorsCopy.business_name = "Business Name is required!";
          valid = false;
          enqueueSnackbar(errorsCopy.business_name, { variant: "error" });
        }
        if (formData.location.trim()) {
          errorsCopy.location = "";
        } else {
          errorsCopy.location = "Business Location is required!";
          valid = false;
          enqueueSnackbar(errorsCopy.location, { variant: "error" });
        }
      }
    }

    setErrors(errorsCopy);
    return valid;
  };
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Container fluid>
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
      <Row className="main">
        <Col className="white-fade">
          <Container>
            <Row>
              <Col sm={12}>
                <div className="border-0">
                  <div className="auth-login p-sm-5">
                    <img src="/assets/logos/dark-logo-name.png" className="img-fluid logo mb-3" />
                    <p>Welcome, Lets create your <b>{role?.name}</b> profile</p>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel
                          >
                            {/*optional={
                              index === steps.length - 1 ? (
                                <Typography variant="caption">
                                  Last step
                                </Typography>
                              ) : null
                            }*/}
                            <h6>{step.label}</h6>
                          </StepLabel>
                          <StepContent>
                            {/* Step 1*/}
                            <Container
                              fluid
                              className={`${activeStep === 0 ? "" : "d-none"}`}
                            >
                              <Row>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">First Name</FormLabel>
                                  <TextField fullWidth
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={formData.firstname}
                                    className='custom-textfield'
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        firstname: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        firstname: "",
                                      });
                                    }}
                                    error={errors.firstname}
                                    helperText={errors.firstname}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">Last Name</FormLabel>
                                  <TextField fullWidth
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={formData.lastname}
                                    className='custom-textfield'
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        lastname: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        lastname: "",
                                      });
                                    }}
                                    error={errors.lastname}
                                    helperText={errors.lastname}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">Email Address</FormLabel>
                                  <TextField fullWidth
                                    type="email"
                                    placeholder="Email Address"
                                    className='custom-textfield'
                                    value={formData.email}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        email: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        email: "",
                                      });
                                    }}
                                    error={errors.email}
                                    helperText={errors.email}
                                  />
                                  {errors.practice_email && (
                                    <span className="invalid-feedback">
                                      {errors.practice_email}
                                    </span>
                                  )}
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">Phone Number</FormLabel>
                                  <MuiTelInput
                                    fullWidth
                                    defaultCountry="KE"
                                    placeholder="Phone Number"
                                    className='custom-textfield'
                                    value={formData.phone}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        phone: e.replace(/\s+/g, ""),
                                      });
                                      setErrors({
                                        ...errors,
                                        phone: "",
                                      });
                                    }}
                                  ></MuiTelInput>
                                  {errors.phone && (
                                    <span className="invalid-feedback">
                                      {errors.phone}
                                    </span>
                                  )}
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">Password</FormLabel>
                                  <TextField fullWidth
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    className='custom-textfield'
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        password: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        password: "",
                                      });
                                    }}
                                    error={errors.password}
                                    helperText={errors.password}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                  <FormLabel className="mb-1">Confirm Password</FormLabel>
                                  <TextField fullWidth
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.password_confirmation}
                                    className='custom-textfield'
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        password_confirmation: e.target.value,
                                      })
                                    }
                                    required />
                                </Form.Group>
                                <Form.Group className="col-sm-6 col-lg-4 mb-3">
                                  <FormControlLabel
                                    label="Accept Terms & Conditions"
                                    control={
                                      <Checkbox
                                        checked={formData.terms_and_conditions}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            terms_and_conditions: e.target.checked,
                                          })
                                        }
                                        sx={{
                                          color: "#11A74B", // default color when unchecked
                                          "&.Mui-checked": {
                                            color: "#11A74B", // color when checked
                                          },
                                        }}
                                      />
                                    }
                                  />
                                </Form.Group>
                              </Row>
                            </Container>

                            {/* Step 2*/}
                            <Container
                              fluid
                              className={`${activeStep === 1 ? "" : "d-none"}`}
                            >
                              <Row>
                                <Form.Group className="col-sm-12 mb-3">
                                  <FormLabel className='mb-1'>Business Name</FormLabel>
                                  <TextField fullWidth
                                    type="text"
                                    placeholder="Business Name"
                                    value={formData.business_name}
                                    className='custom-textfield'
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        business_name: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        business_name: "",
                                      });
                                    }}
                                    error={errors.business_name}
                                    helperText={errors.business_name}
                                  />
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                  <FormLabel className='mb-1'>Business Description (Optional)</FormLabel>
                                  <TextField fullWidth
                                    type="text"
                                    placeholder="Tell us more about your business"
                                    className='custom-textfield'
                                    multiline
                                    value={formData.business_description}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        business_description: e.target.value,
                                      });
                                      setErrors({
                                        ...errors,
                                        business_description: "",
                                      });
                                    }}
                                    error={errors.business_description}
                                    helperText={errors.business_description}
                                  />
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                  <FormLabel className="mb-1">Business Location</FormLabel>
                                  <Autocomplete
                                    options={{
                                      componentRestrictions: {
                                        country: "ke",
                                      },
                                      strictBounds: true,
                                    }}
                                    onLoad={(autocomplete) =>
                                      (autocompleteRef.current = autocomplete)
                                    }
                                    onPlaceChanged={onPlaceChanged}
                                  >
                                    <TextField
                                      fullWidth
                                      type="text"
                                      inputRef={inputRef}
                                      className='custom-textfield'
                                      placeholder="Business Location"
                                    />
                                  </Autocomplete>
                                  {errors.location && (
                                    <span className="invalid-feedback">
                                      {errors.location}
                                    </span>
                                  )}
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                  <FormLabel className="mb-1">Facility Type</FormLabel>
                                  <FacilityTypesSelectComponent selectedOption={facilityTypes} onSelectChange={setFacilityTypes} isMultiple={true} />
                                  {errors.facility_types && (
                                    <span className="invalid-feedback">
                                      {errors.facility_types}
                                    </span>
                                  )}
                                </Form.Group>
                              </Row>
                            </Container>

                            <Box sx={{ mb: 2 }}>
                              <div className="alert">
                                <Row>
                                  <Col>
                                    <Button
                                      disabled={index === 0}
                                      onClick={handleBack}
                                      sx={{ mt: 1, mr: 1, color: "#11A74B" }}
                                    >
                                      <FaLongArrowAltLeft />
                                      &nbsp; Back
                                    </Button>
                                  </Col>
                                  <Col className="text-end">
                                    <Button
                                      disableElevation
                                      variant="contained"
                                      onClick={(index === steps.length - 1 || !role?.can_create_company) ? handleRegister : handleNext}
                                      sx={{
                                        mt: 1,
                                        mr: 1,
                                        backgroundColor: "#11A74B !important",
                                        color: "#fff",
                                      }}
                                    >
                                      {(index === steps.length - 1 || !role?.can_create_company) ? (
                                        <>
                                          <FaAirbnb /> Finish
                                        </>
                                      ) : (
                                        <>
                                          Next &nbsp;
                                          <FaLongArrowAltRight />
                                        </>
                                      )}
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length && (
                      <Box square elevation={0} sx={{ p: 3 }}>
                        {/* Step 6 Confirmation*/}
                        <Container fluid>
                          <Row>
                            <Form.Group className="col-sm-12">
                              <div className="alert">
                                {/*<strong>You'll almost there!</strong>. This is what you've told us about your practice. Please confirm. If everything is okay. Click Register to proceed!
                                    <hr></hr>*/}
                                <Row>
                                  <Col sm={12}>
                                    <h5 className="mb-3">
                                      <FaCheckCircle /> Confirm Details
                                    </h5>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>First Name</FormLabel>
                                      <br />
                                      {formData.firstname}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Last Name</FormLabel>
                                      <br />
                                      {formData.lastname}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Email Address</FormLabel>
                                      <br />
                                      {formData.email}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Phone Number</FormLabel>
                                      <br />
                                      {formData.phone}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Business Name</FormLabel>
                                      <br />
                                      {formData.business_name}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Business Description</FormLabel>
                                      <br />
                                      {formData.business_description}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Business Location</FormLabel>
                                      <br />
                                      {formData.location}
                                    </Form.Group>
                                  </Col>
                                  <Col sm={6} md={4}>
                                    <Form.Group className="mb-3">
                                      <FormLabel>Facility Types</FormLabel>
                                      <br />
                                      {formData.location}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </div>
                            </Form.Group>
                            <Col>
                              <Button
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1, color: "#11A74B" }}
                              >
                                <FaLongArrowAltLeft />
                                &nbsp; Back
                              </Button>
                            </Col>
                            <Col className="text-end">
                              <Button
                                disableElevation
                                variant="contained"
                                onClick={handleRegister}
                                sx={{
                                  mt: 1,
                                  mr: 1,
                                  backgroundColor: "#11A74B !important",
                                  color: "#fff",
                                }}
                              >
                                <FaAirbnb /> Register
                              </Button>
                            </Col>
                          </Row>
                        </Container>
                      </Box>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterDetailsPage;
