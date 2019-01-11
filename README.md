# babel-plugin-native-resolve

A [Babel](http://babeljs.io) plugin to add a new resolver for your modules. This plugin allows you to transform import paths so that they will work in the browser.

## Description

This plugin is useful to make ES6 imports work in the browser. In the browser, valid urls for import must start with "/" , "./" , or ".."

```js
// Use this:
import MyButton from 'components/MyButton';
// Instead of that:
import MyButton from '../../../app/components/MyButton';
// It does not work with require calls
```

## Getting started

Install the plugin

```
$ npm install --save-dev babel-plugin-native-resolve
```

Specify the plugin in your `.babelrc` with the resolution mode and overrides. Here's an example:
```json
{
  "plugins": [
    ["native-resolve", {
      "mode": ["debug"],
      "override": {
          "conf": "/conf.js",
          "components": "/app/components"
      }
    }]
  ]
}
```

## Resolution modes
Resolution modes only affect packages in the "node_modules" folder.
Node Modules from npm can be resolved in 3 ways:
 - in "loose" mode, which is the default, the plugin will read the package.json file, then see if there is a "module" property, if not defined will check for "main" property, and then will default to "index.js".
 - in "strict" mode, the plugin will append the path with "/es/index.js". If that file is not defined in the npm package, the resolution will silently fail.
 - in "debug" mode, the plugin will append the path with "/es/index-nodeps.js". If that file is not defined in the npm package, the resolution will silently fail.

## License

MIT, see [LICENSE.md](/LICENSE.md) for details.

