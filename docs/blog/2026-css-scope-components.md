---
title: "CSS `@scope` changes how I think about components in 2026"
published: false
description: "Native @scope is baseline. Combined with TypeScript, it makes one of the oldest ideas in CSS — generating components straight from stylesheets — finally practical."
tags: css, javascript, react, webdev
cover_image:
---

<!--
Publication checklist:

1. dev.to (canonical):
   - Paste this file's front-matter + body into a new dev.to draft
     (https://dev.to/new). dev.to reads the front-matter directly.
   - Generate a cover image (1000x420, dev.to recommendation) and set
     `cover_image` above to its URL — or upload via the dev.to UI.
   - Flip `published: true` and publish. The dev.to URL is now the
     canonical URL for this post.

2. Hashnode cross-post:
   - New article → "Import from dev.to" or paste manually.
   - In article settings → SEO → set canonical URL to the dev.to URL.

3. Medium cross-post:
   - Use the "Import a story" feature with the dev.to URL — Medium
     auto-sets the canonical pointing back to dev.to.

4. After publication, submit the dev.to URL to:
   - r/css   — "I wrote about how @scope changes component thinking" (link to article, not repo)
   - r/javascript / r/reactjs — same framing, mention capsule-css only as one example
   - daily.dev — submit URL via Squad or directly
   - CSS Weekly / Frontend Focus / JS Weekly — pitch via newsletter contact form

Keep the repo unmentioned in the post title and lede; the article is
about @scope first, capsule-css second.
-->


I've been writing CSS for fifteen years. In that time I've watched the
component model migrate **into** JavaScript and stay there: BEM, CSS Modules,
styled-components, Emotion, Stitches, vanilla-extract, Panda, StyleX.
Every iteration framed the same trade-off — "we need scoping and types, so
we have to give up something about how CSS already works."

In 2026 we don't have to give it up anymore. Native `@scope` shipped in
Chrome 118 in late 2023 and Safari 17.4 in early 2024. Firefox is the only
holdout, and it's behind a flag with active work upstream. By the time
anyone reads this, `@scope` is just **CSS** — supported in the same
browsers we already write CSS for.

That changes the calculation more than I expected. This is the article I
wish I'd read two years ago.

---

## The shape of the problem (a quick tour)

I've shipped production code with most of the tools above. Each one taught
me something. The shape of their compromise is roughly:

- **Tailwind / utility-first** — wonderful for speed, painful for editing
  large class strings during code review, locks you into a vocabulary that
  doesn't always survive a redesign.
- **CSS Modules** — the most "CSS-like" answer. Class-name hashing breaks
  DevTools inspection in production, and the typing story (whether via
  `typed-css-modules` or your editor's IntelliSense) scatters `.d.ts` files
  across the source tree until your repo navigator turns into noise.
- **CSS-in-JS (Emotion / styled-components / Stitches)** — fantastic
  developer experience until React Server Components arrived. Suddenly
  the runtime that made it ergonomic was the runtime that didn't fit.
- **Build-time CSS-in-JS (vanilla-extract / Panda / StyleX)** — solves the
  RSC problem and produces real CSS files, but at the cost of learning
  another DSL, another build pipeline, and another set of escape hatches
  when you need plain CSS.

None of these are bad. They're all answers to a problem that **CSS itself**
didn't solve: **how do you scope styles to a component without manually
prefixing every selector?**

That problem has a native answer now.

## What `@scope` actually does

If you've never used it, here's the shortest possible introduction. This:

```css
@scope (.Card) {
  :scope {
    padding: 16px;
    border: 1px solid #e2e8f0;
  }

  h2 {
    font-size: 18px;
  }
}
```

…is a CSS-native scoped block. The `:scope` selector matches the element
that the `@scope` block is anchored to (every `.Card` in the document).
The bare `h2` rule applies **only to `<h2>` elements inside a `.Card`**.

What used to require either a build-time class-name hash or a deliberate
naming convention (BEM `.card__title`) is now a couple of lines of
standard CSS that the browser reads directly.

The interesting part isn't the syntax — it's what it makes possible.

## The 2018 idea worth rescuing

Long before any of the modern build-time CSS tools existed, there was a
small library called [nyancss](https://github.com/nyancss/nyancss).
It had ~500 stars and never broke through. The idea, though, was startling
in retrospect:

> *Generate JavaScript components directly from CSS files.*

You wrote a regular `.css` file, declared a class, and `nyancss` produced
an importable component module. Like CSS Modules — except instead of
exporting a string of hashed class names, it exported the **component
itself**.

In 2018 this didn't catch on, for two related reasons:

1. **TypeScript was not yet ubiquitous.** Without typed props inferred from
   the CSS, the value proposition was thinner.
2. **CSS had no native scoping.** You either accepted global classes or
   went all-in on a build-time hashing tool.

Both reasons evaporated in the last few years. TypeScript is the default
in every React/Vite/Next.js template. And `@scope` is now baseline. So I
went back and asked the obvious question:

**What does that 2018 idea look like in 2026?**

## A small, complete example

Imagine a file called `Button.scope.css`:

```css
@scope (.Button) {
  :scope {
    display: inline-flex;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  :scope[data-intent="primary"]   { background: #0066ff; color: white; }
  :scope[data-intent="secondary"] { background: transparent; border: 1.5px solid #d1d5db; }

  :scope[data-size="sm"] { padding: 4px 8px;   font-size: 12px; }
  :scope[data-size="md"] { padding: 8px 12px;  font-size: 14px; }
  :scope[data-size="lg"] { padding: 12px 24px; font-size: 16px; }
}
```

Three things to notice:

1. It's **valid CSS today**. You can drop it in any modern browser, link
   it from `<style>`, and it just works.
2. The variants are encoded as `data-*` attribute selectors on `:scope`.
   These are attributes the *element itself* carries, not descendants —
   exactly the metadata a typed component needs.
3. There's no DSL, no template language, no class-name interpolation.

If you read this file with a small parser and look at every selector that
hangs off `:scope`, you can pull out a complete picture of what the
component accepts:

- An attribute `data-intent` with two valid values (`"primary"`, `"secondary"`).
- An attribute `data-size` with three valid values (`"sm"`, `"md"`, `"lg"`).

Both should be optional. Both should be type-safe in TypeScript.

A code generator can emit this from the CSS, with no other input:

```ts
import * as React from "react";

export type ButtonProps = {
  intent?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ intent, size, className = "", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`Button ${className}`.trim()}
      {...(intent && { "data-intent": intent })}
      {...(size && { "data-size": size })}
    />
  );
}
```

In your app, you write:

```tsx
<Button intent="primary" onClick={save}>Save</Button>
```

…and TypeScript autocompletes both `intent` and `size` directly from the
CSS file. Rename a variant in the stylesheet, and the type-checker tells
you exactly which call sites to update.

The runtime overhead is **zero**. The browser sets `data-intent="primary"`
on a `<button>` element, and the `:scope[data-intent="primary"]` rule
matches. No CSS-in-JS injection, no hashed classes, no extra runtime
beyond the small functional component.

This is the part I find genuinely exciting: the source of truth is the
`.css` file. The component is **derived** from it.

## The honest tradeoffs

I'd be a bad engineer if I didn't say what you give up. There are
constraints:

- **You can't put arbitrary CSS-in-JS expressions in your stylesheet.**
  Variant values have to be string literals — that's how the parser knows
  what type to emit. If you want runtime style interpolation, this isn't
  the model for you.
- **Component names get a convention.** `@scope (.Button)` exports a
  `Button` component. PascalCase, one component per `@scope` block. A
  small price.
- **`@scope` browser support is still uneven on Firefox** (behind a flag
  in 2026). Until it ships unflagged you either accept Chrome/Safari-only,
  or you compile `@scope` down to flat selectors at build time. Both are
  workable.
- **You give up CSS Modules' class-name hashing.** This is mostly a
  feature: `.Button` shows up as `.Button` in DevTools, not as
  `.Button_q1z3x`. But if you genuinely need cross-team isolation in a
  monorepo with conflicting names, you'll need a convention.

What you gain in exchange:

- **Plain CSS as the source of truth.** Open the file in any editor or
  Figma plugin or AI tool, and it reads like any other CSS file.
- **Typed variants for free.** No second schema, no generic helper that
  wraps your styles, no `cva`-style call-site boilerplate.
- **Zero runtime.** The generated component is a small functional
  wrapper that sets attributes. Nothing else.
- **Honest review surface.** When you review a PR, the diff is in CSS,
  where it belongs, not in a 200-line styled-component template literal.

## "Is anyone actually doing this?"

Yes. I built [`capsule-css`](https://github.com/capsule-css/capsule-css)
to test the idea. It's a small Go-based parser, a Vite plugin, and a
generator for React and vanilla JS targets. It's still alpha — the API
is small enough to be stable, but the ecosystem (Vue, Svelte, Solid,
Angular) hasn't caught up yet. If you want to play with the model
described in this article, that's the most direct way.

If you don't want to use the tool, you can still take the idea and run
with it. Write a small parser yourself, walk the `@scope` blocks, emit
your own component template. The whole code generator I shipped is under
2,000 lines of Go. The ideas are independent of the implementation.

## A bigger picture

I think `@scope` is one of those CSS features we'll look back on in 2028
the way we look back on Flexbox in 2018: the moment when a problem we
worked around for a decade just stopped being a problem.

The thing that surprised me, going back to nyancss after seven years, is
how much of what we built since then was **compensating for missing
browser features**. Class-name hashing existed because there was no
scoping. CSS-in-JS runtimes existed because there was no `:scope`. DSLs
existed because we couldn't express component metadata in pure CSS.

In 2026, we can. The good idea hasn't changed. The browsers caught up.

It feels worth trying again.

---

*If you want to play with the idea concretely, the parser and Vite plugin
live at [capsule-css/capsule-css](https://github.com/capsule-css/capsule-css)
under MIT. Issues, ideas, and "actually I tried this in 2019" stories all
welcome.*
