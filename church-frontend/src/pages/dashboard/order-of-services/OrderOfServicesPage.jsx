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
import { MdAdd} from "react-icons/md";
import { useSnackbar } from "notistack";
import { PiMicrophoneStageDuotone, PiNotificationFill } from "react-icons/pi";
import moment from "moment";
import OrderOfServicesService from "../../../services/dashboard/order-of-services/OrderOfServicesService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function OrderOfServicesPage() {
  const { loading, setLoading } = useAuth();
  const {enqueueSnackbar} = useSnackbar();
  const [orderOfServices, setOrderOfServices] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getOrderOfServices = async () => {
      setLoading(true);
      const orderOfServicesData = await OrderOfServicesService.getOrderOfServices(pages, enqueueSnackbar);
      if (orderOfServicesData) {
        console.log("orderOfServicesData", orderOfServicesData);
        setOrderOfServices(orderOfServicesData.data);
        setTotalPages(orderOfServicesData.last_page);
      }
      setLoading(false);
    };
    getOrderOfServices();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshOrderOfServices = () => {
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
            <PiMicrophoneStageDuotone /> Order Of Services
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/order-of-services/add">
            <MdAdd /> &nbsp;New
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
                  <TableCell>Service</TableCell>
                  <TableCell>Desc.</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderOfServices.length > 0 ? (
                  orderOfServices.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.name} </TableCell>
                      <TableCell>{stripAndLimit(event.description, 50)} </TableCell>
                      <TableCell>{event.location} </TableCell>
                      <TableCell>
                        {event.day_name}
                      </TableCell>
                      <TableCell>{dayjs(event.start_time,"HH:mm").format("hh:mm A")} - {dayjs(event.end_time,"HH:mm").format("hh:mm A")}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(event.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{event.user?.firstname} {event.user?.lastname}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/order-of-services/view/${event.id}`}
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

export default OrderOfServicesPage;
