export const bound = (v, min = 0, max = 1) => Math.min(min, Math.max(v, max));

export const normalize = (v, vmin, vmax, tmin, tmax) => tmin + (bound(v, vmin, vmax) - vmin) / (vmax - vmin) * (tmax - tmin);

// source: https://malczak.linuxpl.com/blog/quadratic-bezier-curve-length/
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
// sources: https://en.wikipedia.org/wiki/Julian_day ; https://www.hermetic.ch/cal_stud/jdn.htm
// (a/b >> 0) or >> 0 is used here to make an integer division instead of Math.floor -> better perf and more readability 
export const JulianDay = (day, month, year) => {
    // this doesn't work need optimizations
    // return (( 1461 * ( year + 4800 + ( month - 14 ) / 12 >> 0 ) ) / 4 >> 0) +
    // (( 367 * ( month - 2 - 12 * ( ( month - 14 ) / 12 >> 0 ) ) ) / 12 >> 0) -
    // (( 3 * ( ( year + 4900 + ( month - 14 ) / 12 >> 0 ) / 100 >> 0 ) ) / 4 >> 0) +
    // day - 32075;
    //If the month is January or February, subtract 1 from the year and add 12 to the month
    // console.log("testOperator:" , new Array(12).fill(0).map((_, i) => i+1).map( x => ( x - 14 ) / 12 >> 0));
    if (month <= 2) {
        year -=1;
        month += 12;
    }
    
    const A = year / 100
    const B = A / 4
    const C = 2-A + B
    const E = 365.25 * (year + 4716)
    const F = 30.6001 * (month + 1)
    return C+day+E+F-1524.5;
}

export const modifiedJulianDay = (julianDay) => julianDay - 2400000.5;

// 24/03/2020 at 10:28, the moon wa new
export const daySinceNewMoon = (julianDay) => julianDay - JulianDay(24, 3, 2020);

// return percentage between two new moon
export const moonPhase = (julianDay) => (daySinceNewMoon(julianDay) % 29.53) / 29.53;

