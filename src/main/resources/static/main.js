define(["require", "exports", "./tools/Track", "./tools", "./car"], function (require, exports, Track_1, tools_1, car_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // var liaw = new Bezier([1,2,3,4]);
    // =====================================================================================================================
    let log;
    let vars;
    let input;
    let cnv;
    let ctx;
    let lastClickedTarget;
    //let Bezier: typeof BezierJs.Bezier;
    const eventTrackOnLoad = new CustomEvent("onLoad");
    let lastTimeTick = 0;
    let fps = 0;
    let requestAnimationId;
    let isFollowMode = true;
    // =====================================================================================================================
    // Canvas
    let scale = 1; // Масштаб
    let offset = { x: 0, y: 0 }; // Смещение видимой области (он логический! - масштабируется согласно scale)
    let virtualMousePosition = { x: 0, y: 0 }; // Положение мышки в виртуальной системе координат
    // Дорога
    let track;
    // Тачка
    let car;
    // Линии
    let isMouseDown = false;
    let mouseDownPoint = { x: 0, y: 0 };
    const pointsOfLines = [];
    // Точки пересечения
    const crossPointsSelf = [];
    let crossPointsWithCurve = [];
    // =====================================================================================================================
    // запрос на получения трека
    function getTrack() {
        debug("getTrack");
        const Http = new XMLHttpRequest();
        let url;
        if (window.location.hostname === "localhost") {
            url = 'http://localhost/getdata';
        }
        else {
            url = 'http://95.22.204.162/getdata';
        }
        Http.open("GET", url);
        Http.responseType = "json";
        Http.onload = () => {
            if (Http.readyState === Http.DONE) {
                if (Http.status === 200) {
                    track = new Track_1.Track(Http.response.track);
                    document.dispatchEvent(eventTrackOnLoad);
                }
            }
        };
        Http.send();
    }
    // =====================================================================================================================
    // Полный поиск точек пересечения линий с новой кривой
    function researchCrossPointsWithCurve() {
        // обнуляем старые точки
        crossPointsWithCurve = [];
        // проверка пересечений с кривой
        if (track) {
            const tLen = track.len;
            if (tLen < 2)
                return;
            // поиск ведем по левой и правой сторонам трека
            for (let tr = 1; tr < 3; tr++) {
                // отсекаем НЕпарную точку
                const numOfPoints = pointsOfLines.length - pointsOfLines.length % 2;
                // идём по всем точкам линий
                for (let i = 0; i < numOfPoints - 1; i += 2) {
                    for (let j = 0; j < tLen - 1; j++) {
                        let p = tools_1.Tools.searchCrossPoints(track.p[tr][j], track.p[tr][j + 1], pointsOfLines[i], pointsOfLines[i + 1]);
                        if (p) {
                            crossPointsWithCurve.push({
                                x: p.x,
                                y: p.y,
                                color: '#' + Math.random().toString(16).slice(-6)
                            });
                        }
                    }
                }
            }
        }
    }
    // =====================================================================================================================
    // отрисовываем все точки пересечения
    function drawCrossPoints() {
        for (let i = 0; i < crossPointsSelf.length; i++) {
            const p = crossPointsSelf[i];
            const tp = logicalToPhysical(p);
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.stroke();
        }
        for (let i = 0; i < crossPointsWithCurve.length; i++) {
            const p = crossPointsWithCurve[i];
            const tp = logicalToPhysical(p);
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.stroke();
        }
    }
    // =====================================================================================================================
    // отрисовываем все линии
    function drawLines() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        let numOfPoints = pointsOfLines.length;
        for (let i = 0; i < numOfPoints; i++) {
            if (i % 2 == 0) {
                ctx.beginPath();
            }
            let tp = logicalToPhysical(pointsOfLines[i]);
            ctx.lineTo(tp.x, tp.y);
            if (i % 2 == 1) {
                ctx.stroke();
            }
        }
    }
    // =====================================================================================================================
    // отрисовка трека
    function drawTrack() {
        if (!track === undefined)
            return;
        let p = track.p;
        // рисуем обочину
        ctx.lineWidth = Math.round(10 * scale);
        ctx.strokeStyle = "#444444";
        // for (let tr = 1; tr < 3; tr++) {
        //     ctx.beginPath();
        //     // for (let i = 0; i < track.len; i++) {
        //     //
        //     //     // var curve = new Bezier(150,40 , 80,30 , 105,150);
        //     //     //
        //     //     //
        //     //     // var draw = function() {
        //     //     //     drawSkeleton(curve);
        //     //     //     drawCurve(curve);
        //     //     // }
        //     //     let tp = logicalToPhysical(p[tr][i]);
        //     //     ctx.lineTo(tp.x, tp.y);
        //     // }
        //     for (let i = car.stage; i < track.len; i++) {
        //         let tp = logicalToPhysical(p[tr][i]);
        //         ctx.lineTo(tp.x, tp.y);
        //         if (car.stage < i) {
        //
        //         }
        //         if (tp.x < 0 || tp.x > cnv.width || tp.y < 0 || tp.y > cnv.height) {
        //             ctx.stroke();
        //             ctx.beginPath();
        //
        //             break;
        //         }
        //     }
        //     ctx.stroke();
        // }
        ctx.beginPath();
        // ищем левую часть вышедшую за экран
        let cp = physicalToLogical({ x: cnv.width, y: cnv.height });
        let bPrevIn = undefined;
        for (let i = 0; i < track.len; i++) {
            let tp = p[1][i];
            if (tp.x < -offset.x || tp.x > cp.x || tp.y < -offset.y || tp.y > cp.y) {
                // мы за границей экрана
                if (bPrevIn == true) {
                    tp = logicalToPhysical(tp);
                    ctx.lineTo(tp.x, tp.y);
                }
                bPrevIn = false;
            }
            else {
                // мы внутри экрана
                if (bPrevIn == false) {
                    // а были за границей
                    tp = logicalToPhysical(p[1][i - 1]);
                    ctx.moveTo(tp.x, tp.y);
                }
                tp = logicalToPhysical(p[1][i]);
                ctx.lineTo(tp.x, tp.y);
                bPrevIn = true;
            }
        }
        ctx.stroke();
        ctx.beginPath();
        bPrevIn = undefined;
        for (let i = 0; i < track.len; i++) {
            let tp = p[2][i];
            if (tp.x < -offset.x || tp.x > cp.x || tp.y < -offset.y || tp.y > cp.y) {
                // мы за границей экрана
                if (bPrevIn == true) {
                    tp = logicalToPhysical(tp);
                    ctx.lineTo(tp.x, tp.y);
                }
                bPrevIn = false;
            }
            else {
                // мы внутри экрана
                if (bPrevIn == false) {
                    // а были за границей
                    tp = logicalToPhysical(p[2][i - 1]);
                    ctx.moveTo(tp.x, tp.y);
                }
                tp = logicalToPhysical(p[2][i]);
                ctx.lineTo(tp.x, tp.y);
                bPrevIn = true;
            }
        }
        ctx.stroke();
        // // рисуем зебру
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "red";
        // for (let i = 0; i < track.len; i++) {
        //     if (car.stage - 2 <= i && i <= car.stage + 2) {
        //         ctx.beginPath();
        //         let tp = logicalToPhysical(p[1][i]);
        //         ctx.lineTo(tp.x, tp.y);
        //         tp = logicalToPhysical(p[2][i]);
        //         ctx.lineTo(tp.x, tp.y);
        //         ctx.stroke();
        //     }
        // }
        // // рисуем начало трасс
        // ctx.beginPath();
        // let tp = logicalToPhysical(track.p[0][0]);
        // let pd = Tools.sub(p[1][0], p[2][0]);
        // let r = Math.sqrt(pd.x * pd.x + pd.y * pd.y) * scale / 2;
        // ctx.arc(tp.x, tp.y, r, 0, 2 * Math.PI);
        // ctx.strokeStyle = "black";
        // ctx.fillStyle = "#a1a1a1";
        // ctx.fill();
        // ctx.stroke();
        //
        // // рисуем конец трассы
        // ctx.beginPath();
        // tp = logicalToPhysical(track.p[0][track.len - 1]);
        // pd = Tools.sub(p[1][track.len - 1], p[2][track.len - 1]);
        // r = Math.sqrt(pd.x * pd.x + pd.y * pd.y) * scale / 2;
        // ctx.arc(tp.x, tp.y, r, 0, 2 * Math.PI);
        // ctx.strokeStyle = "red";
        // ctx.fillStyle = "#a1a1a1";
        // ctx.fill();
        // ctx.stroke();
    }
    // =====================================================================================================================
    // рисуем тачку
    function drawCar() {
        // рисуем радиус поворота
        if (car.wheelAngle != 0) {
            ctx.beginPath();
            let tp = logicalToPhysical(car.ackerP);
            if (car.wheelAngle > 0) {
                ctx.arc(tp.x, tp.y, car.ackerR * scale, car.ackerA + Math.PI, car.ackerA + Math.PI * (1 + car.wheelAngle));
            }
            else {
                ctx.arc(tp.x, tp.y, car.ackerR * scale, car.ackerA + Math.PI * (1 + car.wheelAngle), car.ackerA - Math.PI);
            }
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = "#999999";
            ctx.stroke();
        }
        // рисуем спрайт тачки
        ctx.save();
        let carP = logicalToPhysical(car.p);
        ctx.translate(carP.x, carP.y);
        ctx.rotate(car.angle);
        ctx.drawImage(car.sprite, -car.width / 2 * scale, -car.height / 2 * scale, car.width * scale, car.height * scale);
        ctx.restore();
    }
    // =====================================================================================================================
    //рисуем сетку
    function drawGrid() {
        ctx.strokeStyle = "#666666";
        for (let i = -2000; i < 2001; i += 5) {
            // вдоль оси Y
            ctx.beginPath();
            ctx.lineTo((offset.x + i * 10), (-100000 + offset.y));
            ctx.lineTo((offset.x + i * 10), (100000 + offset.y));
            ctx.stroke();
            // вдоль оси X
            ctx.beginPath();
            ctx.lineTo((-100000 + offset.x), (offset.y + i * 10));
            ctx.lineTo((100000 + offset.x), (offset.y + i * 10));
            ctx.stroke();
        }
    }
    // =====================================================================================================================
    // перерисовываем экран
    function redrawCanvas() {
        if (requestAnimationId)
            requestAnimationId = requestAnimationFrame(redrawCanvas);
        cnv.width = cnv.clientWidth;
        cnv.height = cnv.clientHeight;
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        let t = performance.now();
        let dt = (t - lastTimeTick) / 1000;
        fps = 1 / (dt);
        lastTimeTick = t;
        // если машину не трогали то только отрисовываем её старое положение, вернёмся на следующем тике, с нормальным dt
        if (dt > 0.1 && car.speed == 0)
            dt = 0.01;
        car.calcPosition(dt);
        // проверка на выезд за трассу
        if (car.checkCollisions(track) == true) {
            //car.speed = 0;
            car.recoil(dt);
        }
        car.updateProgress(track);
        if (isFollowMode == true) {
            // помещаем тачку в центр
            offset.x = cnv.width / (2 * scale) - car.p.x;
            offset.y = cnv.height / (2 * scale) - car.p.y;
        }
        else {
            // переносим центральную точку обзора в центр нового канваса.
            let xOff = (cnv.clientWidth - cnv.width) / 2;
            let yOff = (cnv.clientHeight - cnv.height) / 2;
            offset.x += xOff / scale;
            offset.y += yOff / scale;
        }
        fillVars();
        if (track)
            drawTrack();
        drawLines();
        drawCrossPoints();
        //drawGrid();
        drawCar();
    }
    // =====================================================================================================================
    // меняем масштаб относительно положения мышки (scale и offset (offset - логический, скейлится согласно scale)
    function rescaleCanvas(rate, p) {
        const temp = scale;
        const sc = scale * rate;
        if (0.95 < sc && sc < 1.05) {
            scale = 1;
        }
        else {
            //scale = sc < 0.01 ? 0.01 : sc > 100 ? 100 : sc;
            scale = Math.min(Math.max(sc, 0.001), 1000);
        }
        // таким образом избегаем лишнего дёргания в крайних положениях зума
        if (temp == scale)
            return;
        offset.x = p.x / scale - virtualMousePosition.x;
        offset.y = p.y / scale - virtualMousePosition.y;
    }
    // =====================================================================================================================
    // конвертируем пиксели canvas в виртуальные координаты
    function physicalToLogical(p) {
        return { x: p.x / scale - offset.x, y: p.y / scale - offset.y };
    }
    // =====================================================================================================================
    // конвертируем виртуальные координаты в пиксели canvas
    function logicalToPhysical(p) {
        return { x: (p.x + offset.x) * scale, y: (p.y + offset.y) * scale };
    }
    // =====================================================================================================================
    // заполняем окно переменных
    function fillVars() {
        /// MouseEvent.arguments.clientX  не работает так как хотелось бы!!!
        // let x = MouseEvent.arguments != null ? MouseEvent.arguments.clientX : 0;
        // let y = MouseEvent.arguments != null ? MouseEvent.arguments.clientY : 0;
        let str = `FPS: . [${Math.round(fps)}]
    Scale: [${Math.round(scale * 1000) / 1000}]
    Offset:[${Math.round(offset.x)}, ${Math.round(offset.y)}]`;
        // if (track != undefined) {
        //     str += `\nTrack[0]:.[${track.points[0][0].x}, ${track.points[0][0].y}]
        //     Track[N]:.[${track.points[0][track.length - 1].x}, ${track.points[0][track.length - 1].y}]
        //     TrackMin:.[${track.xMin}, ${track.yMin}]
        //     TrackMax:.[${track.xMax}, ${track.yMax}]`;
        // }
        // const e = <MouseEvent>window.event;
        // let x = 0, y = 0;
        // if (e && e.clientX) {
        //     x = e.clientX;
        //     y = e.clientY;
        // }
        // str +=
        //     `\nMouseDwn: [${mouseDownPoint.x}, ${mouseDownPoint.y}]
        //     Mouse: [${x}, ${y}]
        //     CnvWH: [${cnv.width}, ${cnv.height}]
        //     CnvCWH:[${cnv.clientWidth}, ${cnv.clientHeight}]
        //     VirtMP:[${Math.round(virtualMousePosition.x)}, ${Math.round(virtualMousePosition.y)}]`;
        str +=
            `\nCar.p: [${Math.round(car.p.x)}, ${Math.round(car.p.y)}]
        
        Speed: [${Math.round(car.speed)}]`;
        // str += `\nAckP : [${Math.round(car.ackerP.x)}, ${Math.round(car.ackerP.y)}]
        //     AckR.: [${Math.round(car.ackerR)}]
        //     AckA.: [${Math.round(car.ackerA * 180 / Math.PI)}]
        //     Wheel: [${Math.round(car.wheelAngle * 180 / Math.PI)}]
        //     Angle: [${Math.round(car.angle * 180 / Math.PI)}]
        //     Keys.: [${car.keys}]`;
        str += `\nStage: [${car.stage}]`;
        let dt = performance.now() - lastTimeTick;
        str += `\nTick: [${Math.round(dt)}]`;
        vars.innerText = str;
    }
    // =====================================================================================================================
    // Init
    window.onload = () => {
        log = document.getElementById("log");
        log.debug("liaw");
        vars = document.getElementById("vars");
        input = document.getElementById("input");
        cnv = document.getElementById("canvas");
        ctx = cnv.getContext("2d");
        lastClickedTarget = cnv;
        window.addEventListener("resize", () => {
            if (requestAnimationId === undefined)
                redrawCanvas();
        });
        // =====================================
        document.addEventListener("onLoad", function () {
            debug("onLoad");
            // ставим тачку в центр
            offset.x = cnv.width / 2;
            offset.y = cnv.height / 2;
            researchCrossPointsWithCurve();
            // если загрузились все файлы - начинаем подготовку к старту.
            if (car.isReady && track)
                car.restart();
            if (requestAnimationId === undefined)
                redrawCanvas();
        });
        // =====================================
        cnv.addEventListener("mousedown", function (e) {
            isMouseDown = true;
            // запоминаем где зажали мышку
            // @ts-ignore
            lastClickedTarget = e.target;
            let x = e.clientX;
            let y = e.clientY;
            mouseDownPoint = { x, y };
            let numOfPoints;
            // проверяем что за кнопка нажата
            if (e.buttons & 1) { // Left button
                numOfPoints = pointsOfLines.push({ x: x / scale - offset.x, y: y / scale - offset.y });
                if (numOfPoints % 2 == 0) {
                    // проверка пересечений с кривой
                    if (track) {
                        for (let tr = 1; tr < 3; tr++) {
                            const len = track.len;
                            for (let i = 0; i < len - 1; i++) {
                                let p = tools_1.Tools.searchCrossPoints(track.p[tr][i], track.p[tr][i + 1], pointsOfLines[numOfPoints - 2], pointsOfLines[numOfPoints - 1]);
                                if (p) {
                                    crossPointsWithCurve.push({
                                        x: p.x,
                                        y: p.y,
                                        color: '#' + Math.random().toString(16).slice(-6)
                                    });
                                }
                            }
                        }
                    }
                    if (numOfPoints > 3) {
                        // поиск новых пересечений с себе подобными
                        for (let i = 0; i < numOfPoints - 3; i += 2) {
                            let p = tools_1.Tools.searchCrossPoints(pointsOfLines[i], pointsOfLines[i + 1], pointsOfLines[numOfPoints - 2], pointsOfLines[numOfPoints - 1]);
                            if (p) {
                                crossPointsSelf.push({
                                    x: p.x,
                                    y: p.y,
                                    color: '#' + Math.random().toString(16).slice(-6)
                                });
                            }
                        }
                    }
                }
                if (requestAnimationId === undefined)
                    redrawCanvas();
                return;
            }
            if (e.buttons & 4) { // Middle button
                // переключаем режим следования камеры за машиной
                isFollowMode = !isFollowMode;
                if (requestAnimationId === undefined)
                    redrawCanvas();
            }
        });
        // =====================================
        cnv.addEventListener("mouseup", function () {
            isMouseDown = false;
        });
        // =====================================
        cnv.addEventListener("mousemove", function (e) {
            virtualMousePosition = physicalToLogical({ x: e.clientX, y: e.clientY });
            if (isMouseDown == false) {
                //fillVars();
                return;
            }
            // Right button
            if (e.buttons & 2) {
                isFollowMode = false;
                offset.x += (e.clientX - mouseDownPoint.x) / scale;
                offset.y += (e.clientY - mouseDownPoint.y) / scale;
                mouseDownPoint.x = e.clientX;
                mouseDownPoint.y = e.clientY;
                if (requestAnimationId === undefined)
                    redrawCanvas();
            }
            // Middle button
            if (e.buttons & 4) {
            }
        });
        // =====================================
        cnv.addEventListener("wheel", function (e) {
            // e.preventDefault();
            // e.stopPropagation();
            rescaleCanvas(e.deltaY > 0 ? 0.9 : 10 / 9, { x: e.clientX, y: e.clientY });
            if (requestAnimationId === undefined)
                redrawCanvas();
        }, { passive: true });
        // =====================================
        cnv.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        // =====================================
        document.addEventListener("keydown", function (e) {
            switch (e.target) {
                case cnv:
                    let redrawRequest = 0;
                    // управление машиной
                    if (e.code === "KeyW") {
                        car.keys |= 1;
                        redrawRequest = 2;
                    }
                    if (e.code === "KeyS") {
                        car.keys |= 2;
                        redrawRequest = 2;
                    }
                    if (e.code === "KeyA") {
                        car.keys |= 4;
                        redrawRequest = redrawRequest > 1 ? redrawRequest : 1;
                    }
                    if (e.code === "KeyD") {
                        car.keys |= 8;
                        redrawRequest = redrawRequest > 1 ? redrawRequest : 1;
                    }
                    if (e.code === "KeyQ") {
                        //car.keys |= 16;
                        redrawRequest = 2;
                    }
                    if (e.code === "KeyE") {
                        //car.keys |= 32;
                        redrawRequest = 2;
                    }
                    // рестарт
                    if (e.code === "KeyR") {
                        car.restart();
                        redrawRequest = 1;
                    }
                    if (e.code === "Space") {
                        if (e.ctrlKey == true) {
                            getTrack();
                        }
                        else {
                            // просто перерисовываем канвас
                            //redrawRequest = redrawRequest > 1 ? redrawRequest : 1;
                        }
                        break;
                    }
                    switch (redrawRequest) {
                        case 1:
                            // просто перерисовываем канвас
                            if (requestAnimationId === undefined)
                                redrawCanvas();
                            break;
                        case 2:
                            // запускаем анимацию
                            if (requestAnimationId === undefined) {
                                debug("anim+");
                                requestAnimationId = requestAnimationFrame(redrawCanvas);
                            }
                            break;
                    }
                    break;
                case input:
                    if (e.code === "Enter") {
                        e.preventDefault();
                        debug(input.value);
                        input.value = "";
                    }
                    break;
                default:
                    break;
            }
        });
        // =====================================
        document.addEventListener("keyup", function (e) {
            if (e.target === cnv) {
                if (e.code === "KeyW")
                    car.keys &= ~1;
                if (e.code === "KeyS")
                    car.keys &= ~2;
                if (e.code === "KeyA")
                    car.keys &= ~4;
                if (e.code === "KeyD")
                    car.keys &= ~8;
                if (e.code === "KeyQ")
                    car.keys &= ~16;
                if (e.code === "KeyE")
                    car.keys &= ~32;
            }
        });
        // =====================================
        debug("Andreso loco");
        cnv.width = cnv.clientWidth;
        cnv.height = cnv.clientHeight;
        cnv.tabIndex = 0; // если убрать tabIndex то не будет работать event cnv.keyDown
        getTrack();
        cnv.focus();
        // инициализируем машину
        ctx.globalCompositeOperation = "source-over";
        car = new car_1.Car(60, 30, 60, 300);
        car.sprite.src = 'https://www.clipartmax.com/png/small/17-172157_racing-car-cartoon-car-top-view.png';
        car.sprite.onload = () => {
            debug("sprite");
            car.isReady = true;
            if (track)
                car.restart();
            if (requestAnimationId === undefined)
                redrawCanvas();
        };
    }; //version
});
// =====================================================================================================================
//# sourceMappingURL=main.js.map