import { screen } from '@testing-library/react';

describe('<App/>', () => {
    it('should exist children', () => {
        expect(screen.getByText('Lorem')).toBeInTheDocument();
    });
});
