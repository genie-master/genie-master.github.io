(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = { teal: '#316d88', coral: '#bd673d', gray: '#87949c', green: '#557d59' };

  // Table 1 in the paper: rows are Vanilla VLA, Dual-system, GenieMaster, Human.
  const results = [
    { name: 'Overall', sr: [18.83, 38.83, 78.67, 81], tc: [55.68, 61.31, 89.71, 91.17] },
    { name: 'Hosting guests', sr: [0, 18, 45, 50], tc: [48.20, 68.20, 84.54, 86.60] },
    { name: 'Tablecloth spreading', sr: [15, 25, 60, 55], tc: [58.33, 52, 76.75, 76.45] },
    { name: 'Office-supply search', sr: [0, 32, 84, 95], tc: [18.05, 21.05, 89.80, 92.11] },
    { name: 'Item retrieval', sr: [20, 40, 93, 95], tc: [81.16, 80.55, 96.67, 98.74] },
    { name: 'Restocking', sr: [53, 58, 95, 96], tc: [62.50, 67.76, 96.05, 98.33] },
    { name: 'Cleaning', sr: [25, 60, 95, 95], tc: [65.83, 78.30, 94.44, 94.79] },
  ];
  const methods = ['Vanilla VLA', 'Dual-system', 'GenieMaster', 'Human orchestration'];
  const methodLabels = [['Vanilla', 'VLA'], ['Dual-', 'system'], ['GenieMaster'], ['Human', 'orchestration']];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgElement(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgText(svg, x, y, text, attrs = {}) {
    svg.append(svgElement('text', { x, y, class: 'plot-label', ...attrs }, text));
  }

  function legend(entries) {
    const key = element('div', 'plot-key');
    entries.forEach(({ name, color }) => {
      const item = element('span');
      const swatch = element('i');
      swatch.style.backgroundColor = color;
      item.append(swatch, document.createTextNode(name));
      key.append(item);
    });
    return key;
  }

  function bindReadout(target, readout, text) {
    target.setAttribute('tabindex', '0');
    target.setAttribute('role', 'img');
    target.setAttribute('aria-label', text);
    target.append(svgElement('title', {}, text));
    ['pointerenter', 'focus', 'pointerdown'].forEach((event) => {
      target.addEventListener(event, () => { readout.textContent = text; });
    });
  }

  function animatePlot(plot) {
    plot.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    if (reducedMotion.matches) return;
    plot.querySelectorAll('[data-motion]').forEach((node) => {
      const delay = Number(node.dataset.delay || 0);
      const timing = { duration: 1000, delay, easing: 'cubic-bezier(.22,.7,.25,1)', fill: 'backwards' };
      if (node.dataset.motion === 'line') {
        node.animate([{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], timing);
      } else if (node.dataset.motion === 'bar') {
        node.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], timing);
      } else if (node.dataset.motion === 'horizontal') {
        node.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], timing);
      } else {
        node.animate([{ opacity: 0 }, { opacity: 1 }], { ...timing, duration: 450 });
      }
    });
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && target.dataset.inView !== 'true') animatePlot(target);
      target.dataset.inView = String(isIntersecting);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -35px 0px' }) : null;

  function responsivePlot(host, draw) {
    let previousWidth = 0;
    const render = () => {
      const width = Math.round(host.getBoundingClientRect().width);
      if (width < 100 || width === previousWidth) return;
      previousWidth = width;
      host.replaceChildren(draw(width));
    };
    render();
    if ('ResizeObserver' in window) new ResizeObserver(render).observe(host);
    else window.addEventListener('resize', render);
    if (observer) observer.observe(host);
    return (play = true) => {
      previousWidth = 0;
      render();
      if (play) animatePlot(host);
    };
  }

  function svgBase(width, height, title) {
    const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'group', 'aria-label': title, class: 'native-plot' });
    svg.append(svgElement('title', {}, title));
    return svg;
  }

  function yAxis(svg, left, right, top, bottom, dual = false) {
    [0, 25, 50, 75, 100].forEach((value) => {
      const y = bottom - value / 100 * (bottom - top);
      svg.append(svgElement('line', { x1: left, x2: right, y1: y, y2: y, class: 'plot-gridline' }));
      svgText(svg, left - 10, y + 4, `${value}${dual ? '%' : ''}`, { 'text-anchor': 'end', class: 'plot-tick' });
      if (dual) svgText(svg, right + 10, y + 4, value, { class: 'plot-tick plot-tick-calls' });
    });
  }

  function groupedBars(width, { title, labels, names, series, axisLabel = 'Success / completion (%)' }, readout) {
    const svg = svgBase(width, 350, title);
    const left = 38, right = width - 16, top = 49, bottom = 279;
    yAxis(svg, left, right, top, bottom);
    svgText(svg, left, 16, axisLabel, { class: 'plot-axis-title' });
    const groupWidth = (right - left) / names.length;
    const barWidth = Math.min(42, groupWidth * 0.27);
    names.forEach((name, groupIndex) => {
      const center = left + groupWidth * (groupIndex + 0.5);
      series.forEach((entry, seriesIndex) => {
        const value = entry.values[groupIndex];
        const x = center + (seriesIndex === 0 ? -barWidth - 3 : 3);
        const y = bottom - value / 100 * (bottom - top);
        const group = svgElement('g', { class: 'plot-datum' });
        group.append(svgElement('rect', {
          x, y, width: barWidth, height: bottom - y, rx: 2, fill: entry.color,
          class: 'plot-bar', 'data-motion': 'bar', 'data-delay': groupIndex * 90 + seriesIndex * 35,
        }));
        const valueX = x + barWidth / 2;
        const valueText = svgElement('text', {
          x: valueX, y: y - 7, class: 'plot-value', fill: entry.color,
          'text-anchor': width < 480 ? 'start' : 'middle', 'data-motion': 'label', 'data-delay': 500 + groupIndex * 90,
          ...(width < 480 ? { transform: `rotate(-55 ${valueX} ${y - 7})` } : {}),
        }, value.toFixed(2));
        group.append(valueText);
        bindReadout(group, readout, `${name} / ${entry.name}: ${value.toFixed(2)}%`);
        svg.append(group);
      });
      labels[groupIndex].forEach((line, index) => {
        svgText(svg, center, 310 + index * 16, line, { 'text-anchor': 'middle', class: groupIndex === 2 && names.length === 4 ? 'plot-label plot-label-emphasis' : 'plot-label', ...(width < 300 && names.length === 4 ? { style: 'font-size:8px' } : {}) });
      });
    });
    return svg;
  }

  function linePlot(width, { title, labels, xValues, logarithmic = false, series, axisLabel, dual = false }, readout) {
    const svg = svgBase(width, 340, title);
    const left = dual ? 47 : 38, right = width - (dual ? 42 : 25), top = 45, bottom = 267;
    yAxis(svg, left, right, top, bottom, dual);
    svgText(svg, left, 16, 'Success rate (%)', { class: 'plot-axis-title' });
    if (dual) svgText(svg, right, 16, 'Calls / successful trial', { 'text-anchor': 'end', class: 'plot-axis-title plot-tick-calls' });
    const xs = xValues.map((value, i) => logarithmic
      ? left + (Math.log10(value) - Math.log10(xValues[0])) / (Math.log10(xValues.at(-1)) - Math.log10(xValues[0])) * (right - left)
      : left + i / (xValues.length - 1) * (right - left));
    xs.forEach((x, index) => {
      svg.append(svgElement('line', { x1: x, x2: x, y1: top, y2: bottom, class: 'plot-guide' }));
      svgText(svg, x, 296, labels[index], { 'text-anchor': 'middle' });
    });
    svgText(svg, (left + right) / 2, 328, axisLabel, { 'text-anchor': 'middle', class: 'plot-axis-title' });
    series.forEach((entry, seriesIndex) => {
      const points = entry.values.map((value, i) => [xs[i], bottom - value / 100 * (bottom - top)]);
      const path = svgElement('path', {
        d: points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' '),
        fill: 'none', stroke: entry.color, 'stroke-width': 2.5, 'stroke-linecap': 'round',
        pathLength: 1, 'stroke-dasharray': '1', 'data-motion': 'line', 'data-delay': seriesIndex * 120,
      });
      svg.append(path);
      points.forEach(([x, y], index) => {
        const group = svgElement('g', { class: 'plot-datum', 'data-motion': 'label', 'data-delay': 120 + index * 160 });
        group.append(svgElement('circle', { cx: x, cy: y, r: 13, fill: 'transparent' }));
        group.append(svgElement('circle', { cx: x, cy: y, r: 4.5, fill: entry.color, stroke: '#fff', 'stroke-width': 2 }));
        if (!entry.endpointsOnly || index === 0 || index === points.length - 1) {
          const offset = seriesIndex === 0 && !dual && y < bottom - 20 ? 20 : -12;
          group.append(svgElement('text', { x, y: y + offset, 'text-anchor': 'middle', class: 'plot-value', fill: entry.color }, entry.values[index]));
        }
        bindReadout(group, readout, `${labels[index]} ${logarithmic ? 'training SKUs' : 'round'} / ${entry.name}: ${entry.values[index]}${entry.unit || '%'}`);
        svg.append(group);
      });
    });
    return svg;
  }

  function panel(title, key, summary) {
    const root = element('div', 'plot-panel');
    const host = element('div', 'plot-host');
    const readout = element('output', 'plot-readout', summary);
    readout.setAttribute('aria-live', 'polite');
    root.append(element('h4', 'plot-heading', title), legend(key), host, readout);
    return { root, host, readout };
  }

  const performance = document.querySelector('[data-performance-chart]');
  if (performance) {
    let resultIndex = 0;
    const heading = document.querySelector('#performance-title');
    const readout = element('output', 'plot-readout');
    const host = element('div', 'plot-host');
    performance.removeAttribute('role');
    performance.removeAttribute('aria-label');
    performance.className = 'performance-plot';
    performance.replaceChildren(legend([{ name: 'Success rate (SR)', color: colors.teal }, { name: 'Task completion (TC)', color: colors.coral }]), host, readout);
    const render = responsivePlot(host, (width) => {
      const result = results[resultIndex];
      readout.textContent = `GenieMaster / SR ${result.sr[2].toFixed(2)}% / TC ${result.tc[2].toFixed(2)}%`;
      return groupedBars(width, { title: `${result.name}: SR and TC by method`, names: methods, labels: methodLabels,
        series: [{ name: 'SR', color: colors.teal, values: result.sr }, { name: 'TC', color: colors.coral, values: result.tc }] }, readout);
    });
    const select = document.querySelector('#result-select');
    results.forEach((result, index) => select.append(new Option(result.name, String(index))));
    const show = (index) => {
      resultIndex = (index + results.length) % results.length;
      select.value = String(resultIndex);
      performance.dataset.result = String(resultIndex);
      heading.textContent = results[resultIndex].name;
      document.querySelector('[data-result-count]').textContent = `${String(resultIndex + 1).padStart(2, '0')} / 07`;
      document.querySelector('[data-result-note]').textContent = resultIndex === 0
        ? 'Overall is the unweighted mean across six tasks. SR and TC are scored independently; each method is evaluated on 100 trials per task.'
        : `${results[resultIndex].name}: 100 trials per method with randomized layouts. SR and TC are scored independently, including failed trials.`;
      render();
    };
    select.addEventListener('change', () => show(Number(select.value)));
    document.querySelector('[data-result-prev]').addEventListener('click', () => show(resultIndex - 1));
    document.querySelector('[data-result-next]').addEventListener('click', () => show(resultIndex + 1));
    document.querySelector('.performance-nav').hidden = false;
    performance.dataset.result = '0';
  }

  const capabilityFigure = document.querySelector('[data-experiment="capabilities"]');
  if (capabilityFigure) {
    const plot = element('div', 'capability-plot');
    plot.append(element('h4', 'plot-heading', 'Cumulative capabilities'), element('p', 'plot-subheading', 'Each configuration retains the capabilities above it.'));
    const capabilities = [
      ['Arm control (IK)', 25], ['+ Grasp planning', 40], ['+ Guidance-trained policy', 83],
      ['+ Object references', 94], ['+ Agent head / waist control', 97],
    ];
    capabilities.forEach(([name, value], index) => {
      const row = element('div', 'capability-row');
      const track = element('div', 'capability-track');
      const bar = element('span', 'capability-bar');
      bar.style.width = `${value}%`;
      bar.dataset.motion = 'horizontal';
      bar.dataset.delay = String(index * 130);
      track.append(bar);
      row.append(element('span', 'capability-index', `C${index + 1}`), element('span', 'capability-name', name), track, element('strong', 'capability-value', `${value}%`));
      row.tabIndex = 0;
      row.setAttribute('aria-label', `C${index + 1}: ${name.replace('+ ', '')}; cumulative retrieval success ${value}%`);
      plot.append(row);
    });
    plot.append(element('p', 'plot-subheading', '100 trials per configuration / fixed-location retrieval'));
    capabilityFigure.querySelector('.chart-fallback').replaceWith(plot);
    if (observer) observer.observe(plot);
  }

  const policyKey = [{ name: 'Text-only policy', color: colors.gray }, { name: 'EEP-guided policy', color: colors.teal }];
  const generalizationFigure = document.querySelector('[data-experiment="generalization"]');
  if (generalizationFigure) {
    const plots = element('div', 'native-chart-pair');
    const scale = panel('Novel products across training scales', policyKey, '1,000 SKUs / EEP-guided 92% / Text-only 20%');
    const split = panel('Seen and novel products', policyKey, 'Novel / EEP-guided 92% / Text-only 20%');
    plots.append(scale.root, split.root);
    generalizationFigure.querySelector('.chart-fallback').replaceWith(plots);
    responsivePlot(scale.host, (width) => linePlot(width, { title: 'Novel-product retrieval across training SKU scales', labels: ['10', '30', '1,000'], xValues: [10, 30, 1000], logarithmic: true, axisLabel: 'Training SKUs (log scale)',
      series: [{ name: 'Text-only', color: colors.gray, values: [0, 12, 20] }, { name: 'EEP-guided', color: colors.teal, values: [12, 56, 92] }] }, scale.readout));
    responsivePlot(split.host, (width) => groupedBars(width, { title: 'Seen versus novel products at 1,000 training SKUs', axisLabel: 'Success rate (%)', names: ['Seen', 'Novel'], labels: [['Seen'], ['Novel']],
      series: [{ name: 'Text-only', color: colors.gray, values: [72, 20] }, { name: 'EEP-guided', color: colors.teal, values: [96, 92] }] }, split.readout));
  }

  const experienceFigure = document.querySelector('[data-experiment="experience"]');
  if (experienceFigure) {
    const key = [{ name: 'Success rate', color: colors.teal }, { name: 'Mean tool calls', color: colors.coral }];
    const study = panel('Office-supply search with accumulated memory', key, 'Round 5 / SR 85.7% / Mean tool calls 65.0');
    experienceFigure.querySelector('.chart-fallback').replaceWith(study.root);
    responsivePlot(study.host, (width) => linePlot(width, { title: 'Office-supply search over five rounds with accumulated memory', labels: ['1', '2', '3', '4', '5'], xValues: [1, 2, 3, 4, 5], axisLabel: 'Evaluation round', dual: true,
      series: [{ name: 'Success rate', color: colors.teal, values: [28.6, 57.1, 71.4, 42.9, 85.7] }, { name: 'Mean tool calls', color: colors.coral, values: [54.5, 62.5, 60.8, 60, 65], endpointsOnly: true, unit: ' calls' }] }, study.readout));
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) document.querySelectorAll('.plot-host, .capability-plot').forEach((plot) => {
      plot.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    });
  });
})();
