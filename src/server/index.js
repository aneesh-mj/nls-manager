const express = require('express');
const os = require('os');
const path = require('path');
var fs = require('fs');

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
function filewalker(dir, done) {
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
                        const relPath = path.relative(process.cwd(), fullPAth);
                        const fileName = path.basename(file);
                        const uiPluginPath = path.resolve("../mashup/ui-plugins/");
                        const plugin = fullPAth.replace(uiPluginPath + '/', '').split(path.sep)[0];
                        const language = path.basename(path.dirname(file));
                        // console.log("fullPAth", fullPAth);
                        // console.log("fileName", fileName);
                        // console.log("uiPluginPath", uiPluginPath);
                        // console.log("plugin", plugin);
                        // console.log("language", language);
                        // console.log("relative", relPath );
                        if (!mapObj[plugin]) {
                            mapObj[plugin] = {};
                        }
                        if (!mapObj[plugin][language]) {
                            mapObj[plugin][language] = [];
                        }
                        mapObj[plugin][language].push(`${relPath}/${fileName}`);
                        //console.log(mapObj[plugin][language]);
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

filewalker(path.join(__dirname, '../../../mashup/ui-plugins'), function (err, result) { //path.join(__dirname, '../test/'
    if (err) {
        console.log(err);
        return {};
    }
    //console.log(result)
    return result;
});

