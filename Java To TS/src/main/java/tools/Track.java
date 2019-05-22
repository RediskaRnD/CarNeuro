package tools;

//import java.awt.Point;


public class Track {

//    @Module("liaw")
    public Point[][] p;
    public int len = 0;
    public int xMin = 0;
    public int xMax = 0;
    public int yMin = 0;
    public int yMax = 0;

    public Track(Point[][] track) {

        p = track;
        this.len = track[0].length;

        for (int i = 0; i < this.len; i++) {
            this.xMin = this.xMin < track[0][i].x ? this.xMin : track[0][i].x;
            this.yMin = this.yMin < track[0][i].y ? this.yMin : track[0][i].y;
            this.xMax = this.xMax > track[0][i].x ? this.xMax : track[0][i].x;
            this.yMax = this.yMax > track[0][i].y ? this.yMax : track[0][i].y;
        }
    }
}
