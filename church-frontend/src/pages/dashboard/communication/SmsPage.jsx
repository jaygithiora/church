import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormGroup,
    FormHelperText,
    FormLabel,
    TextField,
    useTheme,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row, Tab } from "react-bootstrap";
//import { formatDistanceToNow } from "date-fns";
import { MdArticle } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import UsersSelectComponent from "../../../components/dashboard/users/UsersSelectComponent";
import { FaCommentSms, FaRegMessage } from "react-icons/fa6";


function SmsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [recipients, setRecipients] = useState([]);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        id: "",
        recipients: "",
        message: "",
    });

    useEffect(() => {
        if (id != undefined)
            getSms();
    }, [id]);

    const getSms = async () => {
        setLoading(true);
        const smsData =
            await CommunicationService.getSms(id);
        if (smsData) {
            //console.log(smsData);
            setTitle(smsData.title);
            smsData.recipients.foreach(recipient => {
                recipients.push(recipient.email);
            });
            setMessage(smsData?.message);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshSms = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSaveSms = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);

            const recipientIds = recipients.map(option => option.value)
            const data = await CommunicationService.sendSms(
                { id: id != undefined ? id : 0, message: message, recipients: recipientIds }
            );
            if (data) {
                navigate("/dashboard/communication/sms");
            }
            setLoading(false);
        }
    };


    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (recipients.length > 0) {
            errorsCopy.recipients = "";
        } else {
            errorsCopy.recipients = "Recipients are required";
            valid = false;
        }

        if (message && message.trim() !== "") {
            errorsCopy.message = "";
        } else {
            errorsCopy.message = "Message is required";
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    };

    return (
        <Container fluid>
            <Row>
                <Col sm={12} className="p-3">
                    <Card>
                        <CardHeader avatar={<FaCommentSms size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Resend SMS" : "Send SMS"}
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
                                <FormGroup className="col-sm-12 mb-4">
                                    <UsersSelectComponent selectedOption={recipients} onSelectChange={setRecipients} isMultiple={true} />
                                    {errors.recipients && <FormHelperText error>{errors.recipients}</FormHelperText>}
                                </FormGroup>

                                <TextField label="SMS" fullWidth multiline minRows={6} maxRows={10} value={message} onChange={(e) => setMessage(e.target.value)}
                                    error={errors.message ? true : false} helperText={errors.message} />
                            </div>

                            <div className="mt-3">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveSms}
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send SMS"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default SmsPage;
