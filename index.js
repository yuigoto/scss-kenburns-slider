/**
 * KEN BURNS SLIDER : Index
 * ======================================================================
 * Serves the slider.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @version     0.0.1
 */

// Load libraries
const async     = require("async");
const copy      = require("copy");
const express   = require("express");
const fs        = require("fs");
const node_sass = require("node-sass");
const path      = require("path");
const rimraf    = require("rimraf");

// Start app
const app       = express();

// Define port and mode
const app_port  = process.env.PORT || 3000;
const app_env   = process.env.NODE_ENV || "development";

// Execute everything using async ;)
async.series(
    [
        (callback) => {
            rimraf("build/", (err) => {
                callback(err, (err) ? false : true);
            });
        },
        // Copy static content to build
        (callback) => {
            copy(
                "static/**/*",
                "build",
                (err, files) => {
                    callback(err, files)
                }
            );
        },
        // Copy assets to build
        (callback) => {
            copy(
                "assets/**/*",
                "build/assets",
                (err, files) => {
                    callback(err, files)
                }
            );
        },
        // Transpile SCSS files
        (callback) => {
            node_sass.render(
                {
                    file: "src/main.scss",
                    outFile: "build/kenburns.css",
                    outputStyle: "compressed",
                    precision: 8,
                    sourceMap: true
                },
                (err, result) => {
                    // Write CSS and sourcemap
                    fs.writeFile(
                        "build/kenburns.css",
                        result.css.toString(),
                        (err) => {
                            if (err) {
                                console.log("Could not save CSS file.");
                            }
                        }
                    );
                    fs.writeFile(
                        "build/kenburns.map.css",
                        result.map.toString(),
                        (err) => {
                            if (err) {
                                console.log("Could not save Source Map.");
                            }
                        }
                    );

                    // Async callback
                    callback(err, result);
                }
            );
        },
        // Serve it!
        (callback) => {
            // Public static serve
            app.use("/", express.static("build"));

            // Serve index
            app.use("/", (req, res) => {
                res.sendFile(
                    path.resolve(__dirname, "build", "index.html")
                );
            });

            // Serve on port
            app.listen(
                app_port,
                (err) => {
                    // Logs output
                    if (err) {
                        console.log("Error while serving the project.");
                        throw err;
                    } else {
                        console.log(
                            "\x1b[36m---------------------------------------------------------"
                        );

                        console.log(
                            "\x1b[37m[KEN BURNS SLIDER]: Serving project at: http://localhost:" + app_port
                        );

                        console.log(
                            "\x1b[36m[KEN BURNS SLIDER]: Watching `assets` and `static`."
                        );

                        console.log(
                            "\x1b[33m[KEN BURNS SLIDER]: Type `rs` and then ENTER to restart\n" +
                            "\x1b[33m[KEN BURNS SLIDER]: Press CTRL + C to finish this process"
                        );

                        console.log(
                            "\x1b[36m[KEN BURNS SLIDER]: Write your thing and be happy! ;)"
                        );

                        console.log(
                            "\x1b[36m---------------------------------------------------------\x1b[0m"
                        );
                    }
                }
            );
        }
    ], 
    (err, res) => {
        // Throw error
        if (err) {
            console.log(err);
            throw(err);
        }

        // Log results
        console.log(res);
    }
);