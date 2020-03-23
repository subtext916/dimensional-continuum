
setTimeout(() => {

    // Get reference to component
    window.demo = {
        dimensions: document.querySelector('dimensional-continuum'),

        // Generate set of elements for this demo
        generateElements: (number) => {
            let out = [];
            while (number--) {
                out.push({
                    type: 'div',
                    data: {
                        id: number,
                        text: `This is a test of ${number}`,
                        value: 'Some other data...'
                    }
                });
            }
            return out;
        }
    };

    let _iterations = window.location.search.match(/iterations=[0-9]*/);
    const iterations = (_iterations && _iterations.length === 1) ?
        _iterations[0].replace(/iterations=/, '') :
        100;

    window.demo.scene = window.demo.

    /**
     * Method createScene example
     */
    dimensions.createScene(
        {
            // Create scene of type "element-matrix"
            type: 'element-matrix',
            minHeight: 500, // ???
            layout: 'helix',
            template: (data) => {
                return `                        
                        <h5>Test ${data.id}</h5>
                        <span>${data.text}</span>                        
                        `;
            },
            on: {
                click: (element) => {
                    console.warn(element);
                }
            },
            elements: window.demo.generateElements(iterations) // layers are 25 elements each
        }
    );

    document.querySelector('#demo').style.display = 'none';

    // window.demo.scene.layout('sphere');

},0);

