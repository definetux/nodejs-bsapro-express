class MathService {
	getFib(n) {
		return fetch('/api/math/fib/' + n).then((response) => {
			if (response.ok) {
				return response.json();
			}
		});
	}
}