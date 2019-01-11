const fs = require('fs')
const path = require('path')

const dependencies = fs
    .readdirSync(path.join(process.cwd(), 'node_modules'))

const resolveCache = {}

const dependenciesHash = {}
Object.keys(require(path.join(process.cwd(), 'package.json')).dependencies).forEach(
    dependency => {
        if(dependency.endsWith('-esmodule-browser-export')){
            dependenciesHash[dependency.slice(0, -24)] = dependency
        } else {
            dependenciesHash[dependency] = dependency
        }
    }
)

module.exports = function resolveNative() {
    return {
        name: 'native-resolve',
        visitor: {
            ImportDeclaration: function resolver({ node: { source } }, { opts: { mode, override }}) {
                if ( source !== null) {
                    let initial = source.value
                    if(typeof resolveCache[initial] !== 'undefined'){
                        source.value = resolveCache[initial]
                    } else {
                        let parts = source.value.split('/')
                        let alias = parts[0]
                        if(alias === source.value) {
                            if(typeof override[source.value] !== 'undefined'){
                                source.value = override[source.value]
                            } else {
                                if(typeof dependenciesHash[source.value] !== 'undefined'){
                                    source.value = dependenciesHash[source.value]
                                }
                                if(mode === 'strict') {
                                    source.value = '/node_modules/' + source.value + '/es/index.js'
                                } else if( mode === 'debug') {
                                    source.value = '/node_modules/' + source.value + '/es/index-nodeps.js'
                                } else {
                                    let packageJson = require(path.join(process.cwd(), 'node_modules', source.value, 'package.json'))
                                    let file = packageJson.module || packageJson.main || 'index.js'
                                    source.value = '/node_modules/' + source.value + '/' + file
                                }
                            }

                        } else if(!['','.','..'].includes(alias)){
                            if(typeof dependenciesHash[alias] !== 'undefined'){
                                alias = dependenciesHash[alias]
                            } else if(typeof override[alias] !== 'undefined'){
                                alias = override[alias]
                            }
                            parts[0] = alias
                            if(dependencies.includes(alias)){
                                source.value = '/node_modules/' + parts.join('/')
                            } else {
                                source.value = parts.join('/')
                            }
                        }
                        if (!source.value.endsWith('.js')) {
                            source.value += '.js'
                        }
                        resolveCache[initial] = source.value
                    }
                }
            }
        }
    }
}

