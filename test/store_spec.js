import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('store', () => {

	it('is a Redux store configured with the correct reduce', () => {
		const store = makeStore();
		expect(store.getState()).to.equal(Map());

		store.dispatch({
			type: 'SET_ENTRIES',
			entries: ['Russell Westbrook', 'James Harden']
		});
		expect(store.getState()).to.equal(fromJS({
			entries: ['Russell Westbrook', 'James Harden'],
			initialEntries: ['Russell Westbrook', 'James Harden']
		}));
	});
});