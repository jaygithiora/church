import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormGroup,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
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
import { EditorContent, useEditor } from '@tiptap/react';
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

// Add this component before ArticleViewPage
function CellBackgroundColorButton({ editor }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [color, setColor] = useState('#ffffff');

    const isInTableCell = () => {
        if (!editor) return false;
        const { $from } = editor.state.selection;

        for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'tableCell' || $from.node(d).type.name === 'tableHeader') {
                return true;
            }
        }
        return false;
    };

    const handleClick = (event) => {
        if (!isInTableCell()) {
            alert('Please click inside a table cell first');
            return;
        }
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        // Restore focus to editor after closing
        if (editor) {
            editor.commands.focus();
        }
    };

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
        if (editor && isInTableCell()) {
            const { $from } = editor.state.selection;

            for (let d = $from.depth; d > 0; d--) {
                const node = $from.node(d);
                if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                    editor
                        .chain()
                        .focus()
                        .command(({ tr }) => {
                            const pos = $from.before(d);
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                backgroundColor: newColor.hex,
                            });
                            return true;
                        })
                        .run();
                    break;
                }
            }
        }
        handleClose(); // Close after selecting color
    };

    const open = Boolean(anchorEl);
    const disabled = !editor || !isInTableCell();

    return (
        <>
            <Button
                size="small"
                onClick={handleClick}
                disabled={disabled}
                startIcon={<FormatColorFill />}
                sx={{ minWidth: 'auto', textTransform: 'none' }}
            >
                Cell BG
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                disableEnforceFocus // Add this
                disableAutoFocus // Add this
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                slotProps={{
                    root: {
                        // Prevent hiding the root element
                        'aria-hidden': undefined,
                    }
                }}
            >
                <SketchPicker
                    color={color}
                    onChange={handleColorChange}
                    disableAlpha // Optional: disable alpha channel
                />
            </Popover>
        </>
    );
}

// Create custom TableCell with backgroundColor support
const TableCellWithBackground = TTTableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => {
                    return element.style.backgroundColor || null;
                },
                renderHTML: attributes => {
                    if (!attributes.backgroundColor) {
                        return {};
                    }
                    return {
                        style: `background-color: ${attributes.backgroundColor}`,
                    };
                },
            },
        };
    },
});

function ArticleViewPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const { setLoading } = useAuth();
    const { id } = useParams();

    const editor = useEditor({
        editable: false,
        extensions: [StarterKit, Image],
        content: '' // start empty or some placeholder
    });

    const [title, setTitle] = useState("");

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
                                {title}
                            </h5>} />
                        <Divider />
                        <CardContent>
                            <EditorContent editor={editor} />
                        </CardContent>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
}

export default ArticleViewPage;
