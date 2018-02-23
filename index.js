#!/usr/bin/env node

'use strict';

const pkg = require('./package.json');
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');

const openTag = '<include';

var program = require('commander');
var partials_tree = [];

program
.version(pkg.version, '-v, --version')
.arguments('<file>')
.option('-o, --out [value]', 'output directory')
.option('-w, --watch', 'watch any changes')
.parse(process.argv);

if (!program.args || !program.args.length){
    program.help();
    process.exit(8);
} else if (!program.out) {
    console.error("You must inform the output directory. Use '-o' our '--out'.");
    process.exit(1);
} else {
    init(program.args);
}

if (program.watch) {
    watch(path.dirname(program.args[0]), { recursive: true }, function(e, file) {
        var changed_files = partials_tree.filter(function(e){ return e.partials.includes(file) });

        if (changed_files.length) {
            changed_files.map(function(el) {
                console.log('%s changed.', el.file);
                parsePartials(el.file);
            });
        } else {
            console.log('%s changed.', file);
            parsePartials(file);
        }

    });
}

function init(files) {

    if (!fs.existsSync(program.out)){
        fs.mkdirSync(program.out);
    }

    files.map(function(file) {

        if (!fs.existsSync(file)) {
            console.error("The input file could not be found.");
            process.exit(1);
        }
        partials_tree.push({file: file, partials: []});
        parsePartials(file);
    })
}

function parsePartials(file) {
    var html = fs.realpathSync(file);
    var content = fs.readFileSync(html).toString();
    var filepath = path.dirname(file);
    var found = 0;
    
    while (found !== -1) {
        if (found === -1) {
            continue;
        }
        found = content.indexOf(openTag, found);
        var end = content.indexOf('>', found) + 1;
        var partial = content.slice(found, end).toString();
        var src = get_attrib(partial, 'src');
        var partial_contents = '';

        if (src !== null) {
            if (!path.isAbsolute(src)) {
                src = path.normalize(filepath + '/' + src);
            }

            partials_tree
                .find(function(e){ return e.file==file })
                .partials.push(src);

            if (fs.existsSync(src) && src !== file) {
                partial_contents = fs.readFileSync(src).toString();
            }
        }
        content = content.replace(partial, partial_contents);
    }

    var out_file = path.join(program.out, path.basename(file));
    fs.writeFile(out_file, content, function(err) {
        if(err) console.error(err);
    }); 
    
}

function get_attrib(partial, attrib) {
    attrib = ' ' + attrib + '=';
    var attrib_len = attrib.length;
    var start = partial.indexOf(attrib);
    if (start === -1) { return null; }
    start += attrib_len;
    var quoteType = partial.charAt(start);
    start ++;
    return partial.slice(start, partial.indexOf(quoteType, start))
}