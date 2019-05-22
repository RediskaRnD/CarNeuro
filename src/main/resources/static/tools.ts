import {Point} from "./tools/Point";

export class Tools {

    // =====================================
    //векторное произведение
    static vm(p1: Point, p2: Point): number {

        return p1.x * p2.y - p2.x * p1.y;
    }

    // =====================================
    //проверка пересечения
    // p = {x, y}
    static linesCrossing(p1: Point, p2: Point, p3: Point, p4: Point): boolean {

        const v1 = this.vm(Tools.sub(p4, p3), Tools.sub(p1, p3));
        const v2 = this.vm(Tools.sub(p4, p3), Tools.sub(p2, p3));
        const v3 = this.vm(Tools.sub(p2, p1), Tools.sub(p3, p1));
        const v4 = this.vm(Tools.sub(p2, p1), Tools.sub(p4, p1));
        return (v1 * v2 < 0) && (v3 * v4 < 0);
    }

    // =====================================
    //поиск точки пересечения
    static crossPoint(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Point {

        const d = a1 * b2 - b1 * a2;
        const dx = -c1 * b2 + b1 * c2;
        const dy = -a1 * c2 + c1 * a2;
        return {x: dx / d, y: dy / d};
    }

    // =====================================
    //коэффициенты уравнения прямой вида: Ax + By + C = 0
    // p = {x, y}
    static lineEquation(p1: Point, p2: Point): { a: number, b: number, c: number } {

        const a = p2.y - p1.y;
        const b = p1.x - p2.x;
        const c = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
        return {a: a, b: b, c: c};
    }

    // =====================================
    // поиск точки пересечения
    static searchCrossPoints(p1: Point, p2: Point, p3: Point, p4: Point): Point | undefined {

        if (this.linesCrossing(p1, p2, p3, p4) == true) {
            const abc = this.lineEquation(p1, p2);
            const abc2 = this.lineEquation(p3, p4);
            return this.crossPoint(abc.a, abc.b, abc.c, abc2.a, abc2.b, abc2.c);
        }
        return undefined;
    }

    // =====================================
    // угол растёт по часовой стрелке
    static lineToAngle(p: Point, length: number, angle: number): Point {

        return {x: p.x + length * Math.cos(angle), y: p.y + length * Math.sin(angle)};
    }

    // =====================================

    static angleByPoints(p1: Point, p2: Point): number {

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let a = (Math.atan2(dy, dx));
        return a > 0 ? a : 2 * Math.PI + a;
    }

    // =====================================

    static sum(p1: Point, p2: Point): Point {

        return {x: p1.x + p2.x, y: p1.y + p2.y};
    }

    // =====================================

    static sub(p1: Point, p2: Point): Point {

        return {x: p1.x - p2.x, y: p1.y - p2.y};
    }
}

// =====================================

//     export interface Point {
//
//         x: number;
//         y: number;
//     }
//
//     export interface ColorPoint extends Point {
//
//         color: string;
//     }
// }