import {render,fireEvent} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders App and checks Add button click', () => {
    const { getByText } = render(<Router><App /></Router>);
    
    // Check if the button text is present
    const buttonElement = getByText(/Add Game/i);
    expect(buttonElement).toBeInTheDocument();
  
    // Simulate a button click and check if the function runs
    fireEvent.click(buttonElement);
}
);
