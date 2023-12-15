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
    variables: "F, G",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
    start: "F-G-G",
    rules: [
        {
            variable: "G",
            rule: "F-G+F+G-F"
        },
        {
            variable: "G",
            rule: "GG"
        },
        {
            variable: "C",
            rule: "|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D>>"
        },
        {
            variable: "D",
            rule: "|CFB-F+B|FA&F^A&&FB-F+B|FC>>"
        },
    ],
    angles: [
        {
            axis: "X axis (^, &)",
            angle: 120
        },
        {
            axis: "Y axis (<, >)",
            angle: 120
        },
        {
            axis: "Z axis (+, -)",
            angle: 120
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