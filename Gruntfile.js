module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            js: ['src/main/resources/**/*.js',
                'src/main/resources/tools/*.ts',
                'src/main/resources/core/*.ts',
                'src/main/resources/**/*.map',
                '!src/main/resources/**/sprintf.js',
                '!src/main/resources/**/require.js'],
            debug: {}
        },
        ts: {
            default : {
                options: {
                    rootDir: 'src/main/resources/static'
                },
                tsconfig: 'src/main/resources/tsconfig.json'
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["clean", "ts"]);
};