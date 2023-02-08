const fs = require('fs');
const path = require('path');
const escape = require('escape-html');
const txml = require('txml');
const xmlJs = require('xml-js');
const xml2js = require('xml2js');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");


const dir = './dist';

const xml = `
<?xml version="1.0"?>
<?xml-stylesheet href="catalog.xsl" type="text/xsl"?>
<!DOCTYPE catalog SYSTEM "catalog.dtd">
<catalog>
   <product description="Cardigan Sweater" product_image="cardigan.jpg">
      <catalog_item gender="Men's">
         <item_number>QWZ5671</item_number>
         <price>39.95</price>
         <size description="Medium">
            <color_swatch image="red_cardigan.jpg">Red</color_swatch>
            <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>
         </size>
         <size description="Large">
            <color_swatch image="red_cardigan.jpg">Red</color_swatch>
            <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>
         </size>
      </catalog_item>
      <catalog_item gender="Women's">
         <item_number>RRX9856</item_number>
         <price>42.50</price>
         <size description="Small">
            <color_swatch image="red_cardigan.jpg">Red</color_swatch>
            <color_swatch image="navy_cardigan.jpg">Navy</color_swatch>
            <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>
         </size>
         <size description="Medium">
            <color_swatch image="red_cardigan.jpg">Red</color_swatch>
            <color_swatch image="navy_cardigan.jpg">Navy</color_swatch>
            <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>
            <color_swatch image="black_cardigan.jpg">Black</color_swatch>
         </size>
         <size description="Large">
            <color_swatch image="navy_cardigan.jpg">Navy</color_swatch>
            <color_swatch image="black_cardigan.jpg">Black</color_swatch>
         </size>
         <size description="Extra Large">
            <color_swatch image="burgundy_cardigan.jpg">Burgundy</color_swatch>
            <color_swatch image="black_cardigan.jpg">Black</color_swatch>
         </size>
      </catalog_item>
   </product>
</catalog>
`

const template = fs.readFileSync('./template.html', 'utf8');

// https://stackoverflow.com/questions/288368/javascript-non-regex-replace
function safeReplace (str, replace, replaceWith) {
  return str.split(replace).join(replaceWith);
}

function write(subtitle, fileName, code, links) {
  if (typeof code === 'object') {
    code = JSON.stringify(code, null, 2);
  }

  let html = safeReplace(template, '{{{LINKS}}}', links);
  html = safeReplace(html, '{{{CODE}}}', escape(code).trim());
  html = safeReplace(html, '{{{SUBTITLE}}}', subtitle);
  fs.writeFileSync(path.join(dir, fileName), html);
}

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let xml2jsResult;
xml2js.parseString(xml, (err, result) =>{
  xml2jsResult = result;
});

const fastXmlParser = new XMLParser({ignoreAttributes: false});

const paths = [
  ['Example XML', 'index.html', xml],
  ['tXml', 'txml.html', txml.parse(xml)],
  ['tXml Simplified', 'txml-simplified.html', txml.simplify(txml.parse(xml))],
  ['xml-js', 'xml-js.html', xmlJs.xml2json(xml, {compact: false, spaces: 2})],
  ['xml-js Compact', 'xml-js-compact.html', xmlJs.xml2json(xml, {compact: true, spaces: 2})],
  ['fast-xml-parser w/o ignoreAttributes', 'fast-xml-parser.html', fastXmlParser.parse(xml)],
  ['xml2js', 'xml2js.html', xml2jsResult]
];

const links = paths.map(path => `<a href="${path[1]}">${path[0]}</a>`).join(' ');

paths.forEach(path => {
  write(path[0], path[1], path[2], links);
});
