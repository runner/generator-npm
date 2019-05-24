/**
 * @author Ivan Slobodnichenko <i.slobodnichenko@infomir.com>
 */

'use strict';

const
    path  = require('path'),
    exec  = require('child_process').exec,
    name  = 'npm',
    tools = require('runner-tools'),
    log   = require('runner-logger').wrap(name);


function publish ( config, done ) {
    if ( typeof config.onPublish === 'function' ) {
        config.onPublish(function ( error, data ) {
            if ( error ) {
                log.warn(error.toString);
                done(error);
            } else {
                tools.write([
                    {
                        name: path.join(config.target, 'package.json'),
                        data: JSON.stringify(data, null, 4)
                    }
                ], log, function ( error ) {
                    if ( error ) {
                        done(error);
                    } else {
                        // package publish execution
                        exec(config.command, {cwd: config.target}, function ( error, stdout, stderr ) {
                            if ( error ) {
                                log.warn(error.toString());
                                done(error);
                            } else {
                                (stdout + stderr).trim().split('\n').forEach(function ( line ) {
                                    if ( line.length !== 0 ) {
                                        log.info(line);
                                    }
                                });

                                log.info('package %s is published', log.colors.bold(data.name));
                                done();
                            }
                        });
                    }
                });
            }
        });
    } else {
        log.warn('no valid onPublish method');
        done();
    }
}


function generator ( config = {}, options = {} ) {
    const
        tasks = {},
        {prefix = name + ':', suffix = ''} = options;

    // sanitize and extend defaults
    config = Object.assign({
        onPublish: null,
        target: '.',
        command: 'npm publish'
    }, config);

    tasks[prefix + 'config' + suffix] = function () {
        log.inspect(config, log);
    };

    tasks[prefix + 'publish' + suffix] = function ( done ) {
        publish(config, done);
    };

    return tasks;
}


// export main actions
generator.methods = {
    publish: publish
};


// public
module.exports = generator;
