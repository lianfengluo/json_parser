const str: string = `{123: 123,   test: {'test': 'tttttt', 'ttt': {'color': 'test'}, true: "321", 123: [123, 321, 'test', [321,321]]}}`;

function add_number(element: any, e: any) {
    return (+element) * 10 + (+e);
}

function keywordConvert(str: string) {
    if (str === 'null') {
        return null;
    } else if (str === 'false') {
        return false;
    } else if (str === 'true') {
        return true;
    } else if (str === 'undefined') {
        return undefined;
    }
    return str;
}

function array_parser(str: string) {
    const result: any[] = [];
    let usingQuote: boolean = false;
    let value: any = "";
    let i: number = 0;
    while (str[i] !== '[' && i < str.length) {
        ++i;
    }
    ++i;
    for (; i < str.length; ++i) {
        const e = str[i];
        if (e === ' ') {
            continue;
        } else if (str[i] === '{') {
            let j = i + 1;
            let bracesCount: number = 1;
            for (; j < str.length; ++j) {
                if (str[j] === '}') {
                    --bracesCount;
                } else if(str[j] === '{') {
                    ++bracesCount;
                }
                if (bracesCount === 0) {
                    // enter the recursion
                    value = json_parser(str.slice(i, j + 1));
                    break;
                }
            }
            i = j;
        } else if (str[i] === '[') {
            let j = i + 1;
            let bracesCount: number = 1;
            for (; j < str.length; ++j) {
                if (str[j] === ']') {
                    --bracesCount;
                } else if(str[j] === '[') {
                    ++bracesCount;
                }
                if (bracesCount === 0) {
                    // enter the recursion
                    value = array_parser(str.slice(i, j + 1));
                    break;
                }
            }
            i = j;
        } else if (str[i] === ']') {
            result.push(value);
            return result;
        } else if (e === `'` || e === `"`) {
            let j = i + 1
            usingQuote = true;
            for (; j < str.length; ++j) {
                if (str[j] === e) break;
            }
            value = str.slice(i + 1, j);
            i = j;
        } else if (e === ',') {
            !usingQuote && (typeof value === "string") && (value = keywordConvert(value));
            result.push(value);
            value = '';
            usingQuote = false;
        } else {
            value = add_number(value, e);
        }
    }
}

function json_parser(str: string) {
    let isKey: boolean = true;
    const result: Object = {}
    // can be string or number;
    let key: any = "";
    let value: any = "";
    let i: number = 0;
    while (str[i] !== '{' && i < str.length) {
        ++i;
    }
    ++i;
    let usingQuote: boolean = false;
    for (; i < str.length; ++i) {
        const e = str[i];
        if (e === ' ') {
            continue;
        } else if (e === `'` || e === `"`) {
            let j = i + 1
            usingQuote = true;
            for (; j < str.length; ++j) {
                if (str[j] === e) break;
            }
            (isKey) ? key = str.slice(i + 1, j) : value = str.slice(i + 1, j);
            i = j;
        } else if (e === '{') {
            let bracesCount: number = 1;
            // find the closing braces
            let j = i + 1;
            for (; j < str.length; ++j) {
                if (str[j] === '}') {
                    --bracesCount;
                } else if(str[j] === '{') {
                    ++bracesCount;
                }
                if (bracesCount === 0) {
                    // enter the recursion
                    value = json_parser(str.slice(i, j + 1));
                    break;
                }
            }
            i = j;
        } else if (e === '}') {
            result[key] = value;
            return result;
        } else if (e === '[') {
            let bracesCount: number = 1;
            // find the closing braces
            let j = i + 1;
            for (; j < str.length; ++j) {
                if (str[j] === ']') {
                    --bracesCount;
                } else if(str[j] === '[') {
                    ++bracesCount;
                }
                if (bracesCount === 0) {
                    // enter the recursion
                    value = array_parser(str.slice(i, j + 1));
                    break;
                }
            }
            i = j;
        }  else if (e === ':') {
            isKey = !isKey;
            !usingQuote && (typeof key === "string") && (key = keywordConvert(key));
            usingQuote = false;
        } else if (e === ',') {
            !usingQuote && (value = keywordConvert(value));
            usingQuote = false;
            result[key] = value;
            key = "";
            value = "";
            isKey = !isKey;
        } else {
            isKey ? key += e : value = add_number(value, e);
        }
    }
    console.error("Invalid json string");
}
console.log(json_parser(str));