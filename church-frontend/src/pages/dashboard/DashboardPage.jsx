// DashboardPage.js
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { Col, Container, Row } from "react-bootstrap";
import {
  Alert,
  Avatar,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  FaAirbnb,
  FaArrowUp,
  FaBan,
  FaCalendarDay,
  FaChartBar,
  FaChartPie,
  FaClock,
  FaEllipsisH,
  FaEllipsisV,
  FaLongArrowAltRight,
  FaWallet,
} from "react-icons/fa";
import LineChartComponent from "../../components/dashboard/charts/LineChartComponent";
import { MdEdit, MdShoppingCart } from "react-icons/md";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import { deepPurple, grey, indigo, purple, red, teal } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import AppointmentsService from "../../services/dashboard/communication/CommunicationService";
import { formatDistanceToNow, set } from "date-fns";
import dayjs from "dayjs";
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    /*{
      label: "Patients",
      type: "bar",
      data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
      backgroundColor: "#107437", // Bar color
      borderColor: "#107437", // Optional border
      borderWidth: 1,
      //barThickness:5,
      barPercentage: 0.2, // Reduce bar width
      //categoryPercentage: 0.1, // Adjusts spacing between bars
      borderRadius: 20,
    },*/
    {
      label: "Profit",
      type: "line",
      data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
      borderColor: "rgba(109, 47, 253,0.4)",
      tension: 0.4,
      borderWidth: 3,
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        // ✅ Prevent crash on first render
        if (!chart.chartArea) return null;
        const {
          ctx,
          chartArea: { top, bottom },
        } = chart;

        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        gradient.addColorStop(0, "rgba(109, 47, 253,0.4)"); // top (line color with opacity)
        gradient.addColorStop(1, "rgba(109, 47, 253,0)"); // bottom (fully transparent)
        return gradient;
      },
      pointBackgroundColor: "white",
      pointBorderColor: "rgba(109, 47, 253,1)",
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        font: { family: "Outfit" },
      },
      grid: {
        display: false, // Hides X-axis gridlines
      },
    },
    y: {
      ticks: {
        font: { family: "Outfit" },
      },
      grid: {
        display: false, // ❌ Hides Y-axis gridlines
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        font: { family: "Outfit" },
      },
      display: false,
    },
    tooltip: {
      titleFont: {
        family: "Outfit", // Change font for tooltip title
      },
      bodyFont: {
        family: "Outfit", // Change font for tooltip body
      },
      footerFont: {
        family: "Outfit", // Change font for tooltip footer
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // Adjust for smoothness (0 = sharp, 1 = very curved)
    },
    point: {
      radius: 0, // Remove points
      //hoverRadius: 0, // Remove points on hover
    },
  },
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#3e2b6a94",
    ...theme.applyStyles("dark", {
      backgroundColor: "#3e2b6a94",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: grey[100],
    ...theme.applyStyles("dark", {
      backgroundColor: grey[100],
    }),
  },
}));
const BorderLinearProgress1 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: grey[100],
    ...theme.applyStyles("dark", {
      backgroundColor: grey[100],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#6D2FFD",
    ...theme.applyStyles("dark", {
      backgroundColor: "#6D2FFD",
    }),
  },
}));

const DashboardPage = () => {
  const { loading, setLoading, isAuthenticated, user, logout } = useAuth();
  const chartRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    setLoading(true);
    const appointmentsData = await AppointmentsService.getAppointments(
      1,
      enqueueSnackbar
    );
    if (appointmentsData) {
      //console.log(appointmentsData);
      if (appointmentsData?.data?.length > 5) {
        setAppointments(appointmentsData?.data?.slice(0, 5));
      } else {
        setAppointments(appointmentsData?.data);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <Container fluid>
        <Row className="mt-5 mb-5">
          <Col lg={4} className="mb-3">
            <Card elevation={0} className=" text-white h-100" sx={{bgcolor: '#6D2FFD'}}>
              <CardContent>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <FaEllipsisH className="text-white" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{ bgcolor: "#331b6a", color: "#fff" }}
                    >
                      <FaChartBar />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Overall Visits" />
                </ListItem>
                <Typography variant="h4">
                  10.245{" "}
                  <Chip
                    label="67%"
                    size="small"
                    color="default"
                    sx={{ color: "#fff" }}
                  />
                </Typography>
                <p>
                  Data obtained from the last 7 days from 5,675 visitors to
                  7,637 visitors
                </p>
                <BorderLinearProgress variant="determinate" value={50} />
              </CardContent>
            </Card>
          </Col>

          <Col md={6} lg={4} className="d-none d-md-block mb-3">
            <Card elevation={0} className="h-100">
              <CardContent>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <FaEllipsisH />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{ bgcolor: "#331b6a", color: "#fff" }}
                    >
                      <FaChartBar />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Overall Visits" />
                </ListItem>
                <Typography variant="h4">
                  10.245 <Chip label="67%" size="small" color="default" />
                </Typography>
                <p>
                  Data obtained from the last 7 days from 5,675 visitors to
                  7,637 visitors
                </p>
                <BorderLinearProgress1 variant="determinate" value={50} />
              </CardContent>
            </Card>
          </Col>

          <Col md={6} lg={4} className="d-none d-md-block mb-3">
            <Card elevation={0} className="h-100">
              <CardContent>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <FaEllipsisH />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{ bgcolor: "#331b6a", color: "#fff" }}
                    >
                      <FaChartBar />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Overall Visits" />
                </ListItem>
                <Typography variant="h4">
                  10.245 <Chip label="67%" size="small" color="default" />
                </Typography>
                <p>
                  Data obtained from the last 7 days from 5,675 visitors to
                  7,637 visitors
                </p>
                <BorderLinearProgress1 variant="determinate" value={50} />
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Row className="mb-5">
          {/*Chart */}
          <Col xl={8} className="mb-2">
            <Card className="h-100">
              <CardHeader avatar={<FaChartBar />} title="Overview" />
              <Divider sx={{ borderColor: "success.main" }} />
              <CardContent>
                <LineChartComponent
                  ref={chartRef}
                  data={data}
                  options={options}
                />
              </CardContent>
            </Card>
          </Col>
          {/*End Chart*/}

          {/*Recent Appointments */}
          <Col xl={4} className="mb-2">
            <Card className="h-100">
              <CardHeader avatar={<FaClock />} title="Recent Appointments" />
              <Divider sx={{ borderColor: "success.main" }} />
              <CardContent>
                <List>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton size='small'>
                            <FaEllipsisV />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            elevation={5}
                            src={
                                appointment?.user?.image != null
                                  ? appointment?.user?.image
                                  : "/assets/avatar.jpeg"
                              }
                          ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${appointment?.user?.firstname} ${appointment?.user?.lastname}`}
                          secondary={`${dayjs(
                            new Date(appointment.from_date)
                          ).format("DD MMM,YYYY")} - (${dayjs(
                            new Date(
                              appointment.from_date
                            )
                          ).format("hh:mm A")} ${dayjs(
                            new Date(
                              appointment.to_date
                            )
                          ).format("hh:mm A")})`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                        {!loading ? (
                            <>
                          <ListItemAvatar>
                            <Avatar><FaBan /></Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography>No <b>appointments</b> yet</Typography>}></ListItemText>
                          </>
                        ) : (<>
                          <ListItemAvatar>
                            <Avatar><CircularProgress/></Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography>Loading <b>Recent Appointments</b>...</Typography>}></ListItemText></>
                        )}
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions>
                <div className="w-100 text-center">
                <Button LinkComponent={Link} to="/dashboard/appointments" variant='outlined' color="primary">More <FaLongArrowAltRight/></Button></div>
                </CardActions>
            </Card>
          </Col>
          {/*End Recent Appointments*/}
        </Row>
      </Container>
    </>
  );
};

export default DashboardPage;
