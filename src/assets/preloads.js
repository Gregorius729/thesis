export var preloadCustom = {
    variables: "",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
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
};

export var preloadTree = {
    variables: "F",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
    start: "F",
    rules: [
        {
            variable: "F",
            rule: "F[+F][-F][>F][<F]"
        }
    ],
    angles: [
        {
            axis: "X axis (+, -)",
            angle: 25
        },
        {
            axis: "Y axis (&, ^)",
            angle: 25
        },
        {
            axis: "Z axis (<, >)",
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
};

export var preloadCurve = {
    variables: "A, B, C, D",
    constants: "F, +, -, &, ^, <, >, |, [, ]",
    start: "A",
    rules: [
        {
            variable: "A",
            rule: "B-F+CFC+F-D&F∧D-F+&&CFC+F+B>>"
        },
        {
            variable: "B",
            rule: "A&F∧CFB∧F∧D∧∧-F-D∧|F∧B|FC∧F∧A>>"
        },
        {
            variable: "C",
            rule: "|D∧|F∧B-F+C∧F∧A&&FA&F∧C+F+B∧F∧D>>"
        },
        {
            variable: "D",
            rule: "|CFB-F+B|FA&F∧A&&FB-F+B|FC>>"
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
};

export var preloadMengerSponge = {
    type: "Menger Sponge",
    iterate: 3,
}

export var preloadSierpinskiPyramid = {
    type: "Sierpinski Pyramid",
    iterate: 1,
}