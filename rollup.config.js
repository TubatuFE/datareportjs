export default {
    input: 'src/App.js',
    context: 'window',
    output: {
      sourcemap: true,
      name: 'App',
      file: 'dist/app.js',
      format: 'umd' // iife: 浏览器 cjs: Node.js umd: 浏览器和 Node.js
    }
  };
  