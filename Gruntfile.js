'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var config = {
		images : 'images',
		css : 'css',
		scss : 'sass',
		fonts : 'fonts',
		scripts : 'js',
		bower_path : 'bower_components',
		app : require('./bower.json').appPath || 'app',
		dist : 'dist' 									   // 输出的最终文件在 dist 里面
	};

	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),        // 读取 package.json 文件

		banner : '/**\n' + 
				 '<%= pkg.version %>' +
	    		 'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				 '*/\n',

		config : config,

		copy : {
		 dist : {
			 files : [{
				 	expand : true,
					cwd : '<%= config.app %>/',
					src : [
						'*.{wep,svg,ico,icon,txt}',
						'*.htaccess',
						'**/*.html',
						'js/**/*.js',
						'css/**/*.css',
						'images/{,*/}*',
						'fonts/{,*/}*'
					],
					dest : '<%= config.dist %>/'
			 }]
		 }
		},

		cssmin : {
			development : {
				expand : true,
				cwd : '<%= config.dist %>/css/',
				src : ['**/*.css'],
				dest : '<%= config.dist %>/css/',
				ext : '.min.css'
			}
		},

		imagemin : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%= config.dist %>/images/',
					src : '**/*.{png,jpg,jpeg,gif}',
					dest : '<%= config.dist %>/images/'
				}]
			}
		},

		sprite : {
			all : {
				src : '<%= config.dist %>/images/sprites/*.png',
				dest : '<%= config.dist %>/images/dest_sprites/destSprite.png',
				destCss : '<%= config.dist %>/css/destSprite.css'
			}
		},

		uglify : {
			dist : {
				options : {
					banner : '<%= banner %>'
				},
				files : [{
					expand : true,
					cwd : '<%= config.dist %>/js/',
					src : ['**/*.js'],
					dest : '<%= config.dist %>/js/'
				}]
			}
		},

		filerev : {
			options : {
				algorithm : 'md5',
				length : 8,
				process: function (name, hash, ext) {
					return name + '_' + hash + '.' + ext;
				}
			},
			dist : {
				files : [{
					src :[
 						'<%= config.dist %>/css/**/*.css',
 						'<%= config.dist %>/images/**/*.{png,jpg,jpeg,gif,wep,svg}',
						'<%= config.dist %>/js/**/*.js'
					]
				}]
			}
		},

		usemin : {
			css : {
				files : {
					src : ['<%= config.dist %>/css/**/*.css']
				}
			},
			js : ['<%= config.dist %>/js/**/*.js'],
			html : ['<%= config.dist %>/**/*.html'],
			options : {
				patterns: {
					js: [
						[/(img\.png)/, 'Replacing reference to image.png']
					]
				}
			}
		},

		connect : {
			options : {
				port : 9000,
				hostname : '*',
				livereload : 35729
			},

			server : {
				options : {
					open : true,
					base : [
						'<%= config.app %>'
					]
				}
			}
		},

		bower : {
			install : {
				options : {
					targetDir : '<%= config.app %>/js/lib',
					layout : 'byType',
					install : true,
					verbose : false,
					cleanTargetDir : false,
					cleanBowerDir : false,
					bowerOptions : {}
				}
			}
		},

		watch : {
			livereload : {
				options : {
					livereload : '<%= connect.options.livereload %>'
				},

				files : [
					'<%= config.app %>/**/*.html',
					'<%= config.app %>/css/**/*.css',
					'<%= config.app %>/js/**/*.js',
					'<%= config.app %>/images/**/*.{png,jpg,jpeg,gif,wep,svg}'
				]
			},

			sass : {
				files : ['<%= config.app %>/sass/**/*.{scss,sass}', '<%= config.app %>/sass/_partials/**/*.{scss,sass}'],
				tasks : ['sass:dev']
			}
		},

		sass : {

			dev : {
				options : {
					style : 'expanded'
				},
				files : {
					'<%= config.app %>/css/style.css' : '<%= config.app %>/sass/style.scss'
				}
			},

			dist : {
				options : {
					style : 'compressed'
				},
				files : {
					'<%= config.app %>/css/style.css' : '<%= config.app %>/sass/style.scss'
				}
			}
		},


		clean : {
		   dist : {
			   files : [{
				   src : ['.tmp/','<%= config.dist %>/']
			   }]
		   }
		}

	});

	grunt.registerTask('server', [
		'connect:server',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',            
		'sass:dist',
		'copy',      // 复制文件
		'cssmin',    // CSS压缩
		'imagemin',  // 图片压缩
		'sprite',
		'uglify',    // JS压缩
		'filerev',
		'usemin'     // HTML处理
	]);

	grunt.registerTask('default', [
		'connect:server',
		'watch'
	]);
};
