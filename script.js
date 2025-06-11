// const imgContElm = document.querySelector(".img-container");
// const imgElm = document.querySelector(".img-container img");
// const listProductsElm = document.querySelector(".list-products");


// let zoomScale = 1;


// imgContElm.addEventListener('mouseenter', () => {
//     imgElm.style.transform = `scale(${zoomScale})`;
// });
// imgContElm.addEventListener('mouseleave', () => {
//     imgElm.style.transform = 'scale(1)';
// });


// imgContElm.addEventListener('mousemove', function(mouseEvent) {
//     let rect = imgContElm.getBoundingClientRect();
//     let xpos = mouseEvent.pageX || mouseEvent.clientX + window.scrollX;
//     let ypos = mouseEvent.pageY || mouseEvent.clientY + window.scrollY;

    
//     xpos -= rect.left + window.scrollX;
//     ypos -= rect.top + window.scrollY;

//     const imgWidth = imgElm.offsetWidth;
//     const imgHeight = imgElm.offsetHeight;

    
//     const left = -((imgWidth - rect.width) * xpos / rect.width);
//     const top = -((imgHeight - rect.height) * ypos / rect.height);

//     imgElm.style.transformOrigin = `${xpos / rect.width * 100}% ${ypos / rect.height * 100}%`;
//     imgElm.style.transform = `scale(${zoomScale})`;
//     imgElm.style.position = 'absolute';
//     imgElm.style.left = left + 'px';
//     imgElm.style.top = top + 'px';
// });


// Array.from(listProductsElm.children).forEach((productElm) => {
//     productElm.addEventListener('click', () => {
//         const newSrc = productElm.querySelector('img').src;
//         imgElm.src = newSrc;

//         Array.from(listProductsElm.children).forEach(prod => prod.classList.remove('active'));
//         productElm.classList.add('active');
//     });
// });


// function changeHeight() {
//     imgContElm.style.height = imgContElm.clientWidth + 'px';
// }
// changeHeight();
// window.addEventListener('resize', changeHeight);


// imgContElm.addEventListener('wheel', (e) => {
//     e.preventDefault();

//     const delta = Math.sign(e.deltaY);
   
//     zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3); // limit zoom between 0.5x and 3x

//     imgElm.style.transform = `scale(${zoomScale})`;
//     imgElm.style.transformOrigin = 'center center';
// });


// let initialDistance = null;

// function getDistance(touches) {
//     const [touch1, touch2] = touches;
//     return Math.hypot(
//         touch2.pageX - touch1.pageX,
//         touch2.pageY - touch1.pageY
//     );
// }

// imgContElm.addEventListener('touchstart', (e) => {
//     if (e.touches.length === 2) {
//         initialDistance = getDistance(e.touches);
//     }
// });
// imgContElm.addEventListener('touchmove', (e) => {
//     if (e.touches.length === 2 && initialDistance) {
//         const currentDistance = getDistance(e.touches);
//         const scaleChange = currentDistance / initialDistance;
//         zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        
//         imgElm.style.transform = `scale(${zoomScale})`;
//         imgElm.style.transformOrigin = 'center center';
//         e.preventDefault(); 
//     }
// });
// imgContElm.addEventListener('touchend', () => {
//     initialDistance = null;
// });

const imgContElm = document.querySelector(".img-container");
const imgElm = imgContElm.querySelector("img");
const listProductsElm = document.querySelector(".list-products");

let zoomScale = 1;

function updateTransform(x = null, y = null) {
    if (x !== null && y !== null) {
        const rect = imgContElm.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;

        const left = -((imgElm.offsetWidth - rect.width) * offsetX / rect.width);
        const top = -((imgElm.offsetHeight - rect.height) * offsetY / rect.height);

        imgElm.style.transformOrigin = `${(offsetX / rect.width) * 100}% ${(offsetY / rect.height) * 100}%`;
        imgElm.style.left = `${left}px`;
        imgElm.style.top = `${top}px`;
    }

    imgElm.style.transform = `scale(${zoomScale})`;
    imgElm.style.position = 'absolute';
}

imgContElm.addEventListener('mouseenter', () => {
    updateTransform();
});
imgContElm.addEventListener('mouseleave', () => {
    zoomScale = 1;
    imgElm.style.transform = 'scale(1)';
    imgElm.style.left = '0';
    imgElm.style.top = '0';
});

imgContElm.addEventListener('mousemove', (e) => {
    updateTransform(e.clientX, e.clientY);
});

Array.from(listProductsElm.children).forEach((productElm) => {
    productElm.addEventListener('click', () => {
        const newSrc = productElm.querySelector('img').src;
        imgElm.src = newSrc;
        Array.from(listProductsElm.children).forEach(p => p.classList.remove('active'));
        productElm.classList.add('active');
    });
});

function changeHeight() {
    imgContElm.style.height = imgContElm.clientWidth + 'px';
}
changeHeight();
window.addEventListener('resize', changeHeight);

// Wheel zoom (desktop)
imgContElm.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // only prevent pinch gesture, not scroll
        const delta = Math.sign(e.deltaY);
        zoomScale = Math.min(Math.max(0.5, zoomScale - delta * 0.1), 3);
        updateTransform();
    }
}, { passive: false });

// Pinch zoom (mobile)
let initialDistance = null;

function getDistance(touches) {
    const [t1, t2] = touches;
    return Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
}

imgContElm.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
    }
}, { passive: true });

imgContElm.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        zoomScale = Math.min(Math.max(0.5, scaleChange), 3);
        updateTransform();
        e.preventDefault(); // block pinch only
    }
}, { passive: false });

imgContElm.addEventListener('touchend', () => {
    initialDistance = null;
});
