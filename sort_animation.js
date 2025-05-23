const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let array = [];
let swapCount = 0;
let elapsedTime = 0;
let isPaused = false;
let isStepMode = false;
let stepResolve = null;
let sortStartTime;
let sortEndTime;
let totalSortTime = 0;
let pauseStartTime;
let totalPauseTime = 0;
let sortInterval;
let timerInterval;
let activeIndices = [];
let compareIndices = [];
let sortedIndices = new Set();

// Algorithm descriptions
const algorithmDescriptions = {
    bubbleSort: "バブルソートは隣接する要素を比較し、必要に応じて交換する単純なソートアルゴリズムです。最悪計算時間はO(n²)で、大規模なデータセットには非効率です。",
    selectionSort: "選択ソートは未整列部分から最小値を見つけて整列済み部分の末尾に移動させます。常にO(n²)の計算時間で、大規模なデータセットには非効率です。",
    insertionSort: "挿入ソートは整列済み部分に新要素を適切な位置に挿入します。小さな配列に効率的で、最悪計算時間はO(n²)です。",
    quickSort: "クイックソートは分割統治法に基づく高速なソートアルゴリズムです。平均計算時間はO(n log n)で、多くの実装で使用されています。",
    heapSort: "ヒープソートはヒープデータ構造を使用するソートアルゴリズムです。計算時間はO(n log n)で、メモリ使用量も効率的です。",
    mergeSort: "マージソートは分割統治法に基づくアルゴリズムで、配列を分割し、整列後にマージします。安定的なO(n log n)の計算時間が特徴です。"
};

// 色のグラデーション生成
function getGradientColor(value, max) {
    // HSL色空間を使用 (hue: 0-360, saturation: 0-100%, lightness: 0-100%)
    const hue = (240 - (value / max * 240)).toFixed(0); // 青から赤へのグラデーション
    return `hsl(${hue}, 80%, 60%)`;
}

// ステップ実行のための待機関数
async function waitForStep() {
    if (isStepMode) {
        return new Promise(resolve => {
            stepResolve = resolve;
        });
    } else if (isPaused) {
        await new Promise(resolve => {
            const checkPause = () => {
                if (isPaused) {
                    setTimeout(checkPause, 100);
                } else {
                    resolve();
                }
            };
            checkPause();
        });
    }
}

// アニメーションをより魅力的にする描画関数
function drawArray(array, pivotIndex = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // グリッド線を描画（薄く）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // 水平グリッド線
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // 垂直グリッド線
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    const barWidth = canvas.width / array.length;
    const maxValue = Math.max(...array);
    
    // 棒グラフの描画
    for (let i = 0; i < array.length; i++) {
        const barHeight = array[i] * (canvas.height / maxValue) * 0.9; // 高さスケーリング
        const x = i * barWidth;
        const y = canvas.height - barHeight;
        
        // 棒の色を決定
        let fillStyle;
        
        if (sortedIndices.has(i)) {
            // ソート済みの要素
            fillStyle = 'rgba(0, 230, 118, 0.8)';
        } else if (activeIndices.includes(i)) {
            // 現在アクティブな要素（交換中）
            fillStyle = 'rgba(255, 100, 100, 0.9)';
        } else if (compareIndices.includes(i)) {
            // 比較中の要素
            fillStyle = 'rgba(255, 200, 50, 0.9)';
        } else if (i === pivotIndex) {
            // ピボット要素（クイックソート）
            fillStyle = 'rgba(187, 134, 252, 0.9)';
        } else {
            // 通常の要素
            fillStyle = getGradientColor(array[i], maxValue);
        }
        
        // 棒を描画
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
        ctx.fill();
        
        // 光沢効果
        const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
        ctx.fill();
    }
}

async function bubbleSort(array) {
    const n = array.length;
    sortedIndices = new Set();
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await waitForStep();
            
            // 比較する要素をハイライト
            compareIndices = [j, j + 1];
            drawArray(array);
            if (!isStepMode) await new Promise(resolve => setTimeout(resolve, 30));
            
            if (array[j] > array[j + 1]) {
                await waitForStep();
                
                // 交換する要素をハイライト
                activeIndices = [j, j + 1];
                drawArray(array);
                if (!isStepMode) await new Promise(resolve => setTimeout(resolve, 20));
                
                // 交換
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapCount++;
                updateInfo();
                
                drawArray(array);
                if (!isStepMode) await new Promise(resolve => setTimeout(resolve, 30));
                
                // ハイライト解除
                activeIndices = [];
            }
            
            compareIndices = [];
            drawArray(array);
        }
        
        // i回目のループが終わると、最後からi番目の要素は確定
        sortedIndices.add(n - 1 - i);
        drawArray(array);
        if (!isStepMode) await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // 最初の要素も確定
    sortedIndices.add(0);
    drawArray(array);
}

async function selectionSort(array) {
    const n = array.length;
    sortedIndices = new Set();
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // 現在のminIndexをハイライト
        activeIndices = [minIndex];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        for (let j = i + 1; j < n; j++) {
            if (isPaused) {
                await new Promise(resolve => {
                    const checkPause = () => {
                        if (isPaused) {
                            setTimeout(checkPause, 100);
                        } else {
                            resolve();
                        }
                    };
                    checkPause();
                });
            }
            
            // 比較する要素をハイライト
            compareIndices = [minIndex, j];
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 20));
            
            if (array[j] < array[minIndex]) {
                // 最小値が更新された
                activeIndices = [j];
                minIndex = j;
                drawArray(array);
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            compareIndices = [];
        }
        
        // 交換
        if (i !== minIndex) {
            activeIndices = [i, minIndex];
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
            
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swapCount++;
            updateInfo();
            
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        // i番目の要素が確定
        sortedIndices.add(i);
        activeIndices = [];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // 最後の要素も確定
    sortedIndices.add(n - 1);
    drawArray(array);
}

async function insertionSort(array) {
    const n = array.length;
    sortedIndices = new Set();
    sortedIndices.add(0); // 最初の要素は既にソート済み
    
    for (let i = 1; i < n; i++) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = () => {
                    if (isPaused) {
                        setTimeout(checkPause, 100);
                    } else {
                        resolve();
                    }
                };
                checkPause();
            });
        }
        
        // 挿入する要素をハイライト
        activeIndices = [i];
        let key = array[i];
        let j = i - 1;
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 40));
        
        while (j >= 0 && array[j] > key) {
            // 比較する要素をハイライト
            compareIndices = [j];
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
            
            // 要素をずらす
            array[j + 1] = array[j];
            compareIndices = [];
            activeIndices = [j];
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
            
            j = j - 1;
        }
        
        // キーを正しい位置に挿入
        array[j + 1] = key;
        swapCount++;
        updateInfo();
        activeIndices = [j + 1];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 40));
        
        // i番目までの要素が確定
        for (let k = 0; k <= i; k++) {
            sortedIndices.add(k);
        }
        activeIndices = [];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

async function quickSort(array, low, high) {
    if (low < high) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = () => {
                    if (isPaused) {
                        setTimeout(checkPause, 100);
                    } else {
                        resolve();
                    }
                };
                checkPause();
            });
        }
        
        // ピボットを選択して分割
        const pi = await partition(array, low, high);
        
        // ピボットは確定位置
        sortedIndices.add(pi);
        drawArray(array, pi);
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // 左側と右側を再帰的にソート
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    } else if (low >= 0 && high >= 0 && low < array.length && high < array.length) {
        // 1要素の場合は確定
        sortedIndices.add(low);
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

async function partition(array, low, high) {
    // ピボット要素（最後の要素）
    const pivot = array[high];
    let i = (low - 1);
    
    // ピボットをハイライト
    compareIndices = [high];
    drawArray(array, high);
    await new Promise(resolve => setTimeout(resolve, 40));
    
    for (let j = low; j <= high - 1; j++) {
        // 現在比較中の要素をハイライト
        compareIndices = [j, high];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        if (array[j] < pivot) {
            i++;
            
            // 交換する要素をハイライト
            activeIndices = [i, j];
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
            
            [array[i], array[j]] = [array[j], array[i]];
            swapCount++;
            updateInfo();
            
            drawArray(array);
            await new Promise(resolve => setTimeout(resolve, 30));
            activeIndices = [];
        }
    }
    
    // ピボットを正しい位置に移動
    activeIndices = [i + 1, high];
    drawArray(array);
    await new Promise(resolve => setTimeout(resolve, 30));
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swapCount++;
    updateInfo();
    
    compareIndices = [];
    activeIndices = [];
    drawArray(array);
    await new Promise(resolve => setTimeout(resolve, 30));
    
    return (i + 1);
}

async function heapSort(array) {
    const n = array.length;
    sortedIndices = new Set();
    
    // ヒープ構築フェーズ
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = () => {
                    if (isPaused) {
                        setTimeout(checkPause, 100);
                    } else {
                        resolve();
                    }
                };
                checkPause();
            });
        }
        
        await heapify(array, n, i);
    }
    
    // ソートフェーズ
    for (let i = n - 1; i > 0; i--) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = () => {
                    if (isPaused) {
                        setTimeout(checkPause, 100);
                    } else {
                        resolve();
                    }
                };
                checkPause();
            });
        }
        
        // 最大値（ルート）を配列の末尾に移動
        activeIndices = [0, i];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        [array[0], array[i]] = [array[i], array[0]];
        swapCount++;
        updateInfo();
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        // 確定した要素をマーク
        sortedIndices.add(i);
        activeIndices = [];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
        
        // 残りの要素でヒープを再構築
        await heapify(array, i, 0);
    }
    
    // 最後の要素も確定
    sortedIndices.add(0);
    drawArray(array);
}

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // 現在のノードとその子ノードをハイライト
    compareIndices = [i];
    if (left < n) compareIndices.push(left);
    if (right < n) compareIndices.push(right);
    
    drawArray(array);
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // 左の子ノードとの比較
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    
    // 右の子ノードとの比較
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    
    // 最大値が現在のノードでない場合は交換
    if (largest !== i) {
        activeIndices = [i, largest];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        [array[i], array[largest]] = [array[largest], array[i]];
        swapCount++;
        updateInfo();
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        compareIndices = [];
        activeIndices = [];
        
        // 再帰的にヒープ構造を維持
        await heapify(array, n, largest);
    } else {
        compareIndices = [];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

function updateInfo() {
    document.getElementById('elementCount').textContent = array.length;
    document.getElementById('swapCount').textContent = swapCount;
    document.getElementById('elapsedTime').textContent = totalSortTime;
}

function startSortTimer() {
    sortStartTime = performance.now();
}

function pauseSortTimer() {
    if (sortStartTime && !pauseStartTime) {
        pauseStartTime = performance.now();
    }
}

function resumeSortTimer() {
    if (pauseStartTime) {
        totalPauseTime += performance.now() - pauseStartTime;
        pauseStartTime = null;
    }
}

function endSortTimer() {
    if (sortStartTime) {
        sortEndTime = performance.now();
        totalSortTime = Math.round(sortEndTime - sortStartTime - totalPauseTime);
        updateInfo();
    }
}

function resetSortTimer() {
    sortStartTime = null;
    sortEndTime = null;
    totalSortTime = 0;
    pauseStartTime = null;
    totalPauseTime = 0;
}

document.getElementById('sortAlgorithm').addEventListener('change', () => {
    const selectedAlgorithm = document.getElementById('sortAlgorithm').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArray(array);
    swapCount = 0;
    resetSortTimer();
    sortedIndices = new Set();
    activeIndices = [];
    compareIndices = [];
    
    // アルゴリズム説明を更新
    document.getElementById('algorithmDescription').textContent = algorithmDescriptions[selectedAlgorithm];
    
    // UIを更新
    updateInfo();
    document.getElementById('startSortButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('pauseButton').innerHTML = '<i class="fas fa-pause"></i> 一時停止';
    document.getElementById('nextStepButton').disabled = true;
    
    // アルゴリズム情報セクションをハイライト
    document.getElementById('algorithmInfo').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('algorithmInfo').classList.remove('pulse');
    }, 1000);
});

document.getElementById('randomizeButton').addEventListener('click', () => {
    // カラフルな配列を生成
    array = Array.from({ length: 50 }, () => Math.floor(Math.random() * canvas.height / 2) + 10);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 状態をリセット
    sortedIndices = new Set();
    activeIndices = [];
    compareIndices = [];
    swapCount = 0;
    resetSortTimer();
    isPaused = false;
    
    // アニメーション付きで配列を描画
    let tempArray = [];
    const interval = setInterval(() => {
        if (tempArray.length < array.length) {
            tempArray.push(array[tempArray.length]);
            drawArray(tempArray);
        } else {
            clearInterval(interval);
        }
    }, 10);
    
    // UIを更新
    updateInfo();
    document.getElementById('startSortButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('pauseButton').innerHTML = '<i class="fas fa-pause"></i> 一時停止';
    document.getElementById('nextStepButton').disabled = true;
    
    // ボタンに視覚効果を追加
    document.getElementById('randomizeButton').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('randomizeButton').classList.remove('pulse');
    }, 500);
});

document.getElementById('startSortButton').addEventListener('click', async () => {
    const selectedAlgorithm = document.getElementById('sortAlgorithm').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 状態をリセット
    sortedIndices = new Set();
    activeIndices = [];
    compareIndices = [];
    swapCount = 0;
    isPaused = false;
    isStepMode = false;
    stepResolve = null;
    
    // UIを更新
    document.getElementById('startSortButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('pauseButton').innerHTML = '<i class="fas fa-pause"></i> 一時停止';
    document.getElementById('nextStepButton').disabled = true;
    
    // ボタンに視覚効果を追加
    document.getElementById('startSortButton').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('startSortButton').classList.remove('pulse');
    }, 500);
    
    // ソートアルゴリズムを実行
    drawArray(array);
    startSortTimer();
    
    try {
        let sortedArray;
        switch (selectedAlgorithm) {
            case 'bubbleSort':
                sortedArray = [...array];
                await bubbleSort(sortedArray);
                break;
            case 'selectionSort':
                sortedArray = [...array];
                await selectionSort(sortedArray);
                break;
            case 'insertionSort':
                sortedArray = [...array];
                await insertionSort(sortedArray);
                break;
            case 'quickSort':
                sortedArray = [...array];
                await quickSort(sortedArray, 0, array.length - 1);
                break;
            case 'heapSort':
                sortedArray = [...array];
                await heapSort(sortedArray);
                break;
            case 'mergeSort':
                sortedArray = [...array];
                await mergeSort(sortedArray, 0, array.length - 1);
                break;
        }
        
        // ソートされた配列を元の配列に反映
        array = sortedArray;
        
        // ソートが完了したら視覚効果を追加
        const completeAnimation = () => {
            for (let i = 0; i < array.length; i++) {
                setTimeout(() => {
                    sortedIndices.add(i);
                    drawArray(array);
                }, i * 10);
            }
        };
        completeAnimation();
        
    } catch (error) {
        console.error('ソート処理でエラーが発生:', error);
    }
    
    endSortTimer();
    
    // UIを更新
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('nextStepButton').disabled = true;
});

document.getElementById('pauseButton').addEventListener('click', () => {
    if (isStepMode) {
        // ステップモードから通常モードに戻る
        isStepMode = false;
        isPaused = false;
        resumeSortTimer();
        document.getElementById('pauseButton').innerHTML = '<i class="fas fa-pause"></i> 一時停止';
        document.getElementById('nextStepButton').disabled = true;
        if (stepResolve) {
            stepResolve();
            stepResolve = null;
        }
    } else {
        isPaused = !isPaused;
        
        if (isPaused) {
            // 一時停止状態になったら、ステップモードを有効化
            isStepMode = true;
            pauseSortTimer();
            document.getElementById('pauseButton').innerHTML = '<i class="fas fa-play"></i> 再開';
            document.getElementById('nextStepButton').disabled = false;
        } else {
            resumeSortTimer();
            document.getElementById('pauseButton').innerHTML = '<i class="fas fa-pause"></i> 一時停止';
            document.getElementById('nextStepButton').disabled = true;
        }
    }
    
    // ボタンに視覚効果を追加
    document.getElementById('pauseButton').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('pauseButton').classList.remove('pulse');
    }, 500);
});

// 次のステップボタンの実装
document.getElementById('nextStepButton').addEventListener('click', () => {
    if (isStepMode && stepResolve) {
        stepResolve();
        stepResolve = null;
    }
    
    // ボタンに視覚効果を追加
    document.getElementById('nextStepButton').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('nextStepButton').classList.remove('pulse');
    }, 500);
});

// ページ読み込み時に初期化
window.addEventListener('load', () => {
    // 初期配列の生成
    array = Array.from({ length: 50 }, () => Math.floor(Math.random() * canvas.height / 2) + 10);
    
    // 初期描画
    drawArray(array);
    
    // アルゴリズム説明を初期化
    const selectedAlgorithm = document.getElementById('sortAlgorithm').value;
    document.getElementById('algorithmDescription').textContent = algorithmDescriptions[selectedAlgorithm];
    
    // 情報の更新
    updateInfo();
});

async function mergeSort(array, left, right) {
    if (left < right) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = () => {
                    if (isPaused) {
                        setTimeout(checkPause, 100);
                    } else {
                        resolve();
                    }
                };
                checkPause();
            });
        }
        
        // 中央値を計算
        const middle = Math.floor((left + right) / 2);
        
        // 分割範囲をハイライト
        activeIndices = [];
        for (let i = left; i <= right; i++) {
            activeIndices.push(i);
        }
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        activeIndices = [];
        
        // 左半分をソート
        await mergeSort(array, left, middle);
        
        // 右半分をソート
        await mergeSort(array, middle + 1, right);
        
        // 両方をマージ
        await merge(array, left, middle, right);
        
        // 範囲全体がソートされた
        for (let i = left; i <= right; i++) {
            sortedIndices.add(i);
        }
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

async function merge(array, left, middle, right) {
    // サブ配列のサイズを計算
    const n1 = middle - left + 1;
    const n2 = right - middle;

    // 一時配列を作成
    const L = new Array(n1);
    const R = new Array(n2);
    
    // 一時配列にデータをコピー
    for (let i = 0; i < n1; i++) {
        L[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = array[middle + 1 + j];
    }
    
    // 左側の配列をハイライト
    compareIndices = [];
    for (let i = left; i <= middle; i++) {
        compareIndices.push(i);
    }
    drawArray(array);
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // 右側の配列をハイライト
    compareIndices = [];
    for (let i = middle + 1; i <= right; i++) {
        compareIndices.push(i);
    }
    drawArray(array);
    await new Promise(resolve => setTimeout(resolve, 30));
    
    compareIndices = [];

    // マージ処理のインデックス
    let i = 0;
    let j = 0;
    let k = left;

    // 両方の配列から要素を比較してマージ
    while (i < n1 && j < n2) {
        // 比較する要素をハイライト
        compareIndices = [left + i, middle + 1 + j];
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        if (L[i] <= R[j]) {
            // 左側の要素が小さい
            activeIndices = [k];
            array[k] = L[i];
            i++;
        } else {
            // 右側の要素が小さい
            activeIndices = [k];
            array[k] = R[j];
            j++;
        }
        swapCount++;
        updateInfo();
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 30));
        
        compareIndices = [];
        activeIndices = [];
        k++;
    }

    // 左側配列の残りの要素をコピー
    while (i < n1) {
        activeIndices = [k];
        array[k] = L[i];
        i++;
        swapCount++;
        updateInfo();
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
        
        activeIndices = [];
        k++;
    }

    // 右側配列の残りの要素をコピー
    while (j < n2) {
        activeIndices = [k];
        array[k] = R[j];
        j++;
        swapCount++;
        updateInfo();
        
        drawArray(array);
        await new Promise(resolve => setTimeout(resolve, 20));
        
        activeIndices = [];
        k++;
    }
}