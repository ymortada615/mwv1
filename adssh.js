

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
