/* eslint-disable no-magic-numbers, @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
import { JSDOM } from 'jsdom';
import enzyme from 'enzyme';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import lodash from 'lodash';
import { EOL } from 'os';
import { get, set } from 'lodash';
import global from './global';

export const setupGlobal = (settings?: {
  setUseRefMock?: boolean;
  setWp?: {
    apiFetch?: boolean;
    blockEditor?: boolean;
    blockLibrary?: boolean;
    blocks?: boolean;
    components?: boolean;
    compose?: boolean;
    coreData?: boolean;
    data?: boolean;
    dom?: boolean;
    domReady?: boolean;
    editor?: boolean;
    element?: boolean;
    formatLibrary?: boolean;
    hooks?: boolean;
    i18n?: boolean;
    isShallowEqual?: boolean;
    keycodes?: boolean;
    richText?: boolean;
    serverSideRender?: boolean;
    url?: boolean;
  };
  mockLodashDebounce?: boolean;
  mockMatchMedia?: boolean;
  mockStdout?: boolean;
  registerCoreBlocks?: boolean;
  removeAllFilters?: boolean;
  globalParams?: { [key: string]: any };
  setup?: (global: NodeJS.Global) => void;
}): void => {
  enzyme.configure({
    snapshotSerializers: ['enzyme-to-json/serializer'],
  });
  global.Mousetrap = Mousetrap;

  const dom        = new JSDOM('<!doctype html><html lang="en"><body></body></html>', {url: 'http://localhost'});
  global.window    = dom.window;
  global.document  = dom.window.document;
  global.navigator = dom.window.navigator;

  global.window.lodash = lodash;
  /* istanbul ignore next */
  if (settings?.mockLodashDebounce ?? true) {
    global.window.lodash.debounce = (fn: () => any): () => any => {
      const debounced = (): any => {
        return fn();
      };

      debounced.cancel = jest.fn();
      debounced.flush  = jest.fn();
      return debounced;
    };
  }
  /* istanbul ignore next */
  if (settings?.mockMatchMedia ?? true) {
    global.window.matchMedia = (): any => ({
      matches: true,
      addListener: (): void => {
        //
      },
      removeListener: (): void => {
        //
      },
    });
  }

  /* istanbul ignore next */
  if (settings?.mockStdout ?? true) {
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
  }

  const useRef  = (initialValue): any => {
    if (typeof initialValue === 'function') {
      return {
        current: (): any => ({}),
      };
    }
    return {
      current: {
        contains: (): boolean => false,
        focus: (): number => 0,
        getBoundingClientRect: (): any => ({width: 0, height: 0}),
        parentNode: {
          getBoundingClientRect: (): any => ({width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0}),
        },
        querySelectorAll: (): Array<any> => [],
      },
    };
  };
  global.wpMock = {
    blockEditor: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getColorObjectByColorValue: (colors: Array<any>, value?: string): any | undefined => undefined,
    },
    element: {
      useRef,
    },
  };

  jest.mock('@wordpress/block-editor', () => Object.assign({}, jest.requireActual('@wordpress/block-editor'), {
    getColorObjectByColorValue: (colors: Array<any>, value?: string): any | undefined => global.wpMock.blockEditor.getColorObjectByColorValue(colors, value),
  }));

  /* istanbul ignore next */
  if (settings?.setUseRefMock ?? true) {
    jest.mock('@wordpress/element', () => Object.assign({}, jest.requireActual('@wordpress/element'), {
      useRef: (initialValue): any => global.wpMock.element.useRef(initialValue),
    }));
  }

  global.wp     = {};
  const targets = {
    apiFetch: '@wordpress/api-fetch',
    blockEditor: '@wordpress/block-editor',
    blockLibrary: '@wordpress/block-library',
    blocks: '@wordpress/blocks',
    components: '@wordpress/components',
    compose: '@wordpress/compose',
    coreData: '@wordpress/core-data',
    data: '@wordpress/data',
    dom: '@wordpress/dom',
    domReady: '@wordpress/dom-ready',
    editor: '@wordpress/editor',
    element: '@wordpress/element',
    formatLibrary: '@wordpress/format-library',
    hooks: '@wordpress/hooks',
    i18n: '@wordpress/i18n',
    isShallowEqual: '@wordpress/is-shallow-equal',
    keycodes: '@wordpress/keycodes',
    richText: '@wordpress/rich-text',
    serverSideRender: '@wordpress/server-side-render',
    url: '@wordpress/url',
  };
  /* istanbul ignore next */
  Object.keys(targets).filter(target => undefined === settings?.setWp || undefined === settings.setWp[target] || true === settings.setWp[target]).forEach(target => {
    if ('domReady' === target) {
      global.wp[target] = require(targets[target]).default;
    } else {
      global.wp[target] = require(targets[target]);
    }
  });

  /* istanbul ignore next */
  if (settings?.registerCoreBlocks ?? true) {
    global.wp.blockLibrary.registerCoreBlocks();
  }
  /* istanbul ignore next */
  if (settings?.removeAllFilters ?? true) {
    global.wp.hooks.removeAllFilters('editor.BlockEdit');
  }
  /* istanbul ignore next */
  if (settings?.globalParams) {
    Object.keys(settings.globalParams).forEach(name => {
      set(global, name, get(settings?.globalParams, name));
    });
  }
  /* istanbul ignore next */
  if (settings?.setup) {
    settings.setup(global);
  }
};
