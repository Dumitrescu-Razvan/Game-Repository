import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { getGame } from '../Service/Service';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = React.useState(null);

  React.useEffect(() => {
    getGame(id).then((game) => {
      setGame(game);
    });
  }, [id]);

  if (!game) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography sx={{ fontSize: 20, color: 'darkblue' }}>{game.name}</Typography>
      <Typography variant="body1">Game ID: {id}</Typography>
      <Typography variant="body1">Year: {game.release_year}</Typography>
      <Typography variant="body1">Rating: {game.rating}</Typography>
      <Typography variant="body1">Company ID: {game.company_id}</Typography>
    </Box>
  );
}

export default GameDetails;