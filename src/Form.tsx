import { Component } from 'react';
import { DeepRequired } from 'utility-types';
import { TSFormConfig } from './Types';
import createHostField, { TSHostFieldProps } from './HostField';
import FormState from './FormState';
import createHostCheckboxField, { TSHostCheckboxFieldProps } from './HostCheckboxField';

export const foo = 'ba ';

export interface TSFormProvides<FormData extends object> {
  form: {
    props: {
      onSubmit: NonNullable<React.FormHTMLAttributes<HTMLFormElement>['onSubmit']>;
    };
  };
  HostField: new <V>(props: TSHostFieldProps<FormData, V>) => React.Component<
    TSHostFieldProps<FormData, V>
  >;
  HostCheckboxField: new (props: TSHostCheckboxFieldProps<FormData>) => React.Component<
    TSHostCheckboxFieldProps<FormData>
  >;
}

export interface TSFormProps<FormData extends object> {
  onSubmit?: (data: DeepRequired<FormData>) => void;
  children: (provides: TSFormProvides<FormData>) => ReturnType<Component['render']>;
}

export function createForm<FormData extends object>(
  options: TSFormConfig<FormData>,
): new (props: TSFormProps<FormData>) => React.Component<TSFormProps<FormData>> {
  class Form extends Component<TSFormProps<FormData>> {
    private formState = new FormState(options);

    private HostField = createHostField(options, this.formState);

    private HostCheckboxField = createHostCheckboxField(options, this.formState);

    private handleSubmit: NonNullable<
      React.FormHTMLAttributes<HTMLFormElement>['onSubmit']
    > = event => {
      const { onSubmit } = this.props;

      event.preventDefault();

      if (onSubmit) {
        onSubmit(this.formState.values());
      }
    };

    public render(): ReturnType<Component['render']> {
      const { children } = this.props;

      return children({
        HostField: this.HostField,
        HostCheckboxField: this.HostCheckboxField,
        form: {
          props: {
            onSubmit: this.handleSubmit,
          },
        },
      });
    }
  }

  return Form;
}
