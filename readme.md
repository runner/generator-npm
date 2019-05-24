Tasks generator for NPM
========================

[![build status](https://img.shields.io/travis/runner/generator-npm.svg?style=flat-square)](https://travis-ci.org/runner/generator-npm)
[![npm version](https://img.shields.io/npm/v/runner-generator-npm.svg?style=flat-square)](https://www.npmjs.com/package/runner-generator-npm)
[![dependencies status](https://img.shields.io/david/runner/generator-npm.svg?style=flat-square)](https://david-dm.org/runner/generator-npm)
[![devDependencies status](https://img.shields.io/david/dev/runner/generator-npm.svg?style=flat-square)](https://david-dm.org/runner/generator-npm?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/runner-generator-npm)


## Installation ##

```bash
npm install runner-generator-npm
```


## Usage ##

Add to the scope:

```js
const generator = require('runner-generator-npm');
```

Generate tasks according to the given config:

```js
const tasks = generator({
    target: 'target-folder',
    onPublish: function ( done ) {
        done(null, require('./package.json'));
    }
});
```

Add generated tasks to the `runner` instance:

```js
const runner = require('runner');

Object.assign(runner.tasks, tasks);
```

The following tasks will become available:

 Task name     | Description
---------------|-------------
 `npm:config`  | prints the current configuration used for generated tasks
 `npm:publish` | publishes the package

Generator accepts two arguments: base configuration and additional options.


### Base configuration ###

It's an object with the following properties:

 Name      | Description
-----------|-------------
 onPublish | user callback executed before actual publishing to get the data which will be written to the package.json file
 target    | folder in which the package.json file will be created
 command   | publish command which executes after writing package.json file
 

### Additional options ###

It's an object with the following properties:

 Name   | Description
--------|-------------
 prefix | an affix placed before a task name (default is `npm:`)  
 suffix | a string added at the end of a task name (empty by default)
 
So it's possible to change generated tasks names: 

```js
Object.assign(runner.tasks,
    generator(config, {
        prefix: 'package:',
        suffix: ':develop'
    })
);
```

It will add the following task:
 
* `package:publish:develop`
 

## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/generator-npm/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`runner-generator-npm` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
