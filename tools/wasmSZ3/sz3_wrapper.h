#ifndef SZ3_WRAPPER_H
#define SZ3_WRAPPER_H

#include <cstddef>
#ifdef __cplusplus
extern "C" {
#endif

char* wasm_interp_compress_float_1D(const float* data, size_t len, size_t& outSize, double absErrorBound);
char* wasm_interp_compress_float_3D(const float* data, size_t dim0, size_t dim1, size_t dim2, size_t& outSize, double absErrorBound);
float* wasm_interp_decompress_float(const char* cmpData, size_t cmpSize, size_t& outLen);
void wasm_free(void* ptr);

#ifdef __cplusplus
}
#endif

#endif
