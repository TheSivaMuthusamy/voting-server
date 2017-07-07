import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer'

describe('reducer', () => {

	it('handles SET_ENTRIES', () => {
		const initialState = Map();
		const action = {type: 'SET_ENTRIES', entries: ['Russell Westbrook']};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Russell Westbrook'],
			initialEntries: ['Russell Westbrook']
		}));
	});

	it('handles NEXT', () => {
		const initialState = fromJS({
			entries: ['Russell Westbrook', 'James Harden']
		});
		const action = {type: 'NEXT'};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				round: 1,
				pair: ['Russell Westbrook', 'James Harden']
			},
			entries: []
		}));
	});

	it('handles VOTE', () => {
    	const initialState = fromJS({
      		vote: {
      			round: 1,
        		pair: ['Russell Westbrook', 'James Harden']
      		},
      		entries: []
    	});
    	const action = {type: 'VOTE', entry: 'Russell Westbrook', clientId: 'voter1'};
    	const nextState = reducer(initialState, action);

    	expect(nextState).to.equal(fromJS({
      		vote: {
      			round: 1,
        		pair: ['Russell Westbrook', 'James Harden'],
        		tally: {'Russell Westbrook': 1},
        		votes: {
        			voter1: 'Russell Westbrook'
        		}
      		},
      		entries: []
    	}));
  	});

  	it('has an initial state', () => {
    	const action = {type: 'SET_ENTRIES', entries: ['Russell Westbrook']};
    	const nextState = reducer(undefined, action);
    	expect(nextState).to.equal(fromJS({
      		entries: ['Russell Westbrook'],
      		initialEntries: ['Russell Westbrook']
    	}));
  	});

  	it('can be used with reduce', () => {
  		const actions = [
	  		{type: 'SET_ENTRIES', entries: ['Russell Westbrook', 'James Harden']},
	  		{type: 'NEXT'},
	    	{type: 'VOTE', entry: 'Russell Westbrook', clientId: 'voter1'},
	    	{type: 'VOTE', entry: 'James Harden', clientId: 'voter2'},
	    	{type: 'VOTE', entry: 'Russell Westbrook', clientId: 'voter3'},
	    	{type: 'NEXT'}
	    ];
	    const finalState = actions.reduce(reducer, Map());

	    expect(finalState).to.equal(fromJS({
	    	winner: 'Russell Westbrook',
	    	initialEntries: ['Russell Westbrook', 'James Harden']
	    }));
  	})
})