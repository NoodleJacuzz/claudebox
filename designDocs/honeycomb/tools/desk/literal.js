//DESK -- a reader for JavaScript data literals that remembers WHERE everything is.
//
//The phone desk edits the game's content files in place. It does that by finding the exact characters of
//one value (one line of dialogue, one `lineArray`) and replacing only those, so every comment and every
//other byte of the file is left as it was. This file is the part that finds the characters.
//
//It reads objects, arrays, strings (with `+` between string literals), numbers, true/false/null/undefined
//and comments. Anything else -- a function, a variable, a template string -- throws `Unsupported`, and the
//caller treats that value as something the desk may show but must not write.
"use strict";

class Unsupported extends Error {}

function skipSpace(source, position) {
	for (;;) {
		const character = source[position];
		if (character === " " || character === "\t" || character === "\n" || character === "\r") { position++; continue; }
		if (character === "/" && source[position + 1] === "/") {
			while (position < source.length && source[position] !== "\n") position++;
			continue;
		}
		if (character === "/" && source[position + 1] === "*") {
			const close = source.indexOf("*/", position + 2);
			position = close < 0 ? source.length : close + 2;
			continue;
		}
		return position;
	}
}

function readStringLiteral(source, position) {
	const quote = source[position];
	let cursor = position + 1;
	let raw = "";
	while (cursor < source.length && source[cursor] !== quote) {
		if (source[cursor] === "\\") { raw += source[cursor] + source[cursor + 1]; cursor += 2; continue; }
		if (source[cursor] === "\n") throw new Unsupported("string runs past the end of its line at " + position);
		raw += source[cursor];
		cursor++;
	}
	if (cursor >= source.length) throw new Unsupported("string never closes at " + position);
	//The engine's own reading of the literal, so every escape means exactly what it means in the game.
	let value;
	try { value = (0, eval)(quote + raw + quote); } catch (error) { throw new Unsupported("unreadable string at " + position); }
	return { value: value, end: cursor + 1 };
}

function parseValue(source, position) {
	position = skipSpace(source, position);
	const character = source[position];
	if (character === "{") return parseObject(source, position);
	if (character === "[") return parseArray(source, position);
	if (character === '"' || character === "'") {
		//One or more string literals joined with `+` read as a single string value.
		const start = position;
		let text = "";
		let cursor = position;
		for (;;) {
			const piece = readStringLiteral(source, cursor);
			text += piece.value;
			cursor = piece.end;
			const after = skipSpace(source, cursor);
			if (source[after] !== "+") break;
			const next = skipSpace(source, after + 1);
			if (source[next] !== '"' && source[next] !== "'") throw new Unsupported("string joined to something that is not a string at " + after);
			cursor = next;
		}
		return { type: "string", value: text, start: start, end: cursor };
	}
	const word = /^-?[A-Za-z0-9_.$]+/.exec(source.slice(position, position + 64));
	if (word == null) throw new Unsupported("unreadable value at " + position);
	const token = word[0];
	const end = position + token.length;
	if (token === "true" || token === "false") return { type: "boolean", value: token === "true", start: position, end: end };
	if (token === "null" || token === "undefined") return { type: "null", value: null, start: position, end: end };
	if (/^-?(\d+\.?\d*|\.\d+)$/.test(token)) return { type: "number", value: Number(token), start: position, end: end };
	throw new Unsupported("`" + token + "` is code, not data, at " + position);
}

function parseObject(source, position) {
	const node = { type: "object", start: position, end: -1, propertyArray: [] };
	let cursor = skipSpace(source, position + 1);
	while (source[cursor] !== "}") {
		if (cursor >= source.length) throw new Unsupported("object never closes at " + position);
		let key;
		const keyStart = cursor;
		if (source[cursor] === '"' || source[cursor] === "'") {
			const piece = readStringLiteral(source, cursor);
			key = piece.value;
			cursor = piece.end;
		} else {
			const word = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(source.slice(cursor, cursor + 80));
			if (word == null) throw new Unsupported("unreadable key at " + cursor);
			key = word[0];
			cursor += key.length;
		}
		cursor = skipSpace(source, cursor);
		if (source[cursor] !== ":") throw new Unsupported("key `" + key + "` has no value at " + cursor);
		const value = parseValue(source, cursor + 1);
		node.propertyArray.push({ key: key, keyStart: keyStart, value: value });
		cursor = skipSpace(source, value.end);
		if (source[cursor] === ",") cursor = skipSpace(source, cursor + 1);
		else if (source[cursor] !== "}") throw new Unsupported("expected `,` or `}` at " + cursor);
	}
	node.end = cursor + 1;
	return node;
}

//Steps over one balanced `{...}` or `[...]` without understanding it, respecting strings and comments.
//Used to get past an array element the reader cannot read, so its neighbours are still found.
function skipBalanced(source, position) {
	let depth = 0;
	let cursor = position;
	while (cursor < source.length) {
		const character = source[cursor];
		if (character === '"' || character === "'" || character === "`") {
			cursor++;
			while (cursor < source.length && source[cursor] !== character) cursor += source[cursor] === "\\" ? 2 : 1;
			cursor++;
			continue;
		}
		if (character === "/" && (source[cursor + 1] === "/" || source[cursor + 1] === "*")) { cursor = skipSpace(source, cursor); continue; }
		if (character === "{" || character === "[" || character === "(") depth++;
		if (character === "}" || character === "]" || character === ")") { depth--; if (depth === 0) return cursor + 1; }
		cursor++;
	}
	throw new Unsupported("unbalanced brackets from " + position);
}

function parseArray(source, position, tolerant) {
	const node = { type: "array", start: position, end: -1, itemArray: [] };
	let cursor = skipSpace(source, position + 1);
	while (source[cursor] !== "]") {
		if (cursor >= source.length) throw new Unsupported("array never closes at " + position);
		let item;
		try {
			item = parseValue(source, cursor);
		} catch (error) {
			//A tolerant array keeps going past an element it cannot read (an event holding a function).
			if (tolerant !== true || !(error instanceof Unsupported) || (source[cursor] !== "{" && source[cursor] !== "[")) throw error;
			item = { type: "unsupported", start: cursor, end: skipBalanced(source, cursor), reason: error.message };
		}
		node.itemArray.push(item);
		cursor = skipSpace(source, item.end);
		if (source[cursor] === ",") cursor = skipSpace(source, cursor + 1);
		else if (source[cursor] !== "]") throw new Unsupported("expected `,` or `]` at " + cursor);
	}
	node.end = cursor + 1;
	return node;
}

//Finds `<name> = [` in a file and reads the array, element by element, tolerantly.
function parseNamedArray(source, name) {
	const match = new RegExp(name.replace(/[.$]/g, "\\$&") + "\\s*=\\s*\\[").exec(source);
	if (match == null) return null;
	return parseArray(source, match.index + match[0].length - 1, true);
}

function property(node, key) {
	if (node == null || node.type !== "object") return null;
	for (const entry of node.propertyArray) if (entry.key === key) return entry.value;
	return null;
}

//The tabs in front of the line a position is on.
function indentAt(source, position) {
	const lineStart = source.lastIndexOf("\n", position - 1) + 1;
	return /^[\t ]*/.exec(source.slice(lineStart, position))[0];
}

module.exports = { Unsupported, parseValue, parseNamedArray, property, indentAt };
