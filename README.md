# Form helper example (similar to formik)

How to use:

```tsx
// App.tsx
import React from "react";
import { createStateHandler } from "./state-handler";

const [StateContext, useState, withState] = createStateHandler<{
  firstName: string;
  lastName: string;
  range: {
    start: number;
    end: number;
  };
}>();

const TextField = withState("input");

function Form() {
  return (
    <>
      <TextField statePath="firstName" />
      <TextField statePath="lastName" />
      <TextField statePath="range.start" />
      <TextField statePath="range.end" />
    </>
  );
}

function App() {
  const [state, onChange] = useState({
    firstName: "",
    lastName: "",
    range: {
      start: 0,
      end: 0,
    },
  });

  return (
    <>
      <StateContext.Provider value={{ state, onChange }}>
        <Form />
      </StateContext.Provider>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}

export default App;

```
