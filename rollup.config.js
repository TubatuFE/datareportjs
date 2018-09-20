export default {
    input: 'src/App.js',
    context: 'window',
    output: {
      name: 'App',
      file: 'app.js',
      format: 'umd' // iife: 浏览器 cjs: Node.js umd: 浏览器和 Node.js
    }
  };
  