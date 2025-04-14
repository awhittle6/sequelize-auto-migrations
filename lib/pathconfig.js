const path = require('path'),
      fs   = require('fs');

module.exports = function(options){

    /// Update to handle multiple configs
    let sequelizercConfigs = [],
        sequelizercPath = path.join(process.env.PWD, '.sequelizerc');
    if (fs.existsSync(sequelizercPath)){
        let configFile = require(sequelizercPath);
        // Support both old format and new multi-config format
        if (configFile.configs && Array.isArray(configFile.configs)) {
            sequelizercConfigs = configFile.configs;
        } else {
            sequelizercConfigs = [configFile];
        }
    }
    
    if(!process.env.PWD){
        process.env.PWD = process.cwd()
    }
    
    let migrationsDir = [path.join(process.env.PWD, 'migrations')],
        modelsDir = [path.join(process.env.PWD, 'models')];

    if (sequelizercConfigs.length > 0) {
        return {
            migrationsDir: sequelizercConfigs.map(config => path.join(process.env.PWD, config['migrations-path'])),
            modelsDir: sequelizercConfigs.map(config => path.join(process.env.PWD, config['models-path']))
        }
    } 


    if (options['migrations-path']) {
        migrationsDir = [path.join(process.env.PWD, options['migrations-path'])];
    } else if (sequelizercConfigs['migrations-path']) {
        migrationsDir = sequelizercConfigs['migrations-path'];
    }
    
    if (options['models-path']) {
        modelsDir = path.join(process.env.PWD, options['models-path']);
    } else if (sequelizercConfigs['models-path']) {
        modelsDir = sequelizercConfigs['models-path'];
    }
    
    return {
        migrationsDir: migrationsDir,
        modelsDir: modelsDir
    }
}