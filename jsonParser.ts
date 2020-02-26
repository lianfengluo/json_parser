const str: string = `{123: 123,   test: {'test': 'tttttt', 'ttt': {'color': 'test'}, true: "321", 123: [123, 321, 'test', [321,321]]}}`;

function addNumber(element: any, e: any) {
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

function nestedOperation(str: string, i: number, fun: (str: string) => {}, open: string, close: string) {
    let j = i + 1;
    let bracesCount: number = 1;
    let value: any;
    for (; j < str.length; ++j) {
        if (str[j] === close) {
            --bracesCount;
        } else if(str[j] === open) {
            ++bracesCount;
        }
        if (bracesCount === 0) {
            // enter the recursion
            value = fun(str.slice(i, j + 1));
            break;
        }
    }
    return [j, value]
}

function arrayParser(str: string) {
    const result: any[] = [];
    let usingQuote: boolean = false;
    let value: any = "";
    let i: number = 0;
    for (;str[i] !== '[' && i < str.length; ++i);
    for (++i; i < str.length; ++i) {
        const e = str[i];
        if (e === ' ') {
            continue;
        } else if (str[i] === '{') {
            [i, value] = nestedOperation(str, i, jsonParser, '{', '}');
        } else if (str[i] === '[') {
            [i, value] = nestedOperation(str, i, arrayParser, '[', ']');
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
            value = addNumber(value, e);
        }
    }
}

function jsonParser(str: string) {
    let isKey: boolean = true;
    const result: Object = {}
    // can be string or number;
    let key: any = "";
    let value: any = "";
    let i: number = 0;
    for (;str[i] !== '{' && i < str.length; ++i);
    let usingQuote: boolean = false;
    for (++i; i < str.length; ++i) {
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
            [i, value] = nestedOperation(str, i, jsonParser, '{', '}');
        } else if (e === '}') {
            result[key] = value;
            return result;
        } else if (e === '[') {
            [i, value] = nestedOperation(str, i, arrayParser, '[', ']');
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
            isKey ? key += e : value = addNumber(value, e);
        }
    }
    console.error("Invalid json string");
}
console.log(jsonParser(str));