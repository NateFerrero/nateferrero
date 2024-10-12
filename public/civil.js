const trace = 1

const Free = Symbol()
const From = Symbol()
const Last = Symbol()
const Next = Symbol()
const Registers = Symbol()
const Result = Symbol()
const Time = Symbol()

const CLOCK_MAX = Number.MAX_SAFE_INTEGER

function call(e, ...args) {
 tick(e)
 const [realCall, ...realArgs] = args.map((r) =>
  seek(e.level2, r)
 )
 const result = realCall(...realArgs)
 e.level2.set(Result, result)
 trace &&
  console.log(
   e.clock0,
   e.clock1,
   e.clock2,
   '[call]',
   String(result)
  )
}

function engine() {
 const e = {
  clock0: 0,
  clock1: 0,
  clock2: 0,
  root: new Map(),
  level0: new Map(),
  level1: new Map(),
  level2: new Map(),
 }
 e.root.set(e.clock0, e.level0)
 e.level0.set(e.clock1, e.level1)
 e.level1.set(e.clock2, e.level2)
 e.level2.set(Next, 0)
 return e
}

function free(e, r) {
 if (e.level2.has(Free)) {
  const f = e.level2.get(Free)
  f.push(r)
 } else {
  e.level2.set(Free, [r])
 }
 trace &&
  console.log(e.clock0, e.clock1, e.clock2, '[free]', r)
}

function open(e) {
 if (e.level2.has(Free)) {
  const f = e.level2.get(Free)
  if (f.length > 0) {
   const next = f.shift()
   if (f.length === 0) {
    e.level2.delete(Free)
   }
   trace &&
    console.log(
     e.clock0,
     e.clock1,
     e.clock2,
     '[open]',
     next
    )
   return next
  }
  e.level2.delete(Free)
 }
 const next = e.level2.get(Next)
 e.level2.set(Next, next + 1)
 trace &&
  console.log(e.clock0, e.clock1, e.clock2, '[open]', next)
 return next
}

function seek(x, r) {
 const registers = x.get(Registers)
 if (!registers || !registers.has(r)) {
  if (!x.has(From)) {
   throw new Error(
    `register ${r} not found at ${x.get(Time)}`
   )
  }
  return seek(x.get(From), r)
 }
 return registers.get(r)
}

function set(e, register, value) {
 tick(e)
 const registers = e.level2.get(Registers)
 registers.set(register, value)
 trace &&
  console.log(
   e.clock0,
   e.clock1,
   e.clock2,
   '[set]',
   register,
   String(value)
  )
}

function tick(e) {
 const prev = e.level2
 const last = [e.clock0, e.clock1, e.clock2]
 if (e.clock2 === CLOCK_MAX) {
  if (e.clock1 === CLOCK_MAX) {
   if (e.clock0 === CLOCK_MAX) {
    throw new Error(
     `Max clock time exceeded: ${e.clock0}:${e.clock1}:${e.clock2}`
    )
   }
   e.clock0++
   e.level0 = new Map()
   e.root.set(e.clock0, e.level0)
   e.clock1 = 0
  } else {
   e.clock1++
  }
  e.level1 = new Map()
  e.level0.set(e.clock1, e.level1)
  e.clock2 = 0
 } else {
  e.clock2++
 }
 e.level2 = new Map()
 e.level1.set(e.clock2, e.level2)
 const time = [e.clock0, e.clock1, e.clock2]
 trace && console.log(...time, '[tick]', '<<', ...last)
 e.level2.set(Time, time)
 e.level2.set(Last, last)
 e.level2.set(From, prev)
 e.level2.set(Registers, new Map())
 e.level2.set(Next, prev.has(Next) ? prev.get(Next) : 0)
 if (prev.has(Free)) {
  e.level2.set(Free, prev.get(Free).slice())
 }
}

function use(e, cb) {
 const ref = open(e)
 cb(ref, e)
 free(e, ref)
}

//////////////////////

function PRINT(e, text) {
 trace &&
  console.log(e.clock0, e.clock1, e.clock2, '[PRINT]', text)
 use(e, (log) => {
  set(e, log, (x) => console.log(x))
  call(e, log, text)
 })
}

function program(e) {
 use(e, (message) => {
  set(e, message, 'hello world')
  PRINT(e, message)
 })
}

program(engine())
