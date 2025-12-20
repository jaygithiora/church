import { Avatar, Button, Card, CardActions, CardContent, CardHeader, IconButton, Pagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { BsEye} from 'react-icons/bs'
import { FaAirbnb, FaBan, FaUserShield } from 'react-icons/fa'
import { useAuth } from '../../../../services/AuthContext'
import { useParams } from 'react-router-dom'
import RolesService from '../../../../services/dashboard/users/RolesService'
import { formatDistanceToNow } from 'date-fns'


function RolePage() {
    const { loading, setLoading } = useAuth();
    const [role, setRole] = useState();
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getRole();
    }, [id]);

    const getRole = async () => {
        setLoading(true);
        const roleData = await RolesService.getRole(id);
        setRole(roleData.role);
        setPermissions(roleData.permissions);
        // Pre-select permissions which have a non-empty "roles" array
        const defaultSelected = roleData.permissions
            .filter(permission => permission.roles && permission.roles.length > 0)
            .map(permission => permission.id);
        setSelectedPermissions(defaultSelected);
        setLoading(false);
    }

    // Toggle checkbox selection
    const handleCheckboxChange = (permissionId) => {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    };

    const handleSavePermissions = async (e) => {
        e.preventDefault();
        setLoading(true);
        await RolesService.addPermissions(id, selectedPermissions);
        setLoading(false);
    }
    


    return (
        <Container fluid>
            <Row className='d-flex align-items-center'>
                <Col sm={12} className='p-4'>
                    <h5><BsEye /> View Role</h5>
                </Col>
                {/*<Col sm={3} className='p-4 text-end'>
                    <Button variant='contained' color='primary'> <FaEdit /> Edit</Button>
                </Col>*/}
            </Row>

            <Row>
                <Col sm={12}>
                
                        <Card className='mb-3'>
                    {role != null &&
                            <CardHeader avatar={
                                <Avatar aria-label="user" className='border-dark'>
                                    {/*<img src="/assets/crowdfunding.jpg" className='img-fluid'/>*/}
                                    <FaUserShield className='text-dark' />
                                </Avatar>
                            }

                                title={role.name}
                                subheader={formatDistanceToNow(new Date(role.created_at), { addSuffix: true })}
                            ></CardHeader>}
                            <CardContent>
                                    <Form onSubmit={handleSavePermissions}>
                                        <Row>
                                            {permissions.length > 0 ? (
                                                permissions.map((permission, index) => (
                                                    <Col xs={12} sm={6} md={4} key={index}>
                                                        <Card className='mb-3 shadow-none'>
                                                            <CardActions className='p-3'>
                                                                <Form.Group>
                                                                    <Form.Check type='checkbox' id={`permissions-${permission.id}`} label={permission.name} checked={selectedPermissions.includes(permission.id)}
                                                                        onChange={() => handleCheckboxChange(permission.id)}></Form.Check>
                                                                </Form.Group>
                                                            </CardActions>
                                                        </Card>
                                                    </Col>
                                                ))
                                            ) :
                                                <Col xs={12}>{!loading ? <p className="text-muted text-center">
                                                    <FaBan /> No Permissions available
                                                </p> : <p className="text-muted text-center">Loading...</p>}</Col>
                                            }
                                            <Col sm={12} className='text-end'>
                                                <Button type='submit' color='primary' variant='contained' disabled={loading || role?.name === "Super Admin"}><FaAirbnb /> Save Changes</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                            
                        </CardContent>
                    </Card>

                </Col>
            </Row>
        </Container>
    )
}

export default RolePage