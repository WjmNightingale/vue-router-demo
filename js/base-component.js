// Globally register all base component for convenience 
// they because will be used very frequently
// Components are registered using the PascalCased version of their name

import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
    // look for files in the current directory
    '.',
    // do not look in sub-directories
    false,
    // only include "_base-" prefixed .vue.files
    /_base-[\w-]+\.vue$/
)
// for each matching file name ...
requireComponent.keys().forEach(fileName => {
    // get the component config
    const componentConfig = requireComponent(fileName)
    // get the pascalCase version of the component name
    const componentName = upperFirst(
        camelCase(
            fileName
                // remove the './_' from the beginning
                .replace(/^\.\/_/,'')
                // remove the file extension from the end
                .replace(/\.\w+$/,'')
        )
    )
    Vue.component(componentName,componentConfig.default || componentConfig)
})