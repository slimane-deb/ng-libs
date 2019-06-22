import { ListingField } from './listingField';
import { ListingHeader } from './listingHeader';

const regLiteral = /^([a-zA-Z]+)(->[a-zA-Z]+)*$/;

function verifyExpression(str : string) {
        str = str.replace(/\s/g,'');
        if (!regLiteral.test(str)) {
            throw "Value in ListingDeco decorator must match a specific litteral {word->word->word}"
        }
    return str;
}

function parseHref(href : string) {
    href = href.replace(/\s/g,'');
    href = href.split('->').join('.');
    return href;
}

function camelToLLabel(camelCase : string) : string {
    return camelCase
    // inject space before the upper case letters
    .replace(/([A-Z])/g, function(match) {
       return " " + match;
    })
    // replace first char with upper case
    .replace(/^./, function(match) {
      return match.toUpperCase();
    })
    .trim();
  }

export function ListingDeco(listingField : ListingField) {
    if (!listingField.width) listingField.width = null;
    if (listingField.value) listingField.value = verifyExpression(listingField.value);
    if (listingField.href) listingField.href = parseHref(listingField.href);

    return function(target : any, key : string) {
        if (!listingField.label) listingField.label = camelToLLabel(key);
        target[key] = listingField;
    }
}

export function ListingHeader(header : ListingHeader) {
    if (header.globalSearch == undefined) header.globalSearch = true;
    if (header.resizeColomns == undefined) header.resizeColomns = false;
    if (header.searchRow == undefined) header.searchRow = false;
    if (header.url == undefined) header.url = null;

    return function(target : any) {
        target.prototype.headers = header;
    }
}