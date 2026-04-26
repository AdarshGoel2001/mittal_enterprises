# Editing product descriptions

Each product has its own file in `content/products/`. The filename matches the product's URL slug — e.g., `nano-fluid-interferometer.md` becomes the page at `/products/nano-science-instruments/nano-fluid-interferometer`.

You only edit the body of the `.md` file. The product's name, item code, image and category live in `lib/products-data.ts` and don't need to be touched.

## The basics

- **Section heading:** start a line with `## ` — e.g., `## Working Principle`
- **Bold:** wrap text in `**...**` — e.g., `**INSTRUMENT**`
- **Bullet list:** start each line with `- ` — e.g., `- Wave Generator`
- **Paragraph break:** leave a blank line between paragraphs

## Formulas (math)

Wrap math in dollar signs. Use single `$...$` for inline, double `$$...$$` for a centred display equation.

```
The Bridgman formula gives $k = \rho v_s c_p$ for pure liquids.

$$ E = \sigma T^4 $$
```

Common LaTeX bits:

| What you want | Type |
| --- | --- |
| Greek letter | `\alpha`, `\beta`, `\rho`, `\sigma`, `\lambda` |
| Subscript | `T_c`, `f_q` |
| Superscript | `10^{23}`, `T^4` |
| Fraction | `\frac{a}{b}` |
| Square root | `\sqrt{x}` |
| Multiply | `\times` |
| Plus or minus | `\pm` |
| Approximately | `\approx` |

If you don't want to learn LaTeX, just paste in a graph image instead (see below) — that works perfectly well for equations too.

## Graphs and images

1. Save the image as a PNG or JPG.
2. Drop it into `public/products/figures/`. Use a clear filename, e.g., `7104-velocity-vs-temperature.png`.
3. In the markdown, write:

```
![Velocity vs temperature for Ag nanofluid](/products/figures/7104-velocity-vs-temperature.png)
```

The text in the square brackets is a caption that appears below the image. Keep it short and factual.

If you want a graph and an equation side by side, just put them on consecutive lines — the layout takes care of itself.

## Worked example

```markdown
## Theory

Heat conduction in liquids follows Bridgman's relation, with thermal conductivity directly proportional to ultrasound velocity:

$$ k = \rho \, v_s \, c_p $$

where $\rho$ is density and $v_s$ is sound velocity in the liquid.

## Working Principle

Ultrasound waves of known frequency are produced and the wavelength is measured. Sound velocity in the liquid is then calculated, and from that the thermal conductivity follows.

![Block diagram of the apparatus](/products/figures/7106-block-diagram.png)

## Description

The apparatus consists of:

- Electronic unit
- Conductivity cell — 2 MHz
- Stability cell — 4 MHz
- Temperature controller (RT to 70 °C)
```

That renders as a styled section page on the live site.

## Saving

Saving the file is enough — the dev server picks it up automatically. For the live site, the change goes out the next time the build runs.

## If something looks wrong

If a formula doesn't render, you probably forgot a closing `$`. If an image doesn't show up, double-check the path starts with `/products/figures/` and the file is actually saved in `public/products/figures/`.
