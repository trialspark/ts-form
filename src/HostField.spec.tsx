import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { create } from '.';

interface FormValues {
  name: string;
  isWorking: boolean;
}

const Form = create<FormValues>({
  initialValues: {
    name: '',
    isWorking: false,
  },
});

describe('<HostField />', () => {
  let component: ReactWrapper<React.ComponentProps<typeof Form>>;

  const field = (name: string) => component.find(`input[name="${name}"]`);
  const elementWithValue = (type: 'input' | 'textarea', value: string) => {
    const element = document.createElement(type);
    element.value = value;
    return element;
  };

  beforeEach(() => {
    component = mount(
      <Form>
        {({ form, HostField }) => (
          <form {...form.props}>
            <HostField value={data => data.name}>
              {({ input }) => <input {...input.props} />}
            </HostField>
          </form>
        )}
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
});
