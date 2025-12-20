import React, { useEffect, useState } from 'react'
import { Badge, Col, Container, Image, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '../services/AuthContext';
import { MdAddShoppingCart, MdEdit } from 'react-icons/md';
import { BsCalendar, BsSearch } from 'react-icons/bs';
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Pagination, Skeleton, TextField, Typography } from '@mui/material';
import SpecialitySelectComponent from '../components/dashboard/settings/SpecialitySelectComponent';
import IndexService from '../services/dashboard/IndexService';
import { formatDistanceToNow } from 'date-fns';
import { FaClock, FaSearch, FaStar } from 'react-icons/fa';
import { FaCalendarDays, FaUserDoctor } from 'react-icons/fa6';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function SpecialistsPage() {
    const [loading, setLoading] = useState(false);
    const [speciality, setSpeciality] = useState(null);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(dayjs());
    const [reload, setReload] = useState(false);

    const [specialists, setSpecialists] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [errors, setErrors] = useState({ date: "" });

    useEffect(() => {
        getSpecialists();
    }, [reload, pages]);

    useEffect(() => {
        console.log(date);
        const timer = setTimeout(() => {
            getSpecialists();
        }, 500); // 500ms delay

        return () => clearTimeout(timer); // cleanup
    }, [search, speciality, date]);

    const getSpecialists = async () => {
        setSpecialists([]);
        setLoading(true);
        const specialistsData =
            await IndexService.getSpecialists(search, pages, speciality?.value ?? 0,
                date.format('YYYY-MM-DD'),);
        if (specialistsData) {
            //console.log(specialistsData);
            setSpecialists(specialistsData.data);
            setTotalPages(specialistsData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshSpecialists = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).replace(':', '.'); // Optional: 1:00 PM → 1.00 PM
    };
    return (
        <Container className='pt-5 pb-5 mt-5'>
            <Row className='full-height'>
                <Col sm={12}>
                    <h5 className='pt-3 pb-3 text-success'><FaUserDoctor /> <b>Specialists</b></h5>
                    <Row>
                        <Form.Group className="col-12 col-sm-4 mb-3" controlId="exampleForm.ControlInput1">
                            <TextField fullWidth label="Search Specialist" size='small' type="text" placeholder="Search Specialist"
                                className='border-secondary' value={search} onChange={(e) => setSearch(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="col-6 col-sm-4 mb-3" controlId="exampleForm.ControlInput1">
                            <SpecialitySelectComponent selectedOption={speciality} onSelectChange={setSpeciality} />
                        </Form.Group>
                        <Form.Group className="col-6 col-sm-4 mb-3" controlId="exampleForm.ControlInput1">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker disablePast label="Appointment Date" value={date} onChange={(e) => setDate(e)}
                                    format='DD MMMM YYYY'
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            error: !!errors.date,
                                            helperText: errors.date,
                                            size: "small",
                                            // Prevent invalid manual input
                                            onKeyDown: (e) => {
                                                if (e.key === 'Enter' && !date) {
                                                    errors.date = 'Please select a valid time';
                                                } else {
                                                    errors.date = '';
                                                }
                                            },
                                        },
                                    }} />

                            </LocalizationProvider>
                        </Form.Group>
                        <div className='col-sm-12'>
                            {search && <Chip label={search} size='small' color='success' />}&nbsp;
                            {speciality && <Chip label={speciality.label} size='small' color='success' />}&nbsp;
                            <Chip label={date.format('DD MMMM, YYYY')} size='small' color='success' />
                        </div>
                    </Row>
                </Col>
                {specialists.length > 0 ? specialists.map((specialist, index) => (
                    <Col key={index} sm={6} md={4} lg={3} className='mb-3 mt-3'>
                        <Card className='border border-2 border-success h-100'>
                            <CardHeader avatar={<Avatar
                                src={
                                    specialist.user?.image != null
                                        ? specialist.user?.image
                                        : "/assets/young-man-avatar.svg"
                                }
                                className="border-0"
                            />}
                                subheader={<Box>
                                    <Typography variant="h6" color='text.primary'>{`Dr. ${specialist.user.firstname} ${specialist.user.lastname}`}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {specialist.user.user_specialities.map((speciality, index) => (<Chip key={index} label={speciality.speciality.name} size='small' variant='outlined' color='success' className='border-0' />))}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        <FaStar className='text-success' /> <b>4.5</b> (122)
                                    </Typography>
                                </Box>
                                }></CardHeader>
                            <CardContent>
                                <p className='small clamp-text'>{specialist.user?.user_profile?.about}</p>
                                <div className='mb-2 text-center'>
                                    <Chip icon={<FaClock />} color="success" variant='outlined' label={
                                        `${formatTime(specialist.from_time)} -
                                                                                    ${formatTime(specialist.to_time)}`} size="small">
                                    </Chip></div>
                                <Button variant='contained' color='success' className='w-100' disableElevation><FaCalendarDays />&nbsp; Book</Button>
                            </CardContent>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No <b>Specialists</b> yet</div>
                </Col>)}

                <Col sm={12}>
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
                {loading && <>
                    {/* For variant="text", adjust the height via font-size */}
                    <Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col><Col sm={6} md={4} lg={3} className='mb-3'>
                        <Skeleton variant="rounded" height={200} />
                    </Col></>}
            </Row>
        </Container>
    );
};

export default SpecialistsPage;