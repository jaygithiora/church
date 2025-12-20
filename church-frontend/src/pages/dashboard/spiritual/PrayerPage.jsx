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
import { enqueueSnackbar, useSnackbar } from "notistack";
import PrayersService from "../../../services/dashboard/spiritual/PrayersService";
import { FaHandsPraying } from "react-icons/fa6";


function PrayerPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const rteRef = useRef(null);
    const [status, setStatus] = useState("draft");
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState({
        id: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        if (id != undefined)
            getPrayer();
    }, [id]);

    const getPrayer = async () => {
        setLoading(true);
        const prayersData =
            await PrayersService.getPrayer(id, enqueueSnackbar);
        if (prayersData) {
            console.log(prayersData);
            //setForms(prayersData.data);
            //setTotalPages(prayersData.last_page);
            setTitle(prayersData.title);
            setStatus(prayersData.status);
            const editor = rteRef.current?.editor;
            //const parsedContent = parseEditorContent(schedulesData?.message);

            if (editor /*&& parsedContent*/) {
                editor.commands.setContent(prayersData.description);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(schedulesData.content));
            }*/
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshPrayers = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSavePrayer = async (e) => {
        e.preventDefault();
        const editor = rteRef.current?.editor;

        if (!editor) return;

        const contentHTML = editor.getHTML(); // ✅ includes images
        if (validateForm()) {
            setLoading(true);

            const data = await PrayersService.addPrayer(
                { id: id != undefined ? id : 0, title: title, prayer: contentHTML, status: status }, enqueueSnackbar
            );
            if (data) {
                navigate("/dashboard/spiritual/prayers");
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

    return (
        <Container fluid>
            <Row>
                <Col sm={12} className="p-3">
                    <Card>
                        <CardHeader avatar={<FaHandsPraying size={25} />} title={

                            <h5 className="mt-2">
                                {id != undefined ? "Edit" : "Add"} Prayer
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

                                <FormLabel>Prayer</FormLabel>

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
                                        onClick={handleSavePrayer}
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Save Prayer"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default PrayerPage;
