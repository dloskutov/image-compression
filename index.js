const copy = require('recursive-copy');
const path = require('path');

const inputDir = path.join(__dirname, './input');
const outputDir = path.join(__dirname, './output');

const options = {
	overwrite: true,
	expand: true,
	dot: true,
	filter: [
        '**/*.jpg',
        '**/*.jpeg'
    ],
};

copy(inputDir, outputDir, options)
	.on(copy.events.COPY_FILE_START, function(copyOperation) {
		console.info('Copying file ' + copyOperation.src + '...');
	})
	.on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
		console.info('Copied to ' + copyOperation.dest);
	})
	.on(copy.events.ERROR, function(error, copyOperation) {
		console.error('Unable to copy ' + copyOperation.dest);
	})
	.then(function(results) {
		console.info(results.length + ' file(s) copied');
	})
	.catch(function(error) {
		return console.error('Copy failed: ' + error);
	});