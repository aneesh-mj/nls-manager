const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra');
const bodyParser = require('body-parser');
const translate = require('@vitalets/google-translate-api');
const beautify = require('js-beautify').js
const utf8 = require('utf8');

const app = express();

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT}, ${process.argv.slice(2)}!`));

app.use(express.static('dist'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.get('/api/getUsername', (req, res) => res.send({
    username: os.userInfo().username
}));

app.get('/api/files', function (req, res) {
    res.json(mapObj);
});

app.get('/api/langs', function (req, res) {
    res.json(Object.keys(langs));
});

app.get('/api/pluginRepo', function (req, res) {
    const basePluginPath = path.join(__dirname, '../../../').substr(1).slice(0, -1);
    res.json({
        repo: basePluginPath.split('/').pop()
    });
});

app.post('/api/createNewKey', (req, res) => {
    const key = req.body.nlskey
    const val = req.body.val;
    const modules = req.body.modules;
    const modulesToSend = { ...modules };
    const selectedFilePath = req.body.selectedFilePath;

    const langs = Object.keys(modules);
    console.log("langslangs", langs);

    const filesToWrite = generateFilePaths(langs, selectedFilePath);

    translateTexts(val, langs).then(resp => {
        langs.map((lang, i) => {
            //console.log("respresp", resp[i].text,  modules[lang]);
            modules[lang][key] = resp[i].text;
            modulesToSend[lang][key] = resp[i].text;
            if (modulesToSend[lang]['default']) {
                modulesToSend[lang]['default'][key] = resp[i].text;
            }
        })

        writeToFiles(filesToWrite, modules, langs);

        // console.log("translated", modules.zh[key]);
        res.json(formatJsonResponse(modules));
    });

    // console.log(req.body);
    // res.json(formatJsonResponse({ data: { key, val, selectedFilePath } }));
    // console.log(path.join(__dirname, '../App.js'));
    // console.log('/Users/anej/dev/DNACenter/mashup/nls-manager/src/App.js');


    // fs.readFile(path.join(__dirname, '../App.js'), function (err, data) {
    //     // var json = JSON.parse(data);

    //     //console.log(data);
    //     // json.push('search result: ' + currentSearchResult)

    //     // fs.writeFile("results.json", JSON.stringify(json))
    // })
});

const generateFilePaths = (langs, filepath) => {
    const newPathObj = {};
    langs.map(lang => {
        if (lang === "en") {
            newPathObj.en = filepath;
        }
        else {
            const regex = new RegExp('/nls/');
            newPathObj[lang] = filepath.replace(regex, `/nls/${lang}/`);
        }
    });
    return newPathObj;
}

const writeToFile = (filepath, data, lang, langs) => {
    //console.log("lang from writeToFile", lang);
    //console.log('/Users/anej/dev/DNACenter/mashup/nls-manager/src/mashup/ui-plugins/design/app/design/src/nls/zh/i18_design.js');
    let _filepath = path.join(__dirname, `.${filepath}`);
    let _data_start = 'define(';
    let _data_end = ');';
    let _data = { ...data };
    console.log("check lang", lang);
    if (lang === "en") {
        _data_start = `define({'root':`;
        const _data_end_arr = [];
        langs.map(l => {
            if (l !== 'en') {
                _data_end_arr.push(`'${l}': true`);
            }
        });
        _data_end = `,${_data_end_arr.join(',')}})`;
        console.log("_data_end", _data_end);
    }
    else {
        delete _data.default;
    }
    let dataString = `${_data_start}${JSON.stringify(_data)}${_data_end}`;

    dataString = beautify(dataString, { indent_size: 2, space_in_empty_paren: true });

    //if (lang === "en") {
    // console.log("--------------------------------------------------------------------------------------------------------");
    // console.log(dataString);
    // }

    return new Promise((resolve, reject) => {
        fs.exists(_filepath, function (exists) {
            console.log("exists", _filepath, exists);
            if (exists) {
                fs.writeFile(_filepath, dataString, function (err) {
                    if (err) {
                        return console.log("Error writing file: " + err);
                    }
                });
            }
            else {

            }
            resolve(resolve);
        });
    });
}

const writeToFiles = (filepaths, data, langs) => {
    //console.log("langs from writeToFiles", langs);
    const arr = [];
    Object.keys(filepaths).map(lang => {
        const p = filepaths[lang];
        const d = data[lang];
        arr.push(writeToFile(p, d, lang, langs));
    });

    return Promise.all(arr);
}

// translate('Ik spreek Engels', {to: 'en'}).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });

const translateTexts = (txt, langs) => {
    const arr = [];
    langs.map(lang => {
        if (lang === 'zh') {
            lang = 'zh-CN';
        }
        arr.push(translate(txt, { from: 'en', to: lang }));
        /*
        let translatedTxt = translate(txt, { from: 'en', to: lang });
        console.log("translatedTxt", utf8.decode(translatedTxt));
        arr.push(utf8.encode(translatedTxt));*/
    });
    // 
    return Promise.all(arr);
}


const selectedFilePath = "./mashup/ui-plugins/design/app/design/src/nls/i18_design.js";

// require(['../mashup/ui-plugins/design/app/design/src/nls/i18_design'],
//     function (foo) {
//         //foo and bar are loaded according to requirejs
//         //config, but if not found, then node's require
//         //is used to load the module.
//         console.log("foofoofoo", foo);
//     });

// fs.exists(path.join(__dirname, '../App.js'), function (exists) {
//     console.log("exists", exists);
// });

function formatJsonResponse(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function addKey(filepath, key, value) {

}

let mapObj = {};
let files = [];
let langs = {};
function filewalker(dir, done) {
    // console.log("filewalkerfilewalkerfilewalker");
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }

        var pending = list.length;

        if (!pending) {
            return done(null, mapObj);
        }

        list.forEach(function (file) {
            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    // console.log("filename", path.basename(path.dirname(file)));
                    // if (path.basename(path.dirname(file)).indexOf("i18") !== -1) {
                    //     console.log("......", file);
                    // }
                    results.push(file);
                    filewalker(file, function (err, res) {
                        // if (path.basename(path.dirname(file)).indexOf("i18") !== -1) {
                        //     console.log("......", file);
                        // }
                        results = results.concat(res);
                        if (!--pending) {
                            done(null, mapObj);
                        }
                    });
                } else {
                    if (path.basename(file).indexOf("i18") !== -1) {
                        const fullPAth = path.dirname(file);
                        let relPath = path.relative(process.cwd(), fullPAth);
                        const fileName = path.basename(file);
                        const uiPluginPath = path.resolve("../mashup/ui-plugins/");
                        //const plugin = fullPAth.replace(uiPluginPath + '/', '').split(path.sep)[0];
                        const plugin = relPath.split(path.sep)[2];
                        const language = path.basename(path.dirname(file));
                        // console.log("fullPAth", fullPAth);
                        // console.log("fileName", fileName);
                        //console.log("uiPluginPath", uiPluginPath);
                        // console.log("plugin", plugin);
                        //console.log("language", language);
                        // console.log("relative", relPath );

                        //  console.log("relative2", relPath.replace(new RegExp('../'), ''));

                        // console.log(path.basename(path.join(__dirname, `../../../`))); // PLUGIN DIRECTORY LIKE Mashup

                        //relPath = relPath.replace(new RegExp('../'), ''); // TO DO: NEED GENERIC

                        relPath = `./${path.basename(path.join(__dirname, '../../../'))}${relPath.replace(new RegExp('../'), '/')}`;

                        // console.log(process.cwd());
                        if (language !== plugin && language !== "nls") {
                            langs[language] = 1;
                        }



                        if (!mapObj[plugin]) {
                            mapObj[plugin] = {};
                        }
                        if (!mapObj[plugin][language]) {
                            mapObj[plugin][language] = [];
                        }
                        mapObj[plugin][language].push(`${relPath}/${fileName}`);
                        //console.log(mapObj[plugin][language]);

                        files.push(`${relPath}/${fileName}`);
                    }
                    results.push(file);

                    if (!--pending) {
                        done(null, mapObj);
                    }
                }
            });
        });
    });
};

/*filewalker(path.join(__dirname, '../../../mashup/ui-plugins'), function (err, result) { //path.join(__dirname, '../test/'
    if (err) {
        console.log(err);
        return {};
    }
    // console.log(result)

    // fsx.copy(result.design.nls[0], './conf')
    //     .then(() => console.log('success!'))
    //     .catch(err => console.error(err))

    // const nls = Object.keys(result).filter(key => {
    //     return
    // });
    console.log(path.join(__dirname, `../../${result.design.nls[0]}`));
    console.log(path.join(__dirname, `./temp`));
    // ncp(path.join('/Users/anej/dev/DNACenter/mashup/ui-plugins/design/app/design/src/nls/i18_design.js'), path.join(__dirname, './temp'), function(err){
    //     if(err){
    //       console.log(err);
    //     } else {
    //       console.log('ok');
    //     }
    //   });

    //fsx.copy(path.join(__dirname, `../../${result.design.nls[0]}`), path.join(__dirname, './temp/test'));
    // fsx.ensureDirSync(path.join(__dirname, './temp/test'));    
    // fs.copyFile(path.join(__dirname, `../../${result.design.nls[0]}`), path.join(__dirname, `./temp/test/${result.design.nls[0].split('/').pop()}`), (err) => {
    //     if (err) throw err;
    //     console.log('source.txt was copied to destination.txt');
    // });

    return result;
});*/


function copyNlsFiles() {
    return new Promise((resolve, reject) => {
        const map = filewalker(path.join(__dirname, '../../../ui-plugins'), function (err, result) {
            if (err) {
                console.log(err);
                resolve({});
            }
            resolve(result);
        });
    });
}

copyNlsFiles().then((result) => {
    // console.log(files);
    files.map(file => {
        const fileName = file.split('/').pop();
        var myRegExp = new RegExp(`/${fileName}`);
        const folder = file.replace(myRegExp, '');
        fsx.ensureDirSync(path.join(__dirname, `../${folder}`));
        //console.log(fileName, folder);
        // console.log(path.join(__dirname, `../../../../${file}`));
        fs.copyFile(path.join(__dirname, `../../../../${file}`), path.join(__dirname, `../${folder}/${fileName}`), (err) => {
            if (err) throw err;
            // console.log('source.txt was copied to destination.txt');
        });
    });
});