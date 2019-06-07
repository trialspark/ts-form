/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import React from 'react';
import { Omit } from 'utility-types';
import { create } from '../../dist';

interface FormData {
  company: string;
}

const Form = create<FormData>({
  initialValues: {
    company: '',
  },
});

const GoodForm: React.FunctionComponent<
  Omit<React.ComponentProps<typeof Form>, 'children'>
> = props => {
  return (
    <Form {...props}>
      {({ form, HostField }) => (
        <form {...form.props}>
          <h3>I am better!</h3>
          <label htmlFor="company">
            Where do you work?
            <br />
            <HostField value={f => f.company}>
              {({ input }) => <input id="company" {...input.props} />}
            </HostField>
          </label>
          <br />
          <button type="submit">Yell It At Me!</button>
        </form>
      )}
    </Form>
  );
};

export default GoodForm;
