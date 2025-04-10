#include "sz3_wrapper.h"

#include "SZ3/api/sz.hpp"


#include <cstdlib>
#include <cstring>

using namespace SZ3;

extern "C" {

    char* wasm_interp_compress_float_1D(const float* data, size_t len, size_t& outSize, double absErrorBound)
    {
        Config conf(len);  
        conf.cmprAlgo = ALGO_INTERP_LORENZO;       
        conf.errorBoundMode = EB_ABS;
        conf.absErrorBound = absErrorBound;
        size_t cap = SZ_compress_size_bound<float>(conf) * 2;
        char* buffer = new char[cap];
        outSize = SZ_compress<float>(conf, data, buffer, cap);
        return buffer;  
    }

    char* wasm_interp_compress_float_3D(const float* data, size_t dim0, size_t dim1, size_t dim2, size_t& outSize, double absErrorBound)
    {
        std::vector<size_t> dims = {dim0, dim1, dim2}; 
        Config conf({dims[0], dims[1], dims[2]});
        conf.cmprAlgo = ALGO_INTERP_LORENZO;
        conf.errorBoundMode = EB_ABS;
        conf.absErrorBound = absErrorBound;

        size_t cap = SZ_compress_size_bound<float>(conf) * 2;
        char* buffer = new char[cap];
        outSize = SZ_compress<float>(conf, data, buffer, cap);
        return buffer;
    }
    
    float* wasm_interp_decompress_float(const char* cmpData, size_t cmpSize, size_t& outLen)
    {
        Config conf;
        float* output = nullptr;
        SZ_decompress<float>(conf, cmpData, cmpSize, output); 
        outLen = conf.num;
        return output;
    }
    

void wasm_free(void* ptr)
{
    delete[] static_cast<char*>(ptr);
}


}
