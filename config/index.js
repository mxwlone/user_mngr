/**
 * Created by max on 15/04/16.
 */

var config = {
    local: {
        mode: 'local',
        port: 3000,
        mysql: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'peter123',
            database: 'user_management',
            params: 'debug=true'
        }
    },
    staging: {
        mode: 'staging',
        port: 4000
    },
    production: {
        mode: 'production',
        port: 5000
    }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
};