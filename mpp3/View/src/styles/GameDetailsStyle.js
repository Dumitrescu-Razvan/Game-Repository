import { makeStyles } from "@mui/styles";


export const useStyles = makeStyles({
    gameDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: '20px'
    },

    gameDetailsTitle: {
        color: 'red',
        fontSize: 100,
    },
});