import S from "jszip";
const m = {
  NULL: 0,
  POINT: 1,
  POLYLINE: 3,
  POLYGON: 5,
  MULTIPOINT: 8,
  POINTZ: 11,
  POLYLINEZ: 13,
  POLYGONZ: 15,
  MULTIPOINTZ: 18,
  POINTM: 21,
  POLYLINEM: 23,
  POLYGONM: 25,
  MULTIPOINTM: 28,
  MULTIPATCH: 31
}, C = {
  C: 254,
  // string
  L: 1,
  // boolean
  D: 8,
  // date
  N: 18,
  // number
  M: 18,
  F: 18,
  // number, float
  B: 8
}, _ = {
  string: "C",
  number: "N",
  boolean: "L",
  // type to use if all values of a field are null
  null: "C"
};
function z(t, e) {
  for (const n in e) {
    const r = typeof e[n] < "u" && e[n] !== null;
    (typeof t[n] > "u" || r) && (t[n] = e[n]);
  }
  return t;
}
function G(t) {
  const e = {}, n = [];
  for (const r in t) e[r] = t[r] === null ? "null" : typeof t[r];
  for (const r in e) {
    const i = _[e[r]];
    i && n.push({ name: r, type: i, size: C[i] });
  }
  return n;
}
function j(t) {
  const e = {};
  return t.forEach((n) => z(e, n)), G(e);
}
function k(t) {
  return t.reduce((e, n) => e + n.size, 1);
}
function x(t, e, n) {
  for (; t.length < e; ) t = n + t;
  return t;
}
function Y(t, e, n) {
  for (; t.length < e; ) t = t + n;
  return t;
}
function I(t, e, n, r) {
  for (let i = 0; i < e; i++)
    t.setUint8(r, n.charCodeAt(i)), r++;
  return r;
}
function B(t, e) {
  const n = j(t), r = 32 * n.length + 1, i = k(n), o = new ArrayBuffer(r + 32 + i * t.length + 1), l = /* @__PURE__ */ new Date(), u = new DataView(o);
  u.setUint8(0, 3), u.setUint8(1, l.getFullYear() - 1900), u.setUint8(2, l.getMonth()), u.setUint8(3, l.getDate()), u.setUint32(4, t.length, !0);
  const p = r + 32;
  u.setUint16(8, p, !0), u.setUint16(10, i, !0), u.setInt8(32 + r - 1, 13), n.forEach((a, f) => {
    a.name.split("").slice(0, 8).forEach((c, L) => {
      u.setInt8(32 + f * 32 + L, c.charCodeAt(0));
    }), u.setInt8(32 + f * 32 + 11, a.type.charCodeAt(0)), u.setInt8(32 + f * 32 + 16, a.size), a.type === "N" && u.setInt8(32 + f * 32 + 17, 3);
  });
  let s = r + 32;
  return t.forEach((a) => {
    u.setUint8(s, 32), s++, n.forEach((f) => {
      let c = a[f.name];
      switch ((c === null || typeof c > "u") && (c = ""), f.type) {
        case "L":
          u.setUint8(s, c ? 84 : 70), s++;
          break;
        case "D":
          s = I(u, 8, x(String(c), 8, " "), s);
          break;
        case "N":
          s = I(u, f.size, x(String(c), f.size, " ").slice(0, 18), s);
          break;
        case "C":
          s = I(u, f.size, Y(String(c), f.size, " "), s);
          break;
        default:
          throw new Error("Unknown field type");
      }
    });
  }), u.setUint8(s, 26), u;
}
const A = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]';
function b(t, e) {
  return e[0] < t.xmin && (t.xmin = e[0]), e[0] > t.xmax && (t.xmax = e[0]), e[1] < t.ymin && (t.ymin = e[1]), e[1] > t.ymax && (t.ymax = e[1]), t;
}
function O() {
  return {
    xmin: Number.MAX_VALUE,
    ymin: Number.MAX_VALUE,
    xmax: -Number.MAX_VALUE,
    ymax: -Number.MAX_VALUE
  };
}
function R(t, e, n, r) {
  let o = 100, l = 0, u = 0;
  t.forEach((p, s) => {
    n.setInt32(l, s), n.setInt32(l + 4, 10), n.setInt32(l + 8, 1, !0), n.setFloat64(l + 12, p[0], !0), n.setFloat64(l + 20, p[1], !0), r.setInt32(u, o / 2), r.setInt32(u + 4, 10), u += 8, l += 28, o += 28;
  });
}
function v(t) {
  return t.reduce((e, n) => b(e, n), O());
}
function W(t, e) {
  return t.length;
}
function Z(t) {
  return t.length * 8;
}
function X(t) {
  return t.length * 28;
}
const H = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extent: v,
  parts: W,
  shpLength: X,
  shxLength: Z,
  write: R
}, Symbol.toStringTag, { value: "Module" }));
function $(t, e, n, r, i) {
  let o = 0, l = 0, u = 100;
  t.forEach(p);
  function p(s, a) {
    const f = g(s), c = M([s], i), L = f.length * 16 + 48 + (c - 1) * 4, d = f.reduce((h, y) => b(h, y), O());
    r.setInt32(l, u / 2), r.setInt32(l + 4, L / 2), l += 8, u += L + 8, n.setInt32(o, a + 1), n.setInt32(o + 4, L / 2), n.setInt32(o + 8, i, !0), n.setFloat64(o + 12, d.xmin, !0), n.setFloat64(o + 20, d.ymin, !0), n.setFloat64(o + 28, d.xmax, !0), n.setFloat64(o + 36, d.ymax, !0), n.setInt32(o + 44, c, !0), n.setInt32(o + 48, f.length, !0), n.setInt32(o + 52, 0, !0);
    const T = s.reduce((h, y) => (Array.isArray(y[0][0]) ? h = h.concat(y) : h.push(y), h), []);
    for (let h = 1; h < c; h++)
      n.setInt32(
        // set part index
        o + 52 + h * 4,
        T.reduce((y, D, F) => F < h ? y + D.length : y, 0),
        !0
      );
    f.forEach((h, y) => {
      n.setFloat64(o + 56 + y * 16 + (c - 1) * 4, h[0], !0), n.setFloat64(o + 56 + y * 16 + (c - 1) * 4 + 8, h[1], !0);
    }), o += L + 8;
  }
}
function J(t) {
  return t.length * 56 + g(t).length * 16;
}
function q(t) {
  return t.length * 8;
}
function K(t) {
  return g(t).reduce((e, n) => b(e, n), O());
}
function M(t, e) {
  let n = 1;
  return (e === m.POLYGON || e === m.POLYLINE) && (n = t.reduce((r, i) => (r += i.length, Array.isArray(i[0][0][0]) && (r += i.reduce((o, l) => o + l.length - 1, 0)), r), 0)), n;
}
function g(t, e) {
  return e === void 0 && (e = []), typeof t[0][0] == "object" ? t.reduce((n, r) => n.concat(g(r)), e) : t;
}
const N = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extent: K,
  parts: M,
  shpLength: J,
  shxLength: q,
  write: $
}, Symbol.toStringTag, { value: "Module" })), Q = {
  1: H,
  5: N,
  3: N
};
function V(t, e, n, r) {
  const i = m[e], o = Q[i];
  if (!o)
    throw new Error(`Unsupported geometry type: ${e}`);
  const u = 100 + (o.parts(n, i) - n.length) * 4 + o.shpLength(n), p = 100 + o.shxLength(n), s = new ArrayBuffer(u), a = new DataView(s), f = new ArrayBuffer(p), c = new DataView(f), L = o.extent(n);
  P(a, i), P(c, i), E(L, a), E(L, c), o.write(n, L, new DataView(s, 100), new DataView(f, 100), i), a.setInt32(24, u / 2), c.setInt32(24, 50 + n.length * 4);
  const d = B(t);
  r(null, {
    shp: a,
    shx: c,
    dbf: d,
    prj: A
  });
}
function P(t, e) {
  t.setInt32(0, 9994), t.setInt32(28, 1e3, !0), t.setInt32(32, e, !0);
}
function E(t, e) {
  e.setFloat64(36, t.xmin, !0), e.setFloat64(44, t.ymin, !0), e.setFloat64(52, t.xmax, !0), e.setFloat64(60, t.ymax, !0);
}
function tt(t) {
  return U("Point", "POINT")(t);
}
function et(t) {
  return U("LineString", "POLYLINE")(t);
}
function nt(t) {
  return U("Polygon", "POLYGON")(t);
}
function U(t, e) {
  return function(n) {
    const r = n.features.filter(ot(t));
    return {
      geometries: e === "POLYGON" || e === "POLYLINE" ? [r.map(w)] : r.map(w),
      properties: r.map(rt),
      type: e
    };
  };
}
function w(t) {
  var n;
  const e = ((n = t.geometry) == null ? void 0 : n.coordinates) ?? [];
  return e[0] !== void 0 && e[0][0] !== void 0 && e[0][0][0] !== void 0 ? e[0].length > 1 ? e : e[0] : e;
}
function rt(t) {
  return t.properties ?? {};
}
function ot(t) {
  return function(e) {
    var n;
    return ((n = e.geometry) == null ? void 0 : n.type) === t;
  };
}
function ut(t, e = {}) {
  const n = new S(), r = n.folder(e.folder ? e.folder : "layers");
  [tt(t), et(t), nt(t)].forEach((o) => {
    o.geometries.length && o.geometries[0].length && V(
      // field definitions
      o.properties,
      // geometry type
      o.type,
      // geometries
      o.geometries,
      (l, u) => {
        var a;
        const p = o.type.toLowerCase(), s = ((a = e.types) == null ? void 0 : a[p]) ?? o.type;
        r.file(s + ".shp", new Uint8Array(u.shp.buffer), { binary: !0 }), r.file(s + ".shx", new Uint8Array(u.shx.buffer), { binary: !0 }), r.file(s + ".dbf", new Uint8Array(u.dbf.buffer), { binary: !0 }), r.file(s + ".prj", A);
      }
    );
  });
  const i = typeof window < "u" ? "blob" : "nodebuffer";
  return n.generateAsync({ type: i, compression: "DEFLATE" });
}
function ct(t, e = {}) {
  ut(t, e).then((n) => {
    it(n, (e.file ?? "shapes") + ".zip");
  });
}
function it(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(n);
}
export {
  ct as download,
  V as write,
  ut as zip
};
//# sourceMappingURL=index.js.map
