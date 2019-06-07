/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import React from 'react';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';

interface FormData {
  company: string;
}

const BadForm: React.FunctionComponent<InjectedFormProps<FormData>> = props => {
  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <h3>I am not a great form!</h3>
      <label htmlFor="company">
        Where do you work?
        <br />
        <Field name="company" component="input" />
      </label>
      <br />
      <button type="submit">Yell It At Me!</button>
    </form>
  );
};

export default reduxForm<FormData>({ form: 'BadForm' })(BadForm);
