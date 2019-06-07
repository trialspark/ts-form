import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { create, TSFormProvides } from '.';

describe('ts-form', () => {
  const Form = create<FormData>({
    initialValues: {
      name: '',
      isWorking: false,
    },
  });

  interface FormData {
    name: string;
    isWorking: boolean;
  }

  describe('rendering', () => {
    let onSubmit: jest.Mock;
    let component: ReactWrapper<React.ComponentProps<typeof Form>>;
    let provides: TSFormProvides<FormData>;

    const field = (name: string) => component.find(`input[name="${name}"]`);
    const fill = (data: { [name: string]: any }) => {
      Object.entries(data).forEach(([name, value]) => {
        const input = field(name);

        if (!input.exists()) {
          throw new Error(`Could not find input with name: ${name}`);
        }

        const $input = document.createElement('input');

        switch (input.prop('type')) {
          case 'checkbox': {
            $input.setAttribute('type', 'checkbox');
            $input.checked = value;
            input.simulate('change', { target: $input });
            break;
          }
          default: {
            $input.value = value;
            input.simulate('change', { target: $input });
          }
        }
      });
    };

    beforeEach(() => {
      onSubmit = jest.fn();
      component = mount(
        <Form onSubmit={onSubmit}>
          {p => {
            const { form, HostField, HostCheckboxField } = p;
            provides = p;
            return (
              <form {...form.props}>
                <HostField value={data => data.name}>
                  {({ input }) => <input {...input.props} />}
                </HostField>
                <HostCheckboxField value={data => data.isWorking}>
                  {({ input }) => <input type="checkbox" {...input.props} />}
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

    it('handles submision', () => {
      fill({
        name: 'Josh',
        isWorking: true,
      });
      expect(onSubmit).not.toHaveBeenCalled();

      const event = new Event('submit', {});
      event.preventDefault = jest.fn();
      component.find('form').simulate('submit', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Josh',
        isWorking: true,
      });
    });

    it('maintains submitting state', async () => {
      let resolve: (value: any) => any;
      let reject: (value: any) => any;
      let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      onSubmit.mockReturnValue(promise);

      expect(provides.form.submitting).toBe(false);
      expect(provides.form.submitFailed).toBe(false);
      expect(provides.form.submitSucceeded).toBe(false);

      let event = new Event('submit', {});
      component.find('form').simulate('submit', event);
      expect(provides.form.submitting).toBe(true);
      expect(provides.form.submitFailed).toBe(false);
      expect(provides.form.submitSucceeded).toBe(false);
      resolve(null);
      await promise.then(() => {});
      expect(provides.form.submitting).toBe(false);
      expect(provides.form.submitFailed).toBe(false);
      expect(provides.form.submitSucceeded).toBe(true);

      promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      onSubmit.mockReturnValue(promise);

      event = new Event('submit', {});
      component.find('form').simulate('submit', event);
      expect(provides.form.submitting).toBe(true);
      expect(provides.form.submitFailed).toBe(false);
      expect(provides.form.submitSucceeded).toBe(false);
      reject(new Error('Bad!'));
      await promise.catch(() => {});
      expect(provides.form.submitting).toBe(false);
      expect(provides.form.submitFailed).toBe(true);
      expect(provides.form.submitSucceeded).toBe(false);
    });

    it('provides the form state', () => {
      fill({
        name: 'Josh',
        isWorking: true,
      });
      expect(provides.form.state.values()).toEqual({
        name: 'Josh',
        isWorking: true,
      });
    });
  });
});
