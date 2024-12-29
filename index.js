const copy = require('recursive-copy');
const path = require('path');
const sharp = require('sharp');
const imageSize = require('image-size');
const { exit } = require('process');

const inputDir = process.env.INPUT_DIR;
const outputDir = process.env.OUTPUT_DIR;
const maxSize = parseInt(process.env.MAX_IMAGE_SIZE, 10) || 2048;

if (!inputDir || !outputDir) {
    console.log("use INPUT_DIR and OUTPUT_DIR to set up input/output dir");
    exit(0);
}

const options = {
	overwrite: true,
    transform: function (src, dest, stats) {
        const isJPEG = src.toLowerCase().indexOf('.jpeg') > 0;
        const isJPG = !isJPEG && src.toLowerCase().indexOf('.jpg') > 0;

        if (!isJPEG && !isJPG) {
            return null;
        }

        const { width, height } = imageSize(src);

        let stream = sharp();
        if (width > maxSize || height > maxSize) {
            stream = stream.resize(maxSize);
        } else {
            return null;
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
