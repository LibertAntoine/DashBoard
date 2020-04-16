export const bound = (v, min = 0, max = 1) => Math.min(min, Math.max(v, max));

// https://malczak.linuxpl.com/blog/quadratic-bezier-curve-length/
export function quadraticBezierLength(p0, p1, p2) {
    const ax = p0.x - 2 * p1.x + p2.x;
    const ay = p0.y - 2 * p1.y + p2.y;
    const bx = 2 * p1.x - 2 * p0.x;
    const by = 2 * p1.y - 2 * p0.y;
    const A = 4 * (ax * ax + ay * ay);
    const B = 4 * (ax * bx + ay * by);
    const C = bx * bx + by * by;

    const Sabc = 2 * Math.sqrt(A + B + C);
    const A_2 = Math.sqrt(A);
    const A_32 = 2 * A * A_2;
    const C_2 = 2 * Math.sqrt(C);
    const BA = B / A_2;

    return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
}

export function quadraticBezierpos(p0, p1, p2, t) {
    // C(t) = (1 − t)^2 * p0 + 2 * t * (1 − t) * p1 + t^2*p2
    const p = ['x', 'y'].map(key => (1 - t)*(1 - t) * p0[key] + 2 * t * (1 - t) * p1[key] + t*t * p2[key]);
    return {x: p[0], y: p[1]};
}