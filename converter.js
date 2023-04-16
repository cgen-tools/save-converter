
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

const id_fields = [
    'parent1',
    'parent2',
    'ID',
    'mate',
    'mentor'
]

const tortie_map = {
    'ONE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDONE'
    },
    'TWO': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTWO'
    },
    'FADEDONE': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDONE'
    },
    'FADEDTWO': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTWO'
    },
    'BLUEONE': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALEONE'
    },
    'BLUETWO': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALETWO'
    }
}

const calico_map = {
    'ONE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTHREE'
    },
    'TWO': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDFOUR'
    },
    'THREE': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDTHREE'
    },
    'FOUR': {
        'tortie_base': 'single',
        'tortie_color': 'BLACK',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDFOUR'
    },
    'FADEDONE': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDTHREE'
    },
    'FADEDTWO': {
        'tortie_base': 'single',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'GOLDFOUR'
    },
    'FADEDTHREE': {
        'tortie_base': 'tabby',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDTHREE'
    },
    'FADEDFOUR': {
        'tortie_base': 'tabby',
        'tortie_color': 'BROWN',
        'tortie_pattern': 'tortietabby',
        'pattern': 'GOLDFOUR'
    },
    'BLUEONE': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALETHREE'
    },
    'BLUETWO': {
        'tortie_base': 'single',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortiesolid',
        'pattern': 'PALEFOUR'
    },
    'BLUETHREE': {
        'tortie_base': 'tabby',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortietabby',
        'pattern': 'PALETHREE'
    },
    'BLUEFOUR': {
        'tortie_base': 'tabby',
        'tortie_color': 'SILVER',
        'tortie_pattern': 'tortietabby',
        'pattern': 'PALEFOUR'
    }
}

const file_input = document.getElementById('file-input');
const download_button = document.getElementById('download-button');
function readCsvSave(csvTxt) {
    
    var catData = [];
    var rows = csvTxt.split('\n');
    var wrongColumnAmount = false;

    rows.forEach(row => {
        // skip empty rows
        if (row == null || row.trim() === ''){
            return;
        }
        var columns = row.split(',');
        var cat = {}
        if (columns.length != csvFormat.length) {
            wrongColumnAmount = true;
        }
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            column = column.trim();
            if (column == 'None') {
                column = null;
            } else if ('true'.localeCompare(column, undefined, { sensitivity: 'accent' }) === 0) {
                column = true;
            } else if ('false'.localeCompare(column, undefined, { sensitivity: 'accent' }) === 0) {
                column = false;
            } else if (!isNaN(column)) {
                column = Number(column);
            }
            cat[csvFormat[i]] = column;
        }

        cat.current_apprentice = cat.current_apprentice === null ? []: cat.current_apprentice.toString().split(';');
        cat.former_apprentices = cat.former_apprentices === null ? []: cat.former_apprentices.toString().split(';');
        catData.push(cat);
    });
    if (wrongColumnAmount == true) {
        alert('WARNING: File does not seem to be in the Clangen Aug 10 save format. Conversion may not work.')
    }
    return catData;
}

function addMissingData(catData) {
    catData.forEach(cat => {
        var split_name = cat.name.split(':');
        cat.name_prefix = split_name[0];
        cat.name_suffix = split_name[1] === '' ? null: split_name[1];

        delete cat.name;
        delete cat.NULL;

        id_fields.forEach(id_field => {
            if (cat[id_field] !== null) {
                cat[id_field] = cat[id_field].toString();
            }
        });

        cat.gender_align = cat.gender;
        cat.paralyzed = false;
        cat.no_kits = false;
        cat.exiled = false;

        if (cat.pelt_name === 'Tortie') {
            var tortie_vars = tortie_map[cat.pattern];
        } else if (cat.pelt_name === 'Calico') {
            var tortie_vars = calico_map[cat.pattern];
        } else {
            var tortie_vars = {
                'tortie_base': null,
                'tortie_color': null,
                'tortie_pattern': null,
            }
        }
        cat = Object.assign(cat, tortie_vars);

        cat.spirit_young_adult = cat.spirit_adult;
        cat.spirit_senior_adult = cat.spirit_adult;
        cat.accessory = null;

        // corresponding to apr release
        if (cat.trait === 'clever') {
            cat.trait = 'wise';
        }
        if (cat.white_patches) {
            cat.white_patches = cat.white_patches.replace('ANY2', 'ANYTWO');
            cat.white_patches = cat.white_patches.replace('CREAMY', '');
        }
        if (cat.age === 'elder') {
            cat.age = 'senior';
        }
        cat.eye_colour2 = cat.eye_colour;
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
        try {
            var catData = readCsvSave(e.target.result);
            catData = addMissingData(catData);
            save('clan_cats.json', JSON.stringify(catData, null, 4));
        } catch(err) {
            console.error(err.message)
            alert('ERROR: Save conversion failed.');
        }
    }
    reader.readAsText(file);
}

function onUpload() {
    const file = file_input.files[0];
    if (!file) {
        download_button.setAttribute('disabled', true);
        return;
    }
    if (!file.name.endsWith('.csv')) {
        alert('WARNING: Save file does not seem to be a .csv file.')
    }

    download_button.removeAttribute('disabled');
}

file_input.addEventListener('change', onUpload, false);
download_button.addEventListener('click', onClick, false);
