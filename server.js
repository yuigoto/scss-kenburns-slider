const async     = require("async");
const copy      = require("copy");
const express   = require("express");
const fs        = require("fs");
const node_sass = require("node-sass");
const path      = require("path");
const rimraf    = require("rimraf");

const app       = express();
const app_port  = process.env.PORT || 3000;
const app_env   = process.env.NODE_ENV || "development";

async.series();