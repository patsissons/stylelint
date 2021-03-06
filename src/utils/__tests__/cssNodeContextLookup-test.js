import test from "tape"
import postcss from "postcss"
import postcssImport from "postcss-import"
import path from "path"
import cssNodeContextLookup from "../cssNodeContextLookup"

test("cssNodeContextLookup checking media context", t => {
  const testLookup = cssNodeContextLookup()

  t.plan(8)
  postcss([postcssImport()])
    .process("@import 'fixtures/one.css'; @import 'fixtures/two.css';", {
      from: path.join(__dirname, "fake.css"),
    })
    .then(result => {
      const rulesBySelector = {}
      result.root.walkRules(rule => {
        rulesBySelector[rule.selector] = rule
      })

      // a-d are in one file; e-h in another
      t.equal(
        testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
        testLookup.getContext(rulesBySelector.b, rulesBySelector.b.parent)
      )
      t.notEqual(
        testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
        testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent)
      )
      t.notEqual(
        testLookup.getContext(rulesBySelector.a, rulesBySelector.a.parent),
        testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent)
      )
      t.equal(
        testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
        testLookup.getContext(rulesBySelector.d, rulesBySelector.d.parent)
      )
      t.notEqual(
        testLookup.getContext(rulesBySelector.c, rulesBySelector.c.parent),
        testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent)
      )
      t.equal(
        testLookup.getContext(rulesBySelector.e, rulesBySelector.e.parent),
        testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent)
      )
      t.notEqual(
        testLookup.getContext(rulesBySelector.f, rulesBySelector.f.parent),
        testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent)
      )
      t.equal(
        testLookup.getContext(rulesBySelector.g, rulesBySelector.g.parent),
        testLookup.getContext(rulesBySelector.h, rulesBySelector.h.parent)
      )
    })
    .catch(err => console.log(err.stack)) // eslint-disable-line
})
