svgutils
========

Svg Utils for pasing SVGFile and manipulate Matrix object like Snap.svg

[![npm status](http://img.shields.io/npm/v/svgutils.svg?style=flat-square)](https://www.npmjs.org/package/svgutils)
[![build status](https://secure.travis-ci.org/throrin19/svgutils.svg?style=flat-square)](http://travis-ci.org/throrin19/svgutils)
[![dependency status](https://david-dm.org/throrin19/svgutils.svg?style=flat)](https://david-dm.org/throrin19/svgutils)
[![Code Climate](https://codeclimate.com/github/throrin19/svgutils/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/throrin19/svgutils)
[![experimental](http://img.shields.io/badge/stability-experimental-DD5F0A.svg?style=flat-square)](http://nodejs.org/api/documentation.html#documentation_stability_index)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=throrin19&url=https://github.com/throrin19/svgutils/&title=SvgUtils&language=Javascript&tags=github&category=software)

## Install

```
npm install svgutils
```

## Requirements

### NodeJS

Required version : 0.10.22

## Usage

With SVGUtils you can :

+   Convert SVG Document to JSON
+   Convert JSON to SVG Document
+   Manipulate Svg
+   Use Matrix to SVG or elements
+   ...

#### Warning

For Text and Group, the boundingbox result is not true but it's enough for basic manipulations

### Loading SVG file

```javascript
var Svg = require('svgutils').Svg;


Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    // ...
});
```

### Convert SVG file to JSON

```javascript
var Svg = require('svgutils').Svg;

Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    var json = svg.toJSON();
});
```

### Apply Matrix and get transformed svg

#### Currents Matrix only

```javascript
var Svg = require('svgutils').Svg;

Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    svg.applyMatrix(null, function(newSvg){
        console.log(newSvg.toString());
    });
});
```

#### Externals and currents Matrix

```javascript
var Svg     = require('svgutils').Svg,
    Matrix  = require('svgutils';.Matrix;

Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    // Ex : apply translate(10, 20) to all svg
    svg.applyMatrix(new Matrix(1, 0, 0, 1, 10, 20), function(newSvg){
        console.log(newSvg.toString());
    });
});
```

### Save generated SVG or Convert to PNG

#### Save SVG

```javascript
var Svg     = require('svgutils').Svg,
    Matrix  = require('svgutils';.Matrix;

Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    svg.save({ output : '/home/user/svg.svg' }, function(err, filename){
        if(err){
            throw err;
        }
    });
});
```

#### Save PNG

```javascript
var Svg     = require('svgutils').Svg,
    Matrix  = require('svgutils';.Matrix;

Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    svg.savePng({ output : '/home/user/svg.png' }, function(err, filename){
        if(err){
            throw err;
        }
    });
});
```

### Convert others formats to SVG

#### DXF to SVG (thanks to Thomas Desmoulin and his [DXF-parsing module](https://github.com/thomasdesmoulin/dxf-parsing))

You can create SVG from DXF file. You can, as you want, get specifics DXF layers.

```javascript
Svg.fromDxfFile({
    path : __dirname + '/test.dxf'
}, function (err, svg) {
    if(err){
        throw new Error('SVG file not found or invalid');
    }
    
    // your converted svg
});
```


## Contrbute

+    Fork the repo
+    create a branch git checkout -b my_branch
+    Add your changes
+    Commit your changes: git commit -am "Added some awesome stuff"
+    Push your branch: git push origin my_branch
+    Make a pull request to development branch

