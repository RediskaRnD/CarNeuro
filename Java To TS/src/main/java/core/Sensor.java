package core;

import tools.Point;
import tools.Line;

public class Sensor {
    public final static double maxDistance = 5000;   // расстояние на которое способен видить сенсор

    private Car car;                                // Машина на которой установлен сенсор
    private Track track;                            // Трек по которой едет машина
    public Point intersection;                      // Точка пересечения луча с треком
    public double angle;                            // угол под которым установлен сенсор
    private double distance;                        // расстояние до препятствия (вычисляется)

    // =====================================
    Sensor(Car car, Track track, double angle) {
        this.car = car;
        this.track = track;
        this.angle = angle;
    }

    // =====================================
    // Точка пересечения луча с треком
    public Point getIntersection() {        // TODO исправить, срочно!!!

        intersection = null;
//
//        Point cp = Point.getPointByAngle(car.getPosition(), maxDistance, angle + car.getAngle());
//        int limit = Math.max(Math.abs(track.len - car.stage), car.stage);
//        for (int step = 0; step < limit - 1; step++) {
//            for (int inversion = 0; inversion < 2; inversion++) {
//                int first = car.stage + (inversion == 0 ? step : -step);
//                if (first < 0 || first > track.len - 2) break;
//                for (int i = 1; i < 3; i++) {
//                    int second = first + (inversion == 0 ? 1 : -1);
//                    if (second < 0 || second > track.len - 1) break;
//                    Global.index[0] = first;
//                    Global.index[1] = second;
//                    Global.index[2] = step;
//                    Global.index[3] = inversion;
//                    Global.index[4] = i;
//                    intersection = Line.getCrossPoints(car.getPosition(), cp, track.p[i][first], track.p[i][second]);
//                    if (intersection != null) return intersection;
//                }
//            }
//        }
//        int lim = Math.max(Math.abs(track.len - 1 - car.stage), car.stage);
//        for (int i = 0, j = 0; i < 10; j = ++j % 2, i = (j == 1 ? -i : Math.abs(i) + 1)) {
//            int first = car.stage + i;
//            if (first < 0 || first > track.len - 2) break;
//        }

        return null;
    }

    // =====================================
    // расстояние от центра машины до препятствия
    public double getDistance() {
        if (intersection != null) {
            return Line.distance(car.getPosition(), intersection);
        }
        return 1.0 / 0.0;
    }
}
