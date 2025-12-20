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
import React, { useEffect,  useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaBan, FaCheckCircle, FaCheckDouble, FaClock, FaExclamationCircle, FaTimes} from "react-icons/fa";
import { FaArrowRightLong} from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { BsCalendar2Check, BsCalendar2Month} from "react-icons/bs";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import { MdAdd, MdMail } from "react-icons/md";

function EmailsPage() {
  const { loading, setLoading } = useAuth();
  const [emails, setEmails] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getEmails = async () => {
      setLoading(true);
      const emailsData = await CommunicationService.getEmails(pages);
      if (emailsData) {
        console.log("emailsData", emailsData);
        setEmails(emailsData.data);
        setTotalPages(emailsData.last_page);
      }
      setLoading(false);
    };
    getEmails();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshEmails = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, appointment) => {
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
            <MdMail /> Emails
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/communication/emails/send">
            <MdAdd/> &nbsp;New Email
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
                  <TableCell>Description</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emails.length > 0 ? (
                  emails.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                appointment.user?.image != null
                                  ? appointment.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {appointment.user?.firstname} {appointment.user?.lastname}
                              </>
                            }
                            secondary={appointment.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{appointment.subject} </TableCell>
                      <TableCell>{stripAndLimit(appointment.message, 50)} </TableCell>
                      <TableCell>{appointment.recipients_count.toLocaleString("en-US")} Recipient(s)</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(appointment.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/communication/emails/view/${appointment.id}`}
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
                          <FaBan /> No emails yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>emails</b>...</p>
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

export default EmailsPage;
