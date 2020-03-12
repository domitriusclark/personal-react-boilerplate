import React from 'react';

import render, { defineIntersectionObserver } from '../../../utils/testUtils';
import RegistrationSuccess from './RegistrationSuccess';

defineIntersectionObserver();

const mail = 'some@mail.com';

describe('<RegistrationSuccess />', () => {
  it('renders without crashing', () => {
    render(<RegistrationSuccess mail={mail} />);
  });

  it('should hint the passed mail', () => {
    const { getByTestId } = render(<RegistrationSuccess mail={mail} />);

    expect(getByTestId('registration-success-mail-hint').textContent).toBe(
      mail,
    );
  });
});