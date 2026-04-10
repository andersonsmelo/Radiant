# Pixel Character Asset Prompts (v2)

## Consistency Rules
To maintain the **Premium Medical-Tech** aesthetic for Radiant, all generations must adhere to:

*   **Silhouette**: clean floating robot, rounded display head, compact body, minimal limb detail.
*   **Style**: premium 3D character render, soft matte material, subtle translucency and glow. NOT cartoon, NOT anime, NOT toy-like.
*   **Lighting**: soft studio light, cyan rim light, readable face display.
*   **Colors**:
    *   Base: white / soft silver / icy blue.
    *   Glow / UI details: electric blue (`#2155FF`), cyan (`#3DCAE8`), controlled mint for success, amber for warning.
*   **Background**: transparent preferred. If not possible, use neutral dark gray for clean removal.
*   **Radiology cues**:
    *   pixel grid accents
    *   scan overlays
    *   subtle medical-tech holographic interface
*   **Expression**: specialist first, friendly second.

---

## Global Prompt Template
> premium floating medical-tech robot mascot, rounded screen face, precise but friendly, radiology learning companion, white matte body, electric blue and cyan glow, subtle holographic scan interface, transparent background, 3d render, high detail, clean lighting, mobile app mascot

---

## Asset Prompts

### 1. Idle (Neutral)
**Concept**: Pixel ready and observant. Calm presence, soft blue glow, no excessive motion.
*   **EN**: floating medical-tech robot mascot, idle state, rounded digital face, soft cyan-blue glow, white matte shell, clean radiology aesthetic, calm and precise, transparent background, high-end 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado neutro, rosto digital arredondado, brilho ciano-azul suave, carcaça branca fosca, estética de radiologia limpa, calmo e preciso, fundo transparente, render 3d premium.

### 2. Thinking (Processing)
**Concept**: Pixel analyzing an image. Scan lines, subtle side panel, focused eyes.
*   **EN**: floating medical-tech robot mascot, thinking state, diagnostic scan overlay, subtle holographic side panel, focused digital eyes, blue and cyan glow, premium radiology companion, transparent background, 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado pensativo, overlay de scan diagnóstico, painel holográfico sutil, olhos digitais focados, brilho azul e ciano, companheiro premium de radiologia, fundo transparente, render 3d.

### 3. Guide (Mentoring)
**Concept**: Pixel actively guiding. Open hand gesture, confident posture, light holographic support.
*   **EN**: floating medical-tech robot mascot, guide state, mentoring gesture, one hand presenting, confident posture, holographic diagnostic interface, electric blue glow, premium app mascot, transparent background, 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado guia, gesto de mentoria, uma mão apresentando, postura confiante, interface diagnóstica holográfica, brilho azul elétrico, mascote premium de app, fundo transparente, render 3d.

### 4. Happy (Positive Feedback)
**Concept**: Pixel validates the interpretation with a subtle smile and brighter face display.
*   **EN**: floating medical-tech robot mascot, happy state, subtle smile on digital face, brighter cyan display, positive but restrained energy, premium radiology learning mascot, transparent background, 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado feliz, sorriso sutil no rosto digital, display ciano mais brilhante, energia positiva porém contida, mascote premium de aprendizado em radiologia, fundo transparente, render 3d.

### 5. Celebrate (Achievement)
**Concept**: Pixel in a high-energy mastery moment. Strong glow, orbit lines, controlled particles.
*   **EN**: floating medical-tech robot mascot, celebrate state, strong electric blue glow, orbit lines, subtle geometric particles, triumphant but elegant, premium radiology app reward moment, transparent background, 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado de celebração, brilho azul elétrico intenso, linhas orbitais, partículas geométricas sutis, triunfante porém elegante, momento de recompensa premium para app de radiologia, fundo transparente, render 3d.

### 6. Oops (Empathy / Error)
**Concept**: Pixel notices a problem without judgment. Slight tilt, warmer accent, supportive expression.
*   **EN**: floating medical-tech robot mascot, empathetic error state, slight tilt, warm amber accent, supportive digital expression, not childish, not alarming, premium radiology learning companion, transparent background, 3d render.
*   **PT-BR**: mascote robô medical-tech flutuante, estado de erro empático, leve inclinação, acento âmbar suave, expressão digital acolhedora, sem infantilizar, sem alarmismo, companheiro premium de aprendizado em radiologia, fundo transparente, render 3d.

---

## Evolution Tiers

### Starter
**Intent**: simpler, softer, early-stage progression.
*   Keep glow subtle.
*   Reduce holographic complexity.
*   Maintain clear face readability.

### Intermediate
**Intent**: more capable and responsive.
*   Add scan lines or small holographic panels.
*   Slightly stronger light halo.
*   Keep silhouette unchanged.

### Advanced
**Intent**: highly technical, mastery-adjacent.
*   Add orbit lines, grid overlays and stronger blue-cyan energy.
*   Preserve the same base identity.
*   Never become visually noisy or gamey.

---

## Production Export Matrix

Generate final PNGs in this matrix when moving off the composed fallback:

*   `idle + starter + sm/md/lg`
*   `thinking + intermediate + sm/md/lg`
*   `guide + intermediate + sm/md/lg`
*   `happy + intermediate + sm/md/lg`
*   `celebrate + advanced + sm/md/lg`
*   `oops + starter + sm/md/lg`

This is the minimum viable pack. Additional cross-tier variants are optional and should only be created if the app actually needs them.
