var options;

$(function() {
    setInputsEvents();
    $('#reset-button').bind('click', showResetDialog);
    hideDeviceOptions();
    loadOptions();
    //disableLocked();
    //enableLocked();
})

function isMobile() {
    return navigator.userAgent.match(/(android|iphone|ipad)/i);
}

function hideDeviceOptions() {
    $('.hide-on-' + (isMobile() ? 'mobile' : 'desktop')).hide();
}

function setInputsEvents() {
    var inputs = document.getElementsByTagName('input');
    for (var i in inputs) {
        if (!inputs.hasOwnProperty(i)) continue;

        var input = inputs[i];

        if (typeof input !== 'object') continue;

        if (input.type === 'range') {
            input.addEventListener('input',  rangeChanged);
        }

        input.addEventListener('change', saveOptions);
    }
}

function rangeChanged(ev) {
    var range   = ev.target;
    var valNode = document.getElementById( range.getAttribute('id') + '-val' );
    valNode.innerText = range.value;

    options[range.name] = range.value;
    updatePreview();
}

function updatePreview() {
    var preview = document.getElementsByClassName('preview')[0];

    var getImgUrl = typeof browser !== 'undefined' ?
        browser.extension.getURL :
        chrome.runtime.getURL;

    var style = {
        'opacity': ((100 - undInt(options.opacity))/100),
        'width':   options.size + 'px',
        'height':  options.size + 'px',
        'background-image': "url('" + getImgUrl("img/arrow-up.svg") + "')"
    };
    for (var s in style) if (style.hasOwnProperty(s)) preview.style[s] = style[s];

    var boder = 'none ' +
        (options.margin <= 0 || options.position.search('right')  === -1 ? 'none' : 'ridge') + ' ' +
        (options.margin <= 0 || options.position.search('bottom') === -1 ? 'none' : 'ridge') + ' ' +
        (options.margin <= 0 || options.position.search('left')   === -1 ? 'none' : 'ridge');
    $('.preview-container').css({
        'border-style': boder,
        'padding': options.margin
    });
}

function saveOptions() {
    updateOptionsFromInputs();
    updatePreview();
    undOptionsStorage.save(options);
    $('#apply-msg').show();
}

function loadOptions() {
    undOptionsStorage.load(updateOptionsInputs);
}

function updateOptionsFromInputs() {
    for(var o in options) {
        if (!options.hasOwnProperty(o)) continue;

        var els  = document.getElementsByName(o);
        if (!els.length) continue;

        for(var e in els) {
            if (!els.hasOwnProperty(e)) continue;

            var el = els[e];
            if (typeof el !== 'object') continue;

            if (el.type === 'radio') {
                if (el.checked) options[o] = el.value;
            } else {
                options[o] = el.value;
            }
        }
    }
}

function updateOptionsInputs(newOptions) {
    options = newOptions;
    for (var o in options) {
        if (!options.hasOwnProperty(o)) continue;

        var els = document.getElementsByName(o);
        var val = options[o];

        if (!els.length) continue;

        for(var e in els) {
            if (!els.hasOwnProperty(e)) continue;

            var el = els[e];
            if (typeof el !== 'object') continue;

            if (el.type === 'radio') {
                if (el.value === val) el.checked = true;
            } else {
                el.value = val;
                if (el.type === 'range') rangeChanged({target: el});
            }
        }
    }
    updatePreview();
}

function showResetDialog() {
    if (confirm("Reset all settings o default")) reset();
}

function reset() {
    var options = undOptionsStorage.getDefaultOptions();
    updateOptionsInputs(options);
    saveOptions();
}

/*function disableLocked() {
    $('.pro-line').addClass('locked-line');
    $('.locked-line input').prop("disabled", true);
    $('.locked-line').bind("click", showProLimit);
}

function enableLocked() {
    $('.locked-line input').prop("disabled", false);
    $('.locked-line').unbind("click");
    $('.pro-line').removeClass('locked-line');
}

function showProLimit() {
    alert('This is a Pro subscription feature. Please purchase a subscription to unlock');
}*/