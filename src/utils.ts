/* eslint-disable no-magic-numbers, @typescript-eslint/no-explicit-any */
import { EOL } from 'os';
import { has, get, set, unset } from 'lodash';
import SpyInstance = jest.SpyInstance;
import global from './global';

export type FormatType = {
	attributes: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
	type: string;
	unregisteredAttributes: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
};
export type FormatChangeFuncType = (value: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
export type FormatArgsType = {
	args: {
		isActive: boolean;
		value: {
			start: number;
			end: number;
			text: string;
			formats: Array<Array<FormatType>>;
		};
		onChange: FormatChangeFuncType;
	};
	formatName: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFormatArgs = (settings?: {
	onChange?: (formatName: string) => FormatChangeFuncType;
	formatName?: string;
	format?: Array<FormatType>;
	formatLength?: number;
	formats?: Array<Array<FormatType>>;
	text?: string;
	start?: number;
	end?: number;
	isActive?: boolean;
}): FormatArgsType => {
  const onChange   = settings?.onChange ?? (() => (): void => {
    //
  });
  const formatName = settings?.formatName ?? 'test/format';
  const formats    = settings?.formats ?? Array(settings?.formatLength ?? 3).fill(settings?.format ?? [
    {
      attributes: {},
      type: formatName,
      unregisteredAttributes: {},
    },
  ]);
  const text       = settings?.text ?? 'text';
  const start      = settings?.start ?? 0;
  const end        = settings?.end ?? 1;
  const isActive   = settings?.isActive ?? true;

  return {
    args: {
      isActive,
      value: {
        start,
        end,
        text,
        formats,
      },
      onChange: onChange(formatName),
    },
    formatName: formatName,
  };
};

export const spyOnStdout      = (): SpyInstance => jest.spyOn(global.mockStdout, 'write');
export const stdoutCalledWith = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock).toBeCalledTimes(messages.length);
  messages.forEach((message, index) => {
    expect(spyOnMock.mock.calls[index][0]).toBe(message + EOL);
  });
};
export const stdoutContains   = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock.mock.calls.map(value => value[0].trim())).toEqual(expect.arrayContaining(messages));
};

export const testGlobalParam = (defaultParams?: { [key: string]: any }): (path: string, param: any) => void => {
  let params: { [key: string]: any } = {};
  let backup: { [key: string]: any } = {};

  const setParam = (path: string, param: any): void => {
    if (has(global, path) && !(path in params)) {
      set(backup, path, get(global, path));
    }

    params[path] = true;
    set(global, path, param);
  };

  beforeEach(() => {
    if (defaultParams) {
      Object.keys(defaultParams).forEach(key => {
        setParam(key, defaultParams[key]);
      });
    }
  });

  afterEach(() => {
    Object.keys(params).reverse().forEach(path => {
      if (has(backup, path)) {
        set(global, path, get(backup, path));
      } else {
        unset(global, path);
      }
    });

    params = {};
    backup = {};
  });

  return (path: string, param: any): void => {
    setParam(path, param);
  };
};
