console.log("Usage: triangle(value1, type1, value2, type2)");
console.log("Types: 'leg', 'hypotenuse', 'adjacent angle', 'opposite angle', 'angle'");

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

function triangle(v1, t1, v2, t2) {
    const types = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!types.includes(t1) || !types.includes(t2)) {
        console.log("Invalid type. Please read the instructions.");
        return "failed";
    }

    const MIN = 1e-6;
    const MAX = 1e6;
    if (v1 < MIN || v2 < MIN || v1 > MAX || v2 > MAX)
        return "Invalid values";

    let a, b, c, alpha, beta;

    if (
        (t1 === "leg" && t2 === "hypotenuse") ||
        (t2 === "leg" && t1 === "hypotenuse")
    ) {
        a = (t1 === "leg") ? v1 : v2;
        c = (t1 === "hypotenuse") ? v1 : v2;

        if (a >= c) return "Leg cannot be greater than or equal to the hypotenuse";

        b = Math.sqrt(c * c - a * a);
        alpha = radToDeg(Math.asin(a / c));
        beta = 90 - alpha;
    }

    else if (t1 === "leg" && t2 === "leg") {
        a = v1;
        b = v2;
        c = Math.sqrt(a * a + b * b);

        alpha = radToDeg(Math.atan(a / b));
        beta = 90 - alpha;
    }

    else if (
        (t1 === "leg" && t2 === "adjacent angle") ||
        (t2 === "leg" && t1 === "adjacent angle")
    ) {
        a = (t1 === "leg") ? v1 : v2;
        alpha = (t1 === "adjacent angle") ? v1 : v2;

        if (alpha <= 0 || alpha >= 90) return "Angle must be acute";

        c = a / Math.cos(degToRad(alpha));
        if (!isFinite(c) || c <= a) return "Invalid ratio";

        b = Math.sqrt(c * c - a * a);
        beta = 90 - alpha;
    }

    else if (
        (t1 === "leg" && t2 === "opposite angle") ||
        (t2 === "leg" && t1 === "opposite angle")
    ) {
        a = (t1 === "leg") ? v1 : v2;
        alpha = (t1 === "opposite angle") ? v1 : v2;

        if (alpha <= 0 || alpha >= 90) return "Angle must be acute";

        c = a / Math.sin(degToRad(alpha));
        if (!isFinite(c) || c <= a) return "Invalid ratio";

        b = Math.sqrt(c * c - a * a);
        beta = 90 - alpha;
    }

    else if (
        (t1 === "hypotenuse" && t2 === "angle") ||
        (t2 === "hypotenuse" && t1 === "angle")
    ) {
        c = (t1 === "hypotenuse") ? v1 : v2;
        alpha = (t1 === "angle") ? v1 : v2;

        if (alpha <= 0 || alpha >= 90) return "Angle must be acute";

        a = c * Math.sin(degToRad(alpha));
        b = c * Math.cos(degToRad(alpha));
        beta = 90 - alpha;
    }

    else {
        console.log("Incompatible type pair. Please read the instructions.");
        return "failed";
    }

   console.log("a =", a);
   console.log("b =", b);
   console.log("c =", c);
   console.log("alpha =", alpha);
   console.log("beta =", beta);

    return "success";
}
