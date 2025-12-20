import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormGroup,
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
    MenuButtonImageUpload,
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
    TableImproved,
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
import { Popover } from '@mui/material';
import { SketchPicker } from 'react-color';
import { FormatColorFill } from '@mui/icons-material';
import { TableCell as TTTableCell } from '@tiptap/extension-table-cell';
//import { mergeAttributes } from '@tiptap/core';
import { Table as TTTable } from '@tiptap/extension-table';
import { TableRow as TTTableRow } from '@tiptap/extension-table-row';
import { TableHeader as TTTableHeader } from '@tiptap/extension-table-header';
import ArticlesService from "../../../services/dashboard/articles/ArticlesService";
import { useSnackbar } from "notistack";


function EmailViewPage() {
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
            getForm();
    }, [id]);

    const getForm = async () => {
        setLoading(true);
        const articleData =
            await ArticlesService.getArticle(id);
        if (articleData) {
            //console.log(articleData);
            //setForms(articleData.data);
            //setTotalPages(articleData.last_page);
            setTitle(articleData.title);
            const editor = rteRef.current?.editor;
            const parsedContent = parseEditorContent(articleData?.content);

            if (editor && parsedContent) {
                editor.commands.setContent(parsedContent);
            }/*
            if (editor) {
                editor.commands.setContent(JSON.parse(articleData.content));
            }*/
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshForms = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };

    const handleSaveArticle = async (e) => {
        e.preventDefault();
        const editor = rteRef.current?.editor;

        if (!editor) return;

        const contentJSON = editor.getJSON(); // ✅ includes images
        if (validateForm()) {
            setLoading(true);
            const data = await ArticlesService.addArticle(
                { id: id != undefined ? id : 0, title: title, content: contentJSON }
            );
            if (data) {
                navigate("/dashboard/articles");
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
                                {id != undefined ? "Edit Article" : "Add Article"}
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <div>
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
                                        TableCellWithBackground, // Our custom cell with backgroundColor
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
                                            {/*<MenuButtonImageUpload
                                                onUploadFiles={(files) => {
                                                    // Handle image upload here
                                                    // Return a promise that resolves to an array of image sources
                                                    return Promise.all(
                                                        files.map(async (file) => {
                                                            // Option 1: Convert to base64
                                                            const base64 = await new Promise((resolve) => {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => resolve(reader.result);
                                                                reader.readAsDataURL(file);
                                                            });
                                                            return { src: base64, alt: file.name };

                                                            // Option 2: Upload to server and return URL
                                                            // const formData = new FormData();
                                                            // formData.append('image', file);
                                                            // const response = await fetch('/api/upload', {
                                                            //   method: 'POST',
                                                            //   body: formData,
                                                            // });
                                                            // const data = await response.json();
                                                            // return { src: data.url, alt: file.name };
                                                        })
                                                    );
                                                }} />*/}
                                            <MenuButtonImageUpload
                                                onUploadFiles={(files) => {
                                                    return Promise.all(
                                                        files.map(async (file) => {
                                                            const data = await ArticlesService.uploadArticleImage(file);
                                                            return {
                                                                src: data.url, // 👈 returned image URL
                                                                alt: file.name,
                                                            };
                                                        })
                                                    );
                                                }}
                                            />

                                            <MenuButtonHorizontalRule />
                                            <MenuButtonAddTable />{/* Add the custom cell color button here */}
                                            {rteRef.current?.editor && (
                                                <CellBackgroundColorButton editor={rteRef.current.editor} />
                                            )}
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
                                        onClick={handleSaveArticle}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Article"}
                                    </Button></div>
                            </div>
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default EmailViewPage;
