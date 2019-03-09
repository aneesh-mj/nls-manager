const express = require('express');
const os = require('os');
const path = require('path');
var fs = require('fs');
const fsx = require('fs-extra');

// var ncp = require('ncp').ncp;

const app = express();

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT}, ${process.argv.slice(2)}!`));

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({
    username: os.userInfo().username
}));

app.get('/api/files', function (req, res) {
    res.json(mapObj);
});



let mapObj = {};
let files = [];
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
                        // console.log("language", language);
                        // console.log("relative", relPath );

                        //  console.log("relative2", relPath.replace(new RegExp('../'), ''));

                        console.log(path.basename(path.join(__dirname, `../../../`))); // PLUGIN DIRECTORY LIKE Mashup

                        //relPath = relPath.replace(new RegExp('../'), ''); // TO DO: NEED GENERIC

                        relPath = `./${path.basename(path.join(__dirname, '../../../'))}${relPath.replace(new RegExp('../'), '/')}`;

                        // console.log(process.cwd());

                        

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
    console.log(mapObj);
    /*files.map(file => {
        const fileName = file.split('/').pop();
        var myRegExp = new RegExp(`/${fileName}`);
        const folder = file.replace(myRegExp, '');
        fsx.ensureDirSync(path.join(__dirname, `./temp/${folder}`));
        console.log(fileName, folder);
        fs.copyFile(path.join(__dirname, `../../${file}`), path.join(__dirname, `./temp/${folder}/${fileName}`), (err) => {
            if (err) throw err;
            console.log('source.txt was copied to destination.txt');
        });
    });*/
});