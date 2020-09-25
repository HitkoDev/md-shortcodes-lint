
require("ts-node").register({
    compilerOptions: {
        strict: true,
        strictPropertyInitialization: false,
        allowSyntheticDefaultImports: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        moduleResolution: "node",
        module: "commonjs",
        target: "es2018",
        sourceMap: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitAny: false,
        outDir: "dist",
        lib: [
            "esnext",
            "dom"
        ],
    },
    include: [
        "src",
        "test",
        "typings",
    ]
})

require("source-map-support/register");

// Better Set inspection for failed tests

Set.prototype.inspect = function () {
    return `Set { ${Array.from(this.values()).join(', ')} }`;
}
