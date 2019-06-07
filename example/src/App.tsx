import React from 'react';
import BadForm from './BadForm';
import GoodForm from './GoodForm';

const App: React.FunctionComponent = () => {
  return (
    <main>
      <h1>It&apos;s Hack Day!</h1>
      <BadForm onSubmit={values => alert(`You work at: ${values.company}`)} />
      <GoodForm onSubmit={values => alert(`You work at: ${values.company}`)} />
    </main>
  );
};

export default App;
