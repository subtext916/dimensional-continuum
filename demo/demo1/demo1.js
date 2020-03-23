
let logger = (level, msg) => {
    window.console[level](msg);
};
setTimeout(() => {
    let largeArrayofRandoms = function(size) {
            let out = [];
            let iteration = () => {
                let output = [];
                let int = parseInt(size);
                while (int--) {
                    output.push(Math.random());
                }
                return output;
            };
            iteration();
            logger('info', 'iteration 1');
            iteration();
            logger('info', 'iteration 2');
            iteration();
            logger('info', 'iteration 3');
            iteration();
            logger('info', 'iteration 4');
            iteration();
            logger('info', 'iteration 5');
            iteration();
            logger('info', 'iteration 6');
            iteration();
            logger('info', 'iteration 7');
            iteration();
            logger('info', 'iteration 8');
            iteration();
            logger('info', 'iteration 9');
            iteration();
            logger('info', 'iteration 10');
            iteration();
            logger('info', 'iteration 11');
            iteration();
            logger('info', 'iteration 12');
            iteration();
            logger('info', 'iteration 13');
            iteration();
            logger('info', 'iteration 14');
            out.push(iteration());
            logger('info', 'iteration 15');

            return out;
        },
        dimensions = document.querySelector('dimensional-continuum');

    window.demo = {
        // Assign to global variable "dimensions" (for demo)
        component: dimensions,
        // Create a parallel thread instance
        parallel1: dimensions.createParallel({
            id: 'parallel1',
            on: {
                // And define expensive operations to run in parallel thread instance
                largeArrayofRandoms: largeArrayofRandoms
            },
            loglevel: {
                info: true
            }
        })
    };

    let _iterations = window.location.search.match(/iterations=[0-9]*/);
    let d1a, d1b;
    const iterations = (_iterations && _iterations.length === 1) ?
        _iterations[0].replace(/iterations=/, '') :
        200000;

    const demo1a = () => {
        // Test 1.A : Run in main thread
        d1a = {
            // Begin with getting timestamp
            begin: Date.now()
        };
        // Run expensive function
        d1a.result = largeArrayofRandoms(iterations);

        // Then get timestamp when done
        d1a.end = Date.now();

        d1a.dur = (d1a.end-d1a.begin)/1000;

        window.console.info(d1a);
    };
    const demo1b = () => {
        // Test 1.B : Run in worker thread
        d1b = {
            begin: Date.now()
        };

        // Fire invokation of large function in worker
        window.demo.parallel1.fire(
            'largeArrayofRandoms',
            iterations,
            {
                reply: true,
                callback: (repl) => {
                    d1b.end = Date.now();
                    d1b.dur = (d1b.end-d1b.begin)/1000;
                    d1b.result = repl;
                    window.console.info(d1b);

                    // Construct output of demo
                    document.querySelector('#demo').innerHTML = `
<div>
    <h1>Main thread vs worker</h1>
    <p><span>Iterations:</span> ${iterations} of running:</p>
    <code>
        Math.random();
    </code>
    
    <h2>Main Thread:</h2>
    <p><span>Duration:</span> ${d1a.dur}</p>
    
    <h2>Parallel Thread:</h2>
    <p><span>Duration:</span> ${d1b.dur}</p>
    
</div>
    `;
                }
            });
    };


    demo1b();
    demo1a();




},0);

