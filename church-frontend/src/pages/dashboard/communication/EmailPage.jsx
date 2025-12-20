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
import ArticlesService from "../../../services/dashboard/articles/ArticlesService";
import { useSnackbar } from "notistack";
import CommunicationService from "../../../services/dashboard/communication/CommunicationService";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import UsersSelectComponent from "../../../components/dashboard/users/UsersSelectComponent";


function EmailPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [recipients, setRecipients] = useState([]);
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
        const emailsData =
            await CommunicationService.getEmail(id);
        if (emailsData) {
            //console.log(emailsData);
            //setForms(emailsData.data);
            //setTotalPages(emailsData.last_page);
            setTitle(emailsData.title);
            emailsData.recipients.foreach(recipient => {
                recipients.push(recipient.email);
            });
            const editor = rteRef.current?.editor;
            const parsedContent = parseEditorContent(emailsData?.content);

            if (editor && parsedContent) {
                editor.commands.setContent(parsedContent);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(emailsData.content));
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
            const data = await CommunicationService.sendEmail(
                { id: id != undefined ? id : 0, subject: title, content: contentHTML, recipients:recipientIds }
            );
            if (data) {
                navigate("/dashboard/communication/emails");
            }
            setLoading(false);
        }
    };


    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (title) {
            errorsCopy.title = "";
        } else {
            errorsCopy.title = "Title is required";
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
                        <CardHeader avatar={<MdArticle size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Resend Email" : "Send Email"}
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
                                <FormGroup className="col-sm-12 mb-3">
                                    <UsersSelectComponent selectedOption={recipients} onSelectChange={setRecipients} isMultiple={true}/>
                                    {errors.recipients && <FormHelperText>{errors.firstname}</FormHelperText>}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Title"
                                        size="small"
                                        error={errors.title}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        helperText={errors.title}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormLabel><b>Content</b></FormLabel>

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
                                        {loading ? "Sending..." : "Save Email"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default EmailPage;
