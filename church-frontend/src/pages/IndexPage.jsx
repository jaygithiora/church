import { Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { indigo } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { FaAppStore, FaCheckSquare, FaHandshake, FaHeart, FaHeartbeat, FaLongArrowAltRight, FaUserInjured } from "react-icons/fa";
import { GrGrow } from "react-icons/gr";
import { Typewriter } from "react-simple-typewriter";
import { IoLogoGooglePlaystore } from "react-icons/io5";
//import myImage from './assets/crowdfunding.jpg';

function IndexPage() {
  return (
    <>
      <Container fluid>
        <Row className='d-flex align-items-center'>
          <div className='col-sm-12 mt-5 mb-5'>
            <Container>
              <div className='row d-flex align-items-center' >
                <div className='col-md-6 order-2 order-md-1 mt-5 pt-5 myheader'>
                  <p className='small'><FaHeart /> Loved by 20k+ Ministers of the gospel and churches</p>

                  <h1>
                    Welcome to Church.{" "}<br />
                    <span style={{ color: "#1976d2" }}>
                      <Typewriter
                        words={["Register Members", "Add Members", "Manage Members"]}
                        loop
                        cursor
                        cursorStyle="|"
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={1500}
                      />
                    </span>{" "}

                  </h1>
                  <p className='pt-3 pb-3'>A place of abundance grace. Connect with your favourite church and get a way to find nourishment, give and participate with fellow believers</p>
                  <Button disableElevation variant='contained' sx={{ bgcolor: indigo[400] }} className='shadow-lg'><IoLogoGooglePlaystore/> &nbsp;|&nbsp; <FaAppStore/>&nbsp; Scan to download</Button>
                </div>
                <div className='col-md-6 order-1 order-md-2 my-bg-dark'>
                 <img src='assets/applications.svg' className='img-fluid'/>
                 </div>
              </div>
            </Container>
          </div>
        </Row>
      </Container>

    </>
  )
}

export default IndexPage