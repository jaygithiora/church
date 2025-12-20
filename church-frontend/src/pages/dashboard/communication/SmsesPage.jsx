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
import { FaBan} from "react-icons/fa";
import { FaArrowRightLong, FaCommentSms} from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import { MdAdd, MdMail } from "react-icons/md";
import { Sms } from "@mui/icons-material";

function SmsesPage() {
  const { loading, setLoading } = useAuth();
  const [smses, setSmses] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getSmses = async () => {
      setLoading(true);
      const smsesData = await CommunicationService.getSmses(pages);
      if (smsesData) {
        console.log("smsesData", smsesData);
        setSmses(smsesData.data);
        setTotalPages(smsesData.last_page);
      }
      setLoading(false);
    };
    getSmses();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshSmses = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, sms) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMenu = () => {
    handleMenuClose();
  };

     const limit = (text, limit = 100) => {
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};
  return (
    <Container fluid>
      <Row>
        <Col xs={9} className="p-3">
          <h5>
            <FaCommentSms /> SMS
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/communication/sms/send">
            <MdAdd/> &nbsp;New SMS
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
                  <TableCell>Message</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {smses.length > 0 ? (
                  smses.map((sms, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                sms.user?.image != null
                                  ? sms.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {sms.user?.firstname} {sms.user?.lastname}
                              </>
                            }
                            secondary={sms.user?.phone}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{limit(sms.message, 50)} </TableCell>
                      <TableCell>{sms.recipients_count.toLocaleString("en-US")} Recipient(s)</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(sms.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/communication/smses/view/${sms.id}`}
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
                          <FaBan /> No SMS yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>SMS</b>...</p>
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

export default SmsesPage;
