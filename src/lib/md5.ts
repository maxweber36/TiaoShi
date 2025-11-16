/**
 * Lightweight MD5 implementation for API signature generation.
 * Note: kept in TypeScript to avoid pulling in heavier crypto deps for the browser bundle.
 */
export function md5(input: string): string {
  function L(k: number, d: number) { return (k << d) | (k >>> (32 - d)) }
  function r(x: number) { return x & 0xffffffff }
  function C(x: number, y: number, _z: number, _w: number, a: number, b: number, c: number) {
    x = r(x + a + c); return r(L(x, b) + y)
  }
  function D(a: string) {
    const b: number[] = []
    for (let i = 0; i < a.length; i++) b.push(a.charCodeAt(i))
    return b
  }
  function E(a: number[]) {
    const b: number[] = []
    for (let i = 0; i < a.length * 32; i += 8) b.push((a[i >> 5] >>> (i % 32)) & 0xff)
    return b
  }
  function P(a: number[]) {
    const b: number[] = []
    for (let i = 0; i < a.length; i += 4) b.push(a[i] | (a[i + 1] << 8) | (a[i + 2] << 16) | (a[i + 3] << 24))
    return b
  }
  function Q(a: number[]) {
    const b: number[] = []
    for (let i = 0; i < a.length; i++) b.push((a[i >> 2] >>> ((i % 4) * 8)) & 0xff)
    return b
  }
  const g = D(unescape(encodeURIComponent(input)))
  const h = g.length
  const i = P(g)
  const j = Math.ceil((h + 1 + 8) / 64) * 16
  const k = new Array(j).fill(0)
  for (let x = 0; x < i.length; x++) k[x] = i[x]
  k[h >> 2] |= 0x80 << ((h % 4) * 8)
  k[j - 2] = h << 3
  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878
  for (let x = 0; x < k.length; x += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = C(a, b, c, d, k[x + 0], 7, -680876936); d = C(d, a, b, c, k[x + 1], 12, -389564586)
    c = C(c, d, a, b, k[x + 2], 17, 606105819); b = C(b, c, d, a, k[x + 3], 22, -1044525330)
    a = C(a, b, c, d, k[x + 4], 7, -176418897); d = C(d, a, b, c, k[x + 5], 12, 1200080426)
    c = C(c, d, a, b, k[x + 6], 17, -1473231341); b = C(b, c, d, a, k[x + 7], 22, -45705983)
    a = C(a, b, c, d, k[x + 8], 7, 1770035416); d = C(d, a, b, c, k[x + 9], 12, -1958414417)
    c = C(c, d, a, b, k[x + 10], 17, -42063); b = C(b, c, d, a, k[x + 11], 22, -1990404162)
    a = C(a, b, c, d, k[x + 12], 7, 1804603682); d = C(d, a, b, c, k[x + 13], 12, -40341101)
    c = C(c, d, a, b, k[x + 14], 17, -1502002290); b = C(b, c, d, a, k[x + 15], 22, 1236535329)
    a = r(a + olda); b = r(b + oldb); c = r(c + oldc); d = r(d + oldd)
  }
  const out = Q(E([a, b, c, d]))
  const hex = '0123456789abcdef'
  let res = ''
  for (let i2 = 0; i2 < out.length; i2++) { res += hex.charAt((out[i2] >>> 4) & 0x0f) + hex.charAt(out[i2] & 0x0f) }
  return res
}
