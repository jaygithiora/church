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
import { useSnackbar } from "notistack";
import TestimonialsService from "../../../services/dashboard/spiritual/TestimonialsService";
import { FaHandHoldingHeart } from "react-icons/fa";


function TestimonialPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { loading, setLoading } = useAuth();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [status, setStatus] = useState("draft");
    const [errors, setErrors] = useState({
        id: "",
        testimonial: "",
    });

    useEffect(() => {
        if (id != undefined)
            getTestimonial();
    }, [id]);

    const getTestimonial = async () => {
        setLoading(true);
        const testimonialData =
            await TestimonialsService.getTestimonial(id, enqueueSnackbar);
        if (testimonialData) {
            console.log(testimonialData);
            //setForms(testimonialData.data);
            //setTotalPages(testimonialData.last_page);
            const editor = rteRef.current?.editor;
            setStatus(testimonialData.status);
            //const parsedContent = parseEditorContent(testimonialData?.message);

            if (editor /*&& parsedContent*/) {
                editor.commands.setContent(testimonialData.testimonial);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(testimonialData.content));
            }*/
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshTestimonial = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSaveTestimonial = async (e) => {
        e.preventDefault();
        const editor = rteRef.current?.editor;

        if (!editor) return;

        const contentHTML = editor.getHTML(); // ✅ includes images
        if (validateForm()) {
            setLoading(true);

            const data = await TestimonialsService.addTestimonial(
                { id: id != undefined ? id : 0, testimonial: contentHTML, status: status }, enqueueSnackbar
            );
            if (data) {
                navigate("/dashboard/spiritual/testimonials");
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

    return (
        <Container fluid>
            <Row>
                <Col sm={12} className="p-3">
                    <Card>
                        <CardHeader avatar={<FaHandHoldingHeart size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Edit" : "Add"} Testimonial
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
                                <FormControl>
                                    <RadioGroup row
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                                        <FormControlLabel value="published" control={<Radio />} label="Published" />
                                        <FormControlLabel value="archived" control={<Radio />} label="Archived" />
                                    </RadioGroup>
                                </FormControl>
                                <FormGroup className="mt-3">
                                <FormLabel className="pb-2"><b>Testimonial</b></FormLabel>

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
                                </FormGroup>

                                <div className="mt-3">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveTestimonial}
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Save Testimonial"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default TestimonialPage;
