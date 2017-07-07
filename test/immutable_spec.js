import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

	describe('a number', () => {

		function increment(currentState) {
			return currentState + 1;
		}

		it('is immutable', () => {
			let state = 42;
			let nextState = increment(state);

			expect(nextState).to.equal(43);
			expect(state).to.equal(42);
		});

	});

	describe('A List', () => {

		function addEntry(currentState, Entry) {
			return currentState.push(Entry);
		}

		it('is immutable', () => {
			let state = List.of('Russell Westbrook', 'James Harden');
			let nextState = addEntry(state, 'Kevin Durant');

			expect(nextState).to.equal(List.of(
				'Russell Westbrook',
				'James Harden',
				'Kevin Durant'
			));
			expect(state).to.equal(List.of(
				'Russell Westbrook',
				'James Harden'
			));
		});

	});

	describe('a tree', () => {

		function addEntry(currentState, Entry) {
			return currentState.update('Entries', Entries => Entries.push(Entry));
		}

		it('is immutable', () => {
		  let state = Map({
			Entries: List.of('Russell Westbrook', 'James Harden')
		  });
		  let nextState = addEntry(state, 'Kevin Durant');

		  expect(nextState).to.equal(Map({
			Entries: List.of(
			  'Russell Westbrook',
			  'James Harden',
			  'Kevin Durant'
			)
		  }));
		  expect(state).to.equal(Map({
			Entries: List.of(
			  'Russell Westbrook',
			  'James Harden'
			)
		  }));
		});

	});


});