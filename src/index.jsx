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

import { argbFromHex, themeFromSourceColor, applyTheme, Scheme } from "@material/material-color-utilities";

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}



try {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams);

  var scheme = urlParams.get("chat.commet.color_scheme");
  console.log(scheme);
  let colorScheme = JSON.parse(scheme)

  console.log(colorScheme)

  function camelToKebab(str) {
    return str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
  }

  function applyMaterialTheme(scheme) {
    const root = document.documentElement;

    for (const [key, value] of Object.entries(scheme)) {
      if (key === "brightness") continue;

      let cssKey = `--md-sys-color-${camelToKebab(key)}`;

      console.log("Setting: ", cssKey)
      root.style.setProperty(
        cssKey,
        value
      );
    }
  }

  applyMaterialTheme(colorScheme);
} catch (_) {

  const theme = themeFromSourceColor(argbFromHex('#f82506'));
  // Check if the user has dark mode turned on
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Apply the theme to the body by updating custom properties for material tokens
  applyTheme(theme, { target: document.body, dark: true });
}


render(() => <Router>
  <Route path="/" component={MatrixRTCApp} />
  <Route path="/dev" component={DevMode} />
  <Route path="/mock" component={MockRTCApp} />
</Router>, root);
