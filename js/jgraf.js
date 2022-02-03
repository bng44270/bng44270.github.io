    /*

    JGraf SVG Graphing Library (ES6)

    Includes:

        - JGrafBar - Create Bar Graph
        - JGrafLine - Create Line Graph

    Usage:

        Create HTML tags
        <div id="linegr"></div>
        <div id="bargr"></div>

        // data structure:
        //  [
        //    {
        //        v:<numeric value to graph>,
        //        l:<label for graphed value>
        //    },
        //    {
        //        v:<numeric value to graph>,
        //        l:<label for graphed value>
        //    },
        //
        //    ...
        //  ]
        var data = [{v:100,l:'2009'},{v:400,l:'2010'},{v:300,l:'2011'}];

        //Draw Line Graph
        // Usage:
        //      JGrafLine(<height>,<width>,<axis-text-padding>,<X-axis-label>,<Y-axis-label>,<line-color>,<dot-color>,<data-array>,[<graph-color>])
        // <graph-color> - defaults to black if omitted
        var lgraph = new JGrafLine(300,300,30,'Year (2009-2011)','Business Growth (Million)','rgb(255,0,0)','rgb(0,0,255)',data,'rgb(0,255,0)');

        //Draw Bar Graph
        // Usage:
        //      JGrafBar(<height>,<width>,<axis-padding>,<X-axis-label>,<Y-axis-label>,<bar-color-array>,<data-array>,[<graph-color>])
        // <graph-color> - defaults to black if omitted
        
        var bgraph = new JGrafBar(300,300,30,'Year (2009-2011)','Business Growth (Million)',['rgb(255,0,0)','rgb(0,255,0)','rgb(0,0,255)'],data,'rgb(0,0,255)');

        //Render Graphs to DOM
        document.getElementById('bargr').innerHTML = bgraph.render();
        document.getElementById('linegr').innerHTML = lgraph.render();

        //Update Data
        var newData = [{v:430,l:'2012'},{v:230,l:'2013'},{v:190,l:'2014'}];

        lgraph.setXLabel('Year (2012-2014)');
        lgraph.setYLabel('Growth (million)');
        lgraph.setData(newData);
        bgraph.setXLabel('Year (2012-2014)');
        bgraph.setYLabel('Growth (million)');
        bgraph.setData(newData);

        //Re-render graphs
        document.getElementById('bargr').innerHTML = bgraph.render();
        document.getElementById('linegr').innerHTML = lgraph.render();

    */

    String.prototype.format = function(...arg) {
        var str = this;
        arg.forEach((v,i) => {
            var re = new RegExp('\\\{' + i.toString() + '\\\}','g');
            str = str.replace(re,v);
        });
        return str;
    };

    Array.prototype.sortDict = function(sk) {
        return [...this].sort((a,b) => {
            return (a[sk]<b[sk]) ? -1 : ((a[sk]>b[sk]) ? 1 : 0);
        });
    };

    Array.prototype.populate = function(l) {
        var tmp = [];
        while (true) {
            this.forEach(x => { tmp.push(x); });
            if (tmp.length >= l) break;
        }
        return tmp.slice(0,l);
    };

    class JGraf {
        constructor(h,w,pad,xl,yl,data,graphColor) {
            this.H = h;
            this.W = w;
            this.PAD = pad;
            this.XLabel = xl;
            this.YLabel = yl;
            this.DATA = this.transposeData(data);
            this.graphColor = (graphColor) ? graphColor : rgb(0,0,0);
        }

        setWidth(w) {
            this.W = w;
            this.DATA = this.transposeData(this.DATA);
        }

        setHeight(h) {
            this.H = h;
            this.DATA = this.transposeData(this.DATA);
        }

        setPadding(p) {
            this.PAD = p;
            this.DATA = this.transposeData(this.DATA);
        }

        setXLabel(l) {
            this.XLabel = l;
        }

        setYLabel(l) {
            this.YLabel = l;
        }

        setData(d) {
            this.DATA = this.transposeData(d);
        }

        transposeData(data) {
            var omax = data.sortDict('v')[data.length-1]['v']+100;

            return data.map(x => {
                return {v:parseInt((x.v*this.H)/omax),l:x.l,ov:x.v}; 
            });
        }

        get(content) {
            var svg = '<svg height="{0}" width="{1}">'.format((this.H + this.PAD).toString(),(this.W + this.PAD).toString());
            svg += '<!-- Draw Axes -->';
            svg += '<line x1="30" y1="{1}" x2="{0}" y2="{1}" style="stroke:{2};stroke-width:2px"></line>'.format(this.W.toString(),this.H.toString(),this.graphColor);
            svg += '<line x1="30" y1="30" x2="30" y2="{0}" style="stroke:{1};stroke-width:2px"></line>'.format(this.H.toString(),this.graphColor);
            svg += '<text x="{0}" y="{1}" style="fill:{3};" text-anchor="middle" transform="rotate(270,{0},{1})">{2}</text>'.format((this.PAD/2).toString(),(this.H/2).toString(),this.YLabel,this.graphColor);
            svg += '<text x="{0}" y="{1}" style="fill:{3};" text-anchor="middle">{2}</text>'.format((this.W/2).toString(),(this.H+this.PAD).toString(),this.XLabel,this.graphColor);
            svg += content;
            svg += '</svg>';

            return svg;
        }
    }

    class JGrafBar extends JGraf {
        constructor(h,w,pad,xl,yl,colors,data,grC) {
            super(h,w,pad,xl,yl,data,grC);

            this.colors = colors.populate(this.DATA.length);
        }

        render() {
            var bars = this.getBars();
            return this.get(bars);
        }

        setColors(colors) {
            this.colors = colors.populate(this.DATA.length);
        }

        getBars() {
            var svg = '';
            var barPos = this.PAD;
            var barW = parseInt((this.W-barPos)/this.DATA.length);
            svg += '<!-- Draw Bars -->';
            this.DATA.forEach((x,i) => {
                var barH = parseInt((x.v/this.H)*this.H);
                svg += '<rect x="{0}" y="{1}" height="{2}" width="{3}" style="fill:{4};stroke:black;"><title>{5} : {6}</title></rect>'.format(barPos.toString(),(this.H-barH).toString(),barH.toString(),barW.toString(),this.colors[i],x.l,x.ov);
                barPos += barW;
            });

            return svg;
        }
    }

    class JGrafLine extends JGraf {
        constructor(h,w,pad,xl,yl,lineColor,dotColor,data,grC) {
            super(h,w,pad,xl,yl,data,grC);

            this.lineColor = lineColor;
            this.dotColor = dotColor;
        }

        render() {
            var line = this.getLine();
            return this.get(line);
        }

        setLineColor(color) {
            this.lineColor = color;
        }

        setDotColor(color) {
            this.dotColor = color;
        }

        getLine() {
            var svg = '';
            var linePos = this.PAD;
            var lineStep = this.W/(data.length-1)

            svg += '<!-- Draw Bars -->';
            for (var i = 1; i < this.DATA.length; i++) {
                if (i == (this.DATA.length-1)) {
                    svg += '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" style="stroke:{4};stroke-width:2px"></line>'.format(linePos.toString(),(this.H-this.DATA[i-1].v).toString(),(linePos+lineStep-this.PAD).toString(),(this.H-this.DATA[i].v).toString(),this.lineColor);
                }
                else {
                    svg += '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" style="stroke:{4};stroke-width:2px"></line>'.format(linePos.toString(),(this.H-this.DATA[i-1].v).toString(),(linePos+lineStep).toString(),(this.H-this.DATA[i].v).toString(),this.lineColor);
                }

                svg += '<circle cx="{0}" cy="{1}" r="{5}" style="fill:{4}"><title>{2}: {3}</title></circle>'.format(linePos,(this.H-this.DATA[i-1].v).toString(),this.DATA[i-1].l,this.DATA[i-1].ov.toString(),this.dotColor,parseInt(this.PAD/5).toString());
                linePos += lineStep;
            }

            svg += svg += '<circle cx="{0}" cy="{1}" r="{5}" style="fill:{4}"><title>{2}: {3}</title></circle>'.format((linePos-this.PAD).toString(),(this.H-this.DATA[this.DATA.length-1].v).toString(),this.DATA[this.DATA.length-1].l,this.DATA[this.DATA.length-1].ov.toString(),this.dotColor,parseInt(this.PAD/5).toString());

            return svg;
        }
    }
