import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { create } from '.';

interface FormValues {
  isWorking: boolean;
}

const Form = create<FormValues>({
  initialValues: {
    isWorking: false,
  },
});

describe('<HostField />', () => {
  let component: ReactWrapper<React.ComponentProps<typeof Form>>;

  const field = (name: string) => component.find(`input[name="${name}"]`);
  const checkboxWithState = (state: boolean) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state;
    return checkbox;
  };

  beforeEach(() => {
    component = mount(
      <Form>
        {({ form, HostCheckboxField }) => (
          <form {...form.props}>
            <HostCheckboxField value={data => data.isWorking}>
              {({ input }) => <input {...input.props} />}
            </HostCheckboxField>
          </form>
        )}
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
});
