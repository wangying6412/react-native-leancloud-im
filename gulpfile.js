/**
 * 工具
 *
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
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');

gulp.task(
    'jsdoc',
    /**
     * Gulp任务 : 生成JsDoc文档
     *
     * @function external:tools#gulp jsdoc
     * @example
        $ gulp jsdoc
     */
    ()=>{
        const config = require(Path.join(__dirname,'./.jsdoc.json'));
        gulp.src(['README.md', './gulpfile.js', './index.ios.js', './src/**/*.js','!./src/**/__test__/**'], {read: false})
            .pipe(jsdoc(config));
    }
);

gulp.task(
    'style',
    /**
     * 将scss编译为react native可用的js文件
     *
     * @function external:tools#gulp style
     * @example
        $ gulp style
     */
    ()=>{
        return watch('./src/components/Dui/css/*.scss',{ ignoreInitial: false  })
            .pipe(plumber())
            .pipe(sass())
            .pipe(reactNativeStylesheetCss({
                withExtendedStyleSheet: false,
                outputPlainObject: true,
            }))
            .pipe(gulp.dest('./src/components/Dui/css/'));
    }
);

gulp.task(
    'file',
    /**
     * 构建js文件，自动添加头部注释及基本结构
     *
     * @function external:tools#gulp file
     * @example
     *
     *      $ gulp file --name user.js --desc 用户模块 --cwd
     *
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
                .pipe(replaceTemplate(basename,description))
                .pipe(gulp.dest(process.cwd()));
        }
    }
);

gulp.task(
    'module',
    /**
     * 构建模块，自动添加UI.js reducer.js __test__
     *
     * @function external:tools#gulp module
     * @example
     *
     *      $ gulp module --name message --desc 消息模块 --cwd
     *
     */
    ()=>{

        if(!args.cwd)throw new Error('必须要 --cwd 参数。');
        if(!args.name)throw new Error('没有发现模块名，操作失败。');

        const template = Path.join(__dirname,'template/module/**/*.{js,json,scss,css}');
        const modulename = args.name
            .replace(/\s/g,'')
            .replace(/[\-]\w?/g,(str)=>str[1]?str[1].toUpperCase():'');
        const description = args.description || args.desc || '';
        const moduledir = args.name;

        if(fs.existsSync(Path.join('./',modulename))){
            throw new Error(`模块${modulename}已存在，操作失败。`);
        }else{
            gulp.src(template)
                .pipe(insertHeader(modulename,description))
                .pipe(rename((path)=>{
                    switch(path.basename){
                        case 'index':
                            path.basename = modulename;
                            break;
                        case 'package':
                            break;
                        default:
                            path.basename = modulename + '.' + path.basename;
                    }
                }))
                .pipe(replaceTemplate(modulename,description))
                .pipe(gulp.dest(Path.join(process.cwd(),moduledir)));
        }
    }
);

/**
 * 替换模板中的占位字符
 *
 * @function external:tools~replaceTemplate
 * @access protected
 * @param {string} name - 文档名或者模块名，不带后缀
 * @param {string} description - 文件描述（可选）
 * @returns {Object} - 返回replace插件
 */
function replaceTemplate(name,description=''){
    return replace(/\$(name|Name|NAME|desc|description)\$/g,(str)=>{
        switch(str){
            case '$name$':
                return name;
            case '$NAME$':
                return name.toUpperCase();
            case '$Name$':
                return name.replace(/^[a-z]/,(s)=>s.toUpperCase());
            case '$description$':
            case '$desc$':
                return description;
        }
    });
}

/**
 * 为JS文件插入头部
 *
 * @function external:tools~insertHeader
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
    let template = ['/**',
        ' * <%= pkg.description %>',
        ' *',
        ' * @file <%= pkg.filename %>',
    ];
    pkg.authors && template.push(' * @author <%= pkg.authors %>');
    pkg.version && template.push(' * @version v<%= pkg.version %>');
    pkg.license && template.push(' * @license <%= pkg.license %>');
    template = template.concat([' */','']).join('\n');
    return header(template, {
        pkg: pkg
    });
}







