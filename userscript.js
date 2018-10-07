const LINE_CLASS = 'line-numbers';
var projectPath = '/home/ivan/projects/cmplat/';

function getFilePath(diffElement){
    console.log(diffElement);
    var path = diffElement.querySelector('.heading').querySelector('.filename').innerHTML.match('\n?.*\n *\n')[0].trim();
    if(~path.indexOf("{")){
        var pathPart = path.substring(0, path.indexOf("{")).trim();
        var filePart = path.match('→\ (.*)\ }')[1].trim();

        path = pathPart + filePart
    }

    return path;
}

function generateUrl(filePath, lineNumber) {
    return "phpstorm://open?url=file://"+projectPath+filePath+"&line="+lineNumber;
}

setTimeout(function(){
    document.getElementById('changeset-diff').addEventListener('click', function(event){
        if(LINE_CLASS === event.target.className) {
            var lineElement = event.target;
            console.log('right href');
            var lineNumber = lineElement.getAttribute('data-tnum');
            if(null === lineNumber) {
                lineNumber = lineElement.getAttribute('data-fnum');
            }
            console.log(lineNumber);

            var diffElement = lineElement.closest('.diff-container');
            var filePath = getFilePath(diffElement);
            console.log(filePath);

            event.target.href = generateUrl(filePath, lineNumber);
        }
    });
}, 5000);