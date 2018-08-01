/**
 * @author Ivan Slobodnichenko <i.slobodnichenko@infomir.com>
 */

'use strict';

var path  = require('path'),
    exec  = require('child_process').exec,
    name  = 'npm',
    tools = require('@runner/tools'),
    log   = require('@runner/logger').wrap(name);


function publish ( config, done ) {
    tools.write([
        {
            name: path.join(config.path, 'package.json'),
            data: JSON.stringify(config.packageData, null, 4)
        }
    ], log, function ( error ) {
        if ( error ) {
            done(error);
        } else {
            // package publish execution
            exec(config.command, {cwd: config.path}, function ( error, stdout, stderr ) {
                if ( error ) {
                    log.warn(error.toString());
                    done(error);
                } else {
                    (stdout + stderr).trim().split('\n').forEach(function ( line ) {
                        if ( line.length !== 0 ) {
                            log.info(line);
                        }
                    });

                    log.info('package %s is published', log.colors.bold(config.packageData.name));
                    done();
                }
            });
        }
    });
}

function generator ( config, options ) {
    var tasks = {};

    // sanitize and extend defaults
    config = Object.assign({
        packageData: {},
        path: '.',
        command: 'npm publish'
    }, config);
    options = Object.assign(generator.options, options || {});

    tasks[options.prefix + 'config' + options.suffix] = function () {
        log.inspect(config, log);
    };

    tasks[options.prefix + 'publish' + options.suffix] = function ( done ) {
        publish(config, done);
    };

    return tasks;
}


// defaults
generator.options = {
    prefix: name + ':',
    suffix: ''
};


// export main actions
generator.methods = {
    publish: publish
};


// public
module.exports = generator;
