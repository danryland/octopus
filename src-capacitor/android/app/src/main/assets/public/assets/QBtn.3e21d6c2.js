import { h, c as computed, g as getCurrentInstance, $ as unref, A as isKeyCode, a0 as addEvt, a1 as cleanEvt, t as stop, a2 as position, r as ref, o as onBeforeUnmount, T as Transition, a3 as withDirectives, s as stopAndPrevent, p as prevent, y as listenOpts } from "./index.9f41f0a4.js";
import { c as createComponent, e as useSpinnerProps, f as useSpinner, b as useSizeProps, u as useSize, h as hSlot, a as hMergeSlot, g as createDirective } from "./render.ae01e000.js";
var QSpinner = createComponent({
  name: "QSpinner",
  props: {
    ...useSpinnerProps,
    thickness: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const { cSize, classes } = useSpinner(props);
    return () => h("svg", {
      class: classes.value + " q-spinner-mat",
      width: cSize.value,
      height: cSize.value,
      viewBox: "25 25 50 50"
    }, [
      h("circle", {
        class: "path",
        cx: "50",
        cy: "50",
        r: "20",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": props.thickness,
        "stroke-miterlimit": "10"
      })
    ]);
  }
});
const defaultViewBox = "0 0 24 24";
const sameFn = (i) => i;
const ionFn = (i) => `ionicons ${i}`;
const libMap = {
  "mdi-": (i) => `mdi ${i}`,
  "icon-": sameFn,
  "bt-": (i) => `bt ${i}`,
  "eva-": (i) => `eva ${i}`,
  "ion-md": ionFn,
  "ion-ios": ionFn,
  "ion-logo": ionFn,
  "iconfont ": sameFn,
  "ti-": (i) => `themify-icon ${i}`,
  "bi-": (i) => `bootstrap-icons ${i}`
};
const matMap = {
  o_: "-outlined",
  r_: "-round",
  s_: "-sharp"
};
const symMap = {
  sym_o_: "-outlined",
  sym_r_: "-rounded",
  sym_s_: "-sharp"
};
const libRE = new RegExp("^(" + Object.keys(libMap).join("|") + ")");
const matRE = new RegExp("^(" + Object.keys(matMap).join("|") + ")");
const symRE = new RegExp("^(" + Object.keys(symMap).join("|") + ")");
const mRE = /^[Mm]\s?[-+]?\.?\d/;
const imgRE = /^img:/;
const svgUseRE = /^svguse:/;
const ionRE = /^ion-/;
const faRE = /^(fa-(sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;
var QIcon = createComponent({
  name: "QIcon",
  props: {
    ...useSizeProps,
    tag: {
      type: String,
      default: "i"
    },
    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const classes = computed(
      () => "q-icon" + (props.left === true ? " on-left" : "") + (props.right === true ? " on-right" : "") + (props.color !== void 0 ? ` text-${props.color}` : "")
    );
    const type = computed(() => {
      let cls;
      let icon = props.name;
      if (icon === "none" || !icon) {
        return { none: true };
      }
      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon);
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon;
            if (icon === "none" || !icon) {
              return { none: true };
            }
          } else {
            return {
              cls: res.cls,
              content: res.content !== void 0 ? res.content : " "
            };
          }
        }
      }
      if (mRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split("|");
        return {
          svg: true,
          viewBox,
          nodes: def.split("&&").map((path) => {
            const [d, style, transform] = path.split("@@");
            return h("path", { style, d, transform });
          })
        };
      }
      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        };
      }
      if (svgUseRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split("|");
        return {
          svguse: true,
          src: def.substring(7),
          viewBox
        };
      }
      let content = " ";
      const matches = icon.match(libRE);
      if (matches !== null) {
        cls = libMap[matches[1]](icon);
      } else if (faRE.test(icon) === true) {
        cls = icon;
      } else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${$q.platform.is.ios === true ? "ios" : "md"}${icon.substring(3)}`;
      } else if (symRE.test(icon) === true) {
        cls = "notranslate material-symbols";
        const matches2 = icon.match(symRE);
        if (matches2 !== null) {
          icon = icon.substring(6);
          cls += symMap[matches2[1]];
        }
        content = icon;
      } else {
        cls = "notranslate material-icons";
        const matches2 = icon.match(matRE);
        if (matches2 !== null) {
          icon = icon.substring(2);
          cls += matMap[matches2[1]];
        }
        content = icon;
      }
      return {
        cls,
        content
      };
    });
    return () => {
      const data = {
        class: classes.value,
        style: sizeStyle.value,
        "aria-hidden": "true",
        role: "presentation"
      };
      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default));
      }
      if (type.value.img === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("img", { src: type.value.src })
        ]));
      }
      if (type.value.svg === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox || "0 0 24 24"
          }, type.value.nodes)
        ]));
      }
      if (type.value.svguse === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox
          }, [
            h("use", { "xlink:href": type.value.src })
          ])
        ]));
      }
      if (type.value.cls !== void 0) {
        data.class += " " + type.value.cls;
      }
      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]));
    };
  }
});
function css(element, css2) {
  const style = element.style;
  for (const prop in css2) {
    style[prop] = css2[prop];
  }
}
function getElement(el) {
  if (el === void 0 || el === null) {
    return void 0;
  }
  if (typeof el === "string") {
    try {
      return document.querySelector(el) || void 0;
    } catch (err) {
      return void 0;
    }
  }
  const target = unref(el);
  if (target) {
    return target.$el || target;
  }
}
function childHasFocus(el, focusedEl) {
  if (el === void 0 || el === null || el.contains(focusedEl) === true) {
    return true;
  }
  for (let next = el.nextElementSibling; next !== null; next = next.nextElementSibling) {
    if (next.contains(focusedEl)) {
      return true;
    }
  }
  return false;
}
function throttle(fn, limit = 250) {
  let wait = false, result;
  return function() {
    if (wait === false) {
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
      result = fn.apply(this, arguments);
    }
    return result;
  };
}
function showRipple(evt, el, ctx, forceCenter) {
  ctx.modifiers.stop === true && stop(evt);
  const color = ctx.modifiers.color;
  let center = ctx.modifiers.center;
  center = center === true || forceCenter === true;
  const node = document.createElement("span"), innerNode = document.createElement("span"), pos = position(evt), { left, top, width, height } = el.getBoundingClientRect(), diameter = Math.sqrt(width * width + height * height), radius = diameter / 2, centerX = `${(width - diameter) / 2}px`, x = center ? centerX : `${pos.left - left - radius}px`, centerY = `${(height - diameter) / 2}px`, y = center ? centerY : `${pos.top - top - radius}px`;
  innerNode.className = "q-ripple__inner";
  css(innerNode, {
    height: `${diameter}px`,
    width: `${diameter}px`,
    transform: `translate3d(${x},${y},0) scale3d(.2,.2,1)`,
    opacity: 0
  });
  node.className = `q-ripple${color ? " text-" + color : ""}`;
  node.setAttribute("dir", "ltr");
  node.appendChild(innerNode);
  el.appendChild(node);
  const abort = () => {
    node.remove();
    clearTimeout(timer);
  };
  ctx.abort.push(abort);
  let timer = setTimeout(() => {
    innerNode.classList.add("q-ripple__inner--enter");
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`;
    innerNode.style.opacity = 0.2;
    timer = setTimeout(() => {
      innerNode.classList.remove("q-ripple__inner--enter");
      innerNode.classList.add("q-ripple__inner--leave");
      innerNode.style.opacity = 0;
      timer = setTimeout(() => {
        node.remove();
        ctx.abort.splice(ctx.abort.indexOf(abort), 1);
      }, 275);
    }, 250);
  }, 50);
}
function updateModifiers(ctx, { modifiers, value, arg }) {
  const cfg = Object.assign({}, ctx.cfg.ripple, modifiers, value);
  ctx.modifiers = {
    early: cfg.early === true,
    stop: cfg.stop === true,
    center: cfg.center === true,
    color: cfg.color || arg,
    keyCodes: [].concat(cfg.keyCodes || 13)
  };
}
var Ripple = createDirective(
  {
    name: "ripple",
    beforeMount(el, binding) {
      const cfg = binding.instance.$.appContext.config.globalProperties.$q.config || {};
      if (cfg.ripple === false) {
        return;
      }
      const ctx = {
        cfg,
        enabled: binding.value !== false,
        modifiers: {},
        abort: [],
        start(evt) {
          if (ctx.enabled === true && evt.qSkipRipple !== true && evt.type === (ctx.modifiers.early === true ? "pointerdown" : "click")) {
            showRipple(evt, el, ctx, evt.qKeyEvent === true);
          }
        },
        keystart: throttle((evt) => {
          if (ctx.enabled === true && evt.qSkipRipple !== true && isKeyCode(evt, ctx.modifiers.keyCodes) === true && evt.type === `key${ctx.modifiers.early === true ? "down" : "up"}`) {
            showRipple(evt, el, ctx, true);
          }
        }, 300)
      };
      updateModifiers(ctx, binding);
      el.__qripple = ctx;
      addEvt(ctx, "main", [
        [el, "pointerdown", "start", "passive"],
        [el, "click", "start", "passive"],
        [el, "keydown", "keystart", "passive"],
        [el, "keyup", "keystart", "passive"]
      ]);
    },
    updated(el, binding) {
      if (binding.oldValue !== binding.value) {
        const ctx = el.__qripple;
        if (ctx !== void 0) {
          ctx.enabled = binding.value !== false;
          if (ctx.enabled === true && Object(binding.value) === binding.value) {
            updateModifiers(ctx, binding);
          }
        }
      }
    },
    beforeUnmount(el) {
      const ctx = el.__qripple;
      if (ctx !== void 0) {
        ctx.abort.forEach((fn) => {
          fn();
        });
        cleanEvt(ctx, "main");
        delete el._qripple;
      }
    }
  }
);
const alignMap = {
  left: "start",
  center: "center",
  right: "end",
  between: "between",
  around: "around",
  evenly: "evenly",
  stretch: "stretch"
};
const alignValues = Object.keys(alignMap);
const useAlignProps = {
  align: {
    type: String,
    validator: (v) => alignValues.includes(v)
  }
};
function useAlign(props) {
  return computed(() => {
    const align = props.align === void 0 ? props.vertical === true ? "stretch" : "left" : props.align;
    return `${props.vertical === true ? "items" : "justify"}-${alignMap[align]}`;
  });
}
function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== void 0;
}
function vmIsDestroyed(vm) {
  return vm.isUnmounted === true || vm.isDeactivated === true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key], outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue) {
        return false;
      }
    } else if (Array.isArray(outerValue) === false || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) {
      return false;
    }
  }
  return true;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) === true ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) === true ? isEquivalentArray(a, b) : Array.isArray(b) === true ? isEquivalentArray(b, a) : a === b;
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (isSameRouteLocationParamsValue(a[key], b[key]) === false) {
      return false;
    }
  }
  return true;
}
const useRouterLinkProps = {
  to: [String, Object],
  replace: Boolean,
  exact: Boolean,
  activeClass: {
    type: String,
    default: "q-router-link--active"
  },
  exactActiveClass: {
    type: String,
    default: "q-router-link--exact-active"
  },
  href: String,
  target: String,
  disable: Boolean
};
function useRouterLink({ fallbackTag, useDisableForRouterLinkProps = true } = {}) {
  const vm = getCurrentInstance();
  const { props, proxy, emit } = vm;
  const hasRouter = vmHasRouter(vm);
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0);
  const hasRouterLinkProps = useDisableForRouterLinkProps === true ? computed(
    () => hasRouter === true && props.disable !== true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== ""
  ) : computed(
    () => hasRouter === true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== ""
  );
  const resolvedLink = computed(() => hasRouterLinkProps.value === true ? getLink(props.to) : null);
  const hasRouterLink = computed(() => resolvedLink.value !== null);
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true);
  const linkTag = computed(() => props.type === "a" || hasLink.value === true ? "a" : props.tag || fallbackTag || "div");
  const linkAttrs = computed(() => hasHrefLink.value === true ? {
    href: props.href,
    target: props.target
  } : hasRouterLink.value === true ? {
    href: resolvedLink.value.href,
    target: props.target
  } : {});
  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return -1;
    }
    const { matched } = resolvedLink.value, { length } = matched, routeMatched = matched[length - 1];
    if (routeMatched === void 0) {
      return -1;
    }
    const currentMatched = proxy.$route.matched;
    if (currentMatched.length === 0) {
      return -1;
    }
    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    );
    if (index > -1) {
      return index;
    }
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(
      isSameRouteRecord.bind(null, matched[length - 2])
    ) : index;
  });
  const linkIsActive = computed(
    () => hasRouterLink.value === true && linkActiveIndex.value !== -1 && includesParams(proxy.$route.params, resolvedLink.value.params)
  );
  const linkIsExactActive = computed(
    () => linkIsActive.value === true && linkActiveIndex.value === proxy.$route.matched.length - 1 && isSameRouteLocationParams(proxy.$route.params, resolvedLink.value.params)
  );
  const linkClass = computed(() => hasRouterLink.value === true ? linkIsExactActive.value === true ? ` ${props.exactActiveClass} ${props.activeClass}` : props.exact === true ? "" : linkIsActive.value === true ? ` ${props.activeClass}` : "" : "");
  function getLink(to) {
    try {
      return proxy.$router.resolve(to);
    } catch (_) {
    }
    return null;
  }
  function navigateToRouterLink(e, { returnRouterError, to = props.to, replace = props.replace } = {}) {
    if (props.disable === true) {
      e.preventDefault();
      return Promise.resolve(false);
    }
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button !== void 0 && e.button !== 0 || props.target === "_blank") {
      return Promise.resolve(false);
    }
    e.preventDefault();
    const promise = proxy.$router[replace === true ? "replace" : "push"](to);
    return returnRouterError === true ? promise : promise.then(() => {
    }).catch(() => {
    });
  }
  function navigateOnClick(e) {
    if (hasRouterLink.value === true) {
      const go = (opts) => navigateToRouterLink(e, opts);
      emit("click", e, go);
      e.defaultPrevented !== true && go();
    } else {
      emit("click", e);
    }
  }
  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,
    linkTag,
    resolvedLink,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkAttrs,
    getLink,
    navigateToRouterLink,
    navigateOnClick
  };
}
const btnPadding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};
const formTypes = ["button", "submit", "reset"];
const mediaTypeRE = /[^\s]\/[^\s]/;
const btnDesignOptions = ["flat", "outline", "push", "unelevated"];
const getBtnDesign = (props, defaultValue) => {
  if (props.flat === true)
    return "flat";
  if (props.outline === true)
    return "outline";
  if (props.push === true)
    return "push";
  if (props.unelevated === true)
    return "unelevated";
  return defaultValue;
};
const useBtnProps = {
  ...useSizeProps,
  ...useRouterLinkProps,
  type: {
    type: String,
    default: "button"
  },
  label: [Number, String],
  icon: String,
  iconRight: String,
  ...btnDesignOptions.reduce(
    (acc, val) => (acc[val] = Boolean) && acc,
    {}
  ),
  square: Boolean,
  round: Boolean,
  rounded: Boolean,
  glossy: Boolean,
  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,
  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,
  tabindex: [Number, String],
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  align: {
    ...useAlignProps.align,
    default: "center"
  },
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
};
function useBtn(props) {
  const sizeStyle = useSize(props, defaultSizes);
  const alignClass = useAlign(props);
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } = useRouterLink({
    fallbackTag: "button"
  });
  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false ? sizeStyle.value : {};
    return props.padding !== void 0 ? Object.assign({}, obj, {
      padding: props.padding.split(/\s+/).map((v) => v in btnPadding ? btnPadding[v] + "px" : v).join(" "),
      minWidth: "0",
      minHeight: "0"
    }) : obj;
  });
  const isRounded = computed(
    () => props.rounded === true || props.fab === true || props.fabMini === true
  );
  const isActionable = computed(
    () => props.disable !== true && props.loading !== true
  );
  const tabIndex = computed(() => isActionable.value === true ? props.tabindex || 0 : -1);
  const design = computed(() => getBtnDesign(props, "standard"));
  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value };
    if (hasLink.value === true) {
      Object.assign(acc, linkAttrs.value);
    } else if (formTypes.includes(props.type) === true) {
      acc.type = props.type;
    }
    if (linkTag.value === "a") {
      if (props.disable === true) {
        acc["aria-disabled"] = "true";
      } else if (acc.href === void 0) {
        acc.role = "button";
      }
      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type;
      }
    } else if (props.disable === true) {
      acc.disabled = "";
      acc["aria-disabled"] = "true";
    }
    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": props.percentage
      });
    }
    return acc;
  });
  const classes = computed(() => {
    let colors;
    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${props.textColor || props.color}`;
      } else {
        colors = `bg-${props.color} text-${props.textColor || "white"}`;
      }
    } else if (props.textColor) {
      colors = `text-${props.textColor}`;
    }
    const shape = props.round === true ? "round" : `rectangle${isRounded.value === true ? " q-btn--rounded" : props.square === true ? " q-btn--square" : ""}`;
    return `q-btn--${design.value} q-btn--${shape}` + (colors !== void 0 ? " " + colors : "") + (isActionable.value === true ? " q-btn--actionable q-focusable q-hoverable" : props.disable === true ? " disabled" : "") + (props.fab === true ? " q-btn--fab" : props.fabMini === true ? " q-btn--fab-mini" : "") + (props.noCaps === true ? " q-btn--no-uppercase" : "") + (props.dense === true ? " q-btn--dense" : "") + (props.stretch === true ? " no-border-radius self-stretch" : "") + (props.glossy === true ? " glossy" : "") + (props.square ? " q-btn--square" : "");
  });
  const innerClasses = computed(
    () => alignClass.value + (props.stack === true ? " column" : " row") + (props.noWrap === true ? " no-wrap text-no-wrap" : "") + (props.loading === true ? " q-btn__content--hidden" : "")
  );
  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasLink,
    linkTag,
    navigateOnClick,
    isActionable
  };
}
const { passiveCapture } = listenOpts;
let touchTarget = null, keyboardTarget = null, mouseTarget = null;
var QBtn = createComponent({
  name: "QBtn",
  props: {
    ...useBtnProps,
    percentage: Number,
    darkPercentage: Boolean,
    onTouchstart: [Function, Array]
  },
  emits: ["click", "keydown", "mousedown", "keyup"],
  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance();
    const {
      classes,
      style,
      innerClasses,
      attributes,
      hasLink,
      linkTag,
      navigateOnClick,
      isActionable
    } = useBtn(props);
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    let localTouchTargetEl = null, avoidMouseRipple, mouseTimer = null;
    const hasLabel = computed(
      () => props.label !== void 0 && props.label !== null && props.label !== ""
    );
    const ripple = computed(() => props.disable === true || props.ripple === false ? false : {
      keyCodes: hasLink.value === true ? [13, 32] : [13],
      ...props.ripple === true ? {} : props.ripple
    });
    const rippleProps = computed(() => ({ center: props.round }));
    const percentageStyle = computed(() => {
      const val = Math.max(0, Math.min(100, props.percentage));
      return val > 0 ? { transition: "transform 0.6s", transform: `translateX(${val - 100}%)` } : {};
    });
    const onEvents = computed(() => {
      if (props.loading === true) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstart: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        };
      }
      if (isActionable.value === true) {
        const acc = {
          onClick,
          onKeydown,
          onMousedown
        };
        if (proxy.$q.platform.has.touch === true) {
          const suffix = props.onTouchstart !== void 0 ? "" : "Passive";
          acc[`onTouchstart${suffix}`] = onTouchstart;
        }
        return acc;
      }
      return {
        onClick: stopAndPrevent
      };
    });
    const nodeProps = computed(() => ({
      ref: rootRef,
      class: "q-btn q-btn-item non-selectable no-outline " + classes.value,
      style: style.value,
      ...attributes.value,
      ...onEvents.value
    }));
    function onClick(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0) {
        if (e.defaultPrevented === true) {
          return;
        }
        const el = document.activeElement;
        if (props.type === "submit" && el !== document.body && rootRef.value.contains(el) === false && el.contains(rootRef.value) === false) {
          rootRef.value.focus();
          const onClickCleanup = () => {
            document.removeEventListener("keydown", stopAndPrevent, true);
            document.removeEventListener("keyup", onClickCleanup, passiveCapture);
            rootRef.value !== null && rootRef.value.removeEventListener("blur", onClickCleanup, passiveCapture);
          };
          document.addEventListener("keydown", stopAndPrevent, true);
          document.addEventListener("keyup", onClickCleanup, passiveCapture);
          rootRef.value.addEventListener("blur", onClickCleanup, passiveCapture);
        }
      }
      navigateOnClick(e);
    }
    function onKeydown(e) {
      if (rootRef.value === null) {
        return;
      }
      emit("keydown", e);
      if (isKeyCode(e, [13, 32]) === true && keyboardTarget !== rootRef.value) {
        keyboardTarget !== null && cleanup();
        if (e.defaultPrevented !== true) {
          rootRef.value.focus();
          keyboardTarget = rootRef.value;
          rootRef.value.classList.add("q-btn--active");
          document.addEventListener("keyup", onPressEnd, true);
          rootRef.value.addEventListener("blur", onPressEnd, passiveCapture);
        }
        stopAndPrevent(e);
      }
    }
    function onTouchstart(e) {
      if (rootRef.value === null) {
        return;
      }
      emit("touchstart", e);
      if (e.defaultPrevented === true) {
        return;
      }
      if (touchTarget !== rootRef.value) {
        touchTarget !== null && cleanup();
        touchTarget = rootRef.value;
        localTouchTargetEl = e.target;
        localTouchTargetEl.addEventListener("touchcancel", onPressEnd, passiveCapture);
        localTouchTargetEl.addEventListener("touchend", onPressEnd, passiveCapture);
      }
      avoidMouseRipple = true;
      mouseTimer !== null && clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        mouseTimer = null;
        avoidMouseRipple = false;
      }, 200);
    }
    function onMousedown(e) {
      if (rootRef.value === null) {
        return;
      }
      e.qSkipRipple = avoidMouseRipple === true;
      emit("mousedown", e);
      if (e.defaultPrevented !== true && mouseTarget !== rootRef.value) {
        mouseTarget !== null && cleanup();
        mouseTarget = rootRef.value;
        rootRef.value.classList.add("q-btn--active");
        document.addEventListener("mouseup", onPressEnd, passiveCapture);
      }
    }
    function onPressEnd(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0 && e.type === "blur" && document.activeElement === rootRef.value) {
        return;
      }
      if (e !== void 0 && e.type === "keyup") {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32]) === true) {
          const evt = new MouseEvent("click", e);
          evt.qKeyEvent = true;
          e.defaultPrevented === true && prevent(evt);
          e.cancelBubble === true && stop(evt);
          rootRef.value.dispatchEvent(evt);
          stopAndPrevent(e);
          e.qKeyEvent = true;
        }
        emit("keyup", e);
      }
      cleanup();
    }
    function cleanup(destroying) {
      const blurTarget = blurTargetRef.value;
      if (destroying !== true && (touchTarget === rootRef.value || mouseTarget === rootRef.value) && blurTarget !== null && blurTarget !== document.activeElement) {
        blurTarget.setAttribute("tabindex", -1);
        blurTarget.focus();
      }
      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener("touchcancel", onPressEnd, passiveCapture);
          localTouchTargetEl.removeEventListener("touchend", onPressEnd, passiveCapture);
        }
        touchTarget = localTouchTargetEl = null;
      }
      if (mouseTarget === rootRef.value) {
        document.removeEventListener("mouseup", onPressEnd, passiveCapture);
        mouseTarget = null;
      }
      if (keyboardTarget === rootRef.value) {
        document.removeEventListener("keyup", onPressEnd, true);
        rootRef.value !== null && rootRef.value.removeEventListener("blur", onPressEnd, passiveCapture);
        keyboardTarget = null;
      }
      rootRef.value !== null && rootRef.value.classList.remove("q-btn--active");
    }
    function onLoadingEvt(evt) {
      stopAndPrevent(evt);
      evt.qSkipRipple = true;
    }
    onBeforeUnmount(() => {
      cleanup(true);
    });
    Object.assign(proxy, { click: onClick });
    return () => {
      let inner = [];
      props.icon !== void 0 && inner.push(
        h(QIcon, {
          name: props.icon,
          left: props.stack === false && hasLabel.value === true,
          role: "img",
          "aria-hidden": "true"
        })
      );
      hasLabel.value === true && inner.push(
        h("span", { class: "block" }, [props.label])
      );
      inner = hMergeSlot(slots.default, inner);
      if (props.iconRight !== void 0 && props.round === false) {
        inner.push(
          h(QIcon, {
            name: props.iconRight,
            right: props.stack === false && hasLabel.value === true,
            role: "img",
            "aria-hidden": "true"
          })
        );
      }
      const child = [
        h("span", {
          class: "q-focus-helper",
          ref: blurTargetRef
        })
      ];
      if (props.loading === true && props.percentage !== void 0) {
        child.push(
          h("span", {
            class: "q-btn__progress absolute-full overflow-hidden" + (props.darkPercentage === true ? " q-btn__progress--dark" : "")
          }, [
            h("span", {
              class: "q-btn__progress-indicator fit block",
              style: percentageStyle.value
            })
          ])
        );
      }
      child.push(
        h("span", {
          class: "q-btn__content text-center col items-center q-anchor--skip " + innerClasses.value
        }, inner)
      );
      props.loading !== null && child.push(
        h(Transition, {
          name: "q-transition--fade"
        }, () => props.loading === true ? [
          h("span", {
            key: "loading",
            class: "absolute-full flex flex-center"
          }, slots.loading !== void 0 ? slots.loading() : [h(QSpinner)])
        ] : null)
      );
      return withDirectives(
        h(
          linkTag.value,
          nodeProps.value,
          child
        ),
        [[
          Ripple,
          ripple.value,
          void 0,
          rippleProps.value
        ]]
      );
    };
  }
});
export { QSpinner as Q, QIcon as a, vmHasRouter as b, css as c, childHasFocus as d, QBtn as e, getElement as g, vmIsDestroyed as v };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUUJ0bi4zZTIxZDZjMi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9zcGlubmVyL1FTcGlubmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9pY29uL1FJY29uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvdXRpbHMvZG9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvdXRpbHMvdGhyb3R0bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9kaXJlY3RpdmVzL1JpcHBsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvc2FibGVzL3ByaXZhdGUvdXNlLWFsaWduLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvdXRpbHMvcHJpdmF0ZS92bS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvc2FibGVzL3ByaXZhdGUvdXNlLXJvdXRlci1saW5rLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9idG4vdXNlLWJ0bi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvbmVudHMvYnRuL1FCdG4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHVzZVNwaW5uZXIsIHsgdXNlU3Bpbm5lclByb3BzIH0gZnJvbSAnLi91c2Utc3Bpbm5lci5qcydcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9jcmVhdGUuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRU3Bpbm5lcicsXG5cbiAgcHJvcHM6IHtcbiAgICAuLi51c2VTcGlubmVyUHJvcHMsXG5cbiAgICB0aGlja25lc3M6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDVcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzKSB7XG4gICAgY29uc3QgeyBjU2l6ZSwgY2xhc3NlcyB9ID0gdXNlU3Bpbm5lcihwcm9wcylcblxuICAgIHJldHVybiAoKSA9PiBoKCdzdmcnLCB7XG4gICAgICBjbGFzczogY2xhc3Nlcy52YWx1ZSArICcgcS1zcGlubmVyLW1hdCcsXG4gICAgICB3aWR0aDogY1NpemUudmFsdWUsXG4gICAgICBoZWlnaHQ6IGNTaXplLnZhbHVlLFxuICAgICAgdmlld0JveDogJzI1IDI1IDUwIDUwJ1xuICAgIH0sIFtcbiAgICAgIGgoJ2NpcmNsZScsIHtcbiAgICAgICAgY2xhc3M6ICdwYXRoJyxcbiAgICAgICAgY3g6ICc1MCcsXG4gICAgICAgIGN5OiAnNTAnLFxuICAgICAgICByOiAnMjAnLFxuICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgIHN0cm9rZTogJ2N1cnJlbnRDb2xvcicsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiBwcm9wcy50aGlja25lc3MsXG4gICAgICAgICdzdHJva2UtbWl0ZXJsaW1pdCc6ICcxMCdcbiAgICAgIH0pXG4gICAgXSlcbiAgfVxufSlcbiIsImltcG9ydCB7IGgsIGNvbXB1dGVkLCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB1c2VTaXplLCB7IHVzZVNpemVQcm9wcyB9IGZyb20gJy4uLy4uL2NvbXBvc2FibGVzL3ByaXZhdGUvdXNlLXNpemUuanMnXG5cbmltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUvY3JlYXRlLmpzJ1xuaW1wb3J0IHsgaFNsb3QsIGhNZXJnZVNsb3QgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlL3JlbmRlci5qcydcblxuY29uc3QgZGVmYXVsdFZpZXdCb3ggPSAnMCAwIDI0IDI0J1xuXG5jb25zdCBzYW1lRm4gPSBpID0+IGlcbmNvbnN0IGlvbkZuID0gaSA9PiBgaW9uaWNvbnMgJHsgaSB9YFxuXG5jb25zdCBsaWJNYXAgPSB7XG4gICdtZGktJzogaSA9PiBgbWRpICR7IGkgfWAsXG4gICdpY29uLSc6IHNhbWVGbiwgLy8gZm9udGF3ZXNvbWUgZXF1aXZcbiAgJ2J0LSc6IGkgPT4gYGJ0ICR7IGkgfWAsXG4gICdldmEtJzogaSA9PiBgZXZhICR7IGkgfWAsXG4gICdpb24tbWQnOiBpb25GbixcbiAgJ2lvbi1pb3MnOiBpb25GbixcbiAgJ2lvbi1sb2dvJzogaW9uRm4sXG4gICdpY29uZm9udCAnOiBzYW1lRm4sXG4gICd0aS0nOiBpID0+IGB0aGVtaWZ5LWljb24gJHsgaSB9YCxcbiAgJ2JpLSc6IGkgPT4gYGJvb3RzdHJhcC1pY29ucyAkeyBpIH1gXG59XG5cbmNvbnN0IG1hdE1hcCA9IHtcbiAgb186ICctb3V0bGluZWQnLFxuICByXzogJy1yb3VuZCcsXG4gIHNfOiAnLXNoYXJwJ1xufVxuXG5jb25zdCBzeW1NYXAgPSB7XG4gIHN5bV9vXzogJy1vdXRsaW5lZCcsXG4gIHN5bV9yXzogJy1yb3VuZGVkJyxcbiAgc3ltX3NfOiAnLXNoYXJwJ1xufVxuXG5jb25zdCBsaWJSRSA9IG5ldyBSZWdFeHAoJ14oJyArIE9iamVjdC5rZXlzKGxpYk1hcCkuam9pbignfCcpICsgJyknKVxuY29uc3QgbWF0UkUgPSBuZXcgUmVnRXhwKCdeKCcgKyBPYmplY3Qua2V5cyhtYXRNYXApLmpvaW4oJ3wnKSArICcpJylcbmNvbnN0IHN5bVJFID0gbmV3IFJlZ0V4cCgnXignICsgT2JqZWN0LmtleXMoc3ltTWFwKS5qb2luKCd8JykgKyAnKScpXG5jb25zdCBtUkUgPSAvXltNbV1cXHM/Wy0rXT9cXC4/XFxkL1xuY29uc3QgaW1nUkUgPSAvXmltZzovXG5jb25zdCBzdmdVc2VSRSA9IC9ec3ZndXNlOi9cbmNvbnN0IGlvblJFID0gL15pb24tL1xuY29uc3QgZmFSRSA9IC9eKGZhLShzaGFycHxzb2xpZHxyZWd1bGFyfGxpZ2h0fGJyYW5kc3xkdW90b25lfHRoaW4pfFtsZl1hW3NybGJka10/KSAvXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRSWNvbicsXG5cbiAgcHJvcHM6IHtcbiAgICAuLi51c2VTaXplUHJvcHMsXG5cbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdpJ1xuICAgIH0sXG5cbiAgICBuYW1lOiBTdHJpbmcsXG4gICAgY29sb3I6IFN0cmluZyxcbiAgICBsZWZ0OiBCb29sZWFuLFxuICAgIHJpZ2h0OiBCb29sZWFuXG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzLCB7IHNsb3RzIH0pIHtcbiAgICBjb25zdCB7IHByb3h5OiB7ICRxIH0gfSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG4gICAgY29uc3Qgc2l6ZVN0eWxlID0gdXNlU2l6ZShwcm9wcylcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBjb21wdXRlZCgoKSA9PlxuICAgICAgJ3EtaWNvbidcbiAgICAgICsgKHByb3BzLmxlZnQgPT09IHRydWUgPyAnIG9uLWxlZnQnIDogJycpIC8vIFRPRE8gUXYzOiBkcm9wIHRoaXNcbiAgICAgICsgKHByb3BzLnJpZ2h0ID09PSB0cnVlID8gJyBvbi1yaWdodCcgOiAnJylcbiAgICAgICsgKHByb3BzLmNvbG9yICE9PSB2b2lkIDAgPyBgIHRleHQtJHsgcHJvcHMuY29sb3IgfWAgOiAnJylcbiAgICApXG5cbiAgICBjb25zdCB0eXBlID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgICAgbGV0IGNsc1xuICAgICAgbGV0IGljb24gPSBwcm9wcy5uYW1lXG5cbiAgICAgIGlmIChpY29uID09PSAnbm9uZScgfHwgIWljb24pIHtcbiAgICAgICAgcmV0dXJuIHsgbm9uZTogdHJ1ZSB9XG4gICAgICB9XG5cbiAgICAgIGlmICgkcS5pY29uTWFwRm4gIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcmVzID0gJHEuaWNvbk1hcEZuKGljb24pXG4gICAgICAgIGlmIChyZXMgIT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChyZXMuaWNvbiAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBpY29uID0gcmVzLmljb25cbiAgICAgICAgICAgIGlmIChpY29uID09PSAnbm9uZScgfHwgIWljb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbm9uZTogdHJ1ZSB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY2xzOiByZXMuY2xzLFxuICAgICAgICAgICAgICBjb250ZW50OiByZXMuY29udGVudCAhPT0gdm9pZCAwXG4gICAgICAgICAgICAgICAgPyByZXMuY29udGVudFxuICAgICAgICAgICAgICAgIDogJyAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtUkUudGVzdChpY29uKSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBbIGRlZiwgdmlld0JveCA9IGRlZmF1bHRWaWV3Qm94IF0gPSBpY29uLnNwbGl0KCd8JylcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN2ZzogdHJ1ZSxcbiAgICAgICAgICB2aWV3Qm94LFxuICAgICAgICAgIG5vZGVzOiBkZWYuc3BsaXQoJyYmJykubWFwKHBhdGggPT4ge1xuICAgICAgICAgICAgY29uc3QgWyBkLCBzdHlsZSwgdHJhbnNmb3JtIF0gPSBwYXRoLnNwbGl0KCdAQCcpXG4gICAgICAgICAgICByZXR1cm4gaCgncGF0aCcsIHsgc3R5bGUsIGQsIHRyYW5zZm9ybSB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGltZ1JFLnRlc3QoaWNvbikgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbWc6IHRydWUsXG4gICAgICAgICAgc3JjOiBpY29uLnN1YnN0cmluZyg0KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdmdVc2VSRS50ZXN0KGljb24pID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IFsgZGVmLCB2aWV3Qm94ID0gZGVmYXVsdFZpZXdCb3ggXSA9IGljb24uc3BsaXQoJ3wnKVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3ZndXNlOiB0cnVlLFxuICAgICAgICAgIHNyYzogZGVmLnN1YnN0cmluZyg3KSxcbiAgICAgICAgICB2aWV3Qm94XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGNvbnRlbnQgPSAnICdcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBpY29uLm1hdGNoKGxpYlJFKVxuXG4gICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xuICAgICAgICBjbHMgPSBsaWJNYXBbIG1hdGNoZXNbIDEgXSBdKGljb24pXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChmYVJFLnRlc3QoaWNvbikgPT09IHRydWUpIHtcbiAgICAgICAgY2xzID0gaWNvblxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaW9uUkUudGVzdChpY29uKSA9PT0gdHJ1ZSkge1xuICAgICAgICBjbHMgPSBgaW9uaWNvbnMgaW9uLSR7ICRxLnBsYXRmb3JtLmlzLmlvcyA9PT0gdHJ1ZSA/ICdpb3MnIDogJ21kJyB9JHsgaWNvbi5zdWJzdHJpbmcoMykgfWBcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHN5bVJFLnRlc3QoaWNvbikgPT09IHRydWUpIHtcbiAgICAgICAgLy8gXCJub3RyYW5zbGF0ZVwiIGNsYXNzIGlzIGZvciBHb29nbGUgVHJhbnNsYXRlXG4gICAgICAgIC8vIHRvIGF2b2lkIHRhbXBlcmluZyB3aXRoIE1hdGVyaWFsIFN5bWJvbHMgbGlnYXR1cmUgZm9udFxuICAgICAgICAvL1xuICAgICAgICAvLyBDYXV0aW9uOiBUbyBiZSBhYmxlIHRvIGFkZCBzdWZmaXggdG8gdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgIC8vIGtlZXAgdGhlICdtYXRlcmlhbC1zeW1ib2xzJyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gICAgICAgIGNscyA9ICdub3RyYW5zbGF0ZSBtYXRlcmlhbC1zeW1ib2xzJ1xuXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBpY29uLm1hdGNoKHN5bVJFKVxuICAgICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xuICAgICAgICAgIGljb24gPSBpY29uLnN1YnN0cmluZyg2KVxuICAgICAgICAgIGNscyArPSBzeW1NYXBbIG1hdGNoZXNbIDEgXSBdXG4gICAgICAgIH1cblxuICAgICAgICBjb250ZW50ID0gaWNvblxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFwibm90cmFuc2xhdGVcIiBjbGFzcyBpcyBmb3IgR29vZ2xlIFRyYW5zbGF0ZVxuICAgICAgICAvLyB0byBhdm9pZCB0YW1wZXJpbmcgd2l0aCBNYXRlcmlhbCBJY29ucyBsaWdhdHVyZSBmb250XG4gICAgICAgIC8vXG4gICAgICAgIC8vIENhdXRpb246IFRvIGJlIGFibGUgdG8gYWRkIHN1ZmZpeCB0byB0aGUgY2xhc3MgbmFtZSxcbiAgICAgICAgLy8ga2VlcCB0aGUgJ21hdGVyaWFsLWljb25zJyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gICAgICAgIGNscyA9ICdub3RyYW5zbGF0ZSBtYXRlcmlhbC1pY29ucydcblxuICAgICAgICBjb25zdCBtYXRjaGVzID0gaWNvbi5tYXRjaChtYXRSRSlcbiAgICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgICBpY29uID0gaWNvbi5zdWJzdHJpbmcoMilcbiAgICAgICAgICBjbHMgKz0gbWF0TWFwWyBtYXRjaGVzWyAxIF0gXVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGVudCA9IGljb25cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2xzLFxuICAgICAgICBjb250ZW50XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBjbGFzczogY2xhc3Nlcy52YWx1ZSxcbiAgICAgICAgc3R5bGU6IHNpemVTdHlsZS52YWx1ZSxcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICByb2xlOiAncHJlc2VudGF0aW9uJ1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS52YWx1ZS5ub25lID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBoKHByb3BzLnRhZywgZGF0YSwgaFNsb3Qoc2xvdHMuZGVmYXVsdCkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLnZhbHVlLmltZyA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gaCgnc3BhbicsIGRhdGEsIGhNZXJnZVNsb3Qoc2xvdHMuZGVmYXVsdCwgW1xuICAgICAgICAgIGgoJ2ltZycsIHsgc3JjOiB0eXBlLnZhbHVlLnNyYyB9KVxuICAgICAgICBdKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUudmFsdWUuc3ZnID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBoKCdzcGFuJywgZGF0YSwgaE1lcmdlU2xvdChzbG90cy5kZWZhdWx0LCBbXG4gICAgICAgICAgaCgnc3ZnJywge1xuICAgICAgICAgICAgdmlld0JveDogdHlwZS52YWx1ZS52aWV3Qm94IHx8ICcwIDAgMjQgMjQnXG4gICAgICAgICAgfSwgdHlwZS52YWx1ZS5ub2RlcylcbiAgICAgICAgXSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLnZhbHVlLnN2Z3VzZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gaCgnc3BhbicsIGRhdGEsIGhNZXJnZVNsb3Qoc2xvdHMuZGVmYXVsdCwgW1xuICAgICAgICAgIGgoJ3N2ZycsIHtcbiAgICAgICAgICAgIHZpZXdCb3g6IHR5cGUudmFsdWUudmlld0JveFxuICAgICAgICAgIH0sIFtcbiAgICAgICAgICAgIGgoJ3VzZScsIHsgJ3hsaW5rOmhyZWYnOiB0eXBlLnZhbHVlLnNyYyB9KVxuICAgICAgICAgIF0pXG4gICAgICAgIF0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS52YWx1ZS5jbHMgIT09IHZvaWQgMCkge1xuICAgICAgICBkYXRhLmNsYXNzICs9ICcgJyArIHR5cGUudmFsdWUuY2xzXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKHByb3BzLnRhZywgZGF0YSwgaE1lcmdlU2xvdChzbG90cy5kZWZhdWx0LCBbXG4gICAgICAgIHR5cGUudmFsdWUuY29udGVudFxuICAgICAgXSkpXG4gICAgfVxuICB9XG59KVxuIiwiaW1wb3J0IHsgdW5yZWYgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiBvZmZzZXQgKGVsKSB7XG4gIGlmIChlbCA9PT0gd2luZG93KSB7XG4gICAgcmV0dXJuIHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgfVxuICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgcmV0dXJuIHsgdG9wLCBsZWZ0IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlIChlbCwgcHJvcGVydHkpIHtcbiAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGVpZ2h0IChlbCkge1xuICByZXR1cm4gZWwgPT09IHdpbmRvd1xuICAgID8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgOiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpZHRoIChlbCkge1xuICByZXR1cm4gZWwgPT09IHdpbmRvd1xuICAgID8gd2luZG93LmlubmVyV2lkdGhcbiAgICA6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3MgKGVsZW1lbnQsIGNzcykge1xuICBjb25zdCBzdHlsZSA9IGVsZW1lbnQuc3R5bGVcblxuICBmb3IgKGNvbnN0IHByb3AgaW4gY3NzKSB7XG4gICAgc3R5bGVbIHByb3AgXSA9IGNzc1sgcHJvcCBdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNzc0JhdGNoIChlbGVtZW50cywgc3R5bGUpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiBjc3MoZWwsIHN0eWxlKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWR5IChmbikge1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgcmV0dXJuIGZuKClcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbiwgZmFsc2UpXG59XG5cbi8vIGludGVybmFsXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudCAoZWwpIHtcbiAgaWYgKGVsID09PSB2b2lkIDAgfHwgZWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdm9pZCAwXG4gIH1cblxuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCkgfHwgdm9pZCAwXG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB2b2lkIDBcbiAgICB9XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSB1bnJlZihlbClcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQuJGVsIHx8IHRhcmdldFxuICB9XG59XG5cbi8vIGludGVybmFsXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRIYXNGb2N1cyAoZWwsIGZvY3VzZWRFbCkge1xuICBpZiAoZWwgPT09IHZvaWQgMCB8fCBlbCA9PT0gbnVsbCB8fCBlbC5jb250YWlucyhmb2N1c2VkRWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZvciAobGV0IG5leHQgPSBlbC5uZXh0RWxlbWVudFNpYmxpbmc7IG5leHQgIT09IG51bGw7IG5leHQgPSBuZXh0Lm5leHRFbGVtZW50U2libGluZykge1xuICAgIGlmIChuZXh0LmNvbnRhaW5zKGZvY3VzZWRFbCkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgb2Zmc2V0LFxuICBzdHlsZSxcbiAgaGVpZ2h0LFxuICB3aWR0aCxcbiAgY3NzLFxuICBjc3NCYXRjaCxcbiAgcmVhZHlcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmbiwgbGltaXQgPSAyNTApIHtcbiAgbGV0IHdhaXQgPSBmYWxzZSwgcmVzdWx0XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgaWYgKHdhaXQgPT09IGZhbHNlKSB7XG4gICAgICB3YWl0ID0gdHJ1ZVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdhaXQgPSBmYWxzZSB9LCBsaW1pdClcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiIsImltcG9ydCB7IGNyZWF0ZURpcmVjdGl2ZSB9IGZyb20gJy4uL3V0aWxzL3ByaXZhdGUvY3JlYXRlLmpzJ1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi4vdXRpbHMvZG9tLmpzJ1xuaW1wb3J0IHsgcG9zaXRpb24sIHN0b3AsIGFkZEV2dCwgY2xlYW5FdnQgfSBmcm9tICcuLi91dGlscy9ldmVudC5qcydcbmltcG9ydCB7IGlzS2V5Q29kZSB9IGZyb20gJy4uL3V0aWxzL3ByaXZhdGUva2V5LWNvbXBvc2l0aW9uLmpzJ1xuaW1wb3J0IHRocm90dGxlIGZyb20gJy4uL3V0aWxzL3Rocm90dGxlLmpzJ1xuaW1wb3J0IGdldFNTUlByb3BzIGZyb20gJy4uL3V0aWxzL3ByaXZhdGUvbm9vcC1zc3ItZGlyZWN0aXZlLXRyYW5zZm9ybS5qcydcblxuZnVuY3Rpb24gc2hvd1JpcHBsZSAoZXZ0LCBlbCwgY3R4LCBmb3JjZUNlbnRlcikge1xuICBjdHgubW9kaWZpZXJzLnN0b3AgPT09IHRydWUgJiYgc3RvcChldnQpXG5cbiAgY29uc3QgY29sb3IgPSBjdHgubW9kaWZpZXJzLmNvbG9yXG4gIGxldCBjZW50ZXIgPSBjdHgubW9kaWZpZXJzLmNlbnRlclxuICBjZW50ZXIgPSBjZW50ZXIgPT09IHRydWUgfHwgZm9yY2VDZW50ZXIgPT09IHRydWVcblxuICBjb25zdFxuICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgaW5uZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgIHBvcyA9IHBvc2l0aW9uKGV2dCksXG4gICAgeyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgIGRpYW1ldGVyID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpLFxuICAgIHJhZGl1cyA9IGRpYW1ldGVyIC8gMixcbiAgICBjZW50ZXJYID0gYCR7ICh3aWR0aCAtIGRpYW1ldGVyKSAvIDIgfXB4YCxcbiAgICB4ID0gY2VudGVyID8gY2VudGVyWCA6IGAkeyBwb3MubGVmdCAtIGxlZnQgLSByYWRpdXMgfXB4YCxcbiAgICBjZW50ZXJZID0gYCR7IChoZWlnaHQgLSBkaWFtZXRlcikgLyAyIH1weGAsXG4gICAgeSA9IGNlbnRlciA/IGNlbnRlclkgOiBgJHsgcG9zLnRvcCAtIHRvcCAtIHJhZGl1cyB9cHhgXG5cbiAgaW5uZXJOb2RlLmNsYXNzTmFtZSA9ICdxLXJpcHBsZV9faW5uZXInXG4gIGNzcyhpbm5lck5vZGUsIHtcbiAgICBoZWlnaHQ6IGAkeyBkaWFtZXRlciB9cHhgLFxuICAgIHdpZHRoOiBgJHsgZGlhbWV0ZXIgfXB4YCxcbiAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCgkeyB4IH0sJHsgeSB9LDApIHNjYWxlM2QoLjIsLjIsMSlgLFxuICAgIG9wYWNpdHk6IDBcbiAgfSlcblxuICBub2RlLmNsYXNzTmFtZSA9IGBxLXJpcHBsZSR7IGNvbG9yID8gJyB0ZXh0LScgKyBjb2xvciA6ICcnIH1gXG4gIG5vZGUuc2V0QXR0cmlidXRlKCdkaXInLCAnbHRyJylcbiAgbm9kZS5hcHBlbmRDaGlsZChpbm5lck5vZGUpXG4gIGVsLmFwcGVuZENoaWxkKG5vZGUpXG5cbiAgY29uc3QgYWJvcnQgPSAoKSA9PiB7XG4gICAgbm9kZS5yZW1vdmUoKVxuICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgfVxuICBjdHguYWJvcnQucHVzaChhYm9ydClcblxuICBsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpbm5lck5vZGUuY2xhc3NMaXN0LmFkZCgncS1yaXBwbGVfX2lubmVyLS1lbnRlcicpXG4gICAgaW5uZXJOb2RlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgkeyBjZW50ZXJYIH0sJHsgY2VudGVyWSB9LDApIHNjYWxlM2QoMSwxLDEpYFxuICAgIGlubmVyTm9kZS5zdHlsZS5vcGFjaXR5ID0gMC4yXG5cbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaW5uZXJOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3EtcmlwcGxlX19pbm5lci0tZW50ZXInKVxuICAgICAgaW5uZXJOb2RlLmNsYXNzTGlzdC5hZGQoJ3EtcmlwcGxlX19pbm5lci0tbGVhdmUnKVxuICAgICAgaW5uZXJOb2RlLnN0eWxlLm9wYWNpdHkgPSAwXG5cbiAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG5vZGUucmVtb3ZlKClcbiAgICAgICAgY3R4LmFib3J0LnNwbGljZShjdHguYWJvcnQuaW5kZXhPZihhYm9ydCksIDEpXG4gICAgICB9LCAyNzUpXG4gICAgfSwgMjUwKVxuICB9LCA1MClcbn1cblxuZnVuY3Rpb24gdXBkYXRlTW9kaWZpZXJzIChjdHgsIHsgbW9kaWZpZXJzLCB2YWx1ZSwgYXJnIH0pIHtcbiAgY29uc3QgY2ZnID0gT2JqZWN0LmFzc2lnbih7fSwgY3R4LmNmZy5yaXBwbGUsIG1vZGlmaWVycywgdmFsdWUpXG4gIGN0eC5tb2RpZmllcnMgPSB7XG4gICAgZWFybHk6IGNmZy5lYXJseSA9PT0gdHJ1ZSxcbiAgICBzdG9wOiBjZmcuc3RvcCA9PT0gdHJ1ZSxcbiAgICBjZW50ZXI6IGNmZy5jZW50ZXIgPT09IHRydWUsXG4gICAgY29sb3I6IGNmZy5jb2xvciB8fCBhcmcsXG4gICAga2V5Q29kZXM6IFtdLmNvbmNhdChjZmcua2V5Q29kZXMgfHwgMTMpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRGlyZWN0aXZlKF9fUVVBU0FSX1NTUl9TRVJWRVJfX1xuICA/IHsgbmFtZTogJ3JpcHBsZScsIGdldFNTUlByb3BzIH1cbiAgOiB7XG4gICAgICBuYW1lOiAncmlwcGxlJyxcblxuICAgICAgYmVmb3JlTW91bnQgKGVsLCBiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGNmZyA9IGJpbmRpbmcuaW5zdGFuY2UuJC5hcHBDb250ZXh0LmNvbmZpZy5nbG9iYWxQcm9wZXJ0aWVzLiRxLmNvbmZpZyB8fCB7fVxuXG4gICAgICAgIGlmIChjZmcucmlwcGxlID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgIGNmZyxcbiAgICAgICAgICBlbmFibGVkOiBiaW5kaW5nLnZhbHVlICE9PSBmYWxzZSxcbiAgICAgICAgICBtb2RpZmllcnM6IHt9LFxuICAgICAgICAgIGFib3J0OiBbXSxcblxuICAgICAgICAgIHN0YXJ0IChldnQpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY3R4LmVuYWJsZWQgPT09IHRydWVcbiAgICAgICAgICAgICAgJiYgZXZ0LnFTa2lwUmlwcGxlICE9PSB0cnVlXG4gICAgICAgICAgICAgICYmIGV2dC50eXBlID09PSAoY3R4Lm1vZGlmaWVycy5lYXJseSA9PT0gdHJ1ZSA/ICdwb2ludGVyZG93bicgOiAnY2xpY2snKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHNob3dSaXBwbGUoZXZ0LCBlbCwgY3R4LCBldnQucUtleUV2ZW50ID09PSB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBrZXlzdGFydDogdGhyb3R0bGUoZXZ0ID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY3R4LmVuYWJsZWQgPT09IHRydWVcbiAgICAgICAgICAgICAgJiYgZXZ0LnFTa2lwUmlwcGxlICE9PSB0cnVlXG4gICAgICAgICAgICAgICYmIGlzS2V5Q29kZShldnQsIGN0eC5tb2RpZmllcnMua2V5Q29kZXMpID09PSB0cnVlXG4gICAgICAgICAgICAgICYmIGV2dC50eXBlID09PSBga2V5JHsgY3R4Lm1vZGlmaWVycy5lYXJseSA9PT0gdHJ1ZSA/ICdkb3duJyA6ICd1cCcgfWBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBzaG93UmlwcGxlKGV2dCwgZWwsIGN0eCwgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAzMDApXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVNb2RpZmllcnMoY3R4LCBiaW5kaW5nKVxuXG4gICAgICAgIGVsLl9fcXJpcHBsZSA9IGN0eFxuXG4gICAgICAgIGFkZEV2dChjdHgsICdtYWluJywgW1xuICAgICAgICAgIFsgZWwsICdwb2ludGVyZG93bicsICdzdGFydCcsICdwYXNzaXZlJyBdLFxuICAgICAgICAgIFsgZWwsICdjbGljaycsICdzdGFydCcsICdwYXNzaXZlJyBdLFxuICAgICAgICAgIFsgZWwsICdrZXlkb3duJywgJ2tleXN0YXJ0JywgJ3Bhc3NpdmUnIF0sXG4gICAgICAgICAgWyBlbCwgJ2tleXVwJywgJ2tleXN0YXJ0JywgJ3Bhc3NpdmUnIF1cbiAgICAgICAgXSlcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZWQgKGVsLCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChiaW5kaW5nLm9sZFZhbHVlICE9PSBiaW5kaW5nLnZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgY3R4ID0gZWwuX19xcmlwcGxlXG4gICAgICAgICAgaWYgKGN0eCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBjdHguZW5hYmxlZCA9IGJpbmRpbmcudmFsdWUgIT09IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIChjdHguZW5hYmxlZCA9PT0gdHJ1ZSAmJiBPYmplY3QoYmluZGluZy52YWx1ZSkgPT09IGJpbmRpbmcudmFsdWUpIHtcbiAgICAgICAgICAgICAgdXBkYXRlTW9kaWZpZXJzKGN0eCwgYmluZGluZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGJlZm9yZVVubW91bnQgKGVsKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IGVsLl9fcXJpcHBsZVxuICAgICAgICBpZiAoY3R4ICE9PSB2b2lkIDApIHtcbiAgICAgICAgICBjdHguYWJvcnQuZm9yRWFjaChmbiA9PiB7IGZuKCkgfSlcbiAgICAgICAgICBjbGVhbkV2dChjdHgsICdtYWluJylcbiAgICAgICAgICBkZWxldGUgZWwuX3FyaXBwbGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbilcbiIsImltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3QgYWxpZ25NYXAgPSB7XG4gIGxlZnQ6ICdzdGFydCcsXG4gIGNlbnRlcjogJ2NlbnRlcicsXG4gIHJpZ2h0OiAnZW5kJyxcbiAgYmV0d2VlbjogJ2JldHdlZW4nLFxuICBhcm91bmQ6ICdhcm91bmQnLFxuICBldmVubHk6ICdldmVubHknLFxuICBzdHJldGNoOiAnc3RyZXRjaCdcbn1cblxuZXhwb3J0IGNvbnN0IGFsaWduVmFsdWVzID0gT2JqZWN0LmtleXMoYWxpZ25NYXApXG5cbmV4cG9ydCBjb25zdCB1c2VBbGlnblByb3BzID0ge1xuICBhbGlnbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB2YWxpZGF0b3I6IHYgPT4gYWxpZ25WYWx1ZXMuaW5jbHVkZXModilcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvcHMpIHtcbiAgLy8gcmV0dXJuIGFsaWduQ2xhc3NcbiAgcmV0dXJuIGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBhbGlnbiA9IHByb3BzLmFsaWduID09PSB2b2lkIDBcbiAgICAgID8gcHJvcHMudmVydGljYWwgPT09IHRydWUgPyAnc3RyZXRjaCcgOiAnbGVmdCdcbiAgICAgIDogcHJvcHMuYWxpZ25cblxuICAgIHJldHVybiBgJHsgcHJvcHMudmVydGljYWwgPT09IHRydWUgPyAnaXRlbXMnIDogJ2p1c3RpZnknIH0tJHsgYWxpZ25NYXBbIGFsaWduIF0gfWBcbiAgfSlcbn1cbiIsIlxuLy8gY29waWVkIHRvIGRvY3MgdG9vXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50UHJveHkgKHByb3h5KSB7XG4gIGlmIChPYmplY3QocHJveHkuJHBhcmVudCkgPT09IHByb3h5LiRwYXJlbnQpIHtcbiAgICByZXR1cm4gcHJveHkuJHBhcmVudFxuICB9XG5cbiAgbGV0IHsgcGFyZW50IH0gPSBwcm94eS4kXG5cbiAgd2hpbGUgKE9iamVjdChwYXJlbnQpID09PSBwYXJlbnQpIHtcbiAgICBpZiAoT2JqZWN0KHBhcmVudC5wcm94eSkgPT09IHBhcmVudC5wcm94eSkge1xuICAgICAgcmV0dXJuIHBhcmVudC5wcm94eVxuICAgIH1cblxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTm9ybWFsaXplZFZOb2RlcyAoY2hpbGRyZW4sIHZub2RlKSB7XG4gIGlmICh0eXBlb2Ygdm5vZGUudHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2bm9kZS5jaGlsZHJlbikgPT09IHRydWUpIHtcbiAgICAgIHZub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBmaWxsTm9ybWFsaXplZFZOb2RlcyhjaGlsZHJlbiwgY2hpbGQpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBjaGlsZHJlbi5hZGQodm5vZGUpXG4gIH1cbn1cblxuLy8gdm5vZGVzIGZyb20gcmVuZGVyZWQgaW4gYWR2YW5jZWQgc2xvdHNcbmV4cG9ydCBmdW5jdGlvbiBnZXROb3JtYWxpemVkVk5vZGVzICh2bm9kZXMpIHtcbiAgY29uc3QgY2hpbGRyZW4gPSBuZXcgU2V0KClcblxuICB2bm9kZXMuZm9yRWFjaCh2bm9kZSA9PiB7XG4gICAgZmlsbE5vcm1hbGl6ZWRWTm9kZXMoY2hpbGRyZW4sIHZub2RlKVxuICB9KVxuXG4gIHJldHVybiBBcnJheS5mcm9tKGNoaWxkcmVuKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdm1IYXNSb3V0ZXIgKHZtKSB7XG4gIHJldHVybiB2bS5hcHBDb250ZXh0LmNvbmZpZy5nbG9iYWxQcm9wZXJ0aWVzLiRyb3V0ZXIgIT09IHZvaWQgMFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdm1Jc0Rlc3Ryb3llZCAodm0pIHtcbiAgcmV0dXJuIHZtLmlzVW5tb3VudGVkID09PSB0cnVlIHx8IHZtLmlzRGVhY3RpdmF0ZWQgPT09IHRydWVcbn1cbiIsIi8qXG4gKiBJbnNwaXJlZCBieSBSb3V0ZXJMaW5rIGZyb20gVnVlIFJvdXRlclxuICogIC0tPiBBUEkgc2hvdWxkIG1hdGNoIVxuICovXG5cbmltcG9ydCB7IGNvbXB1dGVkLCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB7IHZtSGFzUm91dGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS92bS5qcydcblxuLy8gR2V0IHRoZSBvcmlnaW5hbCBwYXRoIHZhbHVlIG9mIGEgcmVjb3JkIGJ5IGZvbGxvd2luZyBpdHMgYWxpYXNPZlxuZnVuY3Rpb24gZ2V0T3JpZ2luYWxQYXRoIChyZWNvcmQpIHtcbiAgcmV0dXJuIHJlY29yZFxuICAgID8gKFxuICAgICAgICByZWNvcmQuYWxpYXNPZlxuICAgICAgICAgID8gcmVjb3JkLmFsaWFzT2YucGF0aFxuICAgICAgICAgIDogcmVjb3JkLnBhdGhcbiAgICAgICkgOiAnJ1xufVxuXG5mdW5jdGlvbiBpc1NhbWVSb3V0ZVJlY29yZCAoYSwgYikge1xuICAvLyBzaW5jZSB0aGUgb3JpZ2luYWwgcmVjb3JkIGhhcyBhbiB1bmRlZmluZWQgdmFsdWUgZm9yIGFsaWFzT2ZcbiAgLy8gYnV0IGFsbCBhbGlhc2VzIHBvaW50IHRvIHRoZSBvcmlnaW5hbCByZWNvcmQsIHRoaXMgd2lsbCBhbHdheXMgY29tcGFyZVxuICAvLyB0aGUgb3JpZ2luYWwgcmVjb3JkXG4gIHJldHVybiAoYS5hbGlhc09mIHx8IGEpID09PSAoYi5hbGlhc09mIHx8IGIpXG59XG5cbmZ1bmN0aW9uIGluY2x1ZGVzUGFyYW1zIChvdXRlciwgaW5uZXIpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gaW5uZXIpIHtcbiAgICBjb25zdFxuICAgICAgaW5uZXJWYWx1ZSA9IGlubmVyWyBrZXkgXSxcbiAgICAgIG91dGVyVmFsdWUgPSBvdXRlclsga2V5IF1cblxuICAgIGlmICh0eXBlb2YgaW5uZXJWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChpbm5lclZhbHVlICE9PSBvdXRlclZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChcbiAgICAgIEFycmF5LmlzQXJyYXkob3V0ZXJWYWx1ZSkgPT09IGZhbHNlXG4gICAgICB8fCBvdXRlclZhbHVlLmxlbmd0aCAhPT0gaW5uZXJWYWx1ZS5sZW5ndGhcbiAgICAgIHx8IGlubmVyVmFsdWUuc29tZSgodmFsdWUsIGkpID0+IHZhbHVlICE9PSBvdXRlclZhbHVlWyBpIF0pXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBpc0VxdWl2YWxlbnRBcnJheSAoYSwgYikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShiKSA9PT0gdHJ1ZVxuICAgID8gYS5sZW5ndGggPT09IGIubGVuZ3RoICYmIGEuZXZlcnkoKHZhbHVlLCBpKSA9PiB2YWx1ZSA9PT0gYlsgaSBdKVxuICAgIDogYS5sZW5ndGggPT09IDEgJiYgYVsgMCBdID09PSBiXG59XG5cbmZ1bmN0aW9uIGlzU2FtZVJvdXRlTG9jYXRpb25QYXJhbXNWYWx1ZSAoYSwgYikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhKSA9PT0gdHJ1ZVxuICAgID8gaXNFcXVpdmFsZW50QXJyYXkoYSwgYilcbiAgICA6IChcbiAgICAgICAgQXJyYXkuaXNBcnJheShiKSA9PT0gdHJ1ZVxuICAgICAgICAgID8gaXNFcXVpdmFsZW50QXJyYXkoYiwgYSlcbiAgICAgICAgICA6IGEgPT09IGJcbiAgICAgIClcbn1cblxuZnVuY3Rpb24gaXNTYW1lUm91dGVMb2NhdGlvblBhcmFtcyAoYSwgYikge1xuICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIGEpIHtcbiAgICBpZiAoaXNTYW1lUm91dGVMb2NhdGlvblBhcmFtc1ZhbHVlKGFbIGtleSBdLCBiWyBrZXkgXSkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgdXNlUm91dGVyTGlua1Byb3BzID0ge1xuICAvLyByb3V0ZXItbGlua1xuICB0bzogWyBTdHJpbmcsIE9iamVjdCBdLFxuICByZXBsYWNlOiBCb29sZWFuLFxuICBleGFjdDogQm9vbGVhbixcbiAgYWN0aXZlQ2xhc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3Etcm91dGVyLWxpbmstLWFjdGl2ZSdcbiAgfSxcbiAgZXhhY3RBY3RpdmVDbGFzczoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAncS1yb3V0ZXItbGluay0tZXhhY3QtYWN0aXZlJ1xuICB9LFxuXG4gIC8vIHJlZ3VsYXIgPGE+IGxpbmtcbiAgaHJlZjogU3RyaW5nLFxuICB0YXJnZXQ6IFN0cmluZyxcblxuICAvLyBzdGF0ZVxuICBkaXNhYmxlOiBCb29sZWFuXG59XG5cbi8vIGV4dGVybmFsIHByb3BzOiB0eXBlLCB0YWdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHsgZmFsbGJhY2tUYWcsIHVzZURpc2FibGVGb3JSb3V0ZXJMaW5rUHJvcHMgPSB0cnVlIH0gPSB7fSkge1xuICBjb25zdCB2bSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG4gIGNvbnN0IHsgcHJvcHMsIHByb3h5LCBlbWl0IH0gPSB2bVxuXG4gIGNvbnN0IGhhc1JvdXRlciA9IHZtSGFzUm91dGVyKHZtKVxuICBjb25zdCBoYXNIcmVmTGluayA9IGNvbXB1dGVkKCgpID0+IHByb3BzLmRpc2FibGUgIT09IHRydWUgJiYgcHJvcHMuaHJlZiAhPT0gdm9pZCAwKVxuXG4gIC8vIGZvciBwZXJmIHJlYXNvbnMsIHdlIHVzZSBtaW5pbXVtIGFtb3VudCBvZiBydW50aW1lIHdvcmtcbiAgY29uc3QgaGFzUm91dGVyTGlua1Byb3BzID0gdXNlRGlzYWJsZUZvclJvdXRlckxpbmtQcm9wcyA9PT0gdHJ1ZVxuICAgID8gY29tcHV0ZWQoKCkgPT5cbiAgICAgIGhhc1JvdXRlciA9PT0gdHJ1ZVxuICAgICAgJiYgcHJvcHMuZGlzYWJsZSAhPT0gdHJ1ZVxuICAgICAgJiYgaGFzSHJlZkxpbmsudmFsdWUgIT09IHRydWVcbiAgICAgICYmIHByb3BzLnRvICE9PSB2b2lkIDAgJiYgcHJvcHMudG8gIT09IG51bGwgJiYgcHJvcHMudG8gIT09ICcnXG4gICAgKVxuICAgIDogY29tcHV0ZWQoKCkgPT5cbiAgICAgIGhhc1JvdXRlciA9PT0gdHJ1ZVxuICAgICAgJiYgaGFzSHJlZkxpbmsudmFsdWUgIT09IHRydWVcbiAgICAgICYmIHByb3BzLnRvICE9PSB2b2lkIDAgJiYgcHJvcHMudG8gIT09IG51bGwgJiYgcHJvcHMudG8gIT09ICcnXG4gICAgKVxuXG4gIGNvbnN0IHJlc29sdmVkTGluayA9IGNvbXB1dGVkKCgpID0+IChcbiAgICBoYXNSb3V0ZXJMaW5rUHJvcHMudmFsdWUgPT09IHRydWVcbiAgICAgID8gZ2V0TGluayhwcm9wcy50bylcbiAgICAgIDogbnVsbFxuICApKVxuXG4gIGNvbnN0IGhhc1JvdXRlckxpbmsgPSBjb21wdXRlZCgoKSA9PiByZXNvbHZlZExpbmsudmFsdWUgIT09IG51bGwpXG4gIGNvbnN0IGhhc0xpbmsgPSBjb21wdXRlZCgoKSA9PiBoYXNIcmVmTGluay52YWx1ZSA9PT0gdHJ1ZSB8fCBoYXNSb3V0ZXJMaW5rLnZhbHVlID09PSB0cnVlKVxuXG4gIGNvbnN0IGxpbmtUYWcgPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgcHJvcHMudHlwZSA9PT0gJ2EnIHx8IGhhc0xpbmsudmFsdWUgPT09IHRydWVcbiAgICAgID8gJ2EnXG4gICAgICA6IChwcm9wcy50YWcgfHwgZmFsbGJhY2tUYWcgfHwgJ2RpdicpXG4gICkpXG5cbiAgY29uc3QgbGlua0F0dHJzID0gY29tcHV0ZWQoKCkgPT4gKFxuICAgIGhhc0hyZWZMaW5rLnZhbHVlID09PSB0cnVlXG4gICAgICA/IHtcbiAgICAgICAgICBocmVmOiBwcm9wcy5ocmVmLFxuICAgICAgICAgIHRhcmdldDogcHJvcHMudGFyZ2V0XG4gICAgICAgIH1cbiAgICAgIDogKFxuICAgICAgICAgIGhhc1JvdXRlckxpbmsudmFsdWUgPT09IHRydWVcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIGhyZWY6IHJlc29sdmVkTGluay52YWx1ZS5ocmVmLFxuICAgICAgICAgICAgICAgIHRhcmdldDogcHJvcHMudGFyZ2V0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDoge31cbiAgICAgICAgKVxuICApKVxuXG4gIGNvbnN0IGxpbmtBY3RpdmVJbmRleCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBpZiAoaGFzUm91dGVyTGluay52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIGNvbnN0XG4gICAgICB7IG1hdGNoZWQgfSA9IHJlc29sdmVkTGluay52YWx1ZSxcbiAgICAgIHsgbGVuZ3RoIH0gPSBtYXRjaGVkLFxuICAgICAgcm91dGVNYXRjaGVkID0gbWF0Y2hlZFsgbGVuZ3RoIC0gMSBdXG5cbiAgICBpZiAocm91dGVNYXRjaGVkID09PSB2b2lkIDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRNYXRjaGVkID0gcHJveHkuJHJvdXRlLm1hdGNoZWRcblxuICAgIGlmIChjdXJyZW50TWF0Y2hlZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gY3VycmVudE1hdGNoZWQuZmluZEluZGV4KFxuICAgICAgaXNTYW1lUm91dGVSZWNvcmQuYmluZChudWxsLCByb3V0ZU1hdGNoZWQpXG4gICAgKVxuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBpbmRleFxuICAgIH1cblxuICAgIC8vIHBvc3NpYmxlIHBhcmVudCByZWNvcmRcbiAgICBjb25zdCBwYXJlbnRSZWNvcmRQYXRoID0gZ2V0T3JpZ2luYWxQYXRoKG1hdGNoZWRbIGxlbmd0aCAtIDIgXSlcblxuICAgIHJldHVybiAoXG4gICAgICAvLyB3ZSBhcmUgZGVhbGluZyB3aXRoIG5lc3RlZCByb3V0ZXNcbiAgICAgIGxlbmd0aCA+IDFcbiAgICAgIC8vIGlmIHRoZSBwYXJlbnQgYW5kIG1hdGNoZWQgcm91dGUgaGF2ZSB0aGUgc2FtZSBwYXRoLCB0aGlzIGxpbmsgaXNcbiAgICAgIC8vIHJlZmVycmluZyB0byB0aGUgZW1wdHkgY2hpbGQuIE9yIHdlIGN1cnJlbnRseSBhcmUgb24gYSBkaWZmZXJlbnRcbiAgICAgIC8vIGNoaWxkIG9mIHRoZSBzYW1lIHBhcmVudFxuICAgICAgJiYgZ2V0T3JpZ2luYWxQYXRoKHJvdXRlTWF0Y2hlZCkgPT09IHBhcmVudFJlY29yZFBhdGhcbiAgICAgIC8vIGF2b2lkIGNvbXBhcmluZyB0aGUgY2hpbGQgd2l0aCBpdHMgcGFyZW50XG4gICAgICAmJiBjdXJyZW50TWF0Y2hlZFsgY3VycmVudE1hdGNoZWQubGVuZ3RoIC0gMSBdLnBhdGggIT09IHBhcmVudFJlY29yZFBhdGhcbiAgICAgICAgPyBjdXJyZW50TWF0Y2hlZC5maW5kSW5kZXgoXG4gICAgICAgICAgaXNTYW1lUm91dGVSZWNvcmQuYmluZChudWxsLCBtYXRjaGVkWyBsZW5ndGggLSAyIF0pXG4gICAgICAgIClcbiAgICAgICAgOiBpbmRleFxuICAgIClcbiAgfSlcblxuICBjb25zdCBsaW5rSXNBY3RpdmUgPSBjb21wdXRlZCgoKSA9PlxuICAgIGhhc1JvdXRlckxpbmsudmFsdWUgPT09IHRydWVcbiAgICAmJiBsaW5rQWN0aXZlSW5kZXgudmFsdWUgIT09IC0xXG4gICAgJiYgaW5jbHVkZXNQYXJhbXMocHJveHkuJHJvdXRlLnBhcmFtcywgcmVzb2x2ZWRMaW5rLnZhbHVlLnBhcmFtcylcbiAgKVxuXG4gIGNvbnN0IGxpbmtJc0V4YWN0QWN0aXZlID0gY29tcHV0ZWQoKCkgPT5cbiAgICBsaW5rSXNBY3RpdmUudmFsdWUgPT09IHRydWVcbiAgICAgICYmIGxpbmtBY3RpdmVJbmRleC52YWx1ZSA9PT0gcHJveHkuJHJvdXRlLm1hdGNoZWQubGVuZ3RoIC0gMVxuICAgICAgJiYgaXNTYW1lUm91dGVMb2NhdGlvblBhcmFtcyhwcm94eS4kcm91dGUucGFyYW1zLCByZXNvbHZlZExpbmsudmFsdWUucGFyYW1zKVxuICApXG5cbiAgY29uc3QgbGlua0NsYXNzID0gY29tcHV0ZWQoKCkgPT4gKFxuICAgIGhhc1JvdXRlckxpbmsudmFsdWUgPT09IHRydWVcbiAgICAgID8gKFxuICAgICAgICAgIGxpbmtJc0V4YWN0QWN0aXZlLnZhbHVlID09PSB0cnVlXG4gICAgICAgICAgICA/IGAgJHsgcHJvcHMuZXhhY3RBY3RpdmVDbGFzcyB9ICR7IHByb3BzLmFjdGl2ZUNsYXNzIH1gXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICBwcm9wcy5leGFjdCA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICAgICAgOiAobGlua0lzQWN0aXZlLnZhbHVlID09PSB0cnVlID8gYCAkeyBwcm9wcy5hY3RpdmVDbGFzcyB9YCA6ICcnKVxuICAgICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIDogJydcbiAgKSlcblxuICBmdW5jdGlvbiBnZXRMaW5rICh0bykge1xuICAgIHRyeSB7IHJldHVybiBwcm94eS4kcm91dGVyLnJlc29sdmUodG8pIH1cbiAgICBjYXRjaCAoXykge31cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgUHJvbWlzZTxSb3V0ZXJFcnJvciB8IGZhbHNlIHwgdW5kZWZpbmVkPlxuICAgKi9cbiAgZnVuY3Rpb24gbmF2aWdhdGVUb1JvdXRlckxpbmsgKFxuICAgIGUsXG4gICAgeyByZXR1cm5Sb3V0ZXJFcnJvciwgdG8gPSBwcm9wcy50bywgcmVwbGFjZSA9IHByb3BzLnJlcGxhY2UgfSA9IHt9XG4gICkge1xuICAgIGlmIChwcm9wcy5kaXNhYmxlID09PSB0cnVlKSB7XG4gICAgICAvLyBlbnN1cmUgbmF0aXZlIG5hdmlnYXRpb24gaXMgcHJldmVudGVkIGluIGFsbCBjYXNlcyxcbiAgICAgIC8vIGxpa2Ugd2hlbiB1c2VEaXNhYmxlRm9yUm91dGVyTGlua1Byb3BzID09PSBmYWxzZSAoUVJvdXRlVGFiKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIC8vIGRvbid0IHJlZGlyZWN0IHdpdGggY29udHJvbCBrZXlzO1xuICAgICAgLy8gc2hvdWxkIG1hdGNoIFJvdXRlckxpbmsgZnJvbSBWdWUgUm91dGVyXG4gICAgICBlLm1ldGFLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXlcblxuICAgICAgLy8gZG9uJ3QgcmVkaXJlY3Qgb24gcmlnaHQgY2xpY2tcbiAgICAgIHx8IChlLmJ1dHRvbiAhPT0gdm9pZCAwICYmIGUuYnV0dG9uICE9PSAwKVxuXG4gICAgICAvLyBkb24ndCByZWRpcmVjdCBpZiBpdCBzaG91bGQgb3BlbiBpbiBhIG5ldyB3aW5kb3dcbiAgICAgIHx8IHByb3BzLnRhcmdldCA9PT0gJ19ibGFuaydcbiAgICApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgLy8gaGluZGVyIHRoZSBuYXRpdmUgbmF2aWdhdGlvblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgLy8gdGhlbigpIGNhbiBhbHNvIHJldHVybiBhIFwic29mdFwiIHJvdXRlciBlcnJvciAoVnVlIFJvdXRlciBiZWhhdmlvcilcbiAgICBjb25zdCBwcm9taXNlID0gcHJveHkuJHJvdXRlclsgcmVwbGFjZSA9PT0gdHJ1ZSA/ICdyZXBsYWNlJyA6ICdwdXNoJyBdKHRvKVxuXG4gICAgcmV0dXJuIHJldHVyblJvdXRlckVycm9yID09PSB0cnVlXG4gICAgICA/IHByb21pc2VcbiAgICAgIC8vIGVsc2UgY2F0Y2hpbmcgaGFyZCBlcnJvcnMgYW5kIGFsc28gXCJzb2Z0XCIgb25lcyAtIHRoZW4oZXJyID0+IC4uLilcbiAgICAgIDogcHJvbWlzZS50aGVuKCgpID0+IHt9KS5jYXRjaCgoKSA9PiB7fSlcbiAgfVxuXG4gIC8vIHdhcm5pbmchIGVuc3VyZSB0aGF0IHRoZSBjb21wb25lbnQgdXNpbmcgaXQgaGFzICdjbGljaycgaW5jbHVkZWQgaW4gaXRzICdlbWl0cycgZGVmaW5pdGlvbiBwcm9wXG4gIGZ1bmN0aW9uIG5hdmlnYXRlT25DbGljayAoZSkge1xuICAgIGlmIChoYXNSb3V0ZXJMaW5rLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBnbyA9IG9wdHMgPT4gbmF2aWdhdGVUb1JvdXRlckxpbmsoZSwgb3B0cylcblxuICAgICAgZW1pdCgnY2xpY2snLCBlLCBnbylcbiAgICAgIGUuZGVmYXVsdFByZXZlbnRlZCAhPT0gdHJ1ZSAmJiBnbygpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZW1pdCgnY2xpY2snLCBlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzUm91dGVyTGluayxcbiAgICBoYXNIcmVmTGluayxcbiAgICBoYXNMaW5rLFxuXG4gICAgbGlua1RhZyxcbiAgICByZXNvbHZlZExpbmssXG4gICAgbGlua0lzQWN0aXZlLFxuICAgIGxpbmtJc0V4YWN0QWN0aXZlLFxuICAgIGxpbmtDbGFzcyxcbiAgICBsaW5rQXR0cnMsXG5cbiAgICBnZXRMaW5rLFxuICAgIG5hdmlnYXRlVG9Sb3V0ZXJMaW5rLFxuICAgIG5hdmlnYXRlT25DbGlja1xuICB9XG59XG4iLCJpbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHVzZUFsaWduLCB7IHVzZUFsaWduUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlL3VzZS1hbGlnbi5qcydcbmltcG9ydCB1c2VTaXplLCB7IHVzZVNpemVQcm9wcyB9IGZyb20gJy4uLy4uL2NvbXBvc2FibGVzL3ByaXZhdGUvdXNlLXNpemUuanMnXG5pbXBvcnQgdXNlUm91dGVyTGluaywgeyB1c2VSb3V0ZXJMaW5rUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlL3VzZS1yb3V0ZXItbGluay5qcydcblxuZXhwb3J0IGNvbnN0IGJ0blBhZGRpbmcgPSB7XG4gIG5vbmU6IDAsXG4gIHhzOiA0LFxuICBzbTogOCxcbiAgbWQ6IDE2LFxuICBsZzogMjQsXG4gIHhsOiAzMlxufVxuXG5jb25zdCBkZWZhdWx0U2l6ZXMgPSB7XG4gIHhzOiA4LFxuICBzbTogMTAsXG4gIG1kOiAxNCxcbiAgbGc6IDIwLFxuICB4bDogMjRcbn1cblxuY29uc3QgZm9ybVR5cGVzID0gWyAnYnV0dG9uJywgJ3N1Ym1pdCcsICdyZXNldCcgXVxuY29uc3QgbWVkaWFUeXBlUkUgPSAvW15cXHNdXFwvW15cXHNdL1xuXG5leHBvcnQgY29uc3QgYnRuRGVzaWduT3B0aW9ucyA9IFsgJ2ZsYXQnLCAnb3V0bGluZScsICdwdXNoJywgJ3VuZWxldmF0ZWQnIF1cbmV4cG9ydCBjb25zdCBnZXRCdG5EZXNpZ24gPSAocHJvcHMsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICBpZiAocHJvcHMuZmxhdCA9PT0gdHJ1ZSkgcmV0dXJuICdmbGF0J1xuICBpZiAocHJvcHMub3V0bGluZSA9PT0gdHJ1ZSkgcmV0dXJuICdvdXRsaW5lJ1xuICBpZiAocHJvcHMucHVzaCA9PT0gdHJ1ZSkgcmV0dXJuICdwdXNoJ1xuICBpZiAocHJvcHMudW5lbGV2YXRlZCA9PT0gdHJ1ZSkgcmV0dXJuICd1bmVsZXZhdGVkJ1xuICByZXR1cm4gZGVmYXVsdFZhbHVlXG59XG5leHBvcnQgY29uc3QgZ2V0QnRuRGVzaWduQXR0ciA9IHByb3BzID0+IHtcbiAgY29uc3QgZGVzaWduID0gZ2V0QnRuRGVzaWduKHByb3BzKVxuICByZXR1cm4gZGVzaWduICE9PSB2b2lkIDBcbiAgICA/IHsgWyBkZXNpZ24gXTogdHJ1ZSB9XG4gICAgOiB7fVxufVxuXG5leHBvcnQgY29uc3QgdXNlQnRuUHJvcHMgPSB7XG4gIC4uLnVzZVNpemVQcm9wcyxcbiAgLi4udXNlUm91dGVyTGlua1Byb3BzLFxuXG4gIHR5cGU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2J1dHRvbidcbiAgfSxcblxuICBsYWJlbDogWyBOdW1iZXIsIFN0cmluZyBdLFxuICBpY29uOiBTdHJpbmcsXG4gIGljb25SaWdodDogU3RyaW5nLFxuXG4gIC4uLmJ0bkRlc2lnbk9wdGlvbnMucmVkdWNlKFxuICAgIChhY2MsIHZhbCkgPT4gKGFjY1sgdmFsIF0gPSBCb29sZWFuKSAmJiBhY2MsXG4gICAge31cbiAgKSxcblxuICBzcXVhcmU6IEJvb2xlYW4sXG4gIHJvdW5kOiBCb29sZWFuLFxuICByb3VuZGVkOiBCb29sZWFuLFxuICBnbG9zc3k6IEJvb2xlYW4sXG5cbiAgc2l6ZTogU3RyaW5nLFxuICBmYWI6IEJvb2xlYW4sXG4gIGZhYk1pbmk6IEJvb2xlYW4sXG4gIHBhZGRpbmc6IFN0cmluZyxcblxuICBjb2xvcjogU3RyaW5nLFxuICB0ZXh0Q29sb3I6IFN0cmluZyxcbiAgbm9DYXBzOiBCb29sZWFuLFxuICBub1dyYXA6IEJvb2xlYW4sXG4gIGRlbnNlOiBCb29sZWFuLFxuXG4gIHRhYmluZGV4OiBbIE51bWJlciwgU3RyaW5nIF0sXG5cbiAgcmlwcGxlOiB7XG4gICAgdHlwZTogWyBCb29sZWFuLCBPYmplY3QgXSxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH0sXG5cbiAgYWxpZ246IHtcbiAgICAuLi51c2VBbGlnblByb3BzLmFsaWduLFxuICAgIGRlZmF1bHQ6ICdjZW50ZXInXG4gIH0sXG4gIHN0YWNrOiBCb29sZWFuLFxuICBzdHJldGNoOiBCb29sZWFuLFxuICBsb2FkaW5nOiB7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICBkZWZhdWx0OiBudWxsXG4gIH0sXG4gIGRpc2FibGU6IEJvb2xlYW5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHByb3BzKSB7XG4gIGNvbnN0IHNpemVTdHlsZSA9IHVzZVNpemUocHJvcHMsIGRlZmF1bHRTaXplcylcbiAgY29uc3QgYWxpZ25DbGFzcyA9IHVzZUFsaWduKHByb3BzKVxuICBjb25zdCB7IGhhc1JvdXRlckxpbmssIGhhc0xpbmssIGxpbmtUYWcsIGxpbmtBdHRycywgbmF2aWdhdGVPbkNsaWNrIH0gPSB1c2VSb3V0ZXJMaW5rKHtcbiAgICBmYWxsYmFja1RhZzogJ2J1dHRvbidcbiAgfSlcblxuICBjb25zdCBzdHlsZSA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBvYmogPSBwcm9wcy5mYWIgPT09IGZhbHNlICYmIHByb3BzLmZhYk1pbmkgPT09IGZhbHNlXG4gICAgICA/IHNpemVTdHlsZS52YWx1ZVxuICAgICAgOiB7fVxuXG4gICAgcmV0dXJuIHByb3BzLnBhZGRpbmcgIT09IHZvaWQgMFxuICAgICAgPyBPYmplY3QuYXNzaWduKHt9LCBvYmosIHtcbiAgICAgICAgcGFkZGluZzogcHJvcHMucGFkZGluZ1xuICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgLm1hcCh2ID0+ICh2IGluIGJ0blBhZGRpbmcgPyBidG5QYWRkaW5nWyB2IF0gKyAncHgnIDogdikpXG4gICAgICAgICAgLmpvaW4oJyAnKSxcbiAgICAgICAgbWluV2lkdGg6ICcwJyxcbiAgICAgICAgbWluSGVpZ2h0OiAnMCdcbiAgICAgIH0pXG4gICAgICA6IG9ialxuICB9KVxuXG4gIGNvbnN0IGlzUm91bmRlZCA9IGNvbXB1dGVkKCgpID0+XG4gICAgcHJvcHMucm91bmRlZCA9PT0gdHJ1ZSB8fCBwcm9wcy5mYWIgPT09IHRydWUgfHwgcHJvcHMuZmFiTWluaSA9PT0gdHJ1ZVxuICApXG5cbiAgY29uc3QgaXNBY3Rpb25hYmxlID0gY29tcHV0ZWQoKCkgPT5cbiAgICBwcm9wcy5kaXNhYmxlICE9PSB0cnVlICYmIHByb3BzLmxvYWRpbmcgIT09IHRydWVcbiAgKVxuXG4gIGNvbnN0IHRhYkluZGV4ID0gY29tcHV0ZWQoKCkgPT4gKFxuICAgIGlzQWN0aW9uYWJsZS52YWx1ZSA9PT0gdHJ1ZSA/IHByb3BzLnRhYmluZGV4IHx8IDAgOiAtMVxuICApKVxuXG4gIGNvbnN0IGRlc2lnbiA9IGNvbXB1dGVkKCgpID0+IGdldEJ0bkRlc2lnbihwcm9wcywgJ3N0YW5kYXJkJykpXG5cbiAgY29uc3QgYXR0cmlidXRlcyA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBhY2MgPSB7IHRhYmluZGV4OiB0YWJJbmRleC52YWx1ZSB9XG5cbiAgICBpZiAoaGFzTGluay52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihhY2MsIGxpbmtBdHRycy52YWx1ZSlcbiAgICB9XG4gICAgZWxzZSBpZiAoZm9ybVR5cGVzLmluY2x1ZGVzKHByb3BzLnR5cGUpID09PSB0cnVlKSB7XG4gICAgICBhY2MudHlwZSA9IHByb3BzLnR5cGVcbiAgICB9XG5cbiAgICBpZiAobGlua1RhZy52YWx1ZSA9PT0gJ2EnKSB7XG4gICAgICBpZiAocHJvcHMuZGlzYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICBhY2NbICdhcmlhLWRpc2FibGVkJyBdID0gJ3RydWUnXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhY2MuaHJlZiA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGFjYy5yb2xlID0gJ2J1dHRvbidcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc1JvdXRlckxpbmsudmFsdWUgIT09IHRydWUgJiYgbWVkaWFUeXBlUkUudGVzdChwcm9wcy50eXBlKSA9PT0gdHJ1ZSkge1xuICAgICAgICBhY2MudHlwZSA9IHByb3BzLnR5cGVcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocHJvcHMuZGlzYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgYWNjLmRpc2FibGVkID0gJydcbiAgICAgIGFjY1sgJ2FyaWEtZGlzYWJsZWQnIF0gPSAndHJ1ZSdcbiAgICB9XG5cbiAgICBpZiAocHJvcHMubG9hZGluZyA9PT0gdHJ1ZSAmJiBwcm9wcy5wZXJjZW50YWdlICE9PSB2b2lkIDApIHtcbiAgICAgIE9iamVjdC5hc3NpZ24oYWNjLCB7XG4gICAgICAgIHJvbGU6ICdwcm9ncmVzc2JhcicsXG4gICAgICAgICdhcmlhLXZhbHVlbWluJzogMCxcbiAgICAgICAgJ2FyaWEtdmFsdWVtYXgnOiAxMDAsXG4gICAgICAgICdhcmlhLXZhbHVlbm93JzogcHJvcHMucGVyY2VudGFnZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjXG4gIH0pXG5cbiAgY29uc3QgY2xhc3NlcyA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBsZXQgY29sb3JzXG5cbiAgICBpZiAocHJvcHMuY29sb3IgIT09IHZvaWQgMCkge1xuICAgICAgaWYgKHByb3BzLmZsYXQgPT09IHRydWUgfHwgcHJvcHMub3V0bGluZSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb2xvcnMgPSBgdGV4dC0keyBwcm9wcy50ZXh0Q29sb3IgfHwgcHJvcHMuY29sb3IgfWBcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb2xvcnMgPSBgYmctJHsgcHJvcHMuY29sb3IgfSB0ZXh0LSR7IHByb3BzLnRleHRDb2xvciB8fCAnd2hpdGUnIH1gXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHByb3BzLnRleHRDb2xvcikge1xuICAgICAgY29sb3JzID0gYHRleHQtJHsgcHJvcHMudGV4dENvbG9yIH1gXG4gICAgfVxuXG4gICAgY29uc3Qgc2hhcGUgPSBwcm9wcy5yb3VuZCA9PT0gdHJ1ZVxuICAgICAgPyAncm91bmQnXG4gICAgICA6IGByZWN0YW5nbGUkeyBpc1JvdW5kZWQudmFsdWUgPT09IHRydWUgPyAnIHEtYnRuLS1yb3VuZGVkJyA6IChwcm9wcy5zcXVhcmUgPT09IHRydWUgPyAnIHEtYnRuLS1zcXVhcmUnIDogJycpIH1gXG5cbiAgICByZXR1cm4gYHEtYnRuLS0keyBkZXNpZ24udmFsdWUgfSBxLWJ0bi0tJHsgc2hhcGUgfWBcbiAgICAgICsgKGNvbG9ycyAhPT0gdm9pZCAwID8gJyAnICsgY29sb3JzIDogJycpXG4gICAgICArIChpc0FjdGlvbmFibGUudmFsdWUgPT09IHRydWUgPyAnIHEtYnRuLS1hY3Rpb25hYmxlIHEtZm9jdXNhYmxlIHEtaG92ZXJhYmxlJyA6IChwcm9wcy5kaXNhYmxlID09PSB0cnVlID8gJyBkaXNhYmxlZCcgOiAnJykpXG4gICAgICArIChwcm9wcy5mYWIgPT09IHRydWUgPyAnIHEtYnRuLS1mYWInIDogKHByb3BzLmZhYk1pbmkgPT09IHRydWUgPyAnIHEtYnRuLS1mYWItbWluaScgOiAnJykpXG4gICAgICArIChwcm9wcy5ub0NhcHMgPT09IHRydWUgPyAnIHEtYnRuLS1uby11cHBlcmNhc2UnIDogJycpXG4gICAgICArIChwcm9wcy5kZW5zZSA9PT0gdHJ1ZSA/ICcgcS1idG4tLWRlbnNlJyA6ICcnKVxuICAgICAgKyAocHJvcHMuc3RyZXRjaCA9PT0gdHJ1ZSA/ICcgbm8tYm9yZGVyLXJhZGl1cyBzZWxmLXN0cmV0Y2gnIDogJycpXG4gICAgICArIChwcm9wcy5nbG9zc3kgPT09IHRydWUgPyAnIGdsb3NzeScgOiAnJylcbiAgICAgICsgKHByb3BzLnNxdWFyZSA/ICcgcS1idG4tLXNxdWFyZScgOiAnJylcbiAgfSlcblxuICBjb25zdCBpbm5lckNsYXNzZXMgPSBjb21wdXRlZCgoKSA9PlxuICAgIGFsaWduQ2xhc3MudmFsdWUgKyAocHJvcHMuc3RhY2sgPT09IHRydWUgPyAnIGNvbHVtbicgOiAnIHJvdycpXG4gICAgKyAocHJvcHMubm9XcmFwID09PSB0cnVlID8gJyBuby13cmFwIHRleHQtbm8td3JhcCcgOiAnJylcbiAgICArIChwcm9wcy5sb2FkaW5nID09PSB0cnVlID8gJyBxLWJ0bl9fY29udGVudC0taGlkZGVuJyA6ICcnKVxuICApXG5cbiAgcmV0dXJuIHtcbiAgICBjbGFzc2VzLFxuICAgIHN0eWxlLFxuICAgIGlubmVyQ2xhc3NlcyxcbiAgICBhdHRyaWJ1dGVzLFxuICAgIGhhc0xpbmssXG4gICAgbGlua1RhZyxcbiAgICBuYXZpZ2F0ZU9uQ2xpY2ssXG4gICAgaXNBY3Rpb25hYmxlXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIHJlZiwgY29tcHV0ZWQsIFRyYW5zaXRpb24sIG9uQmVmb3JlVW5tb3VudCwgd2l0aERpcmVjdGl2ZXMsIGdldEN1cnJlbnRJbnN0YW5jZSB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IFFJY29uIGZyb20gJy4uL2ljb24vUUljb24uanMnXG5pbXBvcnQgUVNwaW5uZXIgZnJvbSAnLi4vc3Bpbm5lci9RU3Bpbm5lci5qcydcblxuaW1wb3J0IFJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL1JpcHBsZS5qcydcblxuaW1wb3J0IHVzZUJ0biwgeyB1c2VCdG5Qcm9wcyB9IGZyb20gJy4vdXNlLWJ0bi5qcydcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9jcmVhdGUuanMnXG5pbXBvcnQgeyBoTWVyZ2VTbG90IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9yZW5kZXIuanMnXG5pbXBvcnQgeyBzdG9wLCBwcmV2ZW50LCBzdG9wQW5kUHJldmVudCwgbGlzdGVuT3B0cyB9IGZyb20gJy4uLy4uL3V0aWxzL2V2ZW50LmpzJ1xuaW1wb3J0IHsgaXNLZXlDb2RlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9rZXktY29tcG9zaXRpb24uanMnXG5cbmNvbnN0IHsgcGFzc2l2ZUNhcHR1cmUgfSA9IGxpc3Rlbk9wdHNcblxubGV0XG4gIHRvdWNoVGFyZ2V0ID0gbnVsbCxcbiAga2V5Ym9hcmRUYXJnZXQgPSBudWxsLFxuICBtb3VzZVRhcmdldCA9IG51bGxcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29tcG9uZW50KHtcbiAgbmFtZTogJ1FCdG4nLFxuXG4gIHByb3BzOiB7XG4gICAgLi4udXNlQnRuUHJvcHMsXG5cbiAgICBwZXJjZW50YWdlOiBOdW1iZXIsXG4gICAgZGFya1BlcmNlbnRhZ2U6IEJvb2xlYW4sXG5cbiAgICBvblRvdWNoc3RhcnQ6IFsgRnVuY3Rpb24sIEFycmF5IF1cbiAgfSxcblxuICBlbWl0czogWyAnY2xpY2snLCAna2V5ZG93bicsICdtb3VzZWRvd24nLCAna2V5dXAnIF0sXG5cbiAgc2V0dXAgKHByb3BzLCB7IHNsb3RzLCBlbWl0IH0pIHtcbiAgICBjb25zdCB7IHByb3h5IH0gPSBnZXRDdXJyZW50SW5zdGFuY2UoKVxuXG4gICAgY29uc3Qge1xuICAgICAgY2xhc3Nlcywgc3R5bGUsIGlubmVyQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICBoYXNMaW5rLCBsaW5rVGFnLCBuYXZpZ2F0ZU9uQ2xpY2ssXG4gICAgICBpc0FjdGlvbmFibGVcbiAgICB9ID0gdXNlQnRuKHByb3BzKVxuXG4gICAgY29uc3Qgcm9vdFJlZiA9IHJlZihudWxsKVxuICAgIGNvbnN0IGJsdXJUYXJnZXRSZWYgPSByZWYobnVsbClcblxuICAgIGxldCBsb2NhbFRvdWNoVGFyZ2V0RWwgPSBudWxsLCBhdm9pZE1vdXNlUmlwcGxlLCBtb3VzZVRpbWVyID0gbnVsbFxuXG4gICAgY29uc3QgaGFzTGFiZWwgPSBjb21wdXRlZCgoKSA9PlxuICAgICAgcHJvcHMubGFiZWwgIT09IHZvaWQgMCAmJiBwcm9wcy5sYWJlbCAhPT0gbnVsbCAmJiBwcm9wcy5sYWJlbCAhPT0gJydcbiAgICApXG5cbiAgICBjb25zdCByaXBwbGUgPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgICBwcm9wcy5kaXNhYmxlID09PSB0cnVlIHx8IHByb3BzLnJpcHBsZSA9PT0gZmFsc2VcbiAgICAgICAgPyBmYWxzZVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIGtleUNvZGVzOiBoYXNMaW5rLnZhbHVlID09PSB0cnVlID8gWyAxMywgMzIgXSA6IFsgMTMgXSxcbiAgICAgICAgICAgIC4uLihwcm9wcy5yaXBwbGUgPT09IHRydWUgPyB7fSA6IHByb3BzLnJpcHBsZSlcbiAgICAgICAgICB9XG4gICAgKSlcblxuICAgIGNvbnN0IHJpcHBsZVByb3BzID0gY29tcHV0ZWQoKCkgPT4gKHsgY2VudGVyOiBwcm9wcy5yb3VuZCB9KSlcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2VTdHlsZSA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgcHJvcHMucGVyY2VudGFnZSkpXG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgICAgICA/IHsgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjZzJywgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWCgkeyB2YWwgLSAxMDAgfSUpYCB9XG4gICAgICAgIDoge31cbiAgICB9KVxuXG4gICAgY29uc3Qgb25FdmVudHMgPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMubG9hZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9uTW91c2Vkb3duOiBvbkxvYWRpbmdFdnQsXG4gICAgICAgICAgb25Ub3VjaHN0YXJ0OiBvbkxvYWRpbmdFdnQsXG4gICAgICAgICAgb25DbGljazogb25Mb2FkaW5nRXZ0LFxuICAgICAgICAgIG9uS2V5ZG93bjogb25Mb2FkaW5nRXZ0LFxuICAgICAgICAgIG9uS2V5dXA6IG9uTG9hZGluZ0V2dFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0FjdGlvbmFibGUudmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgYWNjID0ge1xuICAgICAgICAgIG9uQ2xpY2ssXG4gICAgICAgICAgb25LZXlkb3duLFxuICAgICAgICAgIG9uTW91c2Vkb3duXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJveHkuJHEucGxhdGZvcm0uaGFzLnRvdWNoID09PSB0cnVlKSB7XG4gICAgICAgICAgY29uc3Qgc3VmZml4ID0gcHJvcHMub25Ub3VjaHN0YXJ0ICE9PSB2b2lkIDBcbiAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgIDogJ1Bhc3NpdmUnXG5cbiAgICAgICAgICBhY2NbIGBvblRvdWNoc3RhcnQkeyBzdWZmaXggfWAgXSA9IG9uVG91Y2hzdGFydFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBuZWVkZWQ7IGVzcGVjaWFsbHkgZm9yIGRpc2FibGVkIDxhPiB0YWdzXG4gICAgICAgIG9uQ2xpY2s6IHN0b3BBbmRQcmV2ZW50XG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IG5vZGVQcm9wcyA9IGNvbXB1dGVkKCgpID0+ICh7XG4gICAgICByZWY6IHJvb3RSZWYsXG4gICAgICBjbGFzczogJ3EtYnRuIHEtYnRuLWl0ZW0gbm9uLXNlbGVjdGFibGUgbm8tb3V0bGluZSAnICsgY2xhc3Nlcy52YWx1ZSxcbiAgICAgIHN0eWxlOiBzdHlsZS52YWx1ZSxcbiAgICAgIC4uLmF0dHJpYnV0ZXMudmFsdWUsXG4gICAgICAuLi5vbkV2ZW50cy52YWx1ZVxuICAgIH0pKVxuXG4gICAgZnVuY3Rpb24gb25DbGljayAoZSkge1xuICAgICAgLy8gaXMgaXQgYWxyZWFkeSBkZXN0cm95ZWQ/XG4gICAgICBpZiAocm9vdFJlZi52YWx1ZSA9PT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgICBpZiAoZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICAvLyBmb2N1cyBidXR0b24gaWYgaXQgY2FtZSBmcm9tIEVOVEVSIG9uIGZvcm1cbiAgICAgICAgLy8gcHJldmVudCB0aGUgbmV3IHN1Ym1pdCAoYWxyZWFkeSBkb25lKVxuICAgICAgICBpZiAoXG4gICAgICAgICAgcHJvcHMudHlwZSA9PT0gJ3N1Ym1pdCdcbiAgICAgICAgICAmJiBlbCAhPT0gZG9jdW1lbnQuYm9keVxuICAgICAgICAgICYmIHJvb3RSZWYudmFsdWUuY29udGFpbnMoZWwpID09PSBmYWxzZVxuICAgICAgICAgIC8vIHJlcXVpcmVkIGZvciBpT1MgYW5kIGRlc2t0b3AgU2FmYXJpXG4gICAgICAgICAgJiYgZWwuY29udGFpbnMocm9vdFJlZi52YWx1ZSkgPT09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgIHJvb3RSZWYudmFsdWUuZm9jdXMoKVxuXG4gICAgICAgICAgY29uc3Qgb25DbGlja0NsZWFudXAgPSAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc3RvcEFuZFByZXZlbnQsIHRydWUpXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uQ2xpY2tDbGVhbnVwLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgICAgIHJvb3RSZWYudmFsdWUgIT09IG51bGwgJiYgcm9vdFJlZi52YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgb25DbGlja0NsZWFudXAsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzdG9wQW5kUHJldmVudCwgdHJ1ZSlcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uQ2xpY2tDbGVhbnVwLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgICByb290UmVmLnZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbkNsaWNrQ2xlYW51cCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmF2aWdhdGVPbkNsaWNrKGUpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25LZXlkb3duIChlKSB7XG4gICAgICAvLyBpcyBpdCBhbHJlYWR5IGRlc3Ryb3llZD9cbiAgICAgIGlmIChyb290UmVmLnZhbHVlID09PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICAgIGVtaXQoJ2tleWRvd24nLCBlKVxuXG4gICAgICBpZiAoaXNLZXlDb2RlKGUsIFsgMTMsIDMyIF0pID09PSB0cnVlICYmIGtleWJvYXJkVGFyZ2V0ICE9PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIGtleWJvYXJkVGFyZ2V0ICE9PSBudWxsICYmIGNsZWFudXAoKVxuXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgICAvLyBmb2N1cyBleHRlcm5hbCBidXR0b24gaWYgdGhlIGZvY3VzIGhlbHBlciB3YXMgZm9jdXNlZCBiZWZvcmVcbiAgICAgICAgICByb290UmVmLnZhbHVlLmZvY3VzKClcblxuICAgICAgICAgIGtleWJvYXJkVGFyZ2V0ID0gcm9vdFJlZi52YWx1ZVxuICAgICAgICAgIHJvb3RSZWYudmFsdWUuY2xhc3NMaXN0LmFkZCgncS1idG4tLWFjdGl2ZScpXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvblByZXNzRW5kLCB0cnVlKVxuICAgICAgICAgIHJvb3RSZWYudmFsdWUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICB9XG5cbiAgICAgICAgc3RvcEFuZFByZXZlbnQoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRvdWNoc3RhcnQgKGUpIHtcbiAgICAgIC8vIGlzIGl0IGFscmVhZHkgZGVzdHJveWVkP1xuICAgICAgaWYgKHJvb3RSZWYudmFsdWUgPT09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgICAgZW1pdCgndG91Y2hzdGFydCcsIGUpXG5cbiAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgPT09IHRydWUpIHsgcmV0dXJuIH1cblxuICAgICAgaWYgKHRvdWNoVGFyZ2V0ICE9PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIHRvdWNoVGFyZ2V0ICE9PSBudWxsICYmIGNsZWFudXAoKVxuICAgICAgICB0b3VjaFRhcmdldCA9IHJvb3RSZWYudmFsdWVcblxuICAgICAgICBsb2NhbFRvdWNoVGFyZ2V0RWwgPSBlLnRhcmdldFxuICAgICAgICBsb2NhbFRvdWNoVGFyZ2V0RWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBvblByZXNzRW5kLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgbG9jYWxUb3VjaFRhcmdldEVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25QcmVzc0VuZCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICB9XG5cbiAgICAgIC8vIGF2b2lkIGR1cGxpY2F0ZWQgbW91c2Vkb3duIGV2ZW50XG4gICAgICAvLyB0cmlnZ2VyaW5nIGFub3RoZXIgZWFybHkgcmlwcGxlXG4gICAgICBhdm9pZE1vdXNlUmlwcGxlID0gdHJ1ZVxuICAgICAgbW91c2VUaW1lciAhPT0gbnVsbCAmJiBjbGVhclRpbWVvdXQobW91c2VUaW1lcilcbiAgICAgIG1vdXNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbW91c2VUaW1lciA9IG51bGxcbiAgICAgICAgYXZvaWRNb3VzZVJpcHBsZSA9IGZhbHNlXG4gICAgICB9LCAyMDApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZWRvd24gKGUpIHtcbiAgICAgIC8vIGlzIGl0IGFscmVhZHkgZGVzdHJveWVkP1xuICAgICAgaWYgKHJvb3RSZWYudmFsdWUgPT09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgICAgZS5xU2tpcFJpcHBsZSA9IGF2b2lkTW91c2VSaXBwbGUgPT09IHRydWVcbiAgICAgIGVtaXQoJ21vdXNlZG93bicsIGUpXG5cbiAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgIT09IHRydWUgJiYgbW91c2VUYXJnZXQgIT09IHJvb3RSZWYudmFsdWUpIHtcbiAgICAgICAgbW91c2VUYXJnZXQgIT09IG51bGwgJiYgY2xlYW51cCgpXG4gICAgICAgIG1vdXNlVGFyZ2V0ID0gcm9vdFJlZi52YWx1ZVxuICAgICAgICByb290UmVmLnZhbHVlLmNsYXNzTGlzdC5hZGQoJ3EtYnRuLS1hY3RpdmUnKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25QcmVzc0VuZCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25QcmVzc0VuZCAoZSkge1xuICAgICAgLy8gaXMgaXQgYWxyZWFkeSBkZXN0cm95ZWQ/XG4gICAgICBpZiAocm9vdFJlZi52YWx1ZSA9PT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgICAvLyBuZWVkZWQgZm9yIElFIChiZWNhdXNlIGl0IGVtaXRzIGJsdXIgd2hlbiBmb2N1c2luZyBidXR0b24gZnJvbSBmb2N1cyBoZWxwZXIpXG4gICAgICBpZiAoZSAhPT0gdm9pZCAwICYmIGUudHlwZSA9PT0gJ2JsdXInICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHJvb3RSZWYudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChlICE9PSB2b2lkIDAgJiYgZS50eXBlID09PSAna2V5dXAnKSB7XG4gICAgICAgIGlmIChrZXlib2FyZFRhcmdldCA9PT0gcm9vdFJlZi52YWx1ZSAmJiBpc0tleUNvZGUoZSwgWyAxMywgMzIgXSkgPT09IHRydWUpIHtcbiAgICAgICAgICAvLyBmb3IgY2xpY2sgdHJpZ2dlclxuICAgICAgICAgIGNvbnN0IGV2dCA9IG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIGUpXG4gICAgICAgICAgZXZ0LnFLZXlFdmVudCA9IHRydWVcbiAgICAgICAgICBlLmRlZmF1bHRQcmV2ZW50ZWQgPT09IHRydWUgJiYgcHJldmVudChldnQpXG4gICAgICAgICAgZS5jYW5jZWxCdWJibGUgPT09IHRydWUgJiYgc3RvcChldnQpXG4gICAgICAgICAgcm9vdFJlZi52YWx1ZS5kaXNwYXRjaEV2ZW50KGV2dClcblxuICAgICAgICAgIHN0b3BBbmRQcmV2ZW50KGUpXG5cbiAgICAgICAgICAvLyBmb3IgcmlwcGxlXG4gICAgICAgICAgZS5xS2V5RXZlbnQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBlbWl0KCdrZXl1cCcsIGUpXG4gICAgICB9XG5cbiAgICAgIGNsZWFudXAoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFudXAgKGRlc3Ryb3lpbmcpIHtcbiAgICAgIGNvbnN0IGJsdXJUYXJnZXQgPSBibHVyVGFyZ2V0UmVmLnZhbHVlXG5cbiAgICAgIGlmIChcbiAgICAgICAgZGVzdHJveWluZyAhPT0gdHJ1ZVxuICAgICAgICAmJiAodG91Y2hUYXJnZXQgPT09IHJvb3RSZWYudmFsdWUgfHwgbW91c2VUYXJnZXQgPT09IHJvb3RSZWYudmFsdWUpXG4gICAgICAgICYmIGJsdXJUYXJnZXQgIT09IG51bGxcbiAgICAgICAgJiYgYmx1clRhcmdldCAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIGJsdXJUYXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKVxuICAgICAgICBibHVyVGFyZ2V0LmZvY3VzKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRvdWNoVGFyZ2V0ID09PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIGlmIChsb2NhbFRvdWNoVGFyZ2V0RWwgIT09IG51bGwpIHtcbiAgICAgICAgICBsb2NhbFRvdWNoVGFyZ2V0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBvblByZXNzRW5kLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgICBsb2NhbFRvdWNoVGFyZ2V0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblByZXNzRW5kLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgfVxuICAgICAgICB0b3VjaFRhcmdldCA9IGxvY2FsVG91Y2hUYXJnZXRFbCA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKG1vdXNlVGFyZ2V0ID09PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvblByZXNzRW5kLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgbW91c2VUYXJnZXQgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlib2FyZFRhcmdldCA9PT0gcm9vdFJlZi52YWx1ZSkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uUHJlc3NFbmQsIHRydWUpXG4gICAgICAgIHJvb3RSZWYudmFsdWUgIT09IG51bGwgJiYgcm9vdFJlZi52YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgb25QcmVzc0VuZCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICAgIGtleWJvYXJkVGFyZ2V0ID0gbnVsbFxuICAgICAgfVxuXG4gICAgICByb290UmVmLnZhbHVlICE9PSBudWxsICYmIHJvb3RSZWYudmFsdWUuY2xhc3NMaXN0LnJlbW92ZSgncS1idG4tLWFjdGl2ZScpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Mb2FkaW5nRXZ0IChldnQpIHtcbiAgICAgIHN0b3BBbmRQcmV2ZW50KGV2dClcbiAgICAgIGV2dC5xU2tpcFJpcHBsZSA9IHRydWVcbiAgICB9XG5cbiAgICBvbkJlZm9yZVVubW91bnQoKCkgPT4ge1xuICAgICAgY2xlYW51cCh0cnVlKVxuICAgIH0pXG5cbiAgICAvLyBleHBvc2UgcHVibGljIG1ldGhvZHNcbiAgICBPYmplY3QuYXNzaWduKHByb3h5LCB7IGNsaWNrOiBvbkNsaWNrIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGlubmVyID0gW11cblxuICAgICAgcHJvcHMuaWNvbiAhPT0gdm9pZCAwICYmIGlubmVyLnB1c2goXG4gICAgICAgIGgoUUljb24sIHtcbiAgICAgICAgICBuYW1lOiBwcm9wcy5pY29uLFxuICAgICAgICAgIGxlZnQ6IHByb3BzLnN0YWNrID09PSBmYWxzZSAmJiBoYXNMYWJlbC52YWx1ZSA9PT0gdHJ1ZSxcbiAgICAgICAgICByb2xlOiAnaW1nJyxcbiAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZSdcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgaGFzTGFiZWwudmFsdWUgPT09IHRydWUgJiYgaW5uZXIucHVzaChcbiAgICAgICAgaCgnc3BhbicsIHsgY2xhc3M6ICdibG9jaycgfSwgWyBwcm9wcy5sYWJlbCBdKVxuICAgICAgKVxuXG4gICAgICBpbm5lciA9IGhNZXJnZVNsb3Qoc2xvdHMuZGVmYXVsdCwgaW5uZXIpXG5cbiAgICAgIGlmIChwcm9wcy5pY29uUmlnaHQgIT09IHZvaWQgMCAmJiBwcm9wcy5yb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaW5uZXIucHVzaChcbiAgICAgICAgICBoKFFJY29uLCB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wcy5pY29uUmlnaHQsXG4gICAgICAgICAgICByaWdodDogcHJvcHMuc3RhY2sgPT09IGZhbHNlICYmIGhhc0xhYmVsLnZhbHVlID09PSB0cnVlLFxuICAgICAgICAgICAgcm9sZTogJ2ltZycsXG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZSdcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkID0gW1xuICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgIGNsYXNzOiAncS1mb2N1cy1oZWxwZXInLFxuICAgICAgICAgIHJlZjogYmx1clRhcmdldFJlZlxuICAgICAgICB9KVxuICAgICAgXVxuXG4gICAgICBpZiAocHJvcHMubG9hZGluZyA9PT0gdHJ1ZSAmJiBwcm9wcy5wZXJjZW50YWdlICE9PSB2b2lkIDApIHtcbiAgICAgICAgY2hpbGQucHVzaChcbiAgICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgICAgY2xhc3M6ICdxLWJ0bl9fcHJvZ3Jlc3MgYWJzb2x1dGUtZnVsbCBvdmVyZmxvdy1oaWRkZW4nICsgKHByb3BzLmRhcmtQZXJjZW50YWdlID09PSB0cnVlID8gJyBxLWJ0bl9fcHJvZ3Jlc3MtLWRhcmsnIDogJycpXG4gICAgICAgICAgfSwgW1xuICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgY2xhc3M6ICdxLWJ0bl9fcHJvZ3Jlc3MtaW5kaWNhdG9yIGZpdCBibG9jaycsXG4gICAgICAgICAgICAgIHN0eWxlOiBwZXJjZW50YWdlU3R5bGUudmFsdWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBjaGlsZC5wdXNoKFxuICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgIGNsYXNzOiAncS1idG5fX2NvbnRlbnQgdGV4dC1jZW50ZXIgY29sIGl0ZW1zLWNlbnRlciBxLWFuY2hvci0tc2tpcCAnICsgaW5uZXJDbGFzc2VzLnZhbHVlXG4gICAgICAgIH0sIGlubmVyKVxuICAgICAgKVxuXG4gICAgICBwcm9wcy5sb2FkaW5nICE9PSBudWxsICYmIGNoaWxkLnB1c2goXG4gICAgICAgIGgoVHJhbnNpdGlvbiwge1xuICAgICAgICAgIG5hbWU6ICdxLXRyYW5zaXRpb24tLWZhZGUnXG4gICAgICAgIH0sICgpID0+IChcbiAgICAgICAgICBwcm9wcy5sb2FkaW5nID09PSB0cnVlXG4gICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAga2V5OiAnbG9hZGluZycsXG4gICAgICAgICAgICAgICAgICBjbGFzczogJ2Fic29sdXRlLWZ1bGwgZmxleCBmbGV4LWNlbnRlcidcbiAgICAgICAgICAgICAgICB9LCBzbG90cy5sb2FkaW5nICE9PSB2b2lkIDAgPyBzbG90cy5sb2FkaW5nKCkgOiBbIGgoUVNwaW5uZXIpIF0pXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogbnVsbFxuICAgICAgICApKVxuICAgICAgKVxuXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoXG4gICAgICAgIGgoXG4gICAgICAgICAgbGlua1RhZy52YWx1ZSxcbiAgICAgICAgICBub2RlUHJvcHMudmFsdWUsXG4gICAgICAgICAgY2hpbGRcbiAgICAgICAgKSxcbiAgICAgICAgWyBbXG4gICAgICAgICAgUmlwcGxlLFxuICAgICAgICAgIHJpcHBsZS52YWx1ZSxcbiAgICAgICAgICB2b2lkIDAsXG4gICAgICAgICAgcmlwcGxlUHJvcHMudmFsdWVcbiAgICAgICAgXSBdXG4gICAgICApXG4g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
