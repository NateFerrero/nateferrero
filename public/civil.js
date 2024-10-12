const trace = 0

let clock0 = 0
let clock1 = 0
let clock2 = 0

const From = Symbol()
const Last = Symbol()
const Registers = Symbol()
const Result = Symbol()
const Time = Symbol()

const root = new Map()
let level0 = new Map(),
 level1 = new Map(),
 level2 = new Map()
root.set(clock0, level0)
level0.set(clock1, level1)
level1.set(clock2, level2)

const CLOCK_MAX = Number.MAX_SAFE_INTEGER

function registerLookback(x, r) {
 const registers = x.get(Registers)
 if (!registers || !registers.has(r)) {
  if (!x.has(From)) {
   throw new Error(
    `register ${r} not found at ${x.get(Time)}`
   )
  }
  return registerLookback(x.get(From), r)
 }
 return registers.get(r)
}

function tick() {
 const prev = level2
 const last = [clock0, clock1, clock2]
 if (clock2 === CLOCK_MAX) {
  if (clock1 === CLOCK_MAX) {
   if (clock0 === CLOCK_MAX) {
    throw new Error(
     `Max clock time exceeded: ${clock0}:${clock1}:${clock2}`
    )
   }
   clock0++
   level0 = new Map()
   root.set(clock0, level0)
   clock1 = 0
  } else {
   clock1++
  }
  level1 = new Map()
  level0.set(clock1, level1)
  clock2 = 0
 } else {
  clock2++
 }
 level2 = new Map()
 level1.set(clock2, level2)
 const time = [clock0, clock1, clock2]
 trace && console.log(...time, '[tick]', '<<', ...last)
 level2.set(Time, time)
 level2.set(Last, last)
 level2.set(From, prev)
 level2.set(Registers, new Map())
}

function set(register, value) {
 tick()
 const registers = level2.get(Registers)
 registers.set(register, value)
 trace &&
  console.log(
   clock0,
   clock1,
   clock2,
   '[set]',
   register,
   String(value)
  )
}

function call(...args) {
 tick()
 const [realCall, ...realArgs] = args.map((r) =>
  registerLookback(level2, r)
 )
 const result = realCall(...realArgs)
 level2.set(Result, result)
 trace &&
  console.log(
   clock0,
   clock1,
   clock2,
   '[call]',
   String(result)
  )
}

function program() {
 set(0, 'hello world')
 set(1, (x) => console.log(x))
 call(1, 0)
}

program()
