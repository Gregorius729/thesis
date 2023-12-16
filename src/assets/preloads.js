export var preloadCustom = {
    variables: "",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
    start: "",
    rules: [],
    angles: [
        {
            axis: "X axis (^, &)",
            angle: 25
        },
        {
            axis: "Y axis (<, >)",
            angle: 25
        },
        {
            axis: "Z axis (+, -)",
            angle: 25
        }
    ],
    radiusTop: 1.5,
    radiusBottom: 2,
    height: 30,
    radialSegments: 10,
    iterate: 1,
    ifModify: false,
    heightModifier: 0.9,
    widthModifier: 0.9,
    ifLeaf: false,
    leafLength: 10,
    leafColor: '#207336',
    branchColor: '#964B00',
};

export var preloadTree = {
    variables: "F",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
    start: "F",
    rules: [
        {
            variable: "F",
            rule: "F[+F][-F][^F][&F]"
        }
    ],
    angles: [
        {
            axis: "X axis (^, &)",
            angle: 25
        },
        {
            axis: "Y axis (<, >)",
            angle: 25
        },
        {
            axis: "Z axis (+, -)",
            angle: 25
        }
    ],
    radiusTop: 1.5,
    radiusBottom: 2,
    height: 30,
    radialSegments: 10,
    iterate: 3,
    ifModify: false,
    heightModifier: 0.9,
    widthModifier: 0.9,
    ifLeaf: true,
    leafLength: 10,
    leafColor: '#207336',
    branchColor: '#964B00',
};

export var preloadCurve = {
    variables: "F, X",
    constants: "F, X, +, -, &, ^, <, >, |, [, ]",
    start: "X",
    rules: [
        {
            variable: "X",
            rule: "F+[[X]-X]-F[-FX]+X"
        },
        {
            variable: "F",
            rule: "FF"
        },
    ],
    angles: [
        {
            axis: "X axis (^, &)",
            angle: 25
        },
        {
            axis: "Y axis (<, >)",
            angle: 25
        },
        {
            axis: "Z axis (+, -)",
            angle: 25
        }
    ],
    radiusTop: 2,
    radiusBottom: 2,
    height: 30,
    radialSegments: 10,
    iterate: 2,
    ifModify: false,
    heightModifier: 0.9,
    widthModifier: 0.9,
    ifLeaf: false,
    leafLength: 10,
    leafColor: '#207336',
    branchColor: '#964B00',
};

export var preloadMengerSponge = {
    type: "Menger Sponge",
    iterate: 3,
}

export var preloadSierpinskiPyramid = {
    type: "Sierpinski Pyramid",
    iterate: 2,
}