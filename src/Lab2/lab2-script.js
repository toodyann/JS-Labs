// 1.2.3 car1 через new Object()

let car1 = new Object();

car1.color = "red";
car1.maxSpeed = 180;
car1.driver = new Object();
car1.driver.name = "Anatolii Konovalov";
car1.driver.category = "C";
car1.driver["personal limitations"] = "No driving at night";
car1.tuning = true;
car1["number of accidents"] = 0;

// 1.2.5 метод drive для car1
car1.drive = function () {
    console.log("I am not driving at night");
};

console.log("car1:");
console.log(car1);
car1.drive();


// 1.2.4 car2 через літерал об'єкта
let car2 = {
    color: "blue",
    maxSpeed: 220,
    driver: {
        name: "Anatolii Konovalov",
        category: "B",
        "personal limitations": null
    },
    tuning: false,
    "number of accidents": 2
};

// 1.2.6 метод drive для car2
car2.drive = function () {
    console.log("I can drive anytime");
};

console.log("\ncar2:");
console.log(car2);
car2.drive();


// 1.2.7 Конструктор Truck
// 1.2.8 AssignDriver через prototype
// 1.2.9 метод trip у конструкторі
function Truck(color, weight, avgSpeed, brand, model) {
    this.color = color;
    this.weight = weight;
    this.avgSpeed = avgSpeed;
    this.brand = brand;
    this.model = model;

    this.trip = function () {
        if (!this.driver) {
            console.log("No driver assigned");
        } else {
            console.log(
                "Driver " + this.driver.name + " " +
                (this.driver.nightDriving ? "drives at night" : "does not drive at night") +
                " and has " + this.driver.experience + " years of experience"
            );
        }
    };
}

Truck.prototype.AssignDriver = function (name, nightDriving, experience) {
    this.driver = {
        name: name,
        nightDriving: nightDriving,
        experience: experience
    };
};

// 1.2.10 два об'єкти Truck
let truck1 = new Truck("white", 5000, 95.5, "Volvo", "FH16");
let truck2 = new Truck("black", 4700, 88.3, "MAN", "TGX");

truck1.AssignDriver("Anatolii Konovalov", true, 5);
truck2.AssignDriver("Anatolii Konovalov", false, 3);

console.log("\ntruck1 trip:");
truck1.trip();

console.log("truck2 trip:");
truck2.trip();


// 1.2.12–1.2.15 Square
class Square {
    constructor(a) {
        this.a = a;
    }

    static help() {
        console.log("Square: all 4 sides are equal, all angles are 90 degrees.");
    }

    length() {
        console.log("Perimeter =", 4 * this.a);
    }

    square() {
        console.log("Area =", this.a * this.a);
    }

    info() {
        console.log("Figure: Square");
        console.log("Sides:", this.a, this.a, this.a, this.a);
        console.log("Angles: 90 90 90 90");
        console.log("Perimeter =", 4 * this.a);
        console.log("Area =", this.a * this.a);
    }
}

// 1.2.16–1.2.17 Rectangle
class Rectangle extends Square {
    constructor(a, b) {
        super(a);
        this.b = b;
    }

    static help() {
        console.log("Rectangle: opposite sides are equal, all angles are 90 degrees.");
    }

    length() {
        console.log("Perimeter =", 2 * (this.a + this.b));
    }

    square() {
        console.log("Area =", this.a * this.b);
    }

    info() {
        console.log("Figure: Rectangle");
        console.log("Sides:", this.a, this.b, this.a, this.b);
        console.log("Angles: 90 90 90 90");
        console.log("Perimeter =", 2 * (this.a + this.b));
        console.log("Area =", this.a * this.b);
    }
}

// 1.2.18–1.2.19 Rhombus
class Rhombus extends Square {
    constructor(a, alpha, beta) {
        super(a);
        this.alpha = alpha;
        this.beta = beta;
    }

    static help() {
        console.log("Rhombus: all sides are equal, opposite angles are equal.");
    }

    length() {
        console.log("Perimeter =", 4 * this.a);
    }

    square() {
        console.log("Area =", this.a * this.a * Math.sin(this.alpha * Math.PI / 180));
    }

    info() {
        console.log("Figure: Rhombus");
        console.log("Sides:", this.a, this.a, this.a, this.a);
        console.log("Angles:", this.alpha, this.beta, this.alpha, this.beta);
        console.log("Perimeter =", 4 * this.a);
        console.log("Area =", this.a * this.a * Math.sin(this.alpha * Math.PI / 180));
    }

    get side() {
        return this.a;
    }

    set side(value) {
        this.a = value;
    }

    get obtuseAngle() {
        return this.alpha;
    }

    set obtuseAngle(value) {
        this.alpha = value;
    }

    get acuteAngle() {
        return this.beta;
    }

    set acuteAngle(value) {
        this.beta = value;
    }
}

// 1.2.20–1.2.21 Parallelogram
class Parallelogram extends Rectangle {
    constructor(a, b, alpha, beta) {
        super(a, b);
        this.alpha = alpha;
        this.beta = beta;
    }

    static help() {
        console.log("Parallelogram: opposite sides are equal and parallel, opposite angles are equal.");
    }

    length() {
        console.log("Perimeter =", 2 * (this.a + this.b));
    }

    square() {
        console.log("Area =", this.a * this.b * Math.sin(this.alpha * Math.PI / 180));
    }

    info() {
        console.log("Figure: Parallelogram");
        console.log("Sides:", this.a, this.b, this.a, this.b);
        console.log("Angles:", this.alpha, this.beta, this.alpha, this.beta);
        console.log("Perimeter =", 2 * (this.a + this.b));
        console.log("Area =", this.a * this.b * Math.sin(this.alpha * Math.PI / 180));
    }
}

// 1.2.23 виклик help для всіх класів
console.log("\nStatic help:");
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

// 1.2.24 створити по 1 об'єкту і викликати info
let squareObj = new Square(5);
let rectangleObj = new Rectangle(6, 4);
let rhombusObj = new Rhombus(5, 120, 60);
let parallelogramObj = new Parallelogram(8, 5, 120, 60);

console.log("\nSquare info:");
squareObj.info();

console.log("\nRectangle info:");
rectangleObj.info();

console.log("\nRhombus info:");
rhombusObj.info();

console.log("\nParallelogram info:");
parallelogramObj.info();


// 1.2.25–1.2.26 Triangular
function Triangular(a = 3, b = 4, c = 5) {
    return { a, b, c };
}

let triangle1 = Triangular();
let triangle2 = Triangular(6, 8, 10);
let triangle3 = Triangular(7, 7, 7);

console.log("\nTriangles:");
console.log(triangle1);
console.log(triangle2);
console.log(triangle3);


// 1.2.27–1.2.28 PiMultiplier
function PiMultiplier(num) {
    return function () {
        return Math.PI * num;
    };
}

let multiplyBy2 = PiMultiplier(2);
let multiplyByThreeDivTwo = PiMultiplier(3 / 2);
let divideBy2 = PiMultiplier(1 / 2);

console.log("\nPiMultiplier:");
console.log("PI * 2 =", multiplyBy2());
console.log("PI * 3/2 =", multiplyByThreeDivTwo());
console.log("PI / 2 =", divideBy2());


// 1.2.29–1.2.31 Painter
function Painter(color) {
    return function (obj) {
        if ("type" in obj) {
            console.log(color + " " + obj.type);
        } else {
            console.log("No 'type' property occurred!");
        }
    };
}

let PaintBlue = Painter("Blue");
let PaintRed = Painter("Red");
let PaintYellow = Painter("Yellow");

let object1 = {
    maxSpeed: 280,
    type: "Sportcar",
    color: "magenta"
};

let object2 = {
    type: "Truck",
    "avg speed": 90,
    "load capacity": 2400
};

let object3 = {
    maxSpeed: 180,
    color: "purple",
    isCar: true
};

console.log("\nPaintBlue:");
PaintBlue(object1);
PaintBlue(object2);
PaintBlue(object3);

console.log("\nPaintRed:");
PaintRed(object1);
PaintRed(object2);
PaintRed(object3);

console.log("\nPaintYellow:");
PaintYellow(object1);
PaintYellow(object2);
PaintYellow(object3);