import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { create } from '.';
import FormState from './FormState';

interface FormValues {
  name: string;
  isWorking: boolean;
  age: number | null;
}

const Form = create<FormValues>({
  initialValues: {
    name: '',
    isWorking: false,
    age: null,
  },
});

describe('<HostField />', () => {
  let component: ReactWrapper<React.ComponentProps<typeof Form>>;
  let state: FormState<FormValues>;

  const field = (name: string) => component.find(`input[name="${name}"]`);
  const elementWithValue = (type: 'input' | 'textarea', value: string) => {
    const element = document.createElement(type);
    element.value = value;
    return element;
  };

  beforeEach(() => {
    component = mount(
      <Form>
        {({ form, HostField }) => {
          ({ state } = form);
          return (
            <form {...form.props}>
              <HostField value={data => data.name}>
                {({ input }) => <input {...input.props} />}
              </HostField>
              <HostField
                value={data => data.age}
                parse={value => (!value ? null : parseInt(value, 10))}
              >
                {({ input }) => (
                  <input
                    {...input.props}
                    value={input.props.value == null ? '' : String(input.props.value)}
                  />
                )}
              </HostField>
            </form>
          );
        }}
      </Form>,
    );
  });

  it('exists', () => {
    expect(component.exists()).toBe(true);
  });

  it('renders the input', () => {
    expect(field('name').exists()).toBe(true);
    expect(field('name').prop('value')).toBe('');

    field('name').simulate('change', { target: elementWithValue('input', 'a') });
    expect(field('name').prop('value')).toBe('a');
  });

  it('can parse', () => {
    expect(field('age').prop('value')).toBe('');
    expect(state.values().age).toBeNull();

    field('age').simulate('change', { target: elementWithValue('input', '1') });
    expect(state.values().age).toBe(1);

    field('age').simulate('change', { target: elementWithValue('input', '1612') });
    expect(state.values().age).toBe(1612);

    field('age').simulate('change', { target: elementWithValue('input', '') });
    expect(state.values().age).toBeNull();
  });
});
