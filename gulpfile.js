const gulp = require('gulp');
const babel = require('gulp-babel');
const exec = require('child_process').exec;
const getBabelRelayPlugin = require('babel-relay-plugin');
const paths = require('./server/paths');

var schemaData = null;
var relayPlugin = null;

try {
    schemaData = require(paths.schemaJson).data;
    relayPlugin = getBabelRelayPlugin(schemaData);
} catch(e) {
}


gulp.task('lib', () => {
    return gulp.src(paths.reactSrc)
        .pipe(babel({
            presets: ['react', 'es2015'],
            plugins: [relayPlugin, 'transform-react-jsx']
        }))
        .pipe(gulp.dest(paths.reactLib));
});

gulp.task('schema', function (cb) {
    exec('node ' + paths.schemaTransform, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.reactSrc, ['lib']);
    gulp.watch(paths.typesSrc, ['schema']);
    gulp.watch(paths.schemaJson, ['lib']);
});

gulp.task('default', ['lib', 'watch']);