import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany, editCompany  } from "../Service/Service";
import { useStyles } from "../styles/EditGameStyle";
import { TextField, Button, Typography } from "@mui/material";

function EditCompany() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = React.useState("");
    const [location, setLocation] = React.useState("");


    React.useEffect(() => {
        getCompany(id).then((company) => {
            setName(company.name);
            setLocation(company.location);
        });
    }, [id]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    }


    const handleSave = () => {
        console.log("Save clicked");
        if (name === "" || location === "") {
            alert("All fields are required");
            return;
        }
        const newCompany = {
            id: id,
            name: name,
            location: location,
        };
        editCompany(newCompany);
        navigate("/companies");
    };

    return (
        <div className={classes.root}>
            <Typography variant="h2" className={classes.titleCell}>
                Edit Game
            </Typography>
            <Typography variant="body1">Game ID: {id}</Typography>
            <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                className={classes.cell}
            />
            <TextField
                label="Location"
                value={location}
                onChange={handleLocationChange}
                variant="outlined"
                className={classes.cell}
            />

            <Button onClick={handleSave} className={classes.button} variant="contained" color="primary">Save</Button>
        </div>
    );
}

export default EditCompany;
