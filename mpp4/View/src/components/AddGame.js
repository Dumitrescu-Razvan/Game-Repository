import React, { useEffect } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addGame, getCompanies } from "../Service/Service";



function AddGame() {
    const navigate = useNavigate();
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
        if (title === "" || year === "" || rating === "") {
            alert("All fields are required");
            return;
        }
        else if (isNaN(year) || isNaN(rating) || isNaN(company_id)) {
            alert("Year and Rating must be numbers");
            return;
        }
        const newGame = {
            name: title,
            release_year: parseInt(year),
            rating: parseInt(rating),
            company_id: parseInt(company_id)
        };
        addGame(newGame);
        navigate("/games");
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
        <Container
        sx = {{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
            gap: "20px"
        }}
        >
            <Typography variant="h2" sx={{ fontSize: 50, color: "darkblue" }}>
                Add Game
            </Typography>
            <TextField label="Title" value={title} onChange={handleTitleChange} variant="outlined" sx={{fontSize: 20, color: "darkblue"}}/>
            <TextField label="Year" value={year} onChange={handleYearChange} variant="outlined" sx={{fontSize: 20, color: "darkblue"}}/>

            <TextField label="Rating" value={rating} onChange={handleRatingChange} variant="outlined" sx={{fontSize: 20, color: "darkblue"}}/>
            <select name="company" onChange={handleCompanyChange} sx={{fontSize: 20, color: "darkblue"}}>
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                ))}
            </select>

            <Button onClick={handleSave} sx={{fontSize: 20, color: "green"}}>Save</Button>
            <Button onClick={() => navigate("/games")} sx={{fontSize: 20, color: "red"}}>Cancel</Button>
        </Container>
    );
}
export default AddGame;