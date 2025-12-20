import React, { useEffect, useRef, useState } from 'react'
import { Badge, Col, Container, Image, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import 'react-phone-input-2/lib/style.css';
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Pagination, Skeleton, Slider, TextField, Typography } from '@mui/material';
import SpecialitySelectComponent from '../components/dashboard/settings/SpecialitySelectComponent';
import IndexService from '../services/dashboard/IndexService';
import { formatDistanceToNow } from 'date-fns';
import { FaAirbnb, FaAmbulance, FaClock, FaMapMarker, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { Autocomplete } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

function AmbulancesPage() {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [reload, setReload] = useState(false);
    const [radius, setRadius] = useState(5);

    const [ambulances, setAmbulances] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      //setName(place.address_components[1].long_name);
      //console.log('Place:', place);
      //setLocation(place.address_components[0].long_name);
      setLocation(inputRef.current.value);
      setLongitude(place.geometry?.location?.lng());
      setLatitude(place.geometry?.location?.lat());
    }
  };

    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        getAmbulances();
    }, [reload, pages, location, radius]);

    const getAmbulances = async () => {
        setAmbulances([]);
        setLoading(true);
        const ambulancesData =
            await IndexService.getAmbulances(pages, location, longitude, latitude, radius);
        if (ambulancesData) {
            //console.log(ambulancesData);
            setAmbulances(ambulancesData.data);
            setTotalPages(ambulancesData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshAmbulances = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    return (
        <Container className='pt-5 pb-5 mt-5'>
            <Row className='full-height'>
                <Col sm={12}>
                    <h5 className='pt-3 pb-3 text-success'><FaAmbulance /> <b>Ambulances</b></h5>
                    <div className='card-body'>
                        <Row>
                            <Form.Group className="col mb-3" controlId="exampleForm.ControlInput1">
                                <Autocomplete options={{
                                    componentRestrictions: { country: 'ke' }, strictBounds: true
                                }} onLoad={(autocomplete) => autocompleteRef.current = autocomplete} onPlaceChanged={onPlaceChanged}>
                                    <TextField sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderWidth: '2px', // 🔥 set border thickness
                                            },
                                            '&:hover fieldset': {
                                                borderWidth: '2px',
                                                borderColor: 'green'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderWidth: '2px',
                                            },
                                        },
                                    }} fullWidth type='text' inputRef={inputRef} label="Physical Location"
                                        size='small'
                                    />
                                </Autocomplete>
                            </Form.Group>
                            <Form.Group className="col mb-3" controlId="exampleForm.ControlInput1">
                                <Slider
                                    size="small"
                                    value={radius}
                                    onChange={(e, v) => setRadius(v)}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                />
                                <Form.Label className='small'>Search <b>{radius}</b> Radius (KM)</Form.Label>
                            </Form.Group>
                        </Row>
                    </div>
                </Col>
                {ambulances.length > 0 ? ambulances.map((ambulance, index) => (
                    <Col key={index} sm={6} md={4} lg={3} className='mb-3 mt-3'>
                        <Card className='border border-2 border-success'>
                            <CardHeader 
                                subheader={<Box>
                                    <Typography variant="h6" color='text.primary' sx={{ lineHeight:1 }}><b>{`${ambulance.name}`}</b></Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {ambulance?.company?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.primary">
                                        <FaMapMarkerAlt/> {ambulance.location}
                                    </Typography>
                                </Box>
                                }></CardHeader>
                            <CardContent>
                                <Chip variant='outlined' color='success' label={<b>{ambulance?.charges} KES/KM</b>}></Chip>
                                {/*<Typography><b>{ambulance.name}</b></Typography>
                                <Typography variant="subtitle2" color="text.secondary">{ambulance?.company?.name}</Typography>
                                <Typography variant='subtitle2' color='text.primary'><FaMapMarkerAlt/> {ambulance?.location}</Typography>*/}
                                <Button variant='contained' color='success' LinkComponent={Link} to={`/dashboard/ambulances/book/${ambulance.id}`} className=' mt-3 w-100' disableElevation><FaAirbnb />&nbsp; Book</Button>
                            </CardContent>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No <b>ambulances</b> yet</div>
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

export default AmbulancesPage;