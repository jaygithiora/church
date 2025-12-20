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
import { MdClose, MdEdit} from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaCalendarDay, FaPlus } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import moment from "moment";
import ChildrenEventsService from "../../../services/dashboard/children/ChildrenEventsService";

function ChildrenEventsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { enqueueSnackbar } = useSnackbar();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: 0, name: "", description: "", event_date: "",
    })
    const [errors, setErrors] = useState({
        name: "", description: "", event_date: ""
    });

    const [childrenEvents, setChildrenEvents] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getChildrenEvents();
    }, [reload, pages]);

    const getChildrenEvents = async () => {
        setLoading(true);
        const childrenEventsData =
            await ChildrenEventsService.getChildrenEvents(pages, enqueueSnackbar);
        if (childrenEventsData) {
            //console.log(childrenEventsData);
            setChildrenEvents(childrenEventsData.data);
            setTotalPages(childrenEventsData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshChildrenEvents = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditChildEvent = (child) => {
        setFormData({
            ...formData, id: child?.id, name: child?.name, description: child?.description,
            event_date: child?.event_date?moment(child?.event_date).format("YYYY-MM-DD"):""
        });
        handleClickOpen();
    };
    const handleNewChildEvent = () => {
        setFormData({
            ...formData, id: 0, name: "", description: "", event_date: ""
        });
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveChildEvent = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await ChildrenEventsService.addChildEvent(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshChildrenEvents();
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
        }/*
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
        } 
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
                        <FaCalendarDay /> Children Events
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewChildEvent}
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {childrenEvents.length > 0 ? (
                                    childrenEvents.map((childEvent, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{childEvent.name}</TableCell>
                                            <TableCell component="th">{childEvent.description}</TableCell>
                                            <TableCell component="th">
                                                {childEvent.event_date?moment(childEvent.event_date).format("DD MMM, YYYY"):"-"}
                                            </TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(childEvent.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditChildEvent(childEvent)
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
                                                        No <b>Children Events</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>Children Events</b>...
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
                        <FaCalendarDay /> {formData.id > 0 ? "Edit" : "Add"} Child Event
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
                        <Form ref={formRef} onSubmit={handleSaveChildEvent}>
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
                                    {/*errors.name && <div className='invalid-feedback d-block'>{errors.name}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField multiline rows={3}
                                        label="Description"
                                        size="small"
                                        error={errors.description}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        helperText={errors.description}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type="date"
                                        label="Event Date"
                                        size="small"
                                        error={errors.event_date}
                                        value={formData.event_date}
                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        helperText={errors.event_date}
                                    />
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

export default ChildrenEventsPage;
