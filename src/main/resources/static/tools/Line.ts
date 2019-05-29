/* Generated from Java with JSweet 2.3.0-SNAPSHOT - http://www.jsweet.org */
import { Point } from './Point';

export class Line {
    public p1 : Point;

    public p2 : Point;

    public constructor(p1 : Point, p2 : Point) {
        if(this.p1===undefined) this.p1 = null;
        if(this.p2===undefined) this.p2 = null;
        this.p1 = p1;
        this.p2 = p2;
    }

    /*private*/ static crossPoint(a1 : number, b1 : number, c1 : number, a2 : number, b2 : number, c2 : number) : Point {
        let d : number = a1 * b2 - b1 * a2;
        let dx : number = -c1 * b2 + b1 * c2;
        let dy : number = -a1 * c2 + c1 * a2;
        let p : Point = new Point();
        p.x = dx / d;
        p.y = dy / d;
        return p;
    }

    /*private*/ static lineEquation(p1 : Point, p2 : Point) : number[] {
        let a : number = p2.y - p1.y;
        let b : number = p1.x - p2.x;
        let c : number = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
        return [a, b, c];
    }

    public static getCrossPoints(p1 : Point, p2 : Point, p3 : Point, p4 : Point) : Point {
        if(Line.isCrossing(p1, p2, p3, p4) === true) {
            let abc : number[] = Line.lineEquation(p1, p2);
            let abc2 : number[] = Line.lineEquation(p3, p4);
            return Line.crossPoint(abc[0], abc[1], abc[2], abc2[0], abc2[1], abc2[2]);
        }
        return null;
    }

    public static isCrossing(p1 : Point, p2 : Point, p3 : Point, p4 : Point) : boolean {
        let v1 : number = Point.vm(Point.sub(p4, p3), Point.sub(p1, p3));
        let v2 : number = Point.vm(Point.sub(p4, p3), Point.sub(p2, p3));
        let v3 : number = Point.vm(Point.sub(p2, p1), Point.sub(p3, p1));
        let v4 : number = Point.vm(Point.sub(p2, p1), Point.sub(p4, p1));
        return (v1 * v2 < 0) && (v3 * v4 < 0);
    }
}
Line["__class"] = "tools.Line";



