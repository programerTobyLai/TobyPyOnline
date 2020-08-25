/**
 * Base namespace for Skulpt. This is the only symbol that Skulpt adds to the
 * global namespace. Other user accessible symbols are noted and described
 * below.
 */

var Sk = Sk || {}; //jshint ignore:line

/**
 *
 * Set various customizable parts of Skulpt.
 *
 * output: Replacable output redirection (called from print, etc.).
 * read: Replacable function to load modules with (called via import, etc.)
 * sysargv: Setable to emulate arguments to the script. Should be an array of JS
 * strings.
 * syspath: Setable to emulate PYTHONPATH environment variable (for finding
 * modules). Should be an array of JS strings.
 * nonreadopen: Boolean - set to true to allow non-read file operations
 * fileopen: Optional function to call any time a file is opened
 * filewrite: Optional function to call when writing to a file
 *
 * Any variables that aren't set will be left alone.
 */

Sk.bool_check = function(variable, name) {
    if (variable === undefined || variable === null || typeof variable !== "boolean") {
        throw new Error("must specify " + name + " and it must be a boolean");
    }
};

Sk.python2 = {
    print_function: false,
    division: false,
    absolute_import: null,
    unicode_literals: false,
    // skulpt specific
    set_repr: false,
    class_repr: false,
    inherit_from_object: false,
    super_args: false,
    octal_number_literal: false,
    bankers_rounding: false,
    python_version: false,
    dunder_next: false,
    dunder_round: false,
    exceptions: false,
    no_long_type: false,
    ceil_floor_int: false
};

Sk.python3 = {
    print_function: true,
    division: true,
    absolute_import: null,
    unicode_literals: true,
    // skulpt specific
    set_repr: true,
    class_repr: true,
    inherit_from_object: true,
    super_args: true,
    octal_number_literal: true,
    bankers_rounding: true,
    python_version: true,
    dunder_next: true,
    dunder_round: true,
    exceptions: true,
    no_long_type: true,
    ceil_floor_int: true
};

Sk.configure = function (options) {
    "use strict";
    Sk.output = options["output"] || Sk.output;
    goog.asserts.assert(typeof Sk.output === "function");

    Sk.debugout = options["debugout"] || Sk.debugout;
    goog.asserts.assert(typeof Sk.debugout === "function");

    Sk.uncaughtException = options["uncaughtException"] || Sk.uncaughtException;
    goog.asserts.assert(typeof Sk.uncaughtException === "function");

    Sk.read = options["read"] || Sk.read;
    goog.asserts.assert(typeof Sk.read === "function");

    Sk.nonreadopen = options["nonreadopen"] || false;
    goog.asserts.assert(typeof Sk.nonreadopen === "boolean");

    Sk.fileopen = options["fileopen"] || undefined;
    goog.asserts.assert(typeof Sk.fileopen === "function" || typeof Sk.fileopen === "undefined");

    Sk.filewrite = options["filewrite"] || undefined;
    goog.asserts.assert(typeof Sk.filewrite === "function" || typeof Sk.filewrite === "undefined");

    Sk.timeoutMsg = options["timeoutMsg"] || Sk.timeoutMsg;
    goog.asserts.assert(typeof Sk.timeoutMsg === "function");
    goog.exportSymbol("Sk.timeoutMsg", Sk.timeoutMsg);

    Sk.sysargv = options["sysargv"] || Sk.sysargv;
    goog.asserts.assert(goog.isArrayLike(Sk.sysargv));

    Sk.__future__ = options["__future__"] || Sk.python2;

    Sk.bool_check(Sk.__future__.print_function, "Sk.__future__.print_function");
    Sk.bool_check(Sk.__future__.division, "Sk.__future__.division");
    Sk.bool_check(Sk.__future__.unicode_literals, "Sk.__future__.unicode_literals");
    Sk.bool_check(Sk.__future__.set_repr, "Sk.__future__.set_repr");
    Sk.bool_check(Sk.__future__.class_repr, "Sk.__future__.class_repr");
    Sk.bool_check(Sk.__future__.inherit_from_object, "Sk.__future__.inherit_from_object");
    Sk.bool_check(Sk.__future__.super_args, "Sk.__future__.super_args");
    Sk.bool_check(Sk.__future__.octal_number_literal, "Sk.__future__.octal_number_literal");
    Sk.bool_check(Sk.__future__.bankers_rounding, "Sk.__future__.bankers_rounding");
    Sk.bool_check(Sk.__future__.python_version, "Sk.__future__.python_version");
    Sk.bool_check(Sk.__future__.dunder_next, "Sk.__future__.dunder_next");
    Sk.bool_check(Sk.__future__.dunder_round, "Sk.__future__.dunder_round");
    Sk.bool_check(Sk.__future__.exceptions, "Sk.__future__.exceptions");
    Sk.bool_check(Sk.__future__.no_long_type, "Sk.__future__.no_long_type");
    Sk.bool_check(Sk.__future__.ceil_floor_int, "Sk.__future__.ceil_floor_int");

    // in __future__ add checks for absolute_import

    Sk.imageProxy = options["imageProxy"] || "http://localhost:8080/320x";
    goog.asserts.assert(typeof Sk.imageProxy === "string" || typeof Sk.imageProxy === "function");

    Sk.inputfun = options["inputfun"] || Sk.inputfun;
    goog.asserts.assert(typeof Sk.inputfun === "function");

    Sk.inputfunTakesPrompt = options["inputfunTakesPrompt"] || false;
    goog.asserts.assert(typeof Sk.inputfunTakesPrompt === "boolean");

    Sk.retainGlobals = options["retainglobals"] || false;
    goog.asserts.assert(typeof Sk.retainGlobals === "boolean");

    Sk.debugging = options["debugging"] || false;
    goog.asserts.assert(typeof Sk.debugging === "boolean");

    Sk.killableWhile = options["killableWhile"] || false;
    goog.asserts.assert(typeof Sk.killableWhile === "boolean");

    Sk.killableFor = options["killableFor"] || false;
    goog.asserts.assert(typeof Sk.killableFor === "boolean");

    Sk.signals = typeof options["signals"] !== undefined ? options["signals"] : null;
    if (Sk.signals === true) {
        Sk.signals = {
            listeners: [],
            addEventListener: function (handler) {
                Sk.signals.listeners.push(handler);
            },
            removeEventListener: function (handler) {
                var index = Sk.signals.listeners.indexOf(handler);
                if (index >= 0) {
                    Sk.signals.listeners.splice(index, 1); // Remove items
                }
            },
            signal: function (signal, data) {
                for (var i = 0; i < Sk.signals.listeners.length; i++) {
                    Sk.signals.listeners[i].call(null, signal, data);
                }
            }
        };
    } else {
        Sk.signals = null;
    }
    goog.asserts.assert(typeof Sk.signals === "object");

    Sk.breakpoints = options["breakpoints"] || function() { return true; };
    goog.asserts.assert(typeof Sk.breakpoints === "function");

    Sk.setTimeout = options["setTimeout"];
    if (Sk.setTimeout === undefined) {
        if (typeof setTimeout === "function") {
            Sk.setTimeout = function(func, delay) { setTimeout(func, delay); };
        } else {
            Sk.setTimeout = function(func, delay) { func(); };
        }
    }
    goog.asserts.assert(typeof Sk.setTimeout === "function");

    if ("execLimit" in options) {
        Sk.execLimit = options["execLimit"];
    }

    if ("yieldLimit" in options) {
        Sk.yieldLimit = options["yieldLimit"];
    }

    if (options["syspath"]) {
        Sk.syspath = options["syspath"];
        goog.asserts.assert(goog.isArrayLike(Sk.syspath));
        // assume that if we're changing syspath we want to force reimports.
        // not sure how valid this is, perhaps a separate api for that.
        Sk.realsyspath = undefined;
        Sk.sysmodules = new Sk.builtin.dict([]);
    }

    Sk.misceval.softspace_ = false;

    Sk.switch_version("round$", Sk.__future__.dunder_round);
    Sk.switch_version("next$", Sk.__future__.dunder_next);

    Sk.builtin.lng.tp$name = Sk.__future__.no_long_type ? "int" : "long";
};

goog.exportSymbol("Sk.configure", Sk.configure);

/*
* Replaceable handler for uncaught exceptions
*/
Sk.uncaughtException = function(err) {
    throw err;
};

/*
 * Replaceable handler for uncaught exceptions
 */
Sk.uncaughtException = function(err) {
    throw err;
};
goog.exportSymbol("Sk.uncaughtException", Sk.uncaughtException);

/*
 *	Replaceable message for message timeouts
 */
Sk.timeoutMsg = function () {
    return "Program exceeded run time limit.";
};
goog.exportSymbol("Sk.timeoutMsg", Sk.timeoutMsg);

/*
 *  Hard execution timeout, throws an error. Set to null to disable
 */
Sk.execLimit = Number.POSITIVE_INFINITY;

/*
 *  Soft execution timeout, returns a Suspension. Set to null to disable
 */
Sk.yieldLimit = Number.POSITIVE_INFINITY;

/*
 * Replacable output redirection (called from print, etc).
 */
Sk.output = function (x) {
};

/*
 * Replacable function to load modules with (called via import, etc.)
 * todo; this should be an async api
 */
Sk.read = function (x) {
    throw "Sk.read has not been implemented";
};

/*
 * Setable to emulate arguments to the script. Should be array of JS strings.
 */
Sk.sysargv = [];

// lame function for sys module
Sk.getSysArgv = function () {
    return Sk.sysargv;
};
goog.exportSymbol("Sk.getSysArgv", Sk.getSysArgv);


/**
 * Setable to emulate PYTHONPATH environment variable (for finding modules).
 * Should be an array of JS strings.
 */
Sk.syspath = [];

Sk.inBrowser = goog.global["document"] !== undefined;

/**
 * Internal function used for debug output.
 * @param {...} args
 */
Sk.debugout = function (args) {
};

(function () {
    // set up some sane defaults based on availability
    if (goog.global["write"] !== undefined) {
        Sk.output = goog.global["write"];
    } else if (goog.global["console"] !== undefined && goog.global["console"]["log"] !== undefined) {
        Sk.output = function (x) {
            goog.global["console"]["log"](x);
        };
    } else if (goog.global["print"] !== undefined) {
        Sk.output = goog.global["print"];
    }
    if (goog.global["print"] !== undefined) {
        Sk.debugout = goog.global["print"];
    }
}());

// override for closure to load stuff from the command line.
if (!Sk.inBrowser) {
    goog.global.CLOSURE_IMPORT_SCRIPT = function (src) {
        goog.global["eval"](goog.global["read"]("support/closure-library/closure/goog/" + src));
        return true;
    };
}

Sk.inputfun = function (args) {
    return window.prompt(args);
};

// Information about method names and their internal functions for
// methods that differ (in visibility or name) between Python 2 and 3.
//
// Format:
//   internal function: {
//     "classes" : <array of affected classes>,
//     2 : <visible Python 2 method name> or null if none
//     3 : <visible Python 3 method name> or null if none
//   },
//   ...

Sk.setup_method_mappings = function () {
    return {
        "round$": {
            "classes": [Sk.builtin.float_,
                        Sk.builtin.int_,
                        Sk.builtin.nmber],
            2: null,
            3: "__round__"
        },
        "next$": {
            "classes": [Sk.builtin.dict_iter_,
                        Sk.builtin.list_iter_,
                        Sk.builtin.set_iter_,
                        Sk.builtin.str_iter_,
                        Sk.builtin.tuple_iter_,
                        Sk.builtin.generator,
                        Sk.builtin.enumerate,
                        Sk.builtin.iterator],
            2: "next",
            3: "__next__"
        }
    };
};

Sk.switch_version = function (method_to_map, python3) {
    var mapping, klass, classes, idx, len, newmeth, oldmeth, mappings;

    mappings = Sk.setup_method_mappings();

    mapping = mappings[method_to_map];

    if (python3) {
        newmeth = mapping[3];
        oldmeth = mapping[2];
    } else {
        newmeth = mapping[2];
        oldmeth = mapping[3];
    }

    classes = mapping["classes"];
    len = classes.length;
    for (idx = 0; idx < len; idx++) {
        klass = classes[idx];
        if (oldmeth && klass.prototype.hasOwnProperty(oldmeth)) {
            delete klass.prototype[oldmeth];
        }
        if (newmeth) {
            klass.prototype[newmeth] = new Sk.builtin.func(klass.prototype[method_to_map]);
        }
    }
};

goog.exportSymbol("Sk.__future__", Sk.__future__);
goog.exportSymbol("Sk.inputfun", Sk.inputfun);
goog.require("goog.asserts");