export var preloadCustom = {
    variables: "",
    constants: "+, -, &, ^, <, >, |, [, ]",
    start: "",
    rules: [],
    angles: [
        {
            axis: "X axis (+, -)",
            angle: 0
        },
        {
            axis: "Y axis (&, ^)",
            angle: 0
        },
        {
            axis: "Z axis (<, >)",
            angle: 0
        }
    ],
    iterate: 1,
};

export var preloadTree = {
    variables: "F",
    constants: "+, -, &, ^, <, >, |, [, ]",
    start: "F",
    rules: [
        {
            variable: "F",
            rule: "F+FF"
        }
    ],
    angles: [
        {
            axis: "X axis (+, -)",
            angle: 22.5
        },
        {
            axis: "Y axis (&, ^)",
            angle: 45
        },
        {
            axis: "Z axis (<, >)",
            angle: 67.5
        }
    ],
    iterate: 1,
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
    angles: [
        {
            axis: "X axis (+, -)",
            angle: 90
        },
        {
            axis: "Y axis (&, ^)",
            angle: 90
        },
        {
            axis: "Z axis (<, >)",
            angle: 90
        }
    ],
    iterate: 4,
};

export var preloadMengerSponge = {
    type: "Menger Sponge",
    iterate: 3,
}

export var preloadSierpinskiPyramid = {
    type: "Sierpinski Pyramid",
    iterate: 1,
}