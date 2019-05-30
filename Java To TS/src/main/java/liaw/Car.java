package liaw;
// тест языковой. Cp1252 漢字, упр. 汉字
import def.dom.Image;
import tools.Line;
import tools.Point;

import static def.dom.Globals.cancelAnimationFrame;

public class Car {

    // readonly
    private double maxSpeed;        // максимальная скорость
    public int width;               // длина машины
    public int height;              // ширина машины
    public double axl;              // ускорение тачки вперёд

    private double r;               // TODO что это такое?
    private double a;               // TODO что это такое?

    final double maxWheelAngle = Math.PI / 180 * 42;
    // end readonly
    Point[] cornerP = new Point[4]; // координаты углов тачки

    Point ackerP;                   // точка аккермана
    double ackerA;                  // угол между задней осью и центром тачки относительно ackerP
    double ackerR;                  // радиус аккермана для центра тачки


    private Point _position;
    private double _angle;          // угол машины
    private double _wheelAngle;     // угол колеса машины

    boolean isReady = false;

    Image sprite;                  // картинка тачки

    double speed = 0;               // текущая скорость машины
    int keys = 0;                   // зажатые кнопки управления

    double time = 0;                // время заезда
    int stage = 0;                  // сегмент трэка на котором находится тачка
    double fuel = 0;                // оставшееся количество топлива
    // =====================================

    public Car(int width, int height, double acceleration, double maxSpeed) {

        this.width = width;
        this.height = height;
        this.axl = acceleration;
        this.maxSpeed = maxSpeed;

        r = Math.sqrt(height * height + width * width) / 2;

        _position = new Point();
        _position.x = 0;
        _position.y = 0;

        Point midPoint = new Point();
        midPoint.x = width / 2;
        midPoint.y = height / 2;
        a = Point.angleByPoints(_position, midPoint);

        ackerP = new Point();
        ackerP.x = 0;
        ackerP.y = 0;
        ackerA = Double.POSITIVE_INFINITY;
        ackerR = Double.POSITIVE_INFINITY;

        _angle = 0;
        _wheelAngle = 0;
    }

    // =====================================
    // CarPosition
    public Point getPosition() {

        return _position;
    }

    public void setPosition(Point p) {

        // находим разницу между положением прошлым и настоящим
        Point dp = Point.sub(p, _position);
        _position = p;
        // добавляем разницу к крайним точкам тачки
        for (int i = 0; i < 4; i++) {
            cornerP[i] = Point.sum(cornerP[i], dp);
        }
    }

    // =====================================
    // угол поворота колес относительно оси автомобиля
    public double getWheelAngle() {

        return _wheelAngle;
    }

    public void setWheelAngle(double value) {

        _wheelAngle = Math.min(Math.max(value, -maxWheelAngle), maxWheelAngle);
        // если угол поворота колеса меньше 1 градуса то округляем его до 0
        if (Math.abs(this._wheelAngle) <= Math.PI / 180) {
            _wheelAngle = 0;
        } else {
            // ищем точку аккермана
            double ackerL = width / Math.tan(_wheelAngle);
            ackerR = Math.sqrt(width * width / 4 + ackerL * ackerL);
            ackerA = _angle + (Math.asin(width / (2 * this.ackerR)) + Math.PI / 2) * (_wheelAngle > 0 ? 1 : -1);
            ackerP = Point.getPointByAngle(_position, ackerR, ackerA);
        }
    }

    // =====================================
    // угол машины относительно оси Х
    public double getAngle() {

        return this._angle;
    }

    public void setAngle(double value) {
        _angle = value;
        // Находим крайние точки тачки.
        cornerP[0] = (Point.getPointByAngle(_position, r, _angle + a));
        cornerP[1] = (Point.getPointByAngle(_position, r, _angle - a));
        cornerP[2] = (Point.getPointByAngle(_position, r, _angle + a + Math.PI));
        cornerP[3] = (Point.getPointByAngle(_position, r, _angle - a + Math.PI));
    }
    // =====================================

    void calcPosition(double dt) {

        double v = speed;

        if (fuel > 0) {
            // ускоряемся вперед
            if ((keys & 1) > 0) {
                if (v < 0) {
                    // тормозим
                    calcSpeed(axl * 2, dt, v, 0);
                } else {
                    // разгоняемся вперед
                    calcSpeed(axl, dt, v, maxSpeed);
                }
            } else {
                //машина медленно останавливается без газа
                if (v > 0) {
                    calcSpeed(-axl * 0.5, dt, 0, v);
                }
            }
            // ускоряемся назад
            if ((keys & 2) > 0) {
                if (v > 0) {
                    // тормозим
                    calcSpeed(-axl * 2, dt, 0, v);
                } else {
                    // разгоняемся назад
                    calcSpeed(-axl, dt, -maxSpeed / 5, v);
                }
            } else {
                //машина медленно останавливается без газа
                if (v < 0) {
                    calcSpeed(axl * 0.5, dt, v, 0);
                }
            }
        } else {
            //машина медленно останавливается без топлива
            if (v > 0) {
                calcSpeed(-axl * 0.5, dt, 0, v);
            } else if (v < 0) {
                calcSpeed(axl * 0.5, dt, v, 0);
            }
        }
        // поворачиваем машину вокруг точки аккермана
        if ((keys & 4) > 0) {
            setWheelAngle(_wheelAngle - 2 * Math.PI / 180);
        } else {
            if (_wheelAngle < 0) {
                setWheelAngle(_wheelAngle + 3 * Math.PI / 180);
            }
        }
        // поворачиваем машину вокруг точки аккермана
        if ((keys & 8) > 0) {
            setWheelAngle(_wheelAngle + 2 * Math.PI / 180);
        } else {
            if (_wheelAngle > 0) {
                setWheelAngle(_wheelAngle - 3 * Math.PI / 180);
            }
        }
        // машина не двигается и колёса стоят ровно, останавливаем анимацию
        if ((keys == 0) && (v == 0) && (_wheelAngle == 0) && Global.requestAnimationId != null) {
            cancelAnimationFrame(Global.requestAnimationId);
            Global.requestAnimationId = null;
            Utils.debug("anim-");
        }

        double s = dt * this.speed;    // пройденный путь за dt
        if (_wheelAngle != 0) {
            // находим угол на который сместились за dt
            // на какой угол повернулась машина относительно точки аккермана.
            double dAngle = s / ackerR * (_wheelAngle > 0 ? 1 : -1);
            // поворачиваем корпус тачки
            setAngle(_angle + dAngle);
            // находим новую позицию тачки
            setPosition(Point.getPointByAngle(ackerP, ackerR, (ackerA + dAngle + Math.PI)));
        } else {
            setPosition(Point.getPointByAngle(_position, speed * dt, _angle));
        }
    }

    // =====================================
    // пересчитываем скорость машины
    void calcSpeed(double axl, double dt, double vMin, double vMax) {

        double v = speed + axl * dt;
        speed = Math.max(Math.min(v, vMax), vMin);
    }
    // =====================================

    boolean checkCollisions(Track track) {

        // считаем что +/-2 зебры - это зона проверки столкновений
        int iMin = stage - 2 < 0 ? 0 : stage - 2;
        int iMax = stage + 2 > track.len - 1 ? track.len - 1 : stage + 2;
        // проверяем обе стороны
        for (int i = 1; i < 3; i++) {
            for (int j = iMin; j < iMax; j++) {
                if (Line.isCrossing(track.p[i][j], track.p[i][j + 1], cornerP[0], cornerP[1]) == true) return true;
                if (Line.isCrossing(track.p[i][j], track.p[i][j + 1], cornerP[1], cornerP[2]) == true) return true;
                if (Line.isCrossing(track.p[i][j], track.p[i][j + 1], cornerP[2], cornerP[3]) == true) return true;
                if (Line.isCrossing(track.p[i][j], track.p[i][j + 1], cornerP[3], cornerP[0]) == true) return true;
            }
        }
        // надо будет потом найти место столкновения
        return false;
    }

    // =====================================
    // проверяем между какими зебрами находимся
    void updateProgress(Track track) {  // TODO проверить функцию. Подозрительная.

        int st = stage;
        // проверка следующей зебры
        if (stage < track.len - 1) {
            st = stage + 1;
            // проверяем диагонали на пересечение зебры
            if (checkIntersectionWithTrack(track, st) == true) return;
        }
        // проверка на случай если мы едем задом наперёд
        if (stage > 0) {
            st = stage - 1;
            // проверяем диагонали на пересечение зебры
            if (checkIntersectionWithTrack(track, st) == true) return;
        }
    }
    // =====================================

    private boolean checkIntersectionWithTrack(Track track, int stage) {

        boolean a = Line.isCrossing(track.p[1][stage], track.p[2][stage], cornerP[0], cornerP[2]);
        boolean b = Line.isCrossing(track.p[1][stage], track.p[2][stage], cornerP[1], cornerP[3]);
        if (a || b) {
            this.stage = stage;
            return true;
        }
        return false;
    }

    // =====================================
    // отскок машины от препятствия
    void recoil(double dt) {

        setPosition(Point.getPointByAngle(_position, speed * dt * 2, _angle - Math.PI));
        speed = -speed / 3;
    }

    // =====================================
    // подготовка к старту
    void restart() {

        Utils.debug("Restart");
        Point p = new Point();
        p.x = 0;
        p.y = 0;
        setPosition(p);
        setAngle(Point.angleByPoints(Global.track.p[0][0], Global.track.p[0][1]));
        setWheelAngle(0);
        speed = 0;
        time = 0;
        stage = 0;
        fuel = 1;
    }
}
