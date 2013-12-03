svgutils
========

Svg Utils for pasing SVGFile and manipulate Matrix object like Snap.svg

[![Build Status](https://travis-ci.org/throrin19/svgutils.png?branch=master)](https://travis-ci.org/throrin19/svgutils)

## Requirements

### NodeJS

Required version : 0.10.22

### PhantomJS

This library require phantomJS. You can get instruction to install in their weibsite.

For Ubuntu, this is the installation instruction :

```
sudo apt-get install phantomjs
sudo apt-get install xvfb xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic
```

For MacOSX :

```
brew update && brew install phantomjs
```

## Usage

With SVGUtils you can :

+   Convert SVG Document to JSON
+   Convert JSON to SVG Document
+   Manipulate Svg
+   Use Matrix to SVG or elements
+   ...

### Loading SVG file

```
var Svg = require('svgutils').Svg;


Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    // ...
});
```

### Convert SVG file to JSON

```
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

```
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

```
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

## Contrbute

+    Fork the repo
+    create a branch git checkout -b my_branch
+    Add your changes
+    Commit your changes: git commit -am "Added some awesome stuff"
+    Push your branch: git push origin my_branch
+    Make a pull request to development branch


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/throrin19/svgutils/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

