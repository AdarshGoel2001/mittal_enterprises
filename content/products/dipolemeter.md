## Objective

Determination of the dielectric constant of non-aqueous liquids at different concentrations and hence determination of dipole moment (e.g. Nitrobenzene).

## Theory

The Dipolemeter is an instrument used for measuring the dielectric constant of non-polar liquids. A specially developed circuit drives an audio oscillator that produces a stabilized wave. The dielectric cell is first standardized by immersing the cell assembly in a reference liquid of known dielectric constant. The experimental liquid is then introduced and the resulting shift in oscillation frequency gives the capacitance of the cell with the unknown liquid $C_X$. The dielectric constant of the unknown liquid is then:

$$ \varepsilon = 1 + \frac{C_0 - C_X}{C_0 - C_{ST}}\,(\varepsilon_{ST} - 1) $$

where $C_0$ is the capacitance of air, $C_{ST}$ is the capacitance of the standard liquid, $C_X$ is the capacitance of the test liquid and $\varepsilon_{ST}$ is the dielectric constant of the standard liquid.

For a solution of a polar molecule (molecular weight $M_1$) in a non-polar solvent (molecular weight $M_2$) at different concentrations, the molar polarization $P_{12}$ of the mixture is:

$$ P_{12} = \left(\frac{k - 1}{k + 2}\right)\frac{M_1 f_1 + M_2 f_2}{d_{12}} = P_1 f_1 + P_2 f_2 $$

where $k$ is the dielectric constant of the solution with mole fraction $f_1$ of the polar molecule and mole fraction $f_2$ of the non-polar solvent, and $d_{12}$ is the density of the mixture.

A graph of $P_{12}$ vs $f_2$ is then plotted:

![P₁₂ vs f₂ — extrapolation to f₂ = 0 yields P₂](/products/figures/dipolemeter/dipole-31.gif)

The dipole moment $\mu$ is calculated from:

$$ \mu = 0.0127 \times 10^{-18}\,\sqrt{(P_2 - P_0)\,T} $$

where $T$ is the absolute temperature, $P_2$ is the molar polarization extrapolated to infinite dilution and $P_0$ is the molar polarization of the non-polar liquid.

## Apparatus

- Main unit with frequency counter, audio oscillator and electronic circuitry
- Dielectric cell (SS) assembly with Teflon top and BNC connector
- 100 ml beaker
- Attachment for circulation of water from an external water bath
