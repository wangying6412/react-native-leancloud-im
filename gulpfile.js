/**
 *
 * @file gulp 构建工具
 */


/**
 * Gulp 构建工具
 *
 * @namespace gulp
 */
const gulp = require('gulp');

const sass = require('gulp-sass');
const reactNativeStylesheetCss = require('gulp-react-native-stylesheet-css');
const watch = require('gulp-watch');
const Path = require('path');
const jsdoc = require('gulp-jsdoc3');

gulp.task(
    'jsdoc',
    /**
     * 生成JsDoc文档
     *
     * @name jsdoc
     * @memberof gulp
     * @example
        $ gulp jsdoc
     */
    ()=>{
        const config = require(Path.join(__dirname,'./.jsdoc.json'));
        gulp.src(['README.md', './gulpfile.js', './index.ios.js', './src/**/*.js'], {read: false})
            .pipe(jsdoc(config));
    }
);

gulp.task(
    'style',
    /**
     * 将scss编译为react native可用的js文件
     *
     * @name style
     * @memberof gulp
     * @example
        $ gulp style
     */
    ()=>{
        gulp.src('./src/Style/*.scss')
            .pipe(sass())
            .pipe(reactNativeStylesheetCss({
                withExtendedStyleSheet: false,
                outputPlainObject: true,
            }))
            .pipe(gulp.dest('./src/Style/'));
    }
);

gulp.task(
    'createFile',
    /**
     * 构建js文件，自动添加头部注释及基本结构
     *
     * @name createFile
     * @memberof gulp
     * @todo -待编写
     */
    ()=>{

    }
);

gulp.task(
    'createModule',
    /**
     * 构建模块，自动添加UI.js reducer.js __test__
     *
     * @name createModule
     * @memberof gulp
     * @todo -待编写
     */
    ()=>{

    }
);

gulp.task('watch',()=>{
    watch('./src/*.js', function(event) {
        console.log(event);
    });
});

//var argv = require('yargs').argv;
gulp.task('test',()=>{
    console.log(Path.resolve(__dirname));
    console.log(process.cwd());
    //console.log(argv);
});





