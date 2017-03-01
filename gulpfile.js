var gulp = require('gulp');
var gutil = require('gulp-util');           //gulp中使输入的内容带上颜�?
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path'); //gulp自动监听文件变化时，�?产生的路径指定文件，以让�?个文件变动时,单独让这个文件变�?
var combiner = require('stream-combiner2'); //如果文件中有 js 语法错误时，gulp 会终止运行并报错，这个是用来防止gulp终止运行�?
var sourcemaps = require('gulp-sourcemaps');//为生产环境的dist文件产生�?,产生错误时，直接重新返回到开发环境src中去查看出错的文�?
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');//补全css的前�?
var less = require('gulp-less');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');              //生成md后缀�?
var revCollector = require('gulp-rev-collector');   //模板上引用路径的替换
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var gulpSequence = require('gulp-sequence');    //让gulp的task构建任务依次同步执行


//输出错误的function
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

//生产自动监听js文件的任�?
gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        /*
         paths
         { srcPath: 'src/js/log.js',
         srcDir: 'src/js/',
         distPath: 'dist/js/log.js',
         distDir: 'dist/js/',
         srcFilename: 'log.js',
         distFilename: 'log.js' }
         */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})

gulp.task('uglifyjs', function () {
    var options = {
        preserveComments: 'license'
    };

    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        uglify({
            //mangle: true,//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//�ų������ؼ���
        }),
        sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ])
    combined.on('error', handleError)
})

gulp.task('watchcss', function () {

    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('watchless', function () {
    gulp.watch(['src/less/**/*.less','!src/less/lib/*.less'], function (event) {
        var paths = watchPath(event, 'src/less/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            less(),
            autoprefixer({
                browsers: 'last 2 versions'
            }),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir),
        ]);
        combined.on('error', handleError)
    })
})

gulp.task('lesscss', function () {
    var combined = combiner.obj([
        gulp.src(['src/less/**/*.less','!src/less/lib/*.less']),
        sourcemaps.init(),
        less(),
        autoprefixer({
            browsers: 'last 2 versions'
        }),
        minifycss(),
        sourcemaps.write('./'),
        gulp.dest('dist/css/')
    ])
    combined.on('error', handleError)
})


gulp.task('watchsass', function () {
    gulp.watch('src/sass/**/*', function (event) {
        var paths = watchPath(event, 'src/sass/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        sass(paths.srcPath)
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('sasscss', function () {
    sass('src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('watchimage', function () {
    gulp.watch('src/img/**/*', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('image', function () {
    gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'))
})

gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('watchtemplates', function () {
    gulp.watch('src/templates/**/*', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            handlebars({
                // 3.0.1
                handlebars: require('handlebars')
            }),
            wrap('Handlebars.template(<%= contents %>)'),
            declare({
                namespace: 'S.templates',
                noRedeclare: true
            }),
            gulp.dest(paths.distDir)
        ])
        combined.on('error', handleError)
    })
})

gulp.task('templates', function () {
    gulp.src('src/templates/**/*')
        .pipe(handlebars({
            // 3.0.1
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'S.templates',
            noRedeclare: true
        }))
        .pipe(gulp.dest('dist/templates'))
})

//进行编译bootstrap中的less文件
gulp.task('bootstrapLess', function () {
    var combined = combiner.obj([
        gulp.src('src/bootstrapLess/bootstrap.less'),
        sourcemaps.init(),
        less(),
        minifycss(),
        rename(function(path) {
            path.basename += ".min";        //压缩后的名字
        }),
        sourcemaps.write('./'),
        gulp.dest('dist/css/')
    ])
    combined.on('error', handleError)
});

//进行删除dist生产代码
gulp.task('clean', function () {
    return gulp.src('./dist')
        .pipe(clean({force: true}));
});

gulp.task('default', ['watchjs','watchless', 'watchcss','watchimage', 'watchcopy']);   //�?启自动化编译

//gulp.task('init',gulpSequence('clean','bootstrapLess','lesscss','uglifyjs','minifycss','image','copy'));  //初始化编�?

//初始化编�?
gulp.task('init', function (cb) {
    gulpSequence('clean', ['bootstrapLess', 'lesscss', 'uglifyjs', 'minifycss', 'image', 'copy'], cb);
});

//打包脚本
/*gulp.task('content', function () {
 gulp.src(['dist/!**!/!*.*','!*.map'])
 .pipe(gulp.dest('build/'))
 });*/


//打包css
/*gulp.task('packcss', function () {
 gulp.src('dist/css/!**!/!*.css')
 .pipe(gulp.dest('build/dist/css'))
 });*/

//打包css
gulp.task('packcss', function () {
    gulp.src('./dist/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./build/dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
});

//打包font
gulp.task('packfont', function () {
    gulp.src('dist/fonts/**/*')
        .pipe(gulp.dest('build/dist/fonts'))
});

//打包img
gulp.task('packimg', function () {
    gulp.src('dist/img/**/*')
        .pipe(gulp.dest('build/dist/img'))
});

//打包js
gulp.task('packjs', function () {
    gulp.src('dist/js/**/*.js')
        .pipe(gulp.dest('build/dist/js'))
});

//打包jsp
/*gulp.task('packjsp', function () {
 gulp.src('WEB-INF/!**!/!*')
 .pipe(gulp.dest('build/WEB-INF'))
 });*/

//打包jsp
gulp.task('packjsp', function () {
    gulp.src(['./rev/*.json','./WEB-INF/**/*'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/WEB-INF'));
});


//整合打包
gulp.task("package", function (cb) {
    gulpSequence('packcss',['packfont', 'packimg', 'packjs'], 'packjsp', cb)
});
//['packcss', 'packfont', 'packimg', 'packjs', 'packjsp'])

gulp.task('webserver', function () {
    connect.server();
});