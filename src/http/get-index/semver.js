// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("mod", [], function (exports_1, context_1) {
  "use strict";
  var SEMVER_SPEC_VERSION,
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    re,
    src,
    R,
    NUMERICIDENTIFIER,
    NUMERICIDENTIFIERLOOSE,
    NONNUMERICIDENTIFIER,
    MAINVERSION,
    nid,
    MAINVERSIONLOOSE,
    nidl,
    PRERELEASEIDENTIFIER,
    PRERELEASEIDENTIFIERLOOSE,
    PRERELEASE,
    PRERELEASELOOSE,
    BUILDIDENTIFIER,
    BUILD,
    FULL,
    FULLPLAIN,
    LOOSEPLAIN,
    LOOSE,
    GTLT,
    XRANGEIDENTIFIERLOOSE,
    XRANGEIDENTIFIER,
    XRANGEPLAIN,
    XRANGEPLAINLOOSE,
    XRANGE,
    XRANGELOOSE,
    COERCE,
    LONETILDE,
    TILDETRIM,
    tildeTrimReplace,
    TILDE,
    TILDELOOSE,
    LONECARET,
    CARETTRIM,
    caretTrimReplace,
    CARET,
    CARETLOOSE,
    COMPARATORLOOSE,
    COMPARATOR,
    COMPARATORTRIM,
    comparatorTrimReplace,
    HYPHENRANGE,
    HYPHENRANGELOOSE,
    STAR,
    SemVer,
    numeric,
    ANY,
    Comparator,
    Range;
  var __moduleName = context_1 && context_1.id;
  function parse(version, optionsOrLoose) {
    if (!optionsOrLoose || typeof optionsOrLoose !== "object") {
      optionsOrLoose = {
        loose: !!optionsOrLoose,
        includePrerelease: false,
      };
    }
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version !== "string") {
      return null;
    }
    if (version.length > MAX_LENGTH) {
      return null;
    }
    const r = optionsOrLoose.loose ? re[LOOSE] : re[FULL];
    if (!r.test(version)) {
      return null;
    }
    try {
      return new SemVer(version, optionsOrLoose);
    } catch (er) {
      return null;
    }
  }
  exports_1("parse", parse);
  function valid(version, optionsOrLoose) {
    if (version === null) {
      return null;
    }
    const v = parse(version, optionsOrLoose);
    return v ? v.version : null;
  }
  exports_1("valid", valid);
  function clean(version, optionsOrLoose) {
    const s = parse(version.trim().replace(/^[=v]+/, ""), optionsOrLoose);
    return s ? s.version : null;
  }
  exports_1("clean", clean);
  /**
     * Return the version incremented by the release type (major, minor, patch, or prerelease), or null if it's not valid.
     */
  function inc(version, release, optionsOrLoose, identifier) {
    if (typeof optionsOrLoose === "string") {
      identifier = optionsOrLoose;
      optionsOrLoose = undefined;
    }
    try {
      return new SemVer(version, optionsOrLoose).inc(release, identifier)
        .version;
    } catch (er) {
      return null;
    }
  }
  exports_1("inc", inc);
  function diff(version1, version2, optionsOrLoose) {
    if (eq(version1, version2, optionsOrLoose)) {
      return null;
    } else {
      const v1 = parse(version1);
      const v2 = parse(version2);
      let prefix = "";
      let defaultResult = null;
      if (v1 && v2) {
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          defaultResult = "prerelease";
        }
        for (const key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return (prefix + key);
            }
          }
        }
      }
      return defaultResult; // may be undefined
    }
  }
  exports_1("diff", diff);
  function compareIdentifiers(a, b) {
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (a === null || b === null) {
      throw "Comparison against null invalid";
    }
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b
      ? 0
      : anum && !bnum
      ? -1
      : bnum && !anum
      ? 1
      : a < b
      ? -1
      : 1;
  }
  exports_1("compareIdentifiers", compareIdentifiers);
  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
  }
  exports_1("rcompareIdentifiers", rcompareIdentifiers);
  /**
     * Return the major version number.
     */
  function major(v, optionsOrLoose) {
    return new SemVer(v, optionsOrLoose).major;
  }
  exports_1("major", major);
  /**
     * Return the minor version number.
     */
  function minor(v, optionsOrLoose) {
    return new SemVer(v, optionsOrLoose).minor;
  }
  exports_1("minor", minor);
  /**
     * Return the patch version number.
     */
  function patch(v, optionsOrLoose) {
    return new SemVer(v, optionsOrLoose).patch;
  }
  exports_1("patch", patch);
  function compare(v1, v2, optionsOrLoose) {
    return new SemVer(v1, optionsOrLoose).compare(
      new SemVer(v2, optionsOrLoose),
    );
  }
  exports_1("compare", compare);
  function compareLoose(a, b) {
    return compare(a, b, true);
  }
  exports_1("compareLoose", compareLoose);
  function compareBuild(a, b, loose) {
    var versionA = new SemVer(a, loose);
    var versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  }
  exports_1("compareBuild", compareBuild);
  function rcompare(v1, v2, optionsOrLoose) {
    return compare(v2, v1, optionsOrLoose);
  }
  exports_1("rcompare", rcompare);
  function sort(list, optionsOrLoose) {
    return list.sort((a, b) => {
      return compareBuild(a, b, optionsOrLoose);
    });
  }
  exports_1("sort", sort);
  function rsort(list, optionsOrLoose) {
    return list.sort((a, b) => {
      return compareBuild(b, a, optionsOrLoose);
    });
  }
  exports_1("rsort", rsort);
  function gt(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) > 0;
  }
  exports_1("gt", gt);
  function lt(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) < 0;
  }
  exports_1("lt", lt);
  function eq(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) === 0;
  }
  exports_1("eq", eq);
  function neq(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) !== 0;
  }
  exports_1("neq", neq);
  function gte(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) >= 0;
  }
  exports_1("gte", gte);
  function lte(v1, v2, optionsOrLoose) {
    return compare(v1, v2, optionsOrLoose) <= 0;
  }
  exports_1("lte", lte);
  function cmp(v1, operator, v2, optionsOrLoose) {
    switch (operator) {
      case "===":
        if (typeof v1 === "object") {
          v1 = v1.version;
        }
        if (typeof v2 === "object") {
          v2 = v2.version;
        }
        return v1 === v2;
      case "!==":
        if (typeof v1 === "object") {
          v1 = v1.version;
        }
        if (typeof v2 === "object") {
          v2 = v2.version;
        }
        return v1 !== v2;
      case "":
      case "=":
      case "==":
        return eq(v1, v2, optionsOrLoose);
      case "!=":
        return neq(v1, v2, optionsOrLoose);
      case ">":
        return gt(v1, v2, optionsOrLoose);
      case ">=":
        return gte(v1, v2, optionsOrLoose);
      case "<":
        return lt(v1, v2, optionsOrLoose);
      case "<=":
        return lte(v1, v2, optionsOrLoose);
      default:
        throw new TypeError("Invalid operator: " + operator);
    }
  }
  exports_1("cmp", cmp);
  function testSet(set, version, options) {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (let i = 0; i < set.length; i++) {
        if (set[i].semver === ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (
            allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch
          ) {
            return true;
          }
        }
      }
      // Version has a -pre, but it's not one of the ones we like.
      return false;
    }
    return true;
  }
  // take a set of comparators and determine whether there
  // exists a version which can satisfy it
  function isSatisfiable(comparators, options) {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator?.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  }
  // Mostly just for testing and legacy API reasons
  function toComparators(range, optionsOrLoose) {
    return new Range(range, optionsOrLoose).set.map((comp) => {
      return comp
        .map((c) => c.value)
        .join(" ")
        .trim()
        .split(" ");
    });
  }
  exports_1("toComparators", toComparators);
  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  function parseComparator(comp, options) {
    comp = replaceCarets(comp, options);
    comp = replaceTildes(comp, options);
    comp = replaceXRanges(comp, options);
    comp = replaceStars(comp, options);
    return comp;
  }
  function isX(id) {
    return !id || id.toLowerCase() === "x" || id === "*";
  }
  // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
  function replaceTildes(comp, options) {
    return comp
      .trim()
      .split(/\s+/)
      .map((comp) => replaceTilde(comp, options))
      .join(" ");
  }
  function replaceTilde(comp, options) {
    const r = options.loose ? re[TILDELOOSE] : re[TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
      } else if (pr) {
        ret = ">=" +
          M +
          "." +
          m +
          "." +
          p +
          "-" +
          pr +
          " <" +
          M +
          "." +
          (+m + 1) +
          ".0";
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
      }
      return ret;
    });
  }
  // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
  // ^1.2.3 --> >=1.2.3 <2.0.0
  // ^1.2.0 --> >=1.2.0 <2.0.0
  function replaceCarets(comp, options) {
    return comp
      .trim()
      .split(/\s+/)
      .map((comp) => replaceCaret(comp, options))
      .join(" ");
  }
  function replaceCaret(comp, options) {
    const r = options.loose ? re[CARETLOOSE] : re[CARET];
    return comp.replace(r, (_, M, m, p, pr) => {
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (isX(p)) {
        if (M === "0") {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
        }
      } else if (pr) {
        if (M === "0") {
          if (m === "0") {
            ret = ">=" +
              M +
              "." +
              m +
              "." +
              p +
              "-" +
              pr +
              " <" +
              M +
              "." +
              m +
              "." +
              (+p + 1);
          } else {
            ret = ">=" +
              M +
              "." +
              m +
              "." +
              p +
              "-" +
              pr +
              " <" +
              M +
              "." +
              (+m + 1) +
              ".0";
          }
        } else {
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) +
            ".0.0";
        }
      } else {
        if (M === "0") {
          if (m === "0") {
            ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." +
              (+p + 1);
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) +
              ".0";
          }
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
        }
      }
      return ret;
    });
  }
  function replaceXRanges(comp, options) {
    return comp
      .split(/\s+/)
      .map((comp) => replaceXRange(comp, options))
      .join(" ");
  }
  function replaceXRange(comp, options) {
    comp = comp.trim();
    const r = options.loose ? re[XRANGELOOSE] : re[XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          // nothing is allowed
          ret = "<0.0.0";
        } else {
          // nothing is forbidden
          ret = "*";
        }
      } else if (gtlt && anyX) {
        // we know patch is an x, because we have any x at all.
        // replace X with 0
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          // >1.2.3 => >= 1.2.4
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        ret = gtlt + M + "." + m + "." + p;
      } else if (xm) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (xp) {
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
      }
      return ret;
    });
  }
  // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.
  function replaceStars(comp, options) {
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[STAR], "");
  }
  // This function is passed to string.replace(re[HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0
  function hyphenReplace(
    $0,
    from,
    fM,
    fm,
    fp,
    fpr,
    fb,
    to,
    tM,
    tm,
    tp,
    tpr,
    tb,
  ) {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = ">=" + fM + ".0.0";
    } else if (isX(fp)) {
      from = ">=" + fM + "." + fm + ".0";
    } else {
      from = ">=" + from;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = "<" + (+tM + 1) + ".0.0";
    } else if (isX(tp)) {
      to = "<" + tM + "." + (+tm + 1) + ".0";
    } else if (tpr) {
      to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
    } else {
      to = "<=" + to;
    }
    return (from + " " + to).trim();
  }
  function satisfies(version, range, optionsOrLoose) {
    try {
      range = new Range(range, optionsOrLoose);
    } catch (er) {
      return false;
    }
    return range.test(version);
  }
  exports_1("satisfies", satisfies);
  function maxSatisfying(versions, range, optionsOrLoose) {
    //todo
    var max = null;
    var maxSV = null;
    try {
      var rangeObj = new Range(range, optionsOrLoose);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || (maxSV && maxSV.compare(v) === -1)) {
          // compare(max, v, true)
          max = v;
          maxSV = new SemVer(max, optionsOrLoose);
        }
      }
    });
    return max;
  }
  exports_1("maxSatisfying", maxSatisfying);
  function minSatisfying(versions, range, optionsOrLoose) {
    //todo
    var min = null;
    var minSV = null;
    try {
      var rangeObj = new Range(range, optionsOrLoose);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v;
          minSV = new SemVer(min, optionsOrLoose);
        }
      }
    });
    return min;
  }
  exports_1("minSatisfying", minSatisfying);
  function minVersion(range, optionsOrLoose) {
    range = new Range(range, optionsOrLoose);
    var minver = new SemVer("0.0.0");
    if (range.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range.test(minver)) {
      return minver;
    }
    minver = null;
    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];
      comparators.forEach((comparator) => {
        // Clone to avoid manipulating the comparator's semver object.
        var compver = new SemVer(comparator.semver.version);
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          /* fallthrough */
          case "":
          case ">=":
            if (!minver || gt(minver, compver)) {
              minver = compver;
            }
            break;
          case "<":
          case "<=":
            /* Ignore maximum versions */
            break;
          /* istanbul ignore next */
          default:
            throw new Error("Unexpected operation: " + comparator.operator);
        }
      });
    }
    if (minver && range.test(minver)) {
      return minver;
    }
    return null;
  }
  exports_1("minVersion", minVersion);
  function validRange(range, optionsOrLoose) {
    try {
      if (range === null) {
        return null;
      }
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range(range, optionsOrLoose).range || "*";
    } catch (er) {
      return null;
    }
  }
  exports_1("validRange", validRange);
  /**
     * Return true if version is less than all the versions possible in the range.
     */
  function ltr(version, range, optionsOrLoose) {
    return outside(version, range, "<", optionsOrLoose);
  }
  exports_1("ltr", ltr);
  /**
     * Return true if version is greater than all the versions possible in the range.
     */
  function gtr(version, range, optionsOrLoose) {
    return outside(version, range, ">", optionsOrLoose);
  }
  exports_1("gtr", gtr);
  /**
     * Return true if the version is outside the bounds of the range in either the high or low direction.
     * The hilo argument must be either the string '>' or '<'. (This is the function called by gtr and ltr.)
     */
  function outside(version, range, hilo, optionsOrLoose) {
    version = new SemVer(version, optionsOrLoose);
    range = new Range(range, optionsOrLoose);
    let gtfn;
    let ltefn;
    let ltfn;
    let comp;
    let ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisifes the range it is not outside
    if (satisfies(version, range, optionsOrLoose)) {
      return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for (let i = 0; i < range.set.length; ++i) {
      const comparators = range.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator) => {
        if (comparator.semver === ANY) {
          comparator = new Comparator(">=0.0.0");
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, optionsOrLoose)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, optionsOrLoose)) {
          low = comparator;
        }
      });
      if (high === null || low === null) {
        return true;
      }
      // If the edge version comparator has a operator then our version
      // isn't outside it
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range
      if (
        (!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)
      ) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  }
  exports_1("outside", outside);
  function prerelease(version, optionsOrLoose) {
    var parsed = parse(version, optionsOrLoose);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  }
  exports_1("prerelease", prerelease);
  /**
     * Return true if any of the ranges comparators intersect
     */
  function intersects(range1, range2, optionsOrLoose) {
    range1 = new Range(range1, optionsOrLoose);
    range2 = new Range(range2, optionsOrLoose);
    return range1.intersects(range2);
  }
  exports_1("intersects", intersects);
  /**
     * Coerces a string to semver if possible
     */
  function coerce(version, optionsOrLoose) {
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version !== "string") {
      return null;
    }
    const match = version.match(re[COERCE]);
    if (match == null) {
      return null;
    }
    return parse(
      match[1] + "." + (match[2] || "0") + "." + (match[3] || "0"),
      optionsOrLoose,
    );
  }
  exports_1("coerce", coerce);
  return {
    setters: [],
    execute: function () {
      // Note: this is the semver.org version of the spec that it implements
      // Not necessarily the package version of this code.
      exports_1("SEMVER_SPEC_VERSION", SEMVER_SPEC_VERSION = "2.0.0");
      MAX_LENGTH = 256;
      // Max safe segment length for coercion.
      MAX_SAFE_COMPONENT_LENGTH = 16;
      // The actual regexps
      re = [];
      src = [];
      R = 0;
      // The following Regular Expressions can be used for tokenizing,
      // validating, and parsing SemVer version strings.
      // ## Numeric Identifier
      // A single `0`, or a non-zero digit followed by zero or more digits.
      NUMERICIDENTIFIER = R++;
      src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";
      NUMERICIDENTIFIERLOOSE = R++;
      src[NUMERICIDENTIFIERLOOSE] = "[0-9]+";
      // ## Non-numeric Identifier
      // Zero or more digits, followed by a letter or hyphen, and then zero or
      // more letters, digits, or hyphens.
      NONNUMERICIDENTIFIER = R++;
      src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
      // ## Main Version
      // Three dot-separated numeric identifiers.
      MAINVERSION = R++;
      nid = src[NUMERICIDENTIFIER];
      src[MAINVERSION] = `(${nid})\\.(${nid})\\.(${nid})`;
      MAINVERSIONLOOSE = R++;
      nidl = src[NUMERICIDENTIFIERLOOSE];
      src[MAINVERSIONLOOSE] = `(${nidl})\\.(${nidl})\\.(${nidl})`;
      // ## Pre-release Version Identifier
      // A numeric identifier, or a non-numeric identifier.
      PRERELEASEIDENTIFIER = R++;
      src[PRERELEASEIDENTIFIER] = "(?:" + src[NUMERICIDENTIFIER] + "|" +
        src[NONNUMERICIDENTIFIER] + ")";
      PRERELEASEIDENTIFIERLOOSE = R++;
      src[PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[NUMERICIDENTIFIERLOOSE] +
        "|" + src[NONNUMERICIDENTIFIER] + ")";
      // ## Pre-release Version
      // Hyphen, followed by one or more dot-separated pre-release version
      // identifiers.
      PRERELEASE = R++;
      src[PRERELEASE] = "(?:-(" +
        src[PRERELEASEIDENTIFIER] +
        "(?:\\." +
        src[PRERELEASEIDENTIFIER] +
        ")*))";
      PRERELEASELOOSE = R++;
      src[PRERELEASELOOSE] = "(?:-?(" +
        src[PRERELEASEIDENTIFIERLOOSE] +
        "(?:\\." +
        src[PRERELEASEIDENTIFIERLOOSE] +
        ")*))";
      // ## Build Metadata Identifier
      // Any combination of digits, letters, or hyphens.
      BUILDIDENTIFIER = R++;
      src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
      // ## Build Metadata
      // Plus sign, followed by one or more period-separated build metadata
      // identifiers.
      BUILD = R++;
      src[BUILD] = "(?:\\+(" + src[BUILDIDENTIFIER] + "(?:\\." +
        src[BUILDIDENTIFIER] + ")*))";
      // ## Full Version String
      // A main version, followed optionally by a pre-release version and
      // build metadata.
      // Note that the only major, minor, patch, and pre-release sections of
      // the version string are capturing groups.  The build metadata is not a
      // capturing group, because it should not ever be used in version
      // comparison.
      FULL = R++;
      FULLPLAIN = "v?" + src[MAINVERSION] + src[PRERELEASE] + "?" + src[BUILD] +
        "?";
      src[FULL] = "^" + FULLPLAIN + "$";
      // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
      // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
      // common in the npm registry.
      LOOSEPLAIN = "[v=\\s]*" +
        src[MAINVERSIONLOOSE] +
        src[PRERELEASELOOSE] +
        "?" +
        src[BUILD] +
        "?";
      LOOSE = R++;
      src[LOOSE] = "^" + LOOSEPLAIN + "$";
      GTLT = R++;
      src[GTLT] = "((?:<|>)?=?)";
      // Something like "2.*" or "1.2.x".
      // Note that "x.x" is a valid xRange identifer, meaning "any version"
      // Only the first item is strictly required.
      XRANGEIDENTIFIERLOOSE = R++;
      src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
      XRANGEIDENTIFIER = R++;
      src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + "|x|X|\\*";
      XRANGEPLAIN = R++;
      src[XRANGEPLAIN] = "[v=\\s]*(" +
        src[XRANGEIDENTIFIER] +
        ")" +
        "(?:\\.(" +
        src[XRANGEIDENTIFIER] +
        ")" +
        "(?:\\.(" +
        src[XRANGEIDENTIFIER] +
        ")" +
        "(?:" +
        src[PRERELEASE] +
        ")?" +
        src[BUILD] +
        "?" +
        ")?)?";
      XRANGEPLAINLOOSE = R++;
      src[XRANGEPLAINLOOSE] = "[v=\\s]*(" +
        src[XRANGEIDENTIFIERLOOSE] +
        ")" +
        "(?:\\.(" +
        src[XRANGEIDENTIFIERLOOSE] +
        ")" +
        "(?:\\.(" +
        src[XRANGEIDENTIFIERLOOSE] +
        ")" +
        "(?:" +
        src[PRERELEASELOOSE] +
        ")?" +
        src[BUILD] +
        "?" +
        ")?)?";
      XRANGE = R++;
      src[XRANGE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAIN] + "$";
      XRANGELOOSE = R++;
      src[XRANGELOOSE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAINLOOSE] + "$";
      // Coercion.
      // Extract anything that could conceivably be a part of a valid semver
      COERCE = R++;
      src[COERCE] = "(?:^|[^\\d])" +
        "(\\d{1," +
        MAX_SAFE_COMPONENT_LENGTH +
        "})" +
        "(?:\\.(\\d{1," +
        MAX_SAFE_COMPONENT_LENGTH +
        "}))?" +
        "(?:\\.(\\d{1," +
        MAX_SAFE_COMPONENT_LENGTH +
        "}))?" +
        "(?:$|[^\\d])";
      // Tilde ranges.
      // Meaning is "reasonably at or greater than"
      LONETILDE = R++;
      src[LONETILDE] = "(?:~>?)";
      TILDETRIM = R++;
      src[TILDETRIM] = "(\\s*)" + src[LONETILDE] + "\\s+";
      re[TILDETRIM] = new RegExp(src[TILDETRIM], "g");
      tildeTrimReplace = "$1~";
      TILDE = R++;
      src[TILDE] = "^" + src[LONETILDE] + src[XRANGEPLAIN] + "$";
      TILDELOOSE = R++;
      src[TILDELOOSE] = "^" + src[LONETILDE] + src[XRANGEPLAINLOOSE] + "$";
      // Caret ranges.
      // Meaning is "at least and backwards compatible with"
      LONECARET = R++;
      src[LONECARET] = "(?:\\^)";
      CARETTRIM = R++;
      src[CARETTRIM] = "(\\s*)" + src[LONECARET] + "\\s+";
      re[CARETTRIM] = new RegExp(src[CARETTRIM], "g");
      caretTrimReplace = "$1^";
      CARET = R++;
      src[CARET] = "^" + src[LONECARET] + src[XRANGEPLAIN] + "$";
      CARETLOOSE = R++;
      src[CARETLOOSE] = "^" + src[LONECARET] + src[XRANGEPLAINLOOSE] + "$";
      // A simple gt/lt/eq thing, or just "" to indicate "any version"
      COMPARATORLOOSE = R++;
      src[COMPARATORLOOSE] = "^" + src[GTLT] + "\\s*(" + LOOSEPLAIN + ")$|^$";
      COMPARATOR = R++;
      src[COMPARATOR] = "^" + src[GTLT] + "\\s*(" + FULLPLAIN + ")$|^$";
      // An expression to strip any whitespace between the gtlt and the thing
      // it modifies, so that `> 1.2.3` ==> `>1.2.3`
      COMPARATORTRIM = R++;
      src[COMPARATORTRIM] = "(\\s*)" + src[GTLT] + "\\s*(" + LOOSEPLAIN + "|" +
        src[XRANGEPLAIN] + ")";
      // this one has to use the /g flag
      re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], "g");
      comparatorTrimReplace = "$1$2$3";
      // Something like `1.2.3 - 1.2.4`
      // Note that these all use the loose form, because they'll be
      // checked against either the strict or loose comparator form
      // later.
      HYPHENRANGE = R++;
      src[HYPHENRANGE] = "^\\s*(" +
        src[XRANGEPLAIN] +
        ")" +
        "\\s+-\\s+" +
        "(" +
        src[XRANGEPLAIN] +
        ")" +
        "\\s*$";
      HYPHENRANGELOOSE = R++;
      src[HYPHENRANGELOOSE] = "^\\s*(" +
        src[XRANGEPLAINLOOSE] +
        ")" +
        "\\s+-\\s+" +
        "(" +
        src[XRANGEPLAINLOOSE] +
        ")" +
        "\\s*$";
      // Star ranges basically just allow anything at all.
      STAR = R++;
      src[STAR] = "(<|>)?=?\\s*\\*";
      // Compile to actual regexp objects.
      // All are flag-free, unless they were created above with a flag.
      for (let i = 0; i < R; i++) {
        if (!re[i]) {
          re[i] = new RegExp(src[i]);
        }
      }
      SemVer = class SemVer {
        constructor(version, optionsOrLoose) {
          if (!optionsOrLoose || typeof optionsOrLoose !== "object") {
            optionsOrLoose = {
              loose: !!optionsOrLoose,
              includePrerelease: false,
            };
          }
          if (version instanceof SemVer) {
            if (version.loose === optionsOrLoose.loose) {
              return version;
            } else {
              version = version.version;
            }
          } else if (typeof version !== "string") {
            throw new TypeError("Invalid Version: " + version);
          }
          if (version.length > MAX_LENGTH) {
            throw new TypeError(
              "version is longer than " + MAX_LENGTH + " characters",
            );
          }
          if (!(this instanceof SemVer)) {
            return new SemVer(version, optionsOrLoose);
          }
          this.options = optionsOrLoose;
          this.loose = !!optionsOrLoose.loose;
          const m = version.trim().match(
            optionsOrLoose.loose ? re[LOOSE] : re[FULL],
          );
          if (!m) {
            throw new TypeError("Invalid Version: " + version);
          }
          this.raw = version;
          // these are actually numbers
          this.major = +m[1];
          this.minor = +m[2];
          this.patch = +m[3];
          if (this.major > Number.MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
          }
          if (this.minor > Number.MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
          }
          if (this.patch > Number.MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
          }
          // numberify any prerelease numeric ids
          if (!m[4]) {
            this.prerelease = [];
          } else {
            this.prerelease = m[4].split(".").map((id) => {
              if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < Number.MAX_SAFE_INTEGER) {
                  return num;
                }
              }
              return id;
            });
          }
          this.build = m[5] ? m[5].split(".") : [];
          this.format();
        }
        format() {
          this.version = this.major + "." + this.minor + "." + this.patch;
          if (this.prerelease.length) {
            this.version += "-" + this.prerelease.join(".");
          }
          return this.version;
        }
        compare(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          return this.compareMain(other) || this.comparePre(other);
        }
        compareMain(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          return (compareIdentifiers(this.major, other.major) ||
            compareIdentifiers(this.minor, other.minor) ||
            compareIdentifiers(this.patch, other.patch));
        }
        comparePre(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          // NOT having a prerelease is > having one
          if (this.prerelease.length && !other.prerelease.length) {
            return -1;
          } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
          } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
          }
          let i = 0;
          do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            if (a === undefined && b === undefined) {
              return 0;
            } else if (b === undefined) {
              return 1;
            } else if (a === undefined) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
          return 1;
        }
        compareBuild(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          let i = 0;
          do {
            const a = this.build[i];
            const b = other.build[i];
            if (a === undefined && b === undefined) {
              return 0;
            } else if (b === undefined) {
              return 1;
            } else if (a === undefined) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
          return 1;
        }
        inc(release, identifier) {
          switch (release) {
            case "premajor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor = 0;
              this.major++;
              this.inc("pre", identifier);
              break;
            case "preminor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor++;
              this.inc("pre", identifier);
              break;
            case "prepatch":
              // If this is already a prerelease, it will bump to the next version
              // drop any prereleases that might already exist, since they are not
              // relevant at this point.
              this.prerelease.length = 0;
              this.inc("patch", identifier);
              this.inc("pre", identifier);
              break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case "prerelease":
              if (this.prerelease.length === 0) {
                this.inc("patch", identifier);
              }
              this.inc("pre", identifier);
              break;
            case "major":
              // If this is a pre-major version, bump up to the same major version.
              // Otherwise increment major.
              // 1.0.0-5 bumps to 1.0.0
              // 1.1.0 bumps to 2.0.0
              if (
                this.minor !== 0 ||
                this.patch !== 0 ||
                this.prerelease.length === 0
              ) {
                this.major++;
              }
              this.minor = 0;
              this.patch = 0;
              this.prerelease = [];
              break;
            case "minor":
              // If this is a pre-minor version, bump up to the same minor version.
              // Otherwise increment minor.
              // 1.2.0-5 bumps to 1.2.0
              // 1.2.1 bumps to 1.3.0
              if (this.patch !== 0 || this.prerelease.length === 0) {
                this.minor++;
              }
              this.patch = 0;
              this.prerelease = [];
              break;
            case "patch":
              // If this is not a pre-release version, it will increment the patch.
              // If it is a pre-release it will bump up to the same patch version.
              // 1.2.0-5 patches to 1.2.0
              // 1.2.0 patches to 1.2.1
              if (this.prerelease.length === 0) {
                this.patch++;
              }
              this.prerelease = [];
              break;
            // This probably shouldn't be used publicly.
            // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
            case "pre":
              if (this.prerelease.length === 0) {
                this.prerelease = [0];
              } else {
                let i = this.prerelease.length;
                while (--i >= 0) {
                  if (typeof this.prerelease[i] === "number") {
                    this.prerelease[i]++;
                    i = -2;
                  }
                }
                if (i === -1) {
                  // didn't increment anything
                  this.prerelease.push(0);
                }
              }
              if (identifier) {
                // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                if (this.prerelease[0] === identifier) {
                  if (isNaN(this.prerelease[1])) {
                    this.prerelease = [identifier, 0];
                  }
                } else {
                  this.prerelease = [identifier, 0];
                }
              }
              break;
            default:
              throw new Error("invalid increment argument: " + release);
          }
          this.format();
          this.raw = this.version;
          return this;
        }
        toString() {
          return this.version;
        }
      };
      exports_1("SemVer", SemVer);
      numeric = /^[0-9]+$/;
      ANY = {};
      Comparator = class Comparator {
        constructor(comp, optionsOrLoose) {
          if (!optionsOrLoose || typeof optionsOrLoose !== "object") {
            optionsOrLoose = {
              loose: !!optionsOrLoose,
              includePrerelease: false,
            };
          }
          if (comp instanceof Comparator) {
            if (comp.loose === !!optionsOrLoose.loose) {
              return comp;
            } else {
              comp = comp.value;
            }
          }
          if (!(this instanceof Comparator)) {
            return new Comparator(comp, optionsOrLoose);
          }
          this.options = optionsOrLoose;
          this.loose = !!optionsOrLoose.loose;
          this.parse(comp);
          if (this.semver === ANY) {
            this.value = "";
          } else {
            this.value = this.operator + this.semver.version;
          }
        }
        parse(comp) {
          const r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
          const m = comp.match(r);
          if (!m) {
            throw new TypeError("Invalid comparator: " + comp);
          }
          const m1 = m[1];
          this.operator = m1 !== undefined ? m1 : "";
          if (this.operator === "=") {
            this.operator = "";
          }
          // if it literally is just '>' or '' then allow anything.
          if (!m[2]) {
            this.semver = ANY;
          } else {
            this.semver = new SemVer(m[2], this.options.loose);
          }
        }
        test(version) {
          if (this.semver === ANY || version === ANY) {
            return true;
          }
          if (typeof version === "string") {
            version = new SemVer(version, this.options);
          }
          return cmp(version, this.operator, this.semver, this.options);
        }
        intersects(comp, optionsOrLoose) {
          if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
          }
          if (!optionsOrLoose || typeof optionsOrLoose !== "object") {
            optionsOrLoose = {
              loose: !!optionsOrLoose,
              includePrerelease: false,
            };
          }
          let rangeTmp;
          if (this.operator === "") {
            if (this.value === "") {
              return true;
            }
            rangeTmp = new Range(comp.value, optionsOrLoose);
            return satisfies(this.value, rangeTmp, optionsOrLoose);
          } else if (comp.operator === "") {
            if (comp.value === "") {
              return true;
            }
            rangeTmp = new Range(this.value, optionsOrLoose);
            return satisfies(comp.semver, rangeTmp, optionsOrLoose);
          }
          const sameDirectionIncreasing =
            (this.operator === ">=" || this.operator === ">") &&
            (comp.operator === ">=" || comp.operator === ">");
          const sameDirectionDecreasing =
            (this.operator === "<=" || this.operator === "<") &&
            (comp.operator === "<=" || comp.operator === "<");
          const sameSemVer = this.semver.version === comp.semver.version;
          const differentDirectionsInclusive =
            (this.operator === ">=" || this.operator === "<=") &&
            (comp.operator === ">=" || comp.operator === "<=");
          const oppositeDirectionsLessThan =
            cmp(this.semver, "<", comp.semver, optionsOrLoose) &&
            (this.operator === ">=" || this.operator === ">") &&
            (comp.operator === "<=" || comp.operator === "<");
          const oppositeDirectionsGreaterThan =
            cmp(this.semver, ">", comp.semver, optionsOrLoose) &&
            (this.operator === "<=" || this.operator === "<") &&
            (comp.operator === ">=" || comp.operator === ">");
          return (sameDirectionIncreasing ||
            sameDirectionDecreasing ||
            (sameSemVer && differentDirectionsInclusive) ||
            oppositeDirectionsLessThan ||
            oppositeDirectionsGreaterThan);
        }
        toString() {
          return this.value;
        }
      };
      exports_1("Comparator", Comparator);
      Range = class Range {
        constructor(range, optionsOrLoose) {
          if (!optionsOrLoose || typeof optionsOrLoose !== "object") {
            optionsOrLoose = {
              loose: !!optionsOrLoose,
              includePrerelease: false,
            };
          }
          if (range instanceof Range) {
            if (
              range.loose === !!optionsOrLoose.loose &&
              range.includePrerelease === !!optionsOrLoose.includePrerelease
            ) {
              return range;
            } else {
              return new Range(range.raw, optionsOrLoose);
            }
          }
          if (range instanceof Comparator) {
            return new Range(range.value, optionsOrLoose);
          }
          if (!(this instanceof Range)) {
            return new Range(range, optionsOrLoose);
          }
          this.options = optionsOrLoose;
          this.loose = !!optionsOrLoose.loose;
          this.includePrerelease = !!optionsOrLoose.includePrerelease;
          // First, split based on boolean or ||
          this.raw = range;
          this.set = range
            .split(/\s*\|\|\s*/)
            .map((range) => this.parseRange(range.trim()))
            .filter((c) => {
              // throw out any that are not relevant for whatever reason
              return c.length;
            });
          if (!this.set.length) {
            throw new TypeError("Invalid SemVer Range: " + range);
          }
          this.format();
        }
        format() {
          this.range = this.set
            .map((comps) => comps.join(" ").trim())
            .join("||")
            .trim();
          return this.range;
        }
        parseRange(range) {
          const loose = this.options.loose;
          range = range.trim();
          // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
          const hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
          range = range.replace(hr, hyphenReplace);
          // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
          range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
          // `~ 1.2.3` => `~1.2.3`
          range = range.replace(re[TILDETRIM], tildeTrimReplace);
          // `^ 1.2.3` => `^1.2.3`
          range = range.replace(re[CARETTRIM], caretTrimReplace);
          // normalize spaces
          range = range.split(/\s+/).join(" ");
          // At this point, the range is completely trimmed and
          // ready to be split into comparators.
          const compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
          let set = range
            .split(" ")
            .map((comp) => parseComparator(comp, this.options))
            .join(" ")
            .split(/\s+/);
          if (this.options.loose) {
            // in loose mode, throw out any that are not valid comparators
            set = set.filter((comp) => {
              return !!comp.match(compRe);
            });
          }
          return set.map((comp) => new Comparator(comp, this.options));
        }
        test(version) {
          if (typeof version === "string") {
            version = new SemVer(version, this.options);
          }
          for (var i = 0; i < this.set.length; i++) {
            if (testSet(this.set[i], version, this.options)) {
              return true;
            }
          }
          return false;
        }
        intersects(range, optionsOrLoose) {
          if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
          }
          return this.set.some((thisComparators) => {
            return (isSatisfiable(thisComparators, optionsOrLoose) &&
              range.set.some((rangeComparators) => {
                return (isSatisfiable(rangeComparators, optionsOrLoose) &&
                  thisComparators.every((thisComparator) => {
                    return rangeComparators.every((rangeComparator) => {
                      return thisComparator.intersects(
                        rangeComparator,
                        optionsOrLoose,
                      );
                    });
                  }));
              }));
          });
        }
        toString() {
          return this.range;
        }
      };
      exports_1("Range", Range);
      exports_1("default", SemVer);
    },
  };
});

const __exp = __instantiate("mod");
export const parse = __exp["parse"];
export const valid = __exp["valid"];
export const clean = __exp["clean"];
export const inc = __exp["inc"];
export const diff = __exp["diff"];
export const compareIdentifiers = __exp["compareIdentifiers"];
export const rcompareIdentifiers = __exp["rcompareIdentifiers"];
export const major = __exp["major"];
export const minor = __exp["minor"];
export const patch = __exp["patch"];
export const compare = __exp["compare"];
export const compareLoose = __exp["compareLoose"];
export const compareBuild = __exp["compareBuild"];
export const rcompare = __exp["rcompare"];
export const sort = __exp["sort"];
export const rsort = __exp["rsort"];
export const gt = __exp["gt"];
export const lt = __exp["lt"];
export const eq = __exp["eq"];
export const neq = __exp["neq"];
export const gte = __exp["gte"];
export const lte = __exp["lte"];
export const cmp = __exp["cmp"];
export const toComparators = __exp["toComparators"];
export const satisfies = __exp["satisfies"];
export const maxSatisfying = __exp["maxSatisfying"];
export const minSatisfying = __exp["minSatisfying"];
export const minVersion = __exp["minVersion"];
export const validRange = __exp["validRange"];
export const ltr = __exp["ltr"];
export const gtr = __exp["gtr"];
export const outside = __exp["outside"];
export const prerelease = __exp["prerelease"];
export const intersects = __exp["intersects"];
export const coerce = __exp["coerce"];
export const SEMVER_SPEC_VERSION = __exp["SEMVER_SPEC_VERSION"];
export const SemVer = __exp["SemVer"];
export const Comparator = __exp["Comparator"];
export const Range = __exp["Range"];
export default __exp["default"];

