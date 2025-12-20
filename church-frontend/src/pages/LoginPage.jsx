// LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FormLabel, TextField } from '@mui/material';

const LoginPage = () => {
    const { isAuthenticated, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const navigator = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);
        if (isAuthenticated) {
            navigator(from, {replace: true});
        }
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
                        <Form className='p-5 mt-5' onSubmit={handleLogin}>
                            {/*<div className='card-header bg-light p-3'>
                            <h5>Login to your account</h5>
                        </div>*/}
                            <div className='card-body'>
                                <h5 className='mb-3'>
                        <img src="/assets/logos/logo.png" alt="MediMeet" width={40} className='mb-2'/> Login</h5>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <FormLabel className='mb-1'>Email Address</FormLabel>
                                    <TextField fullWidth type="email" placeholder="Email Address" className='custom-textfield' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <FormLabel className='mb-1'>Password</FormLabel>
                                    <TextField fullWidth type="password" placeholder="Password" className='custom-textfield' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                {/*
                        <Form.Group className='mb-3'>
                            <Form.Check type='checkbox' id='remember_me' label="Remember Me"/>
                        </Form.Group>*/}
                                <div className='text-center mb-3'>
                                    <Link to="/">Reset/Forgot Password?</Link>
                                </div>
                                <div className='text-end mb-3'>
                                    <button className='btn btn-primary w-100' disabled={loading}>
                                        {loading && <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}&nbsp;Login</button>
                                </div>

                                <div className='text-center mb-3'>
                                    Dont have an account? Click here to <Link to="/register">Sign Up</Link>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
        </Container>
    );
};

export default LoginPage;