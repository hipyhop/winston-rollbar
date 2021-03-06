"use strict";
/**
* winston-rollbar.js: Transport for outputting logs to Rollbar service
*/
var util = require("util");
var Rollbar = require("rollbar");
var winston = require("winston");

var winston2rollbar_levels = {
  debug: "debug",
  verbose: "info",
  info: "info",
  warn: "warning",
  error: "error",
};

/**
* @constructs Rollbar
* @param {object} options hash of options
*/
var Transport = exports.Rollbar = function (options) {
  options = options || {};

  if (!options.rollbarAccessToken) {
    throw "winston-transport-rollbar requires a 'rollbarAccessToken' property";
  }

  var opts = { accessToken: options.rollbarAccessToken };
  if (options.rollbarConfig) {
    Object.assign(opts, options.rollbarConfig);
  }

  this.rollbar = new Rollbar(opts);

  this.name    = "rollbar";
  this.level   = options.level || "warn";
  this.silent  = options.silent || false; // Disbale rollbar reporting
};

/** @extends winston.Transport */
util.inherits(Transport, winston.Transport);

/**
* Define a getter so that `winston.transports.Rollbar`
* is available and thus backwards compatible.
*/
winston.transports.Rollbar = Transport;

/**
* Core logging method exposed to Winston. Metadata is optional.
* @function log
* @member Rollbar
* @param level {string} Level at which to log the message
* @param msg {string} Message to log
* @param meta {Object} **Optional** Additional metadata to attach
* @param callback {function} Continuation to respond to when complete
*/
Transport.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var lvl = winston2rollbar_levels[level];
  if (!lvl) {
    // Skipping due to no level found.
    winston.info("No rollbar level found for winston report level %s", level);
    return callback(null, true);
  }

  if (!meta) {
    meta = {};
  }
  if (typeof meta === "string") {
    meta = { message: meta };
  }

  var req;
  if (meta.request) {
    req = meta.request;
    delete meta.request;
  }

  this.rollbar.configure({ logLevel: lvl });
  this.rollbar.log(msg, req, meta, (err) => {
    if (err) {
      return callback(err);
    }
    callback(null, true);
  });
};
