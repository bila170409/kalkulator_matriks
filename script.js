function createMatrixInputs(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = 0;
            input.classList.add('matrix-input');
            input.dataset.row = r;
            input.dataset.col = c;
            container.appendChild(input);
        }
    }
}

function getMatrixValues(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input');
    if (inputs.length === 0) return [];
    const rows = Math.max(...Array.from(inputs).map(i => parseInt(i.dataset.row))) + 1;
    const cols = Math.max(...Array.from(inputs).map(i => parseInt(i.dataset.col))) + 1;
    const matrix = [];
    for (let r = 0; r < rows; r++) {
        matrix[r] = [];
        for (let c = 0; c < cols; c++) {
            const input = Array.from(inputs).find(i => parseInt(i.dataset.row) === r && parseInt(i.dataset.col) === c);
            matrix[r][c] = Number(input.value);
        }
    }
    return matrix;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    if (typeof result === 'string') {
        resultDiv.textContent = result;
        return;
    }
    if (Array.isArray(result)) {
        if (result.length === 0) {
            resultDiv.textContent = 'Hasil kosong';
            return;
        }
        let text = '';
        for (let r = 0; r < result.length; r++) {
            text += result[r].join('\t') + '\n';
        }
        resultDiv.textContent = text;
    }
}

function addMatrices() {
    const A = getMatrixValues('matrixA');
    const B = getMatrixValues('matrixB');
    if (A.length === 0 || B.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    if (A.length !== B.length || A[0].length !== B[0].length) {
        displayResult('Ukuran matriks harus sama untuk penjumlahan');
        return;
    }
    const result = [];
    for (let r = 0; r < A.length; r++) {
        result[r] = [];
        for (let c = 0; c < A[0].length; c++) {
            result[r][c] = A[r][c] + B[r][c];
        }
    }
    displayResult(result);
}

function subtractMatrices() {
    const A = getMatrixValues('matrixA');
    const B = getMatrixValues('matrixB');
    if (A.length === 0 || B.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    if (A.length !== B.length || A[0].length !== B[0].length) {
        displayResult('Ukuran matriks harus sama untuk pengurangan');
        return;
    }
    const result = [];
    for (let r = 0; r < A.length; r++) {
        result[r] = [];
        for (let c = 0; c < A[0].length; c++) {
            result[r][c] = A[r][c] - B[r][c];
        }
    }
    displayResult(result);
}

function multiplyMatrices() {
    const A = getMatrixValues('matrixA');
    const B = getMatrixValues('matrixB');
    if (A.length === 0 || B.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    if (A[0].length !== B.length) {
        displayResult('Jumlah kolom Matriks A harus sama dengan jumlah baris Matriks B untuk perkalian');
        return;
    }
    const result = [];
    for (let r = 0; r < A.length; r++) {
        result[r] = [];
        for (let c = 0; c < B[0].length; c++) {
            let sum = 0;
            for (let k = 0; k < A[0].length; k++) {
                sum += A[r][k] * B[k][c];
            }
            result[r][c] = sum;
        }
    }
    displayResult(result);
}

function transposeMatrix(matrixId) {
    const matrix = getMatrixValues(matrixId === 'A' ? 'matrixA' : 'matrixB');
    if (matrix.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    const result = [];
    for (let c = 0; c < matrix[0].length; c++) {
        result[c] = [];
        for (let r = 0; r < matrix.length; r++) {
            result[c][r] = matrix[r][c];
        }
    }
    displayResult(result);
}

function determinantMatrix(matrixId) {
    const matrix = getMatrixValues(matrixId === 'A' ? 'matrixA' : 'matrixB');
    if (matrix.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    if (matrix.length !== matrix[0].length) {
        displayResult('Matriks harus persegi untuk menghitung determinan');
        return;
    }
    const det = determinant(matrix);
    displayResult('Determinan: ' + det);
}

function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
    let det = 0;
    for (let c = 0; c < n; c++) {
        det += ((c % 2 === 0 ? 1 : -1) * matrix[0][c] * determinant(minor(matrix, 0, c)));
    }
    return det;
}

function minor(matrix, row, col) {
    return matrix.filter((_, r) => r !== row).map(r => r.filter((_, c) => c !== col));
}

function inverseMatrix(matrixId) {
    const matrix = getMatrixValues(matrixId === 'A' ? 'matrixA' : 'matrixB');
    if (matrix.length === 0) {
        displayResult('Matriks belum dibuat');
        return;
    }
    if (matrix.length !== matrix[0].length) {
        displayResult('Matriks harus persegi untuk menghitung invers');
        return;
    }
    const det = determinant(matrix);
    if (det === 0) {
        displayResult('Matriks singular, tidak memiliki invers');
        return;
    }
    const inv = inverse(matrix);
    displayResult(inv);
}

function inverse(matrix) {
    const n = matrix.length;
    const det = determinant(matrix);
    if (n === 1) return [[1 / matrix[0][0]]];
    const cofactors = [];
    for (let r = 0; r < n; r++) {
        cofactors[r] = [];
        for (let c = 0; c < n; c++) {
            const minorMat = minor(matrix, r, c);
            cofactors[r][c] = ((r + c) % 2 === 0 ? 1 : -1) * determinant(minorMat);
        }
    }
    const cofactorsT = [];
    for (let r = 0; r < n; r++) {
        cofactorsT[r] = [];
        for (let c = 0; c < n; c++) {
            cofactorsT[r][c] = cofactors[c][r];
        }
    }
    const inv = [];
    for (let r = 0; r < n; r++) {
        inv[r] = [];
        for (let c = 0; c < n; c++) {
            inv[r][c] = cofactorsT[r][c] / det;
        }
    }
    return inv;
}

function clearAll() {
    document.getElementById('matrixA').innerHTML = '';
    document.getElementById('matrixB').innerHTML = '';
    document.getElementById('result').textContent = '';
}

function clearMatrix(matrixId) {
    const container = document.getElementById(matrixId === 'A' ? 'matrixA' : 'matrixB');
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => input.value = 0);
}

document.getElementById('generateBtn').addEventListener('click', () => {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    createMatrixInputs('matrixA', rowsA, colsA);
    createMatrixInputs('matrixB', rowsB, colsB);
    document.getElementById('result').textContent = '';
});

document.getElementById('addBtn').addEventListener('click', addMatrices);
document.getElementById('subtractBtn').addEventListener('click', subtractMatrices);
document.getElementById('multiplyBtn').addEventListener('click', multiplyMatrices);
document.getElementById('transA').addEventListener('click', () => transposeMatrix('A'));
document.getElementById('transB').addEventListener('click', () => transposeMatrix('B'));
document.getElementById('detA').addEventListener('click', () => determinantMatrix('A'));
document.getElementById('detB').addEventListener('click', () => determinantMatrix('B'));
document.getElementById('invA').addEventListener('click', () => inverseMatrix('A'));
document.getElementById('invB').addEventListener('click', () => inverseMatrix('B'));
