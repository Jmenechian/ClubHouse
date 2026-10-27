# React + TypeScript quick guide

A small reference for building your first screen. You can keep the examples in `src/App.tsx` and adapt them. React uses **JSX**: HTML-like markup written inside TypeScript.

## The basic shape of a component

```tsx
function App() {
  return (
    <main>
      <h1>Club House FC</h1>
      <p>Welcome to the team.</p>
    </main>
  );
}

export default App;
```

The function returns what React should show. JSX must have one outer element (such as `<main>` or a fragment `<>...</>`). Close every tag, including tags like `<img />`.

## Common elements

```tsx
<div>A general-purpose box</div>
<h2>A heading</h2>
<p>A paragraph</p>
<button>Click me</button>
<input placeholder="Player name" />
```

Use `className` instead of HTML's `class` when you want to add a CSS class:

```tsx
<div className="player-card">Alex Morgan</div>
```

## Show a value with braces

Use `{}` to put a TypeScript/JavaScript value inside JSX:

```tsx
const playerName = "Alex Morgan";

return <p>Player: {playerName}</p>;
```

You can also put simple expressions inside braces: `<p>{2 + 2}</p>`.

## Make a button do something

Pass a function to `onClick`. Don't call it while rendering; write `onClick={handleClick}`, not `onClick={handleClick()}`.

```tsx
function App() {
  function handleClick() {
    console.log("Button clicked");
  }

  return <button onClick={handleClick}>Say hello</button>;
}
```

For a very short action, an inline function is fine:

```tsx
<button onClick={() => console.log("Clicked")}>Click</button>
```

## Update the screen with state

Normal variables don't make React redraw the screen when they change. Use `useState` for values that change while the app is running:

```tsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
    </div>
  );
}
```

`count` is the current value; `setCount` asks React to update it and redraw the screen. The `0` is its starting value.

## Display a list

Use `.map()` to turn an array into elements. Each item needs a stable `key` so React can track it.

```tsx
const players = ["Alex", "Sam", "Jordan"];

return (
  <ul>
    {players.map((player) => (
      <li key={player}>{player}</li>
    ))}
  </ul>
);
```

For a list of objects, use a unique ID as the key:

```tsx
type Player = { id: number; name: string; position: string };

const players: Player[] = [
  { id: 1, name: "Alex", position: "Forward" },
  { id: 2, name: "Sam", position: "Goalkeeper" },
];

return (
  <ul>
    {players.map((player) => (
      <li key={player.id}>{player.name} — {player.position}</li>
    ))}
  </ul>
);
```

## Show something conditionally

Use a condition with `&&` when you want to show an element only when a condition is true:

```tsx
{players.length === 0 && <p>No players yet.</p>}
```

Use `? :` to choose between two things:

```tsx
<p>{isLoggedIn ? "Welcome back" : "Please sign in"}</p>
```

## TypeScript essentials

- `const name = "Alex"` lets TypeScript infer that `name` is text (`string`).
- Common types: `string` (text), `number`, `boolean` (`true`/`false`), and `Player[]` (a list of players).
- A `type` describes an object's shape, as in `type Player = { id: number; name: string }`.
- Let TypeScript infer simple values; add explicit types when defining reusable object shapes or function inputs.
- JSX lives in `.tsx` files. Plain TypeScript without JSX uses `.ts`.

## A few JSX differences from HTML

- `class` becomes `className`.
- `onclick` becomes `onClick` and takes a function.
- Use `{}` for JavaScript values and expressions.
- Use `htmlFor` instead of `for` on a `<label>`.
- A tag with no content must close itself: `<input />`.

## Where to begin

Edit `src/App.tsx` for the screen. The starter imports CSS files there; you can leave those imports in place and ignore styling while you work on structure and behavior. Save the file while `npm run dev` is running to see updates in the browser.
