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
import { FaBan, FaCheck, FaHandHoldingHeart, FaSync } from "react-icons/fa";
import { FaArrowRightLong, FaCommentSms } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { MdAdd, MdMail } from "react-icons/md";
import TestimonialsService from "../../../services/dashboard/spiritual/TestimonialsService";
import { useSnackbar } from "notistack";

function TestimonialsPage() {
  const { loading, setLoading } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getTestimonials = async () => {
      setLoading(true);
      const testimonialsData = await TestimonialsService.getTestimonials(pages, enqueueSnackbar);
      if (testimonialsData) {
        console.log("testimonialsData", testimonialsData);
        setTestimonials(testimonialsData.data);
        setTotalPages(testimonialsData.last_page);
      }
      setLoading(false);
    };
    getTestimonials();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshTestimonials = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, testimonial) => {
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
            <FaHandHoldingHeart /> Testimonials
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/spiritual/testimonials/add">
            <MdAdd /> &nbsp;New Testimonial
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
                  <TableCell>User</TableCell>
                  <TableCell>Testimonial</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                testimonial.user?.image != null
                                  ? testimonial.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {testimonial.user?.firstname} {testimonial.user?.lastname}
                              </>
                            }
                            secondary={testimonial.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{stripAndLimit(testimonial.testimonial, 50)} </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(testimonial.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell><Chip icon={testimonial.status==="published"?<FaCheck/>:<FaSync/>} label={testimonial.status} color={testimonial.status==="published"?"success":"default"} size="small" /></TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/spiritual/testimonials/view/${testimonial.id}`}
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
                          <FaBan /> No testimonials yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>testimonials</b>...</p>
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

export default TestimonialsPage;
