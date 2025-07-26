import typescript from '@rollup/plugin-typescript'

export default {
  input: ['src/types.ts', 'src/utils.ts'],
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  exclude: ['node_modules', '__test__', 'package*.json'],
}
