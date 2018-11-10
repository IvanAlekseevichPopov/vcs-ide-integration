// Adds new mapping row
$('#addMapping').click(function (event) {
    event.preventDefault();

    let newRow = $('#newMappingRow').clone();
    newRow.attr('id', null);

    newRow.insertBefore(this);
});

$('.container').on('click', '.deleteMapping', function (event) {
    event.preventDefault();

    $(this).closest('.form-row').remove(); //TODO do not delete last row
});

$('#options').submit(function (event) {
    event.preventDefault();

    let mappedProjects = grabMappedProjects(this);
    let applicationUri = grabApplicationUri(this);
    console.log(mappedProjects);
    console.log(applicationUri);

    chrome.storage.local.set({
        mappedProjects: mappedProjects,
        applicationUri: applicationUri
    }, function () {
        alert('saved'); //TODO replace alert
    });


});

function grabMappedProjects(form) {
    var mappedProjects = [];
    var singleMapping = {
        projectName: null,
        projectPath: null
    };

    $(form).serializeArray().forEach(function (item) {
        console.log(item);

        if ('uri' !== item.name) {
            singleMapping[item.name] = item.value;
        }

        if (singleMapping.projectName !== null && singleMapping.projectPath !== null) {
            mappedProjects.push(Object.assign({}, singleMapping));

            singleMapping.projectPath = null;
            singleMapping.projectName = null;
        }
    });

    return mappedProjects;
}

function grabApplicationUri(form) {
    let rawUri = $(form).find('#applicationUri').val();
    let datalist = document.getElementById('application_urls');

    for (let i = 0; i < datalist.options.length; i++) {
        if(datalist.options[i].value === rawUri) {
            return datalist.options[i].label;
        }
    }

    return rawUri;
}

// Restore from chrome vault
function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get(['applicationUri', 'mappedProjects'],
        function (options) {
            console.log(options);
            $('#applicationUri').val(options.applicationUri);

            if(Array.isArray(options.mappedProjects)) {
                let template = $('#newMappingRow');

                options.mappedProjects.forEach(function (project) {
                    // console.log(project);
                    let newRow = template.clone();
                    newRow.attr('id', null);
                    newRow.insertBefore(template);

                    newRow.find('input[name="projectName"]').first().val(project.projectName);
                    newRow.find('input[name="projectPath"]').first().val(project.projectPath); //TODO move row template into js. Clone does not work if delete all or base row
                });
            }
        });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
