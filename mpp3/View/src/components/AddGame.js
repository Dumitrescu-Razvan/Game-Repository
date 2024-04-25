import React from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addGame } from "../Service/Service";
import { useStyles } from "../styles/AddGameStyle";



function AddGame() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [title, setTitle] = React.useState("");
    const [year, setYear] = React.useState("");
    const [rating, setRating] = React.useState("");

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };
    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSave = () => {
        console.log("Save clicked");
        if (title === "" || year === "" || rating === "") {
            alert("All fields are required");
            return;
        }
        else if (isNaN(year)) {
            alert("Year should be a number");
            return;
        }
        const newGame = {
            id: 0,
            title: title,
            year: parseInt(year),
            rating: parseFloat(rating),
        };
        console.log(newGame);
        addGame(newGame);
        navigate("/");
    };

    return (
        <div className={classes.root}>
            <h2 className={classes.titleCell}>Add Game</h2>
            <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                className={classes.cell}
            />
            <TextField
                label="Year"
                value={year}
                onChange={handleYearChange}
                variant="outlined"
                className={classes.cell}
            />
            <TextField
                label="Rating"
                value={rating}
                onChange={handleRatingChange}
                variant="outlined"
                className={classes.cell}
            />
            <Button onClick={handleSave} className={classes.button}>Save</Button>
        </div>
    );
}
export default AddGame;