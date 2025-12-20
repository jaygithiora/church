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
import { FaBan, FaCheck, FaSync } from "react-icons/fa";
import { FaArrowRightLong, FaCommentSms } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import { MdAdd, MdMail } from "react-icons/md";
import { BsAlarm } from "react-icons/bs";

function SchedulesPage() {
  const { loading, setLoading } = useAuth();
  const [schedules, setSchedules] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getSchedules = async () => {
      setLoading(true);
      const schedulesData = await CommunicationService.getSchedules(pages);
      if (schedulesData) {
        console.log("schedulesData", schedulesData);
        setSchedules(schedulesData.data);
        setTotalPages(schedulesData.last_page);
      }
      setLoading(false);
    };
    getSchedules();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshSchedules = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, schedule) => {
    setAnchorEl(event.currentTarget);
  };
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
            <BsAlarm /> Schedules
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/communication/schedules/add">
            <MdAdd /> &nbsp;New Schedule
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
                  <TableCell>Sender</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                schedule.user?.image != null
                                  ? schedule.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {schedule.user?.firstname} {schedule.user?.lastname}
                              </>
                            }
                            secondary={schedule.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{schedule.title} </TableCell>
                      <TableCell>{stripAndLimit(schedule.message, 50)} </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(schedule.schedule), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{schedule.recipients_count.toLocaleString("en-US")} Recipient(s)</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(schedule.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell><Chip icon={schedule.type == 'email'?<MdMail/>:<FaCommentSms/>} label={schedule.type} color="default" size="small" /></TableCell>
                      <TableCell><Chip icon={schedule.status?<FaCheck/>:<FaSync/>} label={schedule.status ? "Sent" : "Pending"} color={schedule.status ? "success" : "default"} size="small" /></TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/communication/schedules/view/${schedule.id}`}
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
                          <FaBan /> No Schedules yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>Schedules</b>...</p>
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

export default SchedulesPage;
