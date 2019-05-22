define(["require", "exports", "./tools"], function (require, exports, tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Car {
        constructor(width, height, acceleration, maxSpeed) {
            this.cornerP = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
            this.ackerP = { x: 0, y: 0 }; // точка аккермана
            this.maxWheelAngle = Math.PI / 180 * 42;
            this._p = { x: 0, y: 0 };
            this._angle = 0; // угол машины
            this._wheelAngle = 0; // угол колеса машины
            this.isReady = false;
            this.sprite = new Image();
            this.speed = 0;
            this.keys = 0; // зажатые кнопки управления
            this.time = 0;
            this.stage = 0;
            this.fuel = 0;
            this.width = width;
            this.height = height;
            this.axl = acceleration;
            this.maxSpeed = maxSpeed;
            this.r = Math.sqrt(this.height * this.height + this.width * this.width) / 2;
            this.a = tools_1.Tools.angleByPoints({ x: 0, y: 0 }, { x: this.width / 2, y: this.height / 2 });
            this.ackerA = Infinity;
            this.ackerR = Infinity;
        }
        // =====================================
        get p() {
            return this._p;
        }
        set p(value) {
            // находим разницу между положением прошлым и настоящим
            let dp = tools_1.Tools.sub(value, this._p);
            this._p = value;
            // добавляем разницу к крайним точкам тачки
            for (let i = 0; i < 4; i++) {
                this.cornerP[i] = tools_1.Tools.sum(this.cornerP[i], dp);
            }
        }
        // =====================================
        get wheelAngle() {
            return this._wheelAngle;
        }
        set wheelAngle(value) {
            this._wheelAngle = Math.min(Math.max(value, -this.maxWheelAngle), this.maxWheelAngle);
            // если угол поворота колеса меньше 1 градуса то округляем его до 0
            if (Math.abs(this._wheelAngle) <= Math.PI / 180) {
                this._wheelAngle = 0;
            }
            else {
                // ищем точку аккермана
                let ackerL = this.width / Math.tan(this._wheelAngle);
                this.ackerR = Math.sqrt(this.width * this.width / 4 + ackerL * ackerL);
                this.ackerA = this._angle + (Math.asin(this.width / (2 * this.ackerR)) + Math.PI / 2) * (this._wheelAngle > 0 ? 1 : -1);
                this.ackerP = tools_1.Tools.lineToAngle(this._p, this.ackerR, this.ackerA);
            }
        }
        // =====================================
        get angle() {
            return this._angle;
        }
        set angle(value) {
            this._angle = value;
            // Находим крайние точки тачки.
            this.cornerP[0] = (tools_1.Tools.lineToAngle(this._p, this.r, this._angle + this.a));
            this.cornerP[1] = (tools_1.Tools.lineToAngle(this._p, this.r, this._angle - this.a));
            this.cornerP[2] = (tools_1.Tools.lineToAngle(this._p, this.r, this._angle + this.a + Math.PI));
            this.cornerP[3] = (tools_1.Tools.lineToAngle(this._p, this.r, this._angle - this.a + Math.PI));
        }
        // =====================================
        calcPosition(dt) {
            let v = this.speed;
            if (this.fuel > 0) {
                // ускоряемся вперед
                if (this.keys & 1) {
                    if (v < 0) {
                        // тормозим
                        this.calcSpeed(this.axl * 2, dt, v, 0);
                    }
                    else {
                        // разгоняемся вперед
                        this.calcSpeed(this.axl, dt, v, this.maxSpeed);
                    }
                }
                else {
                    //машина медленно останавливается без газа
                    if (v > 0) {
                        this.calcSpeed(-this.axl * 0.5, dt, 0, v);
                    }
                }
                // ускоряемся назад
                if (this.keys & 2) {
                    if (v > 0) {
                        // тормозим
                        this.calcSpeed(-this.axl * 2, dt, 0, v);
                    }
                    else {
                        // разгоняемся назад
                        this.calcSpeed(-this.axl, dt, -this.maxSpeed / 5, v);
                    }
                }
                else {
                    //машина медленно останавливается без газа
                    if (v < 0) {
                        this.calcSpeed(this.axl * 0.5, dt, v, 0);
                    }
                }
            }
            else {
                //машина медленно останавливается без топлива
                if (v > 0) {
                    this.calcSpeed(-this.axl * 0.5, dt, 0, v);
                }
                else if (v < 0) {
                    this.calcSpeed(this.axl * 0.5, dt, v, 0);
                }
            }
            // поворачиваем машину вокруг точки аккермана
            if (this.keys & 4) {
                this.wheelAngle -= 2 * Math.PI / 180;
            }
            else {
                if (this._wheelAngle < 0) {
                    this.wheelAngle += 3 * Math.PI / 180;
                }
            }
            // поворачиваем машину вокруг точки аккермана
            if (this.keys & 8) {
                this.wheelAngle += 2 * Math.PI / 180;
            }
            else {
                if (this._wheelAngle > 0) {
                    this.wheelAngle -= 3 * Math.PI / 180;
                }
            }
            // машина не двигается и колёса стоят ровно, останавливаем анимацию
            if ((this.keys == 0) && (v == 0) && (this._wheelAngle == 0) && requestAnimationId) {
                cancelAnimationFrame(requestAnimationId);
                requestAnimationId = undefined;
                debug("anim-");
            }
            let s = dt * this.speed; // пройденный путь за dt
            if (this._wheelAngle) {
                // находим угол на который сместились за dt
                // на какой угол повернулась машина относительно точки аккермана.
                let dAngle = s / this.ackerR * (this._wheelAngle > 0 ? 1 : -1);
                // поворачиваем корпус тачки
                this.angle += dAngle;
                // находим новую позицию тачки
                this.p = tools_1.Tools.lineToAngle(this.ackerP, this.ackerR, (this.ackerA + dAngle + Math.PI));
            }
            else {
                this.p = tools_1.Tools.lineToAngle(this._p, this.speed * dt, this._angle);
            }
            this.wheelAngle;
        }
        // =====================================
        // пересчитываем скорость машины
        calcSpeed(axl, dt, vMin, vMax) {
            let v = this.speed + axl * dt;
            this.speed = Math.max(Math.min(v, vMax), vMin);
        }
        // =====================================
        checkCollisions(track) {
            // считаем что +/-2 зебры зона проверки столкновений
            const iMin = this.stage - 2 < 0 ? 0 : this.stage - 2;
            const iMax = this.stage + 2 > track.len - 1 ? track.len - 1 : this.stage + 2;
            // проверяем обе стороны
            for (let i = 1; i < 3; i++) {
                for (let j = iMin; j < iMax; j++) {
                    if (tools_1.Tools.linesCrossing(track.p[i][j], track.p[i][j + 1], this.cornerP[0], this.cornerP[1]) == true)
                        return true;
                    if (tools_1.Tools.linesCrossing(track.p[i][j], track.p[i][j + 1], this.cornerP[1], this.cornerP[2]) == true)
                        return true;
                    if (tools_1.Tools.linesCrossing(track.p[i][j], track.p[i][j + 1], this.cornerP[2], this.cornerP[3]) == true)
                        return true;
                    if (tools_1.Tools.linesCrossing(track.p[i][j], track.p[i][j + 1], this.cornerP[3], this.cornerP[0]) == true)
                        return true;
                }
            }
            // надо будет потом найти место столкновения
            return false;
        }
        // =====================================
        // проверяем между какими зебрами находимся
        updateProgress(track) {
            let st = this.stage;
            // проверка следующей зебры
            if (this.stage < track.len - 1) {
                st = this.stage + 1;
                // проверяем диагонали на пересечение зебры
                if (tools_1.Tools.linesCrossing(track.p[1][st], track.p[2][st], this.cornerP[0], this.cornerP[2]) == true
                    ||
                        tools_1.Tools.linesCrossing(track.p[1][st], track.p[2][st], this.cornerP[1], this.cornerP[3]) == true) {
                    this.stage = st;
                    return;
                }
            }
            // проверка на случай если мы едем задом наперёд
            if (this.stage > 0) {
                st = this.stage - 1;
                // проверяем диагонали на пересечение зебры
                if (tools_1.Tools.linesCrossing(track.p[1][st], track.p[2][st], this.cornerP[0], this.cornerP[2]) == true
                    ||
                        tools_1.Tools.linesCrossing(track.p[1][st], track.p[2][st], this.cornerP[1], this.cornerP[3]) == true) {
                    this.stage = st;
                    return;
                }
            }
        }
        // =====================================
        // отскок машины от препятствия
        recoil(dt) {
            this.p = tools_1.Tools.lineToAngle(this._p, this.speed * dt * 2, this._angle - Math.PI);
            this.speed = -this.speed / 3;
        }
        // =====================================
        // подготовка к старту
        restart() {
            debug("Restart");
            this.p = { x: 0, y: 0 };
            this.angle = tools_1.Tools.angleByPoints(track.p[0][0], track.p[0][1]);
            this.wheelAngle = 0;
            this.speed = 0;
            this.time = 0;
            this.stage = 0;
            this.fuel = 1;
        }
    }
    exports.Car = Car;
});
//# sourceMappingURL=car.js.map