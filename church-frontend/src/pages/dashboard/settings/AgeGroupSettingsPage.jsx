import {
    Alert,
    alpha,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    IconButton,
    Pagination,
    Paper,
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
import { MdClose, MdEdit, MdOutlinePayment } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaCog, FaEdit, FaGenderless, FaGetPocket, FaPlus } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import AgeGroupSettingsService from "../../../services/dashboard/settings/AgeGroupSettingsService";
import { useSnackbar } from "notistack";

function AgeGroupSettingsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const {enqueueSnackbar} = useSnackbar();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({ id: 0, name: "", age_from:"", age_to:"" });
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        age_from: "",
        age_to: "",
    });

    const [ageGroups, setAgeGroups] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getAgeGroups();
    }, [reload, pages]);

    const getAgeGroups = async () => {
        setLoading(true);
        const ageGroupsData =
            await AgeGroupSettingsService.getAgeGroups(pages, enqueueSnackbar,"");
        if (ageGroups) {
            //console.log(ageGroupsData);
            setAgeGroups(ageGroupsData.data);
            setTotalPages(ageGroupsData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshAgeGroups = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditAgeGroup = (ageGroup) => {
        setFormData({ ...formData, id: ageGroup.id, name: ageGroup.name, description:ageGroup.description,age_from:ageGroup.age_from, age_to:ageGroup.age_to });
        handleClickOpen();
    };
    const handleNewAgeGroup = () => {
        setFormData({ ...formData, id: 0, name: "", description:"",age_from:"", age_to:"" });
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveAgeGroup = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await AgeGroupSettingsService.addAgeGroup(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshAgeGroups();
            }
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (formData.name) {
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
                        <FaGetPocket /> Age Groups
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewAgeGroup}
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
                        <Table sx={{ minWidth: 650 }} aria-label="ageGroups Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {ageGroups.length > 0 ? (
                                    ageGroups.map((ageGroup, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{ageGroup.name}</TableCell>
                                            <TableCell component="th">{ageGroup.description}</TableCell>
                                            <TableCell component="th">{ageGroup.age_from} - {ageGroup.age_to}Yrs</TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(ageGroup.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditAgeGroup(ageGroup)
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
                                                        No <b>Gender</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>Gender</b>...
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
                {ageGroups.length > 0 ? ageGroups.map((loan_document, index) => (
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
                        <FaEdit /> {formData.id > 0 ? "Edit" : "Add"} Age Group
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
                        <Form ref={formRef} onSubmit={handleSaveAgeGroup}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Name"
                                        size="small"
                                        error={errors.name}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        helperText={errors.name}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField multiline
                                        label="Description"
                                        size="small"
                                        error={errors.description}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        helperText={errors.description}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type="number"
                                        label="Age From"
                                        size="small"
                                        error={errors.age_from}
                                        value={formData.age_from}
                                        onChange={(e) => setFormData({ ...formData, age_from: e.target.value })}
                                        helperText={errors.age_from}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type="number"
                                        label="Age To"
                                        size="small"
                                        error={errors.age_to}
                                        value={formData.age_to}
                                        onChange={(e) => setFormData({ ...formData, age_to: e.target.value })}
                                        helperText={errors.age_to}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
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

export default AgeGroupSettingsPage;
