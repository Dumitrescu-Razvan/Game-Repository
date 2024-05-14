import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { useStyles } from '../styles/GameDetailsStyle';
import { getGame } from '../Service/Service';

function GameDetails() {
    const classes = useStyles();
    const { id } = useParams();
    const [game, setGame] = React.useState(null);
  
    React.useEffect(() => {
      getGame(id).then((game) => {
        setGame(game);
      });
    } , [id]);
  
    if (!game) {
      return <Box>Loading...</Box>;
    }
  
    return (
      <Box className={classes.gameDetails}>
        <Typography className={classes.gameDetailsTitle} style={{ fontWeight: 'bold'  , fontSize: '60px' }}>{game.name}</Typography>
        <Typography variant="body1">Game ID: {id}</Typography>
        <Typography variant="body1">Year: {game.release_year}</Typography>
        <Typography variant="body1">Rating: {game.rating}</Typography>
        <Typography variant="body1">Company ID: {game.company_id}</Typography>
      </Box>
    );
  }
  
  export default GameDetails;