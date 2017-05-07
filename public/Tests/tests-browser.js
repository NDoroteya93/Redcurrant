

describe('Task Gosho', function() {
	it('Test 1', function() {
		expect(2).to.equal(2);
	});

	it('Test 2', function() {
		expect(3).to.equal(3);
	});

	it('Equal test', function() {
		const array = [1, 2, 3];
		expect(array).to.equal(array);
	});
	it('Eql test', function() {
		const array1 = [1, 2, 3];
		const array2 = [1, 2, 3];
		expect(array1).to.eql(array2);
	});

	
	describe('Assertions', function() {
		it('Assert test', function() {
			assert(2 === 2, '2 is not 3');
		});
	});
});

