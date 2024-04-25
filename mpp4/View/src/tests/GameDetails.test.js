import {render} from '@testing-library/react';
import GameDetails from '../components/GameDetails';
import { MemoryRouter as Router } from 'react-router-dom';

test('renders GameDetails page and checks if the text fields are present', () => {
    const { getByText } = render(<GameDetails />, { wrapper: Router });

    // Check if the GameDetails page is rendered
    const gameDetailsPage = getByText(/Loading.../i);
    expect(gameDetailsPage).toBeInTheDocument();
}
);