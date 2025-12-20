// RegisterPage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Col, Container, Row } from 'react-bootstrap';
import { CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { FaLongArrowAltRight } from 'react-icons/fa';
import IndexService from '../services/dashboard/IndexService';

const RegisterPage = () => {
    const [role, setRole] = useState("patient");
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const navigator = useNavigate();

    useEffect(() => {
        getRoles();
    }, []);

    const getRoles = async () => {
        setLoading(true);
        const rolesData =
            await IndexService.getRoles("",1);
        if (rolesData) {
            console.log("Roles",rolesData);
            setRoles(rolesData);
            if(rolesData.length > 0){
                setRole(rolesData[0].id);
            }
        }
        setLoading(false);
    };

    const handleChoice = async (e) => {
        e.preventDefault();
        //setLoading(true);
            navigator(`/register/${role}`);
            //navigator(from, { replace: true });
        
    };

    return (
        <Container fluid>
            <Row className='justify-content-center d-flex align-items-center main'>
                <Col sm={4} md={6} lg={8} className='d-none d-sm-block p-0 h-100'>
                    <div className='d-flex align-items-center p-5'>
                        <img src="/assets/logos/light-logo-name.png" alt="MediMeet" className='img-fluid' />
                    </div>
                </Col>
                <Col sm={8} md={6} lg={4} className='h-100 bg-white full-height d-flex align-items-center'>
                    <Form className='w-100 p-5 mt-5' onSubmit={handleChoice}>
                        {/*<div className='card-header bg-light p-3'>
                            <h5>Login to your account</h5>
                        </div>*/}
                        <FormControl className='w-100'>
                        {loading?<CircularProgress/>:(roles.length>0?<><FormLabel id="demo-radio-buttons-group-label" color='primary'><img src="/assets/logos/logo.png" alt="MediMeet" width={40} className='mb-2' /> <b>Choose</b></FormLabel>
                        <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >{roles.map((role, index) => (
                            
                                <FormControlLabel key={index} value={role.id} control={<Radio />} label={role.name} />
                            
                        ))}</RadioGroup></>:<></>)}</FormControl>

                        <div className='text-end mb-3'>
                            <button className='btn btn-primary w-100' disabled={loading||roles.length===0}>
                                {loading ? <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> : <FaLongArrowAltRight />}&nbsp;Next</button>
                        </div>

                        <div className='text-center mb-3'>
                            Have an account? <Link to="/login">Login</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;