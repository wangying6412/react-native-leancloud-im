/**
 * 工具
 *
 * @file gulpfile.js
 * @typedef {Object} task - gulp 任务
 * @external tools
 */

const gulp = require('gulp');

const sass = require('gulp-sass');
const reactNativeStylesheetCss = require('gulp-react-native-stylesheet-css');
const watch = require('gulp-watch');
const Path = require('path');
const jsdoc = require('gulp-jsdoc3');
const header = require('gulp-header');
const args = require('yargs').argv;
const fs = require('fs');
const rename = require('gulp-rename');

gulp.task(
    'jsdoc',
    /**
     * Gulp任务 : 生成JsDoc文档
     *
     * @name gulp jsdoc
     * @function
     * @memberof external:tools
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
     * @name gulp style
     * @function
     * @memberof external:tools
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
     * @name gulp createFile
     * @function
     * @memberof external:tools
     * @example
     *      $ gulp createFile --name user.js --desc 用户模块 --cwd
     */
    ()=>{

        if(!args.cwd)throw new Error('必须要 --cwd 参数。');
        if(!args.name)throw new Error('没有发现文件名，操作失败。');

        const template = Path.join(__dirname,'template/template.js');
        const extname = Path.extname(args.name);
        const filename = extname ? args.name : args.name + '.js';
        const basename = Path.parse(filename).name;
        const description = args.description || args.desc || '';

        if(!fs.existsSync(template))throw new Error(`模板文件${template}不存在。`);

        if(fs.existsSync(Path.join('./',filename))){
            throw new Error(`文件${filename}已存在，操作失败。`);
        }else{
            gulp.src(template)
                .pipe(insertHeader(filename,description))
                .pipe(rename({basename}))
                .pipe(gulp.dest(process.cwd()));
        }
    }
);

gulp.task(
    'createModule',
    /**
     * 构建模块，自动添加UI.js reducer.js __test__
     *
     * @name gulp createModule
     * @function
     * @memberof external:tools
     * @todo -待编写
     */
    ()=>{

    }
);

/**
 * 为JS文件插入头部
 *
 * @name insertHeader
 * @function
 * @memberof external:tools
 * @access protected
 * @param {string} filename - 文件名称
 * @param {string} description - 文件描述（可选）
 * @returns {buffer} - 返回插入头部后的文件
 */
function insertHeader(filename,description=''){
    let pkg = require('./package.json');
    pkg.filename = filename;
    pkg.description = description;
    pkg.basename = Path.parse(filename).name;
    pkg.author = pkg.author ? pkg.author : 'none';
    pkg.version = pkg.version ? pkg.version : 'none';
    pkg.license = pkg.license ? pkg.license : 'none';
    let template = ['/**',
        ' * <%= pkg.description %>',
        ' *',
        ' * @file <%= pkg.filename %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' * @license <%= pkg.license %>',
        ' * @module <%= pkg.basename %>',
        ' */',
        ''
    ].join('\n');
    return header(template, {
        pkg: pkg
    });
}

gulp.task('watch',()=>{
    watch('./src/*.js', function(event) {
        console.log(event);
    });
});






