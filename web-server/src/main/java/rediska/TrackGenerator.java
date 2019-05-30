package rediska;

import org.springframework.stereotype.Service;
import tools.Point;

@Service
public class TrackGenerator {

    private int length = 100;
    private int incMin = 100;
    private int incMax = 200;
    private float widthMin = 30;
    private float widthMax = 200;
    private float dWidth = 50;
    private float angle = (float) (Math.PI / 2);

    private Point[][] track;

    // =====================================
    // angle
    public float getAngle() {
        return (float) (angle * 180 / Math.PI);
    }

    public void setAngle(float angle) {
        this.angle = (float) (angle * Math.PI / 180);
    }

    // =====================================
    // len
    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    // =====================================
    // incMin
    public int getIncMin() {
        return incMin;
    }

    public void setIncMin(int incMin) {
        this.incMin = incMin;
    }

    // =====================================
    // incMax
    public int getIncMax() {
        return incMax;
    }

    public void setIncMax(int incMax) {
        this.incMax = incMax;
    }

    // =====================================
    // widthMin
    public float getWidthMin() {
        return widthMin;
    }

    public void setWidthMin(float widthMin) {
        this.widthMin = widthMin;
    }

    // =====================================
    // widthMax
    public float getWidthMax() {
        return widthMax;
    }

    public void setWidthMax(float widthMax) {
        this.widthMax = widthMax;
    }

    // =====================================
    // dWidth
    public float getDWidth() {
        return dWidth;
    }

    public void setDWidth(float dWidth) {
        this.dWidth = dWidth;
    }

    // =====================================

    public Point[][] getTrack() {

        Generate();
        return track;
    }
    // =====================================

    private void Generate() {

        Point p = new Point(0, 0);
        float newAngle = (float) (Math.random() * 2 * Math.PI);
        float previousAngle = 0;
        float len;

        if (length < 2) return;
        track = new Point[3][length];
        // высчитываем максимальную ширину дороги, которая не приведёт к внутренним пересечениям
        float maxWidthCalculated = incMin / (float) Math.cos((360 - angle) * Math.PI / (4 * 180));
        widthMax = widthMax < maxWidthCalculated ? widthMax : maxWidthCalculated;
        widthMin = widthMin < maxWidthCalculated ? widthMin : maxWidthCalculated;
        dWidth = dWidth < widthMax - widthMin ? dWidth : widthMax - widthMin;

        float w = (widthMax + widthMin) / 2;

        for (int i = 0; i < length; i++) {
            // создаём центральную полосу трека
            track[0][i] = p;
            newAngle += (float) (angle * (Math.random() - 0.5));
            len = (float) (Math.random() * (incMax - incMin) + incMin);

            // создаём перпиндикулярное треку начало и конец
            if (i == 0) previousAngle = newAngle;
            if (i == length - 1) newAngle = previousAngle;

            // ширина
            float dw = (float) (Math.random() - 0.5) * dWidth;
            w += 2 * dw;
            w = w < widthMax ? w : widthMax;
            w = w > widthMin ? w : widthMin;

            track[1][i] = Point.getPointByAngle(p, w / 2, (float) (newAngle + previousAngle - Math.PI) / 2);
            track[2][i] = Point.getPointByAngle(p, w / 2, (float) (newAngle + previousAngle + Math.PI) / 2);

            p = Point.getPointByAngle(p, len, newAngle);
            previousAngle = newAngle;
        }
    }
}


