import FormState from './FormState';

interface FormData {
  name: string;
  age: number;
  friends: {
    name: string;
    hobbies: string[];
  }[];
}

describe('<FormState />', () => {
  let state: FormState<FormData>;

  const initialValues: FormData = {
    name: 'Josh',
    age: 27,
    friends: [
      { name: 'April', hobbies: ['writing', 'running'] },
      { name: 'Alice', hobbies: ['concerts', 'podcasting'] },
      { name: 'Connor', hobbies: ['trombone', 'crossfit'] },
    ],
  };

  beforeEach(() => {
    state = new FormState<FormData>({
      initialValues,
    });
  });

  it('exists', () => {
    expect(state).toEqual(expect.any(FormState));
  });

  it('can get the values', () => {
    expect(state.values()).toBe(initialValues);
  });

  it('can update the state', () => {
    state.set(data => data.age, 28);

    expect(state.values()).not.toBe(initialValues);
    expect(state.values()).toEqual({
      ...initialValues,
      age: 28,
    });
  });

  it('can update the state deeply', () => {
    state.set(data => data.friends[1].hobbies[0], 'live music');

    expect(state.values()).not.toBe(initialValues);
    expect(initialValues.friends[1].hobbies[0]).toBe('concerts');

    expect(state.values().friends).not.toBe(initialValues.friends);

    expect(state.values().friends[0]).toBe(initialValues.friends[0]);
    expect(state.values().friends[1]).not.toBe(initialValues.friends[1]);
    expect(state.values().friends[2]).toBe(initialValues.friends[2]);

    expect(state.values()).toEqual({
      ...initialValues,
      friends: [
        ...initialValues.friends.slice(0, 1),
        {
          ...initialValues.friends[1],
          hobbies: ['live music', ...initialValues.friends[1].hobbies.slice(1)],
        },
        ...initialValues.friends.slice(2),
      ],
    });
  });

  it('can watch a single value for changes', () => {
    const watcher = jest.fn();
    const unsubscribe = state.observe(data => data.friends[0].name, watcher);

    state.set(data => data.friends[1].name, 'Allie');
    state.set(data => data.name, 'Josh M');
    expect(watcher).not.toHaveBeenCalled();

    state.set(data => data.friends[0].name, 'April C');
    state.set(data => data.friends[0].name, 'April C');
    expect(watcher).toHaveBeenCalledTimes(1);
    expect(watcher).toHaveBeenCalledWith('April C');
    watcher.mockClear();

    unsubscribe();
    state.set(data => data.friends[0].name, 'April');
    expect(watcher).not.toHaveBeenCalled();
  });
});
