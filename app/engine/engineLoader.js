import * as InterfaceEngine from "./hookInterface";
const path = require('path');

// Autoload Hooks
const loadHooks = () => {
    const { readdirSync } = require('fs')

    const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    return getDirectories( path.join(process.cwd(), process.env.HOOK_PATH) )
}
// Validate against Interface
const isValid = (interfaceDefinition, engineHooks) => {
    console.info("[ENGINE] Validate Engine");

    const defined = Object.keys(interfaceDefinition);
    const implemented = Object.keys(engineHooks);
    let notImplementedFunctions = [];
    for (let i = 0, len = defined.length; i < len; i++) {
        const currentDefined = defined[i];
        let found = false;
        for (let x = 0, len = implemented.length; x < len; x++) {
            const currentImplemented = implemented[x];
            if (currentDefined === currentImplemented) {
                found = true;
                break;
            }
        }
        if ( !found ) {
            notImplementedFunctions.push(currentDefined);
        }
    }
    if (notImplementedFunctions.length === 0) {
        return true;
    }
    console.warn(`It looks you forgot -> ${notImplementedFunctions} <- to implement in your selected  Engine: ${implemented}`);

}
// Select and loads the engine
export const selectEngine = () => {
    // Autoload Hook Folder
    const engines = loadHooks();
    // Type-hinting with interface
    let loadedEngine = InterfaceEngine;
    // Prüfe welche Engine genutzt werden soll
    for (let i = 0, len = engines.length; i < len; i++) {
        if (engines[i] === process.env.SPAWN_ENGINE) {
            loadedEngine = require( path.join(process.cwd(), process.env.HOOK_PATH, engines[i]) );
            // Prüfe Interface
            const correctInterfaceImplementation = isValid( InterfaceEngine, loadedEngine );
            if(!correctInterfaceImplementation) {
                throw new Error("[ENGINE] Look above the warnings and fix them!")
            }
            console.info(`[ENGINE] Loaded Engine ${ engines[i] } from ${ process.env.HOOK_PATH }`);
            // Return Engine
            return loadedEngine;
        }
    }
    throw new Error(`[ENGINE] Tired to load ${ process.env.SPAWN_ENGINE } from ${ engines }`)
}
