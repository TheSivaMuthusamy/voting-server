import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote, restart} from '../src/core';


describe('application logic', () => {

	describe('setEntries', () =>{

		it('converts to immutable', () => {
			const state = Map();
			const entries = ['Russell Westbrook', 'James Harden']
			const nextState = setEntries(state, entries);
      		expect(nextState).to.equal(Map({
        		entries: List.of('Russell Westbrook', 'James Harden'),
            initialEntries: List.of('Russell Westbrook', 'James Harden')
      		}));
		});
	});

	describe('next', () => {

		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Russell Westbrook', 'James Harden', 'Kevin Durant')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
          round: 1,
					pair: List.of('Russell Westbrook', 'James Harden')
				}),
				entries: List.of('Kevin Durant')
			}));
		});

		it('puts winner of current vote back to entries', () => {
			const state = Map({
				vote: Map({
          round: 1,
					pair: List.of('Russell Westbrook', 'James Harden'),
					tally: Map({
						'Russell Westbrook': 4,
						'James Harden': 2
					})
				}),
				entries: List.of('Kevin Durant', 'Kawhi Leonard', 'LeBron James')
			});
			const nextState = next(state);
			expect(nextState).to.equal(Map({
				vote: Map({
              round: 2,
        			pair: List.of('Kevin Durant', 'Kawhi Leonard')
      			}),
      			entries: List.of('LeBron James', 'Russell Westbrook')
			}));
		});

		it('puts both from tied vote back to entries', () => {
    		const state = Map({
      			vote: Map({
              round: 1,
        			pair: List.of('Russell Westbrook', 'James Harden'),
        			tally: Map({
          				'Russell Westbrook': 3,
          				'James Harden': 3
        			})
      			}),
      			entries: List.of('Kevin Durant', 'Kawhi Leonard', 'LeBron James')
    		});
    		const nextState = next(state);
    		expect(nextState).to.equal(Map({
      			vote: Map({
              round: 2,
        			pair: List.of('Kevin Durant', 'Kawhi Leonard')
      			}),
      			entries: List.of('LeBron James', 'Russell Westbrook', 'James Harden')
    		}));
  		});

  		it('marks winner when just one entry left', () => {
  			const state = Map({
  				vote: Map({
            round: 1,
  					pair: List.of('Russell Westbrook', 'James Harden'),
  					tally: Map({
  						'Russell Westbrook': 4,
  						'James Harden': 2
  					})
  				}),
  				entries: List()
  			});
  			const nextState = next(state);
  			expect(nextState).to.equal(Map({
  				winner: 'Russell Westbrook'
  			}));
  		});
	});

  describe('restart', () => {

    it('returns to initial entries and takes the first two entries under vote', () => {
      expect(
        restart(Map({
          vote: Map({
            round: 1,
            pair: List.of('Russell Westbrook', 'Kevin Durant')
          }),
          entries: List(),
          initialEntries: List.of('Russell Westbrook', 'James Harden', 'Kevin Durant')
        }))
      ).to.equal(
        Map({
          vote: Map({
            round: 2,
            pair: List.of('Russell Westbrook', 'James Harden')
          }),
          entries: List.of('Kevin Durant'),
          initialEntries: List.of('Russell Westbrook', 'James Harden', 'Kevin Durant')
        })
      );
    });

  });

	describe('vote', () => {
		
		it('creates a tally for the voted entry', () => {
			const state = Map({
        round: 1,
				pair: List.of('Russell Westbrook', 'James Harden')				
			});
			const nextState = vote(state, 'Russell Westbrook', 'voter1');
			expect(nextState).to.equal(Map({
        round: 1,
				pair: List.of('Russell Westbrook', 'James Harden'),
				tally: Map({
					'Russell Westbrook': 1
				}),
        votes: Map({
          voter1: 'Russell Westbrook'
        })
			}));
		});

		it('adds to existing tally for the voted entry', () => {
      		const state = Map({
              round: 1,
          		pair: List.of('Russell Westbrook', 'James Harden'),
          		tally: Map({
            		'Russell Westbrook': 3,
            		'James Harden': 2
          		})
      		});
      		const nextState = vote(state, 'Russell Westbrook', 'voter1');
      		expect(nextState).to.equal(Map({
              round: 1,
          		pair: List.of('Russell Westbrook', 'James Harden'),
          		tally: Map({
            		'Russell Westbrook': 4,
           			'James Harden': 2
          		}) ,
              votes: Map({
                voter1: 'Russell Westbrook'
              })         
      		}));
   		});

    it('ignores the vote if for an invalid entry', () => {
        expect(
          vote(Map({
            pair: List.of('Russell Westbrook', 'James Harden')
          }), 'Kevin Durant')
        ).to.equal(
          Map({
            pair: List.of('Russell Westbrook', 'James Harden')
          })
        );
    })
  });


});