class Config {
    constructor() {
        // super(props);
        let self = this;
        chrome.storage.sync.get(['applicationUri', 'mappedProjects'],
            function (options) {
                console.log(options);
                self.applicationUri = options.applicationUri;

                if (Array.isArray(options.mappedProjects)) {
                    let gitProjectName = window.location.pathname.split('/')[2];
                    options.mappedProjects.forEach(function (project) {
                        console.log(project.projectName);
                        if (project.projectName === gitProjectName) {
                            self.projectPath = project.projectPath;
                        }
                    });
                }
            });
    }

    isValid() {
        return null !== this.projectPath && null !== this.applicationUri;
    }

}

class Listener {
    static get LINE_CLASS() {
        return '.line-numbers';
    }

    static get LINE_NUMBER_ATTRIBUTES() {
        return [
            'data-tnum',
            'data-fnum'
        ];
    }

    static get DIFF_SELECTOR() {
        return '.diff-container';
    }

    constructor(config) {
        this.config = config;
    }

    startListen() {
        let self = this;
        this.listener = $('body').on('click', Listener.LINE_CLASS, function (event) {
            let lineElement = event.target;
            let lineNumber = lineElement.getAttribute(Listener.LINE_NUMBER_ATTRIBUTES[0]);

            if (null === lineNumber) {
                lineNumber = lineElement.getAttribute(Listener.LINE_NUMBER_ATTRIBUTES[1]);
            }
            console.log(lineNumber);

            let diffElement = lineElement.closest(Listener.DIFF_SELECTOR);
            let filePath = self.getFilePath(diffElement);
            console.log(filePath);

            event.target.href = self.generateUrl(filePath, lineNumber);
        });
    }

    stopListen() {
        this.listener.stop();
    }

    getFilePath(diffElement) {
        console.log(diffElement);
        let path = diffElement.querySelector('.heading').querySelector('.filename').innerHTML.match('\n?.*\n *\n')[0].trim();
        if (~path.indexOf("{")) {
            let pathPart = path.substring(0, path.indexOf("{")).trim();
            let filePart = path.match('→\ (.*)\ }')[1].trim();

            path = pathPart + filePart
        }

        return path;
    }

    generateUrl(filePath, lineNumber) {
        return this.config.applicationUri.replace('%f', this.config.projectPath + filePath).replace('%l', lineNumber);
    }
}

let config = new Config();

if (config.isValid()) {
    let listener = new Listener(config);
    listener.startListen();
} else {
    //TODO change icon
    console.log('Have you configured extension?');
}