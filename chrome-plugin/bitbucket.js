const LINE_CLASS = '.line-numbers';

// class Listener {
//     uri
//
//     constructor() {
//         //TODO parse config
//         //TODO set uri
//         //TODO set project path
//     }
//
//     _
// }

// const PROJECTS = {
//     "cmplat-server": "cmplat"
// };

// let gitProjectName = window.location.pathname.split('/')[2];
// let projectName = PROJECTS[gitProjectName];
let projectPath = '';

function getProjectPath() {
    let gitProjectName = window.location.pathname.split('/')[2];
    console.log(gitProjectName);

    chrome.storage.sync.get(['applicationUri', 'mappedProjects'],
        function (options) {
            console.log(options);

            if (Array.isArray(options.mappedProjects)) {

                options.mappedProjects.forEach(function (project) {
                    console.log(project.projectName);
                    if (project.projectName === gitProjectName) {
                        projectPath = project.projectPath;
                        console.log(projectPath);
                    }
                });
            }
        });
}


function getFilePath(diffElement) {
    console.log(diffElement);
    let path = diffElement.querySelector('.heading').querySelector('.filename').innerHTML.match('\n?.*\n *\n')[0].trim();
    if (~path.indexOf("{")) {
        let pathPart = path.substring(0, path.indexOf("{")).trim();
        let filePart = path.match('→\ (.*)\ }')[1].trim();

        path = pathPart + filePart
    }

    return path;
}

function generateUrl(filePath, lineNumber) {
    //TODO get url from config
    return "phpstorm://open?url=file://" + projectPath + filePath + "&line=" + lineNumber;
}

getProjectPath();

$('body').on('click', LINE_CLASS, function (event) {
    // event.preventDefault();

    let lineElement = event.target;
    console.log('right href');
    let lineNumber = lineElement.getAttribute('data-tnum');
    if (null === lineNumber) {
        lineNumber = lineElement.getAttribute('data-fnum');
    }
    console.log(lineNumber);

    let diffElement = lineElement.closest('.diff-container');
    let filePath = getFilePath(diffElement);
    console.log(filePath);

    event.target.href = generateUrl(filePath, lineNumber);


    console.log(this);
});
