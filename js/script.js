import { data } from "./data";
import { locs } from "./locs";

function nahr(v) {
    if (v == 'T') {
        return ' (náhradník)';
    } else {
        return '';
    };
};

function makeTable(loc) {
    var tbl = '<table>'
    Object.values(data[loc]).forEach(function(e) {
        tbl += '<tr><th>' 
            +  e[0].mesto + ', ' +  e[0].zeme + ' (<a rel="noopener noreferrer" target="_blank" href="' + e[0].url + '">' 
            +  e[0].pobyt + '</a>)<br>'
            +  e[0].zduvodneni + '<br>'
            + 'PSP hradila: ' +  e[0].naklady_PSP,
            + '</th></tr>'
        e.forEach(function(mp){
            tbl += '<tr>'
            + '<td>' + mp['poslanec'] + nahr(mp['nahradnik']) 
            + ', ' + (mp['funkce'] || 'řadový poslanec') +  '</td>'
            + '</tr>'
        });
    });
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
        text: 'Zahraniční cesty poslanců v letech 2017 - 2019'
    },

    subtitle: {
        text: 'kliknutím vyberte místo'
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
                    + ' (poslanců celkem: ' 
                    + this.point.mps 
                    + ')'
            }
    },
    series: [{
        name: 'Countries',
        color: '#E0E0E0',
        enableMouseTracking: false
    }, {
        type: 'mappoint',
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
