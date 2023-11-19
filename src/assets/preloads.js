export var preloadCustom = {
    variables: "",
    constants: "+, -, &, ^, <, >, |, [, ]",
    start: "",
    rules: [],
    angle: 0,
    iterate: 1,
};

export var preloadTree = {
    variables: "F",
    constants: "+, -, &, ^, <, >, |, [, ]",
    start: "F",
    rules: [
        {
            variable: "F",
            rule: "F [+ F][ > F ] F"
        }
    ],
    angle: 45,
    iterate: 3,
};

export var preloadCurve = {
variables: "F",
constants: "+, -, &, ^, <, >, |, [, ]",
start: "F-F-F-F",
rules: [
    {
        variable: "F",
        rule: "FF-F-F-F-F-F+F"
    },
],
angle: 90,
iterate: 4,
};