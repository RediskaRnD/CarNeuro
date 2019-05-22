/* Generated from Java with JSweet 2.3.0-SNAPSHOT - http://www.jsweet.org */
export class Point {
    public x : number = 0;

    public y : number = 0;

    /**
     * 
     * @param {*} o
     * @return {boolean}
     */
    public equals(o : any) : boolean {
        if(this === o) return true;
        if(o == null || (<any>this.constructor) !== (<any>o.constructor)) return false;
        let p : Point = <Point>o;
        return this.x === p.x && this.y === p.y;
    }

    /**
     * 
     * @return {number}
     */
    public hashCode() : number {
        return /* hash */0;
    }
}
Point["__class"] = "tools.Point";



