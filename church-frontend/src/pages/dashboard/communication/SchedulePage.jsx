import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    useTheme,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row, Tab } from "react-bootstrap";
//import { formatDistanceToNow } from "date-fns";
import { MdAlarm, MdArticle } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from '@tiptap/react';
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
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import UsersSelectComponent from "../../../components/dashboard/users/UsersSelectComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";


function SchedulePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [recipients, setRecipients] = useState([]);
    const [scheduleTime, setScheduleTime] = useState(dayjs());
    const [type, setType] = useState("email");
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState({
        id: "",
        recipients: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        if (id != undefined)
            getEmail();
    }, [id]);

    const getEmail = async () => {
        setLoading(true);
        const schedulesData =
            await CommunicationService.getSchedule(id);
        if (schedulesData) {
            console.log(schedulesData);
            //setForms(schedulesData.data);
            //setTotalPages(schedulesData.last_page);
            setTitle(schedulesData.title);
            setType(schedulesData.type);
            setScheduleTime(dayjs(schedulesData.schedule));
            schedulesData.recipients.forEach(recipient => {
                setRecipients(prev => {
                    const exists = prev.some(r => r.value === recipient.user.id);
                    if (exists) return prev;

                    return [
                        ...prev,
                        {
                            value: recipient.user.id,
                            label: `${recipient.user.firstname} ${recipient.user.lastname} (${recipient.user.email} - ${recipient.user.phone})`,
                        }
                    ];
                });
                //recipients.push({value:recipient.user.id, label:recipient.user.firstname + " " + recipient.user.lastname+"(" + recipient.user.email + " - "+ recipient.user.phone + ")"});
            });
            const editor = rteRef.current?.editor;
            //const parsedContent = parseEditorContent(schedulesData?.message);

            if (editor /*&& parsedContent*/) {
                editor.commands.setContent(schedulesData.message);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(schedulesData.content));
            }*/
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshEmail = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSaveEmail = async (e) => {
        e.preventDefault();
        const editor = rteRef.current?.editor;

        if (!editor) return;

        const contentHTML = editor.getHTML(); // ✅ includes images
        if (validateForm()) {
            setLoading(true);

            const recipientIds = recipients.map(option => option.value)
            const data = await CommunicationService.addSchedule(
                { id: id != undefined ? id : 0, title: title, message: contentHTML, recipients: recipientIds, schedule: scheduleTime.format("YYYY-MM-DD HH:mm:ss"), type: type }
            );
            if (data) {
                navigate("/dashboard/communication/schedules");
            }
            setLoading(false);
        }
    };


    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };
        /*
                if (title) {
                    errorsCopy.title = "";
                } else {
                    errorsCopy.title = "Title is required";
                    valid = false;
                }*/
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
                        <CardHeader avatar={<MdAlarm size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Reschedule" : "Schedule"} Message
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
                                <FormControl>
                                    <RadioGroup row
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <FormControlLabel value="email" control={<Radio />} label="Email" />
                                        <FormControlLabel value="sms" control={<Radio />} label="SMS" />
                                    </RadioGroup>
                                </FormControl>
                                <FormGroup className="col-sm-12 mb-3">
                                    <UsersSelectComponent selectedOption={recipients} onSelectChange={setRecipients} isMultiple={true} />
                                    {errors.recipients && <FormHelperText>{errors.firstname}</FormHelperText>}
                                </FormGroup>
                                {type === "email" && <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Title"
                                        size="small"
                                        error={errors.title}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        helperText={errors.title}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>}

                                <FormGroup className="col-sm-12 mb-3">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="Schedule Time"
                                            value={scheduleTime}
                                            onChange={(newValue) => setScheduleTime(newValue)}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                },
                                            }} disablePast
                                        />
                                    </LocalizationProvider>
                                </FormGroup>
                                <FormLabel>Message</FormLabel>

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

                                <div className="mt-3">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveEmail}
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Save Schedule"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default SchedulePage;
