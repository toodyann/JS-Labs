console.log("triangle(value1, type1, value2, type2)");

function triangle(v1, t1, v2, t2) {

    const toRad = d => d * Math.PI / 180;
    const toDeg = r => r * 180 / Math.PI;

    let a, b, c, alpha, beta;

    if (t1 === "leg" && t2 === "leg") {
        a = v1;
        b = v2;
        c = Math.sqrt(a*a + b*b);
    }

    else if (t1 === "leg" && t2 === "hypotenuse") {
        a = v1;
        c = v2;
        b = Math.sqrt(c*c - a*a);
    }
    else if (t2 === "leg" && t1 === "hypotenuse") {
        a = v2;
        c = v1;
        b = Math.sqrt(c*c - a*a);
    }

    else if (t1 === "hypotenuse" && t2 === "angle") {
        c = v1;
        alpha = v2;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    }
    else if (t2 === "hypotenuse" && t1 === "angle") {
        c = v2;
        alpha = v1;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    }

    else {
        console.log("wrong input");
        return "failed";
    }

    if (!alpha) {
        alpha = toDeg(Math.atan(a/b));
    }

    beta = 90 - alpha;

    console.log("a =", a);
    console.log("b =", b);
    console.log("c =", c);
    console.log("alpha =", alpha);
    console.log("beta =", beta);

    return "success";
}
