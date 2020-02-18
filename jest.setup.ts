import { setupGlobal } from './src';

setupGlobal({
	globalParams: {
		testParams: {
			test1: 1,
			test2: 'test2',
			// eslint-disable-next-line no-magic-numbers
			test3: [1, 2, 3],
			test4: {
				'test4-1': 1,
				'test4-2': 2,
			},
		},
	},
	setup: () => {
		//
	},
});
