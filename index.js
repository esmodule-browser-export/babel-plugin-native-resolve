const fs = require('fs')
const path = require('path')
const dependencies = fs
    .readdirSync(path.join(process.cwd(), 'node_modules'))

const resolveCache = {}

const dependenciesHash = {}
Object.keys(require(path.join(process.cwd(), 'package.json')).dependencies).forEach(
    dependency => {
        if(dependency.endsWith('esmodule-browser-export')){
            dependenciesHash[dependency] = dependency.slice(0, -23)
        } else {
            dependenciesHash[dependency] = dependency
        }
    }
)

const resolvers = {loose, fast, debug}

module.exports = function resolveNative() {
    return {
        name: 'native-resolve',
        visitor: {
            ImportDeclaration: function resolver({ node: { source } }, opts) {
                let {mode = 'loose', override = {}} = opts
                console.log('opts', mode, override)
                if (source !== null) {
                    let initial = source.value
                    console.log('ini', initial)
                    resolvers[mode](source, override)
                    if (!source.value.endsWith('.js')) {
                        source.value += '.js'
                    }
                    resolveCache[initial] = source.value
                    console.log(initial, source.value)
                }
            }

        }
    }
}

function loose(source, override){
    if(typeof resolveCache[source.value] !== 'undefined'){
        source.value = resolveCache[source.value]
    } else {
        if(typeof dependenciesHash[source.value] !== 'undefined'){
            source.value = dependenciesHash[source.value]
        }
        if(typeof override[source.value] !== 'undefined'){
            source.value = override[source.value]
        } else if(dependencies.includes(source.value)){
            source.value = '/node_modules/' + source.value + '/es/index.js'
        } else if (!['','.','..'].includes(source.value.split('/')[0])){
            source.value = '/node_modules/' + source.value
        }
    }
}

function fast(source, override){
    if(typeof resolveCache[source.value] !== 'undefined'){
        source.value = resolveCache[source.value]
    } else {
        if(typeof dependenciesHash[source.value] !== 'undefined'){
            source.value = dependenciesHash[source.value]
        }
        if(typeof override[source.value] !== 'undefined'){
            source.value = override[source.value]
        } else if(dependencies.includes(source.value)){
            source.value = '/node_modules/' + source.value + '/es/index.js'
        } else if (!['','.','..'].includes(source.value.split('/')[0])){
            source.value = '/node_modules/' + source.value
        }
    }
}

function debug(source, override){
    if(typeof resolveCache[source.value] !== 'undefined'){
        source.value = resolveCache[source.value]
    } else {
        if(typeof dependenciesHash[source.value] !== 'undefined'){
            source.value = dependenciesHash[source.value]
        }
        if(typeof override[source.value] !== 'undefined'){
            source.value = override[source.value]
        } else if(dependencies.includes(source.value)){
            source.value = '/node_modules/' + source.value + '/es/index-nodeps.js'
        } else if (!['','.','..'].includes(source.value.split('/')[0])){
            source.value = '/node_modules/' + source.value
        }
    }
}
