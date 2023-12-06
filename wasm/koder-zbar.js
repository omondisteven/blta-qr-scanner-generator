class KoderZbar {
  initialize(config) {
    return (async () => {
      // Load WASM file
      console.log("Zbar");
      config ||= {};
      const directory = config.wasmDirectory || "./wasm";
      this.mod = await CreateKoder({locateFile: file => `${directory}/${file}`});

      // Initialize a glue API object (between JavaScript and C++ code)
      this.api = {
        createBuffer: this.mod.cwrap('createBuffer', 'number', ['number']),
        deleteBuffer: this.mod.cwrap('deleteBuffer', '', ['number']),
        triggerDecode: this.mod.cwrap('triggerDecode', 'number', ['number', 'number', 'number']),
        getScanResults: this.mod.cwrap('getScanResults', 'number', []),
        getResultType: this.mod.cwrap('getResultType', 'number', []),
      };

      // return the class
      return this;
    })();
  }

  decode(imgData, width, height) {
    const buffer = this.api.createBuffer(width * height * 4);
    this.mod.HEAPU8.set(imgData, buffer);
    const results = [];
    if (this.api.triggerDecode(buffer, width, height) > 0) {
      const resultAddress = this.api.getScanResults();
      results.push({
        code: this.mod.UTF8ToString(resultAddress),
        type: this.mod.UTF8ToString(this.api.getResultType())
      });
      this.api.deleteBuffer(resultAddress);
    }
    if (results.length > 0) return results[0];
    else return null;
  }
}