﻿import { data } from "./data";
import { locs } from "./locs";

function nahr(v) {
    if (v == 'T') {
        return ' (náhradník)';
    } else {
        return '';
    };
};

function stalaDelegace(d) {
    if (d.length>0) {
        return '<b>stálá delegace:</b> ' + d + '<br>';
    } else {
        return '';
    }
};

function organizace(d) {
    if (d.length>0) {
        return '<b>organizace:</b> ' + d + '<br>';
    } else {
        return '';
    }
};

function shit(v) {
    if (v == '') {
        return '';
    } else {
        return ', ' + v;
    }
}

function makeTable(loc) {
    var tbl = ''
    Object.values(data[loc]).forEach(function(e) {
        tbl += '<br><p class="header_p"><b>' 
            +  e[0].mesto + ', ' +  e[0].zeme + '</b> (<a rel="noopener noreferrer" target="_blank" href="' + e[0].url + '">' 
            +  e[0].pobyt + '</a>)<br>'
            +  e[0].zduvodneni + '<br>'
            +  stalaDelegace(e[0].stala_delegace)
            +  organizace(e[0].organizace)
            + '<b>náklady poslanecké sněmovny:</b> ' +  e[0].naklady_PSP,
            + '</p><p><ul>'
        e.forEach(function(mp){
            tbl += '<li>'
            + mp['poslanec'] + nahr(mp['nahradnik'])
            + shit(mp['funkce'])
            + '</li>'
        });
    });
    tbl += '</ul></p>'
    document.getElementById('mps_list').innerHTML = tbl;
};

// colorize
var mps_vals = locs.map(function(v) {
    return v['mps'];
});
var colorScl = d3.scaleLinear()
    .domain([Math.min.apply(null, mps_vals),  Math.max.apply(null, mps_vals)])
    .range(['#fcbba1', '#ef3b2c', '#99000d'])
    .interpolate(d3.interpolateHcl);

locs.forEach(function(v) {
    v['color'] = colorScl(v['mps']);
});

Highcharts.mapChart('mapa', {
    chart: {
        map: 'custom/world'
    },
    title: {
        text: 'Zahraniční cesty poslanců v aktuálním volebním období'
    },
    credits: {
        enabled: false
    },
    subtitle: {
        text: 'kliknutím vyberte místo a zobrazte podrobný seznam poslaneckých delegací včetně zdůvodnění'
    },
    legend: {
        enabled: false
    },
    mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    tooltip: {
            formatter: function() {
                return '<b>' + this.point.name + '</b><br>'
                    + 'delegací: ' 
                    + this.point.trips 
                    + '<br>poslanců: ' 
                    + this.point.mps
            }
    },
    series: [{
        name: 'Countries',
        color: '#E0E0E0',
        enableMouseTracking: false
    }, {
        type: 'mappoint',
        cursor: 'pointer',
        name: 'Population 20dd16',
        data: locs,
        point: {
            fill: 'red',
            events: {
                click: function() {
                    makeTable(this.options.uid)
                }
            },
        },
    }]
});
