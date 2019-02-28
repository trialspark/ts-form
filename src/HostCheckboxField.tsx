import React, { Component } from 'react';
import getterToString from '@trialspark/getter-to-string';
import { DeepRequired } from 'utility-types';
import { TSFormConfig, BaseHostFieldProvides } from './Types';
import FormState from './FormState';

export interface TSHostCheckboxFieldProvides {
  input: BaseHostFieldProvides['input'] & {
    props: {
      checked: boolean;
    };
  };
}

export interface TSHostCheckboxFieldProps<FormData extends object> {
  value: (data: DeepRequired<FormData>) => boolean;
  children: (provides: TSHostCheckboxFieldProvides) => ReturnType<Component['render']>;
}

interface State {
  checked: boolean;
}

export default function createHostCheckboxField<FormData extends object>(
  options: TSFormConfig<FormData>,
  state: FormState<FormData>,
): new (props: TSHostCheckboxFieldProps<FormData>) => React.Component<
  TSHostCheckboxFieldProps<FormData>
> {
  class HostField extends Component<TSHostCheckboxFieldProps<FormData>, State> {
    private unsubscribe: ReturnType<FormState<FormData>['observe']> | null = null;

    public constructor(props: Readonly<TSHostCheckboxFieldProps<FormData>>) {
      super(props);
      const { value } = this.props;

      this.state = {
        checked: value(state.values()),
      };
    }

    public state: State;

    public componentDidMount() {
      const { value } = this.props;

      this.unsubscribe = state.observe(value, newValue =>
        this.setState({
          checked: newValue,
        }),
      );
    }

    public componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    private handleChange: NonNullable<
      React.InputHTMLAttributes<HTMLInputElement>['onChange']
    > = event => {
      const { value } = this.props;

      state.set(value, event.target.checked);
    };

    public render(): ReturnType<Component['render']> {
      const { children, value } = this.props;
      const { checked } = this.state;
      const name = getterToString(options.initialValues)(value);

      return children({
        input: {
          props: { name, checked, onChange: this.handleChange },
        },
      });
    }
  }

  return HostField;
}
