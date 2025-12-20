import { Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { indigo } from '@mui/material/colors';
import React from 'react'
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { FaCheckSquare, FaHandshake, FaHeartbeat, FaLongArrowAltRight, FaUserInjured } from "react-icons/fa";
import { GrGrow} from "react-icons/gr";
//import myImage from './assets/crowdfunding.jpg';

function IndexPage() {
  return (
    <>
      <Container fluid className='main'>
        <Row className='d-flex align-items-center dark'>
          <div className='col-sm-12 mt-5 mb-5'>
            <Container>
              <div className='row d-flex align-items-center' >
                <div className='col-sm-8 col-md-6 order-2 order-sm-1 mt-5 pt-5'>
                  <h1 style={{ fontWeight: "bold" }}>medimeet</h1>
                  <p>Medimeet is an <b>appointment</b> management platform for hospitals and a <b>quick response ambulance</b> service platform within a click of a button.</p>
                  <p>At Medimeet, we believe access to medical care should never be delayed. With our technology, it won’t be.</p>
                  <Button disableElevation variant='contained' sx={{ bgcolor: indigo[400] }} className='shadow-lg'>Get Started</Button>
                </div>
              </div>
            </Container>
          </div>
        </Row>
      </Container>

      <Container className='mt-5 mb-5'>
        <Row>
          <Col sm={12} className='pt-5 pb-5'>
            <h2>About Us</h2>
            <p>Medimeet is a cutting-edge healthcare platform that bridges the gap between patients and critical medical services. We offer a seamless appointment management system for hospitals and clinics, enabling patients to easily book, track, and manage their consultations—anytime, anywhere.</p>

            <p>Beyond appointments, Medimeet powers an on-demand ambulance dispatch system, providing fast, GPS-enabled emergency response with just a tap. Whether you’re a patient in need, a hospital looking to streamline workflows, or a provider seeking to improve accessibility—Medimeet brings healthcare to your fingertips.</p>

            <p>Our platform is built with reliability, speed, and user experience at its core. We work closely with medical institutions, ambulance providers, and healthcare professionals to ensure every patient receives timely care and every provider stays efficient and connected.</p>

            For patients, we offer peace of mind.
            For hospitals, improved efficiency.
            For ambulance teams, smart coordination.
            For investors, a scalable solution tackling real-world healthcare gaps.

            At Medimeet, we believe access to medical care should never be delayed. With our technology, it won’t be.</Col>
        </Row>
      </Container>
      <Container fluid className='mb-5 pt-5 pb-5 my-bg-dark'>
        <Row className='d-flex justify-content-center'>
          <Col sm={8} className='text-center'>
          <p>Our platform is built with <b>reliability</b>, <b>speed</b>, and <b>user experience</b> at its core.</p>
          </Col>
        </Row>
      </Container>

      <Container className='mb-5 pb-5'>
        <Row>
          <Col sm={6} md={3}>
            <Card className='border-0 shadow mb-3 h-100'>
              <CardBody>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: indigo[900] }} variant='rounded'><FaHeartbeat /></Avatar></ListItemAvatar>
                  <ListItemText primary={<Typography variant='h6' sx={{ color: indigo[900] }}>Peace of Mind</Typography>}></ListItemText></ListItem>
                <p>We are at the center of bringing services closer to our patients.</p>
              </CardBody>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className='border-0 shadow mb-3 h-100'>
              <CardBody>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: indigo[900] }} variant='rounded'><FaCheckSquare /></Avatar></ListItemAvatar>
                  <ListItemText primary={<Typography variant='h6' sx={{ color: indigo[900] }}>Efficiency</Typography>}></ListItemText></ListItem>
                <p>Health care provider enjoy efficiency in patient management and acquisition</p>
              </CardBody>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className='border-0 shadow mb-3 h-100'>
              <CardBody>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: indigo[900] }} variant='rounded'><FaHandshake /></Avatar></ListItemAvatar>
                  <ListItemText primary={<Typography variant='h6' sx={{ color: indigo[900] }}>Coordination</Typography>}></ListItemText></ListItem>
                <p>Ambulance Teams enjoy seamless coordination via our app</p>
              </CardBody>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className='border-0 shadow mb-3 h-100'>
              <CardBody>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: indigo[900] }} variant='rounded'><GrGrow /></Avatar></ListItemAvatar>
                  <ListItemText primary={<Typography variant='h6' sx={{ color: indigo[900] }}>Scaling</Typography>}></ListItemText></ListItem>
                <p>Our platform is designed to scale with the needs of hospitals and ambulance teams</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default IndexPage