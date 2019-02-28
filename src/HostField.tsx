import React, { Component } from 'react';
import getterToString from '@trialspark/getter-to-string';
import { DeepRequired } from 'utility-types';
import { TSFormConfig, BaseHostFieldProvides } from './Types';
import FormState from './FormState';

export interface TSHostFieldProvides<Value> {
  input: BaseHostFieldProvides['input'] & {
    props: {
      value: Value;
    };
  };
}

export interface TSHostFieldProps<FormData extends object, Value> {
  value: (data: DeepRequired<FormData>) => Value;
  children: <V extends Value>(provides: TSHostFieldProvides<V>) => ReturnType<Component['render']>;
}

interface State<Value> {
  value: Value;
}

export default function createHostField<FormData extends object>(
  options: TSFormConfig<FormData>,
  state: FormState<FormData>,
): new (props: TSHostFieldProps<FormData, any>) => React.Component<
  TSHostFieldProps<FormData, any>
> {
  return class HostField<Value> extends Component<TSHostFieldProps<FormData, any>, State<Value>> {
    private unsubscribe: ReturnType<FormState<FormData>['observe']> | null = null;

    public constructor(props: Readonly<TSHostFieldProps<FormData, any>>) {
      super(props);
      const { value } = this.props;

      this.state = {
        value: value(state.values()),
      };
    }

    public state: State<Value>;

    public componentDidMount() {
      const { value } = this.props;

      this.unsubscribe = state.observe(value, newValue =>
        this.setState({
          value: newValue,
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

      state.set(value, (event.target.value as unknown) as Value);
    };

    public render(): ReturnType<Component['render']> {
      const { children, value } = this.props;
      const { value: inputValue } = this.state;
      const name = getterToString(options.initialValues)(value);

      return children({
        input: {
          props: { name, value: inputValue, onChange: this.handleChange },
        },
      });
    }
  };
}
