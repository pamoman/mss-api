/* 
 * API - Helper functions
 */

module.exports = {
    getTypeOf: (type) => {
        let isUndefined = false,
            isNull = false,
            isArray = false,
            isNested = false,
            isBool = false;
    
        switch (true) {
            case typeof(type) === "undefined":
                isUndefined = true;
                break;
            case type === null:
                isNull = true;
                break;
            case Array.isArray(type):
                isArray = true;
    
                if (typeof(type[0]) === "object") {
                    isNested = true;
                }
                break;
            case typeof(type) === "object":
                isNested = true;
                break;
            case typeof(type) === "boolean":
                isBool = true;
                break;
            default:
                break;
        }
    
        return { isUndefined, isNull, isArray, isNested, isBool };
    }
}
