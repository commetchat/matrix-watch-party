/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Route, Router } from "@solidjs/router";
import 'solid-devtools';

import App from './App';
import DevMode from './DevMode';
import MatrixRTCApp from './MatrixRTC';
import MockRTCApp from './MockRTC';
const root = document.getElementById('root');

import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const theme = themeFromSourceColor(argbFromHex('#f82506'), [
  {
    name: "custom-1",
    value: argbFromHex("#ff0000"),
    blend: true,
  },
]);

// Print out the theme as JSON
console.log(JSON.stringify(theme, null, 2));

// Check if the user has dark mode turned on
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply the theme to the body by updating custom properties for material tokens
applyTheme(theme, {target: document.body, dark: true});

render(() => <Router>
  <Route path="/" component={MatrixRTCApp} />
  <Route path="/dev" component={DevMode}/>
  <Route path="/mock" component={MockRTCApp}/>
</Router>, root);
