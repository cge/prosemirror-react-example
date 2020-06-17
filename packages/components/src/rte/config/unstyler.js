/*
 * Modified output from : https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// Implementing foldLeft so we can apply lists of operations
export const foldLeft = function(iterable, zero, f) {
  const foldLeftArray = function(iterable, zero, f) {
    let memo = zero;
    for (let n of Array.from(iterable)) {
      memo = f(memo, n);
    }
    return memo;
  };
  if (iterable instanceof Array) {
    return foldLeftArray(iterable, zero, f);
  }
  const fPair = (zero, pair) => f(zero, pair[1], pair[0]);
  return foldLeftArray(
    (() => {
      const result = [];
      for (let k in iterable) {
        const v = iterable[k];
        result.push([k, v]);
      }
      return result;
    })(),
    zero,
    fPair
  );
};

// Another common utility function that's very useful for handling lists
export const takeWhile = function(iterable, f) {
  const l = [];
  for (let i of Array.from(iterable)) {
    if (f(i)) {
      l.push(i);
    } else {
      break;
    }
  }
  return l;
};

// Higher order function for text replacement operations
const replaceOp = (regex, replacement) => text =>
  text.replace(new RegExp(regex.source, 'mg'), replacement);

// Higher order function for text removal operations
const removeOp = regex => text =>
  text.replace(new RegExp(regex.source, 'mg'), '');

const transformOp = (regex, transformFunc) =>
  function(text) {
    // Create function to replace segment with new content
    let m;
    const overwriteOp = function(i, j, str) {
      // Function which inserts the string at the specified index
      const f = t =>
        t.slice(0, Number(i - 1) + 1 || undefined) + str + t.slice(j);
      // Override toString so debugging is easier
      f.toString = () => 'Overwrite @ ' + i + '-' + j + ': ' + str;
      // Return function
      return f;
    };
    let i = 0;
    const operations = [];
    while ((m = text.slice(i).match(regex))) {
      const matchStr = m[0];
      const foundAt = i + m.index;
      const untilIndex = foundAt + matchStr.length;
      operations.push(overwriteOp(foundAt, untilIndex, transformFunc(m)));
      i = untilIndex;
    }
    return foldLeft(operations.reverse(), text, (text, f) => f(text));
  };

// Find a MS Word paragraphs that are actually list items
const locateLists = function(text) {
  let m;
  const re = /<p[^>]+style='[^']*mso-list:[\s\S]+?<\/p>/m;
  const indexes = [];
  let i = 0;
  while ((m = text.slice(i).match(re))) {
    const matchStr = m[0];
    const foundAt = i + m.index;
    const untilIndex = foundAt + matchStr.length;
    const msoList = matchStr.match(/l(\d+) level(\d+)/);
    const rootId = parseInt(msoList[1]);
    const depth = parseInt(msoList[2]);
    const listType = function(str) {
      if (/^<p[^>]*>(?:\s|&nbsp;)*[a-z0-9]+\.(&nbsp;\s*)+/.test(str)) {
        return 'ol';
      }
      return 'ul';
    };
    indexes.push({
      start: foundAt,
      end: untilIndex,
      type: listType(text.slice(foundAt, untilIndex)),
      root: rootId,
      depth
    });
    i = untilIndex;
  }
  return indexes;
};

// Convert MS Word lists to actual HTML lists. Handles nesting.
const convertLists = function(text) {
  // Create function to insert string at index
  const insertOp = function(i, str) {
    // Function which inserts the string at the specified index
    const f = t =>
      t.slice(0, Number(i - 1) + 1 || undefined) + str + t.slice(i);
    // Override toString so debugging is easier
    f.toString = () => 'Insert @ ' + i + ': ' + str;
    // Return function
    return f;
  };
  // Specialized versions of insertOp
  const openListOp = indexes =>
    insertOp(indexes[0].start, '<' + indexes[0].type + '>');
  const closeListOp = indexes =>
    insertOp(indexes[indexes.length - 1].end, '</' + indexes[0].type + '>');
  // Handle increasing depth for lists by checking for depth increases
  // for second-element onwards and recursively handling.
  var partitionDepths = function(l) {
    if (l.length === 0) {
      return [];
    }
    const differentDepth = takeWhile(l.slice(1), i => l[0].depth !== i.depth);
    if (differentDepth.length === 0) {
      return [].concat(
        [insertOp(l[0].start, '<li>'), insertOp(l[0].end, '</li>')],
        partitionDepths(l.slice(1))
      );
    }
    return [].concat(
      [insertOp(l[0].start, '<li>'), openListOp(differentDepth)],
      partitionDepths(differentDepth),
      [
        closeListOp(differentDepth),
        insertOp(differentDepth[differentDepth.length - 1].end, '</li>')
      ],
      partitionDepths(l.slice(differentDepth.length + 1))
    );
  };
  // Get insertions by breaking up lists by root ID
  var partitionRoots = function(l) {
    if (l.length === 0) {
      return [];
    }
    const sameRoot = takeWhile(l, i => l[0].root === i.root);
    return [].concat(
      [openListOp(sameRoot)],
      partitionDepths(sameRoot),
      [closeListOp(sameRoot)],
      partitionRoots(l.slice(sameRoot.length))
    );
  };
  // Find a MS Word paragraphs that are actually list items
  const indexes = locateLists(text);
  if (indexes.length === 0) {
    return text;
  }
  // Assemble insertion actions to perform
  const insertions = partitionRoots(indexes);
  // Apply insertions in reverse, so indexes remain valid
  return foldLeft(insertions.reverse(), text, (text, f) => f(text));
};

// Based on Jeff Atwood's "Cleaning Word's Nasty HTML"
// http://www.codinghorror.com/blog/2006/01/cleaning-words-nasty-html.html
const operations = [
  // nothing useful comes after </html>
  removeOp(/(?:<\/html>)[\s\S]+/),
  // get rid of unnecessary tag spans (comments and title)
  removeOp(/<!--(\w|\W)+?-->/),
  removeOp(/<title>(\w|\W)+?<\/title>/),
  // Upper-case to lower conversion
  transformOp(
    /(<\/?)(P|BR|B|I|STRONG|UL|OL|LI)([^>]*?>)/,
    match => match[1] + match[2].toLowerCase() + match[3]
  ),
  // Get rid of unnecessary tags
  removeOp(
    /<(meta|link|\/?o:|\/?style|\/?div|\/?st\d|\/?head|\/?html|body|\/?body|\/?span|!\[)[^>]*?>/
  ),
  // Get rid of empty paragraph tags
  removeOp(/(<[^>]+>)+&nbsp;(<\/\w+>)+/),
  // remove bizarre v: element attached to <img> tag
  removeOp(/\s+v:\w+=""[^""]+""/),
  // remove extra lines
  removeOp(/(\n\r){2,}/),
  // Fix mdash
  replaceOp(/Ã¢â‚¬â€œ/, '&mdash;'),
  // Extract "mso-list" style to attributes
  convertLists,
  // Filter textual ordered list points (real ones should now exist)
  replaceOp(
    /(?:<p[^>]*>(?:(?:&nbsp;)+\s*)?[a-z0-9]+\.)(?:&nbsp;\s*)+([^<]+)<\/p>/,
    '$1'
  ),
  // Filter textual unordered list points (real ones should now exist)
  replaceOp(/(?:<p[^>]*>[·o§])(?:&nbsp;\s*)+([^<]+)<\/p>/, '$1'),
  // Get rid of classes and styles
  // (Note: "new RegExp" used to avoid bad editor highlighting)
  removeOp(new RegExp('\\s?class=(?:\'[^\']*\'|"[^"]*"|\\w+)')),
  removeOp(new RegExp('\\s+style=(?:\'[^\']*\'|"[^"]*")')),
  // Get rid of list styles
  replaceOp(new RegExp('(<[ou]l)\\s+type=(?:\'[^\']+\'|"[^""]+")'), '$1'),
  // Replace bold with strong
  replaceOp(/<b>([^<]*)<\/b>/, '<strong>$1</strong>'),
  // Replace italic with em
  replaceOp(/<i>([^<]*)<\/i>/, '<em>$1</em>'),
  // Ensure breaks are closed
  replaceOp(/<br>(?:<\/br>)?/, '<br/>'),
  // Ensure list items are closed
  replaceOp(/(<li>[^<]*?)(?=\s*<li)/, '$1</li>'),
  // Convert \r\n to just \n
  replaceOp(/(\r\n)/, '\n')
];

// export const unstyle = html => foldLeft(operations, html, (text, f) => f(text));
export const unstyle = html =>
  foldLeft(operations, html, (text, f) => f(text)).trim();
