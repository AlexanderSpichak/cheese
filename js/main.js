! function () {
    if ("function" == typeof window.CustomEvent) return !1;
    window.CustomEvent = function (t, e) {
        e = e || {
            bubbles: !1,
            cancelable: !1,
            detail: null
        };
        var i = document.createEvent("CustomEvent");
        return i.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), i
    }
}();
var WRAPPER_SELECTOR = ".slider__wrapper",
    ITEMS_SELECTOR = ".slider__items",
    ITEM_SELECTOR = ".slider__item",
    CONTROL_CLASS = "slider__control",
    SELECTOR_PREV = '.slider__control[data-slide="prev"]',
    SELECTOR_NEXT = '.slider__control[data-slide="next"]',
    SELECTOR_INDICATOR = ".slider__indicators>li",
    SLIDER_TRANSITION_OFF = "slider_disable-transition",
    CLASS_CONTROL_HIDE = "slider__control_hide",
    CLASS_ITEM_ACTIVE = "slider__item_active",
    CLASS_INDICATOR_ACTIVE = "active";

function ChiefSlider(t, e) {
    var i = "string" == typeof t ? document.querySelector(t) : t;
    for (var n in this._$root = i, this._$wrapper = i.querySelector(WRAPPER_SELECTOR), this._$items = i.querySelector(ITEMS_SELECTOR), this._$itemList = i.querySelectorAll(ITEM_SELECTOR), this._$controlPrev = i.querySelector(SELECTOR_PREV), this._$controlNext = i.querySelector(SELECTOR_NEXT), this._$indicatorList = i.querySelectorAll(SELECTOR_INDICATOR), this._minOrder = 0, this._maxOrder = 0, this._$itemWithMinOrder = null, this._$itemWithMaxOrder = null, this._minTranslate = 0, this._maxTranslate = 0, this._direction = "next", this._balancingItemsFlag = !1, this._activeItems = [], this._transform = 0, this._hasSwipeState = !1, this.__swipeStartPos = 0, this._transform = 0, this._intervalId = null, this._config = {
        loop: !0,
        autoplay: !1,
        interval: 5e3,
        refresh: !0,
        swipe: !0
    }, e) this._config.hasOwnProperty(n) && (this._config[n] = e[n]);
    var s = this._$itemList,
        o = s[0].offsetWidth,
        a = this._$wrapper.offsetWidth,
        l = Math.round(a / o);
    this._widthItem = o, this._widthWrapper = a, this._itemsInVisibleArea = l, this._transformStep = 100 / l;
    for (var r = 0, d = s.length; r < d; r++) s[r].dataset.index = r, s[r].dataset.order = r, s[r].dataset.translate = 0, r < l && this._activeItems.push(r);
    if (this._config.loop) {
        var c = s.length - 1,
            m = 100 * -s.length;
        s[c].dataset.order = -1, s[c].dataset.translate = 100 * -s.length, s[c].style.transform = "translateX(" + m + "%)", this.__refreshExtremeValues()
    } else this._$controlPrev && this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
    this._setActiveClass(), this._addEventListener(), this._updateIndicators(), this._autoplay()
}
ChiefSlider.prototype._addEventListener = function () {
    var t = this._$root,
        e = this._$items,
        i = this._config;

    function n(t) {
        this._autoplay("stop");
        var e = 0 === t.type.search("touch") ? t.touches[0] : t;
        this._swipeStartPos = e.clientX, this._hasSwipeState = !0
    }

    function s(t) {
        if (this._hasSwipeState) {
            var e = 0 === t.type.search("touch") ? t.changedTouches[0] : t,
                i = this._swipeStartPos - e.clientX;
            i > 50 ? (this._direction = "next", this._move()) : i < -50 && (this._direction = "prev", this._move()), this._hasSwipeState = !1, this._config.loop && this._autoplay()
        }
    }
    t.addEventListener("click", function (t) {
        var e = t.target;
        if (this._autoplay("stop"), e.classList.contains(CONTROL_CLASS)) t.preventDefault(), this._direction = e.dataset.slide, this._move();
        else if (e.dataset.slideTo) {
            var i = parseInt(e.dataset.slideTo);
            this._moveTo(i)
        }
        this._config.loop && this._autoplay()
    }.bind(this)), t.addEventListener("mouseenter", function (t) {
        this._autoplay("stop")
    }.bind(this)), t.addEventListener("mouseleave", function (t) {
        this._autoplay()
    }.bind(this)), i.refresh && window.addEventListener("resize", function () {
        window.requestAnimationFrame(this._refresh.bind(this))
    }.bind(this)), i.loop && (e.addEventListener("transition-start", function () {
        this._balancingItemsFlag || (this._balancingItemsFlag = !0, window.requestAnimationFrame(this._balancingItems.bind(this)))
    }.bind(this)), e.addEventListener("transitionend", function () {
        this._balancingItemsFlag = !1
    }.bind(this))), i.swipe && (t.addEventListener("touchstart", n.bind(this)), t.addEventListener("mousedown", n.bind(this)), document.addEventListener("touchend", s.bind(this)), document.addEventListener("mouseup", s.bind(this))), t.addEventListener("dragstart", function (t) {
        t.preventDefault()
    }.bind(this)), document.addEventListener("visibilitychange", function () {
        "hidden" === document.visibilityState ? this._autoplay("stop") : "visible" === document.visibilityState && this._config.loop && this._autoplay()
    }.bind(this))
}, ChiefSlider.prototype.__refreshExtremeValues = function () {
    var t = this._$itemList;
    this._minOrder = +t[0].dataset.order, this._maxOrder = this._minOrder, this._$itemByMinOrder = t[0], this._$itemByMaxOrder = t[0], this._minTranslate = +t[0].dataset.translate, this._maxTranslate = this._minTranslate;
    for (var e = 0, i = t.length; e < i; e++) {
        var n = t[e],
            s = +n.dataset.order;
        s < this._minOrder ? (this._minOrder = s, this._$itemByMinOrder = n, this._minTranslate = +n.dataset.translate) : s > this._maxOrder && (this._maxOrder = s, this._$itemByMaxOrder = n, this._maxTranslate = +n.dataset.translate)
    }
}, ChiefSlider.prototype._balancingItems = function () {
    if (this._balancingItemsFlag) {
        var t, e = this._$wrapper.getBoundingClientRect(),
            i = e.width / this._itemsInVisibleArea / 2,
            n = this._$itemList.length;
        if ("next" === this._direction) {
            var s = e.left,
                o = this._$itemByMinOrder;
            t = this._minTranslate, o.getBoundingClientRect().right < s - i && (o.dataset.order = this._minOrder + n, t += 100 * n, o.dataset.translate = t, o.style.transform = "translateX(".concat(t, "%)"), this.__refreshExtremeValues())
        } else {
            var a = e.right,
                l = this._$itemByMaxOrder;
            t = this._maxTranslate, l.getBoundingClientRect().left > a + i && (l.dataset.order = this._maxOrder - n, t -= 100 * n, l.dataset.translate = t, l.style.transform = "translateX(".concat(t, "%)"), this.__refreshExtremeValues())
        }
        requestAnimationFrame(this._balancingItems.bind(this))
    }
}, ChiefSlider.prototype._setActiveClass = function () {
    for (var t = this._activeItems, e = this._$itemList, i = 0, n = e.length; i < n; i++) {
        var s = e[i],
            o = +s.dataset.index;
        t.indexOf(o) > -1 ? s.classList.add(CLASS_ITEM_ACTIVE) : s.classList.remove(CLASS_ITEM_ACTIVE)
    }
}, ChiefSlider.prototype._updateIndicators = function () {
    var t = this._$indicatorList,
        e = this._$itemList;
    if (t.length)
        for (var i = 0, n = e.length; i < n; i++) {
            e[i].classList.contains(CLASS_ITEM_ACTIVE) ? t[i].classList.add(CLASS_INDICATOR_ACTIVE) : t[i].classList.remove(CLASS_INDICATOR_ACTIVE)
        }
}, ChiefSlider.prototype._move = function () {
    var t = "next" === this._direction ? -this._transformStep : this._transformStep,
        e = this._transform + t;
    if (!this._config.loop) {
        var i = this._transformStep * (this._$itemList.length - this._itemsInVisibleArea);
        if ((e = Math.round(10 * e) / 10) < -i || e > 0) return;
        this._$controlPrev.classList.remove(CLASS_CONTROL_HIDE), this._$controlNext.classList.remove(CLASS_CONTROL_HIDE), e === -i ? this._$controlNext.classList.add(CLASS_CONTROL_HIDE) : 0 === e && this._$controlPrev.classList.add(CLASS_CONTROL_HIDE)
    }
    var n, s, o, a = [],
        l = 0;
    if ("next" === this._direction)
        for (l = 0, n = this._activeItems.length; l < n; l++) s = this._activeItems[l], (o = ++s) > this._$itemList.length - 1 && (o -= this._$itemList.length), a.push(o);
    else
        for (l = 0, n = this._activeItems.length; l < n; l++) s = this._activeItems[l], (o = --s) < 0 && (o += this._$itemList.length), a.push(o);
    this._activeItems = a, this._setActiveClass(), this._updateIndicators(), this._transform = e, this._$items.style.transform = "translateX(" + e + "%)", this._$items.dispatchEvent(new CustomEvent("transition-start", {
        bubbles: !0
    }))
}, ChiefSlider.prototype._moveToNext = function () {
    this._direction = "next", this._move()
}, ChiefSlider.prototype._moveToPrev = function () {
    this._direction = "prev", this._move()
}, ChiefSlider.prototype._moveTo = function (t) {
    var e, i, n = this._$indicatorList,
        s = null,
        o = null;
    for (e = 0, i = n.length; e < i; e++) {
        var a = n[e];
        if (a.classList.contains(CLASS_INDICATOR_ACTIVE)) {
            var l = +a.dataset.slideTo;
            (null === o || Math.abs(t - l) < o) && (s = l, o = Math.abs(t - s))
        }
    }
    if (0 !== (o = t - s))
        for (this._direction = o > 0 ? "next" : "prev", e = 1; e <= Math.abs(o); e++) this._move()
}, ChiefSlider.prototype._autoplay = function (t) {
    if (this._config.autoplay) return "stop" === t ? (clearInterval(this._intervalId), void (this._intervalId = null)) : void (null === this._intervalId && (this._intervalId = setInterval(function () {
        this._direction = "next", this._move()
    }.bind(this), this._config.interval)))
}, ChiefSlider.prototype._refresh = function () {
    var t = this._$itemList,
        e = t[0].offsetWidth,
        i = this._$wrapper.offsetWidth,
        n = Math.round(i / e);
    if (n !== this._itemsInVisibleArea) {
        this._autoplay("stop"), this._$items.classList.add(SLIDER_TRANSITION_OFF), this._$items.style.transform = "translateX(0)", this._widthItem = e, this._widthWrapper = i, this._itemsInVisibleArea = n, this._transform = 0, this._transformStep = 100 / n, this._balancingItemsFlag = !1, this._activeItems = [];
        for (var s = 0, o = t.length; s < o; s++) {
            var a = t[s],
                l = s;
            a.dataset.index = l, a.dataset.order = l, a.dataset.translate = 0, a.style.transform = "translateX(0)", l < n && this._activeItems.push(l)
        }
        if (this._setActiveClass(), this._updateIndicators(), window.requestAnimationFrame(function () {
            this._$items.classList.remove(SLIDER_TRANSITION_OFF)
        }.bind(this)), this._config.loop) {
            var r = t.length - 1,
                d = 100 * -t.length;
            t[r].dataset.order = -1, t[r].dataset.translate = 100 * -t.length, t[r].style.transform = "translateX(".concat(d, "%)"), this.__refreshExtremeValues(), this._autoplay()
        } else this._$controlPrev && this._$controlPrev.classList.add(CLASS_CONTROL_HIDE)
    }
}, ChiefSlider.prototype.next = function () {
    this._moveToNext()
}, ChiefSlider.prototype.prev = function () {
    this._moveToPrev()
}, ChiefSlider.prototype.moveTo = function (t) {
    this._moveTo(t)
}, ChiefSlider.prototype.refresh = function () {
    this._refresh()
}, document.addEventListener("DOMContentLoaded", (function () {
    new ChiefSlider(".slider", {
        loop: !1
    })
})), document.addEventListener("DOMContentLoaded", (function () {
    var t = document.getElementById("btn_modal_window"),
        e = document.getElementById("my_modal"),
        i = document.getElementById("overflow-hidden"),
        n = document.getElementsByClassName("modal__close")[0];
    t.onclick = function () {
        e.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        e.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var s = document.getElementById("btn_modal_window2"),
        o = document.getElementById("my_modal2");
    n = document.getElementsByClassName("modal__close")[1];
    s.onclick = function () {
        o.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        o.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var a = document.getElementById("btn_modal_window3"),
        l = document.getElementById("my_modal3");
    n = document.getElementsByClassName("modal__close")[2];
    a.onclick = function () {
        l.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        l.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var r = document.getElementById("btn_modal_window4"),
        d = document.getElementById("my_modal4");
    n = document.getElementsByClassName("modal__close")[3];
    r.onclick = function () {
        d.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        d.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var c = document.getElementById("btn_modal_window5"),
        m = document.getElementById("my_modal5");
    n = document.getElementsByClassName("modal__close")[4];
    c.onclick = function () {
        m.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        m.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var _ = document.getElementById("btn_modal_window6"),
        h = document.getElementById("my_modal6");
    n = document.getElementsByClassName("modal__close")[5];
    _.onclick = function () {
        h.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        h.style.visibility = "hidden", i.style.overflow = "visible"
    };
    var u = document.getElementById("btn_modal_window7"),
        f = document.getElementById("my_modal7");
    n = document.getElementsByClassName("modal__close")[6];
    u.onclick = function () {
        f.style.visibility = "visible", i.style.overflow = "hidden"
    }, n.onclick = function () {
        f.style.visibility = "hidden", i.style.overflow = "visible"
    }
})), document.addEventListener("DOMContentLoaded", (function () {
    var t = document.getElementsByClassName("btn-on")[0],
        e = document.getElementsByClassName("btn-on")[1],
        i = document.getElementsByClassName("btn-on")[2],
        n = document.getElementsByClassName("btn-on")[3],
        s = document.getElementsByClassName("btn-on")[4],
        o = document.getElementsByClassName("btn-on")[5],
        a = document.getElementsByClassName("btn-on")[6],
        l = document.getElementsByClassName("btn-on")[7],
        r = document.getElementsByClassName("btn-on")[8],
        d = document.getElementsByClassName("btn-on")[9],
        c = document.getElementsByClassName("btn-on")[10],
        m = document.getElementsByClassName("btn-on")[11],
        _ = document.getElementsByClassName("btn-on")[12],
        h = document.getElementsByClassName("btn-on")[13],
        u = document.getElementById("main-img"),
        f = document.getElementById("main-img1"),
        v = document.getElementById("main-img2"),
        y = document.getElementById("main-img3"),
        g = document.getElementById("main-img4"),
        E = document.getElementById("main-img5"),
        p = document.getElementById("main-img6");
    t.onclick = function () {
        u.style.content = "url(img/fistashki1.jpg)"
    }, e.onclick = function () {
        u.style.content = "url(img/7.jpeg)"
    }, i.onclick = function () {
        f.style.content = "url(img/Cosmo1.jpg)"
    }, n.onclick = function () {
        f.style.content = "url(img/8.jpeg)"
    }, s.onclick = function () {
        v.style.content = "url(img/3.jpeg)"
    }, o.onclick = function () {
        v.style.content = "url(img/4.jpeg)"
    }, a.onclick = function () {
        y.style.content = "url(img/1.jpeg)"
    }, l.onclick = function () {
        y.style.content = "url(img/2.jpeg)"
    }, r.onclick = function () {
        g.style.content = "url(img/9.jpeg)"
    }, d.onclick = function () {
        g.style.content = "url(img/10.jpeg)"
    }, c.onclick = function () {
        E.style.content = "url(img/5.jpeg)"
    }, m.onclick = function () {
        E.style.content = "url(img/6.jpeg)"
    }, _.onclick = function () {
        p.style.content = "url(img/cupcake.jpg)"
    }, h.onclick = function () {
        p.style.content = "url(img/11.jpeg)"
    }
})), document.addEventListener("DOMContentLoaded", (function () {
    var t = document.getElementById("main-img");
    t.onclick = function () {
        t.classList.toggle("open--img")
    }
}));