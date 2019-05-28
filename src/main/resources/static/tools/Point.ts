/* Generated from Java with JSweet 2.3.0-SNAPSHOT - http://www.jsweet.org */
export class Point {
    public x : number = 0;

    public y : number = 0;

    public static vm(p1 : Point, p2 : Point) : number {
        return p1.x * p2.y - p2.x * p1.y;
    }

    public static sub(p1 : Point, p2 : Point) : Point {
        let point : Point = new Point();
        point.x = p1.x - p2.x;
        point.y = p2.y - p2.y;
        return point;
    }

    public static sum(p1 : Point, p2 : Point) : Point {
        let point : Point = new Point();
        point.x = p1.x + p2.x;
        point.y = p2.y + p2.y;
        return point;
    }

    public static angleByPoints(p1 : Point, p2 : Point) : number {
        let dx : number = p2.x - p1.x;
        let dy : number = p2.y - p1.y;
        let a : number = (Math.atan2(dy, dx));
        return a > 0?a:2 * Math.PI + a;
    }

    public static getPointByAngle(p : Point, length : number, angle : number) : Point {
        let p2 : Point = new Point();
        p2.x = p.x + (<number>(length * Math.cos(angle))|0);
        p2.y = p.y + (<number>(length * Math.sin(angle))|0);
        return p2;
    }

    /**
     * 
     * @return {string}
     */
    public toString() : string {
        return "(" + this.x + ", " + this.y + ")";
    }
}
Point["__class"] = "tools.Point";



