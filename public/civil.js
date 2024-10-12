const trace = 1

let clock0 = 0
let clock1 = 0
let clock2 = 0

const Free = Symbol()
const From = Symbol()
const Last = Symbol()
const Next = Symbol()
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
level2.set(Next, 0)

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
 level2.set(Next, prev.has(Next) ? prev.get(Next) : 0)
 if (prev.has(Free)) {
  level2.set(Free, prev.get(Free).slice())
 }
}

function open() {
 if (level2.has(Free)) {
  const f = level2.get(Free)
  if (f.length > 0) {
   const next = f.shift()
   if (f.length === 0) {
    level2.delete(Free)
   }
   trace &&
    console.log(clock0, clock1, clock2, '[open]', next)
   return next
  }
  level2.delete(Free)
 }
 const next = level2.get(Next)
 level2.set(Next, next + 1)
 trace &&
  console.log(clock0, clock1, clock2, '[open]', next)
 return next
}

function free(r) {
 if (level2.has(Free)) {
  const f = level2.get(Free)
  f.push(r)
 } else {
  level2.set(Free, [r])
 }
 trace && console.log(clock0, clock1, clock2, '[free]', r)
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
 function PRINT(text) {
  trace &&
   console.log(clock0, clock1, clock2, '[PRINT]', text)
  const log = open(text)
  set(log, (x) => console.log(x))
  call(log, text)
  free(log)
 }
 const message = open()
 set(message, 'hello world')
 PRINT(message)
 free(message)
}

program()
