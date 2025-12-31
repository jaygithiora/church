import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    FormGroup,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
//import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../../services/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBlockquote,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonCode,
    MenuButtonCodeBlock,
    MenuButtonEditLink,
    MenuButtonHorizontalRule,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonRedo,
    MenuButtonStrikethrough,
    MenuButtonUnderline,
    MenuButtonUndo,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    MenuSelectTextAlign,
    RichTextEditor,
    ResizableImage,
    MenuButtonAddTable,
    TableBubbleMenu,
    MenuButtonTextColor,
    LinkBubbleMenu,
    LinkBubbleMenuHandler,
    MenuButtonHighlightColor,
} from "mui-tiptap";
import Image from "@tiptap/extension-image";
//import { TableKit } from "@tiptap/extension-table";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
//import { mergeAttributes } from '@tiptap/core';
import { Table as TTTable } from '@tiptap/extension-table';
import { TableRow as TTTableRow } from '@tiptap/extension-table-row';
import { TableHeader as TTTableHeader } from '@tiptap/extension-table-header';
import { TableCell as TTTableCell } from '@tiptap/extension-table-cell';
import { enqueueSnackbar, useSnackbar } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import EventsService from "../../../services/dashboard/events/EventsService";
import { Autocomplete } from "@react-google-maps/api";
import { PiMicrophoneStage, PiNotificationFill } from "react-icons/pi";
import OrderOfServicesService from "../../../services/dashboard/order-of-services/OrderOfServicesService";


function OrderOfServicePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [startTime, setStartTime] = useState(dayjs('08:00:00', 'HH:mm:ss'));
    const [endTime, setEndTime] = useState(dayjs('17:00:00', 'HH:mm:ss'));
    const [name, setName] = useState("");
    const [day, setDay] = useState(7);
    const [banner, setBanner] = useState(null);
    const [status, setStatus] = useState("draft");
    const [reload, setReload] = useState(false);
    const [location, setLocation] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const [errors, setErrors] = useState({
        id: "",
        banner: "",
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        status: "",
    });

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            //setName(place.address_components[1].long_name);
            //console.log('Place:', place);
            //setLocation(place.address_components[0].long_name);
            setLocation(inputRef.current?.value ?? place.address_components[0].long_name);
            setLongitude(place.geometry?.location?.lng());
            setLatitude(place.geometry?.location?.lat());
            setErrors({ ...errors, location: "" });
        }
    };

    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        if (id != undefined)
            getOrderOfService();
    }, [id]);

    const getOrderOfService = async () => {
        setLoading(true);
        const orderOfServiceData =
            await OrderOfServicesService.getOrderOfService(id, enqueueSnackbar);
        if (orderOfServiceData) {
            console.log(orderOfServiceData);
            //setForms(orderOfServiceData.data);
            //setTotalPages(orderOfServiceData.last_page);
            setName(orderOfServiceData.name);
            setStartTime(dayjs(orderOfServiceData.start_time, 'HH:mm'));
            setEndTime(dayjs(orderOfServiceData.end_time,'HH:mm'));
            //setStatus(orderOfServiceData.status);
            setLocation(orderOfServiceData.location);
            setLongitude(orderOfServiceData.longitude);
            setLatitude(orderOfServiceData.latitude);
            const timeout = setTimeout(() => {
                inputRef.current.value = orderOfServiceData.location;
            }, 100); 
            const editor = rteRef.current?.editor;
            //const parsedContent = parseEditorContent(orderOfServiceData?.message);

            if (editor /*&& parsedContent*/) {
                editor.commands.setContent(orderOfServiceData.description);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(orderOfServiceData.content));
            }*/
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshOrderOfServices = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSaveOrderOfService = async (e) => {
        e.preventDefault();
        const editor = rteRef.current?.editor;

        if (!editor) return;

        const contentHTML = editor.getHTML(); // ✅ includes images
        if (validateForm()) {
            setLoading(true);
            const formData = new FormData();
            formData.append("id", id != undefined ? id : 0);
            formData.append("name", name);
            formData.append("start_time", startTime.format("HH:mm"));
            formData.append("end_time", endTime.format("HH:mm"));
            formData.append("day", day);
            formData.append("description", contentHTML);
            formData.append("status", status);
            formData.append("location", location);
            formData.append("longitude", longitude);
            formData.append("latitude", latitude);
            if (banner) {
                formData.append("banner", banner);
            }
            const data = await OrderOfServicesService.addOrderOfService(
                formData,
                enqueueSnackbar
            );
            if (data) {
                navigate("/dashboard/order-of-services");
            }
            setLoading(false);
        }
    };


    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };
        if (name) {
            errorsCopy.name = "";
        } else {
            errorsCopy.name = "Title is required";
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    };

    const parseEditorContent = (content) => {
        if (!content) return null;

        if (typeof content === "string") {
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error("Invalid editor JSON:", e);
                return null;
            }
        }

        return content; // already an object
    };
    return (
        <Container fluid>
            <Row>
                <Col sm={12} className="p-3">
                    <Card>
                        <CardHeader avatar={<PiMicrophoneStage size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Edit" : "Add"} Order Of Service
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
                                {/*<FormControl>
                                    <RadioGroup row
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                                        <FormControlLabel value="published" control={<Radio />} label="Published" />
                                        <FormControlLabel value="archived" control={<Radio />} label="Archived" />
                                    </RadioGroup>
                                </FormControl>*/}
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Name"
                                        size="small"
                                        error={errors.name}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        helperText={errors.name}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <FormControl fullWidth>
                                        <InputLabel>Day</InputLabel>
                                        <Select 
                                        label="Day"
                                        size="small"
                                        error={errors.day}
                                        value={day}
                                        onChange={(e) => satDay(e.target.value)}
                                        helperText={errors.name}
                                    >
                                        <MenuItem value={1}>Monday</MenuItem>
                                        <MenuItem value={2}>Tuesday</MenuItem>
                                        <MenuItem value={3}>Wednesday</MenuItem>
                                        <MenuItem value={4}>Thursday</MenuItem>
                                        <MenuItem value={5}>Friday</MenuItem>
                                        <MenuItem value={6}>Saturday</MenuItem>
                                        <MenuItem value={7}>Sunday</MenuItem>
                                    </Select>
                                        </FormControl>
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <Row>
                                    <FormGroup className="col-sm-6 mb-3">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                label="From Date"
                                                value={startTime}
                                                onChange={(newValue) => setStartTime(newValue)}
                                                slotProps={{
                                                    textField: {
                                                        size: "small",
                                                        fullWidth: true,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormGroup>

                                    <FormGroup className="col-sm-6 mb-3">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                label="To Date"
                                                value={endTime}
                                                onChange={(newValue) => setEndTime(newValue)}
                                                slotProps={{
                                                    textField: {
                                                        size: "small",
                                                        fullWidth: true,
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormGroup>
                                </Row>
                                <FormGroup className="col-sm-12 mb-3">
                                    <FormLabel className="mb-1">Location</FormLabel>
                                    <Autocomplete
                                        options={{
                                            componentRestrictions: {
                                                country: "ke",
                                            },
                                            strictBounds: true,
                                        }}
                                        onLoad={(autocomplete) =>
                                            (autocompleteRef.current = autocomplete)
                                        }
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <TextField size="small"
                                            fullWidth
                                            type="text"
                                            inputRef={inputRef}
                                            placeholder="Location"
                                        />
                                    </Autocomplete>
                                    {errors.location && (
                                        <span className="invalid-feedback">
                                            {errors.location}
                                        </span>
                                    )}
                                </FormGroup>
                                <FormLabel>Order Of Service Description</FormLabel>

                                <RichTextEditor
                                    ref={rteRef}
                                    sx={{
                                        minHeight: '200px',
                                        '& .ProseMirror': {
                                            minHeight: '200px',
                                            padding: '16px', // Add some padding too
                                        }
                                    }}
                                    extensions={[StarterKit, Image.configure({
                                        inline: false,
                                        allowBase64: true,
                                    }),
                                        ResizableImage,
                                        /*TableKit.configure({
                                            table: { resizable: true, },
                                        }),*/
                                        //TableImproved,
                                        LinkBubbleMenuHandler, TextStyle, Color, Highlight.configure({ multicolor: true }),

                                        // Replace TableKit with individual extensions
                                        TTTable.configure({
                                            resizable: true,
                                        }),
                                        TTTableRow,
                                        TTTableHeader,
                                        TTTableCell
                                    ]} // Or any Tiptap extensions you wish!
                                    content="" // Initial content for the editor
                                    // Optionally include `renderControls` for a menu-bar atop the editor:
                                    renderControls={() => (
                                        <MenuControlsContainer>
                                            <MenuSelectHeading />
                                            <MenuDivider />
                                            <MenuButtonBold />
                                            <MenuButtonItalic />
                                            <MenuButtonUnderline />
                                            <MenuButtonStrikethrough />
                                            <MenuDivider />
                                            <MenuSelectTextAlign />
                                            <MenuButtonTextColor />
                                            <MenuButtonHighlightColor />
                                            <MenuDivider />
                                            <MenuButtonOrderedList />
                                            <MenuButtonBulletedList />
                                            <MenuDivider />
                                            <MenuButtonBlockquote />
                                            <MenuButtonCode />
                                            <MenuButtonCodeBlock />
                                            <MenuDivider />
                                            <MenuButtonEditLink />

                                            <MenuButtonHorizontalRule />
                                            <MenuButtonAddTable />{/* Add the custom cell color button here */}
                                            <MenuDivider />
                                            <MenuButtonUndo />
                                            <MenuButtonRedo />
                                            {/* Add more controls of your choosing here */}
                                        </MenuControlsContainer>
                                    )}
                                    children={() => (
                                        <><LinkBubbleMenu />
                                            <TableBubbleMenu />
                                        </>
                                    )} />
                                <FormGroup className="mt-3">
                                    <FormLabel>Order Of Service Banner</FormLabel>
                                    <TextField size='small' type="file" placeholder="Upload Order Of Service Banner" fullWidth accept="image/*"
                                        onChange={(e) => setBanner(e.target.files[0])} />
                                </FormGroup>
                                <div className="mt-3">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveOrderOfService}
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Save Order Of Service"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default OrderOfServicePage;
