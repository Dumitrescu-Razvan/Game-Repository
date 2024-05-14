import React, { useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addGame, getCompanies } from "../Service/Service";
import { useStyles } from "../styles/AddGameStyle";



function AddGame() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [title, setTitle] = React.useState("");
    const [year, setYear] = React.useState("");
    const [rating, setRating] = React.useState("");
    const [company_id, setCompany] = React.useState("1");
    const [companies, setCompanies] = React.useState([]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };
    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };
    const handleCompanyChange = (event) => {
        setCompany(event.target.value);
    }

    const handleSave = () => {
        console.log("Save clicked");
        if (title === "" || year === "" || rating === "") {
            alert("All fields are required");
            return;
        }
        else if (isNaN(year) || isNaN(rating) || isNaN(company_id))  {
            alert("Year and Rating must be numbers");
            return;
        }
        const newGame = {
            name: title,
            release_year: parseInt(year),
            rating: parseInt(rating),
            company_id: parseInt(company_id)
        };
        console.log(newGame);
        addGame(newGame);
        navigate("/");
    };

    useEffect(() => {
        getCompanies().then((companies) => {
            setCompanies(companies);
        })
        .catch((error) => {
            console.log(error);
        }
        );
    }, []);

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
            <select name="company" onChange={handleCompanyChange} className={classes.cell}>
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                ))}
            </select>

            <Button onClick={handleSave} className={classes.button}>Save</Button>
        </div>
    );
}
export default AddGame;