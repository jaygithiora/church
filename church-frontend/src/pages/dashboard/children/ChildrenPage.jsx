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
    FormHelperText,
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
import { MdClose, MdEdit, MdInventory } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaChild, FaPlus } from "react-icons/fa";
import { FaBuildingShield, FaChildren } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import ChildrenService from "../../../services/dashboard/children/ChildrenService";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import GenderSelectComponent from "../../../components/dashboard/settings/GenderSelectComponent";
import moment from "moment";

function ChildrenPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { enqueueSnackbar } = useSnackbar();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [user, setUser] = useState(null);
    const [gender, setGender] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: 0, firstname: "", lastname: "", gender: "", user: "", date_of_birth: "",
        location: "", longitude: "", latitude: "", status: 1
    })
    const [errors, setErrors] = useState({
        firstname: "", lastname: "", gender: "", user: "", date_of_birth: "",
        location: "", longitude: "", latitude: "", status: ""
    });

    const [children, setChildren] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setFormData({ ...formData, gender: gender?.value, user: user?.value });
    }, [user, gender]);

    useEffect(() => {
        getChildren();
    }, [reload, pages]);

    const getChildren = async () => {
        setLoading(true);
        const childrenData =
            await ChildrenService.getChildren(pages, enqueueSnackbar);
        if (childrenData) {
            //console.log(childrenData);
            setChildren(childrenData.data);
            setTotalPages(childrenData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshchildren = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditChild = (child) => {
        setFormData({
            ...formData, id: child?.id, firstname: child?.first_name, lastname: child?.last_name,
            gender: child?.gender, user: child?.user_id, date_of_birth: child?.date_of_birth,
            location: child?.location, longitude: child?.longitude, latitude: child?.latitude, status: child?.status
        });
        setGender({ value: child?.gender?.id, label: child?.gender?.name });
        setUser({ value: child?.user_id, label: `${child?.user?.firstname} ${child?.user?.lastname} (${child?.user?.phone})` });
        handleClickOpen();
    };
    const handleNewChild = () => {
        setFormData({
            ...formData, id: 0, firstname: "", lastname: "", gender: "", user: "", date_of_birth: "",
            location: "", longitude: "", latitude: "", status: 1
        });
        setGender(null);
        setUser(null);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveChild = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await ChildrenService.addChild(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshchildren();
            }
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (formData.firstname) {
            errorsCopy.firstname = "";
        } else {
            errorsCopy.firstname = "First Name is required";
            valid = false;
        }
        if (formData.lastname) {
            errorsCopy.lastname = "";
        } else {
            errorsCopy.lastname = "Last Name is required";
            valid = false;
        }
        if (formData.date_of_birth) {
            errorsCopy.date_of_birth = "";
        } else {
            errorsCopy.date_of_birth = "Date of Birth is required";
            valid = false;
        }
        if (formData.gender != null) {
            errorsCopy.gender = "";
        } else {
            errorsCopy.gender = "Gender is required";
            valid = false;
        }
        if (formData.user != null) {
            errorsCopy.user = "";
        } else {
            errorsCopy.user = "User is required";
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
                        <FaChildren /> Children
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewChild}
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
                        <Table sx={{ minWidth: 650 }} aria-label="children Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Guardian</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>DOB</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {children.length > 0 ? (
                                    children.map((child, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{child.first_name} {child.last_name}</TableCell>
                                            <TableCell component="th">{child.user?.firstname} {child.user?.lastname} ({child.user?.phone})</TableCell>

                                            <TableCell component="th">
                                                {child?.gender?.name}
                                            </TableCell>
                                            <TableCell component="th">
                                                {moment(child.date_of_birth).format("DD MMM, YYYY")}
                                            </TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(child.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th">
                                                {!child.status ? (
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
                                                        handleEditChild(child)
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
                                                        No <b>Children</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>Children</b>...
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>

                {/* Material-UI Pagination Component */}
                {totalPages > 1 && (
                    <Paper>
                        <Pagination
                            count={totalPages}
                            page={pages}
                            onChange={(event, value) => setPages(value)}
                            color="primary"
                            className="d-flex justify-content-center mt-3"
                        ></Pagination>
                    </Paper>
                )}
                {/*Add Loan Document Modal*/}
                <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                    <DialogTitle>
                        <FaChild /> {formData.id > 0 ? "Edit" : "Add"} Child
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
                            <MdClose />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveChild}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="First Name"
                                        size="small"
                                        error={errors.firstname}
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        helperText={errors.firstname}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Last Name"
                                        size="small"
                                        error={errors.lastname}
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        helperText={errors.lastname}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type="date"
                                        label="Date of Birth"
                                        size="small"
                                        error={errors.date_of_birth}
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                        helperText={errors.date_of_birth}
                                    />
                                </FormGroup>
                                <Form.Group className="col-sm-12 mb-3">
                                    <UserSelectComponent selectedOption={user} onSelectChange={setUser} />
                                    {errors.user && <FormHelperText error>{errors.user}</FormHelperText>}
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                    <GenderSelectComponent selectedOption={gender} onSelectChange={setGender} />
                                    {errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.status}
                                            label="Status"
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            size="small"
                                        >
                                            <MenuItem value={0}>Inactive</MenuItem>
                                            <MenuItem value={1}>Active</MenuItem>
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

export default ChildrenPage;
