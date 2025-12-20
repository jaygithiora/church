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
import { MdClose, MdEdit } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaChild, FaPlus } from "react-icons/fa";
import { FaChildren, FaHandsHoldingChild } from "react-icons/fa6";
import { formatDistanceToNow, set } from "date-fns";
import { useSnackbar } from "notistack";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import GenderSelectComponent from "../../../components/dashboard/settings/GenderSelectComponent";
import moment from "moment";
import ChildrenCheckInService from "../../../services/dashboard/children/ChildrenCheckinService";
import ChildrenSelectComponent from "../../../components/dashboard/children/ChildrenSelectComponent";
import dayjs from "dayjs";
import ChildrenEventsSelectComponent from "../../../components/dashboard/children/ChildrenEventsSelectComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function ChildrenCheckInPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { enqueueSnackbar } = useSnackbar();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [child, setChild] = useState(null);
    const [childEvent, setChildEvent] = useState(null);
    const [checkinTime, setCheckinTime] = useState(dayjs());
    const [checkoutTime, setCheckoutTime] = useState();

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: 0, child: "", child_event: "", check_in_time: "", check_out_time: ""
    });

    const [errors, setErrors] = useState({
        child: "", child_event: "", check_in_time: "", check_out_time: ""
    });

    const [childrenCheckin, setChildrenCheckin] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setFormData({ ...formData, child: child?.value, child_event: childEvent?.value, check_in_time: checkinTime.format("YYYY-MM-DD HH:mm:ss"), check_out_time: checkoutTime != null ? checkoutTime.format("YYYY-MM-DD HH:mm:ss") : "" });
    }, [child, childEvent, checkinTime, checkoutTime]);


    useEffect(() => {
        getChildrenCheckIns();
    }, [reload, pages]);

    const getChildrenCheckIns = async () => {
        setLoading(true);
        const childrenData =
            await ChildrenCheckInService.getChildrenCheckIns(pages, enqueueSnackbar);
        if (childrenData) {
            //console.log(childrenData);
            setChildrenCheckin(childrenData.data);
            setTotalPages(childrenData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshChildrenCheckin = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditChildCheckIn = (childCheckin) => {
        setFormData({
            ...formData, id: childCheckin?.id, child: childCheckin?.child_id, child_event: childCheckin?.child_event_id,
            check_in_time: moment(childCheckin?.check_in_time).format("YYYY-MM-DD HH:mm:ss"), check_out_time: childCheckin?.check_out_time != null ? moment(childCheckin?.check_out_time).format("YYYY-MM-DD HH:mm:ss") : "",
        });
        setCheckinTime(dayjs(moment(childCheckin?.check_in_time)));
        setCheckoutTime(childCheckin?.check_out_time != null ? dayjs(moment(childCheckin?.check_out_time)) : dayjs());
        setChildEvent({ value: childCheckin?.child_event?.id, label: childCheckin?.child_event?.name });
        setChild({ value: childCheckin?.child?.id, label: `${childCheckin?.child?.first_name} ${childCheckin?.child?.last_name}` });
        handleClickOpen();
    };
    const handleNewChildCheckIn = () => {
        setFormData({
            ...formData, id: 0, child: "", child_event: "", check_in_time: "", check_out_time: "",
        });
        setChildEvent(null);
        setChild(null);
        setCheckinTime(dayjs());
        setCheckoutTime(null);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveChildCheckIn = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await ChildrenCheckInService.addChildCheckIn(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshChildrenCheckin();
            }
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (formData.child) {
            errorsCopy.child = "";
        } else {
            errorsCopy.child = "Child is required";
            valid = false;
        }
        if (formData.child_event) {
            errorsCopy.child_event = "";
        } else {
            errorsCopy.child_event = "Child Event is required";
            valid = false;
        }
        if (formData.check_in_time) {
            errorsCopy.check_in_time = "";
        } else {
            errorsCopy.check_in_time = "Check In Time is required";
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
                        <FaHandsHoldingChild /> Children Check-Ins
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewChildCheckIn}
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
                        <Table sx={{ minWidth: 650 }} aria-label="childrenCheckin Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell>Guardian</TableCell>
                                    <TableCell>Time In</TableCell>
                                    <TableCell>Time Out</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {childrenCheckin.length > 0 ? (
                                    childrenCheckin.map((childCheckin, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-childCheckin td, &:last-childCheckin th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{childCheckin.child.first_name} {childCheckin.child.last_name}</TableCell>
                                            
                                            <TableCell component="th">
                                                {childCheckin?.child_event?.name}
                                            </TableCell>
                                            <TableCell component="th">{childCheckin.child.user.firstname} {childCheckin.child.user.lastname} ({childCheckin.child.user.phone})</TableCell>

                                            <TableCell component="th">
                                                {moment(childCheckin.check_in_time).format("DD MMM, YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell component="th">
                                                {childCheckin.check_out_time?moment(childCheckin.check_out_time).format("DD MMM, YYYY hh:mm A"):"-"}
                                            </TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(childCheckin.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditChildCheckIn(childCheckin)
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
                        <FaHandsHoldingChild /> {formData.id > 0 ? "Edit" : "Add"} Child Check-In
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
                        <Form ref={formRef} onSubmit={handleSaveChildCheckIn}>
                            <Row className="mt-3">
                                <Form.Group className="col-sm-12 mb-3">
                                    <ChildrenSelectComponent selectedOption={child} onSelectChange={setChild} />
                                    {errors.child && <FormHelperText error>{errors.child}</FormHelperText>}
                                </Form.Group>
                                <Form.Group className="col-sm-12 mb-3">
                                    <ChildrenEventsSelectComponent selectedOption={childEvent} onSelectChange={setChildEvent} />
                                    {errors.child_event && <FormHelperText error>{errors.child_event}</FormHelperText>}
                                </Form.Group>
                                <FormGroup className="col-sm-12 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Check-in Time"
                                            value={checkinTime}
                                            onChange={(newValue) => setCheckinTime(newValue)}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                },
                                            }} disablePast
                                        />
                                    </LocalizationProvider>
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Check-out Time"
                                            value={checkoutTime}
                                            onChange={(newValue) => setCheckoutTime(newValue)}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                },
                                            }} disablePast
                                        />
                                    </LocalizationProvider>
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

export default ChildrenCheckInPage;
