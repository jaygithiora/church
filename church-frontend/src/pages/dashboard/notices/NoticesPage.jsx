import {
  alpha,
  Button,
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
import { FaBan} from "react-icons/fa";
import { FaArrowRightLong} from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { MdAdd, MdNotifications} from "react-icons/md";
import { useSnackbar } from "notistack";
import moment from "moment";
import NoticesService from "../../../services/dashboard/notices/NoticesService";

function NoticesPage() {
  const { loading, setLoading } = useAuth();
  const {enqueueSnackbar} = useSnackbar();
  const [notices, setNotices] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getNotices = async () => {
      setLoading(true);
      const noticesData = await NoticesService.getNotices(pages, enqueueSnackbar);
      if (noticesData) {
        console.log("noticesData", noticesData);
        setNotices(noticesData.data);
        setTotalPages(noticesData.last_page);
      }
      setLoading(false);
    };
    getNotices();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshNotices = () => {
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
            <MdNotifications /> Notices
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/notices/add">
            <MdAdd /> &nbsp;New Notice
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
                  <TableCell>Notice</TableCell>
                  <TableCell>Desc.</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <TableRow key={index}>
                      <TableCell>{notice.title} </TableCell>
                      <TableCell>{stripAndLimit(notice.description, 50)} </TableCell>
                      <TableCell>
                        {moment.utc(notice.notice_date).local().format("DD MMM, YYYY hh:mm A")}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(notice.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{notice.user?.firstname} {notice.user?.lastname}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/notices/view/${notice.id}`}
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
                          <FaBan /> No Notices yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>Notices</b>...</p>
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
              onChange={(notice, value) => setPages(value)}
              color="primary"
              className="d-flex justify-content-center mt-3"
            ></Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default NoticesPage;
