/* Generated from Java with JSweet 2.3.0-SNAPSHOT - http://www.jsweet.org */
import { Point } from './Point';

export class Track {
    public p : Point[][];

    public len : number = 0;

    public xMin : number = 0;

    public xMax : number = 0;

    public yMin : number = 0;

    public yMax : number = 0;

    public constructor(track : Point[][]) {
        if(this.p===undefined) this.p = null;
        this.p = track;
        this.len = track[0].length;
        for(let i : number = 0; i < this.len; i++) {{
            this.xMin = this.xMin < track[0][i].x?this.xMin:track[0][i].x;
            this.yMin = this.yMin < track[0][i].y?this.yMin:track[0][i].y;
            this.xMax = this.xMax > track[0][i].x?this.xMax:track[0][i].x;
            this.yMax = this.yMax > track[0][i].y?this.yMax:track[0][i].y;
        };}
    }
}
Track["__class"] = "tools.Track";



