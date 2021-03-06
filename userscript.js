
// ==UserScript==
// @name         bitbucket ide linker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fast jump to your ide code line from PR
// @author       Ivan Popov
// @match        https://bitbucket.org/*/pull-requests/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const LINE_CLASS = 'line-numbers';
    const PROJECTS = {
        "cmplat-server": "cmplat"
    };

    var gitProjectName = window.location.pathname.split('/')[2];
    var projectName = PROJECTS[gitProjectName];
    var projectPath = '/home/ipopov/projects/'+ projectName+'/' ;

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
})();
