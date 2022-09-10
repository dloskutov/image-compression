const copy = require('recursive-copy');
const path = require('path');
const sharp = require('sharp');
const imageSize = require('image-size');

const inputDir = path.join(__dirname, './input');
const outputDir = path.join(__dirname, './output');
const maxSize = 2048;

const options = {
	overwrite: true,
    transform: function (src, dest, stats) {
        const isJPEG = src.indexOf('.jpeg') > 0;
        const isJPG = !isJPEG && src.indexOf('.jpg') > 0;

        if (!isJPEG && !isJPG) {
            return null;
        }

        const { width, height } = imageSize(src);

        let stream = sharp();
        if (width > maxSize || height > maxSize) {
            stream = stream.resize(maxSize);
        }

        if (isJPEG) {
            stream = stream.toFormat('jpeg', {
                quality: 95,
                mozjpeg: true
            });
        }
        if (isJPG) {
            stream = stream.toFormat('jpg', {
                quality: 95,
                mozjpeg: true
            })
        }

        return stream;
    }
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