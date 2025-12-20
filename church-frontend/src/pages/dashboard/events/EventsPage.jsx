import {
  alpha,
  Avatar,
  Button,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaBan, FaBible, FaCheck, FaSync } from "react-icons/fa";
import { FaArrowRightLong, FaCommentSms } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { MdAdd, MdMail } from "react-icons/md";
import EventsService from "../../../services/dashboard/events/EventsService";
import { useSnackbar } from "notistack";
import { PiNotificationFill } from "react-icons/pi";

function EventsPage() {
  const { loading, setLoading } = useAuth();
  const {enqueueSnackbar} = useSnackbar();
  const [events, setEvents] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      const eventsData = await EventsService.getEvents(pages, enqueueSnackbar);
      if (eventsData) {
        console.log("eventsData", eventsData);
        setEvents(eventsData.data);
        setTotalPages(eventsData.last_page);
      }
      setLoading(false);
    };
    getEvents();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshEvents = () => {
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
            <PiNotificationFill /> Events
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/events/add">
            <MdAdd /> &nbsp;New Event
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
                  <TableCell>Event Date</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                event.user?.image != null
                                  ? event.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {event.user?.firstname} {event.user?.lastname}
                              </>
                            }
                            secondary={event.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{event.title} </TableCell>
                      <TableCell>{stripAndLimit(event.description, 50)} </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(event.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell><Chip icon={event.status=='published'?<FaCheck/>:<FaSync/>} label={event.status} color={event.status=='published' ? "success" : "default"} size="small" /></TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/spiritual/events/view/${event.id}`}
                        >
                          View <FaArrowRightLong />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {!loading ? (
                        <p className="text-center">
                          <FaBan /> No Events yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>Events</b>...</p>
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
      </Row>
    </Container>
  );
}

export default EventsPage;
