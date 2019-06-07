import React, { Component } from 'react';
import getterToString from '@trialspark/getter-to-string';
import { DeepRequired } from 'utility-types';
import { BaseHostFieldProvides } from './Types';
import FormState from './FormState';

export interface TSHostCheckboxFieldProvides<Value> {
  input: BaseHostFieldProvides['input'] & {
    props: {
      checked: Value;
    };
  };
}

export interface TSHostCheckboxFieldProps<FormData extends object, Value> {
  value: (data: DeepRequired<FormData>) => Value;
  children: <V extends Value>(
    provides: TSHostCheckboxFieldProvides<V>,
  ) => ReturnType<Component['render']>;
  parse?: (value: boolean) => Value;
}

interface State<Value> {
  value: Value;
}

export default function createHostCheckboxField<FormData extends object>(
  state: FormState<FormData>,
): new <Value>(props: TSHostCheckboxFieldProps<FormData, Value>) => React.Component<
  TSHostCheckboxFieldProps<FormData, Value>
> {
  class HostField<Value> extends Component<
    TSHostCheckboxFieldProps<FormData, Value>,
    State<Value>
  > {
    private unsubscribe: ReturnType<FormState<FormData>['observe']> | null = null;

    public constructor(props: Readonly<TSHostCheckboxFieldProps<FormData, Value>>) {
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
      const { value, parse = (v: boolean): boolean => v } = this.props;

      state.set(value, parse(event.target.checked));
    };

    public render(): ReturnType<Component['render']> {
      const { children, value } = this.props;
      const { value: checked } = this.state;
      const name = getterToString(state.values())(value);

      return children({
        input: {
          props: { name, checked, onChange: this.handleChange },
        },
      });
    }
  }

  return HostField;
}
