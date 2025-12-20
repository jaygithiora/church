import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import interactionPlugin from '@fullcalendar/interaction'; // For click/select
import { Col, Container, Form, Row } from "react-bootstrap";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { BsCalendar4, BsCalendarDay, BsCalendarDayFill, BsPlus } from "react-icons/bs";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import { useAuth } from "../../../services/AuthContext";
import { FaPenClip } from "react-icons/fa6";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MuiTelInput } from "mui-tel-input";
import AppointmentsService from "../../../services/dashboard/communication/CommunicationService";
import SpecialitySelectComponent from "../../../components/dashboard/settings/SpecialitySelectComponent";
const DiariesPage = () => {
  const { loading, user, setLoading } = useAuth();
  const [reload, setReload] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const [appointments, setAppointments] = useState([/*{ title: 'Event 1', date: new Date().toISOString().slice(0, 10) }*/]);
  const [selectedUser, setSelectedUser] = useState({ value: user?.id, label: `${user?.firstname} ${user?.lastname} (${user?.phone})` });
  const [searchFromDate, setSearchFromDate] = useState(null);
  const [searchToDate, setSearchToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const formRef = useRef();

  const [id, setId] = useState(0);
  const [specialist, setSpecialist] = useState(selectedUser);
  const [speciality, setSpeciality] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs().add(30, 'minute'));
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("Pending");
  const [errors, setErrors] = useState({
    firstname: "", lastname: "", phone: "", fromDate: "", toDate: "", comments: "", speciality: ""
  });

  useEffect(() => {
    if (searchFromDate && searchToDate)
      getUserAppointments();
  }, [reload, selectedUser?.value]);

  useEffect(() => {
    if (searchFromDate && searchToDate)
      getUserAppointments();
  }, [searchFromDate, searchToDate]);

  const getUserAppointments = async () => {
    setLoading(true);
    const appointmentsData =
      await AppointmentsService.getUserAppointments(selectedUser?.value, searchFromDate, searchToDate);
    if (appointmentsData) {
      setAppointments([]);
      let newAppointments = appointmentsData.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.client.firstname} ${appointment.client.lastname}`,
        client: appointment.client,
        user: appointment.user,
        start: appointment.from_date,
        end: appointment.to_date,
        speciality: appointment.speciality,
        remarks:appointment.remarks,
        status:appointment.status
      }));
      setAppointments([...appointments, ...newAppointments]);
    }
    setLoading(false);
  };
  // Call this function when new data is added
  const refreshAppointments = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };

  const handleDatesSet = (arg) => {
    setSearchFromDate(dayjs(arg.start).format("YYYY-MM-DD"));
    setSearchToDate(dayjs(arg.end).format("YYYY-MM-DD"));
    const month = arg.start.getMonth(); // 0-based (0 = Jan)
    const year = arg.start.getFullYear();
    const monthName = arg.start.toLocaleString('default', { month: 'long' });

    setCurrentMonth(`${monthName} ${year}`); // e.g., "June 2025"
  };
  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }
  const handleNewAppointment = ()=>{
    setId(0);
    setFirstname("");
    setLastname("");
    setPhone("");
    setFromDate(dayjs());
    setToDate(dayjs().add(30, 'minute'));
    setComments("");
    setStatus("Pending");
    handleOpen();
  }

  const handleDateSelect = (selectInfo) => {
    setFromDate(dayjs(selectInfo.startStr));
    setToDate(dayjs(selectInfo.endStr));
    handleOpen();
    /*
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      setAppointments([...appointments, newEvent]);
    }*/
  };
  const handleAppointmentClick = (clickInfo) => {
  const appointment = clickInfo.event;
  setId(appointment.id);
  setFirstname(appointment.extendedProps.client.firstname);
  setLastname(appointment.extendedProps.client.lastname);
  setPhone(appointment.extendedProps.client.phone);
  setSpeciality({value: appointment.extendedProps.speciality.id, label: appointment.extendedProps.speciality.name});
  setSpecialist({value: appointment.extendedProps.user.id, label: `${appointment.extendedProps.user.firstname} ${appointment.extendedProps.user.lastname} (${appointment.extendedProps.user.phone}) `});
  setFromDate(dayjs(appointment.start));
  setToDate(dayjs(appointment.end));
  setComments(appointment.extendedProps.remarks);
  setStatus(appointment.extendedProps.status);
/*
  setSelectedEvent({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
  });*/
  handleOpen();
};

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    console.log(fromDate);
    if (validateForm()) {
      setLoading(true);
      const data = await AppointmentsService.addAppointment(
        id,
        firstname,
        lastname,
        phone,
        specialist?.value,
        speciality?.value,
        fromDate.format('YYYY-MM-DD HH:mm'),
        toDate.format('YYYY-MM-DD HH:mm'),
        comments,
        status
      );
      if (data) {
        handleClose();
        refreshAppointments();
      }
      setLoading(false);
    }
  }

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (user != null) {
      errorsCopy.user = "";
    } else {
      errorsCopy.user = "User is required";
      valid = false;
    }
    if (speciality != null) {
      errorsCopy.speciality = "";
    } else {
      errorsCopy.speciality = "Speciality is required";
      valid = false;
    }
    if (firstname) {
      errorsCopy.firstname = "";
    } else {
      errorsCopy.firstname = "First name required";
      valid = false;
    }
    if (lastname) {
      errorsCopy.lastname = "";
    } else {
      errorsCopy.lastname = "Last name required";
      valid = false;
    }
    if (phone) {
      errorsCopy.phone = "";
    } else {
      errorsCopy.phone = "Phone is required";
      valid = false;
    }
    if (fromDate) {
      errorsCopy.fromDate = "";
    } else {
      errorsCopy.fromDate = "From Date is required";
      valid = false;
    }
    if (toDate) {
      errorsCopy.toDate = "";
    } else {
      errorsCopy.toDate = "To Date is required";
      valid = false;
    }
    if (fromDate.isAfter(toDate)) {
      errorsCopy.fromDate = "From Date must be less than to date";
      errorsCopy.toDate = "To Date must be greator than From Date";
      valid = false;
    } else {
      errorsCopy.fromDate = "";
      errorsCopy.toDate = "";
    }
    /*
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
        <Col sm={12} className="mt-3">
          <Card>
            <CardContent>
              <Row>
                <Col>
                  <h4><BsCalendarDay /> Appointments ({currentMonth})</h4>
                </Col>
                <Col>
                  <UserSelectComponent company={0} selectedOption={selectedUser} onSelectChange={setSelectedUser} />
                </Col>
                <Col className='text-end'>
                  <Button variant="contained" color="primary" onClick={handleNewAppointment}><BsPlus />Add Appointment</Button>
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
        <Col sm={12} className="p-3">
          <Card>
            <CardContent>
              <div className="calendar-container">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  selectable={true}
                  selectAllow={(selectInfo) => {
                    const now = new Date();
                    return selectInfo.start >= now;
                  }}
                  editable={true}
                  select={handleDateSelect}
                  events={appointments}
                  datesSet={handleDatesSet}
                  eventClick={handleAppointmentClick}
                />
              </div>
            </CardContent>
          </Card>
        </Col>

        {/*Add Appointment Settings Modal*/}
        <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>
            <FaPenClip /> {id > 0 ? "Edit" : "Add"} Appointment
          </DialogTitle>
          <DialogContent>
            <Form ref={formRef} onSubmit={handleSaveAppointment}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Row className="mt-3">
                  <FormGroup className="col-sm-6 mb-3">
                    <TextField
                      label="First Name"
                      size="small"
                      error={errors.firstname}
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      helperText={errors.firstname}
                    />
                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                  </FormGroup>
                  <FormGroup className="col-sm-6 mb-3">
                    <TextField
                      label="Last Name"
                      size="small"
                      error={errors.lastname}
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      helperText={errors.lastname}
                    />
                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <MuiTelInput
                      label="Phone Number"
                      error={errors.phone}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      helperText={errors.phone}
                      defaultCountry="KE"
                      size="small"
                      fullWidth
                    />
                    {/*errors.phone && <div className='invalid-feedback d-block'>{errors.phone}</div>*/}
                  </FormGroup>
                  <FormGroup className="col-sm-12 mb-3">
                    <UserSelectComponent selectedOption={specialist} onSelectChange={setSpecialist} />
                    {errors.user && <div className='invalid-feedback d-block'>{errors.user}</div>}
                  </FormGroup>
                  <FormGroup className="col-sm-12 mb-3">
                    <SpecialitySelectComponent selectedOption={speciality} onSelectChange={setSpeciality} />
                    {errors.user && <div className='invalid-feedback d-block'>{errors.user}</div>}
                  </FormGroup>
                  <FormGroup className="col-sm-6 mb-3">
                    <DateTimePicker
                      label="From Date"
                      value={fromDate} // Pass null or valid Day.js object
                      onChange={setFromDate}
                      disablePast
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: !!errors.fromDate,
                          helperText: errors.fromDate,
                          size: "small",
                          // Prevent invalid manual input
                          onKeyDown: (e) => {
                            if (e.key === 'Enter' && !fromDate) {
                              errors.fromDate = 'Please select a valid time';
                            } else {
                              errors.fromDate = '';
                            }
                          },
                        },
                      }}
                    />
                    {/*format="YYYY-MM-DD HH:mm"
                      ampm={false}*/}
                  </FormGroup>
                  <FormGroup className="col-sm-6 mb-3">
                    <DateTimePicker
                      label="To Date"
                      value={toDate} // Pass null or valid Day.js object
                      onChange={setToDate}
                      disablePast
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: !!errors.toDate,
                          helperText: errors.toDate,
                          size: "small",
                          // Prevent invalid manual input
                          onKeyDown: (e) => {
                            if (e.key === 'Enter' && !toDate) {
                              errors.toDate = 'Please select a valid time';
                            } else {
                              errors.toDate = '';
                            }
                          },
                        },
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="col-sm-12 mb-3">
                    <TextField
                      label="Comments"
                      size="small"
                      error={errors.comments}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      helperText={errors.comments}
                      multiline
                      rows={3}
                    />
                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                  </FormGroup>
                  <FormGroup className="col-sm-12 mb-3">
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
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Active"}>Active</MenuItem>
                        <MenuItem value={"Completed"}>Completed</MenuItem>
                        <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                        <MenuItem value={"Missed"}>Missed</MenuItem>
                      </Select>
                    </FormControl>
                  </FormGroup>
                </Row>
              </LocalizationProvider>
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
        {/*End Appointment Dialog*/}
      </Row>
    </Container>
  );

}
export default DiariesPage;