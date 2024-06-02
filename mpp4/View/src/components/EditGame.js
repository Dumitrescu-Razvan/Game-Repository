import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editGame, getGame  } from "../Service/Service";
import { TextField, Button, Typography, Container } from "@mui/material";

function EditGame() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = React.useState("");
    const [year, setYear] = React.useState("");
    const [rating, setRating] = React.useState("");
    const [game, setGame] = React.useState(null);
    const [company_id, setCompany] = React.useState("1");

    React.useEffect(() => {
        getGame(id).then((game) => {
            setGame(game);
            setTitle(game.name);
            setYear(game.release_year);
            setRating(game.rating);
            setCompany(game.company_id);
        });
        }, [id]);

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
        if (title === "" || year === "" || rating === "") {
            alert("All fields are required");
            return;
        } else if (isNaN(year)) {
            alert("Year should be a number");
            return;
        }
        const newGame = {
            id: id,
            name: title,
            release_year: parseInt(year),
            rating: parseInt(rating),
            company_id: parseInt(company_id),
        };
        editGame(newGame);
        navigate("/games");
    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Typography variant="h2" sx={{ fontSize: 20, color: "darkblue" }}>
                Edit Game
            </Typography>
            <Typography variant="body1">Game ID: {id}</Typography>
            <TextField
                type="text"
                value={title}
                onChange={handleTitleChange}
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                type="text"
                value={year}
                onChange={handleYearChange}
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                type="text"
                value={rating}
                onChange={handleRatingChange}
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                type="text"
                value={company_id}
                onChange={handleCompanyChange}
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <Button onClick={handleSave} sx={{
                fontSize: 20,
                color: "darkblue",
                backgroundColor: "red",
                marginTop: "10px"
            }}>Save</Button>
        </Container>
    );
}

export default EditGame;
