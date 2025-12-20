import { Avatar, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { FaBan, FaCoins, FaPlus, FaUser } from 'react-icons/fa';
import { useAuth } from '../../../services/AuthContext';
import TransactionsService from '../../../services/dashboard/transactions/TransactionsService';
import { formatDistanceToNow } from 'date-fns';

function TransactionsPage() {
    const { loading, setLoading } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getTransactions = async () => {
            setLoading(true);
            const transactionsData = await TransactionsService.getTransactions(pages);
            if (transactionsData) {
                //console.log(transactionsData);
                setTransactions(transactionsData.data);
                setTotalPages(transactionsData.last_page);
            }
            setLoading(false);
        }
        getTransactions();
    }, [pages]);

    return (
        <Container className='mt-3 mb-3' fluid>
            <Row>
                <Col xs={9}>
                    <h4><FaCoins /> Transactions</h4>
                </Col>
                <Col xs={3} className='text-end'>
                    <Button variant='contained' color='primary'><FaPlus /> Add</Button>
                </Col>

                {transactions.length > 0 ? transactions.map((transaction, index) => (
                    <Col sm={6} md={4} className='p-3' key={index}>
                        <Card className='border'>
                            <CardHeader avatar={<Avatar className='border-dark'><FaUser className='text-dark' /></Avatar>}
                                title={transaction?.user.name}
                                subheader={formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent>
                            <p className='text-center'>Transaction Code: <span className='text-muted'>{transaction?.mpesa?.TransID}</span></p>
                            <Divider className='border-dark mb-2'></Divider>
                            <p className='text-center'>Amount: <b className='text-success'>KES {transaction?.amount}</b></p>
                            <Divider className='border-dark mb-2'></Divider>
                            <p className='text-center'><span className='badge bg-success'>MPESA Deposit</span></p>
                            </CardContent>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No Transactions yet</div>
                </Col>)}
            </Row>
        </Container>
    )
}

export default TransactionsPage