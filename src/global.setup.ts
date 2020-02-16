/* eslint-disable no-magic-numbers, @typescript-eslint/no-explicit-any */
import { JSDOM } from 'jsdom';
import enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import lodash from 'lodash';
import { EOL } from 'os';
import global from './global';

export const setupGlobal = (): void => {
	enzyme.configure({
		adapter: new EnzymeAdapter(),
		snapshotSerializers: ['enzyme-to-json/serializer'],
	});
	global.Mousetrap = Mousetrap;

	const dom        = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost'});
	global.window    = dom.window;
	global.document  = dom.window.document;
	global.navigator = dom.window.navigator;

	global.window.lodash          = lodash;
	global.window.lodash.debounce = (fn: () => any): Function => {
		const debounced = (): any => {
			return fn();
		};

		debounced.cancel = jest.fn();
		debounced.flush  = jest.fn();
		return debounced;
	};
	global.window.matchMedia      = (): object => ({
		matches: true,
		addListener: (): void => {
			//
		},
	});

	global.mockStdout    = {
		write: jest.fn(),
	};
	process.stdout.write = global.mockStdout.write;
	type converterType = (value: any) => boolean;
	const converter = (prefix = ''): converterType => (value: any): boolean => process.stdout.write(prefix + JSON.stringify(value, null, '\t') + EOL);
	console.log     = jest.fn(converter());
	console.info    = jest.fn(converter('__info__'));
	console.error   = jest.fn(converter('__error__'));
	console.warn    = jest.fn(converter('__warning__'));

	global.wp = {
		apiFetch: require('@wordpress/api-fetch'),
		blockEditor: require('@wordpress/block-editor'),
		blockLibrary: require('@wordpress/block-library'),
		components: require('@wordpress/components'),
		coreData: require('@wordpress/core-data'),
		data: require('@wordpress/data'),
		dom: require('@wordpress/dom'),
		editor: require('@wordpress/editor'),
		element: require('@wordpress/element'),
		hooks: require('@wordpress/hooks'),
		i18n: require('@wordpress/i18n'),
		isShallowEqual: require('@wordpress/is-shallow-equal'),
		keycodes: require('@wordpress/keycodes'),
		richText: require('@wordpress/rich-text'),
		serverSideRender: require('@wordpress/server-side-render'),
		url: require('@wordpress/url'),
	};

	global.wp.blockLibrary.registerCoreBlocks();
	global.wp.hooks.removeAllFilters('editor.BlockEdit');
};
