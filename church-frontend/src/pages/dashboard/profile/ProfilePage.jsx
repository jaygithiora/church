import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormGroup,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Form,
  Offcanvas,
  Row,
} from "react-bootstrap";
import {
  FaAirbnb,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPhone,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { MdClose, MdLock, MdOutlinePhoto, MdPerson } from "react-icons/md";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../../../services/AuthContext";
import ProfileService from "../../../services/dashboard/profile/ProfileService";
import { BsBriefcase } from "react-icons/bs";
import SpecialitiesSelectComponent from "../../../components/dashboard/settings/SpecialitiesSelectComponent";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ProfilePage() {
  const { loading, setLoading, user, updateUser } = useAuth();
  const [value, setValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [reload, setReload] = useState(false);
  const [specialities, setSpecialities] = useState([]);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.roles[0]?.name || "",
    about: "",
    specialities: null
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassord] = useState(false);
  const [showNewPassword, setShowNewPassord] = useState(false);
  const [showConfirmPassword, setShowConfirmPassord] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const [open, setOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    current_password: "",
    confirm_password: "",
    new_password: "",
    about: ""
  });
  useEffect(() => {
    getProfile();
  }, [reload]);

  const getProfile = async () => {
    setLoading(true);
    const profileData =
      await ProfileService.getProfile();
    if (profileData) {
      setProfile(profileData);
    }
    setLoading(false);
  };
  // Call this function when new data is added
  const refreshProfile = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  {
    /*handle image crop*/
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setCrop({
        unit: "%", // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50,
      });
    }
  };

  const getCroppedImage = () => {
    const image = imageRef.current;
    if (!image) {
      formRef.current.requestSubmit();
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Convert % crop values to pixel-based if needed
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob((blob) => {
      setCroppedImage(blob);
      // Wait for state update, then submit the form
      setTimeout(() => {
        formRef.current.requestSubmit();
      }, 100);
    }, "image/jpeg");
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (validateProfileForm()) {
      setLoading(true);

      const specialityIds = specialities.map(option => option.value);

      setFormData({ ...formData, specialities: specialityIds });
      const response = await ProfileService.editProfile(formData);
      if (response) {
        updateUser(response);
      }
      setLoading(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      setLoading(true);
      const updated = await ProfileService.updatePassword(passwordForm);
      if (updated) {
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
      setLoading(false);
    }
  };

  const handleChangeProfilePicture = async (e) => {
    e.preventDefault();
    if (croppedImage != null) {
      setLoading(true);
      const response = await ProfileService.uploadProfile(croppedImage);
      if (response) {
        updateUser(response);
      }
      setLoading(false);
    }
  };

  const validateProfileForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (formData.firstname.trim()) {
      errorsCopy.firstname = "";
    } else {
      errorsCopy.firstname = "First Name is required!";
      valid = false;
    }

    if (formData.lastname.trim()) {
      errorsCopy.lastname = "";
    } else {
      errorsCopy.lastname = "Last Name is required";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  };

  const validatePasswordForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (passwordForm.current_password) {
      errorsCopy.current_password = "";
    } else {
      errorsCopy.current_password = "CurrentPassword is required!";
      valid = false;
    }
    if (passwordForm.new_password) {
      if (passwordForm.new_password.length < 8) {
        errorsCopy.new_password = "Minimum of 8 characters is required!";
        valid = false;
      } else {
        errorsCopy.new_password = "";
      }
    } else {
      errorsCopy.new_password = "New Password is required!";
      valid = false;
    }
    if (passwordForm.confirm_password) {
      errorsCopy.confirm_password = "";
    } else {
      errorsCopy.confirm_password = "Confirm Password is required!";
      valid = false;
    }

    if (passwordForm.new_password != passwordForm.confirm_password) {
      errorsCopy.new_password = "Passwords do not match!";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  };

  return (
    <Container fluid>
      <Row className="mb-5">
        <Col xs={12} className="p-3">
          <h4>
            <MdPerson /> Profile
          </h4>
        </Col>
        {/*}
                <Col xs={3} className='text-end p-3'>
                    <Button variant='contained' color='primary' onClick={handleShowOffcanvas}><FaEdit /> Edit</Button>
                </Col>*/}
        <Col sm={6} md={4}>
          <Card className="h-100 mb-3">
            <CardContent className="text-center">
              <Box position="relative" display="inline-block">
                <Avatar
                  src={
                    user?.image != null
                      ? user.image
                      : "/assets/avatar.jpeg"
                  }
                  sx={{ width: 120, height: 120 }}
                />

                {/* Overlay upload button */}
                <IconButton
                  onClick={handleClickOpen}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "teal",
                    color: "#fff",
                    width: 36,
                    height: 36,
                    border: "2px solid #eee",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                      color: "teal",
                    },
                  }}
                >
                  <MdOutlinePhoto />
                </IconButton>
              </Box>
              <p>
                <b>
                  {user.firstname} {user.lastname}
                </b>
              </p>
              {/*<Divider />
              <span className="text-muted">
                <FaEnvelope className="small" />
                &nbsp; {user.email}
              </span>
              <Divider />
              <span className="text-muted">
                <FaPhone className="small" /> &nbsp;{user.phone}
              </span>
              <Divider />*/}
              <span className="badge bg-primary btn-pill">
                <FaUserShield /> {user.roles[0].name}
              </span>
              <div className="text-center pt-3 d-none">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickOpen}
                >
                  <FaImage /> &nbsp;Change Photo
                </Button>
              </div>
              <Divider
                sx={{
                  borderBottomWidth: "2px", // Thicker line
                }}
                className="mt-3"
              />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <FaUser />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.firstname + " " + user.lastname}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <FaEnvelope />
                  </ListItemAvatar>
                  <ListItemText primary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <FaPhone />
                  </ListItemAvatar>
                  <ListItemText primary={user.phone} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <FaUserShield />
                  </ListItemAvatar>
                  <ListItemText primary={user.roles[0].name} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Col>
        <Col sm={6} md={8}>
          <Card className="h-100 mb-3">
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab
                      iconPosition="start"
                      icon={<MdPerson />}
                      label="My Details"
                    />
                    <Tab
                      iconPosition="start"
                      icon={<MdLock />}
                      label="Change Password"
                    />
                  </Tabs>
                </Box>
              </Box>
              {/*Tabs Content */}

              {/*Details Tab*/}

              <TabPanel value={value} index={0}>
                <Form className="row" onSubmit={handleEditProfile}>
                  <Col sm={6}>
                    <Form.Group className="mb-4">
                      <TextField
                        label="First Name*"
                        fullWidth
                        type="text"
                        size="small"
                        value={formData.firstname}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstname: e.target.value,
                          })
                        }
                        placeholder="First Name"
                        error={errors.firstname}
                        small='small'
                      />
                      {/*errors.firstname && (
                        <div className="invalid-feedback">
                          {errors.firstname}
                        </div>
                      )*/}
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-4">
                      <TextField
                        label="Last Name*"
                        fullWidth
                        type="text"
                        size="small"
                        value={formData.lastname}
                        onChange={(e) =>
                          setFormData({ ...formData, lastname: e.target.value })
                        }
                        placeholder="Last Name"
                        error={errors.lastname}
                        helperText={errors.lastname}
                      />
                      {errors.lastname && (
                        <div className="invalid-feedback">
                          {errors.lastname}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Phone Number<span className="text-danger">*</span>
                      </Form.Label>
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        value={formData.phone}
                        placeholder="Phone Number"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Email Address<span className="text-danger">*</span>
                      </Form.Label>
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        value={formData.email}
                        placeholder="Email Address"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        User Role<span className="text-danger">*</span>
                      </Form.Label>
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        className="border-secondary text-muted"
                        value={formData.role}
                        placeholder="User Role"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <div className="col-sm-12 text-end pt-3">
                    <Button type="submit" variant="contained" color="primary">
                      {loading && (
                        <div
                          className="spinner-border spinner-border-sm text-light"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      &nbsp;{!loading && <FaAirbnb />}Update
                    </Button>
                  </div>
                </Form>
              </TabPanel>
              {/* End Details Tab*/}
              {/*Change password Tab*/}
              <TabPanel value={value} index={1}>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Current Password<span className="text-danger">*</span>
                    </Form.Label>
                    <TextField fullWidth size="small"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          current_password: e.target.value,
                        })
                      }
                      placeholder="Current Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" sx={{ cursor: "pointer" }} onClick={(e) => {
                            setShowCurrentPassord(!showCurrentPassword);
                          }}>
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/*errors.current_password && (
                      <div className="invalid-feedback">
                        {errors.current_password}
                      </div>
                    )*/}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      New Password<span className="text-danger">*</span>
                    </Form.Label>
                    <TextField
                      fullWidth
                      size="small"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          new_password: e.target.value,
                        })
                      }
                      placeholder="New Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" sx={{ cursor: "pointer" }} onClick={(e) => {
                            setShowNewPassord(!showNewPassword);
                          }}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/*errors.new_password && (
                      <div className="invalid-feedback">
                        {errors.new_password}
                      </div>
                    )*/}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Confirm New Password<span className="text-danger">*</span>
                    </Form.Label>
                    <TextField
                      fullWidth
                      size="small"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirm_password: e.target.value,
                        })
                      }
                      placeholder="Confirm New password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" sx={{ cursor: "pointer" }} onClick={(e) => {
                            setShowConfirmPassord(!showConfirmPassword);
                          }}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/*errors.confirm_password && (
                      <div className="invalid-feedback">
                        {errors.confirm_password}
                      </div>
                    )*/}
                  </Form.Group>
                  <div className="text-end pt-3">
                    <Button type="submit" variant="contained" color="primary">
                      <FaAirbnb /> &nbsp;Update Password
                    </Button>
                  </div>
                </Form>
              </TabPanel>
              {/*End Change Password Tab*/}
            </CardContent>
          </Card>
        </Col>

        {/*Prodile Image offCanvas */}
        <Dialog open={open} onClose={handleClose}
          fullWidth
        >
          <DialogTitle>
            <FaImage /> Change Profile Picture
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
            <Form
              className="p-3"
              onSubmit={handleChangeProfilePicture}
              ref={formRef}
            >
              {selectedImage && (
                <>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    keepSelection={true}
                  >
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      onLoad={() => setCrop({ ...crop })}
                      alt="crop"
                    />
                  </ReactCrop>

                  {/*<Button onClick={getCroppedImage}><MdCrop /> Crop</Button>*/}
                </>
              )}
              <Form.Group className="mb-2">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </Form.Group>
              <Form.Group className="pt-3 text-end">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading || selectedImage == null}
                  onClick={getCroppedImage}
                >
                  {loading && (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  &nbsp;{!loading && <FaAirbnb />} Proceed
                </Button>
              </Form.Group>
            </Form>
          </DialogContent>
        </Dialog>
        {/*Prodile offcanvas*/}
      </Row>
    </Container>
  );
}

export default ProfilePage;
