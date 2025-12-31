import {
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaBan, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { MdAdd, MdClose, MdEdit, MdMail } from "react-icons/md";
import { useSnackbar } from "notistack";
import moment from "moment";
import { BsCalendar2 } from "react-icons/bs";
import EventsService from "../../../services/dashboard/events/EventsService";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import EventsSelectComponent from "../../../components/dashboard/events/EventsSelectComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function EventsAttendancePage() {
  const { loading, setLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [attendances, setAttendances] = useState([]);
  const formRef = useRef(null);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [checkinTime, setCheckinTime] = useState(dayjs());
  const [checkoutTime, setCheckoutTime] = useState();

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    id: 0, user: "", event:"", check_in_time: "", check_out_time: ""
  });
  const [errors, setErrors] = useState({ user: "", check_in_time: "", check_out_time: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData({ ...formData, user: user?.value, event: event?.value, check_in_time: checkinTime.format("YYYY-MM-DD HH:mm:ss"), check_out_time: checkoutTime != null ? checkoutTime.format("YYYY-MM-DD HH:mm:ss") : "" });
  }, [user, event, checkinTime, checkoutTime]);

  useEffect(() => {
    const getEventsAttendances = async () => {
      setLoading(true);
      const eventsData = await EventsService.getEventsAttendances(pages, enqueueSnackbar);
      if (eventsData) {
        console.log("eventsData", eventsData);
        setAttendances(eventsData.data);
        setTotalPages(eventsData.last_page);
      }
      setLoading(false);
    };
    getEventsAttendances();
  }, [reload, pages]);

  // Call this function when new data is added
  const refreshAttendance = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMenu = () => {
    handleMenuClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEditCheckIn = (checkIn) => {
    setFormData({
      ...formData, id: checkIn?.id, user: checkIn?.user_id, event: checkIn?.my_event_id,
      check_in_time: moment(checkIn?.check_in_time).format("YYYY-MM-DD HH:mm:ss"), check_out_time: checkIn?.check_out_time != null ? moment(checkIn?.check_out_time).format("YYYY-MM-DD HH:mm:ss") : "",
    });
    setCheckinTime(dayjs(moment(checkIn?.check_in_time)));
    setCheckoutTime(checkIn?.check_out_time != null ? dayjs(moment(checkIn?.check_out_time)) : dayjs());
    setEvent({ value: checkIn?.my_event?.id, label: checkIn?.my_event?.name });
    setUser({ value: checkIn?.user?.id, label: `${checkIn?.user?.firstname} ${checkIn?.user?.lastname} (${checkIn?.user?.phone})` });
    handleClickOpen();
  };
  const handleNewCheckIn = () => {
    setFormData({
      ...formData, id: 0, user: "", event: "", check_in_time: "", check_out_time: "",
    });
    setEvent(null);
    setUser(null);
    setCheckinTime(dayjs());
    setCheckoutTime(null);
    handleClickOpen();
  };

  const handleSaveCheckIn = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const data = await EventsService.addEventAttendance(
        formData, enqueueSnackbar
      );
      if (data) {
        handleClose();
        refreshAttendance();
      }
      setLoading(false);
    }
  };
    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (formData.user) {
            errorsCopy.user = "";
        } else {
            errorsCopy.user = "User is required";
            valid = false;
        }
        if (formData.event) {
            errorsCopy.event = "";
        } else {
            errorsCopy.event = "Event is required";
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

  const stripAndLimit = (html, limit = 100) => {
    const text = new DOMParser()
      .parseFromString(html, "text/html")
      .body.textContent;
    return text.length > limit ? text.slice(0, limit) + "…" : text;
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={9} className="p-3">
          <h5>
            <BsCalendar2 /> Attendance
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" onClick={handleNewCheckIn}>
            <MdAdd /> &nbsp;New Attendance
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
                  <TableCell>Name</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.length > 0 ? (
                  attendances.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.user?.firstname} {event?.user?.lastname}</TableCell>
                      <TableCell>{event.my_event?.name}</TableCell>
                      <TableCell>
                        {moment.utc(event.checkin_time).local().format("DD MMM, YYYY hh:mm A")}
                      </TableCell>
                      <TableCell>
                        {event?.checkout_time != null?moment.utc(event.checkout_time).local().format("DD MMM, YYYY hh:mm A"):""}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(event.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{event.creator?.firstname} {event.creator?.lastname}</TableCell>
                      <TableCell align="right">
                        <IconButton variant="outlined" size="small" color="info"
                        onClick={(e)=>{handleEditCheckIn(event)}}
                        >
                          <MdEdit/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {!loading ? (
                        <p className="text-center">
                          <FaBan /> No Attendance yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>Attendance</b>...</p>
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
        </Col>


        {/*Add Attendance Modal*/}
        <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>
            <FaCalendarAlt /> {formData.id > 0 ? "Edit" : "Add"} Check-In
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
            <Form ref={formRef} onSubmit={handleSaveCheckIn}>
              <Row className="mt-3">
                <Form.Group className="col-sm-12 mb-3">
                  <UserSelectComponent selectedOption={user} onSelectChange={setUser} />
                  {errors.user && <FormHelperText error>{errors.user}</FormHelperText>}
                </Form.Group>
                <Form.Group className="col-sm-12 mb-3">
                  <EventsSelectComponent selectedOption={event} onSelectChange={setEvent} />
                  {errors.child_event && <FormHelperText error>{errors.child_event}</FormHelperText>}
                </Form.Group>
                <Form.Group className="col-sm-12 mb-3">
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
                </Form.Group>
                <Form.Group className="col-sm-12 mb-3">
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
        {/*End Attendance Dialog*/}
      </Row>
    </Container>
  );
}

export default EventsAttendancePage;
