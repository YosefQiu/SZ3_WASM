const output = document.getElementById("output");
const log = (msg) => {
    console.log(msg);
    output.textContent += msg + '\n';
};

function log3DSample(data, nx, ny, nz, label, count = 10) {
    let printed = 0;
    for (let i = 0; i < nx && printed < count; i++) {
        for (let j = 0; j < ny && printed < count; j++) {
        for (let k = 0; k < nz && printed < count; k++) {
            const idx = i * ny * nz + j * nz + k;
            log(`[3D] ${label} (${i},${j},${k}): ${data[idx].toFixed(5)}`);
            printed++;
        }
        }
    }
}

SZ3Module().then((Module) => {
    log("WASM module loaded.");
    log('\n');
    // ====== 1D TEST ======
    log(`1D Test with SZ3 Compression`);
    const len = 10;
    const input = new Float32Array(len);
    for (let i = 0; i < len; i++) input[i] = Math.sin(i);

    const inputPtr = Module._malloc(len * 4);
    Module.HEAPF32.set(input, inputPtr >> 2);
    const sizePtr = Module._malloc(4);

    const compressedPtr = Module._wasm_interp_compress_float_1D(inputPtr, len, sizePtr, 1e-3);
    const compressedSize = Module.HEAPU32[sizePtr >> 2];
    log(`Compressed size: ${compressedSize} bytes`);

    const outLenPtr = Module._malloc(4);
    const decompressedPtr = Module._wasm_interp_decompress_float(compressedPtr, compressedSize, outLenPtr);
    const outLen = Module.HEAPU32[outLenPtr >> 2];
    const decompressedData = new Float32Array(Module.HEAPF32.buffer, decompressedPtr, outLen);

    log("[1D] Original     [0:10]: " + input.slice(0, 10).map(x => x.toFixed(5)).join(", "));
    log("[1D] Decompressed[0:10]: " + decompressedData.slice(0, 10).map(x => x.toFixed(5)).join(", "));

    Module._free(inputPtr);
    Module._free(sizePtr);
    Module._free(outLenPtr);
    Module._wasm_free(compressedPtr);
    Module._wasm_free(decompressedPtr);

    // ====== 3D TEST ======
    log('\n3D Test with SZ3 Compression');

    const dim0 = 10, dim1 = 10, dim2 = 10;
    const len3d = dim0 * dim1 * dim2;
    const input3d = new Float32Array(len3d);

    for (let i = 0; i < dim0; i++) {
        for (let j = 0; j < dim1; j++) {
        for (let k = 0; k < dim2; k++) {
            const x = i - dim0 / 2;
            const y = j - dim1 / 2;
            const z = k - dim2 / 2;
            const val = 0.0001 * y * Math.sin(y) + 0.0005 * Math.cos(x * x + x) + z;
            input3d[i * dim1 * dim2 + j * dim2 + k] = val;
        }
        }
    }

    const input3dPtr = Module._malloc(len3d * 4);
    Module.HEAPF32.set(input3d, input3dPtr >> 2);

    const size3dPtr = Module._malloc(4);
    const compressed3dPtr = Module._wasm_interp_compress_float_3D(input3dPtr, dim0, dim1, dim2, size3dPtr, 1e-3);
    const compressed3dSize = Module.HEAPU32[size3dPtr >> 2];
    log(`3D Compressed size: ${compressed3dSize} bytes`);

    const outLen3dPtr = Module._malloc(4);
    const decompressed3dPtr = Module._wasm_interp_decompress_float(compressed3dPtr, compressed3dSize, outLen3dPtr);
    const outLen3d = Module.HEAPU32[outLen3dPtr >> 2];
    const decompressed3d = new Float32Array(Module.HEAPF32.buffer, decompressed3dPtr, outLen3d);

    log3DSample(input3d, dim0, dim1, dim2, "Original");
    log3DSample(decompressed3d, dim0, dim1, dim2, "Decompressed");

    Module._free(input3dPtr);
    Module._free(size3dPtr);
    Module._free(outLen3dPtr);
    Module._wasm_free(compressed3dPtr);
    Module._wasm_free(decompressed3dPtr);
});
