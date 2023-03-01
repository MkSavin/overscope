export type DummyState = {
  count: number,

  statistics: {
    multiply: number,
    divide: number,
  },
}

export type DummyTransform = {
  increase: () => void,
  decrease: () => void,
  set: (value: number) => void,
  multiply: (value: number) => void,
  divide: (value: number) => void,
  add: (value: number) => void,
  subtract: (value: number) => void,
}
