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
import SermonsService from "../../../services/dashboard/spiritual/SermonsService";

function SermonsPage() {
  const { loading, setLoading } = useAuth();
  const [sermons, setSermons] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getSermons = async () => {
      setLoading(true);
      const sermonsData = await SermonsService.getSermons(pages);
      if (sermonsData) {
        console.log("sermonsData", sermonsData);
        setSermons(sermonsData.data);
        setTotalPages(sermonsData.last_page);
      }
      setLoading(false);
    };
    getSermons();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshSermons = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, sermon) => {
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
            <FaBible /> Sermons
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/spiritual/sermons/add">
            <MdAdd /> &nbsp;New Sermon
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
                  <TableCell>Title</TableCell>
                  <TableCell>Sermon</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sermons.length > 0 ? (
                  sermons.map((sermon, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                sermon.user?.image != null
                                  ? sermon.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {sermon.user?.firstname} {sermon.user?.lastname}
                              </>
                            }
                            secondary={sermon.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{sermon.title} </TableCell>
                      <TableCell>{stripAndLimit(sermon.description, 50)} </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(sermon.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell><Chip icon={sermon.status=='published'?<FaCheck/>:<FaSync/>} label={sermon.status} color={sermon.status=='published' ? "success" : "default"} size="small" /></TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/spiritual/sermons/view/${sermon.id}`}
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
                          <FaBan /> No Sermons yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>Sermons</b>...</p>
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

export default SermonsPage;
