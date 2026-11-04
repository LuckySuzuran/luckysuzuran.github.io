---
layout: post
title: "Gradient descent, one small step at a time"
date: 2026-03-01 10:00:00 +0800
category: tech
tags: [Machine Learning, Python, Notes]
math: true
description: "An intuition, a few equations, and a tiny implementation you can run in plain Python."
---
The best way I know to understand an algorithm is to make it small enough to hold in my head. Here is gradient descent in its simplest form: pick a direction, take a step, and check whether things improved.

This starter post demonstrates **equations**, syntax-highlighted code, lists, tables, and a figure. Feel free to replace it with your own technical notes.

## Start with a landscape

Imagine a smooth bowl. The height at a position $w$ is our loss, $L(w) = (w - 3)^2$. We want to find the bottom without checking every possible position.

The derivative tells us how the height changes:

$$
\frac{dL}{dw} = 2(w - 3).
$$

At $w = 0$, the derivative is negative. Moving a little to the right lowers the loss. At $w = 5$, the derivative is positive, so we move left.

{% include figure.html src="/assets/images/gradient-descent.svg" alt="A parabolic loss curve with steps approaching its minimum at w equals 3" caption="Small steps down a simple loss landscape. The minimum is at w = 3." width="90%" %}

## The update rule

For parameters $\theta$ and learning rate $\eta$, one update is:

$$
\theta_{t+1} = \theta_t - \eta\,\nabla_\theta L(\theta_t).
$$

The minus sign matters: the gradient points uphill, so we step in the opposite direction. The learning rate controls **how far** we move.

> A useful first experiment: keep the objective fixed and change only the learning rate.

## A tiny implementation

No framework is necessary for this one-dimensional example:

```python
def loss(w):
    return (w - 3.0) ** 2


def gradient(w):
    return 2.0 * (w - 3.0)


w = 0.0
learning_rate = 0.1

for step in range(40):
    w -= learning_rate * gradient(w)
    if step % 10 == 0:
        print(f"step={step:02d}  w={w:.4f}  loss={loss(w):.6f}")

assert abs(w - 3.0) < 0.001
```

The update becomes $w_{t+1} = 0.8w_t + 0.6$. Subtracting the optimum from both sides gives $w_{t+1} - 3 = 0.8(w_t - 3)$, so the error shrinks by a factor of $0.8$ at every step.

## What changes with the step size?

For this particular quadratic, the error multiplier is $1 - 2\eta$.

| Learning rate | Behavior for this objective |
| :--- | :--- |
| $0 < \eta < 0.5$ | Approaches the minimum from one side |
| $\eta = 0.5$ | Reaches the minimum in one step |
| $0.5 < \eta < 1$ | Oscillates with shrinking error |
| $\eta \geq 1$ | Does not generally converge |

The last row assumes an initial point different from the optimum. This range is specific to this loss; a different curvature changes the stable step sizes.

## A few habits worth keeping

1. Start with a case whose answer you already know.
2. Log the loss and inspect its direction.
3. Change one thing at a time.
4. Write down the assumption behind the result.

Inline code such as `learning_rate` stays untouched by the math renderer. When writing money in a math-enabled post, use `&#36;20` to show a literal dollar sign.

---

Next experiment: try a two-dimensional bowl with different curvature along each axis. The same update rule can produce a surprisingly different path.
