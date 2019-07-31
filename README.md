# RPG-Web-Components
A FFG themed set of AngularJS directives and components

Please view the examples and documentation at: https://tk20466.github.io/RPG-Web-Components/

Live example:  http://swrpg.sarah-bailey.com/

**Current Version**: 1.1.0

**Usage**: just include the module in your application module after referencing AngularJS and the included javascript/css file.

    var app = angular.module("myApp", ["swaor"]);

**Themes**: You can change the style theme by changing the class on your `<html>` element

    <html class="edge-of-the-empire-themed">
    <html class="age-of-rebellion-themed">
    <html class="force-and-destiny-themed">

**Building**: Make sure you have the following NPM packages installed:
 * [gulp](https://www.npmjs.com/package/gulp)
 * [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
 * [gulp-uglifycss](https://www.npmjs.com/package/gulp-uglifycss)
 * [gulp-concat](https://www.npmjs.com/package/gulp-concat)
 * [gulp-angular-templatecache](https://www.npmjs.com/package/gulp-angular-templatecache)
 * [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

Then run the following two commands in your command line

    gulp templates
    gulp release

your files will be output to a /releases folder

To-do:

* ~~Finish documentation~~ **Completed!**
* ~~Minion group size handling~~ **Completed!**
* live-tracker for wounds/strain/group size
* ~~Ranged/Melee defense box~~ **Completed!**
* ~~Better equipment management~~ **Completed!**
* IE11 and Firefox support
* WYSIWYG editor with preview
