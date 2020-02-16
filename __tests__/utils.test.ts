/* eslint-disable no-magic-numbers */
import { EOL } from 'os';
import { getFormatArgs, spyOnStdout, stdoutCalledWith, stdoutContains, testGlobalParam } from '../src';
import global from '../src/global';

describe('getFormatArgs', () => {
	it('should get default format args', () => {
		const args = getFormatArgs();
		expect(args.args.isActive).toBe(true);
		expect(args.args.value.start).toBe(0);
		expect(args.args.value.end).toBe(1);
		expect(args.args.value.text).toBe('text');
		expect(args.args.value.formats).toHaveLength(3);
		expect(args.args.value.formats[0]).toHaveLength(1);
		expect(args.args.value.formats[0][0].type).toBe('test/format');
		expect(args.formatName).toBe('test/format');
		expect(typeof args.args.onChange).toBe('function');
		expect(() => args.args.onChange({})).not.toThrow();
	});

	it('should get format args 1', () => {
		const fn   = jest.fn();
		const args = getFormatArgs({
			onChange: () => fn,
			formatName: 'abc/xyz',
			formats: [],
			text: 'abc',
			start: 1,
			end: 2,
			isActive: false,
		});
		expect(args.args.isActive).toBe(false);
		expect(args.args.value.start).toBe(1);
		expect(args.args.value.end).toBe(2);
		expect(args.args.value.text).toBe('abc');
		expect(args.args.value.formats).toHaveLength(0);
		expect(args.formatName).toBe('abc/xyz');
		args.args.onChange({});
		expect(fn).toBeCalledTimes(1);
	});

	it('should get format args 2', () => {
		const fn   = jest.fn();
		const args = getFormatArgs({
			onChange: () => fn,
			format: [
				{
					attributes: {style: 'color: red'},
					type: 'test/font-color',
					unregisteredAttributes: {},
				},
				{
					attributes: {style: 'font-size: 20px'},
					type: 'test/font-size',
					unregisteredAttributes: {},
				},
			],
			formatLength: 5,
		});
		expect(args.args.value.formats).toHaveLength(5);
		expect(args.args.value.formats[0]).toHaveLength(2);
		expect(args.args.value.formats[0][0].type).toBe('test/font-color');
		expect(args.args.value.formats[0][1].type).toBe('test/font-size');
	});
});

describe('useRef', () => {
	it('should use mock', () => {
		const {useRef} = global.wp.element;
		const testRef  = useRef(null);
		expect(testRef).toHaveProperty('current');
		expect(testRef.current).toHaveProperty('contains');
		expect(testRef.current).toHaveProperty('focus');
		expect(testRef.current).toHaveProperty('getBoundingClientRect');
		expect(testRef.current).toHaveProperty('parentNode');
		expect(testRef.current).toHaveProperty('querySelectorAll');
		expect(testRef.current.contains()).toBe(false);
		expect(testRef.current.focus()).toBe(0);
		expect(testRef.current.getBoundingClientRect()).toEqual({width: 0, height: 0});
		expect(testRef.current.parentNode.getBoundingClientRect()).toEqual({width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0});
		expect(testRef.current.querySelectorAll()).toEqual([]);
	});
});

describe('getColorObjectByColorValue', () => {
	it('should use mock', () => {
		const {getColorObjectByColorValue} = global.wp.blockEditor;
		expect(getColorObjectByColorValue([], 'test')).toBeUndefined();
	});
});

describe('spyOnStdout, stdoutCalledWith, stdoutCalledAtLeastOnce', () => {
	it('should spy on stdout', () => {
		const spy = spyOnStdout();

		process.stdout.write('test1' + EOL);
		process.stdout.write('test2' + EOL);
		console.log({
			test3: 'test3',
			test4: 'test4',
		});
		console.info({
			test5: 'test5',
			test6: 'test6',
		});
		console.error({
			test7: 'test7',
			test8: 'test8',
		});
		console.warn({
			test9: 'test9',
			test10: 'test10',
		});

		stdoutCalledWith(spy, [
			'test1',
			'test2',
			JSON.stringify({
				test3: 'test3',
				test4: 'test4',
			}, null, '\t'),
			'__info__' + JSON.stringify({
				test5: 'test5',
				test6: 'test6',
			}, null, '\t'),
			'__error__' + JSON.stringify({
				test7: 'test7',
				test8: 'test8',
			}, null, '\t'),
			'__warning__' + JSON.stringify({
				test9: 'test9',
				test10: 'test10',
			}, null, '\t'),
		]);

		stdoutContains(spy, [
			'test2',
			'__error__{\n\t"test7": "test7",\n\t"test8": "test8"\n}',
		]);

		expect(() => stdoutContains(spy, [
			'test3',
		])).toThrow();
	});
});

describe('testGlobalParam', () => {
	const setParams = testGlobalParam();

	it('should set global param', () => {
		expect(global).not.toHaveProperty('test_property');
		setParams('test_property', 'abc');
		expect(global).toHaveProperty('test_property');
		expect(global['test_property']).toBe('abc');
	});

	it('should set global default param', () => {
		expect(global).toHaveProperty('wp');
		expect(typeof global.wp).toBe('object');
		setParams('wp', 100);
		expect(global.wp).toBe(100);
	});

	it('should be reset', () => {
		expect(global).not.toHaveProperty('test_property');
		expect(typeof global.wp).toBe('object');
	});
});
describe('testGlobalParam with default params', () => {
	const setParams = testGlobalParam({
		default1: 'default1',
		default2: {
			value: 'default2',
		},
	});

	it('should set global param', () => {
		expect(global).toHaveProperty('default1');
		expect(global).toHaveProperty('default2');
		expect(global['default1']).toBe('default1');
		expect(global['default2']['value']).toBe('default2');
		setParams('default1', 0);
		setParams('default2.value', 0);
		setParams('default2.value', 2000);
		expect(global['default1']).toBe(0);
		expect(global['default2']['value']).toBe(2000);
	});

	it('should be reset', () => {
		expect(global).toHaveProperty('default1');
		expect(global).toHaveProperty('default2');
		expect(global['default1']).toBe('default1');
		expect(global['default2']['value']).toBe('default2');
	});
});
