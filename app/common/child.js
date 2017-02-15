function fib(n) {
    var counter = 0;
    var a = 0, b = 1, f = 1;
    for(var i = 2; i <= n; i++) {
        f = a + b;
        a = b;
        b = f;
        if (counter === 10) {
            process.send({
                type: 'temp',
                data: f
            });
            counter = 0;
        }
        counter++;
    }
    return f;
}

process.on('message', (n) => {
    var result = fib(n);
    process.send({
        type: 'result',
        data: result
    });
});