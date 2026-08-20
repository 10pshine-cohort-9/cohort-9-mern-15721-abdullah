import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App successfully', () => {
  render(<App />);
  const heading = screen.getByText(/Notes App Frontend/i);
  expect(heading).toBeInTheDocument();
});
