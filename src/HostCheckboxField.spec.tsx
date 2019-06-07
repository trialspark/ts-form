import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { create } from '.';
import FormState from './FormState';

interface FormValues {
  isWorking: boolean;
  status: string;
}

const Form = create<FormValues>({
  initialValues: {
    isWorking: false,
    status: '',
  },
});

describe('<HostField />', () => {
  let component: ReactWrapper<React.ComponentProps<typeof Form>>;
  let state: FormState<FormValues>;

  const field = (name: string) => component.find(`input[name="${name}"]`);
  const checkboxWithState = (checked: boolean) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    return checkbox;
  };

  beforeEach(() => {
    component = mount(
      <Form>
        {({ form, HostCheckboxField }) => {
          ({ state } = form);
          return (
            <form {...form.props}>
              <HostCheckboxField value={data => data.isWorking}>
                {({ input }) => <input {...input.props} />}
              </HostCheckboxField>
              <HostCheckboxField
                value={data => data.status}
                parse={value => (value ? 'checked' : '')}
              >
                {({ input }) => (
                  <input {...input.props} checked={input.props.checked === 'checked'} />
                )}
              </HostCheckboxField>
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
    expect(field('isWorking').exists()).toBe(true);
    expect(field('isWorking').prop('checked')).toBe(false);

    field('isWorking').simulate('change', { target: checkboxWithState(true) });
    expect(field('isWorking').prop('checked')).toBe(true);

    field('isWorking').simulate('change', { target: checkboxWithState(false) });
    expect(field('isWorking').prop('checked')).toBe(false);
  });

  it('supports parsing', () => {
    expect(field('status').prop('checked')).toBe(false);
    expect(state.values().status).toBe('');

    field('status').simulate('change', { target: checkboxWithState(true) });
    expect(field('status').prop('checked')).toBe(true);
    expect(state.values().status).toBe('checked');

    field('status').simulate('change', { target: checkboxWithState(false) });
    expect(field('status').prop('checked')).toBe(false);
    expect(state.values().status).toBe('');
  });
});
