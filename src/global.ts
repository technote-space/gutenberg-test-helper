/* eslint-disable @typescript-eslint/no-explicit-any */

interface Global extends NodeJS.Global {
	Mousetrap: any;
	window: any;
	document: any;
	navigator: any;
	wpMock: any;
	wp: {
		apiFetch?: any;
		blockEditor?: any;
		blockLibrary?: any;
		blocks?: any;
		components?: any;
		compose?: any;
		coreData?: any;
		data?: any;
		dom?: any;
		domReady?: any;
		editor?: any;
		element?: any;
		formatLibrary?: any;
		hooks?: any;
		i18n?: any;
		isShallowEqual?: any;
		keycodes?: any;
		richText?: any;
		serverSideRender?: any;
		url?: any;
	};
	mockStdout: {
		write: jest.Mock;
	};

	[key: string]: any;
}

declare const global: Global;
export default global;
