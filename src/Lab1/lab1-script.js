console.log("triangle(value1, type1, value2, type2)");

 const triangle = (v1, t1, v2, t2) => {

    const toRad = d => d * Math.PI / 180;
    const toDeg = r => r * 180 / Math.PI;

    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle"];
    if (!validTypes.includes(t1) || !validTypes.includes(t2)) {
        console.log("wrong input");
        return "failed";
    }

    if (v1 <= 0 || v2 <= 0) {
        console.log("wrong input");
        return "failed";
    }

    if ((t1 === "adjacent angle" || t1 === "opposite angle") && (v1 <= 0 || v1 >= 90)) {
        console.log("wrong input");
        return "failed";
    }
    if ((t2 === "adjacent angle" || t2 === "opposite angle") && (v2 <= 0 || v2 >= 90)) {
        console.log("wrong input");
        return "failed";
    }

    let a, b, c, alpha, beta;

    if (t1 === "leg" && t2 === "leg") {
        a = v1;
        b = v2;
        c = Math.sqrt(a*a + b*b);
    } else if (t1 === "leg" && t2 === "hypotenuse") {
        a = v1;
        c = v2;
        if (a >= c) {
            console.log("wrong input");
            return "failed";
        }
        b = Math.sqrt(c*c - a*a);
    } else if (t2 === "leg" && t1 === "hypotenuse") {
        a = v2;
        c = v1;
        if (a >= c) {
            console.log("wrong input");
            return "failed";
        }
        b = Math.sqrt(c*c - a*a);
    } else if (t1 === "hypotenuse" && t2 === "opposite angle") {
        c = v1;
        alpha = v2;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    } else if (t2 === "hypotenuse" && t1 === "opposite angle") {
        c = v2;
        alpha = v1;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    } else if (t1 === "hypotenuse" && t2 === "adjacent angle") {
        c = v1;
        beta = v2;
        alpha = 90 - beta;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    } else if (t2 === "hypotenuse" && t1 === "adjacent angle") {
        c = v2;
        beta = v1;
        alpha = 90 - beta;
        a = c * Math.sin(toRad(alpha));
        b = c * Math.cos(toRad(alpha));
    } else {
        console.log("wrong input");
        return "failed";
    }

    if (alpha === undefined) {
    alpha = toDeg(Math.atan2(a, b));
    }


    beta = 90 - alpha;

    a = +a.toFixed(2);
    b = +b.toFixed(2);
    c = +c.toFixed(2);
    alpha = +alpha.toFixed(2);
    beta = +beta.toFixed(2);

    console.log("a =", a);
    console.log("b =", b);
    console.log("c =", c);
    console.log("alpha =", alpha);
    console.log("beta =", beta);

    return "success";

}
