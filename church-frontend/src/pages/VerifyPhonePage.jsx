// VerifyPhonePage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

const VerifyPhonePage = () => {
    const { isAuthenticated, login,setIsVerified, user, checkOtp, sendOtp, verifyOtp } = useAuth();
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate();
    if (!isAuthenticated) {
        <Navigate to="/login" replace />
    }
    useEffect(() => {
        checkOTP();
    }, []);
    useEffect(() => {
        let interval = null;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    
    const checkOTP = async () => {
        setLoading(true);
        const otpPresent = await checkOtp();
        if (!otpPresent) {
            await handleResend();
        } else {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const input = e.target.value;
        // Allow only numbers and limit to 6 digits
        const numericValue = input.replace(/\D/g, '').slice(0, 6);
        setCode(numericValue);
    };
    const handleResend = async () => {
        setLoading(true);
        const sent = await sendOtp();
        setLoading(false);
        if(sent){
            setTimer(60); // Set 1 minute timer
        }
    }

    const handleVerifyOtp = async(e)=>{
        e.preventDefault();
        setLoading(true);
        const verified = await verifyOtp(code);
        setLoading(false);
        if (verified) {
            setIsVerified(true);
            navigator('/dashboard');
        }
    }

    const maskPhoneNumber = (phone) => {
        const str = phone.toString();
        if (str.length < 7) return str; // too short to mask
        const firstFour = str.slice(0, 4);
        const lastThree = str.slice(-3);
        const maskedLength = str.length - 7;
        const masked = '*'.repeat(maskedLength);
        return `${firstFour}${masked}${lastThree}`;
    }

    return (
        <>
            <Container className='pt-5'>
                <Row className='justify-content-center d-flex align-items-center full-height'>
                    <Col sm={8} md={6} lg={4}>
                        <Form className='card mt-5 mb-5' onSubmit={handleVerifyOtp}>
                            {/*<div className='card-header bg-light p-3'>
                            <h5>Login to your account</h5>
                        </div>*/}
                            <div className='card-body'>
                                <h5>Verify Your Phone Number</h5>
                                <p>We've sent a <b>6-digit</b> code to <b>{maskPhoneNumber(user.phone)}</b></p>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    {/*<Form.Label>6-digit code</Form.Label>*/}
                                    <Form.Control type="text" placeholder="Enter 6-digit code" className='border-secondary' value={code} onChange={handleChange} required />
                                </Form.Group>
                                {/*
                        <Form.Group className='mb-3'>
                            <Form.Check type='checkbox' id='remember_me' label="Remember Me"/>
                        </Form.Group>*/}
                                <div className='text-end mb-3'>
                                    <button className='btn btn-primary w-100' disabled={loading || code.length < 6}>
                                        {loading && <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}&nbsp;VERIFY</button>
                                </div>
                                <div className='text-center mb-3'>
                                    <Link onClick={handleResend} disabled={timer > 0 || loading}>{timer > 0 ? `Resend available in ${String(timer).padStart(2, '0')}s` : `Didn't get the code? Click to Resend`}</Link>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default VerifyPhonePage;