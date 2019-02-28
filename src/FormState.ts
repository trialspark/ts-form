import getterToString, { ToString } from '@trialspark/getter-to-string';
import { DeepRequired } from 'utility-types';
import set from 'lodash/fp/set';
import { TSFormConfig } from './Types';

type Listener<Value> = (value: Value) => void;

class Observer<FormData extends object, Value> {
  private state: FormState<FormData>;

  private getValue: (data: DeepRequired<FormData>) => Value;

  private callback: Listener<Value>;

  private currentValue: Value;

  public constructor(
    state: FormState<FormData>,
    value: (data: DeepRequired<FormData>) => Value,
    callback: Listener<Value>,
  ) {
    this.state = state;
    this.getValue = value;
    this.callback = callback;
    this.currentValue = value(this.state.values());
  }

  public update() {
    const latestValue = this.getValue(this.state.values());

    if (this.currentValue !== latestValue) {
      this.currentValue = latestValue;
      this.callback(latestValue);
    }
  }
}

export default class FormState<FormData extends object> {
  private state: DeepRequired<FormData>;

  private valueToString: ToString<FormData>;

  private observers: Observer<FormData, any>[] = [];

  public constructor(config: TSFormConfig<FormData>) {
    this.state = config.initialValues;
    this.valueToString = getterToString(this.state);
  }

  public values() {
    return this.state;
  }

  public set<V>(value: (data: FormState<FormData>['state']) => V, newValue: V) {
    this.state = set(this.valueToString(value), newValue, this.state);
    this.observers.forEach(observer => observer.update());
  }

  public observe<V>(value: (data: FormState<FormData>['state']) => V, listener: Listener<V>) {
    const observer = new Observer(this, value, listener);

    this.observers = this.observers.concat([observer]);

    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }
}
