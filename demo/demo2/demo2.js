
setTimeout(() => {

    // Get reference to component
    window.demo = {
        dimensions: document.querySelector('dimensional-continuum')
    };

    // Create scene of type "cube"
    window.demo.scene = window.demo.dimensions.createScene({
        type: 'cube'
    });

},0);

