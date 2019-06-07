import { Component } from 'react';
import { DeepRequired } from 'utility-types';
import { TSFormConfig } from './Types';
import createHostField, { TSHostFieldProps } from './HostField';
import FormState from './FormState';
import createHostCheckboxField, { TSHostCheckboxFieldProps } from './HostCheckboxField';

export interface TSFormProvides<FormData extends object> {
  form: {
    props: {
      onSubmit: NonNullable<React.FormHTMLAttributes<HTMLFormElement>['onSubmit']>;
    };
    submitting: boolean;
    submitFailed: boolean;
    submitSucceeded: boolean;
    state: FormState<FormData>;
  };
  HostField: new <Value>(props: TSHostFieldProps<FormData, Value>) => React.Component<
    TSHostFieldProps<FormData, Value>
  >;
  HostCheckboxField: new <Value>(
    props: TSHostCheckboxFieldProps<FormData, Value>,
  ) => React.Component<TSHostCheckboxFieldProps<FormData, Value>>;
}

export interface TSFormProps<FormData extends object> {
  onSubmit?: (data: DeepRequired<FormData>) => void;
  children: (provides: TSFormProvides<FormData>) => ReturnType<Component['render']>;
}

interface State {
  submitting: boolean;
  submitFailed: boolean;
  submitSucceeded: boolean;
}

export function createForm<FormData extends object>(
  options: TSFormConfig<FormData>,
): new (props: TSFormProps<FormData>) => React.Component<TSFormProps<FormData>> {
  class Form extends Component<TSFormProps<FormData>, State> {
    public state: State = {
      submitting: false,
      submitFailed: false,
      submitSucceeded: false,
    };

    private formState = new FormState(options);

    private HostField = createHostField(this.formState);

    private HostCheckboxField = createHostCheckboxField(this.formState);

    private handleSubmit: NonNullable<
      React.FormHTMLAttributes<HTMLFormElement>['onSubmit']
    > = async event => {
      const { onSubmit } = this.props;

      event.preventDefault();
      this.setState({ submitting: true, submitFailed: false, submitSucceeded: false });

      try {
        if (onSubmit) {
          await onSubmit(this.formState.values());
        }
        this.setState({ submitSucceeded: true });
      } catch (e) {
        this.setState({ submitFailed: true });
      } finally {
        this.setState({ submitting: false });
      }
    };

    public render(): ReturnType<Component['render']> {
      const { children } = this.props;
      const { submitting, submitFailed, submitSucceeded } = this.state;

      return children({
        HostField: this.HostField,
        HostCheckboxField: this.HostCheckboxField,
        form: {
          props: {
            onSubmit: this.handleSubmit,
          },
          submitting,
          submitFailed,
          submitSucceeded,
          state: this.formState,
        },
      });
    }
  }

  return Form;
}
