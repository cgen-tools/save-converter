
var csvFormat = [
    'ID',
    'name',
    'gender',
    'status',
    'age',
    'trait',
    'parent1',
    'parent2',
    'mentor',
    'pelt_name',
    'pelt_color',
    'pelt_white',
    'pelt_length',
    'spirit_kitten',
    'spirit_adolescent',
    'spirit_adult',
    'spirit_elder',
    'eye_colour',
    'reverse',
    'white_patches',
    'pattern',
    'skin',
    'skill',
    'NULL',
    'specialty',
    'moons',
    'mate',
    'dead',
    'spirit_dead',
    'specialty2',
    'experience',
    'dead_moons',
    'current_apprentice',
    'former_apprentices',
];

const file_input = document.getElementById('file-input');
const download_button = document.getElementById('download-button');
function readCsvSave(csvTxt) {
    
    var catData = [];
    var rows = csvTxt.split('\n');

    rows.forEach(row => {
        var columns = row.split(',');
        var cat = {}

        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            column = column.trim();
            if (column == 'None') {
                column = null;
            } else if (column == 'True') {
                column = true;
            } else if (column == 'False') {
                column = false;
            } else if (!isNaN(column)) {
                column = Number(column);
            }
            cat[csvFormat[i]] = column;
        }

        cat.current_apprentice = cat.current_apprentice == null ? []: cat.current_apprentice.toString().split(';');
        cat.former_apprentices = cat.former_apprentices == null ? []: cat.former_apprentices.toString().split(';');
        catData.push(cat);
    });
    return catData;
}

function addMissingData(catData) {
    catData.forEach(cat => {
        cat.name_prefix = cat.name.split(':')[0];
        cat.name_suffix = cat.name.split(':')[1];
        delete cat.name;
        delete cat.NULL;

        cat.ID = cat.ID.toString();
        if (cat.mate) {
            cat.mate = cat.mate.toString();
        }
        cat.gender_align = cat.gender;
        cat.paralyzed = false;
        cat.no_kits = false;
        cat.exiled = false;
        cat.tortie_base = null;
        cat.tortie_color = null;
        cat.tortie_pattern = null;

        cat.spirit_young_adult = cat.spirit_adult;
        cat.spirit_senior_adult = cat.spirit_adult;
        cat.accessory = null;

    });
    return catData;
}

function save(filename, data) {
    const elem = window.document.createElement('a');
    const blob = new Blob([data], {type: 'application/json'});
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

function onClick() {
    const file = document.getElementById('file-input').files[0];
    if (!file) {
        return;
    }

    var reader = new FileReader();
    reader.onload = (e) => {
        var catData = readCsvSave(e.target.result);
        catData = addMissingData(catData);
        save('clan_cats.json', JSON.stringify(catData));
    }
    reader.readAsText(file);
}

function onUpload() {
    const file = file_input.files[0];
    if (!file) {
        download_button.setAttribute('disabled', true);
        return;
    }
    download_button.removeAttribute('disabled');
}

file_input.addEventListener('change', onUpload, false);
download_button.addEventListener('click', onClick, false);
