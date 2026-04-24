(function () {
  const DESIGN_W = 768, DESIGN_H = 1920;
  const GRID_COLS = 8, GRID_ROWS = 20, CELL = 96;
  const CAR_SPEED = 300, OBSTACLE_SPEED = 500;
  const BASE_PATH = '';
  let MENU_BG_H = 6000;
  let MENU_SCROLL_MAX = MENU_BG_H - DESIGN_H;
  let menuCfg = null;

  function getMenuInitScroll() {
    if (menuCfg && menuCfg.bg && menuCfg.bg.scrollStartY !== undefined) return menuCfg.bg.scrollStartY;
    return MENU_SCROLL_MAX;
  }

  function clampMenuScroll(val) {
    const looping = menuCfg && menuCfg.bg && menuCfg.bg.loop;
    if (looping) return val;
    return Math.max(0, Math.min(val, MENU_SCROLL_MAX));
  }

  function loadMenuConfig() {
    try {
      const raw = localStorage.getItem('menuConfig');
      if (raw) {
        menuCfg = JSON.parse(raw);
        if (menuCfg.bg && menuCfg.bg.height) {
          MENU_BG_H = menuCfg.bg.height;
          MENU_SCROLL_MAX = MENU_BG_H - DESIGN_H;
        }
      }
    } catch (e) {}
  }

  const CAR_COLORS = {
    zhixing: '#4A90D9', zuozhuan: '#5CB85C', youzhuan: '#F0AD4E',
    zuodiaotou: '#9B59B6', youdiaotou: '#E74C3C'
  };

  const menuBtnImgCache = {};

  function getMenuButtonImage(relativePath) {
    if (!relativePath) return null;
    const key = String(relativePath);
    let im = menuBtnImgCache[key];
    if (!im) {
      im = new Image();
      im.src = BASE_PATH + key;
      menuBtnImgCache[key] = im;
    }
    if (im.complete && im.naturalWidth > 0) return im;
    return null;
  }

  function getMenuBaseY(mc) {
    const t = (mc && mc.title) || {};
    const titleOffY = (t.offsetY !== undefined) ? t.offsetY : 100;
    return MENU_BG_H - DESIGN_H + titleOffY;
  }

  function buildLegacyLevelButtons(mc, menuBaseY) {
    const lo = (mc && mc.layout) || {};
    const u = (mc && mc.unlocked) || {}, cp = (mc && mc.completed) || {}, lk = (mc && mc.locked) || {};
    const cols = lo.cols || 3, padding = lo.padding || 40, gap = lo.gap || 30;
    const btnW = (DESIGN_W - padding * 2 - gap * (cols - 1)) / cols;
    const btnH = btnW * (lo.ratio || 0.8);
    const startY = menuBaseY + (lo.startY || 230);
    const r = lo.radius || 16;
    const sh = lo.shadow !== false, shb = lo.shadowBlur || 10;
    const arr = [];
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const bx = padding + col * (btnW + gap);
      const by = startY + row * (btnH + gap);
      const n = String(i + 1);
      arr.push({
        id: 'levelBtn' + n,
        x: bx, y: by, height: btnH, aspectRatio: lo.ratio || 0.8,
        borderRadius: r, shadow: sh, shadowBlur: shb,
        unlocked: { image: '', fallback: (u.top || '#3498db'), text: n, textColor: (u.textColor || '#fff'), textSize: (u.numSize || 48), textOffsetX: btnW / 2, textOffsetY: btnH / 2 - 10, fontWeight: 'bold', textAlign: 'center', textBaseline: 'middle' },
        completed: { image: '', fallback: (cp.top || '#2ecc71'), text: (cp.label || '★ 已通关'), textColor: (cp.labelColor || 'rgba(255,255,255,0.8)'), textSize: (cp.labelSize || 22), textOffsetX: btnW / 2, textOffsetY: btnH / 2 + 8, fontWeight: 'normal', textAlign: 'center', textBaseline: 'middle' },
        locked: { image: '', fallback: (lk.bg || '#555'), text: (lk.label || '🔒'), textColor: (lk.textColor || '#888'), textSize: (lk.labelSize || 28), textOffsetX: btnW / 2, textOffsetY: btnH / 2, fontWeight: 'normal', textAlign: 'center', textBaseline: 'middle' }
      });
    }
    return arr;
  }

  function defaultLevelButtons() {
    const lo = { cols: 3, padding: 40, gap: 30, ratio: 0.8, radius: 16, startY: 230 };
    const m = { title: { offsetY: 100 }, layout: { ...lo, shadow: true, shadowBlur: 10 }, unlocked: { top: '#3498db', textColor: '#ffffff', numSize: 48 }, completed: { top: '#2ecc71', label: '★ 已通关', labelSize: 22, labelColor: 'rgba(255,255,255,0.8)' }, locked: { bg: '#555', textColor: '#888', label: '🔒', labelSize: 28 } };
    return buildLegacyLevelButtons(m, getMenuBaseY(m));
  }

  function mergeBtn(a, b) {
    if (!b) return a;
    return {
      ...a, ...b,
      unlocked: { ...a.unlocked, ...(b.unlocked || {}) },
      completed: { ...a.completed, ...(b.completed || {}) },
      locked: { ...a.locked, ...(b.locked || {}) }
    };
  }

  function menuButtonId(b) {
    return String(b && b.id != null ? b.id : '').trim();
  }

  function isMenuPlayButton(b) {
    return menuButtonId(b).toLowerCase() === 'play';
  }

  /** 用于皮肤：该按钮与第几关的解锁/通关进度对应；默认按顺序 = 索引+1。 */
  function getMenuButtonStateLevel(b, index0) {
    if (b && b.stateLevel != null && b.stateLevel !== '') {
      const n = parseInt(b.stateLevel, 10);
      if (!isNaN(n) && n >= 1) return n;
    }
    return index0 + 1;
  }

  function getMenuButtonLayer(b) {
    return (b && b.layer === 'fixed') ? 'fixed' : 'scroll';
  }

  function shouldShowMenuButton(b, scrollY) {
    if (!b || b.visibleRule !== 'inRange') return true;
    const rg = b.showRange || {};
    const mn = rg.minScrollY != null ? parseFloat(rg.minScrollY) : 0;
    const mx = rg.maxScrollY != null ? parseFloat(rg.maxScrollY) : 999999;
    const minY = isNaN(mn) ? 0 : mn;
    const maxY = isNaN(mx) ? 999999 : mx;
    return scrollY >= minY && scrollY <= maxY;
  }

  function menuHasAnyPlayButton(list) {
    for (let j = 0; j < list.length; j++) {
      if (isMenuPlayButton(list[j])) return true;
    }
    return false;
  }

  function resolveLevelButtons(mc) {
    if (!mc) return defaultLevelButtons();
    const list = mc.levelButtons;
    const defs = defaultLevelButtons();
    if (Array.isArray(list) && list.length > 0) {
      return list.map((b, i) => mergeBtn(defs[Math.min(i, defs.length - 1)] || defs[0], b));
    }
    if (mc.layout) return buildLegacyLevelButtons(mc, getMenuBaseY(mc));
    return defaultLevelButtons();
  }

  const DIR_DELTA = {
    Right: { dx: 1, dy: 0 }, Left: { dx: -1, dy: 0 },
    Up: { dx: 0, dy: -1 }, Down: { dx: 0, dy: 1 }
  };

  const LEFT_TURN_MAP = { Left: 'Down', Right: 'Up', Up: 'Left', Down: 'Right' };
  const RIGHT_TURN_MAP = { Left: 'Up', Right: 'Down', Up: 'Right', Down: 'Left' };

  const T_JUNCTION_BLOCK = { Left: 'Right', Right: 'Left', Up: 'Down', Down: 'Up' };

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let scale = 1, offsetX = 0, offsetY = 0;
  let dpr = window.devicePixelRatio || 1;

  const images = {};
  let imagesLoaded = false;
  let bgm = null;
  let bgmStarted = false;

  const state = {
    screen: 'loading',
    loadStart: 0,
    loadDuration: 3000,
    currentLevel: 0,
    userProgress: 0,
    userId: 1,
    userName: 'player',
    menuScrollY: MENU_SCROLL_MAX,
    menuTouchStartY: 0,
    menuTouchLastY: 0,
    menuIsDragging: false,
    level: null,
    resultTimer: 0,
    winAnimTimer: 0
  };

  /** 游戏中最高关卡编号（与 LEVELS 的键一致）。 */
  function getMaxLevelNum() {
    if (typeof LEVELS === 'undefined' || !LEVELS) return 0;
    const ns = Object.keys(LEVELS).map(k => parseInt(k, 10)).filter(n => !isNaN(n) && n > 0);
    return ns.length ? Math.max.apply(null, ns) : 0;
  }

  function clampUserProgress(p) {
    const maxLv = getMaxLevelNum();
    if (isNaN(p) || p < 0) return 0;
    if (maxLv > 0 && p > maxLv) return maxLv;
    return p;
  }

  /** 从 localStorage 读取并初始化「已通几关」进度：无存档为 0；首次点击 play 进入第 1 关 (userProgress+1)。 */
  function loadUserData() {
    let uid = 1;
    let uname = 'player';
    let p = 0;
    try {
      const raw = localStorage.getItem('carGameUser');
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d === 'object') {
          const u = d.userId;
          uid = u != null && !isNaN(parseInt(u, 10)) ? Math.max(1, parseInt(u, 10)) : 1;
          uname = typeof d.userName === 'string' && d.userName ? d.userName : 'player';
          const parsed = parseInt(d.userProgress, 10);
          p = isNaN(parsed) ? 0 : parsed;
        }
      }
    } catch (e) {}
    state.userId = uid;
    state.userName = uname;
    state.userProgress = clampUserProgress(p);
  }

  function saveUserData() {
    const p = clampUserProgress(parseInt(state.userProgress, 10) || 0);
    state.userProgress = p;
    localStorage.setItem('carGameUser', JSON.stringify({
      userId: state.userId, userName: state.userName, userProgress: p
    }));
  }

  function loadImage(key, src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { images[key] = img; resolve(); };
      img.onerror = () => { resolve(); };
      img.src = src;
    });
  }

  async function loadAllAssets() {
    const promises = [];
    const types = ['zhixing', 'zuozhuan', 'youzhuan', 'zuodiaotou', 'youdiaotou'];
    const dirs = ['Up', 'Down', 'Left', 'Right'];
    for (const t of types) {
      for (const d of dirs) {
        promises.push(loadImage(`car_${t}_${d}`, `${BASE_PATH}assets/cars/${t}/${d}.png`));
      }
    }
    for (let i = 1; i <= 10; i++) {
      const num = String(i).padStart(4, '0');
      promises.push(loadImage(`map_${num}`, `${BASE_PATH}assets/map/${num}.png`));
    }
    promises.push(loadImage('loading_bg', `${BASE_PATH}assets/jiemian/j0001.png`));
    const menuBgSrc = (menuCfg && menuCfg.bg && menuCfg.bg.image) || 'assets/jiemian/z0001.png';
    promises.push(loadImage('menu_bg', `${BASE_PATH}${menuBgSrc}`));
    promises.push(loadImage('result_bg', `${BASE_PATH}assets/jiemian/g0001.png`));
    promises.push(loadImage('btn_play', `${BASE_PATH}assets/nanniu/n0002.png`));
    promises.push(loadImage('btn_gear', `${BASE_PATH}assets/nanniu/n0001.png`));
    promises.push(loadImage('cop_thumbsup', `${BASE_PATH}assets/nanniu/g0001.png`));
    promises.push(loadImage('congrats_banner', `${BASE_PATH}assets/nanniu/g0002.png`));
    promises.push(loadImage('coin_car', `${BASE_PATH}assets/nanniu/g0004.png`));
    promises.push(loadImage('btn_blue', `${BASE_PATH}assets/nanniu/lan.png`));
    promises.push(loadImage('btn_gray', `${BASE_PATH}assets/nanniu/hui.png`));
    await Promise.all(promises);
    imagesLoaded = true;
  }

  function initBGM() {
    if (bgm) return;
    const ac = (menuCfg && menuCfg.audio) || {};
    bgm = new Audio(`${BASE_PATH}${ac.file || 'assets/music/bgm0002.mp3'}`);
    bgm.loop = (ac.loop !== undefined) ? ac.loop : true;
    bgm.volume = (ac.volume !== undefined) ? ac.volume : 0.3;
  }

  function startBGM() {
    if (!bgm) initBGM();
    if (!bgmStarted) {
      bgm.play().catch(() => {});
      bgmStarted = true;
    }
  }

  function resize() {
    const ww = window.innerWidth, wh = window.innerHeight;
    const aspect = DESIGN_W / DESIGN_H;
    let cw, ch;
    if (ww / wh > aspect) {
      ch = wh; cw = ch * aspect;
    } else {
      cw = ww; ch = cw / aspect;
    }
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    scale = cw / DESIGN_W;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  }

  function screenToGame(sx, sy) {
    const rect = canvas.getBoundingClientRect();
    const x = (sx - rect.left) / scale;
    const y = (sy - rect.top) / scale;
    return { x, y };
  }

  function getCarCells(car) {
    const cells = [{ x: car.x, y: car.y }];
    const d = DIR_DELTA[car.dir];
    cells.push({ x: car.x - d.dx, y: car.y - d.dy });
    return cells;
  }

  function cellsOverlap(cellsA, cellsB) {
    for (const a of cellsA) {
      for (const b of cellsB) {
        if (a.x === b.x && a.y === b.y) return true;
      }
    }
    return false;
  }

  function isOutOfBounds(car) {
    const cells = getCarCells(car);
    for (const c of cells) {
      if (c.x < 0 || c.x >= GRID_COLS || c.y < 0 || c.y >= GRID_ROWS) return true;
    }
    return false;
  }

  function startLevel(num) {
    const config = LEVELS[num];
    if (!config) return;
    state.currentLevel = num;
    state.screen = 'level';
    state.level = {
      levelNum: num,
      cars: config.cars.map(c => ({
        ...c,
        originalX: c.x, originalY: c.y, originalDir: c.dir, originalLogic: c.logic,
        moving: false, atExit: false, hidden: false,
        visitedIntersections: new Set(),
        moveTimer: 0, animX: c.x * CELL, animY: c.y * CELL,
        skipIntersectionTimer: 0,
        justReset: false
      })),
      intersections: config.intersections.map(i => ({ ...i })),
      obstacles: config.obstacles.map(o => ({
        ...o,
        currentX: o.x, currentY: o.y, currentDir: o.dir,
        animX: o.x * CELL, animY: o.y * CELL,
        moveTimer: 0, waitTimer: 0, waypointIdx: 0, waiting: false
      })),
      exits: config.exits.map(e => ({ ...e })),
      currentCompleted: 0,
      target: config.target,
      won: false,
      mapKey: `map_${config.map}`
    };
  }

  function resetCar(car) {
    car.x = car.originalX;
    car.y = car.originalY;
    car.dir = car.originalDir;
    car.logic = car.originalLogic;
    car.moving = false;
    car.visitedIntersections = new Set();
    car.moveTimer = 0;
    car.animX = car.x * CELL;
    car.animY = car.y * CELL;
    car.skipIntersectionTimer = 0;
    car.justReset = true;
    setTimeout(() => { car.justReset = false; }, 50);
  }

  function applyTurn(car) {
    if (car.logic === 'straight') return;
    if (car.logic === 'left_turn') {
      car.dir = LEFT_TURN_MAP[car.dir];
    } else if (car.logic === 'right_turn') {
      car.dir = RIGHT_TURN_MAP[car.dir];
    } else if (car.logic === 'left_uturn') {
      car.dir = LEFT_TURN_MAP[car.dir];
      car.logic = 'left_turn';
      car.skipIntersectionTimer = 180;
    } else if (car.logic === 'right_uturn') {
      car.dir = RIGHT_TURN_MAP[car.dir];
      car.logic = 'right_turn';
      car.skipIntersectionTimer = 180;
    }
  }

  function stepCar(car, lvl) {
    if (car.hidden || !car.moving) return;

    const d = DIR_DELTA[car.dir];
    car.x += d.dx;
    car.y += d.dy;

    const headCell = { x: car.x, y: car.y };

    for (const exit of lvl.exits) {
      if (headCell.x === exit.x && headCell.y === exit.y) {
        car.hidden = true;
        car.moving = false;
        car.atExit = true;
        lvl.currentCompleted++;
        if (lvl.currentCompleted >= lvl.target) {
          lvl.won = true;
          state.winAnimTimer = 800;
        }
        return;
      }
    }

    if (isOutOfBounds(car)) {
      resetCar(car);
      return;
    }

    const myCells = getCarCells(car);

    for (const other of lvl.cars) {
      if (other.id === car.id || other.hidden) continue;
      const otherCells = getCarCells(other);
      if (cellsOverlap(myCells, otherCells)) {
        resetCar(car);
        return;
      }
    }

    for (const obs of lvl.obstacles) {
      if (myCells.some(c => c.x === Math.round(obs.currentX) && c.y === Math.round(obs.currentY))) {
        resetCar(car);
        return;
      }
    }

    if (car.skipIntersectionTimer <= 0) {
      for (const inter of lvl.intersections) {
        if (car.visitedIntersections.has(inter.id)) continue;
        if (myCells.some(c => c.x === inter.x && c.y === inter.y)) {
          if (inter.type === 't') {
            const blocked = T_JUNCTION_BLOCK[inter.opening];
            let newDir = car.dir;
            if (car.logic === 'left_turn') newDir = LEFT_TURN_MAP[car.dir];
            else if (car.logic === 'right_turn') newDir = RIGHT_TURN_MAP[car.dir];
            else if (car.logic === 'left_uturn') newDir = LEFT_TURN_MAP[car.dir];
            else if (car.logic === 'right_uturn') newDir = RIGHT_TURN_MAP[car.dir];
            if (newDir === blocked) {
              resetCar(car);
              return;
            }
          }
          car.visitedIntersections.add(inter.id);
          applyTurn(car);
          break;
        }
      }
    }
  }

  function updateObstacles(lvl, dt) {
    for (const obs of lvl.obstacles) {
      if (obs.waiting) {
        obs.waitTimer -= dt;
        if (obs.waitTimer <= 0) {
          obs.waiting = false;
          const wp = obs.waypoints[obs.waypointIdx];
          obs.currentDir = wp.dir;
        }
        continue;
      }

      obs.moveTimer += dt;
      if (obs.moveTimer >= obs.speed) {
        obs.moveTimer -= obs.speed;
        const d = DIR_DELTA[obs.currentDir];
        obs.currentX += d.dx;
        obs.currentY += d.dy;

        const wp = obs.waypoints[obs.waypointIdx];
        if (obs.currentX === wp.x && obs.currentY === wp.y) {
          obs.waiting = true;
          obs.waitTimer = wp.wait;
          obs.waypointIdx = (obs.waypointIdx + 1) % obs.waypoints.length;
        }

        for (const car of lvl.cars) {
          if (car.hidden || !car.moving) continue;
          const carCells = getCarCells(car);
          if (carCells.some(c => c.x === obs.currentX && c.y === obs.currentY)) {
            resetCar(car);
          }
        }
      }
      obs.animX += (obs.currentX * CELL - obs.animX) * 0.15;
      obs.animY += (obs.currentY * CELL - obs.animY) * 0.15;
    }
  }

  function update(dt) {
    if (state.screen === 'loading') {
      if (Date.now() - state.loadStart >= state.loadDuration && imagesLoaded) {
        state.screen = 'menu';
        state.menuScrollY = getMenuInitScroll();
      }
      return;
    }

    if (state.screen === 'level' && state.level) {
      const lvl = state.level;
      if (lvl.won) {
        state.winAnimTimer -= dt;
        if (state.winAnimTimer <= 0) {
          state.screen = 'result';
          if (state.currentLevel > state.userProgress) {
            state.userProgress = state.currentLevel;
            saveUserData();
          }
        }
        return;
      }

      updateObstacles(lvl, dt);

      for (const car of lvl.cars) {
        if (!car.moving || car.hidden) continue;
        if (car.skipIntersectionTimer > 0) car.skipIntersectionTimer -= dt;
        car.moveTimer += dt;
        if (car.moveTimer >= car.speed) {
          car.moveTimer -= car.speed;
          stepCar(car, lvl);
        }
        const targetX = car.x * CELL, targetY = car.y * CELL;
        car.animX += (targetX - car.animX) * 0.25;
        car.animY += (targetY - car.animY) * 0.25;
      }
    }
  }

  function drawImage(key, x, y, w, h) {
    const img = images[key];
    if (img) {
      ctx.drawImage(img, x, y, w, h);
    }
  }

  function drawRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function renderLoading() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    if (images['loading_bg']) {
      ctx.drawImage(images['loading_bg'], 0, 0, DESIGN_W, DESIGN_H);
    }

    const progress = Math.min(1, (Date.now() - state.loadStart) / state.loadDuration);
    const barW = 500, barH = 30, barX = (DESIGN_W - barW) / 2, barY = DESIGN_H - 200;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    drawRoundRect(barX - 4, barY - 4, barW + 8, barH + 8, 18);
    ctx.fill();

    ctx.fillStyle = '#333';
    drawRoundRect(barX, barY, barW, barH, 14);
    ctx.fill();

    const grd = ctx.createLinearGradient(barX, 0, barX + barW * progress, 0);
    grd.addColorStop(0, '#FFD700');
    grd.addColorStop(1, '#FF8C00');
    ctx.fillStyle = grd;
    drawRoundRect(barX, barY, barW * progress, barH, 14);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('加载中... ' + Math.floor(progress * 100) + '%', DESIGN_W / 2, barY + barH + 40);
  }

  function renderMenu() {
    const mc = menuCfg || {};
    const t = mc.title || {}, s = mc.sub || {};

    const bgLoop = !!(mc.bg && mc.bg.loop);
    ctx.fillStyle = (mc.bg && mc.bg.fallbackColor) || '#1a1a2e';
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    if (images['menu_bg']) {
      if (bgLoop) {
        const offset = ((state.menuScrollY % MENU_BG_H) + MENU_BG_H) % MENU_BG_H;
        const y0 = -offset;
        ctx.drawImage(images['menu_bg'], 0, y0, DESIGN_W, MENU_BG_H);
        if (y0 + MENU_BG_H < DESIGN_H) {
          ctx.drawImage(images['menu_bg'], 0, y0 + MENU_BG_H, DESIGN_W, MENU_BG_H);
        }
        if (y0 > 0) {
          ctx.drawImage(images['menu_bg'], 0, y0 - MENU_BG_H, DESIGN_W, MENU_BG_H);
        }
      } else {
        ctx.drawImage(images['menu_bg'], 0, -state.menuScrollY, DESIGN_W, MENU_BG_H);
      }
    } else {
      const grd = ctx.createLinearGradient(0, 0, 0, DESIGN_H);
      grd.addColorStop(0, '#16213e');
      grd.addColorStop(1, '#0f3460');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    }

    ctx.save();
    const scrollForUI = bgLoop ? ((state.menuScrollY % MENU_BG_H) + MENU_BG_H) % MENU_BG_H : state.menuScrollY;
    ctx.translate(0, -scrollForUI);

    const titleOffY = (t.offsetY !== undefined) ? t.offsetY : 100;
    const menuBaseY = MENU_BG_H - DESIGN_H + titleOffY;

    if (t.bgShow !== false) {
      ctx.fillStyle = t.bgColor || 'rgba(0,0,0,0.4)';
      drawRoundRect(80, menuBaseY, DESIGN_W - 160, 120, t.bgRadius || 20);
      ctx.fill();
    }
    ctx.fillStyle = t.color || '#FFD700';
    ctx.font = (t.weight || 'bold') + ' ' + (t.size || 60) + 'px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.text || '挪车游戏', DESIGN_W / 2, menuBaseY + 60);

    ctx.fillStyle = s.color || 'rgba(255,255,255,0.7)';
    ctx.font = (s.size || 28) + 'px "Microsoft YaHei", sans-serif';
    ctx.fillText(s.text || '选择关卡', DESIGN_W / 2, menuBaseY + (s.offsetY || 170));

    const levelBtns = resolveLevelButtons(mc);

    for (let i = 0; i < levelBtns.length; i++) {
      const b = levelBtns[i];
      if (!b) continue;
      if (!shouldShowMenuButton(b, scrollForUI)) continue;
      const stateLv = getMenuButtonStateLevel(b, i);
      const unlocked = stateLv <= state.userProgress + 1;
      const completed = stateLv <= state.userProgress;
      const stName = !unlocked ? 'locked' : (completed ? 'completed' : 'unlocked');
      const st = b[stName] || b.unlocked || {};
      const btnH = b.height;
      const btnW = btnH / (b.aspectRatio || 0.8);
      const bx = b.x;
      const by = getMenuButtonLayer(b) === 'fixed' ? (b.y + scrollForUI) : b.y;
      const r = b.borderRadius || 0;

      ctx.save();
      if (b.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = b.shadowBlur || 10;
        ctx.shadowOffsetY = 4;
      }
      const bimg = getMenuButtonImage(st.image);
      if (bimg) {
        ctx.save();
        drawRoundRect(bx, by, btnW, btnH, r);
        ctx.clip();
        ctx.drawImage(bimg, bx, by, btnW, btnH);
        ctx.restore();
      } else {
        ctx.fillStyle = st.fallback || '#555';
        drawRoundRect(bx, by, btnW, btnH, r);
        ctx.fill();
      }
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = st.textColor || '#fff';
      ctx.font = (st.fontWeight || 'normal') + ' ' + (st.textSize || 16) + 'px "Microsoft YaHei", sans-serif';
      ctx.textAlign = st.textAlign || 'left';
      ctx.textBaseline = st.textBaseline || 'top';
      const sw = (st.strokeWidth != null) ? parseFloat(st.strokeWidth) : 0;
      const hasStroke = !isNaN(sw) && sw > 0;
      if (hasStroke) {
        ctx.strokeStyle = st.strokeColor || '#000000';
        ctx.lineWidth = sw;
        ctx.lineJoin = 'round';
      }
      const tw = (st.textOffsetX != null) ? st.textOffsetX : btnW / 2;
      const th = (st.textOffsetY != null) ? st.textOffsetY : btnH / 2;
      const textStr = (st.text != null) ? String(st.text) : String(stateLv);
      if (textStr.indexOf('\n') >= 0) {
        const lines = textStr.split('\n');
        const lh = (st.textSize || 16) * 1.25;
        lines.forEach((line, li) => {
          const yy = by + th + li * lh;
          if (hasStroke) ctx.strokeText(line, bx + tw, yy);
          ctx.fillText(line, bx + tw, yy);
        });
      } else {
        if (hasStroke) ctx.strokeText(textStr, bx + tw, by + th);
        ctx.fillText(textStr, bx + tw, by + th);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  function renderLevel() {
    const lvl = state.level;
    if (!lvl) return;

    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    const mapImg = images[lvl.mapKey];
    if (mapImg) {
      ctx.drawImage(mapImg, 0, 0, DESIGN_W, DESIGN_H);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= GRID_COLS; gx++) {
      ctx.beginPath();
      ctx.moveTo(gx * CELL, 0);
      ctx.lineTo(gx * CELL, GRID_ROWS * CELL);
      ctx.stroke();
    }
    for (let gy = 0; gy <= GRID_ROWS; gy++) {
      ctx.beginPath();
      ctx.moveTo(0, gy * CELL);
      ctx.lineTo(GRID_COLS * CELL, gy * CELL);
      ctx.stroke();
    }

    for (const exit of lvl.exits) {
      const ex = exit.x * CELL, ey = exit.y * CELL;
      if (exit.x >= 0 && exit.x < GRID_COLS && exit.y >= 0 && exit.y < GRID_ROWS) {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.35)';
        ctx.fillRect(ex + 4, ey + 4, CELL - 8, CELL - 8);
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.strokeRect(ex + 4, ey + 4, CELL - 8, CELL - 8);
      } else {
        let ax = Math.max(0, Math.min(GRID_COLS - 1, exit.x)) * CELL;
        let ay = Math.max(0, Math.min(GRID_ROWS - 1, exit.y)) * CELL;
        if (exit.x >= GRID_COLS) ax = GRID_COLS * CELL - 12;
        if (exit.x < 0) ax = 0;
        if (exit.y >= GRID_ROWS) ay = GRID_ROWS * CELL - 12;
        if (exit.y < 0) ay = 0;
        ctx.fillStyle = '#2ecc71';
        const ew = (exit.x < 0 || exit.x >= GRID_COLS) ? 12 : CELL;
        const eh = (exit.y < 0 || exit.y >= GRID_ROWS) ? 12 : CELL;
        ctx.fillRect(ax, ay, ew, eh);
      }
    }

    for (const inter of lvl.intersections) {
      const ix = inter.x * CELL, iy = inter.y * CELL;
      ctx.fillStyle = 'rgba(241, 196, 15, 0.15)';
      ctx.fillRect(ix, iy, CELL, CELL);
    }

    for (const obs of lvl.obstacles) {
      const ox = obs.animX, oy = obs.animY;
      ctx.fillStyle = '#e74c3c';
      ctx.globalAlpha = 0.8;
      drawRoundRect(ox + 8, oy + 8, CELL - 16, CELL - 16, 10);
      ctx.fill();
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 3;
      drawRoundRect(ox + 8, oy + 8, CELL - 16, CELL - 16, 10);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚠', ox + CELL / 2, oy + CELL / 2);
    }

    for (const car of lvl.cars) {
      if (car.hidden) continue;
      const imgKey = `car_${car.type}_${car.dir}`;
      const img = images[imgKey];
      const d = DIR_DELTA[car.dir];
      let drawX, drawY, drawW, drawH;

      if (car.dir === 'Right' || car.dir === 'Left') {
        drawW = CELL * 2; drawH = CELL;
        if (car.dir === 'Right') {
          drawX = car.animX - CELL; drawY = car.animY;
        } else {
          drawX = car.animX; drawY = car.animY;
        }
      } else {
        drawW = CELL; drawH = CELL * 2;
        if (car.dir === 'Down') {
          drawX = car.animX; drawY = car.animY - CELL;
        } else {
          drawX = car.animX; drawY = car.animY;
        }
      }

      if (img) {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = CAR_COLORS[car.type] || '#999';
        drawRoundRect(drawX + 4, drawY + 4, drawW - 8, drawH - 8, 12);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const arrows = { Right: '→', Left: '←', Up: '↑', Down: '↓' };
        ctx.fillText(arrows[car.dir], drawX + drawW / 2, drawY + drawH / 2);
      }

      if (car.moving) {
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        drawRoundRect(drawX + 2, drawY + 2, drawW - 4, drawH - 4, 14);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    drawRoundRect(10, 10, DESIGN_W - 20, 70, 14);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('◀ 返回', 30, 45);

    ctx.textAlign = 'center';
    ctx.fillText('第 ' + lvl.levelNum + ' 关', DESIGN_W / 2, 45);

    ctx.textAlign = 'right';
    ctx.fillText('完成: ' + lvl.currentCompleted + '/' + lvl.target, DESIGN_W - 30, 45);

    if (lvl.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 72px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('通关!', DESIGN_W / 2, DESIGN_H / 2);
    }
  }

  function renderResult() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    const grd = ctx.createRadialGradient(DESIGN_W / 2, DESIGN_H / 2, 100, DESIGN_W / 2, DESIGN_H / 2, 600);
    grd.addColorStop(0, '#2c3e50');
    grd.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

    if (images['cop_thumbsup']) {
      const imgW = 300, imgH = 300;
      ctx.drawImage(images['cop_thumbsup'], (DESIGN_W - imgW) / 2, 300, imgW, imgH);
    }

    if (images['congrats_banner']) {
      const bw = 500, bh = 100;
      ctx.drawImage(images['congrats_banner'], (DESIGN_W - bw) / 2, 640, bw, bh);
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('第 ' + state.currentLevel + ' 关 通过!', DESIGN_W / 2, 800);

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '28px "Microsoft YaHei", sans-serif';
    ctx.fillText('已解锁进度: ' + state.userProgress + ' / 10', DESIGN_W / 2, 870);

    if (state.currentLevel < 10) {
      const bx = (DESIGN_W - 360) / 2, by = 960, bw = 360, bh = 80;
      const grd2 = ctx.createLinearGradient(bx, by, bx, by + bh);
      grd2.addColorStop(0, '#2ecc71');
      grd2.addColorStop(1, '#27ae60');
      ctx.fillStyle = grd2;
      drawRoundRect(bx, by, bw, bh, 16);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
      ctx.fillText('下一关 ▶', DESIGN_W / 2, by + bh / 2);
    }

    const bx2 = (DESIGN_W - 360) / 2, by2 = 1080, bw2 = 360, bh2 = 80;
    const grd3 = ctx.createLinearGradient(bx2, by2, bx2, by2 + bh2);
    grd3.addColorStop(0, '#3498db');
    grd3.addColorStop(1, '#2980b9');
    ctx.fillStyle = grd3;
    drawRoundRect(bx2, by2, bw2, bh2, 16);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
    ctx.fillText('返回主界面', DESIGN_W / 2, by2 + bh2 / 2);
  }

  function render() {
    ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
    switch (state.screen) {
      case 'loading': renderLoading(); break;
      case 'menu': renderMenu(); break;
      case 'level': renderLevel(); break;
      case 'result': renderResult(); break;
    }
  }

  function handleMenuClick(gx, gy) {
    const mc = menuCfg || {};
    const bgLoop = !!(mc.bg && mc.bg.loop);
    const scrollForUI = bgLoop ? ((state.menuScrollY % MENU_BG_H) + MENU_BG_H) % MENU_BG_H : state.menuScrollY;
    const list = resolveLevelButtons(mc);
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (!b) continue;
      if (!shouldShowMenuButton(b, scrollForUI)) continue;
      const btnH = b.height;
      const btnW = btnH / (b.aspectRatio || 0.8);
      const layer = getMenuButtonLayer(b);
      const hitY = layer === 'fixed' ? gy : (gy + scrollForUI);
      if (hitY >= b.y && hitY <= b.y + btnH && gx >= b.x && gx <= b.x + btnW) {
        if (menuHasAnyPlayButton(list)) {
          if (!isMenuPlayButton(b)) return;
          const nextLevel = state.userProgress + 1;
          if (nextLevel >= 1 && LEVELS[nextLevel]) {
            startLevel(nextLevel);
            startBGM();
          }
        } else {
          const levelNum = i + 1;
          if (levelNum <= state.userProgress + 1 && LEVELS[levelNum]) {
            startLevel(levelNum);
            startBGM();
          }
        }
        return;
      }
    }
  }

  function handleLevelClick(gx, gy) {
    const lvl = state.level;
    if (!lvl || lvl.won) return;

    if (gy <= 80 && gx <= 180) {
      state.screen = 'menu';
      state.menuScrollY = getMenuInitScroll();
      return;
    }

    const gridX = Math.floor(gx / CELL);
    const gridY = Math.floor(gy / CELL);

    for (const car of lvl.cars) {
      if (car.hidden || car.moving) continue;
      const cells = getCarCells(car);
      for (const c of cells) {
        if (c.x === gridX && c.y === gridY) {
          car.moving = true;
          car.moveTimer = 0;
          startBGM();
          return;
        }
      }
    }
  }

  function handleResultClick(gx, gy) {
    if (state.currentLevel < 10) {
      const bx = (DESIGN_W - 360) / 2, by = 960, bw = 360, bh = 80;
      if (gx >= bx && gx <= bx + bw && gy >= by && gy <= by + bh) {
        startLevel(state.currentLevel + 1);
        return;
      }
    }
    const bx2 = (DESIGN_W - 360) / 2, by2 = 1080, bw2 = 360, bh2 = 80;
    if (gx >= bx2 && gx <= bx2 + bw2 && gy >= by2 && gy <= by2 + bh2) {
      state.screen = 'menu';
      state.menuScrollY = getMenuInitScroll();
    }
  }

  function onClick(sx, sy) {
    const { x, y } = screenToGame(sx, sy);
    switch (state.screen) {
      case 'loading':
        startBGM();
        break;
      case 'menu': handleMenuClick(x, y); break;
      case 'level': handleLevelClick(x, y); break;
      case 'result': handleResultClick(x, y); break;
    }
  }

  let touchStartY = 0, touchMoved = false;
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    touchStartY = t.clientY;
    touchMoved = false;
    if (state.screen === 'menu') {
      state.menuTouchStartY = t.clientY;
      state.menuTouchLastY = t.clientY;
      state.menuIsDragging = true;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    if (Math.abs(t.clientY - touchStartY) > 10) touchMoved = true;
    if (state.screen === 'menu' && state.menuIsDragging) {
      const dy = state.menuTouchLastY - t.clientY;
      state.menuScrollY = clampMenuScroll(state.menuScrollY + dy / scale);
      state.menuTouchLastY = t.clientY;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    if (!touchMoved) {
      const t = e.changedTouches[0];
      onClick(t.clientX, t.clientY);
    }
    state.menuIsDragging = false;
  }, { passive: false });

  canvas.addEventListener('mousedown', e => {
    touchStartY = e.clientY;
    touchMoved = false;
    if (state.screen === 'menu') {
      state.menuTouchStartY = e.clientY;
      state.menuTouchLastY = e.clientY;
      state.menuIsDragging = true;
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (!state.menuIsDragging) return;
    if (Math.abs(e.clientY - touchStartY) > 10) touchMoved = true;
    if (state.screen === 'menu') {
      const dy = state.menuTouchLastY - e.clientY;
      state.menuScrollY = clampMenuScroll(state.menuScrollY + dy / scale);
      state.menuTouchLastY = e.clientY;
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (!touchMoved) {
      onClick(e.clientX, e.clientY);
    }
    state.menuIsDragging = false;
  });

  canvas.addEventListener('wheel', e => {
    if (state.screen === 'menu') {
      const sens = (menuCfg && menuCfg.bg && menuCfg.bg.scrollSens) || 0.5;
      state.menuScrollY = clampMenuScroll(state.menuScrollY + e.deltaY * sens);
    }
  });

  window.addEventListener('resize', resize);

  let lastTime = 0;
  function gameLoop(timestamp) {
    const dt = lastTime ? timestamp - lastTime : 16;
    lastTime = timestamp;
    update(Math.min(dt, 50));
    render();
    requestAnimationFrame(gameLoop);
  }

  function init() {
    loadUserData();
    saveUserData();
    loadMenuConfig();
    state.menuScrollY = getMenuInitScroll();
    resize();
    state.loadStart = Date.now();
    loadAllAssets();
    initBGM();
    requestAnimationFrame(gameLoop);
  }

  init();
})();
