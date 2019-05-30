import {sprintf} from "./sprintf";

namespace javaemul.internal.DoubleHelper {

    export const POSITIVE_INFINITY = Infinity;
    export const NEGATIVE_INFINITY = -Infinity;
}

namespace javaemul.internal.StringHelper {

    export function format(formatString: string, ...args: any[]): string {
        return sprintf(formatString, args);
    }
}