const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let swapCount = 0;
let elapsedTime = 0;
let isPaused = false;
let startTime;
let sortInterval;

function drawArray(array, partitionIndex) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / array.length;
    for (let i = 0; i < array.length; i++) {
        if (i === partitionIndex) {
            ctx.fillStyle = 'red'; // パーティションインデックスを赤色で表示
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(i * barWidth, canvas.height - array[i] * 2, barWidth, array[i] * 2);
    }
}

async function bubbleSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapCount++;
                drawArray(array);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }
}

async function selectionSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function insertionSort(array) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
        }
        array[j + 1] = key;
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function quickSort(array, low, high) {
    if (low < high) {
        const pi = partition(array, low, high);
        drawArray(array, pi); // アニメーション表示
        await new Promise(resolve => setTimeout(resolve, 50));
        await quickSort(array, low, pi - 1);
        await new Promise(resolve => setTimeout(resolve, 50));
        await quickSort(array, pi + 1, high);
    }
}

function partition(array, low, high) {
    const pivot = array[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            swapCount++;
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return (i + 1);
}

async function heapSort(array) {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        await heapify(array, i, 0);
    }
}

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        await heapify(array, n, largest);
    }
}

function updateInfo() {
    document.getElementById('elementCount').textContent = array.length;
    document.getElementById('swapCount').textContent = swapCount;
    document.getElementById('elapsedTime').textContent = elapsedTime;
}

document.getElementById('sortAlgorithm').addEventListener('change', () => {
    const selectedAlgorithm = document.getElementById('sortAlgorithm').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArray(array);
    swapCount = 0;
    elapsedTime = 0;
    updateInfo();
    document.getElementById('startSortButton').disabled = false;
});

document.getElementById('randomizeButton').addEventListener('click', () => {
    array = Array.from({ length: 50 }, () => Math.floor(Math.random() * canvas.height / 2) + 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArray(array);
    swapCount = 0;
    elapsedTime = 0;
    updateInfo();
});

document.getElementById('startSortButton').addEventListener('click', async () => {
    const selectedAlgorithm = document.getElementById('sortAlgorithm').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArray(array);
    swapCount = 0;
    startTime = performance.now();
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            await bubbleSort([...array]);
            break;
        case 'selectionSort':
            await selectionSort([...array]);
            break;
        case 'insertionSort':
            await insertionSort([...array]);
            break;
        case 'quickSort':
            await quickSort([...array], 0, array.length - 1, null);
            break;
        case 'heapSort':
            await heapSort([...array]);
            break;
        case 'mergeSort':
            await mergeSort([...array], 0, array.length - 1);
            break;
    }
    elapsedTime = Math.round(performance.now() - startTime);
    updateInfo();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? '再開' : '一時停止';
});

async function mergeSort(array, left, right) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);
        await mergeSort(array, left, middle);
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        await mergeSort(array, middle + 1, right);
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        await merge(array, left, middle, right);
    }
}

async function merge(array, left, middle, right) {
    const n1 = middle - left + 1;
    const n2 = right - middle;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) {
        L[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = array[middle + 1 + j];
    }

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        k++;
    }

    while (i < n1) {
        array[k] = L[i];
        i++;
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        k++;
    }

    while (j < n2) {
        array[k] = R[j];
        j++;
        swapCount++;
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
        k++;
    }
}