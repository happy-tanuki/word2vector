var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var changeCase = require( 'change-case' );
var utils = require( './utils' );

var w2v = {};
w2v.getSimilar = getSimilarSync;
w2v.getSimilarSync = getSimilarSync;
w2v.getSimilarAsync = getSimilarAsync;
module.exports = w2v;

function getSimilarSync(word = "臺灣", returnType = "array")
{
  var result = [];
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawnSync('./getSimilar', ['-f', this.modelFile, '-w', word], {cwd: utils.SRC_DIR});
	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getSimilar.');
	  throw new Error(errorText);
	}
	else {
	  var stdout = child.stdout.toString().trim();
    var lines = stdout.split('\n');
    lines.pop(1); // pop this last after splitting
    if(returnType.toLowerCase() === 'object')
    {
      result = {};
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        result[s[0]] = s[1];
      })
    }
    else
    {
      result = [];
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        tmp['word'] = s[0];
        tmp['cosineDistance'] = s[1];
        result.push(tmp);
      })
    }
    return result;
	}
}

function getSimilarAsync(word = "臺灣", callback)
{
  var result = {};
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawn( './getSimilar',
		[
      '-f', this.modelFile,
      '-w', word
    ],
		{ cwd: utils.SRC_DIR }
	);
  child.stdout.on( 'error', (err) => {
    console.log('Fatal error from ./getSimilar.');
    result = err;
	  // throw new Error(err.toString.trim());
	});
	child.stdout.on( 'data', (data) => {
    var stdout = data.toString().trim();
    var lines = stdout.split('\n');
    lines.pop(1); // pop this last after splitting
    if(returnType.toLowerCase() === 'object')
    {
      result = {};
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        result[s[0]] = s[1];
      })
    }
    else
    {
      result = [];
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        tmp['word'] = s[0];
        tmp['cosineDistance'] = s[1];
        result.push(tmp);
      })
    }
	});
	child.on( 'close', (exitCode) => {
    callback(result, exitCode);
    // console.log(`.......   exitCode: ${exitCode}`);
	});
}