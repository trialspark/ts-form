import React, { Component } from 'react';
import getterToString from '@trialspark/getter-to-string';
import { DeepRequired } from 'utility-types';
import { BaseHostFieldProvides } from './Types';
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
  parse?: (value: string) => Value;
  children: <V extends Value>(provides: TSHostFieldProvides<V>) => ReturnType<Component['render']>;
}

interface State<Value> {
  value: Value;
}

export default function createHostField<FormData extends object>(
  state: FormState<FormData>,
): new <Value>(props: TSHostFieldProps<FormData, Value>) => React.Component<
  TSHostFieldProps<FormData, Value>
> {
  const defaultParse: NonNullable<TSHostFieldProps<FormData, any>['parse']> = val => val;

  return class HostField<Value> extends Component<TSHostFieldProps<FormData, Value>, State<Value>> {
    private unsubscribe: ReturnType<FormState<FormData>['observe']> | null = null;

    public constructor(props: Readonly<TSHostFieldProps<FormData, Value>>) {
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
      const { value, parse = defaultParse } = this.props;

      state.set(value, parse(event.target.value));
    };

    public render(): ReturnType<Component['render']> {
      const { children, value } = this.props;
      const { value: inputValue } = this.state;
      const name = getterToString(state.values())(value);

      return children({
        input: {
          props: { name, value: inputValue, onChange: this.handleChange },
        },
      });
    }
  };
}
