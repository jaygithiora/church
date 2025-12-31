import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import interactionPlugin from '@fullcalendar/interaction'; // For click/select
import { Col, Container, Form, Row } from "react-bootstrap";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { BsCalendarDay, BsPlus } from "react-icons/bs";
import { useAuth } from "../../../services/AuthContext";
import { FaPenClip } from "react-icons/fa6";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DiariesService from "../../../services/dashboard/diary/DiariesService";
import { useSnackbar } from "notistack";

const DiariesPage = () => {
  const { loading, user, setLoading } = useAuth();
  const [reload, setReload] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const [currentMonth, setCurrentMonth] = useState("");
  const [diaries, setDiaries] = useState([/*{ title: 'Event 1', date: new Date().toISOString().slice(0, 10) }*/]);
  const [searchFromDate, setSearchFromDate] = useState(null);
  const [searchToDate, setSearchToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const formRef = useRef();

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs().add(30, 'minute'));
  const [errors, setErrors] = useState({
    name: "", description: "",  fromDate: "", toDate:"",
  });

  useEffect(() => {
    if (searchFromDate && searchToDate)
      getDiaries();
  }, [reload]);

  useEffect(() => {
    if (searchFromDate && searchToDate)
      getDiaries();
  }, [searchFromDate, searchToDate]);

  const getDiaries = async () => {
    setLoading(true);
    const diariesData =
      await DiariesService.getDiaries(searchFromDate, searchToDate, enqueueSnackbar);
    if (diariesData) {
      setDiaries([]);
      let newDiaries = diariesData.map((diary) => ({
        id: diary.id,
        title: diary.name,
        start: diary.start_time,
        end: diary.end_time,
        description:diary.description,
      }));
      setDiaries([...diaries, ...newDiaries]);
    }
    setLoading(false);
  };
  // Call this function when new data is added
  const refreshDiaries = () => {
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
  const handleNewDiary = ()=>{
    setId(0);
    setName("");
    setFromDate(dayjs());
    setToDate(dayjs().add(30, 'minute'));
    setDescription("");
    handleOpen();
  }

  const handleDateSelect = (selectInfo) => {
    console.log(selectInfo);
    setId(0);
    setName("");
    setDescription("");
    setFromDate(dayjs(selectInfo.startStr));
    //setToDate(dayjs(selectInfo.endStr));
    setToDate(dayjs(selectInfo.startStr).add(30,'minute'));
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
      setDiaries([...diaries, newEvent]);
    }*/
  };
  const handleDiaryClick = (clickInfo) => {
  const diary = clickInfo.event;
  setId(diary.id);
  setName(diary.title);
  setFromDate(dayjs(diary.start));
  setToDate(dayjs(diary.end));
  setDescription(diary.extendedProps.description);
/*
  setSelectedEvent({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
  });*/
  handleOpen();
};

  const handleSaveDiary = async (e) => {
    e.preventDefault();
    console.log(fromDate);
    if (validateForm()) {
      setLoading(true);
      const data = await DiariesService.addDiary(
        {"id":id,
        "name":name,
        "start_time":fromDate.format('YYYY-MM-DD HH:mm'),
        "end_time":toDate.format('YYYY-MM-DD HH:mm'),
        "description":description}, enqueueSnackbar
      );
      if (data) {
        handleClose();
        refreshDiaries();
      }
      setLoading(false);
    }
  }

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };
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
                  <h4><BsCalendarDay /> Diaries ({currentMonth})</h4>
                </Col>
                <Col className='text-end'>
                  <Button variant="contained" color="primary" onClick={handleNewDiary}><BsPlus />Add Diary</Button>
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
                  events={diaries}
                  datesSet={handleDatesSet}
                  eventClick={handleDiaryClick}
                />
              </div>
            </CardContent>
          </Card>
        </Col>

        {/*Add Appointment Settings Modal*/}
        <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>
            <FaPenClip /> {id > 0 ? "Edit" : "Add"} Diary
          </DialogTitle>
          <DialogContent>
            <Form ref={formRef} onSubmit={handleSaveDiary}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                      label="Description"
                      size="small"
                      error={errors.description}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      helperText={errors.description}
                      multiline
                      rows={3}
                    />
                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
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