var fs = require('fs');

var includes = {
  '{{include html/head.html}}': 'html/head.html',
  '{{include html/foot.html}}': 'html/foot.html'
};

function parseHtml(htmlcontent, vars, callback) {
}

exports.parseHtml = parseHtml;
