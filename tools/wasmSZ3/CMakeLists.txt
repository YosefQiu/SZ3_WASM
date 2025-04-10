add_executable(wasmSZ3 sz3_wrapper.cpp)

# 链接主项目中的 SZ3 INTERFACE target，它已经包含头文件路径和依赖库
target_link_libraries(wasmSZ3 PRIVATE SZ3)

# 设置为 Emscripten 构建选项
set_target_properties(wasmSZ3 PROPERTIES
    OUTPUT_NAME "sz3_wrapper"
    LINK_FLAGS "-s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME='SZ3Module' \
                -s EXPORTED_FUNCTIONS=['_wasm_interp_compress_float_1D','_wasm_interp_compress_float_3D','_wasm_interp_decompress_float','_wasm_free','_malloc','_free'] \
                -s ALLOW_MEMORY_GROWTH=1 --no-entry"
)