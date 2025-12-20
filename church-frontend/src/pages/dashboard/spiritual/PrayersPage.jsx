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
import { FaArrowRightLong, FaCommentSms, FaHandsPraying } from "react-icons/fa6";
import { useAuth } from "../../../services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import { MdAdd, MdMail } from "react-icons/md";
import { BsAlarm } from "react-icons/bs";
import PrayersService from "../../../services/dashboard/spiritual/PrayersService";
import { useSnackbar } from "notistack";

function PrayersPage() {
  const { loading, setLoading } = useAuth();
const {enqueueSnackbar} = useSnackbar();
  const [prayers, setPrayers] = useState([]);

  const [reload, setReload] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getPrayers = async () => {
      setLoading(true);
      const prayersData = await PrayersService.getPrayers(pages, enqueueSnackbar);
      if (prayersData) {
        console.log("prayersData", prayersData);
        setPrayers(prayersData.data);
        setTotalPages(prayersData.last_page);
      }
      setLoading(false);
    };
    getPrayers();
  }, [reload, pages]);
  // Call this function when new data is added
  const refreshPrayers = () => {
    setReload((prev) => !prev); // Toggle state to trigger useEffect
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, prayer) => {
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
            <FaHandsPraying /> Prayers
          </h5>
        </Col>
        <Col xs={3} className="p-3 text-end">
          <Button variant="contained" color="primary" component={Link} to="/dashboard/spiritual/prayers/add">
            <MdAdd /> &nbsp;New Prayer
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
                  <TableCell>Prayer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prayers.length > 0 ? (
                  prayers.map((prayer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={
                                prayer.user?.image != null
                                  ? prayer.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                              className="border-0"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {prayer.user?.firstname} {prayer.user?.lastname}
                              </>
                            }
                            secondary={prayer.user?.email}
                          ></ListItemText>
                        </ListItem>
                      </TableCell>
                      <TableCell>{prayer.title} </TableCell>
                      <TableCell>{stripAndLimit(prayer.description, 50)} </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(prayer.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell><Chip icon={prayer.status=='published'?<FaCheck/>:<FaSync/>} label={prayer.status} color={prayer.status=='published' ? "success" : "default"} size="small" /></TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" color="info"
                          component={Link}
                          to={`/dashboard/spiritual/prayers/view/${prayer.id}`}
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
                          <FaBan /> No prayers yet
                        </p>
                      ) : (
                        <p className="text-center">Loading <b>prayers</b>...</p>
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

export default PrayersPage;
