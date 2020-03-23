
setTimeout(() => {
    let dimensions = document.querySelector('dimensional-continuum');

    window.demo = {
        // Assign to global variable "dimensions" (for demo)
        component: dimensions
    };

    let _iterations = window.location.search.match(/iterations=[0-9]*/);
    const iterations = (_iterations && _iterations.length === 1) ?
        _iterations[0].replace(/iterations=/, '') :
        100;




},0);

